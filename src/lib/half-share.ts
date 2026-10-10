/**
 * Pure rules for "Half / share".
 * An even pile is shown. The child taps how many are in each half.
 */

import type { FruitId } from './count-fruit.js';

export interface HalfRound {
	shown: number;
	answer: number;
	options: number[];
}

export interface HalfLevelConfig {
	level: number;
	fruit: FruitId;
	/** Smallest even pile (must be ≥ 2). */
	min: number;
	/** Largest even pile. */
	max: number;
	optionCount: number;
	tight: boolean;
}

export const MAX_HALF_LEVEL = 10;
export const HALF_ROUNDS = 3;

export const HALF_LEVELS: HalfLevelConfig[] = [
	{ level: 1, fruit: 'apple', min: 2, max: 4, optionCount: 2, tight: false },
	{ level: 2, fruit: 'pear', min: 2, max: 6, optionCount: 2, tight: false },
	{ level: 3, fruit: 'orange', min: 2, max: 6, optionCount: 3, tight: false },
	{ level: 4, fruit: 'banana', min: 4, max: 8, optionCount: 3, tight: false },
	{ level: 5, fruit: 'grapes', min: 4, max: 8, optionCount: 3, tight: false },
	{ level: 6, fruit: 'strawberry', min: 4, max: 10, optionCount: 3, tight: false },
	{ level: 7, fruit: 'lemon', min: 6, max: 10, optionCount: 3, tight: true },
	{ level: 8, fruit: 'cherry', min: 6, max: 12, optionCount: 3, tight: true },
	{ level: 9, fruit: 'peach', min: 6, max: 12, optionCount: 4, tight: true },
	{ level: 10, fruit: 'watermelon', min: 8, max: 12, optionCount: 4, tight: true }
];

export function getHalfLevel(level: number): HalfLevelConfig | undefined {
	return HALF_LEVELS.find((entry) => entry.level === level);
}

function shuffled<T>(items: T[], rand: () => number): T[] {
	const copy = [...items];
	for (let i = copy.length - 1; i > 0; i--) {
		const j = Math.floor(rand() * (i + 1));
		[copy[i], copy[j]] = [copy[j], copy[i]];
	}
	return copy;
}

function evenPool(min: number, max: number): number[] {
	const pool: number[] = [];
	for (let value = min; value <= max; value += 1) {
		if (value % 2 === 0) pool.push(value);
	}
	return pool;
}

function optionsFor(
	answer: number,
	shown: number,
	count: number,
	tight: boolean,
	rand: () => number
): number[] {
	const candidates: number[] = [];
	for (let value = 1; value <= Math.max(shown, answer + 3); value++) {
		if (value !== answer) candidates.push(value);
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

/** Three even piles. The answer is always half of the shown count. */
export function pickRounds(
	config: HalfLevelConfig,
	rand: () => number = Math.random
): HalfRound[] {
	const pool = evenPool(config.min, config.max);
	const picks = shuffled(pool, rand);
	const rounds: HalfRound[] = [];
	for (let i = 0; i < HALF_ROUNDS; i++) {
		const shown = picks[i % picks.length];
		const answer = shown / 2;
		rounds.push({
			shown,
			answer,
			options: optionsFor(answer, shown, config.optionCount, config.tight, rand)
		});
	}
	return rounds;
}
