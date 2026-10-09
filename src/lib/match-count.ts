/**
 * Pure rules for "Match the number". A number is shown.
 * The child taps the pile that has that many fruit.
 */

import type { FruitId } from './count-fruit.js';

export interface MatchRound {
	target: number;
	piles: number[];
}

export interface MatchLevelConfig {
	level: number;
	fruit: FruitId;
	min: number;
	max: number;
	pileCount: number;
	/** Wrong piles sit next to the right count. */
	tight: boolean;
}

export const MAX_MATCH_LEVEL = 10;
export const MATCH_ROUNDS = 3;

export const MATCH_LEVELS: MatchLevelConfig[] = [
	{ level: 1, fruit: 'apple', min: 1, max: 3, pileCount: 2, tight: false },
	{ level: 2, fruit: 'pear', min: 1, max: 4, pileCount: 2, tight: false },
	{ level: 3, fruit: 'orange', min: 1, max: 4, pileCount: 3, tight: false },
	{ level: 4, fruit: 'banana', min: 1, max: 5, pileCount: 3, tight: false },
	{ level: 5, fruit: 'grapes', min: 1, max: 5, pileCount: 3, tight: false },
	{ level: 6, fruit: 'strawberry', min: 2, max: 6, pileCount: 2, tight: true },
	{ level: 7, fruit: 'lemon', min: 2, max: 6, pileCount: 3, tight: true },
	{ level: 8, fruit: 'cherry', min: 1, max: 6, pileCount: 3, tight: true },
	{ level: 9, fruit: 'peach', min: 2, max: 6, pileCount: 3, tight: true },
	{ level: 10, fruit: 'watermelon', min: 3, max: 6, pileCount: 3, tight: true }
];

export function getMatchLevel(level: number): MatchLevelConfig | undefined {
	return MATCH_LEVELS.find((entry) => entry.level === level);
}

function shuffled<T>(items: T[], rand: () => number): T[] {
	const copy = [...items];
	for (let i = copy.length - 1; i > 0; i--) {
		const j = Math.floor(rand() * (i + 1));
		[copy[i], copy[j]] = [copy[j], copy[i]];
	}
	return copy;
}

function range(min: number, max: number): number[] {
	const values: number[] = [];
	for (let value = min; value <= max; value++) values.push(value);
	return values;
}

function distractors(config: MatchLevelConfig, target: number, rand: () => number): number[] {
	const others = range(config.min, config.max).filter((value) => value !== target);
	const near = others.filter((value) => Math.abs(value - target) === 1);
	const far = others.filter((value) => Math.abs(value - target) > 1);
	const ordered = config.tight
		? [...near, ...shuffled(far, rand)]
		: [...shuffled(far.length > 0 ? far : others, rand), ...near];
	const picked: number[] = [];
	for (const value of ordered) {
		if (picked.length >= config.pileCount - 1) break;
		if (!picked.includes(value)) picked.push(value);
	}
	return picked;
}

/** Three numbers. Each round has exactly one pile with that many fruit. */
export function pickRounds(
	config: MatchLevelConfig,
	rand: () => number = Math.random
): MatchRound[] {
	const targets = shuffled(range(config.min, config.max), rand).slice(0, MATCH_ROUNDS);
	return targets.map((target) => ({
		target,
		piles: shuffled([target, ...distractors(config, target, rand)], rand)
	}));
}
