/**
 * Pure rules for "Complete the set".
 * Two matching pictures sit in a row. Tap the missing third of a kind.
 */

import type { FruitId } from './count-fruit.js';

export type SetFaceId = FruitId | 'ball' | 'star' | 'heart' | 'block';

export interface CompleteSetRound {
	match: SetFaceId;
	shown: SetFaceId[];
	options: SetFaceId[];
	answer: SetFaceId;
}

export interface CompleteSetLevelConfig {
	level: number;
	pool: SetFaceId[];
	optionCount: number;
	/** How many matching faces already shown (always 2 for 3-of-a-kind). */
	shownCount: number;
}

export const MAX_SET_LEVEL = 10;
export const SET_ROUNDS = 3;

const EARLY: SetFaceId[] = ['apple', 'banana', 'ball', 'star'];
const MID: SetFaceId[] = ['apple', 'banana', 'pear', 'orange', 'ball', 'star', 'heart'];
const ALL: SetFaceId[] = [
	'apple',
	'banana',
	'pear',
	'orange',
	'grapes',
	'strawberry',
	'ball',
	'star',
	'heart',
	'block'
];

export const SET_LEVELS: CompleteSetLevelConfig[] = [
	{ level: 1, pool: EARLY, optionCount: 2, shownCount: 2 },
	{ level: 2, pool: EARLY, optionCount: 2, shownCount: 2 },
	{ level: 3, pool: EARLY, optionCount: 3, shownCount: 2 },
	{ level: 4, pool: MID, optionCount: 3, shownCount: 2 },
	{ level: 5, pool: MID, optionCount: 3, shownCount: 2 },
	{ level: 6, pool: MID, optionCount: 4, shownCount: 2 },
	{ level: 7, pool: ALL, optionCount: 4, shownCount: 2 },
	{ level: 8, pool: ALL, optionCount: 4, shownCount: 2 },
	{ level: 9, pool: ALL, optionCount: 5, shownCount: 2 },
	{ level: 10, pool: ALL, optionCount: 5, shownCount: 2 }
];

export function getSetLevel(level: number): CompleteSetLevelConfig | undefined {
	return SET_LEVELS.find((entry) => entry.level === level);
}

export function isFruitFace(face: SetFaceId): face is FruitId {
	return (
		face === 'apple' ||
		face === 'pear' ||
		face === 'orange' ||
		face === 'banana' ||
		face === 'grapes' ||
		face === 'strawberry' ||
		face === 'lemon' ||
		face === 'cherry' ||
		face === 'peach' ||
		face === 'watermelon'
	);
}

function shuffled<T>(items: T[], rand: () => number): T[] {
	const copy = [...items];
	for (let i = copy.length - 1; i > 0; i--) {
		const j = Math.floor(rand() * (i + 1));
		[copy[i], copy[j]] = [copy[j], copy[i]];
	}
	return copy;
}

/** Three boards: two matching faces shown, tap the missing twin. */
export function pickRounds(
	config: CompleteSetLevelConfig,
	rand: () => number = Math.random
): CompleteSetRound[] {
	const matches = shuffled(config.pool, rand);
	return Array.from({ length: SET_ROUNDS }, (_, index) => {
		const match = matches[index % matches.length];
		const shown = Array.from({ length: config.shownCount }, () => match);
		const distractors = shuffled(
			config.pool.filter((face) => face !== match),
			rand
		).slice(0, config.optionCount - 1);
		return {
			match,
			shown,
			options: shuffled([match, ...distractors], rand),
			answer: match
		};
	});
}
