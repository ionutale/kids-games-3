<script lang="ts">
	import { onDestroy } from 'svelte';
	import { page } from '$app/state';
	import { getLocale, localizeHref, locales } from '#lib/paraglide/runtime.js';
	import { m } from '#lib/paraglide/messages.js';
	import {
		MAX_LEVEL,
		getLevel,
		hintStage,
		isLevelOpen,
		makeOptions,
		pickCounts,
		scatterPositions
	} from '#lib/count-fruit.js';
	import { clearLevel, loadProgress, saveProgress } from '#lib/progress.js';
	import FruitArt from '#lib/components/FruitArt.svelte';
	import Confetti from '#lib/components/Confetti.svelte';
	import { playSfx } from '#lib/sound.js';

	const IDLE_MS = 20000;
	const PAUSE_MS = 900;

	let counts = $state<number[] | null>(null);
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
	let alive = true;

	let idleTimer: ReturnType<typeof setTimeout> | null = null;
	let pauseTimer: ReturnType<typeof setTimeout> | null = null;

	const levelNumber = $derived(Number.parseInt(page.params.level ?? '', 10));
	const config = $derived(getLevel(levelNumber));
	const current = $derived(counts !== null ? (counts[roundIndex] ?? null) : null);
	const stage = $derived(hintStage(misses, manualHints, idleHint));
	const spots = $derived(
		config && current !== null && config.layout !== 'row'
			? scatterPositions(current, levelNumber * 100 + roundIndex, config.overlap)
			: []
	);

	const locale = $derived(getLocale() as (typeof locales)[number]);
	const pathHref = $derived(localizeHref('/play/count-fruit', { locale }));
	const nextHref = $derived(localizeHref(`/play/count-fruit/${levelNumber + 1}`, { locale }));

	const prompts = {
		apple: () => m.prompt_apple(),
		pear: () => m.prompt_pear(),
		orange: () => m.prompt_orange(),
		banana: () => m.prompt_banana(),
		grapes: () => m.prompt_grapes(),
		strawberry: () => m.prompt_strawberry(),
		lemon: () => m.prompt_lemon(),
		cherry: () => m.prompt_cherry(),
		peach: () => m.prompt_peach(),
		watermelon: () => m.prompt_watermelon()
	};
	const prompt = $derived(config ? prompts[config.fruit]() : '');

	function poke(): void {
		if (idleTimer) clearTimeout(idleTimer);
		if (won) return;
		idleTimer = setTimeout(() => {
			idleHint = true;
		}, IDLE_MS);
	}

	function startRound(): void {
		if (!config || counts === null || current === null) return;
		options = makeOptions(config, current);
		misses = 0;
		manualHints = 0;
		idleHint = false;
		poke();
	}

	function startLevel(): void {
		if (!config) return;
		counts = pickCounts(config);
		roundIndex = 0;
		pips = [false, false, false];
		feedback = null;
		wrongValue = null;
		fruitHappy = false;
		won = false;
		startRound();
	}

	function askForHelp(): void {
		if (won || counts === null) return;
		manualHints += 1;
		poke();
	}

	function answer(value: number): void {
		if (won || counts === null || current === null || feedback === 'correct') return;
		poke();
		const snapshot = counts;
		if (value === current) {
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
					clearLevel(progress, 'count-fruit', levelNumber);
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

	// SvelteKit reuses this page component when moving between levels,
	// so reset explicitly whenever the level param changes.
	let syncedLevel = $state(0);

	function syncLevel(): void {
		if (!config) return;
		if (idleTimer) clearTimeout(idleTimer);
		if (pauseTimer) clearTimeout(pauseTimer);
		alive = true;
		counts = null;
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
		const cleared = loadProgress(localStorage)['count-fruit'].cleared;
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

	onDestroy(() => {
		alive = false;
		if (idleTimer) clearTimeout(idleTimer);
		if (pauseTimer) clearTimeout(pauseTimer);
	});
</script>

<svelte:head>
	<title>Lumi — {config ? m.level({ n: levelNumber }) : m.game_name()}</title>
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
		<div class="fruit-board" aria-hidden="true"></div>
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

			<p class="prompt">{prompt}</p>
			<div class="pips" aria-hidden="true">
				{#each pips as done, index (index)}
					<span class="pip" class:full={done}></span>
				{/each}
			</div>

			{#if counts !== null && current !== null}
				<div
					class="fruit-board"
					class:tall={config.layout === 'scatter'}
					class:hint-pulse={stage === 1}
					aria-hidden="true"
				>
					{#if config.layout === 'row'}
						<div class="fruit-row">
							{#each Array.from({ length: current }, (_, i) => i) as i (i)}
								<FruitArt fruit={config.fruit} happy={fruitHappy} />
							{/each}
						</div>
					{:else}
						{#each spots as spot, i (i)}
							<span
								class="fruit-spot"
								style={`left: ${spot.x}%; top: ${spot.y}%; transform: translate(-50%, -50%) scale(${spot.size}) rotate(${spot.tilt}deg);`}
							>
								<FruitArt fruit={config.fruit} happy={fruitHappy} />
							</span>
						{/each}
					{/if}
				</div>

				<p class="feedback" class:good={feedback === 'correct'} class:retry={feedback === 'wrong'}>
					{#if feedback === 'correct'}{m.correctTap()}{:else if feedback === 'wrong'}{m.tryAgain()}{/if}
				</p>

				<div class="answers">
					{#each options as option (option)}
						<button
							class="answer-btn"
							class:glow={stage === 2 && option === current}
							class:shake={feedback === 'wrong' && option === wrongValue}
							type="button"
							disabled={feedback === 'correct'}
							onclick={() => answer(option)}
						>
							{option}
						</button>
					{/each}
				</div>
				<p class="feedback" style="font-size: 1.1rem; color: var(--ink-soft);">{m.tapNumber()}</p>

				{#if stage >= 1}
					<div class="hint-box">
						{#if stage === 1}
							{m.hint1()}
						{:else}
							{m.hint2({ count: current })}
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
				{#if levelNumber >= MAX_LEVEL}
					<p>{m.finishGame()}</p>
				{/if}
				<div class="actions">
					{#if levelNumber < MAX_LEVEL}
						<a class="btn" href={nextHref}>{m.nextLevel()}</a>
					{/if}
					<button class="btn secondary" type="button" onclick={startLevel}>{m.replay()}</button>
					<a class="btn ghost" href={pathHref}>{m.allLevels()}</a>
				</div>
			</div>
		{/if}
	</div>
{/if}
