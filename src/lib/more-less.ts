/**
 * Pure rules for "More or less". Two piles of the same fruit.
 * The child taps the pile with more, and later the pile with fewer.
 */

import type { FruitId } from './count-fruit.js';

export type Side = 'left' | 'right';
export type Ask = 'more' | 'less';

export interface Compare {
	left: number;
	right: number;
}

export interface MoreLevelConfig {
	level: number;
	fruit: FruitId;
	min: number;
	max: number;
	/** Largest allowed difference between the two piles. */
	maxGap: number;
	ask: Ask;
}

export const MAX_MORE_LEVEL = 10;
export const MORE_ROUNDS = 3;

export const MORE_LEVELS: MoreLevelConfig[] = [
	{ level: 1, fruit: 'apple', min: 1, max: 3, maxGap: 2, ask: 'more' },
	{ level: 2, fruit: 'pear', min: 1, max: 4, maxGap: 2, ask: 'more' },
	{ level: 3, fruit: 'orange', min: 1, max: 4, maxGap: 3, ask: 'more' },
	{ level: 4, fruit: 'banana', min: 1, max: 5, maxGap: 2, ask: 'more' },
	{ level: 5, fruit: 'grapes', min: 2, max: 5, maxGap: 2, ask: 'more' },
	{ level: 6, fruit: 'strawberry', min: 2, max: 6, maxGap: 1, ask: 'more' },
	{ level: 7, fruit: 'lemon', min: 3, max: 6, maxGap: 1, ask: 'more' },
	{ level: 8, fruit: 'cherry', min: 1, max: 5, maxGap: 2, ask: 'less' },
	{ level: 9, fruit: 'peach', min: 2, max: 6, maxGap: 1, ask: 'less' },
	{ level: 10, fruit: 'watermelon', min: 3, max: 6, maxGap: 1, ask: 'less' }
];

export function getMoreLevel(level: number): MoreLevelConfig | undefined {
	return MORE_LEVELS.find((entry) => entry.level === level);
}

export function correctSide(pair: Compare, ask: Ask): Side {
	const leftWins = ask === 'more' ? pair.left > pair.right : pair.left < pair.right;
	return leftWins ? 'left' : 'right';
}

function shuffled<T>(items: T[], rand: () => number): T[] {
	const copy = [...items];
	for (let i = copy.length - 1; i > 0; i--) {
		const j = Math.floor(rand() * (i + 1));
		[copy[i], copy[j]] = [copy[j], copy[i]];
	}
	return copy;
}

function allPairs(config: MoreLevelConfig): Compare[] {
	const pairs: Compare[] = [];
	for (let left = config.min; left <= config.max; left++) {
		for (let right = config.min; right <= config.max; right++) {
			const gap = Math.abs(left - right);
			if (gap >= 1 && gap <= config.maxGap) pairs.push({ left, right });
		}
	}
	return pairs;
}

/** Three different piles. The two sides are never equal. */
export function pickPairs(config: MoreLevelConfig, rand: () => number = Math.random): Compare[] {
	return shuffled(allPairs(config), rand).slice(0, MORE_ROUNDS);
}
