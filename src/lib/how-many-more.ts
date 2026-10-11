/** How many more? — two piles → tap the difference (1–3 early). */

export interface HowManyMoreRound {
	left: number;
	right: number;
	answer: number;
	options: number[];
}

export interface HowManyMoreLevelConfig {
	level: number;
	maxCount: number;
	maxDiff: number;
	optionCount: number;
}

export const MAX_HOW_MANY_MORE_LEVEL = 10;
export const HOW_MANY_MORE_ROUNDS = 3;

export const HOW_MANY_MORE_LEVELS: HowManyMoreLevelConfig[] = [
	{ level: 1, maxCount: 4, maxDiff: 1, optionCount: 2 },
	{ level: 2, maxCount: 5, maxDiff: 1, optionCount: 2 },
	{ level: 3, maxCount: 5, maxDiff: 2, optionCount: 3 },
	{ level: 4, maxCount: 6, maxDiff: 2, optionCount: 3 },
	{ level: 5, maxCount: 6, maxDiff: 3, optionCount: 3 },
	{ level: 6, maxCount: 7, maxDiff: 3, optionCount: 3 },
	{ level: 7, maxCount: 8, maxDiff: 3, optionCount: 4 },
	{ level: 8, maxCount: 8, maxDiff: 4, optionCount: 4 },
	{ level: 9, maxCount: 9, maxDiff: 4, optionCount: 4 },
	{ level: 10, maxCount: 10, maxDiff: 5, optionCount: 4 }
];

export function getHowManyMoreLevel(level: number): HowManyMoreLevelConfig | undefined {
	return HOW_MANY_MORE_LEVELS.find((entry) => entry.level === level);
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
	config: HowManyMoreLevelConfig,
	rand: () => number = Math.random
): HowManyMoreRound[] {
	return Array.from({ length: HOW_MANY_MORE_ROUNDS }, () => {
		const diff = 1 + Math.floor(rand() * config.maxDiff);
		const smaller = 1 + Math.floor(rand() * Math.max(1, config.maxCount - diff));
		const bigger = smaller + diff;
		const flip = rand() < 0.5;
		const left = flip ? bigger : smaller;
		const right = flip ? smaller : bigger;
		const distractors: number[] = [];
		for (let n = 1; n <= config.maxDiff + 2; n++) if (n !== diff) distractors.push(n);
		return {
			left,
			right,
			answer: diff,
			options: shuffled([diff, ...shuffled(distractors, rand).slice(0, config.optionCount - 1)], rand)
		};
	});
}
