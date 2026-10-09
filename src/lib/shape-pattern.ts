/**
 * Pure rules for "Shape pattern". A row of shapes repeats.
 * The child taps the shape that follows.
 */

import type { ShapeId } from './color-shapes.js';

export type ShapePatternKind = 'abab' | 'abc' | 'aabb' | 'abb';

export interface ShapePatternRound {
	shown: ShapeId[];
	answer: ShapeId;
	options: ShapeId[];
}

export interface ShapePatternLevelConfig {
	level: number;
	kind: ShapePatternKind | 'mixed';
	shapes: ShapeId[];
	shown: number;
	optionCount: number;
}

export const MAX_SHAPE_PATTERN_LEVEL = 10;
export const SHAPE_PATTERN_ROUNDS = 3;

const BASIC: ShapeId[] = ['circle', 'star', 'square', 'heart'];
const ALL: ShapeId[] = ['circle', 'square', 'triangle', 'star', 'heart'];

export const SHAPE_PATTERN_LEVELS: ShapePatternLevelConfig[] = [
	{ level: 1, kind: 'abab', shapes: ['circle', 'star', 'square'], shown: 4, optionCount: 2 },
	{ level: 2, kind: 'abab', shapes: BASIC, shown: 4, optionCount: 3 },
	{ level: 3, kind: 'abc', shapes: BASIC, shown: 3, optionCount: 3 },
	{ level: 4, kind: 'aabb', shapes: BASIC, shown: 4, optionCount: 3 },
	{ level: 5, kind: 'abb', shapes: BASIC, shown: 3, optionCount: 3 },
	{ level: 6, kind: 'abab', shapes: BASIC, shown: 5, optionCount: 3 },
	{ level: 7, kind: 'abc', shapes: ALL, shown: 4, optionCount: 3 },
	{ level: 8, kind: 'aabb', shapes: ALL, shown: 6, optionCount: 3 },
	{ level: 9, kind: 'abb', shapes: ALL, shown: 6, optionCount: 3 },
	{ level: 10, kind: 'mixed', shapes: ALL, shown: 4, optionCount: 3 }
];

const CLOSE: Record<ShapeId, ShapeId> = {
	circle: 'square',
	square: 'circle',
	triangle: 'square',
	star: 'heart',
	heart: 'star'
};

const MIXED: ShapePatternKind[] = ['abab', 'abc', 'aabb'];

export function getShapePatternLevel(level: number): ShapePatternLevelConfig | undefined {
	return SHAPE_PATTERN_LEVELS.find((entry) => entry.level === level);
}

function shuffled<T>(items: T[], rand: () => number): T[] {
	const copy = [...items];
	for (let i = copy.length - 1; i > 0; i--) {
		const j = Math.floor(rand() * (i + 1));
		[copy[i], copy[j]] = [copy[j], copy[i]];
	}
	return copy;
}

function unitFor(kind: ShapePatternKind, a: ShapeId, b: ShapeId, c: ShapeId): ShapeId[] {
	if (kind === 'abab') return [a, b];
	if (kind === 'abc') return [a, b, c];
	if (kind === 'aabb') return [a, a, b, b];
	return [a, b, b];
}

function continuePattern(
	unit: ShapeId[],
	shownCount: number
): { shown: ShapeId[]; answer: ShapeId } {
	const shown: ShapeId[] = [];
	for (let i = 0; i < shownCount; i++) shown.push(unit[i % unit.length]);
	return { shown, answer: unit[shownCount % unit.length] };
}

function optionsFor(
	unit: ShapeId[],
	answer: ShapeId,
	palette: ShapeId[],
	count: number,
	rand: () => number
): ShapeId[] {
	const chosen = [answer];
	for (const shape of unit) {
		if (chosen.length >= count) break;
		if (!chosen.includes(shape)) chosen.push(shape);
	}
	const partner = CLOSE[answer];
	if (chosen.length < count && !chosen.includes(partner)) chosen.push(partner);
	for (const shape of shuffled(
		palette.filter((shape) => !chosen.includes(shape)),
		rand
	)) {
		if (chosen.length >= count) break;
		chosen.push(shape);
	}
	return shuffled(chosen, rand);
}

/** Three shape rows. The answer is the next shape in the repeat. */
export function pickShapeRounds(
	config: ShapePatternLevelConfig,
	rand: () => number = Math.random
): ShapePatternRound[] {
	const palette = shuffled(config.shapes, rand);
	return Array.from({ length: SHAPE_PATTERN_ROUNDS }, (_, index) => {
		const kind = config.kind === 'mixed' ? MIXED[index] : config.kind;
		const a = palette[index % palette.length];
		const b = palette[(index + 1) % palette.length];
		const c = palette[(index + 2) % palette.length];
		const unit = unitFor(kind, a, b, c);
		const { shown, answer } = continuePattern(unit, config.shown);
		return {
			shown,
			answer,
			options: optionsFor(unit, answer, config.shapes, config.optionCount, rand)
		};
	});
}
