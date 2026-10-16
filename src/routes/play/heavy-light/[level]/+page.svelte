<script lang="ts">
	import { onDestroy } from 'svelte';
	import { page } from '$app/state';
	import { getLocale, localizeHref, locales } from '#lib/paraglide/runtime.js';
	import { m } from '#lib/paraglide/messages.js';
	import { hintStage, isLevelOpen } from '#lib/count-fruit.js';
	import {
		MAX_WEIGHT_LEVEL,
		WEIGHT_ROUNDS,
		correctSide,
		getWeightLevel,
		pickRounds,
		type WeightObjectId,
		type WeightRound,
		type WeightSide
	} from '#lib/heavy-light.js';
	import { clearLevel, loadProgress, saveProgress } from '#lib/progress.js';
	import Confetti from '#lib/components/Confetti.svelte';
	import WeightArt from '#lib/components/WeightArt.svelte';
	import ScaleArt from '#lib/components/ScaleArt.svelte';
	import { playSfx } from '#lib/sound.js';

	const IDLE_MS = 20000;
	const PAUSE_MS = 900;

	let rounds = $state<WeightRound[] | null>(null);
	let roundIndex = $state(0);
	let pips = $state<boolean[]>([false, false, false]);
	let misses = $state(0);
	let manualHints = $state(0);
	let idleHint = $state(false);
	let feedback = $state<'correct' | 'wrong' | null>(null);
	let wrongSide = $state<WeightSide | null>(null);
	let won = $state(false);
	let decided = $state(false);
	let unlocked = $state(true);
	let syncedLevel = $state(0);
	let alive = true;

	let idleTimer: ReturnType<typeof setTimeout> | null = null;
	let pauseTimer: ReturnType<typeof setTimeout> | null = null;

	const levelNumber = $derived(Number.parseInt(page.params.level ?? '', 10));
	const config = $derived(getWeightLevel(levelNumber));
	const current = $derived(rounds !== null ? (rounds[roundIndex] ?? null) : null);
	const stage = $derived(hintStage(misses, manualHints, idleHint));
	const answerSide = $derived(current && config ? correctSide(current, config.ask) : null);
	const heavySide = $derived(
		current
			? correctSide(current, 'heavy')
			: null
	);
	const scaleTip = $derived(
		feedback === 'correct' && heavySide
			? heavySide
			: stage >= 2 && heavySide
				? heavySide
				: 'none'
	);

	const locale = $derived(getLocale() as (typeof locales)[number]);
	const pathHref = $derived(localizeHref('/play/heavy-light', { locale }));
	const nextHref = $derived(localizeHref(`/play/heavy-light/${levelNumber + 1}`, { locale }));

	function labelFor(object: WeightObjectId): string {
		if (object === 'feather') return m.heavy_feather();
		if (object === 'balloon') return m.heavy_balloon();
		if (object === 'leaf') return m.heavy_leaf();
		if (object === 'cotton') return m.heavy_cotton();
		if (object === 'apple') return m.heavy_apple();
		if (object === 'book') return m.heavy_book();
		if (object === 'shoe') return m.heavy_shoe();
		if (object === 'rock') return m.heavy_rock();
		if (object === 'brick') return m.heavy_brick();
		return m.heavy_weight();
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
		rounds = pickRounds(config);
		roundIndex = 0;
		pips = Array.from({ length: WEIGHT_ROUNDS }, () => false);
		feedback = null;
		wrongSide = null;
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
		wrongSide = null;
		won = false;
		const cleared = loadProgress(localStorage)['heavy-light'].cleared;
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

	function answer(side: WeightSide): void {
		if (won || rounds === null || current === null || !config || feedback === 'correct') return;
		poke();
		const snapshot = rounds;
		if (side === correctSide(current, config.ask)) {
			feedback = 'correct';
			playSfx('correct');
			wrongSide = null;
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
					clearLevel(progress, 'heavy-light', levelNumber);
					saveProgress(progress, localStorage);
				} else {
					roundIndex += 1;
					startRound();
				}
			}, PAUSE_MS);
		} else {
			misses += 1;
			wrongSide = side;
			feedback = 'wrong';
			playSfx('wrong');
			if (pauseTimer) clearTimeout(pauseTimer);
			pauseTimer = setTimeout(() => {
				if (!alive) return;
				feedback = null;
				wrongSide = null;
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
	<title>Lumi — {config ? m.level({ n: levelNumber }) : m.heavy_name()}</title>
</svelte:head>

{#if !config}
	<a class="btn back-link" href={pathHref}>← {m.allLevels()}</a>
	<div class="card">
		<p>{m.invalidLevel()}</p>
	</div>
{:else if !decided}
	<a class="btn back-link" href={pathHref}>← {m.allLevels()}</a>
	<div class="card">
		<p class="prompt">…</p>
	</div>
{:else if !unlocked}
	<a class="btn back-link" href={pathHref}>← {m.allLevels()}</a>
	<div class="card win">
		<div class="win-art" aria-hidden="true"><span style="font-size: 3.5rem;">🔒</span></div>
		<h2>{m.level({ n: levelNumber })} — {m.locked()}</h2>
		<p class="cheer">{m.lockedDetail({ n: levelNumber - 1 })}</p>
		<div class="actions">
			<a class="btn back-link" href={pathHref}>{m.allLevels()}</a>
		</div>
	</div>
{:else}
	<a class="btn back-link" href={pathHref}>← {m.allLevels()}</a>
	<div class="card">
		{#if !won}
			<div class="game-top">
				<h2 style="margin: 0; font-size: 1.8rem;">{m.level({ n: levelNumber })}</h2>
				<button class="help-btn" type="button" onclick={askForHelp}>? {m.help()}</button>
			</div>
			<p class="prompt letters-ask">
				{#if config.ask === 'heavy'}
					{m.heavy_prompt_lead()}<strong>{m.heavy_prompt_word()}</strong>{m.heavy_prompt_tail()}
				{:else}
					{m.heavy_light_prompt_lead()}<strong>{m.heavy_light_prompt_word()}</strong
					>{m.heavy_light_prompt_tail()}
				{/if}
			</p>
			<div class="pips" aria-hidden="true">
				{#each pips as done, index (index)}
					<span class="pip" class:full={done}></span>
				{/each}
			</div>
			{#if current}
				<div class="scale-stage" class:hint-pulse={stage === 1} aria-hidden="true">
					<ScaleArt tip={scaleTip} />
				</div>
				<div class="compare-row heavy-row">
					{#each ['left', 'right'] as side, i (side)}
						{@const object = side === 'left' ? current.left : current.right}
						<button
							class="compare-pile heavy-pile"
							class:glow={stage === 2 && side === answerSide}
							class:shake={feedback === 'wrong' && side === wrongSide}
							type="button"
							disabled={feedback === 'correct'}
							aria-label={labelFor(object)}
							onclick={() => answer(side as WeightSide)}
						>
							<span class="weight-thumb big" aria-hidden="true">
								<WeightArt {object} i={i} />
							</span>
							<span class="heavy-label">{labelFor(object)}</span>
						</button>
					{/each}
				</div>
				<p class="feedback" class:good={feedback === 'correct'} class:retry={feedback === 'wrong'}>
					{#if feedback === 'correct'}{m.correctTap()}{:else if feedback === 'wrong'}{m.tryAgain()}{/if}
				</p>
				{#if stage >= 1}
					<div class="hint-box">
						{#if stage === 1}
							{m.heavy_hint()}
						{:else}
							{m.shapes_hint_this()}
						{/if}
					</div>
				{/if}
			{/if}
		{:else}
			<Confetti />
			<div class="win">
				<div class="win-art"><span class="weight-thumb big"><WeightArt object="rock" /></span></div>
				<h2>{m.levelComplete()}</h2>
				<p class="cheer">{m.cheer()}</p>
				{#if levelNumber >= MAX_WEIGHT_LEVEL}
					<p>{m.finishGame()}</p>
				{/if}
				<div class="actions">
					{#if levelNumber < MAX_WEIGHT_LEVEL}
						<a class="btn" href={nextHref}>{m.nextLevel()}</a>
					{/if}
					<button class="btn secondary" type="button" onclick={startLevel}>{m.replay()}</button>
					<a class="btn back-link" href={pathHref}>{m.allLevels()}</a>
				</div>
			</div>
		{/if}
	</div>
{/if}
