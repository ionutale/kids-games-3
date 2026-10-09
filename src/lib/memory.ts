/**
 * Pure rules for "Memory". Each level is one board: every picture appears
 * twice, shuffled. Finding every pair finishes the level.
 */

import type { FruitId } from './count-fruit.js';
import type { ColorId, ShapeId } from './color-shapes.js';

export type MemoryFace =
	{ kind: 'fruit'; fruit: FruitId } | { kind: 'shape'; shape: ShapeId; color: ColorId };

export interface MemoryLevelConfig {
	level: number;
	faces: MemoryFace[];
}

export const MAX_MEMORY_LEVEL = 10;

const fruit = (fruit: FruitId): MemoryFace => ({ kind: 'fruit', fruit });
const shape = (shape: ShapeId, color: ColorId): MemoryFace => ({ kind: 'shape', shape, color });

export const MEMORY_LEVELS: MemoryLevelConfig[] = [
	{ level: 1, faces: [fruit('apple'), fruit('pear')] },
	{ level: 2, faces: [fruit('apple'), fruit('pear'), fruit('orange')] },
	{ level: 3, faces: [shape('circle', 'red'), shape('star', 'blue'), shape('heart', 'yellow')] },
	{
		level: 4,
		faces: [fruit('apple'), fruit('banana'), fruit('grapes'), fruit('lemon')]
	},
	{
		level: 5,
		faces: [
			shape('circle', 'red'),
			shape('square', 'blue'),
			shape('triangle', 'green'),
			shape('star', 'orange')
		]
	},
	{
		level: 6,
		faces: [fruit('apple'), fruit('pear'), fruit('cherry'), fruit('peach'), fruit('watermelon')]
	},
	{
		level: 7,
		faces: [
			shape('circle', 'red'),
			shape('square', 'yellow'),
			shape('triangle', 'blue'),
			shape('star', 'purple'),
			shape('heart', 'green')
		]
	},
	{
		level: 8,
		faces: [
			fruit('apple'),
			fruit('pear'),
			fruit('orange'),
			fruit('banana'),
			fruit('grapes'),
			fruit('lemon')
		]
	},
	{
		level: 9,
		faces: [
			shape('circle', 'red'),
			shape('square', 'blue'),
			shape('triangle', 'yellow'),
			shape('star', 'green'),
			shape('heart', 'purple'),
			shape('circle', 'orange')
		]
	},
	{
		level: 10,
		faces: [
			fruit('apple'),
			fruit('pear'),
			fruit('orange'),
			fruit('banana'),
			fruit('strawberry'),
			fruit('cherry'),
			fruit('peach'),
			fruit('watermelon')
		]
	}
];

export function getMemoryLevel(level: number): MemoryLevelConfig | undefined {
	return MEMORY_LEVELS.find((entry) => entry.level === level);
}

export function faceKey(face: MemoryFace): string {
	return face.kind === 'fruit' ? `fruit:${face.fruit}` : `shape:${face.color}:${face.shape}`;
}

function shuffled<T>(items: T[], rand: () => number): T[] {
	const copy = [...items];
	for (let i = copy.length - 1; i > 0; i--) {
		const j = Math.floor(rand() * (i + 1));
		[copy[i], copy[j]] = [copy[j], copy[i]];
	}
	return copy;
}

/** Two of every face, in play order. */
export function dealMemory(faces: MemoryFace[], rand: () => number = Math.random): MemoryFace[] {
	return shuffled([...faces, ...faces], rand);
}

export function pairCounts(faces: MemoryFace[]): Map<string, number> {
	const counts = new Map<string, number>();
	for (const face of faces) {
		const key = faceKey(face);
		counts.set(key, (counts.get(key) ?? 0) + 1);
	}
	return counts;
}
