/**
 * Pure rules for "Small to big". Three piles of the same fruit.
 * The child taps them from fewest to most.
 */

import type { FruitId } from './count-fruit.js';

export interface SmallBigRound {
	/** Display order. The three counts are always different. */
	counts: [number, number, number];
}

export interface SmallBigLevelConfig {
	level: number;
	fruit: FruitId;
	min: number;
	max: number;
	/** Smallest allowed gap between fewest and most. */
	minSpan: number;
	/** Largest allowed gap between fewest and most. */
	maxSpan: number;
}

export const MAX_SMALL_BIG_LEVEL = 10;
export const SMALL_BIG_ROUNDS = 3;

export const SMALL_BIG_LEVELS: SmallBigLevelConfig[] = [
	{ level: 1, fruit: 'apple', min: 1, max: 5, minSpan: 3, maxSpan: 4 },
	{ level: 2, fruit: 'pear', min: 1, max: 5, minSpan: 3, maxSpan: 4 },
	{ level: 3, fruit: 'orange', min: 1, max: 5, minSpan: 2, maxSpan: 4 },
	{ level: 4, fruit: 'banana', min: 1, max: 5, minSpan: 2, maxSpan: 3 },
	{ level: 5, fruit: 'grapes', min: 1, max: 6, minSpan: 2, maxSpan: 3 },
	{ level: 6, fruit: 'strawberry', min: 1, max: 5, minSpan: 2, maxSpan: 2 },
	{ level: 7, fruit: 'lemon', min: 1, max: 6, minSpan: 2, maxSpan: 2 },
	{ level: 8, fruit: 'cherry', min: 2, max: 6, minSpan: 2, maxSpan: 2 },
	{ level: 9, fruit: 'peach', min: 2, max: 6, minSpan: 2, maxSpan: 2 },
	{ level: 10, fruit: 'watermelon', min: 2, max: 6, minSpan: 2, maxSpan: 2 }
];

export function getSmallBigLevel(level: number): SmallBigLevelConfig | undefined {
	return SMALL_BIG_LEVELS.find((entry) => entry.level === level);
}

function shuffled<T>(items: T[], rand: () => number): T[] {
	const copy = [...items];
	for (let i = copy.length - 1; i > 0; i--) {
		const j = Math.floor(rand() * (i + 1));
		[copy[i], copy[j]] = [copy[j], copy[i]];
	}
	return copy;
}

function allTriples(config: SmallBigLevelConfig): number[][] {
	const triples: number[][] = [];
	for (let low = config.min; low <= config.max; low++) {
		for (let mid = low + 1; mid <= config.max; mid++) {
			for (let high = mid + 1; high <= config.max; high++) {
				const span = high - low;
				if (span >= config.minSpan && span <= config.maxSpan) triples.push([low, mid, high]);
			}
		}
	}
	return triples;
}

/** Three rounds. Each pile has a different count, shuffled on screen. */
export function pickRounds(
	config: SmallBigLevelConfig,
	rand: () => number = Math.random
): SmallBigRound[] {
	return shuffled(allTriples(config), rand)
		.slice(0, SMALL_BIG_ROUNDS)
		.map((counts) => ({ counts: shuffled(counts, rand) as [number, number, number] }));
}

/** Index of the smallest pile that has not been tapped yet. */
export function nextPile(counts: number[], placed: number): number {
	return counts.map((count, index) => ({ count, index })).sort((a, b) => a.count - b.count)[placed]
		.index;
}

export function isNextPile(counts: number[], placed: number, tapped: number): boolean {
	return nextPile(counts, placed) === tapped;
}
