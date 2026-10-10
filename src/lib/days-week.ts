/**
 * Pure rules for "Days of the week". A day (or short row) is shown.
 * The child taps the day that comes next. Week starts on Monday.
 */

export type DayId = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

export interface DaysRound {
	shown: DayId[];
	answer: DayId;
	options: DayId[];
}

export interface DaysLevelConfig {
	level: number;
	/** Inclusive day indexes in WEEK_DAYS (0 = Monday). */
	min: number;
	/** Last day that may be the answer. */
	max: number;
	shown: number;
	optionCount: number;
	/** Wrong answers sit next to the right day. */
	tight: boolean;
}

export const MAX_DAYS_LEVEL = 10;
export const DAYS_ROUNDS = 3;

export const WEEK_DAYS: DayId[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

/**
 * Each level adds more day chips in the row (and more answer buttons when the
 * week still has room). Cap: shown + options ≤ 7 (one week).
 */
export const DAYS_LEVELS: DaysLevelConfig[] = [
	{ level: 1, min: 0, max: 3, shown: 1, optionCount: 2, tight: false },
	{ level: 2, min: 0, max: 4, shown: 1, optionCount: 3, tight: false },
	{ level: 3, min: 0, max: 5, shown: 2, optionCount: 3, tight: false },
	{ level: 4, min: 0, max: 6, shown: 2, optionCount: 4, tight: false },
	{ level: 5, min: 0, max: 6, shown: 3, optionCount: 3, tight: false },
	{ level: 6, min: 0, max: 6, shown: 3, optionCount: 4, tight: false },
	{ level: 7, min: 0, max: 6, shown: 4, optionCount: 3, tight: false },
	{ level: 8, min: 0, max: 6, shown: 4, optionCount: 3, tight: true },
	{ level: 9, min: 0, max: 6, shown: 5, optionCount: 2, tight: false },
	{ level: 10, min: 0, max: 6, shown: 5, optionCount: 2, tight: true }
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

function toRound(
	shown: number[],
	answer: number,
	config: DaysLevelConfig,
	rand: () => number
): DaysRound {
	const optionIndexes = optionsFor(answer, shown, config.optionCount, config.tight, rand);
	return {
		shown: shown.map((index) => WEEK_DAYS[index]),
		answer: WEEK_DAYS[answer],
		options: optionIndexes.map((index) => WEEK_DAYS[index])
	};
}

/** Three rows. The answer is the next day in the week. */
export function pickRounds(
	config: DaysLevelConfig,
	rand: () => number = Math.random
): DaysRound[] {
	const pool = shuffled(sequences(config), rand);
	const rounds: DaysRound[] = [];
	for (let i = 0; i < DAYS_ROUNDS; i++) {
		const pick = pool[i % pool.length];
		rounds.push(toRound(pick.shown, pick.answer, config, rand));
	}
	return rounds;
}
