<script lang="ts">
	import { onDestroy } from 'svelte';
	import { page } from '$app/state';
	import { getLocale, localizeHref, locales } from '#lib/paraglide/runtime.js';
	import { m } from '#lib/paraglide/messages.js';
	import { hintStage, isLevelOpen } from '#lib/count-fruit.js';
	import {
		MAX_SPELL_LEVEL,
		SPELL_ROUNDS,
		getSpellLevel,
		pickRounds,
		type SpellLocale,
		type SpellRound
	} from '#lib/spell-word.js';
	import { clearLevel, loadProgress, saveProgress } from '#lib/progress.js';
	import Confetti from '#lib/components/Confetti.svelte';
	import { playSfx } from '#lib/sound.js';

	const IDLE_MS = 20000;
	const PAUSE_MS = 900;

	let rounds = $state<SpellRound[] | null>(null);
	let roundIndex = $state(0);
	let pips = $state<boolean[]>([false, false, false]);
	let filled = $state<(string | null)[]>([]);
	let usedTray = $state<boolean[]>([]);
	let misses = $state(0);
	let manualHints = $state(0);
	let idleHint = $state(false);
	let feedback = $state<'correct' | 'wrong' | null>(null);
	let wrongSlot = $state<number | null>(null);
	let won = $state(false);
	let decided = $state(false);
	let unlocked = $state(true);
	let syncedLevel = $state(0);
	let alive = true;

	let idleTimer: ReturnType<typeof setTimeout> | null = null;
	let pauseTimer: ReturnType<typeof setTimeout> | null = null;

	const levelNumber = $derived(Number.parseInt(page.params.level ?? '', 10));
	const config = $derived(getSpellLevel(levelNumber));
	const current = $derived(rounds !== null ? (rounds[roundIndex] ?? null) : null);
	const stage = $derived(hintStage(misses, manualHints, idleHint));
	const nextSlot = $derived(filled.findIndex((ch) => ch === null));

	const locale = $derived(getLocale() as (typeof locales)[number]);
	const pathHref = $derived(localizeHref('/play/spell-word', { locale }));
	const nextHref = $derived(localizeHref(`/play/spell-word/${levelNumber + 1}`, { locale }));

	function poke(): void {
		if (idleTimer) clearTimeout(idleTimer);
		if (won) return;
		idleTimer = setTimeout(() => {
			idleHint = true;
		}, IDLE_MS);
	}

	function startRound(): void {
		if (!current) return;
		filled = Array.from({ length: current.letters.length }, () => null);
		usedTray = Array.from({ length: current.tray.length }, () => false);
		misses = 0;
		manualHints = 0;
		idleHint = false;
		feedback = null;
		wrongSlot = null;
		poke();
	}

	function startLevel(): void {
		if (!config) return;
		rounds = pickRounds(config, locale as SpellLocale);
		roundIndex = 0;
		pips = Array.from({ length: SPELL_ROUNDS }, () => false);
		won = false;
		filled = [];
		usedTray = [];
		// startRound needs current from rounds — set after assign
		const first = rounds[0];
		filled = Array.from({ length: first.letters.length }, () => null);
		usedTray = Array.from({ length: first.tray.length }, () => false);
		misses = 0;
		manualHints = 0;
		idleHint = false;
		feedback = null;
		wrongSlot = null;
		poke();
	}

	function syncLevel(): void {
		if (!config) return;
		if (idleTimer) clearTimeout(idleTimer);
		if (pauseTimer) clearTimeout(pauseTimer);
		alive = true;
		rounds = null;
		roundIndex = 0;
		pips = [false, false, false];
		won = false;
		const cleared = loadProgress(localStorage)['spell-word'].cleared;
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

	function placeLetter(trayIndex: number): void {
		if (won || !current || feedback === 'correct' || usedTray[trayIndex]) return;
		const slot = nextSlot;
		if (slot < 0) return;
		poke();
		const ch = current.tray[trayIndex];
		if (ch === current.letters[slot]) {
			const nextFilled = [...filled];
			nextFilled[slot] = ch;
			filled = nextFilled;
			const nextUsed = [...usedTray];
			nextUsed[trayIndex] = true;
			usedTray = nextUsed;
			feedback = 'correct';
			playSfx('place');
			wrongSlot = null;
			const done = nextFilled.every((value) => value !== null);
			if (done) {
				const snapshot = rounds;
				pips = pips.map((pip, index) => (index === roundIndex ? true : pip));
				if (pauseTimer) clearTimeout(pauseTimer);
				pauseTimer = setTimeout(() => {
					if (!alive || !snapshot) return;
					feedback = null;
					if (roundIndex + 1 >= snapshot.length) {
						won = true;
						playSfx('win');
						if (idleTimer) clearTimeout(idleTimer);
						const progress = loadProgress(localStorage);
						clearLevel(progress, 'spell-word', levelNumber);
						saveProgress(progress, localStorage);
					} else {
						roundIndex += 1;
						startRound();
					}
				}, PAUSE_MS);
			} else {
				if (pauseTimer) clearTimeout(pauseTimer);
				pauseTimer = setTimeout(() => {
					if (!alive) return;
					feedback = null;
				}, 400);
			}
		} else {
			misses += 1;
			wrongSlot = slot;
			feedback = 'wrong';
			playSfx('wrong');
			if (pauseTimer) clearTimeout(pauseTimer);
			pauseTimer = setTimeout(() => {
				if (!alive) return;
				feedback = null;
				wrongSlot = null;
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
	<title>Lumi — {config ? m.level({ n: levelNumber }) : m.spell_name()}</title>
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
			<p class="prompt">{m.spell_prompt()}</p>
			<div class="pips" aria-hidden="true">
				{#each pips as done, index (index)}
					<span class="pip" class:full={done}></span>
				{/each}
			</div>
			{#if current}
				<div class="spell-pic" class:hint-pulse={stage === 1} aria-hidden="true">
					{current.picture}
				</div>
				<div class="spell-slots" aria-label={m.spell_prompt()}>
					{#each current.letters as _letter, slot (slot)}
						<span
							class="spell-slot"
							class:open={filled[slot] === null}
							class:glow={stage >= 1 && slot === nextSlot}
							class:shake={feedback === 'wrong' && wrongSlot === slot}
						>
							{filled[slot] ?? '?'}
						</span>
					{/each}
				</div>
				<p class="hands-pick">{m.spell_tap()}</p>
				<div class="spell-tray">
					{#each current.tray as ch, index (index)}
						{#if !usedTray[index]}
							<button
								class="spell-chip"
								class:glow={stage === 2 &&
									nextSlot >= 0 &&
									ch === current.letters[nextSlot]}
								type="button"
								disabled={feedback === 'correct'}
								onclick={() => placeLetter(index)}
							>
								{ch}
							</button>
						{/if}
					{/each}
				</div>
				<p class="feedback" class:good={feedback === 'correct'} class:retry={feedback === 'wrong'}>
					{#if feedback === 'correct'}{m.correctTap()}{:else if feedback === 'wrong'}{m.tryAgain()}{/if}
				</p>
				{#if stage >= 1}
					<div class="hint-box">
						{#if stage === 1}
							{m.spell_hint()}
						{:else}
							{m.shapes_hint_this()}
						{/if}
					</div>
				{/if}
			{/if}
		{:else}
			<Confetti />
			<div class="win">
				<div class="win-art"><span class="spell-thumb big">abc</span></div>
				<h2>{m.levelComplete()}</h2>
				<p class="cheer">{m.cheer()}</p>
				{#if levelNumber >= MAX_SPELL_LEVEL}
					<p>{m.finishGame()}</p>
				{/if}
				<div class="actions">
					{#if levelNumber < MAX_SPELL_LEVEL}
						<a class="btn" href={nextHref}>{m.nextLevel()}</a>
					{/if}
					<button class="btn secondary" type="button" onclick={startLevel}>{m.replay()}</button>
					<a class="btn ghost" href={pathHref}>{m.allLevels()}</a>
				</div>
			</div>
		{/if}
	</div>
{/if}
