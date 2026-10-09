<script lang="ts">
	import { onDestroy } from 'svelte';
	import { page } from '$app/state';
	import { getLocale, localizeHref, locales } from '#lib/paraglide/runtime.js';
	import { m } from '#lib/paraglide/messages.js';
	import {
		MAX_BRUSH_LEVEL,
		dealBrushSteps,
		getBrushLevel,
		isNextBrushStep,
		type ToothStepId
	} from '#lib/brush-teeth.js';
	import { hintStage, isLevelOpen } from '#lib/count-fruit.js';
	import { clearLevel, loadProgress, saveProgress } from '#lib/progress.js';
	import BrushArt from '#lib/components/BrushArt.svelte';
	import Confetti from '#lib/components/Confetti.svelte';

	const IDLE_MS = 20000;
	const PAUSE_MS = 700;

	let order = $state<ToothStepId[]>([]);
	let deck = $state<ToothStepId[]>([]);
	let placed = $state(0);
	let misses = $state(0);
	let manualHints = $state(0);
	let idleHint = $state(false);
	let feedback = $state<'correct' | 'wrong' | null>(null);
	let wrongValue = $state<ToothStepId | null>(null);
	let won = $state(false);
	let decided = $state(false);
	let unlocked = $state(true);
	let syncedLevel = $state(0);
	let alive = true;

	let idleTimer: ReturnType<typeof setTimeout> | null = null;
	let pauseTimer: ReturnType<typeof setTimeout> | null = null;

	const levelNumber = $derived(Number.parseInt(page.params.level ?? '', 10));
	const config = $derived(getBrushLevel(levelNumber));
	const stage = $derived(hintStage(misses, manualHints, idleHint));
	const expected = $derived(order[placed]);

	const locale = $derived(getLocale() as (typeof locales)[number]);
	const pathHref = $derived(localizeHref('/play/brush-teeth', { locale }));
	const nextHref = $derived(localizeHref(`/play/brush-teeth/${levelNumber + 1}`, { locale }));
	const words = $derived(
		(key: string) => (m as unknown as Record<string, () => string>)[key]?.() ?? ''
	);

	function poke(): void {
		if (idleTimer) clearTimeout(idleTimer);
		if (won) return;
		idleTimer = setTimeout(() => {
			idleHint = true;
		}, IDLE_MS);
	}

	function startLevel(): void {
		if (!config) return;
		order = [...config.steps];
		deck = dealBrushSteps(config.steps);
		placed = 0;
		misses = 0;
		manualHints = 0;
		idleHint = false;
		feedback = null;
		wrongValue = null;
		won = false;
		poke();
	}

	function syncLevel(): void {
		if (!config) return;
		if (idleTimer) clearTimeout(idleTimer);
		if (pauseTimer) clearTimeout(pauseTimer);
		alive = true;
		const cleared = loadProgress(localStorage)['brush-teeth'].cleared;
		unlocked = isLevelOpen(cleared, levelNumber);
		decided = true;
		if (unlocked) startLevel();
	}

	$effect(() => {
		if (config && syncedLevel !== levelNumber) {
			syncedLevel = levelNumber;
			syncLevel();
		}
	});

	function askForHelp(): void {
		if (won || order.length === 0) return;
		manualHints += 1;
		poke();
	}

	function answer(step: ToothStepId): void {
		if (won || feedback === 'correct') return;
		poke();
		if (isNextBrushStep(order, placed, step)) {
			feedback = 'correct';
			wrongValue = null;
			if (pauseTimer) clearTimeout(pauseTimer);
			pauseTimer = setTimeout(() => {
				if (!alive) return;
				feedback = null;
				placed += 1;
				deck = deck.filter((card) => card !== step);
				misses = 0;
				manualHints = 0;
				idleHint = false;
				if (placed >= order.length) {
					won = true;
					if (idleTimer) clearTimeout(idleTimer);
					const progress = loadProgress(localStorage);
					clearLevel(progress, 'brush-teeth', levelNumber);
					saveProgress(progress, localStorage);
				}
			}, PAUSE_MS);
		} else {
			misses += 1;
			wrongValue = step;
			feedback = 'wrong';
			if (pauseTimer) clearTimeout(pauseTimer);
			pauseTimer = setTimeout(() => {
				if (!alive) return;
				feedback = null;
				wrongValue = null;
			}, PAUSE_MS);
		}
	}

	onDestroy(() => {
		alive = false;
		if (idleTimer) clearTimeout(idleTimer);
		if (pauseTimer) clearTimeout(pauseTimer);
	});
</script>

<svelte:head>
	<title>Lumi — {config ? m.level({ n: levelNumber }) : m.brush_name()}</title>
</svelte:head>

{#if !config}
	<a class="back-link" href={pathHref}>← {m.allLevels()}</a>
	<div class="card">
		<p>{m.invalidLevel()}</p>
	</div>
{:else if !decided}
	<a class="back-link" href={pathHref}>← {m.allLevels()}</a>
	<div class="card">
		<p class="prompt">…</p>
	</div>
{:else if !unlocked}
	<a class="back-link" href={pathHref}>← {m.allLevels()}</a>
	<div class="card win">
		<div class="win-art" aria-hidden="true"><span style="font-size: 3.5rem;">🔒</span></div>
		<h2>{m.level({ n: levelNumber })} — {m.locked()}</h2>
		<p class="cheer">{m.lockedDetail({ n: levelNumber - 1 })}</p>
		<div class="actions">
			<a class="btn" href={pathHref}>{m.allLevels()}</a>
		</div>
	</div>
{:else}
	<a class="back-link" href={pathHref}>← {m.allLevels()}</a>
	<div class="card">
		{#if !won}
			<div class="game-top">
				<h2 style="margin: 0; font-size: 1.8rem;">{m.level({ n: levelNumber })}</h2>
				<button class="help-btn" type="button" onclick={askForHelp}>? {m.help()}</button>
			</div>
			<p class="prompt">{m.brush_prompt()}</p>
			<div class="pips" aria-hidden="true">
				{#each order as _, index (index)}
					<span class="pip" class:full={index < placed}></span>
				{/each}
			</div>
			{#if placed > 0}
				<ol class="done-row">
					{#each order.slice(0, placed) as step, index (step)}
						<li>
							<span class="done-n">{index + 1}</span>
							<BrushArt {step} />
						</li>
					{/each}
				</ol>
			{/if}
			<div class="answers">
				{#each deck as step (step)}
					<button
						class="figure-btn step-btn"
						class:glow={stage === 2 && step === expected}
						class:shake={feedback === 'wrong' && step === wrongValue}
						type="button"
						disabled={feedback === 'correct'}
						onclick={() => answer(step)}
						aria-label={words(`tooth_${step}`)}
					>
						<BrushArt {step} />
						<span>{words(`tooth_${step}`)}</span>
					</button>
				{/each}
			</div>
			<p class="feedback" class:good={feedback === 'correct'} class:retry={feedback === 'wrong'}>
				{#if feedback === 'correct'}{m.correctTap()}{:else if feedback === 'wrong'}{m.tryAgain()}{/if}
			</p>
			{#if stage >= 1}
				<div class="hint-box">
					{#if stage === 1}
						{expected === 'wet' ? m.brush_hint_first() : m.brush_hint_next()}
					{:else}
						{m.shapes_hint_this()}
					{/if}
				</div>
			{/if}
		{:else}
			<Confetti />
			<div class="win">
				<div class="win-art">
					<BrushArt step="rinse" />
				</div>
				<h2>{m.levelComplete()}</h2>
				<p class="cheer">{m.cheer()}</p>
				{#if levelNumber >= MAX_BRUSH_LEVEL}
					<p>{m.finishGame()}</p>
				{/if}
				<div class="actions">
					{#if levelNumber < MAX_BRUSH_LEVEL}
						<a class="btn" href={nextHref}>{m.nextLevel()}</a>
					{/if}
					<button class="btn secondary" type="button" onclick={startLevel}>{m.replay()}</button>
					<a class="btn ghost" href={pathHref}>{m.allLevels()}</a>
				</div>
			</div>
		{/if}
	</div>
{/if}
