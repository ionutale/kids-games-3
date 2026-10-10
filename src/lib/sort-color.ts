/**
 * Pure rules for "Sort by color". Loose colored shapes are shown.
 * The child puts each one in the matching color group.
 */

import type { ColorId, ShapeId } from './color-shapes.js';

export interface SortItem {
	id: string;
	color: ColorId;
	shape: ShapeId;
}

export interface SortRound {
	buckets: ColorId[];
	items: SortItem[];
}

export interface SortLevelConfig {
	level: number;
	colors: ColorId[];
	shapes: ShapeId[];
	bucketCount: number;
	itemCount: number;
}

export const MAX_SORT_LEVEL = 10;
export const SORT_ROUNDS = 3;

const BASIC: ColorId[] = ['red', 'blue', 'yellow', 'green'];
const MORE: ColorId[] = ['red', 'blue', 'yellow', 'green', 'orange'];
const ALL: ColorId[] = ['red', 'blue', 'yellow', 'green', 'orange', 'purple'];

export const SORT_LEVELS: SortLevelConfig[] = [
	{ level: 1, colors: ['red', 'blue'], shapes: ['circle'], bucketCount: 2, itemCount: 2 },
	{ level: 2, colors: ['red', 'blue', 'yellow'], shapes: ['circle'], bucketCount: 2, itemCount: 3 },
	{ level: 3, colors: BASIC, shapes: ['circle', 'square'], bucketCount: 3, itemCount: 3 },
	{
		level: 4,
		colors: BASIC,
		shapes: ['circle', 'square', 'triangle'],
		bucketCount: 3,
		itemCount: 4
	},
	{
		level: 5,
		colors: MORE,
		shapes: ['circle', 'square', 'triangle'],
		bucketCount: 4,
		itemCount: 4
	},
	{ level: 6, colors: MORE, shapes: ['circle', 'square', 'star'], bucketCount: 4, itemCount: 5 },
	{
		level: 7,
		colors: MORE,
		shapes: ['circle', 'square', 'triangle', 'star'],
		bucketCount: 4,
		itemCount: 6
	},
	{
		level: 8,
		colors: ALL,
		shapes: ['circle', 'square', 'triangle', 'star'],
		bucketCount: 5,
		itemCount: 5
	},
	{
		level: 9,
		colors: ALL,
		shapes: ['circle', 'square', 'triangle', 'star', 'heart'],
		bucketCount: 5,
		itemCount: 6
	},
	{
		level: 10,
		colors: ALL,
		shapes: ['circle', 'square', 'triangle', 'star', 'heart'],
		bucketCount: 6,
		itemCount: 6
	}
];

export function getSortLevel(level: number): SortLevelConfig | undefined {
	return SORT_LEVELS.find((entry) => entry.level === level);
}

function shuffled<T>(items: T[], rand: () => number): T[] {
	const copy = [...items];
	for (let i = copy.length - 1; i > 0; i--) {
		const j = Math.floor(rand() * (i + 1));
		[copy[i], copy[j]] = [copy[j], copy[i]];
	}
	return copy;
}

function colorCounts(buckets: ColorId[], itemCount: number, rand: () => number): ColorId[] {
	const colors: ColorId[] = [...buckets];
	while (colors.length < itemCount) {
		colors.push(buckets[Math.floor(rand() * buckets.length)]);
	}
	return shuffled(colors, rand).slice(0, itemCount);
}

/** Three sorting boards. Every item has a matching bucket. */
export function pickRounds(config: SortLevelConfig, rand: () => number = Math.random): SortRound[] {
	return Array.from({ length: SORT_ROUNDS }, (_, roundIndex) => {
		const buckets = shuffled(config.colors, rand).slice(0, config.bucketCount);
		const colors = colorCounts(buckets, config.itemCount, rand);
		const shapes = shuffled(config.shapes, rand);
		const items = colors.map((color, index) => ({
			id: `${roundIndex}-${index}`,
			color,
			shape: shapes[index % shapes.length]
		}));
		return { buckets, items: shuffled(items, rand) };
	});
}
