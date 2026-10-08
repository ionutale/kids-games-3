/**
 * Pure rules for "Count the fruit". No DOM, no Svelte, no storage access,
 * so every function here is unit-testable.
 */

export type FruitId =
	| 'apple'
	| 'pear'
	| 'orange'
	| 'banana'
	| 'grapes'
	| 'strawberry'
	| 'lemon'
	| 'cherry'
	| 'peach'
	| 'watermelon';

export type FruitLayout = 'row' | 'cluster' | 'scatter';

export interface LevelConfig {
	level: number;
	fruit: FruitId;
	/** Smallest count that can appear. */
	min: number;
	/** Largest count that can appear. */
	max: number;
	/** How the fruit is arranged on screen. */
	layout: FruitLayout;
	/** Wrong answers sit close to the right one. */
	tightDistractors: boolean;
	/** Fruit may slightly overlap (levels 9-10). */
	overlap: boolean;
}

export const MAX_LEVEL = 10;
export const ROUNDS_PER_LEVEL = 3;
export const OPTIONS_PER_ROUND = 3;

export const LEVELS: LevelConfig[] = [
	{
		level: 1,
		fruit: 'apple',
		min: 1,
		max: 3,
		layout: 'row',
		tightDistractors: false,
		overlap: false
	},
	{
		level: 2,
		fruit: 'pear',
		min: 1,
		max: 4,
		layout: 'row',
		tightDistractors: false,
		overlap: false
	},
	{
		level: 3,
		fruit: 'orange',
		min: 1,
		max: 5,
		layout: 'row',
		tightDistractors: false,
		overlap: false
	},
	{
		level: 4,
		fruit: 'banana',
		min: 2,
		max: 6,
		layout: 'row',
		tightDistractors: false,
		overlap: false
	},
	{
		level: 5,
		fruit: 'grapes',
		min: 1,
		max: 6,
		layout: 'cluster',
		tightDistractors: false,
		overlap: false
	},
	{
		level: 6,
		fruit: 'strawberry',
		min: 3,
		max: 8,
		layout: 'cluster',
		tightDistractors: false,
		overlap: false
	},
	{
		level: 7,
		fruit: 'lemon',
		min: 4,
		max: 9,
		layout: 'cluster',
		tightDistractors: true,
		overlap: false
	},
	{
		level: 8,
		fruit: 'cherry',
		min: 1,
		max: 10,
		layout: 'scatter',
		tightDistractors: false,
		overlap: false
	},
	{
		level: 9,
		fruit: 'peach',
		min: 5,
		max: 10,
		layout: 'scatter',
		tightDistractors: true,
		overlap: true
	},
	{
		level: 10,
		fruit: 'watermelon',
		min: 6,
		max: 10,
		layout: 'scatter',
		tightDistractors: true,
		overlap: true
	}
];

export function getLevel(level: number): LevelConfig | undefined {
	return LEVELS.find((entry) => entry.level === level);
}

/** A level is open when it is the next uncleared level or an older one. */
export function isLevelOpen(cleared: number, level: number): boolean {
	return level >= 1 && level <= MAX_LEVEL && level <= cleared + 1;
}

function shuffled<T>(items: T[], rand: () => number): T[] {
	const copy = [...items];
	for (let i = copy.length - 1; i > 0; i--) {
		const j = Math.floor(rand() * (i + 1));
		[copy[i], copy[j]] = [copy[j], copy[i]];
	}
	return copy;
}

/** Three different counts for one level, in play order. */
export function pickCounts(config: LevelConfig, rand: () => number = Math.random): number[] {
	const pool: number[] = [];
	for (let count = config.min; count <= config.max; count++) {
		pool.push(count);
	}
	return shuffled(pool, rand).slice(0, ROUNDS_PER_LEVEL);
}

/**
 * Three answer buttons: the right count plus two distractors.
 * Tight levels prefer neighbours of the right answer.
 */
export function makeOptions(
	config: LevelConfig,
	correct: number,
	rand: () => number = Math.random
): number[] {
	const inRange = (value: number) =>
		value >= config.min && value <= config.max && value !== correct;
	const neighbours: number[] = [];
	for (const delta of [1, -1, 2, -2, 3, -3]) {
		const candidate = correct + delta;
		if (inRange(candidate)) neighbours.push(candidate);
	}
	const rest: number[] = [];
	for (let value = config.min; value <= config.max; value++) {
		if (value !== correct && !neighbours.includes(value)) rest.push(value);
	}
	const ordered = config.tightDistractors ? [...neighbours, ...rest] : [...rest, ...neighbours];
	const distractors = (config.tightDistractors ? ordered : shuffled(ordered, rand)).slice(
		0,
		OPTIONS_PER_ROUND - 1
	);
	return shuffled([correct, ...distractors], rand);
}

export type HintStage = 0 | 1 | 2;

/**
 * Which help the child sees for the current count.
 * Stage 1 nudges after 2 wrong taps, a manual Help press, or a quiet spell.
 * Stage 2 names the answer after 4 wrong taps or a second Help press.
 */
export function hintStage(misses: number, manualHints: number, idleHint: boolean): HintStage {
	if (misses >= 4 || manualHints >= 2) return 2;
	if (misses >= 2 || manualHints >= 1 || idleHint) return 1;
	return 0;
}

/**
 * Deterministic scatter positions for one fruit, so the prerendered page
 * and the hydrated page agree. Seed comes from level and round.
 */
export function scatterPositions(
	count: number,
	seed: number,
	overlap: boolean
): { x: number; y: number; size: number; tilt: number }[] {
	let state = seed * 2654435761 + 1;
	const next = () => {
		state = (state * 1103515245 + 12345) & 0x7fffffff;
		return state / 0x7fffffff;
	};
	const spread = overlap ? 78 : 68;
	const positions: { x: number; y: number; size: number; tilt: number }[] = [];
	for (let i = 0; i < count; i++) {
		positions.push({
			x: 11 + next() * spread,
			y: 12 + next() * (spread - 8),
			size: 0.85 + next() * 0.45,
			tilt: next() * 40 - 20
		});
	}
	return positions;
}
