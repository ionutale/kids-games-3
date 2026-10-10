/**
 * Pure rules for "Sort by kind".
 * Loose pictures (animals, food, toys) go into matching category buckets.
 */

export type KindId = 'animal' | 'food' | 'toy';

export type KindFaceId =
	| 'cat'
	| 'dog'
	| 'bird'
	| 'fish'
	| 'bunny'
	| 'bear'
	| 'apple'
	| 'banana'
	| 'carrot'
	| 'bread'
	| 'cookie'
	| 'cheese'
	| 'ball'
	| 'block'
	| 'car'
	| 'doll'
	| 'kite'
	| 'drum';

export interface KindItem {
	id: string;
	kind: KindId;
	face: KindFaceId;
}

export interface KindRound {
	buckets: KindId[];
	items: KindItem[];
}

export interface KindLevelConfig {
	level: number;
	kinds: KindId[];
	bucketCount: number;
	itemCount: number;
	/** Faces available per kind for this level. */
	faces: Record<KindId, KindFaceId[]>;
}

export const MAX_KIND_LEVEL = 10;
export const KIND_ROUNDS = 3;

const ANIMALS: KindFaceId[] = ['cat', 'dog', 'bird', 'fish', 'bunny', 'bear'];
const FOODS: KindFaceId[] = ['apple', 'banana', 'carrot', 'bread', 'cookie', 'cheese'];
const TOYS: KindFaceId[] = ['ball', 'block', 'car', 'doll', 'kite', 'drum'];

const EARLY_FACES: Record<KindId, KindFaceId[]> = {
	animal: ['cat', 'dog', 'bird', 'fish'],
	food: ['apple', 'banana', 'carrot', 'bread'],
	toy: ['ball', 'block', 'car', 'doll']
};

const ALL_FACES: Record<KindId, KindFaceId[]> = {
	animal: ANIMALS,
	food: FOODS,
	toy: TOYS
};

export const KIND_LEVELS: KindLevelConfig[] = [
	{
		level: 1,
		kinds: ['animal', 'food'],
		bucketCount: 2,
		itemCount: 2,
		faces: EARLY_FACES
	},
	{
		level: 2,
		kinds: ['animal', 'food'],
		bucketCount: 2,
		itemCount: 3,
		faces: EARLY_FACES
	},
	{
		level: 3,
		kinds: ['animal', 'food', 'toy'],
		bucketCount: 3,
		itemCount: 3,
		faces: EARLY_FACES
	},
	{
		level: 4,
		kinds: ['animal', 'food', 'toy'],
		bucketCount: 3,
		itemCount: 4,
		faces: EARLY_FACES
	},
	{
		level: 5,
		kinds: ['animal', 'food', 'toy'],
		bucketCount: 3,
		itemCount: 5,
		faces: EARLY_FACES
	},
	{
		level: 6,
		kinds: ['animal', 'food', 'toy'],
		bucketCount: 3,
		itemCount: 6,
		faces: EARLY_FACES
	},
	{
		level: 7,
		kinds: ['animal', 'food', 'toy'],
		bucketCount: 3,
		itemCount: 6,
		faces: ALL_FACES
	},
	{
		level: 8,
		kinds: ['animal', 'food', 'toy'],
		bucketCount: 3,
		itemCount: 7,
		faces: ALL_FACES
	},
	{
		level: 9,
		kinds: ['animal', 'food', 'toy'],
		bucketCount: 3,
		itemCount: 8,
		faces: ALL_FACES
	},
	{
		level: 10,
		kinds: ['animal', 'food', 'toy'],
		bucketCount: 3,
		itemCount: 8,
		faces: ALL_FACES
	}
];

export function getKindLevel(level: number): KindLevelConfig | undefined {
	return KIND_LEVELS.find((entry) => entry.level === level);
}

function shuffled<T>(items: T[], rand: () => number): T[] {
	const copy = [...items];
	for (let i = copy.length - 1; i > 0; i--) {
		const j = Math.floor(rand() * (i + 1));
		[copy[i], copy[j]] = [copy[j], copy[i]];
	}
	return copy;
}

/** At least one of each bucket, then fill to itemCount. */
function kindCounts(buckets: KindId[], itemCount: number, rand: () => number): KindId[] {
	const kinds: KindId[] = [...buckets];
	while (kinds.length < itemCount) {
		kinds.push(buckets[Math.floor(rand() * buckets.length)]);
	}
	return shuffled(kinds, rand).slice(0, itemCount);
}

function pickFace(
	kind: KindId,
	faces: KindFaceId[],
	used: Set<KindFaceId>,
	rand: () => number
): KindFaceId {
	const fresh = faces.filter((face) => !used.has(face));
	const pool = fresh.length > 0 ? fresh : faces;
	return pool[Math.floor(rand() * pool.length)];
}

/** Three sorting boards. Every item has a matching bucket. */
export function pickRounds(config: KindLevelConfig, rand: () => number = Math.random): KindRound[] {
	return Array.from({ length: KIND_ROUNDS }, (_, roundIndex) => {
		const buckets = shuffled(config.kinds, rand).slice(0, config.bucketCount);
		const kinds = kindCounts(buckets, config.itemCount, rand);
		const used = new Set<KindFaceId>();
		const items = kinds.map((kind, index) => {
			const face = pickFace(kind, config.faces[kind], used, rand);
			used.add(face);
			return {
				id: `${roundIndex}-${index}`,
				kind,
				face
			};
		});
		return { buckets, items: shuffled(items, rand) };
	});
}
