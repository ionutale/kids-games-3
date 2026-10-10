/**
 * Pure rules for "Above / below / between".
 * Three different fruits in a column. Tap the one in the named place.
 */

import type { FruitId } from './count-fruit.js';

export type VerticalSpot = 'above' | 'below' | 'between';

export interface AboveBelowRound {
	items: FruitId[];
	ask: VerticalSpot;
	answerIndex: number;
}

export interface AboveBelowLevelConfig {
	level: number;
	asks: VerticalSpot[];
	fruits: FruitId[];
}

export const MAX_ABOVE_LEVEL = 10;
export const ABOVE_ROUNDS = 3;

const EARLY_FRUITS: FruitId[] = ['apple', 'banana', 'pear'];
const MID_FRUITS: FruitId[] = ['apple', 'banana', 'pear', 'orange', 'grapes'];
const ALL_FRUITS: FruitId[] = [
	'apple',
	'banana',
	'pear',
	'orange',
	'grapes',
	'strawberry',
	'lemon',
	'cherry'
];

export const ABOVE_LEVELS: AboveBelowLevelConfig[] = [
	{ level: 1, asks: ['above'], fruits: EARLY_FRUITS },
	{ level: 2, asks: ['below'], fruits: EARLY_FRUITS },
	{ level: 3, asks: ['above', 'below'], fruits: EARLY_FRUITS },
	{ level: 4, asks: ['above', 'below'], fruits: EARLY_FRUITS },
	{ level: 5, asks: ['between'], fruits: EARLY_FRUITS },
	{ level: 6, asks: ['above', 'below', 'between'], fruits: MID_FRUITS },
	{ level: 7, asks: ['above', 'below', 'between'], fruits: MID_FRUITS },
	{ level: 8, asks: ['above', 'below', 'between'], fruits: ALL_FRUITS },
	{ level: 9, asks: ['above', 'below', 'between'], fruits: ALL_FRUITS },
	{ level: 10, asks: ['above', 'below', 'between'], fruits: ALL_FRUITS }
];

export function getAboveLevel(level: number): AboveBelowLevelConfig | undefined {
	return ABOVE_LEVELS.find((entry) => entry.level === level);
}

/** Top is above (0), middle between (1), bottom below (2). */
export function indexFor(ask: VerticalSpot): number {
	if (ask === 'above') return 0;
	if (ask === 'below') return 2;
	return 1;
}

function shuffled<T>(items: T[], rand: () => number): T[] {
	const copy = [...items];
	for (let i = copy.length - 1; i > 0; i--) {
		const j = Math.floor(rand() * (i + 1));
		[copy[i], copy[j]] = [copy[j], copy[i]];
	}
	return copy;
}

/** Three vertical stacks. Always three distinct fruits. */
export function pickRounds(
	config: AboveBelowLevelConfig,
	rand: () => number = Math.random
): AboveBelowRound[] {
	const asks = shuffled(config.asks, rand);
	return Array.from({ length: ABOVE_ROUNDS }, (_, index) => {
		const ask = asks[index % asks.length];
		const items = shuffled(config.fruits, rand).slice(0, 3);
		return { items, ask, answerIndex: indexFor(ask) };
	});
}
