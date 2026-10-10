<script lang="ts">
	import { onDestroy } from 'svelte';
	import { page } from '$app/state';
	import { getLocale, localizeHref, locales } from '#lib/paraglide/runtime.js';
	import { m } from '#lib/paraglide/messages.js';
	import { hintStage, isLevelOpen } from '#lib/count-fruit.js';
	import {
		MAX_OPP_LEVEL,
		OPP_ROUNDS,
		getOppLevel,
		makeRounds,
		type OppCard,
		type OppRound
	} from '#lib/opposites.js';
	import { clearLevel, loadProgress, saveProgress } from '#lib/progress.js';
	import BunnyFace from '#lib/components/BunnyFace.svelte';
	import Confetti from '#lib/components/Confetti.svelte';
	import FruitArt from '#lib/components/FruitArt.svelte';
	import OppositeArt from '#lib/components/OppositeArt.svelte';
	import { playSfx } from '#lib/sound.js';

	const IDLE_MS = 20000;
	const PAUSE_MS = 900;

	let rounds = $state<OppRound[] | null>(null);
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
	const config = $derived(getOppLevel(levelNumber));
	const current = $derived(rounds !== null ? (rounds[roundIndex] ?? null) : null);
	const stage = $derived(hintStage(misses, manualHints, idleHint));

	const locale = $derived(getLocale() as (typeof locales)[number]);
	const pathHref = $derived(localizeHref('/play/opposites', { locale }));
	const nextHref = $derived(localizeHref(`/play/opposites/${levelNumber + 1}`, { locale }));
	const words = $derived(
		(key: string) => (m as unknown as Record<string, () => string>)[key]?.() ?? ''
	);

	function labelFor(card: OppCard): string {
		if (card.kind === 'feeling') return words(`emotion_${card.emotion}`);
		if (card.kind === 'size') return words(`opp_${card.scale}`);
		if (card.kind === 'sky') return words(`opp_${card.sky}`);
		return words(`opp_${card.way}`);
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
		pips = Array.from({ length: OPP_ROUNDS }, () => false);
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
		rounds = null;
		roundIndex = 0;
		pips = [false, false, false];
		misses = 0;
		manualHints = 0;
		idleHint = false;
		feedback = null;
		wrongId = null;
		won = false;
		const cleared = loadProgress(localStorage)['opposites'].cleared;
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

	function answer(card: OppCard): void {
		if (won || rounds === null || current === null || feedback === 'correct') return;
		poke();
		const snapshot = rounds;
		if (card.id === current.answerId) {
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
					clearLevel(progress, 'opposites', levelNumber);
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

{#snippet picture(card: OppCard, happy: boolean)}
	{#if card.kind === 'feeling'}
		<BunnyFace emotion={card.emotion} />
	{:else if card.kind === 'size'}
		<span class="opp-size {card.scale}"><FruitArt fruit={card.fruit} {happy} /></span>
	{:else if card.kind === 'sky'}
		<OppositeArt sky={card.sky} />
	{:else}
		<OppositeArt way={card.way} />
	{/if}
{/snippet}

<svelte:head>
	<title>Lumi — {config ? m.level({ n: levelNumber }) : m.opp_name()}</title>
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
	<div class="card" class:opp-tight={config.tight}>
		{#if !won}
			<div class="game-top">
				<h2 style="margin: 0; font-size: 1.8rem;">{m.level({ n: levelNumber })}</h2>
				<button class="help-btn" type="button" onclick={askForHelp}>? {m.help()}</button>
			</div>
			<p class="prompt">{m.opp_prompt()}</p>
			<div class="pips" aria-hidden="true">
				{#each pips as done, index (index)}
					<span class="pip" class:full={done}></span>
				{/each}
			</div>
			{#if current}
				<div class="showcase" class:hint-pulse={stage === 1} aria-hidden="true">
					{@render picture(current.prompt, false)}
				</div>
				<div class="answers">
					{#each current.options as card (card.id)}
						<button
							class="figure-btn"
							class:glow={stage === 2 && card.id === current.answerId}
							class:shake={feedback === 'wrong' && card.id === wrongId}
							type="button"
							disabled={feedback === 'correct'}
							aria-label={labelFor(card)}
							onclick={() => answer(card)}
						>
							{@render picture(card, feedback === 'correct' && card.id === current.answerId)}
						</button>
					{/each}
				</div>
				<p class="feedback" class:good={feedback === 'correct'} class:retry={feedback === 'wrong'}>
					{#if feedback === 'correct'}{m.correctTap()}{:else if feedback === 'wrong'}{m.tryAgain()}{/if}
				</p>
				{#if stage >= 1}
					<div class="hint-box">
						{#if stage === 1}
							{m.opp_hint()}
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
				{#if levelNumber >= MAX_OPP_LEVEL}
					<p>{m.finishGame()}</p>
				{/if}
				<div class="actions">
					{#if levelNumber < MAX_OPP_LEVEL}
						<a class="btn" href={nextHref}>{m.nextLevel()}</a>
					{/if}
					<button class="btn secondary" type="button" onclick={startLevel}>{m.replay()}</button>
					<a class="btn ghost" href={pathHref}>{m.allLevels()}</a>
				</div>
			</div>
		{/if}
	</div>
{/if}
