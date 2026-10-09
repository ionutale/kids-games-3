/**
 * Pure rules for "What is missing?". A counting row has one blank.
 * The child taps the number that belongs there.
 */

export type BlankSpot = 'start' | 'middle' | 'end' | 'any';

export interface MissingRound {
	/** Shown numbers. Null is the blank. */
	slots: Array<number | null>;
	answer: number;
	options: number[];
}

export interface MissingLevelConfig {
	level: number;
	min: number;
	max: number;
	step: number;
	length: number;
	blank: BlankSpot;
	tight: boolean;
}

export const MAX_MISSING_LEVEL = 10;
export const MISSING_ROUNDS = 3;

export const MISSING_LEVELS: MissingLevelConfig[] = [
	{ level: 1, min: 1, max: 5, step: 1, length: 3, blank: 'middle', tight: false },
	{ level: 2, min: 1, max: 6, step: 1, length: 3, blank: 'end', tight: false },
	{ level: 3, min: 1, max: 6, step: 1, length: 3, blank: 'start', tight: false },
	{ level: 4, min: 1, max: 8, step: 1, length: 4, blank: 'middle', tight: false },
	{ level: 5, min: 1, max: 10, step: 1, length: 4, blank: 'any', tight: false },
	{ level: 6, min: 2, max: 10, step: 2, length: 3, blank: 'middle', tight: false },
	{ level: 7, min: 2, max: 12, step: 2, length: 3, blank: 'end', tight: false },
	{ level: 8, min: 1, max: 10, step: 1, length: 4, blank: 'any', tight: true },
	{ level: 9, min: 2, max: 12, step: 2, length: 4, blank: 'middle', tight: true },
	{ level: 10, min: 2, max: 14, step: 2, length: 4, blank: 'any', tight: true }
];

export function getMissingLevel(level: number): MissingLevelConfig | undefined {
	return MISSING_LEVELS.find((entry) => entry.level === level);
}

function shuffled<T>(items: T[], rand: () => number): T[] {
	const copy = [...items];
	for (let i = copy.length - 1; i > 0; i--) {
		const j = Math.floor(rand() * (i + 1));
		[copy[i], copy[j]] = [copy[j], copy[i]];
	}
	return copy;
}

function sequences(config: MissingLevelConfig): number[][] {
	const list: number[][] = [];
	for (
		let start = config.min;
		start + (config.length - 1) * config.step <= config.max;
		start += config.step
	) {
		const row: number[] = [];
		for (let i = 0; i < config.length; i++) row.push(start + i * config.step);
		list.push(row);
	}
	return list;
}

function blankAt(config: MissingLevelConfig, rand: () => number): number {
	const last = config.length - 1;
	if (config.blank === 'start') return 0;
	if (config.blank === 'end') return last;
	if (config.blank === 'middle') return config.length === 3 ? 1 : rand() < 0.5 ? 1 : 2;
	return Math.floor(rand() * config.length);
}

function optionsFor(
	answer: number,
	visible: number[],
	step: number,
	max: number,
	tight: boolean,
	rand: () => number
): number[] {
	const candidates: number[] = [];
	for (let value = 1; value <= max + step; value++) {
		if (value !== answer && !visible.includes(value)) candidates.push(value);
	}
	const far = candidates.filter((value) => Math.abs(value - answer) > step);
	const pool = tight ? candidates : far.length >= 2 ? far : candidates;
	const ordered = tight
		? [...pool].sort((a, b) => Math.abs(a - answer) - Math.abs(b - answer))
		: shuffled(pool, rand);
	return shuffled([answer, ...ordered.slice(0, 2)], rand);
}

/** Three rows. Filling the blank makes a steady count. */
export function pickRounds(
	config: MissingLevelConfig,
	rand: () => number = Math.random
): MissingRound[] {
	return shuffled(sequences(config), rand)
		.slice(0, MISSING_ROUNDS)
		.map((row) => {
			const at = blankAt(config, rand);
			const answer = row[at];
			const slots = row.map((value, index) => (index === at ? null : value));
			const visible = slots.filter((value): value is number => value !== null);
			return {
				slots,
				answer,
				options: optionsFor(answer, visible, config.step, config.max, config.tight, rand)
			};
		});
}
