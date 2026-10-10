/**
 * Pure rules for "Skip count".
 * Levels 1–3: by 2s. Levels 4–6: by 5s. Levels 7–9: by 10s.
 * Level 10: mixed 2s / 5s / 10s. Tap the next number in the row.
 */

export interface SkipRound {
	shown: number[];
	answer: number;
	options: number[];
	step: number;
}

export interface SkipLevelConfig {
	level: number;
	/** Fixed skip size. Ignored when `steps` is set. */
	step: number;
	/** Level 10: each round picks one of these. */
	steps?: number[];
	min: number;
	max: number;
	shown: number;
	optionCount: number;
	/** Wrong answers sit next to the right count. */
	tight: boolean;
}

export const MAX_SKIP_LEVEL = 10;
export const SKIP_ROUNDS = 3;

/** Bounds used when a mix level picks a step. */
const MIX_BOUNDS: Record<number, { min: number; max: number }> = {
	2: { min: 2, max: 24 },
	5: { min: 5, max: 50 },
	10: { min: 10, max: 100 }
};

export const SKIP_LEVELS: SkipLevelConfig[] = [
	{ level: 1, step: 2, min: 2, max: 12, shown: 2, optionCount: 2, tight: false },
	{ level: 2, step: 2, min: 2, max: 16, shown: 3, optionCount: 3, tight: false },
	{ level: 3, step: 2, min: 2, max: 20, shown: 3, optionCount: 3, tight: true },
	{ level: 4, step: 5, min: 5, max: 30, shown: 2, optionCount: 2, tight: false },
	{ level: 5, step: 5, min: 5, max: 40, shown: 3, optionCount: 3, tight: false },
	{ level: 6, step: 5, min: 5, max: 50, shown: 3, optionCount: 3, tight: true },
	{ level: 7, step: 10, min: 10, max: 60, shown: 2, optionCount: 2, tight: false },
	{ level: 8, step: 10, min: 10, max: 80, shown: 3, optionCount: 3, tight: false },
	{ level: 9, step: 10, min: 10, max: 100, shown: 3, optionCount: 3, tight: true },
	{
		level: 10,
		step: 2,
		steps: [2, 5, 10],
		min: 2,
		max: 100,
		shown: 3,
		optionCount: 3,
		tight: true
	}
];

export function getSkipLevel(level: number): SkipLevelConfig | undefined {
	return SKIP_LEVELS.find((entry) => entry.level === level);
}

function shuffled<T>(items: T[], rand: () => number): T[] {
	const copy = [...items];
	for (let i = copy.length - 1; i > 0; i--) {
		const j = Math.floor(rand() * (i + 1));
		[copy[i], copy[j]] = [copy[j], copy[i]];
	}
	return copy;
}

function sequences(
	min: number,
	max: number,
	step: number,
	shown: number
): Array<{ shown: number[]; answer: number }> {
	const list: Array<{ shown: number[]; answer: number }> = [];
	for (let start = min; start + shown * step <= max; start += step) {
		const row: number[] = [];
		for (let i = 0; i < shown; i++) row.push(start + i * step);
		list.push({ shown: row, answer: start + shown * step });
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

function toRound(
	shown: number[],
	answer: number,
	step: number,
	max: number,
	optionCount: number,
	tight: boolean,
	rand: () => number
): SkipRound {
	return {
		shown,
		answer,
		step,
		options: optionsFor(answer, shown, step, max, optionCount, tight, rand)
	};
}

function boundsFor(config: SkipLevelConfig, step: number): { min: number; max: number } {
	if (config.steps && config.steps.length > 0) {
		return MIX_BOUNDS[step] ?? { min: step, max: config.max };
	}
	return { min: config.min, max: config.max };
}

/** Three rows. The answer is the next skip-count number. */
export function pickRounds(config: SkipLevelConfig, rand: () => number = Math.random): SkipRound[] {
	const rounds: SkipRound[] = [];
	for (let i = 0; i < SKIP_ROUNDS; i++) {
		const step =
			config.steps && config.steps.length > 0
				? config.steps[Math.floor(rand() * config.steps.length)]
				: config.step;
		const { min, max } = boundsFor(config, step);
		const pool = shuffled(sequences(min, max, step, config.shown), rand);
		const pick = pool[i % Math.max(pool.length, 1)];
		if (!pick) continue;
		rounds.push(
			toRound(pick.shown, pick.answer, step, max, config.optionCount, config.tight, rand)
		);
	}
	return rounds;
}
