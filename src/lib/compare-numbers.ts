/**
 * Pure rules for "Compare numbers".
 * Two digits (later teens / two-digit) are shown.
 * The child taps the bigger or smaller one.
 */

export type CompareAsk = 'bigger' | 'smaller';

export interface CompareRound {
	ask: CompareAsk;
	left: number;
	right: number;
	answer: number;
}

export interface CompareLevelConfig {
	level: number;
	min: number;
	max: number;
	/** Prefer pairs whose difference is this small (0 = any). */
	maxGap: number;
	ask: CompareAsk | 'mixed';
}

export const MAX_COMPARE_LEVEL = 10;
export const COMPARE_ROUNDS = 3;

export const COMPARE_LEVELS: CompareLevelConfig[] = [
	{ level: 1, min: 1, max: 5, maxGap: 4, ask: 'bigger' },
	{ level: 2, min: 1, max: 9, maxGap: 6, ask: 'bigger' },
	{ level: 3, min: 1, max: 9, maxGap: 3, ask: 'bigger' },
	{ level: 4, min: 1, max: 9, maxGap: 4, ask: 'smaller' },
	{ level: 5, min: 1, max: 9, maxGap: 3, ask: 'mixed' },
	{ level: 6, min: 5, max: 15, maxGap: 5, ask: 'mixed' },
	{ level: 7, min: 10, max: 20, maxGap: 6, ask: 'mixed' },
	{ level: 8, min: 10, max: 30, maxGap: 5, ask: 'mixed' },
	{ level: 9, min: 20, max: 50, maxGap: 8, ask: 'mixed' },
	{ level: 10, min: 20, max: 99, maxGap: 6, ask: 'mixed' }
];

export function getCompareLevel(level: number): CompareLevelConfig | undefined {
	return COMPARE_LEVELS.find((entry) => entry.level === level);
}

function shuffled<T>(items: T[], rand: () => number): T[] {
	const copy = [...items];
	for (let i = copy.length - 1; i > 0; i--) {
		const j = Math.floor(rand() * (i + 1));
		[copy[i], copy[j]] = [copy[j], copy[i]];
	}
	return copy;
}

function pickAsk(mode: CompareLevelConfig['ask'], rand: () => number): CompareAsk {
	if (mode === 'mixed') return rand() < 0.5 ? 'bigger' : 'smaller';
	return mode;
}

function pickPair(
	min: number,
	max: number,
	maxGap: number,
	rand: () => number
): { left: number; right: number } {
	const a = min + Math.floor(rand() * (max - min + 1));
	let b = a;
	let guard = 0;
	while (b === a && guard < 40) {
		const delta = 1 + Math.floor(rand() * Math.max(1, maxGap));
		const sign = rand() < 0.5 ? -1 : 1;
		b = a + sign * delta;
		if (b < min || b > max) b = a;
		guard += 1;
	}
	if (b === a) {
		b = a === max ? a - 1 : a + 1;
	}
	const [left, right] = shuffled([a, b], rand);
	return { left, right };
}

/** Three rounds. Answer is the bigger or smaller number as asked. */
export function pickRounds(
	config: CompareLevelConfig,
	rand: () => number = Math.random
): CompareRound[] {
	return Array.from({ length: COMPARE_ROUNDS }, () => {
		const ask = pickAsk(config.ask, rand);
		const { left, right } = pickPair(config.min, config.max, config.maxGap, rand);
		const answer = ask === 'bigger' ? Math.max(left, right) : Math.min(left, right);
		return { ask, left, right, answer };
	});
}
