<script lang="ts">
	import { onDestroy } from 'svelte';
	import { page } from '$app/state';
	import { getLocale, localizeHref, locales } from '#lib/paraglide/runtime.js';
	import { m } from '#lib/paraglide/messages.js';
	import { hintStage, isLevelOpen } from '#lib/count-fruit.js';
	import {
		MAX_RHYME_LEVEL,
		RHYME_ROUNDS,
		getRhymeLevel,
		pickRounds,
		type RhymeLocale,
		type RhymeRound,
		type RhymeWord
	} from '#lib/rhyme.js';
	import { clearLevel, loadProgress, saveProgress } from '#lib/progress.js';
	import Confetti from '#lib/components/Confetti.svelte';
	import { playSfx } from '#lib/sound.js';

	const IDLE_MS = 20000;
	const PAUSE_MS = 900;

	let rounds = $state<RhymeRound[] | null>(null);
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
	let syncedLocale = $state('');
	let alive = true;

	let idleTimer: ReturnType<typeof setTimeout> | null = null;
	let pauseTimer: ReturnType<typeof setTimeout> | null = null;

	const levelNumber = $derived(Number.parseInt(page.params.level ?? '', 10));
	const config = $derived(getRhymeLevel(levelNumber));
	const current = $derived(rounds !== null ? (rounds[roundIndex] ?? null) : null);
	const stage = $derived(hintStage(misses, manualHints, idleHint));

	const locale = $derived(getLocale() as (typeof locales)[number]);
	const pathHref = $derived(localizeHref('/play/rhyme', { locale }));
	const nextHref = $derived(localizeHref(`/play/rhyme/${levelNumber + 1}`, { locale }));

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
		rounds = pickRounds(locale as RhymeLocale, config);
		roundIndex = 0;
		pips = Array.from({ length: RHYME_ROUNDS }, () => false);
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
		const cleared = loadProgress(localStorage).rhyme.cleared;
		unlocked = isLevelOpen(cleared, levelNumber);
		decided = true;
		if (unlocked) startLevel();
	}

	$effect(() => {
		if (config && (syncedLevel !== levelNumber || syncedLocale !== locale)) {
			syncedLevel = levelNumber;
			syncedLocale = locale;
			syncLevel();
		}
	});

	function askForHelp(): void {
		if (won || rounds === null) return;
		manualHints += 1;
		poke();
	}

	function answer(word: RhymeWord): void {
		if (won || rounds === null || current === null || feedback === 'correct') return;
		poke();
		const snapshot = rounds;
		if (word.word === current.answer.word) {
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
					clearLevel(progress, 'rhyme', levelNumber);
					saveProgress(progress, localStorage);
				} else {
					roundIndex += 1;
					startRound();
				}
			}, PAUSE_MS);
		} else {
			misses += 1;
			wrongValue = word.word;
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

{#snippet rhymeFace(word: RhymeWord)}
	<span class="rhyme-face">
		<span class="rhyme-picture" aria-hidden="true">{word.picture}</span>
		<span class="rhyme-word">{word.word}</span>
	</span>
{/snippet}

<svelte:head>
	<title>Lumi — {config ? m.level({ n: levelNumber }) : m.rhyme_name()}</title>
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
			<p class="prompt">{m.rhyme_prompt()}</p>
			<div class="pips" aria-hidden="true">
				{#each pips as done, index (index)}
					<span class="pip" class:full={done}></span>
				{/each}
			</div>
			{#if current}
				<div class="rhyme-prompt" class:hint-pulse={stage === 1} aria-hidden="true">
					{@render rhymeFace(current.prompt)}
				</div>
				<div class="answers">
					{#each current.options as option (option.word)}
						<button
							class="figure-btn rhyme-btn"
							class:glow={stage === 2 && option.word === current.answer.word}
							class:shake={feedback === 'wrong' && option.word === wrongValue}
							type="button"
							disabled={feedback === 'correct'}
							aria-label={option.word}
							onclick={() => answer(option)}
						>
							{@render rhymeFace(option)}
						</button>
					{/each}
				</div>
				<p class="feedback" class:good={feedback === 'correct'} class:retry={feedback === 'wrong'}>
					{#if feedback === 'correct'}{m.correctTap()}{:else if feedback === 'wrong'}{m.tryAgain()}{/if}
				</p>
				{#if stage >= 1}
					<div class="hint-box">
						{#if stage === 1}
							{m.rhyme_hint()}
						{:else}
							{m.shapes_hint_this()}
						{/if}
					</div>
				{/if}
			{/if}
		{:else}
			<Confetti />
			<div class="win">
				<div class="win-art"><span class="tile-letter" aria-hidden="true">🐱</span></div>
				<h2>{m.levelComplete()}</h2>
				<p class="cheer">{m.cheer()}</p>
				{#if levelNumber >= MAX_RHYME_LEVEL}
					<p>{m.finishGame()}</p>
				{/if}
				<div class="actions">
					{#if levelNumber < MAX_RHYME_LEVEL}
						<a class="btn" href={nextHref}>{m.nextLevel()}</a>
					{/if}
					<button class="btn secondary" type="button" onclick={startLevel}>{m.replay()}</button>
					<a class="btn ghost" href={pathHref}>{m.allLevels()}</a>
				</div>
			</div>
		{/if}
	</div>
{/if}
