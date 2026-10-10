<script lang="ts">
	import { onDestroy } from 'svelte';
	import { page } from '$app/state';
	import { getLocale, localizeHref, locales } from '#lib/paraglide/runtime.js';
	import { m } from '#lib/paraglide/messages.js';
	import {
		MAX_SUBTRACT_LEVEL,
		SUBTRACT_ROUNDS_PER_LEVEL,
		getSubtractLevel,
		makeRemainOptions,
		pickDifferences,
		remainOf,
		type Difference
	} from '#lib/subtract.js';
	import { hintStage, isLevelOpen } from '#lib/count-fruit.js';
	import { clearLevel, loadProgress, saveProgress } from '#lib/progress.js';
	import FruitArt from '#lib/components/FruitArt.svelte';
	import Confetti from '#lib/components/Confetti.svelte';
	import { playSfx } from '#lib/sound.js';

	const IDLE_MS = 20000;
	const PAUSE_MS = 900;

	let problems = $state<Difference[] | null>(null);
	let roundIndex = $state(0);
	let pips = $state<boolean[]>([false, false, false]);
	let options = $state<number[]>([]);
	let misses = $state(0);
	let manualHints = $state(0);
	let idleHint = $state(false);
	let feedback = $state<'correct' | 'wrong' | null>(null);
	let wrongValue = $state<number | null>(null);
	let fruitHappy = $state(false);
	let won = $state(false);
	let decided = $state(false);
	let unlocked = $state(true);
	let syncedLevel = $state(0);
	let alive = true;

	let idleTimer: ReturnType<typeof setTimeout> | null = null;
	let pauseTimer: ReturnType<typeof setTimeout> | null = null;

	const levelNumber = $derived(Number.parseInt(page.params.level ?? '', 10));
	const config = $derived(getSubtractLevel(levelNumber));
	const current = $derived(problems !== null ? (problems[roundIndex] ?? null) : null);
	const stage = $derived(hintStage(misses, manualHints, idleHint));
	const answerRemain = $derived(current ? remainOf(current) : null);

	const locale = $derived(getLocale() as (typeof locales)[number]);
	const pathHref = $derived(localizeHref('/play/subtract', { locale }));
	const nextHref = $derived(localizeHref(`/play/subtract/${levelNumber + 1}`, { locale }));

	function poke(): void {
		if (idleTimer) clearTimeout(idleTimer);
		if (won) return;
		idleTimer = setTimeout(() => {
			idleHint = true;
		}, IDLE_MS);
	}

	function startRound(): void {
		if (!config || problems === null || current === null) return;
		options = makeRemainOptions(config, current);
		misses = 0;
		manualHints = 0;
		idleHint = false;
		poke();
	}

	function startLevel(): void {
		if (!config) return;
		problems = pickDifferences(config);
		roundIndex = 0;
		pips = Array.from({ length: SUBTRACT_ROUNDS_PER_LEVEL }, () => false);
		feedback = null;
		wrongValue = null;
		fruitHappy = false;
		won = false;
		startRound();
	}

	function syncLevel(): void {
		if (!config) return;
		if (idleTimer) clearTimeout(idleTimer);
		if (pauseTimer) clearTimeout(pauseTimer);
		alive = true;
		problems = null;
		roundIndex = 0;
		pips = [false, false, false];
		options = [];
		misses = 0;
		manualHints = 0;
		idleHint = false;
		feedback = null;
		wrongValue = null;
		fruitHappy = false;
		won = false;
		const cleared = loadProgress(localStorage)['subtract'].cleared;
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
		if (won || problems === null) return;
		manualHints += 1;
		poke();
	}

	function answer(value: number): void {
		if (won || problems === null || answerRemain === null || feedback === 'correct') return;
		poke();
		const snapshot = problems;
		if (value === answerRemain) {
			feedback = 'correct';
			playSfx('correct');
			wrongValue = null;
			fruitHappy = true;
			pips = pips.map((done, index) => (index === roundIndex ? true : done));
			if (pauseTimer) clearTimeout(pauseTimer);
			pauseTimer = setTimeout(() => {
				if (!alive || !snapshot) return;
				fruitHappy = false;
				feedback = null;
				if (roundIndex + 1 >= snapshot.length) {
					won = true;
					playSfx('win');
					if (idleTimer) clearTimeout(idleTimer);
					const progress = loadProgress(localStorage);
					clearLevel(progress, 'subtract', levelNumber);
					saveProgress(progress, localStorage);
				} else {
					roundIndex += 1;
					startRound();
				}
			}, PAUSE_MS);
		} else {
			misses += 1;
			wrongValue = value;
			feedback = 'wrong';
			playSfx('wrong');
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
	<title>Lumi — {config ? m.level({ n: levelNumber }) : m.subtract_name()}</title>
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
			<p class="prompt">{m.subtract_prompt()}</p>
			<div class="pips" aria-hidden="true">
				{#each pips as done, index (index)}
					<span class="pip" class:full={done}></span>
				{/each}
			</div>
			{#if problems !== null && current !== null}
				<div class="sum-row equation" class:hint-pulse={stage === 1} aria-hidden="true">
					<div class="pile">
						{#each Array.from({ length: current.start }, (_, i) => i) as i (i)}
							<FruitArt fruit={config.fruit} happy={fruitHappy} />
						{/each}
					</div>
					<span class="sum-plus">−</span>
					<div class="pile">
						{#each Array.from({ length: current.taken }, (_, i) => i) as i (i)}
							<FruitArt fruit={config.fruit} />
						{/each}
					</div>
					<span class="sum-plus">=</span>
					<div class="pile result">
						{#each Array.from({ length: answerRemain ?? 0 }, (_, i) => i) as i (i)}
							<FruitArt fruit={config.fruit} happy={fruitHappy} />
						{/each}
					</div>
				</div>
				<div class="answers">
					{#each options as option (option)}
						<button
							class="answer-btn"
							class:glow={stage === 2 && option === answerRemain}
							class:shake={feedback === 'wrong' && option === wrongValue}
							type="button"
							disabled={feedback === 'correct'}
							onclick={() => answer(option)}
						>
							{option}
						</button>
					{/each}
				</div>
				<p class="feedback" class:good={feedback === 'correct'} class:retry={feedback === 'wrong'}>
					{#if feedback === 'correct'}{m.correctTap()}{:else if feedback === 'wrong'}{m.tryAgain()}{/if}
				</p>
				{#if stage >= 1}
					<div class="hint-box">
						{#if stage === 1}
							{m.subtract_hint()}
						{:else}
							{m.shapes_hint_this()}
						{/if}
					</div>
				{/if}
			{/if}
		{:else}
			<Confetti />
			<div class="win">
				<div class="win-art">
					<FruitArt fruit={config.fruit} happy={true} />
				</div>
				<h2>{m.levelComplete()}</h2>
				<p class="cheer">{m.cheer()}</p>
				{#if levelNumber >= MAX_SUBTRACT_LEVEL}
					<p>{m.finishGame()}</p>
				{/if}
				<div class="actions">
					{#if levelNumber < MAX_SUBTRACT_LEVEL}
						<a class="btn" href={nextHref}>{m.nextLevel()}</a>
					{/if}
					<button class="btn secondary" type="button" onclick={startLevel}>{m.replay()}</button>
					<a class="btn ghost" href={pathHref}>{m.allLevels()}</a>
				</div>
			</div>
		{/if}
	</div>
{/if}
