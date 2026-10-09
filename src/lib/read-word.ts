/**
 * Pure rules for "Read the word". The child sees a word and taps
 * the matching picture. Later levels use look-alike words.
 */

import type { FruitId } from './count-fruit.js';
import type { ShapeId } from './color-shapes.js';
import type { EmotionId } from './feelings.js';
import { CLOSE_FEELINGS } from './feelings.js';

export type ReadKind = 'fruit' | 'shape' | 'feeling';

export interface ReadRound {
	kind: ReadKind;
	answer: string;
	options: string[];
}

export interface ReadLevelConfig {
	level: number;
	kinds: ReadKind[];
	optionCount: number;
	tight: boolean;
	fruits: FruitId[];
	shapes: ShapeId[];
	emotions: EmotionId[];
}

export const MAX_READ_LEVEL = 10;
export const READ_ROUNDS = 3;

const EASY_FRUIT: FruitId[] = ['apple', 'banana', 'grapes', 'watermelon'];
const CLOSE_FRUIT: FruitId[] = ['apple', 'pear', 'orange', 'peach', 'cherry', 'strawberry'];
const EASY_SHAPE: ShapeId[] = ['circle', 'star', 'heart'];
const ALL_SHAPE: ShapeId[] = ['circle', 'square', 'triangle', 'star', 'heart'];
const EASY_FEEL: EmotionId[] = ['happy', 'sad', 'angry', 'surprised'];
const ALL_FEEL: EmotionId[] = ['happy', 'sad', 'angry', 'scared', 'surprised', 'tired'];

export const READ_LEVELS: ReadLevelConfig[] = [
	{
		level: 1,
		kinds: ['fruit', 'fruit', 'fruit'],
		optionCount: 2,
		tight: false,
		fruits: EASY_FRUIT,
		shapes: EASY_SHAPE,
		emotions: EASY_FEEL
	},
	{
		level: 2,
		kinds: ['fruit', 'fruit', 'fruit'],
		optionCount: 3,
		tight: false,
		fruits: [...EASY_FRUIT, 'orange', 'lemon'],
		shapes: EASY_SHAPE,
		emotions: EASY_FEEL
	},
	{
		level: 3,
		kinds: ['fruit', 'fruit', 'fruit'],
		optionCount: 3,
		tight: true,
		fruits: CLOSE_FRUIT,
		shapes: EASY_SHAPE,
		emotions: EASY_FEEL
	},
	{
		level: 4,
		kinds: ['shape', 'shape', 'shape'],
		optionCount: 2,
		tight: false,
		fruits: EASY_FRUIT,
		shapes: EASY_SHAPE,
		emotions: EASY_FEEL
	},
	{
		level: 5,
		kinds: ['shape', 'shape', 'shape'],
		optionCount: 3,
		tight: false,
		fruits: EASY_FRUIT,
		shapes: ALL_SHAPE,
		emotions: EASY_FEEL
	},
	{
		level: 6,
		kinds: ['feeling', 'feeling', 'feeling'],
		optionCount: 2,
		tight: false,
		fruits: EASY_FRUIT,
		shapes: EASY_SHAPE,
		emotions: EASY_FEEL
	},
	{
		level: 7,
		kinds: ['feeling', 'feeling', 'feeling'],
		optionCount: 3,
		tight: false,
		fruits: EASY_FRUIT,
		shapes: EASY_SHAPE,
		emotions: ALL_FEEL
	},
	{
		level: 8,
		kinds: ['feeling', 'feeling', 'feeling'],
		optionCount: 3,
		tight: true,
		fruits: EASY_FRUIT,
		shapes: EASY_SHAPE,
		emotions: ALL_FEEL
	},
	{
		level: 9,
		kinds: ['fruit', 'shape', 'feeling'],
		optionCount: 3,
		tight: false,
		fruits: EASY_FRUIT,
		shapes: ALL_SHAPE,
		emotions: ALL_FEEL
	},
	{
		level: 10,
		kinds: ['fruit', 'shape', 'feeling'],
		optionCount: 3,
		tight: true,
		fruits: CLOSE_FRUIT,
		shapes: ALL_SHAPE,
		emotions: ALL_FEEL
	}
];

const FRUIT_CLOSE: Record<string, string> = {
	apple: 'pear',
	pear: 'apple',
	orange: 'peach',
	peach: 'orange',
	lemon: 'orange',
	banana: 'lemon',
	strawberry: 'cherry',
	cherry: 'strawberry',
	grapes: 'cherry',
	watermelon: 'apple'
};

const SHAPE_CLOSE: Record<string, string> = {
	circle: 'square',
	square: 'circle',
	triangle: 'square',
	star: 'heart',
	heart: 'star'
};

export function getReadLevel(level: number): ReadLevelConfig | undefined {
	return READ_LEVELS.find((entry) => entry.level === level);
}

export function closePartner(kind: ReadKind, key: string): string | undefined {
	if (kind === 'feeling') return CLOSE_FEELINGS[key as EmotionId]?.[0];
	if (kind === 'fruit') return FRUIT_CLOSE[key];
	return SHAPE_CLOSE[key];
}

function shuffled<T>(items: T[], rand: () => number): T[] {
	const copy = [...items];
	for (let i = copy.length - 1; i > 0; i--) {
		const j = Math.floor(rand() * (i + 1));
		[copy[i], copy[j]] = [copy[j], copy[i]];
	}
	return copy;
}

function poolFor(config: ReadLevelConfig, kind: ReadKind): string[] {
	if (kind === 'fruit') return config.fruits;
	if (kind === 'shape') return config.shapes;
	return config.emotions;
}

function pickOptions(
	pool: string[],
	answer: string,
	count: number,
	partner: string | undefined,
	tight: boolean,
	rand: () => number
): string[] {
	const chosen = [answer];
	if (tight && partner && partner !== answer) chosen.push(partner);
	for (const item of shuffled(
		pool.filter((entry) => !chosen.includes(entry)),
		rand
	)) {
		if (chosen.length >= count) break;
		chosen.push(item);
	}
	return shuffled(chosen, rand);
}

/** Three words. Each answer is among the pictures, with no repeats in a round. */
export function makeRounds(config: ReadLevelConfig, rand: () => number = Math.random): ReadRound[] {
	const order: Record<ReadKind, string[]> = {
		fruit: shuffled(config.fruits, rand),
		shape: shuffled(config.shapes, rand),
		feeling: shuffled(config.emotions, rand)
	};
	const used: Record<ReadKind, number> = { fruit: 0, shape: 0, feeling: 0 };
	return config.kinds.map((kind) => {
		const list = order[kind];
		const answer = list[used[kind] % list.length];
		used[kind] += 1;
		const partner = closePartner(kind, answer);
		return {
			kind,
			answer,
			options: pickOptions(
				poolFor(config, kind),
				answer,
				config.optionCount,
				partner,
				config.tight,
				rand
			)
		};
	});
}
