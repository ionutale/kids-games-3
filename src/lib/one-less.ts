/**
 * Pure rules for "One less". A pile (and its count) is shown.
 * The child taps the number that is one smaller.
 */

import type { FruitId } from './count-fruit.js';

export interface OneLessRound {
	shown: number;
	answer: number;
	options: number[];
}

export interface OneLessLevelConfig {
	level: number;
	fruit: FruitId;
	/** Smallest shown pile (answer is shown − 1, so min ≥ 2). */
	min: number;
	max: number;
	optionCount: number;
	/** Wrong answers sit next to the right count. */
	tight: boolean;
}

export const MAX_ONE_LESS_LEVEL = 10;
export const ONE_LESS_ROUNDS = 3;

export const ONE_LESS_LEVELS: OneLessLevelConfig[] = [
	{ level: 1, fruit: 'apple', min: 2, max: 4, optionCount: 2, tight: false },
	{ level: 2, fruit: 'pear', min: 2, max: 5, optionCount: 2, tight: false },
	{ level: 3, fruit: 'orange', min: 2, max: 5, optionCount: 3, tight: false },
	{ level: 4, fruit: 'banana', min: 2, max: 6, optionCount: 3, tight: false },
	{ level: 5, fruit: 'grapes', min: 3, max: 6, optionCount: 3, tight: false },
	{ level: 6, fruit: 'strawberry', min: 3, max: 7, optionCount: 3, tight: false },
	{ level: 7, fruit: 'lemon', min: 4, max: 8, optionCount: 3, tight: true },
	{ level: 8, fruit: 'cherry', min: 4, max: 9, optionCount: 3, tight: true },
	{ level: 9, fruit: 'peach', min: 5, max: 10, optionCount: 3, tight: true },
	{ level: 10, fruit: 'watermelon', min: 5, max: 10, optionCount: 4, tight: true }
];

export function getOneLessLevel(level: number): OneLessLevelConfig | undefined {
	return ONE_LESS_LEVELS.find((entry) => entry.level === level);
}

function shuffled<T>(items: T[], rand: () => number): T[] {
	const copy = [...items];
	for (let i = copy.length - 1; i > 0; i--) {
		const j = Math.floor(rand() * (i + 1));
		[copy[i], copy[j]] = [copy[j], copy[i]];
	}
	return copy;
}

function optionsFor(
	answer: number,
	shown: number,
	count: number,
	tight: boolean,
	rand: () => number
): number[] {
	const candidates: number[] = [];
	for (let value = 1; value <= shown + 2; value++) {
		if (value !== answer && value !== shown) candidates.push(value);
	}
	const near = candidates.filter((value) => Math.abs(value - answer) === 1);
	const far = candidates.filter((value) => Math.abs(value - answer) > 1);
	const ordered = tight
		? [...near, ...shuffled(far, rand)]
		: [...shuffled(far.length > 0 ? far : candidates, rand), ...near];
	const picked: number[] = [];
	for (const value of ordered) {
		if (picked.length >= count - 1) break;
		if (!picked.includes(value)) picked.push(value);
	}
	return shuffled([answer, ...picked], rand);
}

/** Three piles. The answer is always one less than the shown count. */
export function pickRounds(
	config: OneLessLevelConfig,
	rand: () => number = Math.random
): OneLessRound[] {
	const pool: number[] = [];
	for (let value = config.min; value <= config.max; value++) pool.push(value);
	return shuffled(pool, rand)
		.slice(0, ONE_LESS_ROUNDS)
		.map((shown) => {
			const answer = shown - 1;
			return {
				shown,
				answer,
				options: optionsFor(answer, shown, config.optionCount, config.tight, rand)
			};
		});
}
