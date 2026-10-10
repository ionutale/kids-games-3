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
		MAX_ODD_LEVEL,
		ODD_ROUNDS,
		getOddLevel,
		isOddCard,
		makeBoards,
		type OddBoard,
		type OddCard
	} from '#lib/odd-one.js';
	import { clearLevel, loadProgress, saveProgress } from '#lib/progress.js';
	import BunnyFace from '#lib/components/BunnyFace.svelte';
	import Confetti from '#lib/components/Confetti.svelte';
	import FruitArt from '#lib/components/FruitArt.svelte';
	import ShapeArt from '#lib/components/ShapeArt.svelte';
	import { playSfx } from '#lib/sound.js';

	const IDLE_MS = 20000;
	const PAUSE_MS = 900;

	let boards = $state<OddBoard[] | null>(null);
	let roundIndex = $state(0);
	let pips = $state<boolean[]>([false, false, false]);
	let misses = $state(0);
	let manualHints = $state(0);
	let idleHint = $state(false);
	let feedback = $state<'correct' | 'wrong' | null>(null);
	let wrongId = $state<string | null>(null);
	let won = $state(false);
	let decided = $state(false);
	let unlocked = $state(true);
	let syncedLevel = $state(0);
	let alive = true;

	let idleTimer: ReturnType<typeof setTimeout> | null = null;
	let pauseTimer: ReturnType<typeof setTimeout> | null = null;

	const levelNumber = $derived(Number.parseInt(page.params.level ?? '', 10));
	const config = $derived(getOddLevel(levelNumber));
	const board = $derived(boards !== null ? (boards[roundIndex] ?? null) : null);
	const stage = $derived(hintStage(misses, manualHints, idleHint));

	const locale = $derived(getLocale() as (typeof locales)[number]);
	const pathHref = $derived(localizeHref('/play/odd-one', { locale }));
	const nextHref = $derived(localizeHref(`/play/odd-one/${levelNumber + 1}`, { locale }));
	const words = $derived(
		(key: string) => (m as unknown as Record<string, () => string>)[key]?.() ?? ''
	);

	function labelFor(card: OddCard, current: OddBoard): string {
		if (current.kind === 'fruit')
			return WORDS[locale as WordLocale][card.key as FruitId] ?? card.key;
		if (current.kind === 'color') return words(`color_${card.key}`);
		if (current.kind === 'shape') return words(`shape_${card.key}`);
		return words(`emotion_${card.key}`);
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
		boards = makeBoards(config);
		roundIndex = 0;
		pips = Array.from({ length: ODD_ROUNDS }, () => false);
		feedback = null;
		wrongId = null;
		won = false;
		startRound();
	}

	function syncLevel(): void {
		if (!config) return;
		if (idleTimer) clearTimeout(idleTimer);
		if (pauseTimer) clearTimeout(pauseTimer);
		alive = true;
		boards = null;
		roundIndex = 0;
		pips = [false, false, false];
		misses = 0;
		manualHints = 0;
		idleHint = false;
		feedback = null;
		wrongId = null;
		won = false;
		const cleared = loadProgress(localStorage)['odd-one'].cleared;
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
		if (won || boards === null) return;
		manualHints += 1;
		poke();
	}

	function answer(card: OddCard): void {
		if (won || boards === null || board === null || feedback === 'correct') return;
		poke();
		const snapshot = boards;
		if (isOddCard(board, card)) {
			feedback = 'correct';
			playSfx('correct');
			wrongId = null;
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
					clearLevel(progress, 'odd-one', levelNumber);
					saveProgress(progress, localStorage);
				} else {
					roundIndex += 1;
					startRound();
				}
			}, PAUSE_MS);
		} else {
			misses += 1;
			wrongId = card.id;
			feedback = 'wrong';
			playSfx('wrong');
			if (pauseTimer) clearTimeout(pauseTimer);
			pauseTimer = setTimeout(() => {
				if (!alive) return;
				feedback = null;
				wrongId = null;
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
	<title>Lumi — {config ? m.level({ n: levelNumber }) : m.odd_name()}</title>
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

			<p class="prompt">{m.odd_prompt()}</p>
			<div class="pips" aria-hidden="true">
				{#each pips as done, index (index)}
					<span class="pip" class:full={done}></span>
				{/each}
			</div>

			{#if board}
				<div class="answers quad" class:hint-pulse={stage === 1}>
					{#each board.cards as card (card.id)}
						<button
							class="figure-btn"
							class:glow={stage === 2 && isOddCard(board, card)}
							class:shake={feedback === 'wrong' && card.id === wrongId}
							type="button"
							disabled={feedback === 'correct'}
							onclick={() => answer(card)}
							aria-label={labelFor(card, board)}
						>
							{#if board.kind === 'fruit'}
								<FruitArt
									fruit={card.key as FruitId}
									happy={feedback === 'correct' && isOddCard(board, card)}
								/>
							{:else if board.kind === 'color'}
								<ShapeArt
									shape={board.shape}
									color={card.key as ColorId}
									happy={feedback === 'correct' && isOddCard(board, card)}
								/>
							{:else if board.kind === 'shape'}
								<ShapeArt
									shape={card.key as ShapeId}
									color={board.color}
									happy={feedback === 'correct' && isOddCard(board, card)}
								/>
							{:else}
								<BunnyFace emotion={card.key as EmotionId} />
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
							{m.odd_hint()}
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
					<BunnyFace emotion="happy" />
				</div>
				<h2>{m.levelComplete()}</h2>
				<p class="cheer">{m.cheer()}</p>
				{#if levelNumber >= MAX_ODD_LEVEL}
					<p>{m.finishGame()}</p>
				{/if}
				<div class="actions">
					{#if levelNumber < MAX_ODD_LEVEL}
						<a class="btn" href={nextHref}>{m.nextLevel()}</a>
					{/if}
					<button class="btn secondary" type="button" onclick={startLevel}>{m.replay()}</button>
					<a class="btn ghost" href={pathHref}>{m.allLevels()}</a>
				</div>
			</div>
		{/if}
	</div>
{/if}
