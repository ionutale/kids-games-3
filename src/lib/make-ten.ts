/** Make 10 — see a number → tap what pairs to 10. */

export interface MakeTenRound {
	shown: number;
	answer: number;
	options: number[];
}

export interface MakeTenLevelConfig {
	level: number;
	shown: number[];
	optionCount: number;
}

export const MAX_MAKE_TEN_LEVEL = 10;
export const MAKE_TEN_ROUNDS = 3;

const EARLY = [1, 2, 5, 9];
const MID = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const ALL = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export const MAKE_TEN_LEVELS: MakeTenLevelConfig[] = [
	{ level: 1, shown: EARLY, optionCount: 2 },
	{ level: 2, shown: EARLY, optionCount: 2 },
	{ level: 3, shown: EARLY, optionCount: 3 },
	{ level: 4, shown: MID, optionCount: 3 },
	{ level: 5, shown: MID, optionCount: 3 },
	{ level: 6, shown: MID, optionCount: 4 },
	{ level: 7, shown: ALL, optionCount: 4 },
	{ level: 8, shown: ALL, optionCount: 4 },
	{ level: 9, shown: ALL, optionCount: 5 },
	{ level: 10, shown: ALL, optionCount: 5 }
];

export function getMakeTenLevel(level: number): MakeTenLevelConfig | undefined {
	return MAKE_TEN_LEVELS.find((entry) => entry.level === level);
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
	config: MakeTenLevelConfig,
	rand: () => number = Math.random
): MakeTenRound[] {
	const shownPool = shuffled(config.shown, rand);
	return Array.from({ length: MAKE_TEN_ROUNDS }, (_, index) => {
		const shown = shownPool[index % shownPool.length];
		const answer = 10 - shown;
		const distractors: number[] = [];
		for (let n = 0; n <= 10; n++) {
			if (n !== answer) distractors.push(n);
		}
		const options = shuffled(
			[answer, ...shuffled(distractors, rand).slice(0, config.optionCount - 1)],
			rand
		);
		return { shown, answer, options };
	});
}
