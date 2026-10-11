#!/usr/bin/env node
/**
 * Generate list + level routes for the 16-game batch from metadata.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;

const games = [
	{
		slug: 'plant-animal',
		mod: 'plant-animal',
		P: 'PlantAnimal',
		msg: 'plantani',
		progress: 'plant-animal',
		importExtras: `type PlantAnimalId, type PlantAnimalRound`,
		getter: 'getPlantAnimalLevel',
		max: 'MAX_PLANT_ANIMAL_LEVEL',
		rounds: 'PLANT_ANIMAL_ROUNDS',
		levels: 'PLANT_ANIMAL_LEVELS',
		answerType: 'PlantAnimalId',
		roundType: 'PlantAnimalRound',
		art: 'PlantAnimalArt',
		artProp: 'subject',
		artField: 'subject',
		thumbDefault: 'flower',
		labelFn: `return value === 'plant' ? m.plantani_plant() : m.plantani_animal();`,
		prompt: 'plantani_prompt',
		hint: 'plantani_hint',
		name: 'plantani_name',
		stageClass: 'plantani-stage',
		thumbClass: 'plantani-thumb'
	},
	{
		slug: 'sink-float',
		mod: 'sink-float',
		P: 'SinkFloat',
		msg: 'sinkfloat',
		progress: 'sink-float',
		importExtras: `type SinkFloatId, type SinkFloatRound`,
		getter: 'getSinkFloatLevel',
		max: 'MAX_SINK_FLOAT_LEVEL',
		rounds: 'SINK_FLOAT_ROUNDS',
		levels: 'SINK_FLOAT_LEVELS',
		answerType: 'SinkFloatId',
		roundType: 'SinkFloatRound',
		art: 'SinkFloatTank',
		artProp: 'object',
		artField: 'object',
		artExtra: `result={feedback === 'correct' ? current.answer : null}`,
		thumbDefault: 'leaf',
		labelFn: `return value === 'sink' ? m.sinkfloat_sink() : m.sinkfloat_float();`,
		prompt: 'sinkfloat_prompt',
		hint: 'sinkfloat_hint',
		name: 'sinkfloat_name',
		stageClass: 'sinkfloat-stage',
		thumbClass: 'sinkfloat-thumb',
		pauseMs: 1400,
		noThumbWrap: true
	},
	{
		slug: 'day-jobs',
		mod: 'day-jobs',
		P: 'DayJobs',
		msg: 'dayjobs',
		progress: 'day-jobs',
		importExtras: `type JobId, type DayJobsRound`,
		getter: 'getDayJobsLevel',
		max: 'MAX_DAY_JOBS_LEVEL',
		rounds: 'DAY_JOBS_ROUNDS',
		levels: 'DAY_JOBS_LEVELS',
		answerType: 'JobId',
		roundType: 'DayJobsRound',
		art: 'DayJobsArt',
		artProp: 'scene',
		artField: 'scene',
		thumbDefault: 'bandage',
		labelFn: `if (value === 'doctor') return m.dayjobs_doctor();\n\t\tif (value === 'teacher') return m.dayjobs_teacher();\n\t\tif (value === 'firefighter') return m.dayjobs_firefighter();\n\t\tif (value === 'cook') return m.dayjobs_cook();\n\t\tif (value === 'farmer') return m.dayjobs_farmer();\n\t\treturn m.dayjobs_builder();`,
		prompt: 'dayjobs_prompt',
		hint: 'dayjobs_hint',
		name: 'dayjobs_name',
		stageClass: 'dayjobs-stage',
		thumbClass: 'dayjobs-thumb'
	},
	{
		slug: 'recycle-sort',
		mod: 'recycle-sort',
		P: 'Recycle',
		msg: 'recycle',
		progress: 'recycle-sort',
		importExtras: `type BinId, type RecycleRound`,
		getter: 'getRecycleLevel',
		max: 'MAX_RECYCLE_LEVEL',
		rounds: 'RECYCLE_ROUNDS',
		levels: 'RECYCLE_LEVELS',
		answerType: 'BinId',
		roundType: 'RecycleRound',
		art: 'RecycleArt',
		artProp: 'item',
		artField: 'item',
		artExtra: `dropBin={feedback === 'correct' ? current.answer : null}`,
		thumbDefault: 'newspaper',
		labelFn: `if (value === 'paper') return m.recycle_paper();\n\t\tif (value === 'plastic') return m.recycle_plastic();\n\t\treturn m.recycle_trash();`,
		prompt: 'recycle_prompt',
		hint: 'recycle_hint',
		name: 'recycle_name',
		stageClass: 'recycle-stage',
		thumbClass: 'recycle-thumb',
		pauseMs: 1200,
		noThumbWrap: true
	},
	{
		slug: 'hungry-thirsty',
		mod: 'hungry-thirsty',
		P: 'HungryThirsty',
		msg: 'hunger',
		progress: 'hungry-thirsty',
		importExtras: `type HungryThirstyId, type HungryThirstyRound`,
		getter: 'getHungryThirstyLevel',
		max: 'MAX_HUNGRY_THIRSTY_LEVEL',
		rounds: 'HUNGRY_THIRSTY_ROUNDS',
		levels: 'HUNGRY_THIRSTY_LEVELS',
		answerType: 'HungryThirstyId',
		roundType: 'HungryThirstyRound',
		art: 'HungryThirstyArt',
		artProp: 'cue',
		artField: 'cue',
		thumbDefault: 'apple',
		labelFn: `return value === 'hungry' ? m.hunger_hungry() : m.hunger_thirsty();`,
		prompt: 'hunger_prompt',
		hint: 'hunger_hint',
		name: 'hunger_name',
		stageClass: 'hunger-stage',
		thumbClass: 'hunger-thumb'
	},
	{
		slug: 'safe-choice',
		mod: 'safe-choice',
		P: 'SafeChoice',
		msg: 'safe',
		progress: 'safe-choice',
		importExtras: `type SafeChoiceId, type SafeChoiceRound`,
		getter: 'getSafeChoiceLevel',
		max: 'MAX_SAFE_CHOICE_LEVEL',
		rounds: 'SAFE_CHOICE_ROUNDS',
		levels: 'SAFE_CHOICE_LEVELS',
		answerType: 'SafeChoiceId',
		roundType: 'SafeChoiceRound',
		art: 'SafeChoiceArt',
		artProp: 'scene',
		artField: 'scene',
		thumbDefault: 'crosswalk',
		labelFn: `return value === 'safe' ? m.safe_safe() : m.safe_unsafe();`,
		prompt: 'safe_prompt',
		hint: 'safe_hint',
		name: 'safe_name',
		stageClass: 'safe-stage',
		thumbClass: 'safe-thumb'
	},
	{
		slug: 'five-senses',
		mod: 'five-senses',
		P: 'FiveSenses',
		msg: 'senses',
		progress: 'five-senses',
		importExtras: `type SenseId, type FiveSensesRound`,
		getter: 'getFiveSensesLevel',
		max: 'MAX_FIVE_SENSES_LEVEL',
		rounds: 'FIVE_SENSES_ROUNDS',
		levels: 'FIVE_SENSES_LEVELS',
		answerType: 'SenseId',
		roundType: 'FiveSensesRound',
		art: 'FiveSensesArt',
		artProp: 'cue',
		artField: 'cue',
		thumbDefault: 'rainbow',
		labelFn: `if (value === 'see') return m.senses_see();\n\t\tif (value === 'hear') return m.senses_hear();\n\t\tif (value === 'smell') return m.senses_smell();\n\t\tif (value === 'taste') return m.senses_taste();\n\t\treturn m.senses_touch();`,
		prompt: 'senses_prompt',
		hint: 'senses_hint',
		name: 'senses_name',
		stageClass: 'senses-stage',
		thumbClass: 'senses-thumb'
	},
	{
		slug: 'near-far',
		mod: 'near-far',
		P: 'NearFar',
		msg: 'nearfar',
		progress: 'near-far',
		importExtras: `type NearFarId, type NearFarRound`,
		getter: 'getNearFarLevel',
		max: 'MAX_NEAR_FAR_LEVEL',
		rounds: 'NEAR_FAR_ROUNDS',
		levels: 'NEAR_FAR_LEVELS',
		answerType: 'NearFarId',
		roundType: 'NearFarRound',
		art: 'NearFarArt',
		artProp: 'scene',
		artField: 'scene',
		thumbDefault: 'ball-near',
		labelFn: `return value === 'near' ? m.nearfar_near() : m.nearfar_far();`,
		prompt: 'nearfar_prompt',
		hint: 'nearfar_hint',
		name: 'nearfar_name',
		stageClass: 'nearfar-stage',
		thumbClass: 'nearfar-thumb',
		noThumbWrap: true
	},
	{
		slug: 'open-closed',
		mod: 'open-closed',
		P: 'OpenClosed',
		msg: 'openclosed',
		progress: 'open-closed',
		importExtras: `type OpenClosedId, type OpenClosedRound`,
		getter: 'getOpenClosedLevel',
		max: 'MAX_OPEN_CLOSED_LEVEL',
		rounds: 'OPEN_CLOSED_ROUNDS',
		levels: 'OPEN_CLOSED_LEVELS',
		answerType: 'OpenClosedId',
		roundType: 'OpenClosedRound',
		art: 'OpenClosedArt',
		artProp: 'subject',
		artField: 'subject',
		thumbDefault: 'door-open',
		labelFn: `return value === 'open' ? m.openclosed_open() : m.openclosed_closed();`,
		prompt: 'openclosed_prompt',
		hint: 'openclosed_hint',
		name: 'openclosed_name',
		stageClass: 'openclosed-stage',
		thumbClass: 'openclosed-thumb',
		noThumbWrap: true
	},
	{
		slug: 'up-down',
		mod: 'up-down',
		P: 'UpDown',
		msg: 'updown',
		progress: 'up-down',
		importExtras: `type UpDownId, type UpDownRound`,
		getter: 'getUpDownLevel',
		max: 'MAX_UP_DOWN_LEVEL',
		rounds: 'UP_DOWN_ROUNDS',
		levels: 'UP_DOWN_LEVELS',
		answerType: 'UpDownId',
		roundType: 'UpDownRound',
		art: 'UpDownArt',
		artProp: 'scene',
		artField: 'scene',
		thumbDefault: 'balloon',
		labelFn: `return value === 'up' ? m.updown_up() : m.updown_down();`,
		prompt: 'updown_prompt',
		hint: 'updown_hint',
		name: 'updown_name',
		stageClass: 'updown-stage',
		thumbClass: 'updown-thumb',
		noThumbWrap: true
	}
];

function listPage(g) {
	const artImport = g.art;
	const artTag =
		g.noThumbWrap && g.slug === 'sink-float'
			? `<${artImport} ${g.artProp}="${g.thumbDefault}" />`
			: g.noThumbWrap
				? `<span class="${g.thumbClass}"><${artImport} ${g.artProp}="${g.thumbDefault}" /></span>`
				: `<span class="${g.thumbClass}" aria-hidden="true"><${artImport} ${g.artProp}="${g.thumbDefault}" /></span>`;
	return `<script lang="ts">
	import { onMount } from 'svelte';
	import { getLocale, localizeHref, locales } from '#lib/paraglide/runtime.js';
	import { m } from '#lib/paraglide/messages.js';
	import { isLevelOpen } from '#lib/count-fruit.js';
	import { ${g.max}, ${g.levels} } from '#lib/${g.mod}.js';
	import { loadProgress } from '#lib/progress.js';
	import ${artImport} from '#lib/components/${artImport}.svelte';

	let cleared = $state(0);

	const locale = $derived(getLocale() as (typeof locales)[number]);
	const homeHref = $derived(localizeHref('/', { locale }));
	const levelHref = $derived((level: number) =>
		localizeHref(\`/play/${g.slug}/\${level}\`, { locale })
	);

	onMount(() => {
		cleared = loadProgress(localStorage)['${g.progress}'].cleared;
	});
</script>

<svelte:head>
	<title>Lumi — {m.${g.name}()}</title>
</svelte:head>

<a class="btn back-link" href={homeHref}>← Lumi</a>

<div class="card">
	<h2 style="margin: 0; font-size: 2rem;">{m.${g.name}()}</h2>
	<p style="margin: 0.25rem 0 0; color: var(--ink-soft);">{m.chooseLevel()}</p>

	<ol class="level-path">
		{#each ${g.levels} as entry (entry.level)}
			{@const open = isLevelOpen(cleared, entry.level)}
			<li>
				<a
					class="level-tile"
					class:locked={!open}
					href={levelHref(entry.level)}
					aria-label={open
						? m.level({ n: entry.level })
						: \`\${m.level({ n: entry.level })} — \${m.locked()}\`}
				>
					{#if entry.level === cleared + 1 && cleared < ${g.max}}
						<span class="badge-new">{m.newLevel()}</span>
					{/if}
					{#if open}
						${artTag}
					{:else}
						<span class="lock" aria-hidden="true">🔒</span>
					{/if}
					<span>{m.level({ n: entry.level })}</span>
				</a>
			</li>
		{/each}
	</ol>

	{#if cleared >= ${g.max}}
		<p class="finish-banner">{m.finishGame()}</p>
	{/if}
</div>
`;
}

function levelPage(g) {
	const pause = g.pauseMs ?? 900;
	const artAttrs = `${g.artProp}={current.${g.artField}}${g.artExtra ? ` ${g.artExtra}` : ''}`;
	const stageInner = g.noThumbWrap
		? `<${g.art} ${artAttrs} />`
		: `<span class="${g.thumbClass} big"><${g.art} ${artAttrs} /></span>`;
	const winInner = g.noThumbWrap
		? `<${g.art} ${g.artProp}="${g.thumbDefault}" />`
		: `<span class="${g.thumbClass} big"><${g.art} ${g.artProp}="${g.thumbDefault}" /></span>`;

	return `<script lang="ts">
	import { onDestroy } from 'svelte';
	import { page } from '$app/state';
	import { getLocale, localizeHref, locales } from '#lib/paraglide/runtime.js';
	import { m } from '#lib/paraglide/messages.js';
	import { hintStage, isLevelOpen } from '#lib/count-fruit.js';
	import {
		${g.max},
		${g.rounds},
		${g.getter},
		pickRounds,
		${g.importExtras}
	} from '#lib/${g.mod}.js';
	import { clearLevel, loadProgress, saveProgress } from '#lib/progress.js';
	import Confetti from '#lib/components/Confetti.svelte';
	import ${g.art} from '#lib/components/${g.art}.svelte';
	import { playSfx } from '#lib/sound.js';

	const IDLE_MS = 20000;
	const PAUSE_MS = ${pause};

	let rounds = $state<${g.roundType}[] | null>(null);
	let roundIndex = $state(0);
	let pips = $state<boolean[]>([false, false, false]);
	let misses = $state(0);
	let manualHints = $state(0);
	let idleHint = $state(false);
	let feedback = $state<'correct' | 'wrong' | null>(null);
	let wrongValue = $state<${g.answerType} | null>(null);
	let won = $state(false);
	let decided = $state(false);
	let unlocked = $state(true);
	let syncedLevel = $state(0);
	let alive = true;

	let idleTimer: ReturnType<typeof setTimeout> | null = null;
	let pauseTimer: ReturnType<typeof setTimeout> | null = null;

	const levelNumber = $derived(Number.parseInt(page.params.level ?? '', 10));
	const config = $derived(${g.getter}(levelNumber));
	const current = $derived(rounds !== null ? (rounds[roundIndex] ?? null) : null);
	const stage = $derived(hintStage(misses, manualHints, idleHint));

	const locale = $derived(getLocale() as (typeof locales)[number]);
	const pathHref = $derived(localizeHref('/play/${g.slug}', { locale }));
	const nextHref = $derived(localizeHref(\`/play/${g.slug}/\${levelNumber + 1}\`, { locale }));

	function labelFor(value: ${g.answerType}): string {
		${g.labelFn}
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
		pips = Array.from({ length: ${g.rounds} }, () => false);
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
		const cleared = loadProgress(localStorage)['${g.progress}'].cleared;
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

	function answer(value: ${g.answerType}): void {
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
					clearLevel(progress, '${g.progress}', levelNumber);
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
	<title>Lumi — {config ? m.level({ n: levelNumber }) : m.${g.name}()}</title>
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
			<p class="prompt">{m.${g.prompt}()}</p>
			<div class="pips" aria-hidden="true">
				{#each pips as done, index (index)}
					<span class="pip" class:full={done}></span>
				{/each}
			</div>
			{#if current}
				<div class="${g.stageClass}" class:hint-pulse={stage === 1} aria-hidden="true">
					${stageInner}
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
							{labelFor(option)}
						</button>
					{/each}
				</div>
				<p class="feedback" class:good={feedback === 'correct'} class:retry={feedback === 'wrong'}>
					{#if feedback === 'correct'}{m.correctTap()}{:else if feedback === 'wrong'}{m.tryAgain()}{/if}
				</p>
				{#if stage >= 1}
					<div class="hint-box">
						{#if stage === 1}
							{m.${g.hint}()}
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
					${winInner}
				</div>
				<h2>{m.levelComplete()}</h2>
				<p class="cheer">{m.cheer()}</p>
				{#if levelNumber >= ${g.max}}
					<p>{m.finishGame()}</p>
				{/if}
				<div class="actions">
					{#if levelNumber < ${g.max}}
						<a class="btn" href={nextHref}>{m.nextLevel()}</a>
					{/if}
					<button class="btn secondary" type="button" onclick={startLevel}>{m.replay()}</button>
					<a class="btn back-link" href={pathHref}>{m.allLevels()}</a>
				</div>
			</div>
		{/if}
	</div>
{/if}
`;
}

function entriesPage(g) {
	return `import { ${g.levels} } from '#lib/${g.mod}.js';

/** Prerender every level so a refresh mid-game never lands on a 404. */
export function entries() {
	return ${g.levels}.map((entry) => ({ level: String(entry.level) }));
}
`;
}

for (const g of games) {
	const dir = join(root, `src/routes/play/${g.slug}`);
	mkdirSync(join(dir, '[level]'), { recursive: true });
	writeFileSync(join(dir, '+page.svelte'), listPage(g));
	writeFileSync(join(dir, '[level]/+page.svelte'), levelPage(g));
	writeFileSync(join(dir, '[level]/+page.ts'), entriesPage(g));
	console.log('wrote', g.slug);
}
console.log('done', games.length);
