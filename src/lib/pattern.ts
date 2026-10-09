/**
 * Pure rules for "What comes next?". A row of colors repeats.
 * The child taps the color that follows.
 */

import type { ColorId } from './color-shapes.js';

export type PatternKind = 'abab' | 'abc' | 'aabb' | 'abb';

export interface PatternRound {
	shown: ColorId[];
	answer: ColorId;
	options: ColorId[];
}

export interface PatternLevelConfig {
	level: number;
	kind: PatternKind | 'mixed';
	colors: ColorId[];
	shown: number;
	optionCount: number;
}

export const MAX_PATTERN_LEVEL = 10;
export const PATTERN_ROUNDS = 3;

const BASIC: ColorId[] = ['red', 'blue', 'yellow', 'green'];
const ALL: ColorId[] = ['red', 'blue', 'yellow', 'green', 'orange', 'purple'];

export const PATTERN_LEVELS: PatternLevelConfig[] = [
	{ level: 1, kind: 'abab', colors: ['red', 'blue', 'yellow'], shown: 4, optionCount: 2 },
	{ level: 2, kind: 'abab', colors: BASIC, shown: 4, optionCount: 3 },
	{ level: 3, kind: 'abc', colors: BASIC, shown: 3, optionCount: 3 },
	{ level: 4, kind: 'aabb', colors: BASIC, shown: 4, optionCount: 3 },
	{ level: 5, kind: 'abb', colors: BASIC, shown: 3, optionCount: 3 },
	{ level: 6, kind: 'abab', colors: BASIC, shown: 5, optionCount: 3 },
	{ level: 7, kind: 'abc', colors: ALL, shown: 4, optionCount: 3 },
	{ level: 8, kind: 'aabb', colors: ALL, shown: 6, optionCount: 3 },
	{ level: 9, kind: 'abb', colors: ALL, shown: 6, optionCount: 3 },
	{ level: 10, kind: 'mixed', colors: ALL, shown: 4, optionCount: 3 }
];

const CLOSE: Record<ColorId, ColorId> = {
	red: 'orange',
	orange: 'red',
	yellow: 'orange',
	green: 'yellow',
	blue: 'purple',
	purple: 'blue'
};

const MIXED: PatternKind[] = ['abab', 'abc', 'aabb'];

export function getPatternLevel(level: number): PatternLevelConfig | undefined {
	return PATTERN_LEVELS.find((entry) => entry.level === level);
}

function shuffled<T>(items: T[], rand: () => number): T[] {
	const copy = [...items];
	for (let i = copy.length - 1; i > 0; i--) {
		const j = Math.floor(rand() * (i + 1));
		[copy[i], copy[j]] = [copy[j], copy[i]];
	}
	return copy;
}

function unitFor(kind: PatternKind, a: ColorId, b: ColorId, c: ColorId): ColorId[] {
	if (kind === 'abab') return [a, b];
	if (kind === 'abc') return [a, b, c];
	if (kind === 'aabb') return [a, a, b, b];
	return [a, b, b];
}

function continuePattern(
	unit: ColorId[],
	shownCount: number
): { shown: ColorId[]; answer: ColorId } {
	const shown: ColorId[] = [];
	for (let i = 0; i < shownCount; i++) shown.push(unit[i % unit.length]);
	return { shown, answer: unit[shownCount % unit.length] };
}

function optionsFor(
	unit: ColorId[],
	answer: ColorId,
	palette: ColorId[],
	count: number,
	rand: () => number
): ColorId[] {
	const chosen = [answer];
	for (const color of unit) {
		if (chosen.length >= count) break;
		if (!chosen.includes(color)) chosen.push(color);
	}
	const partner = CLOSE[answer];
	if (chosen.length < count && !chosen.includes(partner)) chosen.push(partner);
	for (const color of shuffled(
		palette.filter((color) => !chosen.includes(color)),
		rand
	)) {
		if (chosen.length >= count) break;
		chosen.push(color);
	}
	return shuffled(chosen, rand);
}

/** Three color rows. The answer is the next color in the repeat. */
export function pickRounds(
	config: PatternLevelConfig,
	rand: () => number = Math.random
): PatternRound[] {
	const palette = shuffled(config.colors, rand);
	return Array.from({ length: PATTERN_ROUNDS }, (_, index) => {
		const kind = config.kind === 'mixed' ? MIXED[index] : config.kind;
		const a = palette[index % palette.length];
		const b = palette[(index + 1) % palette.length];
		const c = palette[(index + 2) % palette.length];
		const unit = unitFor(kind, a, b, c);
		const { shown, answer } = continuePattern(unit, config.shown);
		return {
			shown,
			answer,
			options: optionsFor(unit, answer, config.colors, config.optionCount, rand)
		};
	});
}
