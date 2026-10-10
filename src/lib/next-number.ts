/**
 * Pure rules for "What number is next?". A counting row is shown.
 * The child taps the number that follows.
 */

export interface NextRound {
	shown: number[];
	answer: number;
	options: number[];
}

export interface NextLevelConfig {
	level: number;
	min: number;
	max: number;
	step: number;
	shown: number;
	optionCount: number;
	/** Wrong answers sit next to the right count. */
	tight: boolean;
}

export const MAX_NEXT_LEVEL = 10;
export const NEXT_ROUNDS = 3;

export const NEXT_LEVELS: NextLevelConfig[] = [
	{ level: 1, min: 1, max: 5, step: 1, shown: 2, optionCount: 2, tight: false },
	{ level: 2, min: 1, max: 6, step: 1, shown: 3, optionCount: 2, tight: false },
	{ level: 3, min: 1, max: 8, step: 1, shown: 3, optionCount: 3, tight: false },
	{ level: 4, min: 1, max: 10, step: 1, shown: 3, optionCount: 3, tight: false },
	{ level: 5, min: 1, max: 10, step: 1, shown: 4, optionCount: 3, tight: false },
	{ level: 6, min: 2, max: 10, step: 2, shown: 2, optionCount: 2, tight: false },
	{ level: 7, min: 2, max: 12, step: 2, shown: 3, optionCount: 3, tight: false },
	{ level: 8, min: 1, max: 12, step: 1, shown: 4, optionCount: 3, tight: true },
	{ level: 9, min: 2, max: 14, step: 2, shown: 3, optionCount: 3, tight: true },
	{ level: 10, min: 1, max: 15, step: 1, shown: 4, optionCount: 3, tight: true }
];

export function getNextLevel(level: number): NextLevelConfig | undefined {
	return NEXT_LEVELS.find((entry) => entry.level === level);
}

function shuffled<T>(items: T[], rand: () => number): T[] {
	const copy = [...items];
	for (let i = copy.length - 1; i > 0; i--) {
		const j = Math.floor(rand() * (i + 1));
		[copy[i], copy[j]] = [copy[j], copy[i]];
	}
	return copy;
}

function sequences(config: NextLevelConfig): Array<{ shown: number[]; answer: number }> {
	const list: Array<{ shown: number[]; answer: number }> = [];
	for (
		let start = config.min;
		start + config.shown * config.step <= config.max;
		start += config.step
	) {
		const shown: number[] = [];
		for (let i = 0; i < config.shown; i++) shown.push(start + i * config.step);
		list.push({ shown, answer: start + config.shown * config.step });
	}
	return list;
}

function optionsFor(
	answer: number,
	shown: number[],
	step: number,
	max: number,
	count: number,
	tight: boolean,
	rand: () => number
): number[] {
	const candidates: number[] = [];
	for (let value = 1; value <= max + step; value++) {
		if (value !== answer && !shown.includes(value)) candidates.push(value);
	}
	const near = candidates.filter((value) => Math.abs(value - answer) === step);
	const far = candidates.filter((value) => Math.abs(value - answer) > step);
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

/** Three rows. The answer is the next number in the count. */
export function pickRounds(
	config: NextLevelConfig,
	rand: () => number = Math.random
): NextRound[] {
	return shuffled(sequences(config), rand)
		.slice(0, NEXT_ROUNDS)
		.map(({ shown, answer }) => ({
			shown,
			answer,
			options: optionsFor(
				answer,
				shown,
				config.step,
				config.max,
				config.optionCount,
				config.tight,
				rand
			)
		}));
}
