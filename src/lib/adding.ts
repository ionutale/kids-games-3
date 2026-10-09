/**
 * Pure rules for "Add two groups". Two piles of the same fruit, and the
 * child taps the total. Later levels keep the wrong answers close.
 */

import type { FruitId } from './count-fruit.js';

export interface Sum {
	left: number;
	right: number;
}

export interface AddingLevelConfig {
	level: number;
	fruit: FruitId;
	/** Smallest pile. */
	minPart: number;
	/** Largest total. */
	maxTotal: number;
	tight: boolean;
}

export const MAX_ADDING_LEVEL = 10;
export const ADDING_ROUNDS_PER_LEVEL = 3;

export const ADDING_LEVELS: AddingLevelConfig[] = [
	{ level: 1, fruit: 'apple', minPart: 1, maxTotal: 4, tight: false },
	{ level: 2, fruit: 'pear', minPart: 1, maxTotal: 5, tight: false },
	{ level: 3, fruit: 'orange', minPart: 1, maxTotal: 5, tight: false },
	{ level: 4, fruit: 'banana', minPart: 1, maxTotal: 6, tight: false },
	{ level: 5, fruit: 'grapes', minPart: 1, maxTotal: 7, tight: false },
	{ level: 6, fruit: 'strawberry', minPart: 1, maxTotal: 8, tight: false },
	{ level: 7, fruit: 'lemon', minPart: 1, maxTotal: 9, tight: true },
	{ level: 8, fruit: 'cherry', minPart: 2, maxTotal: 10, tight: true },
	{ level: 9, fruit: 'peach', minPart: 2, maxTotal: 10, tight: true },
	{ level: 10, fruit: 'watermelon', minPart: 3, maxTotal: 10, tight: true }
];

export function getAddingLevel(level: number): AddingLevelConfig | undefined {
	return ADDING_LEVELS.find((entry) => entry.level === level);
}

export function totalOf(sum: Sum): number {
	return sum.left + sum.right;
}

function shuffled<T>(items: T[], rand: () => number): T[] {
	const copy = [...items];
	for (let i = copy.length - 1; i > 0; i--) {
		const j = Math.floor(rand() * (i + 1));
		[copy[i], copy[j]] = [copy[j], copy[i]];
	}
	return copy;
}

function allSums(config: AddingLevelConfig): Sum[] {
	const sums: Sum[] = [];
	for (let left = config.minPart; left < config.maxTotal; left++) {
		for (let right = config.minPart; right <= config.maxTotal - left; right++) {
			sums.push({ left, right });
		}
	}
	return sums;
}

/** Three sums with different totals, in play order. */
export function pickSums(config: AddingLevelConfig, rand: () => number = Math.random): Sum[] {
	const byTotal = new Map<number, Sum[]>();
	for (const sum of allSums(config)) {
		const total = totalOf(sum);
		const list = byTotal.get(total) ?? [];
		list.push(sum);
		byTotal.set(total, list);
	}
	return shuffled([...byTotal.keys()], rand)
		.slice(0, ADDING_ROUNDS_PER_LEVEL)
		.map((total) => shuffled(byTotal.get(total)!, rand)[0]);
}

/** Three numerals: the total plus two distractors. */
export function makeTotalOptions(
	config: AddingLevelConfig,
	sum: Sum,
	rand: () => number = Math.random
): number[] {
	const correct = totalOf(sum);
	const neighbours = [1, -1, 2, -2]
		.map((delta) => correct + delta)
		.filter((value) => value >= 2 && value <= config.maxTotal && value !== correct);
	const rest: number[] = [];
	for (let value = 2; value <= config.maxTotal; value++) {
		if (value !== correct && !neighbours.includes(value)) rest.push(value);
	}
	const ordered = config.tight
		? [...neighbours, ...rest]
		: [...shuffled(rest, rand), ...neighbours];
	return shuffled([correct, ...ordered.slice(0, 2)], rand);
}
