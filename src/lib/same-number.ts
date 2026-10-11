/** Same number? — two piles → tap same or different. */

export type SameNumberId = 'same' | 'different';

export interface SameNumberRound {
	left: number;
	right: number;
	answer: SameNumberId;
	options: SameNumberId[];
}

export interface SameNumberLevelConfig {
	level: number;
	maxCount: number;
}

export const MAX_SAME_NUMBER_LEVEL = 10;
export const SAME_NUMBER_ROUNDS = 3;

export const SAME_NUMBER_LEVELS: SameNumberLevelConfig[] = [
	{ level: 1, maxCount: 3 },
	{ level: 2, maxCount: 3 },
	{ level: 3, maxCount: 4 },
	{ level: 4, maxCount: 5 },
	{ level: 5, maxCount: 5 },
	{ level: 6, maxCount: 6 },
	{ level: 7, maxCount: 7 },
	{ level: 8, maxCount: 8 },
	{ level: 9, maxCount: 9 },
	{ level: 10, maxCount: 10 }
];

export function getSameNumberLevel(level: number): SameNumberLevelConfig | undefined {
	return SAME_NUMBER_LEVELS.find((entry) => entry.level === level);
}

function shuffled<T>(items: T[], rand: () => number): T[] {
	const copy = [...items];
	for (let i = copy.length - 1; i > 0; i--) {
		const j = Math.floor(rand() * (i + 1));
		[copy[i], copy[j]] = [copy[j], copy[i]];
	}
	return copy;
}

export function pickRounds(
	config: SameNumberLevelConfig,
	rand: () => number = Math.random
): SameNumberRound[] {
	return Array.from({ length: SAME_NUMBER_ROUNDS }, () => {
		const left = 1 + Math.floor(rand() * config.maxCount);
		const wantSame = rand() < 0.5;
		let right = left;
		if (!wantSame) {
			right = 1 + Math.floor(rand() * config.maxCount);
			if (right === left) right = left === 1 ? 2 : left - 1;
		}
		const answer: SameNumberId = left === right ? 'same' : 'different';
		return {
			left,
			right,
			answer,
			options: shuffled(['same', 'different'], rand)
		};
	});
}
