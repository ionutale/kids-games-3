/**
 * Pure rules for "Recycle sort".
 * See an item. Tap the paper, plastic, or trash bin.
 */

export type BinId = 'paper' | 'plastic' | 'trash';

export type RecycleItem =
	| 'newspaper'
	| 'cardboard'
	| 'bottle'
	| 'cup'
	| 'banana'
	| 'wrapper';

export const ITEM_BIN: Record<RecycleItem, BinId> = {
	newspaper: 'paper',
	cardboard: 'paper',
	bottle: 'plastic',
	cup: 'plastic',
	banana: 'trash',
	wrapper: 'trash'
};

export interface RecycleRound {
	item: RecycleItem;
	answer: BinId;
	options: BinId[];
}

export interface RecycleLevelConfig {
	level: number;
	items: RecycleItem[];
	bins: BinId[];
}

export const MAX_RECYCLE_LEVEL = 10;
export const RECYCLE_ROUNDS = 3;

const PAPER_TRASH: RecycleItem[] = ['newspaper', 'banana'];
const TWO_BINS: RecycleItem[] = ['newspaper', 'cardboard', 'banana', 'wrapper'];
const ALL: RecycleItem[] = ['newspaper', 'cardboard', 'bottle', 'cup', 'banana', 'wrapper'];

export const RECYCLE_LEVELS: RecycleLevelConfig[] = [
	{ level: 1, items: PAPER_TRASH, bins: ['paper', 'trash'] },
	{ level: 2, items: PAPER_TRASH, bins: ['paper', 'trash'] },
	{ level: 3, items: TWO_BINS, bins: ['paper', 'trash'] },
	{ level: 4, items: TWO_BINS, bins: ['paper', 'trash'] },
	{ level: 5, items: ALL, bins: ['paper', 'plastic', 'trash'] },
	{ level: 6, items: ALL, bins: ['paper', 'plastic', 'trash'] },
	{ level: 7, items: ALL, bins: ['paper', 'plastic', 'trash'] },
	{ level: 8, items: ALL, bins: ['paper', 'plastic', 'trash'] },
	{ level: 9, items: ALL, bins: ['paper', 'plastic', 'trash'] },
	{ level: 10, items: ALL, bins: ['paper', 'plastic', 'trash'] }
];

export function getRecycleLevel(level: number): RecycleLevelConfig | undefined {
	return RECYCLE_LEVELS.find((entry) => entry.level === level);
}

function shuffled<T>(items: T[], rand: () => number): T[] {
	const copy = [...items];
	for (let i = copy.length - 1; i > 0; i--) {
		const j = Math.floor(rand() * (i + 1));
		[copy[i], copy[j]] = [copy[j], copy[i]];
	}
	return copy;
}

export function pickRounds(
	config: RecycleLevelConfig,
	rand: () => number = Math.random
): RecycleRound[] {
	const pool = config.items.filter((item) => config.bins.includes(ITEM_BIN[item]));
	const items = shuffled(pool, rand);
	return Array.from({ length: RECYCLE_ROUNDS }, (_, index) => {
		const item = items[index % items.length];
		return {
			item,
			answer: ITEM_BIN[item],
			options: shuffled(config.bins, rand)
		};
	});
}
