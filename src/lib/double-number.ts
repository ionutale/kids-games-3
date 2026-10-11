/** Double — see n → tap 2n. */

export interface DoubleRound {
	shown: number;
	answer: number;
	options: number[];
}

export interface DoubleLevelConfig {
	level: number;
	maxShown: number;
	optionCount: number;
}

export const MAX_DOUBLE_NUMBER_LEVEL = 10;
export const DOUBLE_NUMBER_ROUNDS = 3;

export const DOUBLE_NUMBER_LEVELS: DoubleLevelConfig[] = [
	{ level: 1, maxShown: 3, optionCount: 2 },
	{ level: 2, maxShown: 3, optionCount: 2 },
	{ level: 3, maxShown: 4, optionCount: 3 },
	{ level: 4, maxShown: 5, optionCount: 3 },
	{ level: 5, maxShown: 5, optionCount: 3 },
	{ level: 6, maxShown: 6, optionCount: 4 },
	{ level: 7, maxShown: 7, optionCount: 4 },
	{ level: 8, maxShown: 8, optionCount: 4 },
	{ level: 9, maxShown: 9, optionCount: 5 },
	{ level: 10, maxShown: 10, optionCount: 5 }
];

export function getDoubleNumberLevel(level: number): DoubleLevelConfig | undefined {
	return DOUBLE_NUMBER_LEVELS.find((entry) => entry.level === level);
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
	config: DoubleLevelConfig,
	rand: () => number = Math.random
): DoubleRound[] {
	return Array.from({ length: DOUBLE_NUMBER_ROUNDS }, () => {
		const shown = 1 + Math.floor(rand() * config.maxShown);
		const answer = shown * 2;
		const distractors: number[] = [];
		for (let n = 1; n <= answer + 4; n++) if (n !== answer) distractors.push(n);
		return {
			shown,
			answer,
			options: shuffled([answer, ...shuffled(distractors, rand).slice(0, config.optionCount - 1)], rand)
		};
	});
}
