/**
 * Pure rules for "Take some away". A starting pile minus a smaller pile,
 * and the child taps how many are left.
 */

import type { FruitId } from './count-fruit.js';

export interface Difference {
	start: number;
	taken: number;
}

export interface SubtractLevelConfig {
	level: number;
	fruit: FruitId;
	minRemain: number;
	maxRemain: number;
	minTaken: number;
	maxTaken: number;
	tight: boolean;
}

export const MAX_SUBTRACT_LEVEL = 10;
export const SUBTRACT_ROUNDS_PER_LEVEL = 3;

export const SUBTRACT_LEVELS: SubtractLevelConfig[] = [
	{ level: 1, fruit: 'apple', minRemain: 1, maxRemain: 3, minTaken: 1, maxTaken: 1, tight: false },
	{ level: 2, fruit: 'pear', minRemain: 1, maxRemain: 4, minTaken: 1, maxTaken: 1, tight: false },
	{ level: 3, fruit: 'orange', minRemain: 1, maxRemain: 5, minTaken: 1, maxTaken: 2, tight: false },
	{ level: 4, fruit: 'banana', minRemain: 2, maxRemain: 6, minTaken: 1, maxTaken: 2, tight: false },
	{ level: 5, fruit: 'grapes', minRemain: 1, maxRemain: 6, minTaken: 1, maxTaken: 2, tight: false },
	{
		level: 6,
		fruit: 'strawberry',
		minRemain: 2,
		maxRemain: 7,
		minTaken: 1,
		maxTaken: 2,
		tight: false
	},
	{ level: 7, fruit: 'lemon', minRemain: 2, maxRemain: 8, minTaken: 1, maxTaken: 3, tight: true },
	{ level: 8, fruit: 'cherry', minRemain: 1, maxRemain: 8, minTaken: 2, maxTaken: 3, tight: true },
	{ level: 9, fruit: 'peach', minRemain: 3, maxRemain: 9, minTaken: 1, maxTaken: 3, tight: true },
	{
		level: 10,
		fruit: 'watermelon',
		minRemain: 4,
		maxRemain: 9,
		minTaken: 2,
		maxTaken: 4,
		tight: true
	}
];

export function getSubtractLevel(level: number): SubtractLevelConfig | undefined {
	return SUBTRACT_LEVELS.find((entry) => entry.level === level);
}

export function remainOf(problem: Difference): number {
	return problem.start - problem.taken;
}

function shuffled<T>(items: T[], rand: () => number): T[] {
	const copy = [...items];
	for (let i = copy.length - 1; i > 0; i--) {
		const j = Math.floor(rand() * (i + 1));
		[copy[i], copy[j]] = [copy[j], copy[i]];
	}
	return copy;
}

function allProblems(config: SubtractLevelConfig): Difference[] {
	const problems: Difference[] = [];
	for (let remain = config.minRemain; remain <= config.maxRemain; remain++) {
		for (let taken = config.minTaken; taken <= config.maxTaken; taken++) {
			problems.push({ start: remain + taken, taken });
		}
	}
	return problems;
}

/** Three problems with different remainders, in play order. */
export function pickDifferences(
	config: SubtractLevelConfig,
	rand: () => number = Math.random
): Difference[] {
	const byRemain = new Map<number, Difference[]>();
	for (const problem of allProblems(config)) {
		const remain = remainOf(problem);
		const list = byRemain.get(remain) ?? [];
		list.push(problem);
		byRemain.set(remain, list);
	}
	return shuffled([...byRemain.keys()], rand)
		.slice(0, SUBTRACT_ROUNDS_PER_LEVEL)
		.map((remain) => shuffled(byRemain.get(remain)!, rand)[0]);
}

/** Three numerals: the remainder plus two distractors. */
export function makeRemainOptions(
	config: SubtractLevelConfig,
	problem: Difference,
	rand: () => number = Math.random
): number[] {
	const correct = remainOf(problem);
	const ceiling = config.maxRemain + config.maxTaken;
	const neighbours = [1, -1, 2, -2]
		.map((delta) => correct + delta)
		.filter((value) => value >= 1 && value <= ceiling && value !== correct);
	const rest: number[] = [];
	for (let value = 1; value <= ceiling; value++) {
		if (value !== correct && !neighbours.includes(value)) rest.push(value);
	}
	const ordered = config.tight
		? [...neighbours, ...rest]
		: [...shuffled(rest, rand), ...neighbours];
	return shuffled([correct, ...ordered.slice(0, 2)], rand);
}
