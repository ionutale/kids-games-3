<script lang="ts">
	import { onDestroy } from 'svelte';
	import { page } from '$app/state';
	import { getLocale, localizeHref, locales } from '#lib/paraglide/runtime.js';
	import { m } from '#lib/paraglide/messages.js';
	import { hintStage, isLevelOpen } from '#lib/count-fruit.js';
	import {
		MAX_WORD_OR_PICTURE_LEVEL,
		WORD_OR_PICTURE_ROUNDS,
		getWordOrPictureLevel,
		pickRounds,
		type WopItem,
		type WordOrPictureRound
	} from '#lib/word-or-picture.js';
	import { clearLevel, loadProgress, saveProgress } from '#lib/progress.js';
	import Confetti from '#lib/components/Confetti.svelte';
	import KindArt from '#lib/components/KindArt.svelte';
	import type { KindFaceId } from '#lib/sort-kind.js';
	import { playSfx } from '#lib/sound.js';

	const IDLE_MS = 20000;
	const PAUSE_MS = 900;

	let rounds = $state<WordOrPictureRound[] | null>(null);
	let roundIndex = $state(0);
	let pips = $state<boolean[]>([false, false, false]);
	let misses = $state(0);
	let manualHints = $state(0);
	let idleHint = $state(false);
	let feedback = $state<'correct' | 'wrong' | null>(null);
	let wrongValue = $state<WopItem | null>(null);
	let won = $state(false);
	let decided = $state(false);
	let unlocked = $state(true);
	let syncedLevel = $state(0);
	let alive = true;
	let idleTimer: ReturnType<typeof setTimeout> | null = null;
	let pauseTimer: ReturnType<typeof setTimeout> | null = null;

	const levelNumber = $derived(Number.parseInt(page.params.level ?? '', 10));
	const config = $derived(getWordOrPictureLevel(levelNumber));
	const current = $derived(rounds !== null ? (rounds[roundIndex] ?? null) : null);
	const stage = $derived(hintStage(misses, manualHints, idleHint));
	const locale = $derived(getLocale() as (typeof locales)[number]);
	const pathHref = $derived(localizeHref('/play/word-or-picture', { locale }));
	const nextHref = $derived(localizeHref(`/play/word-or-picture/${levelNumber + 1}`, { locale }));

	function face(item: WopItem): KindFaceId {
		if (item === 'sun' || item === 'cup') return 'apple';
		return item;
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
		pips = Array.from({ length: WORD_OR_PICTURE_ROUNDS }, () => false);
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
		unlocked = isLevelOpen(loadProgress(localStorage)['word-or-picture'].cleared, levelNumber);
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
	function answer(value: WopItem): void {
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
					clearLevel(progress, 'word-or-picture', levelNumber);
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
	<title>Lumi — {config ? m.level({ n: levelNumber }) : m.wop_name()}</title>
</svelte:head>

{#if !config}
	<a class="btn back-link" href={pathHref}>← {m.allLevels()}</a>
	<div class="card"><p>{m.invalidLevel()}</p></div>
{:else if !decided}
	<a class="btn back-link" href={pathHref}>← {m.allLevels()}</a>
	<div class="card"><p class="prompt">…</p></div>
{:else if !unlocked}
	<a class="btn back-link" href={pathHref}>← {m.allLevels()}</a>
	<div class="card win"><h2>{m.locked()}</h2></div>
{:else}
	<a class="btn back-link" href={pathHref}>← {m.allLevels()}</a>
	<div class="card">
		{#if !won}
			<div class="game-top">
				<h2 style="margin: 0; font-size: 1.8rem;">{m.level({ n: levelNumber })}</h2>
				<button class="help-btn" type="button" onclick={askForHelp}>? {m.help()}</button>
			</div>
			<p class="prompt">
				{current?.mode === 'word-to-pic' ? m.wop_prompt_word() : m.wop_prompt_pic()}
			</p>
			<div class="pips" aria-hidden="true">
				{#each pips as done, index (index)}
					<span class="pip" class:full={done}></span>
				{/each}
			</div>
			{#if current}
				<div class="batch25-stage" class:hint-pulse={stage === 1}>
					{#if current.mode === 'word-to-pic'}
						<span class="maketen-shown">{current.item}</span>
					{:else}
						<KindArt face={face(current.item)} />
					{/if}
				</div>
				<div class="answers">
					{#each current.options as option (option)}
						<button
							class="answer-btn word"
							class:glow={stage === 2 && option === current.answer}
							class:shake={feedback === 'wrong' && option === wrongValue}
							type="button"
							disabled={feedback === 'correct'}
							onclick={() => answer(option)}
						>
							{#if current.mode === 'word-to-pic'}
								<KindArt face={face(option)} />
							{:else}
								{option}
							{/if}
						</button>
					{/each}
				</div>
				<p class="feedback" class:good={feedback === 'correct'} class:retry={feedback === 'wrong'}>
					{#if feedback === 'correct'}{m.correctTap()}{:else if feedback === 'wrong'}{m.tryAgain()}{/if}
				</p>
				{#if stage >= 1}
					<div class="hint-box">
						{#if stage === 1}{m.wop_hint()}{:else}{m.shapes_hint_this()}{/if}
					</div>
				{/if}
			{/if}
		{:else}
			<Confetti />
			<div class="win">
				<h2>{m.levelComplete()}</h2>
				<div class="actions">
					{#if levelNumber < MAX_WORD_OR_PICTURE_LEVEL}
						<a class="btn" href={nextHref}>{m.nextLevel()}</a>
					{/if}
					<button class="btn secondary" type="button" onclick={startLevel}>{m.replay()}</button>
					<a class="btn back-link" href={pathHref}>{m.allLevels()}</a>
				</div>
			</div>
		{/if}
	</div>
{/if}
