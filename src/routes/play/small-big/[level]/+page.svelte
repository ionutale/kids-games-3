<script lang="ts">
	import { onDestroy } from 'svelte';
	import { page } from '$app/state';
	import { getLocale, localizeHref, locales } from '#lib/paraglide/runtime.js';
	import { m } from '#lib/paraglide/messages.js';
	import { hintStage, isLevelOpen } from '#lib/count-fruit.js';
	import {
		MAX_SMALL_BIG_LEVEL,
		SMALL_BIG_ROUNDS,
		getSmallBigLevel,
		isNextPile,
		pickRounds,
		type SmallBigRound
	} from '#lib/small-big.js';
	import { clearLevel, loadProgress, saveProgress } from '#lib/progress.js';
	import Confetti from '#lib/components/Confetti.svelte';
	import FruitArt from '#lib/components/FruitArt.svelte';
	import { playSfx } from '#lib/sound.js';

	const IDLE_MS = 20000;
	const PAUSE_MS = 700;

	let rounds = $state<SmallBigRound[] | null>(null);
	let roundIndex = $state(0);
	let pips = $state<boolean[]>([false, false, false]);
	let placed = $state<number[]>([]);
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
	const config = $derived(getSmallBigLevel(levelNumber));
	const current = $derived(rounds !== null ? (rounds[roundIndex] ?? null) : null);
	const stage = $derived(hintStage(misses, manualHints, idleHint));

	const locale = $derived(getLocale() as (typeof locales)[number]);
	const pathHref = $derived(localizeHref('/play/small-big', { locale }));
	const nextHref = $derived(localizeHref(`/play/small-big/${levelNumber + 1}`, { locale }));

	function rankOf(index: number): number | null {
		const at = placed.indexOf(index);
		return at === -1 ? null : at + 1;
	}

	function poke(): void {
		if (idleTimer) clearTimeout(idleTimer);
		if (won) return;
		idleTimer = setTimeout(() => {
			idleHint = true;
		}, IDLE_MS);
	}

	function startRound(): void {
		placed = [];
		misses = 0;
		manualHints = 0;
		idleHint = false;
		feedback = null;
		wrongIndex = null;
		poke();
	}

	function startLevel(): void {
		if (!config) return;
		rounds = pickRounds(config);
		roundIndex = 0;
		pips = Array.from({ length: SMALL_BIG_ROUNDS }, () => false);
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
		placed = [];
		misses = 0;
		manualHints = 0;
		idleHint = false;
		feedback = null;
		wrongIndex = null;
		won = false;
		const cleared = loadProgress(localStorage)['small-big'].cleared;
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
		if (placed.includes(index)) return;
		poke();
		const snapshot = rounds;
		if (isNextPile(current.counts, placed.length, index)) {
			feedback = 'correct';
			playSfx('correct');
			wrongIndex = null;
			const nextPlaced = [...placed, index];
			placed = nextPlaced;
			if (pauseTimer) clearTimeout(pauseTimer);
			pauseTimer = setTimeout(() => {
				if (!alive || !snapshot) return;
				feedback = null;
				if (nextPlaced.length >= current.counts.length) {
					pips = pips.map((done, pip) => (pip === roundIndex ? true : done));
					if (roundIndex + 1 >= snapshot.length) {
						won = true;
						playSfx('win');
						if (idleTimer) clearTimeout(idleTimer);
						const progress = loadProgress(localStorage);
						clearLevel(progress, 'small-big', levelNumber);
						saveProgress(progress, localStorage);
					} else {
						roundIndex += 1;
						startRound();
					}
				}
			}, PAUSE_MS);
		} else {
			misses += 1;
			wrongIndex = index;
			feedback = 'wrong';
			playSfx('wrong');
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
	<title>Lumi — {config ? m.level({ n: levelNumber }) : m.order_name()}</title>
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
			<p class="prompt">{m.order_prompt()}</p>
			<div class="pips" aria-hidden="true">
				{#each pips as done, index (index)}
					<span class="pip" class:full={done}></span>
				{/each}
			</div>
			{#if current}
				<div class="order-row">
					{#each current.counts as count, index (index)}
						{@const rank = rankOf(index)}
						<button
							class="order-pile"
							class:picked={rank !== null}
							class:glow={stage === 2 && isNextPile(current.counts, placed.length, index)}
							class:shake={feedback === 'wrong' && index === wrongIndex}
							type="button"
							disabled={rank !== null || feedback === 'correct'}
							aria-label={String(count)}
							onclick={() => answer(index)}
						>
							{#if rank !== null}
								<span class="order-n">{rank}</span>
							{/if}
							{#each Array.from({ length: count }, (_, i) => i) as i (i)}
								<FruitArt fruit={config.fruit} happy={rank !== null} />
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
							{m.order_hint()}
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
				{#if levelNumber >= MAX_SMALL_BIG_LEVEL}
					<p>{m.finishGame()}</p>
				{/if}
				<div class="actions">
					{#if levelNumber < MAX_SMALL_BIG_LEVEL}
						<a class="btn" href={nextHref}>{m.nextLevel()}</a>
					{/if}
					<button class="btn secondary" type="button" onclick={startLevel}>{m.replay()}</button>
					<a class="btn ghost" href={pathHref}>{m.allLevels()}</a>
				</div>
			</div>
		{/if}
	</div>
{/if}
