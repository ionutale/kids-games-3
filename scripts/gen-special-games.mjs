#!/usr/bin/env node
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;

function writeGame(slug, list, level, entries) {
	const dir = join(root, `src/routes/play/${slug}`);
	mkdirSync(join(dir, '[level]'), { recursive: true });
	writeFileSync(join(dir, '+page.svelte'), list);
	writeFileSync(join(dir, '[level]/+page.svelte'), level);
	writeFileSync(join(dir, '[level]/+page.ts'), entries);
	console.log('wrote', slug);
}

function listTpl({ slug, mod, max, levels, name, artImport, thumb }) {
	return `<script lang="ts">
	import { onMount } from 'svelte';
	import { getLocale, localizeHref, locales } from '#lib/paraglide/runtime.js';
	import { m } from '#lib/paraglide/messages.js';
	import { isLevelOpen } from '#lib/count-fruit.js';
	import { ${max}, ${levels} } from '#lib/${mod}.js';
	import { loadProgress } from '#lib/progress.js';
	${artImport}

	let cleared = $state(0);
	const locale = $derived(getLocale() as (typeof locales)[number]);
	const homeHref = $derived(localizeHref('/', { locale }));
	const levelHref = $derived((level: number) => localizeHref(\`/play/${slug}/\${level}\`, { locale }));
	onMount(() => { cleared = loadProgress(localStorage)['${slug}'].cleared; });
</script>
<svelte:head><title>Lumi — {m.${name}()}</title></svelte:head>
<a class="btn back-link" href={homeHref}>← Lumi</a>
<div class="card">
	<h2 style="margin: 0; font-size: 2rem;">{m.${name}()}</h2>
	<p style="margin: 0.25rem 0 0; color: var(--ink-soft);">{m.chooseLevel()}</p>
	<ol class="level-path">
		{#each ${levels} as entry (entry.level)}
			{@const open = isLevelOpen(cleared, entry.level)}
			<li>
				<a class="level-tile" class:locked={!open} href={levelHref(entry.level)}
					aria-label={open ? m.level({ n: entry.level }) : \`\${m.level({ n: entry.level })} — \${m.locked()}\`}>
					{#if entry.level === cleared + 1 && cleared < ${max}}<span class="badge-new">{m.newLevel()}</span>{/if}
					{#if open}${thumb}{:else}<span class="lock" aria-hidden="true">🔒</span>{/if}
					<span>{m.level({ n: entry.level })}</span>
				</a>
			</li>
		{/each}
	</ol>
	{#if cleared >= ${max}}<p class="finish-banner">{m.finishGame()}</p>{/if}
</div>
`;
}

function entriesTpl(mod, levels) {
	return `import { ${levels} } from '#lib/${mod}.js';
export function entries() {
	return ${levels}.map((entry) => ({ level: String(entry.level) }));
}
`;
}

// --- same-number ---
writeGame(
	'same-number',
	listTpl({
		slug: 'same-number',
		mod: 'same-number',
		max: 'MAX_SAME_NUMBER_LEVEL',
		levels: 'SAME_NUMBER_LEVELS',
		name: 'samenum_name',
		artImport: `import FruitArt from '#lib/components/FruitArt.svelte';`,
		thumb: `<span class="samenum-thumb" aria-hidden="true"><FruitArt fruit="apple" /></span>`
	}),
	`<script lang="ts">
	import { onDestroy } from 'svelte';
	import { page } from '$app/state';
	import { getLocale, localizeHref, locales } from '#lib/paraglide/runtime.js';
	import { m } from '#lib/paraglide/messages.js';
	import { hintStage, isLevelOpen } from '#lib/count-fruit.js';
	import {
		MAX_SAME_NUMBER_LEVEL, SAME_NUMBER_ROUNDS, getSameNumberLevel, pickRounds,
		type SameNumberId, type SameNumberRound
	} from '#lib/same-number.js';
	import { clearLevel, loadProgress, saveProgress } from '#lib/progress.js';
	import Confetti from '#lib/components/Confetti.svelte';
	import FruitArt from '#lib/components/FruitArt.svelte';
	import { playSfx } from '#lib/sound.js';

	const IDLE_MS = 20000;
	const PAUSE_MS = 900;
	let rounds = $state<SameNumberRound[] | null>(null);
	let roundIndex = $state(0);
	let pips = $state<boolean[]>([false, false, false]);
	let misses = $state(0);
	let manualHints = $state(0);
	let idleHint = $state(false);
	let feedback = $state<'correct' | 'wrong' | null>(null);
	let wrongValue = $state<SameNumberId | null>(null);
	let won = $state(false);
	let decided = $state(false);
	let unlocked = $state(true);
	let syncedLevel = $state(0);
	let alive = true;
	let idleTimer: ReturnType<typeof setTimeout> | null = null;
	let pauseTimer: ReturnType<typeof setTimeout> | null = null;

	const levelNumber = $derived(Number.parseInt(page.params.level ?? '', 10));
	const config = $derived(getSameNumberLevel(levelNumber));
	const current = $derived(rounds !== null ? (rounds[roundIndex] ?? null) : null);
	const stage = $derived(hintStage(misses, manualHints, idleHint));
	const locale = $derived(getLocale() as (typeof locales)[number]);
	const pathHref = $derived(localizeHref('/play/same-number', { locale }));
	const nextHref = $derived(localizeHref(\`/play/same-number/\${levelNumber + 1}\`, { locale }));

	function labelFor(value: SameNumberId): string {
		return value === 'same' ? m.samenum_same() : m.samenum_different();
	}
	function poke(): void {
		if (idleTimer) clearTimeout(idleTimer);
		if (won) return;
		idleTimer = setTimeout(() => { idleHint = true; }, IDLE_MS);
	}
	function startRound(): void { misses = 0; manualHints = 0; idleHint = false; poke(); }
	function startLevel(): void {
		if (!config) return;
		rounds = pickRounds(config); roundIndex = 0;
		pips = Array.from({ length: SAME_NUMBER_ROUNDS }, () => false);
		feedback = null; wrongValue = null; won = false; startRound();
	}
	function syncLevel(): void {
		if (!config) return;
		if (idleTimer) clearTimeout(idleTimer);
		if (pauseTimer) clearTimeout(pauseTimer);
		alive = true; rounds = null; roundIndex = 0; pips = [false, false, false];
		misses = 0; manualHints = 0; idleHint = false; feedback = null; wrongValue = null; won = false;
		unlocked = isLevelOpen(loadProgress(localStorage)['same-number'].cleared, levelNumber);
		decided = true; if (unlocked) startLevel();
	}
	$effect(() => { if (config && syncedLevel !== levelNumber) { syncedLevel = levelNumber; syncLevel(); } });
	function askForHelp(): void { if (won || rounds === null) return; manualHints += 1; poke(); }
	function answer(value: SameNumberId): void {
		if (won || rounds === null || current === null || feedback === 'correct') return;
		poke();
		const snapshot = rounds;
		if (value === current.answer) {
			feedback = 'correct'; playSfx('correct'); wrongValue = null;
			pips = pips.map((done, index) => (index === roundIndex ? true : done));
			if (pauseTimer) clearTimeout(pauseTimer);
			pauseTimer = setTimeout(() => {
				if (!alive || !snapshot) return; feedback = null;
				if (roundIndex + 1 >= snapshot.length) {
					won = true; playSfx('win'); if (idleTimer) clearTimeout(idleTimer);
					const progress = loadProgress(localStorage);
					clearLevel(progress, 'same-number', levelNumber); saveProgress(progress, localStorage);
				} else { roundIndex += 1; startRound(); }
			}, PAUSE_MS);
		} else {
			misses += 1; wrongValue = value; feedback = 'wrong'; playSfx('wrong');
			if (pauseTimer) clearTimeout(pauseTimer);
			pauseTimer = setTimeout(() => { if (!alive) return; feedback = null; wrongValue = null; }, PAUSE_MS);
		}
	}
	onDestroy(() => { alive = false; if (idleTimer) clearTimeout(idleTimer); if (pauseTimer) clearTimeout(pauseTimer); });
</script>
<svelte:head><title>Lumi — {config ? m.level({ n: levelNumber }) : m.samenum_name()}</title></svelte:head>
{#if !config}
	<a class="btn back-link" href={pathHref}>← {m.allLevels()}</a><div class="card"><p>{m.invalidLevel()}</p></div>
{:else if !decided}
	<a class="btn back-link" href={pathHref}>← {m.allLevels()}</a><div class="card"><p class="prompt">…</p></div>
{:else if !unlocked}
	<a class="btn back-link" href={pathHref}>← {m.allLevels()}</a>
	<div class="card win"><div class="win-art" aria-hidden="true"><span style="font-size: 3.5rem;">🔒</span></div>
		<h2>{m.level({ n: levelNumber })} — {m.locked()}</h2>
		<p class="cheer">{m.lockedDetail({ n: levelNumber - 1 })}</p>
		<div class="actions"><a class="btn back-link" href={pathHref}>{m.allLevels()}</a></div></div>
{:else}
	<a class="btn back-link" href={pathHref}>← {m.allLevels()}</a>
	<div class="card">
		{#if !won}
			<div class="game-top"><h2 style="margin: 0; font-size: 1.8rem;">{m.level({ n: levelNumber })}</h2>
				<button class="help-btn" type="button" onclick={askForHelp}>? {m.help()}</button></div>
			<p class="prompt">{m.samenum_prompt()}</p>
			<div class="pips" aria-hidden="true">{#each pips as done, index (index)}<span class="pip" class:full={done}></span>{/each}</div>
			{#if current}
				<div class="samenum-stage" class:hint-pulse={stage === 1} aria-hidden="true">
					<div class="compare-pile"><!-- left -->
						{#each Array.from({ length: current.left }, (_, i) => i) as i (i)}
							<FruitArt fruit="apple" />
						{/each}
					</div>
					<div class="compare-pile">
						{#each Array.from({ length: current.right }, (_, i) => i) as i (i)}
							<FruitArt fruit="apple" />
						{/each}
					</div>
				</div>
				<div class="answers">
					{#each current.options as option (option)}
						<button class="answer-btn word" class:glow={stage === 2 && option === current.answer}
							class:shake={feedback === 'wrong' && option === wrongValue} type="button"
							disabled={feedback === 'correct'} onclick={() => answer(option)}>{labelFor(option)}</button>
					{/each}
				</div>
				<p class="feedback" class:good={feedback === 'correct'} class:retry={feedback === 'wrong'}>
					{#if feedback === 'correct'}{m.correctTap()}{:else if feedback === 'wrong'}{m.tryAgain()}{/if}
				</p>
				{#if stage >= 1}<div class="hint-box">{#if stage === 1}{m.samenum_hint()}{:else}{m.shapes_hint_this()}{/if}</div>{/if}
			{/if}
		{:else}
			<Confetti />
			<div class="win"><div class="win-art"><FruitArt fruit="apple" happy={true} /></div>
				<h2>{m.levelComplete()}</h2><p class="cheer">{m.cheer()}</p>
				{#if levelNumber >= MAX_SAME_NUMBER_LEVEL}<p>{m.finishGame()}</p>{/if}
				<div class="actions">
					{#if levelNumber < MAX_SAME_NUMBER_LEVEL}<a class="btn" href={nextHref}>{m.nextLevel()}</a>{/if}
					<button class="btn secondary" type="button" onclick={startLevel}>{m.replay()}</button>
					<a class="btn back-link" href={pathHref}>{m.allLevels()}</a>
				</div>
			</div>
		{/if}
	</div>
{/if}
`,
	entriesTpl('same-number', 'SAME_NUMBER_LEVELS')
);

// Generic number-answer games
function numberAnswerGame({
	slug, mod, Max, Rounds, Levels, Getter, RoundType, name, prompt, hint, stageHtml, winHtml, artImport, labelBody, askPrompt
}) {
	writeGame(
		slug,
		listTpl({
			slug, mod, max: Max, levels: Levels, name,
			artImport: artImport || '',
			thumb: `<span class="num-thumb" aria-hidden="true">10</span>`
		}),
		`<script lang="ts">
	import { onDestroy } from 'svelte';
	import { page } from '$app/state';
	import { getLocale, localizeHref, locales } from '#lib/paraglide/runtime.js';
	import { m } from '#lib/paraglide/messages.js';
	import { hintStage, isLevelOpen } from '#lib/count-fruit.js';
	import { ${Max}, ${Rounds}, ${Getter}, pickRounds, type ${RoundType} } from '#lib/${mod}.js';
	import { clearLevel, loadProgress, saveProgress } from '#lib/progress.js';
	import Confetti from '#lib/components/Confetti.svelte';
	import { playSfx } from '#lib/sound.js';
	${artImport || ''}

	const IDLE_MS = 20000; const PAUSE_MS = 900;
	let rounds = $state<${RoundType}[] | null>(null);
	let roundIndex = $state(0); let pips = $state<boolean[]>([false, false, false]);
	let misses = $state(0); let manualHints = $state(0); let idleHint = $state(false);
	let feedback = $state<'correct' | 'wrong' | null>(null);
	let wrongValue = $state<number | string | null>(null);
	let won = $state(false); let decided = $state(false); let unlocked = $state(true);
	let syncedLevel = $state(0); let alive = true;
	let idleTimer: ReturnType<typeof setTimeout> | null = null;
	let pauseTimer: ReturnType<typeof setTimeout> | null = null;
	const levelNumber = $derived(Number.parseInt(page.params.level ?? '', 10));
	const config = $derived(${Getter}(levelNumber));
	const current = $derived(rounds !== null ? (rounds[roundIndex] ?? null) : null);
	const stage = $derived(hintStage(misses, manualHints, idleHint));
	const locale = $derived(getLocale() as (typeof locales)[number]);
	const pathHref = $derived(localizeHref('/play/${slug}', { locale }));
	const nextHref = $derived(localizeHref(\`/play/${slug}/\${levelNumber + 1}\`, { locale }));
	${labelBody}
	function poke(): void { if (idleTimer) clearTimeout(idleTimer); if (won) return; idleTimer = setTimeout(() => { idleHint = true; }, IDLE_MS); }
	function startRound(): void { misses = 0; manualHints = 0; idleHint = false; poke(); }
	function startLevel(): void {
		if (!config) return; rounds = pickRounds(config); roundIndex = 0;
		pips = Array.from({ length: ${Rounds} }, () => false); feedback = null; wrongValue = null; won = false; startRound();
	}
	function syncLevel(): void {
		if (!config) return; if (idleTimer) clearTimeout(idleTimer); if (pauseTimer) clearTimeout(pauseTimer);
		alive = true; rounds = null; roundIndex = 0; pips = [false, false, false];
		misses = 0; manualHints = 0; idleHint = false; feedback = null; wrongValue = null; won = false;
		unlocked = isLevelOpen(loadProgress(localStorage)['${slug}'].cleared, levelNumber);
		decided = true; if (unlocked) startLevel();
	}
	$effect(() => { if (config && syncedLevel !== levelNumber) { syncedLevel = levelNumber; syncLevel(); } });
	function askForHelp(): void { if (won || rounds === null) return; manualHints += 1; poke(); }
	function answer(value: number | string): void {
		if (won || rounds === null || current === null || feedback === 'correct') return;
		poke(); const snapshot = rounds;
		if (value === current.answer) {
			feedback = 'correct'; playSfx('correct'); wrongValue = null;
			pips = pips.map((done, index) => (index === roundIndex ? true : done));
			if (pauseTimer) clearTimeout(pauseTimer);
			pauseTimer = setTimeout(() => {
				if (!alive || !snapshot) return; feedback = null;
				if (roundIndex + 1 >= snapshot.length) {
					won = true; playSfx('win'); if (idleTimer) clearTimeout(idleTimer);
					const progress = loadProgress(localStorage);
					clearLevel(progress, '${slug}', levelNumber); saveProgress(progress, localStorage);
				} else { roundIndex += 1; startRound(); }
			}, PAUSE_MS);
		} else {
			misses += 1; wrongValue = value; feedback = 'wrong'; playSfx('wrong');
			if (pauseTimer) clearTimeout(pauseTimer);
			pauseTimer = setTimeout(() => { if (!alive) return; feedback = null; wrongValue = null; }, PAUSE_MS);
		}
	}
	onDestroy(() => { alive = false; if (idleTimer) clearTimeout(idleTimer); if (pauseTimer) clearTimeout(pauseTimer); });
</script>
<svelte:head><title>Lumi — {config ? m.level({ n: levelNumber }) : m.${name}()}</title></svelte:head>
{#if !config}
	<a class="btn back-link" href={pathHref}>← {m.allLevels()}</a><div class="card"><p>{m.invalidLevel()}</p></div>
{:else if !decided}
	<a class="btn back-link" href={pathHref}>← {m.allLevels()}</a><div class="card"><p class="prompt">…</p></div>
{:else if !unlocked}
	<a class="btn back-link" href={pathHref}>← {m.allLevels()}</a>
	<div class="card win"><div class="win-art" aria-hidden="true"><span style="font-size: 3.5rem;">🔒</span></div>
		<h2>{m.level({ n: levelNumber })} — {m.locked()}</h2>
		<p class="cheer">{m.lockedDetail({ n: levelNumber - 1 })}</p>
		<div class="actions"><a class="btn back-link" href={pathHref}>{m.allLevels()}</a></div></div>
{:else}
	<a class="btn back-link" href={pathHref}>← {m.allLevels()}</a>
	<div class="card">
		{#if !won}
			<div class="game-top"><h2 style="margin: 0; font-size: 1.8rem;">{m.level({ n: levelNumber })}</h2>
				<button class="help-btn" type="button" onclick={askForHelp}>? {m.help()}</button></div>
			<p class="prompt">${askPrompt}</p>
			<div class="pips" aria-hidden="true">{#each pips as done, index (index)}<span class="pip" class:full={done}></span>{/each}</div>
			{#if current}
				${stageHtml}
				<div class="answers">
					{#each current.options as option (option)}
						<button class="answer-btn word" class:glow={stage === 2 && option === current.answer}
							class:shake={feedback === 'wrong' && option === wrongValue} type="button"
							disabled={feedback === 'correct'} onclick={() => answer(option)}>{option}</button>
					{/each}
				</div>
				<p class="feedback" class:good={feedback === 'correct'} class:retry={feedback === 'wrong'}>
					{#if feedback === 'correct'}{m.correctTap()}{:else if feedback === 'wrong'}{m.tryAgain()}{/if}
				</p>
				{#if stage >= 1}<div class="hint-box">{#if stage === 1}{m.${hint}()}{:else}{m.shapes_hint_this()}{/if}</div>{/if}
			{/if}
		{:else}
			<Confetti />
			<div class="win"><div class="win-art">${winHtml}</div>
				<h2>{m.levelComplete()}</h2><p class="cheer">{m.cheer()}</p>
				{#if levelNumber >= ${Max}}<p>{m.finishGame()}</p>{/if}
				<div class="actions">
					{#if levelNumber < ${Max}}<a class="btn" href={nextHref}>{m.nextLevel()}</a>{/if}
					<button class="btn secondary" type="button" onclick={startLevel}>{m.replay()}</button>
					<a class="btn back-link" href={pathHref}>{m.allLevels()}</a>
				</div>
			</div>
		{/if}
	</div>
{/if}
`,
		entriesTpl(mod, Levels)
	);
}

numberAnswerGame({
	slug: 'make-ten',
	mod: 'make-ten',
	Max: 'MAX_MAKE_TEN_LEVEL',
	Rounds: 'MAKE_TEN_ROUNDS',
	Levels: 'MAKE_TEN_LEVELS',
	Getter: 'getMakeTenLevel',
	RoundType: 'MakeTenRound',
	name: 'maketen_name',
	prompt: 'maketen_prompt',
	hint: 'maketen_hint',
	askPrompt: '{m.maketen_prompt()}',
	stageHtml: `<div class="maketen-stage" class:hint-pulse={stage === 1} aria-hidden="true">
					<span class="maketen-shown">{current.shown}</span>
					<span class="maketen-plus">+</span>
					<span class="maketen-q">?</span>
					<span class="maketen-eq">= 10</span>
				</div>`,
	winHtml: `<span class="maketen-shown">10</span>`,
	labelBody: ''
});

numberAnswerGame({
	slug: 'num-before-after',
	mod: 'num-before-after',
	Max: 'MAX_NUM_BEFORE_AFTER_LEVEL',
	Rounds: 'NUM_BEFORE_AFTER_ROUNDS',
	Levels: 'NUM_BEFORE_AFTER_LEVELS',
	Getter: 'getNumBeforeAfterLevel',
	RoundType: 'NumBeforeAfterRound',
	name: 'numba_name',
	prompt: 'numba_prompt',
	hint: 'numba_hint',
	askPrompt: `{current.ask === 'before' ? m.numba_ask_before({ n: current.anchor }) : m.numba_ask_after({ n: current.anchor })}`,
	stageHtml: `<div class="numba-stage" class:hint-pulse={stage === 1} aria-hidden="true">
					<span class="numba-anchor">{current.anchor}</span>
				</div>`,
	winHtml: `<span class="numba-anchor">5</span>`,
	labelBody: ''
});

numberAnswerGame({
	slug: 'first-sound',
	mod: 'first-sound',
	Max: 'MAX_FIRST_SOUND_LEVEL',
	Rounds: 'FIRST_SOUND_ROUNDS',
	Levels: 'FIRST_SOUND_LEVELS',
	Getter: 'getFirstSoundLevel',
	RoundType: 'FirstSoundRound',
	name: 'firstsound_name',
	prompt: 'firstsound_prompt',
	hint: 'firstsound_hint',
	askPrompt: '{m.firstsound_prompt()}',
	artImport: `import FirstSoundArt from '#lib/components/FirstSoundArt.svelte';`,
	stageHtml: `<div class="firstsound-stage" class:hint-pulse={stage === 1} aria-hidden="true">
					<span class="firstsound-thumb big"><FirstSoundArt word={current.word} /></span>
				</div>`,
	winHtml: `<span class="firstsound-thumb big"><FirstSoundArt word="sun" /></span>`,
	labelBody: ''
});

// Fix first-sound list page art
writeFileSync(
	join(root, 'src/routes/play/first-sound/+page.svelte'),
	listTpl({
		slug: 'first-sound',
		mod: 'first-sound',
		max: 'MAX_FIRST_SOUND_LEVEL',
		levels: 'FIRST_SOUND_LEVELS',
		name: 'firstsound_name',
		artImport: `import FirstSoundArt from '#lib/components/FirstSoundArt.svelte';`,
		thumb: `<span class="firstsound-thumb" aria-hidden="true"><FirstSoundArt word="sun" /></span>`
	})
);

console.log('special games done');
