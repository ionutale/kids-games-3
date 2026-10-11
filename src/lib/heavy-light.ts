/**
 * Pure rules for "Heavy / light".
 * Two objects on a balance. Tap the heavier (later: the lighter). No shame.
 */

export type WeightSide = 'left' | 'right';
export type WeightAsk = 'heavy' | 'light';

export type WeightObjectId =
	| 'feather'
	| 'balloon'
	| 'leaf'
	| 'cotton'
	| 'apple'
	| 'book'
	| 'shoe'
	| 'rock'
	| 'brick'
	| 'weight';

/** Relative mass ranks — higher is heavier. */
export const WEIGHT_RANK: Record<WeightObjectId, number> = {
	feather: 1,
	balloon: 1,
	leaf: 2,
	cotton: 2,
	apple: 4,
	book: 5,
	shoe: 5,
	rock: 7,
	brick: 8,
	weight: 9
};

export interface WeightRound {
	left: WeightObjectId;
	right: WeightObjectId;
}

export interface WeightLevelConfig {
	level: number;
	pool: WeightObjectId[];
	/** Minimum rank gap between the two objects. */
	minGap: number;
	ask: WeightAsk;
}

export const MAX_WEIGHT_LEVEL = 10;
export const WEIGHT_ROUNDS = 3;

const EARLY: WeightObjectId[] = ['feather', 'balloon', 'apple', 'rock', 'brick'];
const MID: WeightObjectId[] = ['feather', 'leaf', 'cotton', 'apple', 'book', 'shoe', 'rock', 'brick'];
const ALL: WeightObjectId[] = [
	'feather',
	'balloon',
	'leaf',
	'cotton',
	'apple',
	'book',
	'shoe',
	'rock',
	'brick',
	'weight'
];

export const WEIGHT_LEVELS: WeightLevelConfig[] = [
	{ level: 1, pool: EARLY, minGap: 4, ask: 'heavy' },
	{ level: 2, pool: EARLY, minGap: 4, ask: 'heavy' },
	{ level: 3, pool: EARLY, minGap: 3, ask: 'heavy' },
	{ level: 4, pool: MID, minGap: 3, ask: 'heavy' },
	{ level: 5, pool: MID, minGap: 2, ask: 'heavy' },
	{ level: 6, pool: MID, minGap: 2, ask: 'heavy' },
	{ level: 7, pool: ALL, minGap: 2, ask: 'heavy' },
	{ level: 8, pool: MID, minGap: 3, ask: 'light' },
	{ level: 9, pool: ALL, minGap: 2, ask: 'light' },
	{ level: 10, pool: ALL, minGap: 2, ask: 'light' }
];

export function getWeightLevel(level: number): WeightLevelConfig | undefined {
	return WEIGHT_LEVELS.find((entry) => entry.level === level);
}

export function correctSide(round: WeightRound, ask: WeightAsk): WeightSide {
	const leftRank = WEIGHT_RANK[round.left];
	const rightRank = WEIGHT_RANK[round.right];
	const leftHeavier = leftRank > rightRank;
	if (ask === 'heavy') return leftHeavier ? 'left' : 'right';
	return leftHeavier ? 'right' : 'left';
}

function shuffled<T>(items: T[], rand: () => number): T[] {
	const copy = [...items];
	for (let i = copy.length - 1; i > 0; i--) {
		const j = Math.floor(rand() * (i + 1));
		[copy[i], copy[j]] = [copy[j], copy[i]];
	}
	return copy;
}

function allPairs(config: WeightLevelConfig): WeightRound[] {
	const pairs: WeightRound[] = [];
	for (let i = 0; i < config.pool.length; i++) {
		for (let j = i + 1; j < config.pool.length; j++) {
			const a = config.pool[i];
			const b = config.pool[j];
			const gap = Math.abs(WEIGHT_RANK[a] - WEIGHT_RANK[b]);
			if (gap < config.minGap) continue;
			pairs.push({ left: a, right: b });
			pairs.push({ left: b, right: a });
		}
	}
	return pairs;
}

/** Three unequal object pairs. Sides are never the same mass. */
export function pickRounds(
	config: WeightLevelConfig,
	rand: () => number = Math.random
): WeightRound[] {
	return shuffled(allPairs(config), rand).slice(0, WEIGHT_ROUNDS);
}
