/**
 * Pure rules for "Place value".
 * Tens rods and ones cubes show a number.
 * The child taps the number, or how many tens / ones.
 */

export type PlaceAsk = 'number' | 'tens' | 'ones';

export interface PlaceRound {
	ask: PlaceAsk;
	tens: number;
	ones: number;
	value: number;
	answer: number;
	options: number[];
}

export interface PlaceLevelConfig {
	level: number;
	minTens: number;
	maxTens: number;
	minOnes: number;
	maxOnes: number;
	ask: PlaceAsk | 'mixed';
	optionCount: number;
	tight: boolean;
}

export const MAX_PLACE_LEVEL = 10;
export const PLACE_ROUNDS = 3;

export const PLACE_LEVELS: PlaceLevelConfig[] = [
	{ level: 1, minTens: 1, maxTens: 1, minOnes: 0, maxOnes: 5, ask: 'number', optionCount: 2, tight: false },
	{ level: 2, minTens: 1, maxTens: 2, minOnes: 0, maxOnes: 9, ask: 'number', optionCount: 3, tight: false },
	{ level: 3, minTens: 1, maxTens: 3, minOnes: 0, maxOnes: 9, ask: 'number', optionCount: 3, tight: false },
	{ level: 4, minTens: 1, maxTens: 4, minOnes: 0, maxOnes: 9, ask: 'tens', optionCount: 3, tight: false },
	{ level: 5, minTens: 1, maxTens: 5, minOnes: 0, maxOnes: 9, ask: 'tens', optionCount: 3, tight: false },
	{ level: 6, minTens: 1, maxTens: 5, minOnes: 1, maxOnes: 9, ask: 'ones', optionCount: 3, tight: false },
	{ level: 7, minTens: 2, maxTens: 6, minOnes: 0, maxOnes: 9, ask: 'ones', optionCount: 3, tight: true },
	{ level: 8, minTens: 1, maxTens: 7, minOnes: 0, maxOnes: 9, ask: 'mixed', optionCount: 3, tight: true },
	{ level: 9, minTens: 2, maxTens: 8, minOnes: 0, maxOnes: 9, ask: 'mixed', optionCount: 4, tight: true },
	{ level: 10, minTens: 3, maxTens: 9, minOnes: 0, maxOnes: 9, ask: 'mixed', optionCount: 4, tight: true }
];

export function getPlaceLevel(level: number): PlaceLevelConfig | undefined {
	return PLACE_LEVELS.find((entry) => entry.level === level);
}

function shuffled<T>(items: T[], rand: () => number): T[] {
	const copy = [...items];
	for (let i = copy.length - 1; i > 0; i--) {
		const j = Math.floor(rand() * (i + 1));
		[copy[i], copy[j]] = [copy[j], copy[i]];
	}
	return copy;
}

function pickAsk(mode: PlaceLevelConfig['ask'], rand: () => number): PlaceAsk {
	if (mode !== 'mixed') return mode;
	const pool: PlaceAsk[] = ['number', 'tens', 'ones'];
	return pool[Math.floor(rand() * pool.length)];
}

function optionsFor(
	answer: number,
	ask: PlaceAsk,
	count: number,
	tight: boolean,
	rand: () => number
): number[] {
	const max = ask === 'number' ? 99 : 9;
	const candidates: number[] = [];
	for (let value = ask === 'number' ? 10 : 0; value <= max; value++) {
		if (value !== answer) candidates.push(value);
	}
	const near = candidates.filter((value) => Math.abs(value - answer) === (ask === 'number' ? 10 : 1));
	const far = candidates.filter((value) => Math.abs(value - answer) > (ask === 'number' ? 10 : 1));
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

/** Three place-value boards. */
export function pickRounds(
	config: PlaceLevelConfig,
	rand: () => number = Math.random
): PlaceRound[] {
	return Array.from({ length: PLACE_ROUNDS }, () => {
		const tens =
			config.minTens + Math.floor(rand() * (config.maxTens - config.minTens + 1));
		const ones =
			config.minOnes + Math.floor(rand() * (config.maxOnes - config.minOnes + 1));
		const value = tens * 10 + ones;
		const ask = pickAsk(config.ask, rand);
		const answer = ask === 'number' ? value : ask === 'tens' ? tens : ones;
		return {
			ask,
			tens,
			ones,
			value,
			answer,
			options: optionsFor(answer, ask, config.optionCount, config.tight, rand)
		};
	});
}
