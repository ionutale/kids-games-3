<script lang="ts">
	import { onDestroy } from 'svelte';
	import { page } from '$app/state';
	import { getLocale, localizeHref, locales } from '#lib/paraglide/runtime.js';
	import { m } from '#lib/paraglide/messages.js';
	import type { ColorId, ShapeId } from '#lib/color-shapes.js';
	import type { FruitId } from '#lib/count-fruit.js';
	import { hintStage, isLevelOpen } from '#lib/count-fruit.js';
	import type { EmotionId } from '#lib/feelings.js';
	import { WORDS, type WordLocale } from '#lib/letters.js';
	import {
		MAX_READ_LEVEL,
		READ_ROUNDS,
		getReadLevel,
		makeRounds,
		type ReadKind,
		type ReadRound
	} from '#lib/read-word.js';
	import { clearLevel, loadProgress, saveProgress } from '#lib/progress.js';
	import BunnyFace from '#lib/components/BunnyFace.svelte';
	import Confetti from '#lib/components/Confetti.svelte';
	import FruitArt from '#lib/components/FruitArt.svelte';
	import ShapeArt from '#lib/components/ShapeArt.svelte';
	import { playSfx } from '#lib/sound.js';

	const IDLE_MS = 20000;
	const PAUSE_MS = 900;

	let rounds = $state<ReadRound[] | null>(null);
	let roundIndex = $state(0);
	let pips = $state<boolean[]>([false, false, false]);
	let misses = $state(0);
	let manualHints = $state(0);
	let idleHint = $state(false);
	let feedback = $state<'correct' | 'wrong' | null>(null);
	let wrongValue = $state<string | null>(null);
	let won = $state(false);
	let decided = $state(false);
	let unlocked = $state(true);
	let syncedLevel = $state(0);
	let alive = true;

	let idleTimer: ReturnType<typeof setTimeout> | null = null;
	let pauseTimer: ReturnType<typeof setTimeout> | null = null;

	const levelNumber = $derived(Number.parseInt(page.params.level ?? '', 10));
	const config = $derived(getReadLevel(levelNumber));
	const current = $derived(rounds !== null ? (rounds[roundIndex] ?? null) : null);
	const stage = $derived(hintStage(misses, manualHints, idleHint));

	const locale = $derived(getLocale() as (typeof locales)[number]);
	const pathHref = $derived(localizeHref('/play/read-word', { locale }));
	const nextHref = $derived(localizeHref(`/play/read-word/${levelNumber + 1}`, { locale }));
	const words = $derived(
		(key: string) => (m as unknown as Record<string, () => string>)[key]?.() ?? ''
	);

	function titleWord(text: string): string {
		return text ? text.charAt(0).toLocaleUpperCase(locale) + text.slice(1) : text;
	}

	function wordFor(kind: ReadKind, key: string): string {
		if (kind === 'fruit') return WORDS[locale as WordLocale][key as FruitId] ?? key;
		if (kind === 'shape') return titleWord(words(`shape_${key}`));
		return titleWord(words(`emotion_${key}`));
	}

	function poke(): void {
		if (idleTimer) clearTimeout(idleTimer);
		if (won) return;
		idleTimer = setTimeout(() => {
			idleHint = true;
		}, IDLE_MS);
	}

	function startRound(): void {
		misses = 0;
		manualHints = 0;
		idleHint = false;
		poke();
	}

	function startLevel(): void {
		if (!config) return;
		rounds = makeRounds(config);
		roundIndex = 0;
		pips = Array.from({ length: READ_ROUNDS }, () => false);
		feedback = null;
		wrongValue = null;
		won = false;
		startRound();
	}

	function syncLevel(): void {
		if (!config) return;
		if (idleTimer) clearTimeout(idleTimer);
		if (pauseTimer) clearTimeout(pauseTimer);
		alive = true;
		rounds = null;
		roundIndex = 0;
		pips = [false, false, false];
		misses = 0;
		manualHints = 0;
		idleHint = false;
		feedback = null;
		wrongValue = null;
		won = false;
		const cleared = loadProgress(localStorage)['read-word'].cleared;
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
		if (won || rounds === null) return;
		manualHints += 1;
		poke();
	}

	function answer(value: string): void {
		if (won || rounds === null || current === null || feedback === 'correct') return;
		poke();
		const snapshot = rounds;
		if (value === current.answer) {
			feedback = 'correct';
			playSfx('correct');
			wrongValue = null;
			pips = pips.map((done, index) => (index === roundIndex ? true : done));
			if (pauseTimer) clearTimeout(pauseTimer);
			pauseTimer = setTimeout(() => {
				if (!alive || !snapshot) return;
				feedback = null;
				if (roundIndex + 1 >= snapshot.length) {
					won = true;
					playSfx('win');
					if (idleTimer) clearTimeout(idleTimer);
					const progress = loadProgress(localStorage);
					clearLevel(progress, 'read-word', levelNumber);
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
	<title>Lumi — {config ? m.level({ n: levelNumber }) : m.read_name()}</title>
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
			{#if current}
				<p class="prompt read-word">{wordFor(current.kind, current.answer)}</p>
				<p class="hands-pick">{m.read_tap()}</p>
			{/if}
			<div class="pips" aria-hidden="true">
				{#each pips as done, index (index)}
					<span class="pip" class:full={done}></span>
				{/each}
			</div>
			{#if current}
				<div class="answers" class:hint-pulse={stage === 1}>
					{#each current.options as option (option)}
						<button
							class="figure-btn"
							class:glow={stage === 2 && option === current.answer}
							class:shake={feedback === 'wrong' && option === wrongValue}
							type="button"
							disabled={feedback === 'correct'}
							aria-label={wordFor(current.kind, option)}
							onclick={() => answer(option)}
						>
							{#if current.kind === 'fruit'}
								<FruitArt
									fruit={option as FruitId}
									happy={feedback === 'correct' && option === current.answer}
								/>
							{:else if current.kind === 'shape'}
								<ShapeArt
									shape={option as ShapeId}
									color={'red' as ColorId}
									happy={feedback === 'correct' && option === current.answer}
								/>
							{:else}
								<BunnyFace emotion={option as EmotionId} />
							{/if}
						</button>
					{/each}
				</div>
				<p class="feedback" class:good={feedback === 'correct'} class:retry={feedback === 'wrong'}>
					{#if feedback === 'correct'}{m.correctTap()}{:else if feedback === 'wrong'}{m.tryAgain()}{/if}
				</p>
				{#if stage >= 1}
					<div class="hint-box">
						{#if stage === 1}
							{m.read_hint()}
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
					<FruitArt fruit="apple" happy={true} />
				</div>
				<h2>{m.levelComplete()}</h2>
				<p class="cheer">{m.cheer()}</p>
				{#if levelNumber >= MAX_READ_LEVEL}
					<p>{m.finishGame()}</p>
				{/if}
				<div class="actions">
					{#if levelNumber < MAX_READ_LEVEL}
						<a class="btn" href={nextHref}>{m.nextLevel()}</a>
					{/if}
					<button class="btn secondary" type="button" onclick={startLevel}>{m.replay()}</button>
					<a class="btn ghost" href={pathHref}>{m.allLevels()}</a>
				</div>
			</div>
		{/if}
	</div>
{/if}
