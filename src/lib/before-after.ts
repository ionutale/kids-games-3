/**
 * Pure rules for "Before or after". One letter is shown.
 * The child taps the letter that comes before or after it.
 */

export type BefCasing = 'upper' | 'lower';
export type BefSide = 'before' | 'after';
export type BefSideMode = BefSide | 'mixed';

export interface BefRound {
	letter: string;
	side: BefSide;
	answer: string;
	options: string[];
}

export interface BefLevelConfig {
	level: number;
	/** First letter index that may appear as the shown letter (0 = A). */
	min: number;
	/** Last letter index that may appear as the shown letter (25 = Z). */
	max: number;
	side: BefSideMode;
	optionCount: number;
	casing: BefCasing;
	/** Wrong answers sit next to the right letter. */
	tight: boolean;
}

export const MAX_BEF_LEVEL = 10;
export const BEF_ROUNDS = 3;

export const BEF_LEVELS: BefLevelConfig[] = [
	{ level: 1, min: 0, max: 3, side: 'after', optionCount: 2, casing: 'upper', tight: false },
	{ level: 2, min: 0, max: 5, side: 'after', optionCount: 2, casing: 'upper', tight: false },
	{ level: 3, min: 0, max: 7, side: 'after', optionCount: 3, casing: 'upper', tight: false },
	{ level: 4, min: 1, max: 7, side: 'before', optionCount: 3, casing: 'upper', tight: false },
	{ level: 5, min: 1, max: 11, side: 'before', optionCount: 3, casing: 'upper', tight: false },
	{ level: 6, min: 0, max: 13, side: 'after', optionCount: 3, casing: 'lower', tight: false },
	{ level: 7, min: 1, max: 15, side: 'before', optionCount: 3, casing: 'lower', tight: false },
	{ level: 8, min: 1, max: 17, side: 'mixed', optionCount: 3, casing: 'upper', tight: true },
	{ level: 9, min: 1, max: 19, side: 'mixed', optionCount: 3, casing: 'lower', tight: true },
	{ level: 10, min: 1, max: 24, side: 'mixed', optionCount: 3, casing: 'upper', tight: true }
];

export function getBefLevel(level: number): BefLevelConfig | undefined {
	return BEF_LEVELS.find((entry) => entry.level === level);
}

export function letterAt(index: number, casing: BefCasing): string {
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

function answerIndex(focus: number, side: BefSide): number {
	return side === 'after' ? focus + 1 : focus - 1;
}

function focusPool(config: BefLevelConfig, side: BefSide): number[] {
	const pool: number[] = [];
	for (let focus = config.min; focus <= config.max; focus++) {
		const answer = answerIndex(focus, side);
		if (answer < 0 || answer > 25) continue;
		if (side === 'after' && answer > config.max + 1) continue;
		pool.push(focus);
	}
	return pool;
}

function optionsFor(
	answer: number,
	focus: number,
	count: number,
	tight: boolean,
	rand: () => number
): number[] {
	const candidates: number[] = [];
	for (let value = 0; value <= 25; value++) {
		if (value !== answer && value !== focus) candidates.push(value);
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

function sidesFor(config: BefLevelConfig, rand: () => number): BefSide[] {
	if (config.side !== 'mixed') return Array.from({ length: BEF_ROUNDS }, () => config.side);
	return shuffled(['before', 'after', rand() < 0.5 ? 'before' : 'after'], rand);
}

/** Three letters. The answer is the neighbor before or after. */
export function pickRounds(config: BefLevelConfig, rand: () => number = Math.random): BefRound[] {
	const sides = sidesFor(config, rand);
	return sides.map((side) => {
		const pool = shuffled(focusPool(config, side), rand);
		const focus = pool[0] ?? (side === 'after' ? config.min : config.max);
		const answer = answerIndex(focus, side);
		const optionIndexes = optionsFor(answer, focus, config.optionCount, config.tight, rand);
		return {
			letter: letterAt(focus, config.casing),
			side,
			answer: letterAt(answer, config.casing),
			options: optionIndexes.map((index) => letterAt(index, config.casing))
		};
	});
}
