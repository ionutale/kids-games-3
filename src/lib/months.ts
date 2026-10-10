/**
 * Pure rules for "Months of the year".
 * Levels 1–5: see a short row, tap the month that comes next.
 * Levels 6–10: a year strip with several blanks; drag each month into place.
 */

export type MonthId =
	'jan' | 'feb' | 'mar' | 'apr' | 'may' | 'jun' | 'jul' | 'aug' | 'sep' | 'oct' | 'nov' | 'dec';

export type MonthsMode = 'next' | 'fill';

export interface MonthsNextRound {
	mode: 'next';
	shown: MonthId[];
	answer: MonthId;
	options: MonthId[];
}

export interface MonthsFillRound {
	mode: 'fill';
	/** Ordered board months for this round (usually Jan→Dec). */
	board: MonthId[];
	/** Month ids that start empty and must be placed. */
	blanks: MonthId[];
	/** Scrambled tray (blanks, sometimes with an extra decoy). */
	tray: MonthId[];
}

export type MonthsRound = MonthsNextRound | MonthsFillRound;

export interface MonthsLevelConfig {
	level: number;
	mode: MonthsMode;
	/** Inclusive month indexes in YEAR_MONTHS (0 = January). */
	min: number;
	/** Last month index included in the board / answer pool. */
	max: number;
	/** Next mode: how many months are shown before the blank. */
	shown: number;
	/** Next mode: answer button count. */
	optionCount: number;
	/** Fill mode: how many months are missing. */
	blankCount: number;
	/** Wrong answers / decoys sit next to the right month. */
	tight: boolean;
	/** Fill mode: add one extra wrong month in the tray. */
	decoy: boolean;
}

export const MAX_MONTHS_LEVEL = 10;
export const MONTHS_ROUNDS = 3;

export const YEAR_MONTHS: MonthId[] = [
	'jan',
	'feb',
	'mar',
	'apr',
	'may',
	'jun',
	'jul',
	'aug',
	'sep',
	'oct',
	'nov',
	'dec'
];

export const MONTHS_LEVELS: MonthsLevelConfig[] = [
	{
		level: 1,
		mode: 'next',
		min: 0,
		max: 3,
		shown: 1,
		optionCount: 2,
		blankCount: 0,
		tight: false,
		decoy: false
	},
	{
		level: 2,
		mode: 'next',
		min: 0,
		max: 5,
		shown: 1,
		optionCount: 3,
		blankCount: 0,
		tight: false,
		decoy: false
	},
	{
		level: 3,
		mode: 'next',
		min: 0,
		max: 7,
		shown: 2,
		optionCount: 3,
		blankCount: 0,
		tight: false,
		decoy: false
	},
	{
		level: 4,
		mode: 'next',
		min: 0,
		max: 9,
		shown: 2,
		optionCount: 4,
		blankCount: 0,
		tight: false,
		decoy: false
	},
	{
		level: 5,
		mode: 'next',
		min: 0,
		max: 11,
		shown: 3,
		optionCount: 3,
		blankCount: 0,
		tight: false,
		decoy: false
	},
	{
		level: 6,
		mode: 'fill',
		min: 0,
		max: 11,
		shown: 0,
		optionCount: 0,
		blankCount: 2,
		tight: false,
		decoy: false
	},
	{
		level: 7,
		mode: 'fill',
		min: 0,
		max: 11,
		shown: 0,
		optionCount: 0,
		blankCount: 3,
		tight: false,
		decoy: false
	},
	{
		level: 8,
		mode: 'fill',
		min: 0,
		max: 11,
		shown: 0,
		optionCount: 0,
		blankCount: 4,
		tight: true,
		decoy: true
	},
	{
		level: 9,
		mode: 'fill',
		min: 0,
		max: 11,
		shown: 0,
		optionCount: 0,
		blankCount: 5,
		tight: true,
		decoy: true
	},
	{
		level: 10,
		mode: 'fill',
		min: 0,
		max: 11,
		shown: 0,
		optionCount: 0,
		blankCount: 6,
		tight: true,
		decoy: true
	}
];

export function getMonthsLevel(level: number): MonthsLevelConfig | undefined {
	return MONTHS_LEVELS.find((entry) => entry.level === level);
}

function shuffled<T>(items: T[], rand: () => number): T[] {
	const copy = [...items];
	for (let i = copy.length - 1; i > 0; i--) {
		const j = Math.floor(rand() * (i + 1));
		[copy[i], copy[j]] = [copy[j], copy[i]];
	}
	return copy;
}

function sequences(config: MonthsLevelConfig): Array<{ shown: number[]; answer: number }> {
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
	count: number,
	tight: boolean,
	rand: () => number
): number[] {
	const candidates: number[] = [];
	for (let value = 0; value < YEAR_MONTHS.length; value++) {
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

function toNextRound(
	shown: number[],
	answer: number,
	config: MonthsLevelConfig,
	rand: () => number
): MonthsNextRound {
	const optionIndexes = optionsFor(answer, shown, config.optionCount, config.tight, rand);
	return {
		mode: 'next',
		shown: shown.map((index) => YEAR_MONTHS[index]),
		answer: YEAR_MONTHS[answer],
		options: optionIndexes.map((index) => YEAR_MONTHS[index])
	};
}

function pickFillRound(config: MonthsLevelConfig, rand: () => number): MonthsFillRound {
	const board = YEAR_MONTHS.slice(config.min, config.max + 1);
	const blankCount = Math.min(config.blankCount, board.length - 1);
	const blankIndexes = shuffled(
		board.map((_, index) => index),
		rand
	).slice(0, blankCount);
	const blanks = blankIndexes.map((index) => board[index]);
	let tray = [...blanks];
	if (config.decoy) {
		const filled = board.filter((month) => !blanks.includes(month));
		const decoys = config.tight
			? filled.filter((month) =>
					blanks.some(
						(blank) => Math.abs(YEAR_MONTHS.indexOf(month) - YEAR_MONTHS.indexOf(blank)) === 1
					)
				)
			: filled;
		const pool = decoys.length > 0 ? decoys : filled;
		if (pool.length > 0) tray.push(pool[Math.floor(rand() * pool.length)]);
	}
	tray = shuffled(tray, rand);
	if (tray.length > 1 && tray.every((month, i) => month === blanks[i])) {
		tray = shuffled(tray, () => 0.9);
	}
	return { mode: 'fill', board, blanks, tray };
}

/** Three rounds for the level. */
export function pickRounds(
	config: MonthsLevelConfig,
	rand: () => number = Math.random
): MonthsRound[] {
	if (config.mode === 'fill') {
		return Array.from({ length: MONTHS_ROUNDS }, () => pickFillRound(config, rand));
	}
	const pool = shuffled(sequences(config), rand);
	const rounds: MonthsRound[] = [];
	for (let i = 0; i < MONTHS_ROUNDS; i++) {
		const pick = pool[i % pool.length];
		rounds.push(toNextRound(pick.shown, pick.answer, config, rand));
	}
	return rounds;
}
