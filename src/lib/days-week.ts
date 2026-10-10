/**
 * Pure rules for "Days of the week".
 * Levels 1–5: see a short row, tap the day that comes next.
 * Levels 6–10: a week strip with several blanks; drag each day into place.
 * Week starts on Monday.
 */

export type DayId = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

export type DaysMode = 'next' | 'fill';

export interface DaysNextRound {
	mode: 'next';
	shown: DayId[];
	answer: DayId;
	options: DayId[];
}

export interface DaysFillRound {
	mode: 'fill';
	/** Ordered board days for this round (usually Mon→Sun). */
	board: DayId[];
	/** Day ids that start empty and must be placed. */
	blanks: DayId[];
	/** Scrambled tray (blanks, sometimes with an extra decoy). */
	tray: DayId[];
}

export type DaysRound = DaysNextRound | DaysFillRound;

export interface DaysLevelConfig {
	level: number;
	mode: DaysMode;
	/** Inclusive day indexes in WEEK_DAYS (0 = Monday). */
	min: number;
	/** Last day index included in the board / answer pool. */
	max: number;
	/** Next mode: how many days are shown before the blank. */
	shown: number;
	/** Next mode: answer button count. */
	optionCount: number;
	/** Fill mode: how many days are missing. */
	blankCount: number;
	/** Wrong answers / decoys sit next to the right day. */
	tight: boolean;
	/** Fill mode: add one extra wrong day in the tray. */
	decoy: boolean;
}

export const MAX_DAYS_LEVEL = 10;
export const DAYS_ROUNDS = 3;

export const WEEK_DAYS: DayId[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

export const DAYS_LEVELS: DaysLevelConfig[] = [
	{ level: 1, mode: 'next', min: 0, max: 3, shown: 1, optionCount: 2, blankCount: 0, tight: false, decoy: false },
	{ level: 2, mode: 'next', min: 0, max: 4, shown: 1, optionCount: 3, blankCount: 0, tight: false, decoy: false },
	{ level: 3, mode: 'next', min: 0, max: 5, shown: 2, optionCount: 3, blankCount: 0, tight: false, decoy: false },
	{ level: 4, mode: 'next', min: 0, max: 6, shown: 2, optionCount: 4, blankCount: 0, tight: false, decoy: false },
	{ level: 5, mode: 'next', min: 0, max: 6, shown: 3, optionCount: 3, blankCount: 0, tight: false, decoy: false },
	{ level: 6, mode: 'fill', min: 0, max: 6, shown: 0, optionCount: 0, blankCount: 2, tight: false, decoy: false },
	{ level: 7, mode: 'fill', min: 0, max: 6, shown: 0, optionCount: 0, blankCount: 3, tight: false, decoy: false },
	{ level: 8, mode: 'fill', min: 0, max: 6, shown: 0, optionCount: 0, blankCount: 3, tight: true, decoy: true },
	{ level: 9, mode: 'fill', min: 0, max: 6, shown: 0, optionCount: 0, blankCount: 4, tight: true, decoy: true },
	{ level: 10, mode: 'fill', min: 0, max: 6, shown: 0, optionCount: 0, blankCount: 5, tight: true, decoy: true }
];

export function getDaysLevel(level: number): DaysLevelConfig | undefined {
	return DAYS_LEVELS.find((entry) => entry.level === level);
}

function shuffled<T>(items: T[], rand: () => number): T[] {
	const copy = [...items];
	for (let i = copy.length - 1; i > 0; i--) {
		const j = Math.floor(rand() * (i + 1));
		[copy[i], copy[j]] = [copy[j], copy[i]];
	}
	return copy;
}

function sequences(config: DaysLevelConfig): Array<{ shown: number[]; answer: number }> {
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
	for (let value = 0; value < WEEK_DAYS.length; value++) {
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
	config: DaysLevelConfig,
	rand: () => number
): DaysNextRound {
	const optionIndexes = optionsFor(answer, shown, config.optionCount, config.tight, rand);
	return {
		mode: 'next',
		shown: shown.map((index) => WEEK_DAYS[index]),
		answer: WEEK_DAYS[answer],
		options: optionIndexes.map((index) => WEEK_DAYS[index])
	};
}

function pickFillRound(config: DaysLevelConfig, rand: () => number): DaysFillRound {
	const board = WEEK_DAYS.slice(config.min, config.max + 1);
	const blankCount = Math.min(config.blankCount, board.length - 1);
	const blankIndexes = shuffled(
		board.map((_, index) => index),
		rand
	).slice(0, blankCount);
	const blanks = blankIndexes.map((index) => board[index]);
	let tray = [...blanks];
	if (config.decoy) {
		const filled = board.filter((day) => !blanks.includes(day));
		const decoys = config.tight
			? filled.filter((day) =>
					blanks.some((blank) => Math.abs(WEEK_DAYS.indexOf(day) - WEEK_DAYS.indexOf(blank)) === 1)
				)
			: filled;
		const pool = decoys.length > 0 ? decoys : filled;
		if (pool.length > 0) tray.push(pool[Math.floor(rand() * pool.length)]);
	}
	tray = shuffled(tray, rand);
	if (tray.length > 1 && tray.every((day, i) => day === blanks[i])) {
		tray = shuffled(tray, () => 0.9);
	}
	return { mode: 'fill', board, blanks, tray };
}

/** Three rounds for the level. */
export function pickRounds(
	config: DaysLevelConfig,
	rand: () => number = Math.random
): DaysRound[] {
	if (config.mode === 'fill') {
		return Array.from({ length: DAYS_ROUNDS }, () => pickFillRound(config, rand));
	}
	const pool = shuffled(sequences(config), rand);
	const rounds: DaysRound[] = [];
	for (let i = 0; i < DAYS_ROUNDS; i++) {
		const pick = pool[i % pool.length];
		rounds.push(toNextRound(pick.shown, pick.answer, config, rand));
	}
	return rounds;
}
