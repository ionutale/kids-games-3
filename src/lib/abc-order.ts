/**
 * Pure rules for "A, B, C". A letter row is shown.
 * The child taps the letter that follows in the alphabet.
 */

export type AbcCasing = 'upper' | 'lower';

export interface AbcRound {
	shown: string[];
	answer: string;
	options: string[];
}

export interface AbcLevelConfig {
	level: number;
	/** First letter index in the pool (0 = A). */
	min: number;
	/** Last letter that may be the answer (0 = A, 25 = Z). */
	max: number;
	shown: number;
	optionCount: number;
	casing: AbcCasing;
	/** Wrong answers sit next to the right letter. */
	tight: boolean;
}

export const MAX_ABC_LEVEL = 10;
export const ABC_ROUNDS = 3;

export const ABC_LEVELS: AbcLevelConfig[] = [
	{ level: 1, min: 0, max: 4, shown: 2, optionCount: 2, casing: 'upper', tight: false },
	{ level: 2, min: 0, max: 5, shown: 3, optionCount: 2, casing: 'upper', tight: false },
	{ level: 3, min: 0, max: 7, shown: 3, optionCount: 3, casing: 'upper', tight: false },
	{ level: 4, min: 0, max: 9, shown: 3, optionCount: 3, casing: 'upper', tight: false },
	{ level: 5, min: 0, max: 11, shown: 4, optionCount: 3, casing: 'upper', tight: false },
	{ level: 6, min: 0, max: 13, shown: 3, optionCount: 3, casing: 'lower', tight: false },
	{ level: 7, min: 0, max: 15, shown: 3, optionCount: 3, casing: 'lower', tight: false },
	{ level: 8, min: 0, max: 17, shown: 4, optionCount: 3, casing: 'upper', tight: true },
	{ level: 9, min: 0, max: 19, shown: 3, optionCount: 3, casing: 'lower', tight: true },
	{ level: 10, min: 0, max: 25, shown: 4, optionCount: 3, casing: 'upper', tight: true }
];

export function getAbcLevel(level: number): AbcLevelConfig | undefined {
	return ABC_LEVELS.find((entry) => entry.level === level);
}

export function letterAt(index: number, casing: AbcCasing): string {
	const ch = String.fromCharCode(65 + index);
	return casing === 'lower' ? ch.toLowerCase() : ch;
}

function shuffled<T>(items: T[], rand: () => number): T[] {
	const copy = [...items];
	for (let i = copy.length - 1; i > 0; i--) {
		const j = Math.floor(rand() * (i + 1));
		[copy[i], copy[j]] = [copy[j], copy[i]];
	}
	return copy;
}

function sequences(config: AbcLevelConfig): Array<{ shown: number[]; answer: number }> {
	const list: Array<{ shown: number[]; answer: number }> = [];
	for (let start = config.min; start + config.shown <= config.max; start += 1) {
		const shown: number[] = [];
		for (let i = 0; i < config.shown; i++) shown.push(start + i);
		list.push({ shown, answer: start + config.shown });
	}
	return list;
}

function optionsFor(
	answer: number,
	shown: number[],
	max: number,
	count: number,
	tight: boolean,
	rand: () => number
): number[] {
	const candidates: number[] = [];
	for (let value = 0; value <= Math.min(25, max + 1); value++) {
		if (value !== answer && !shown.includes(value)) candidates.push(value);
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

/** Three rows. The answer is the next letter in the alphabet. */
export function pickRounds(config: AbcLevelConfig, rand: () => number = Math.random): AbcRound[] {
	return shuffled(sequences(config), rand)
		.slice(0, ABC_ROUNDS)
		.map(({ shown, answer }) => {
			const optionIndexes = optionsFor(
				answer,
				shown,
				config.max,
				config.optionCount,
				config.tight,
				rand
			);
			return {
				shown: shown.map((index) => letterAt(index, config.casing)),
				answer: letterAt(answer, config.casing),
				options: optionIndexes.map((index) => letterAt(index, config.casing))
			};
		});
}
