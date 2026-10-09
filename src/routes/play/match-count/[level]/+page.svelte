<script lang="ts">
	import { onDestroy } from 'svelte';
	import { page } from '$app/state';
	import { getLocale, localizeHref, locales } from '#lib/paraglide/runtime.js';
	import { m } from '#lib/paraglide/messages.js';
	import { hintStage, isLevelOpen } from '#lib/count-fruit.js';
	import {
		MATCH_ROUNDS,
		MAX_MATCH_LEVEL,
		getMatchLevel,
		pickRounds,
		type MatchRound
	} from '#lib/match-count.js';
	import { clearLevel, loadProgress, saveProgress } from '#lib/progress.js';
	import Confetti from '#lib/components/Confetti.svelte';
	import FruitArt from '#lib/components/FruitArt.svelte';

	const IDLE_MS = 20000;
	const PAUSE_MS = 900;

	let rounds = $state<MatchRound[] | null>(null);
	let roundIndex = $state(0);
	let pips = $state<boolean[]>([false, false, false]);
	let misses = $state(0);
	let manualHints = $state(0);
	let idleHint = $state(false);
	let feedback = $state<'correct' | 'wrong' | null>(null);
	let wrongIndex = $state<number | null>(null);
	let won = $state(false);
	let decided = $state(false);
	let unlocked = $state(true);
	let syncedLevel = $state(0);
	let alive = true;

	let idleTimer: ReturnType<typeof setTimeout> | null = null;
	let pauseTimer: ReturnType<typeof setTimeout> | null = null;

	const levelNumber = $derived(Number.parseInt(page.params.level ?? '', 10));
	const config = $derived(getMatchLevel(levelNumber));
	const current = $derived(rounds !== null ? (rounds[roundIndex] ?? null) : null);
	const stage = $derived(hintStage(misses, manualHints, idleHint));

	const locale = $derived(getLocale() as (typeof locales)[number]);
	const pathHref = $derived(localizeHref('/play/match-count', { locale }));
	const nextHref = $derived(localizeHref(`/play/match-count/${levelNumber + 1}`, { locale }));

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
		rounds = pickRounds(config);
		roundIndex = 0;
		pips = Array.from({ length: MATCH_ROUNDS }, () => false);
		feedback = null;
		wrongIndex = null;
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
		wrongIndex = null;
		won = false;
		const cleared = loadProgress(localStorage)['match-count'].cleared;
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

	function answer(index: number): void {
		if (won || rounds === null || current === null || feedback === 'correct') return;
		poke();
		const snapshot = rounds;
		if (current.piles[index] === current.target) {
			feedback = 'correct';
			wrongIndex = null;
			pips = pips.map((done, pip) => (pip === roundIndex ? true : done));
			if (pauseTimer) clearTimeout(pauseTimer);
			pauseTimer = setTimeout(() => {
				if (!alive || !snapshot) return;
				feedback = null;
				if (roundIndex + 1 >= snapshot.length) {
					won = true;
					if (idleTimer) clearTimeout(idleTimer);
					const progress = loadProgress(localStorage);
					clearLevel(progress, 'match-count', levelNumber);
					saveProgress(progress, localStorage);
				} else {
					roundIndex += 1;
					startRound();
				}
			}, PAUSE_MS);
		} else {
			misses += 1;
			wrongIndex = index;
			feedback = 'wrong';
			if (pauseTimer) clearTimeout(pauseTimer);
			pauseTimer = setTimeout(() => {
				if (!alive) return;
				feedback = null;
				wrongIndex = null;
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
	<title>Lumi — {config ? m.level({ n: levelNumber }) : m.match_name()}</title>
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
				<p class="prompt read-word">{current.target}</p>
				<p class="hands-pick">{m.match_tap()}</p>
			{/if}
			<div class="pips" aria-hidden="true">
				{#each pips as done, index (index)}
					<span class="pip" class:full={done}></span>
				{/each}
			</div>
			{#if current}
				<div class="match-row" class:two={current.piles.length === 2}>
					{#each current.piles as count, index (index)}
						<button
							class="order-pile"
							class:glow={stage === 2 && count === current.target}
							class:shake={feedback === 'wrong' && index === wrongIndex}
							type="button"
							disabled={feedback === 'correct'}
							aria-label={String(count)}
							onclick={() => answer(index)}
						>
							{#each Array.from({ length: count }, (_, i) => i) as i (i)}
								<FruitArt
									fruit={config.fruit}
									happy={feedback === 'correct' && count === current.target}
								/>
							{/each}
						</button>
					{/each}
				</div>
				<p class="feedback" class:good={feedback === 'correct'} class:retry={feedback === 'wrong'}>
					{#if feedback === 'correct'}{m.correctTap()}{:else if feedback === 'wrong'}{m.tryAgain()}{/if}
				</p>
				{#if stage >= 1}
					<div class="hint-box">
						{#if stage === 1}
							{m.match_hint()}
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
				{#if levelNumber >= MAX_MATCH_LEVEL}
					<p>{m.finishGame()}</p>
				{/if}
				<div class="actions">
					{#if levelNumber < MAX_MATCH_LEVEL}
						<a class="btn" href={nextHref}>{m.nextLevel()}</a>
					{/if}
					<button class="btn secondary" type="button" onclick={startLevel}>{m.replay()}</button>
					<a class="btn ghost" href={pathHref}>{m.allLevels()}</a>
				</div>
			</div>
		{/if}
	</div>
{/if}
