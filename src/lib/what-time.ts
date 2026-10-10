/**
 * Pure rules for "What time?". Early levels ask morning / day / night.
 * Later levels ask which hour the clock shows.
 */

export type DayPart = 'morning' | 'day' | 'night';
export type TimeMode = 'part' | 'hour';

export interface TimeRound {
	mode: TimeMode;
	/** Hour hand position on a 12-hour clock (1–12). */
	hour: number;
	part: DayPart;
	answer: string;
	options: string[];
}

export interface TimeLevelConfig {
	level: number;
	mode: TimeMode;
	parts: DayPart[];
	hours: number[];
	optionCount: number;
	tight: boolean;
}

export const MAX_TIME_LEVEL = 10;
export const TIME_ROUNDS = 3;

export const PART_HOUR: Record<DayPart, number> = {
	morning: 8,
	day: 12,
	night: 9
};

export const TIME_LEVELS: TimeLevelConfig[] = [
	{
		level: 1,
		mode: 'part',
		parts: ['morning', 'night'],
		hours: [],
		optionCount: 2,
		tight: false
	},
	{
		level: 2,
		mode: 'part',
		parts: ['morning', 'day'],
		hours: [],
		optionCount: 2,
		tight: false
	},
	{
		level: 3,
		mode: 'part',
		parts: ['morning', 'day', 'night'],
		hours: [],
		optionCount: 3,
		tight: false
	},
	{
		level: 4,
		mode: 'part',
		parts: ['morning', 'day', 'night'],
		hours: [],
		optionCount: 3,
		tight: false
	},
	{
		level: 5,
		mode: 'part',
		parts: ['morning', 'day', 'night'],
		hours: [],
		optionCount: 3,
		tight: true
	},
	{
		level: 6,
		mode: 'hour',
		parts: [],
		hours: [1, 2, 3, 4, 5, 6],
		optionCount: 2,
		tight: false
	},
	{
		level: 7,
		mode: 'hour',
		parts: [],
		hours: [1, 2, 3, 4, 5, 6, 7, 8, 9],
		optionCount: 3,
		tight: false
	},
	{
		level: 8,
		mode: 'hour',
		parts: [],
		hours: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
		optionCount: 3,
		tight: false
	},
	{
		level: 9,
		mode: 'hour',
		parts: [],
		hours: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
		optionCount: 3,
		tight: true
	},
	{
		level: 10,
		mode: 'hour',
		parts: [],
		hours: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
		optionCount: 4,
		tight: true
	}
];

export function getTimeLevel(level: number): TimeLevelConfig | undefined {
	return TIME_LEVELS.find((entry) => entry.level === level);
}

export function partForHour(hour: number): DayPart {
	if (hour >= 6 && hour <= 9) return 'morning';
	if (hour === 10 || hour === 11 || hour === 12 || (hour >= 1 && hour <= 3)) return 'day';
	return 'night';
}

function shuffled<T>(items: T[], rand: () => number): T[] {
	const copy = [...items];
	for (let i = copy.length - 1; i > 0; i--) {
		const j = Math.floor(rand() * (i + 1));
		[copy[i], copy[j]] = [copy[j], copy[i]];
	}
	return copy;
}

function partOptions(
	answer: DayPart,
	pool: DayPart[],
	count: number,
	tight: boolean,
	rand: () => number
): string[] {
	const order: DayPart[] = ['morning', 'day', 'night'];
	const near = order.filter(
		(part) => part !== answer && Math.abs(order.indexOf(part) - order.indexOf(answer)) === 1
	);
	const far = pool.filter((part) => part !== answer && !near.includes(part));
	const ordered = tight
		? [...near.filter((part) => pool.includes(part)), ...shuffled(far, rand)]
		: [...shuffled(far.length > 0 ? far : pool.filter((part) => part !== answer), rand), ...near];
	const picked: string[] = [];
	for (const part of ordered) {
		if (picked.length >= count - 1) break;
		if (!picked.includes(part)) picked.push(part);
	}
	return shuffled([answer, ...picked], rand);
}

function hourOptions(
	answer: number,
	pool: number[],
	count: number,
	tight: boolean,
	rand: () => number
): string[] {
	const others = pool.filter((hour) => hour !== answer);
	const near = others.filter((hour) => {
		const gap = Math.min(Math.abs(hour - answer), 12 - Math.abs(hour - answer));
		return gap === 1;
	});
	const far = others.filter((hour) => !near.includes(hour));
	const ordered = tight
		? [...near, ...shuffled(far, rand)]
		: [...shuffled(far.length > 0 ? far : others, rand), ...near];
	const picked: number[] = [];
	for (const hour of ordered) {
		if (picked.length >= count - 1) break;
		if (!picked.includes(hour)) picked.push(hour);
	}
	return shuffled([answer, ...picked], rand).map(String);
}

/** Three clocks. Answer is the day part or the hour. */
export function pickRounds(
	config: TimeLevelConfig,
	rand: () => number = Math.random
): TimeRound[] {
	if (config.mode === 'part') {
		const parts = shuffled(config.parts, rand);
		return Array.from({ length: TIME_ROUNDS }, (_, index) => {
			const part = parts[index % parts.length];
			return {
				mode: 'part',
				hour: PART_HOUR[part],
				part,
				answer: part,
				options: partOptions(part, config.parts, config.optionCount, config.tight, rand)
			};
		});
	}

	const hours = shuffled(config.hours, rand);
	return Array.from({ length: TIME_ROUNDS }, (_, index) => {
		const hour = hours[index % hours.length];
		return {
			mode: 'hour',
			hour,
			part: partForHour(hour),
			answer: String(hour),
			options: hourOptions(hour, config.hours, config.optionCount, config.tight, rand)
		};
	});
}
