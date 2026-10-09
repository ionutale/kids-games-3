/**
 * Pure rules for "First or last". A row of the same fruit.
 * The child taps the one in the named place: first, last, middle, or second.
 * First is the left end. All four languages read left to right.
 */

import type { FruitId } from './count-fruit.js';

export type Spot = 'first' | 'second' | 'middle' | 'last';

export interface PositionRound {
	length: number;
	ask: Spot;
	answerIndex: number;
}

export interface PositionLevelConfig {
	level: number;
	fruit: FruitId;
	length: number;
	asks: Spot[];
}

export const MAX_POSITION_LEVEL = 10;
export const POSITION_ROUNDS = 3;

export const POSITION_LEVELS: PositionLevelConfig[] = [
	{ level: 1, fruit: 'apple', length: 3, asks: ['first'] },
	{ level: 2, fruit: 'pear', length: 3, asks: ['last'] },
	{ level: 3, fruit: 'orange', length: 3, asks: ['first', 'last'] },
	{ level: 4, fruit: 'banana', length: 4, asks: ['first', 'last'] },
	{ level: 5, fruit: 'grapes', length: 5, asks: ['first', 'last'] },
	{ level: 6, fruit: 'strawberry', length: 3, asks: ['middle'] },
	{ level: 7, fruit: 'lemon', length: 5, asks: ['middle'] },
	{ level: 8, fruit: 'cherry', length: 4, asks: ['second'] },
	{ level: 9, fruit: 'peach', length: 5, asks: ['first', 'last', 'middle'] },
	{ level: 10, fruit: 'watermelon', length: 5, asks: ['first', 'second', 'middle', 'last'] }
];

export function getPositionLevel(level: number): PositionLevelConfig | undefined {
	return POSITION_LEVELS.find((entry) => entry.level === level);
}

/** Left is first. Middle is only used on odd-length rows. */
export function indexFor(ask: Spot, length: number): number {
	if (ask === 'first') return 0;
	if (ask === 'second') return 1;
	if (ask === 'last') return length - 1;
	return Math.floor((length - 1) / 2);
}

function shuffled<T>(items: T[], rand: () => number): T[] {
	const copy = [...items];
	for (let i = copy.length - 1; i > 0; i--) {
		const j = Math.floor(rand() * (i + 1));
		[copy[i], copy[j]] = [copy[j], copy[i]];
	}
	return copy;
}

/** Three rounds. Each names a place that sits inside the row. */
export function pickRounds(
	config: PositionLevelConfig,
	rand: () => number = Math.random
): PositionRound[] {
	const asks = shuffled(config.asks, rand);
	return Array.from({ length: POSITION_ROUNDS }, (_, index) => {
		const ask = asks[index % asks.length];
		return { length: config.length, ask, answerIndex: indexFor(ask, config.length) };
	});
}
