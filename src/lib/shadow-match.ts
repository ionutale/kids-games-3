/**
 * Pure rules for "Shadow match". A silhouette is shown.
 * The child taps the matching colored picture.
 */

import type { ColorId, ShapeId } from './color-shapes.js';
import type { FruitId } from './count-fruit.js';
import type { EmotionId } from './feelings.js';
import { CLOSE_FEELINGS } from './feelings.js';

export type ShadowKind = 'fruit' | 'shape' | 'feeling';

export interface ShadowRound {
	kind: ShadowKind;
	answer: string;
	options: string[];
	/** Shared color for shape options and the silhouette. */
	color: ColorId;
}

export interface ShadowLevelConfig {
	level: number;
	kinds: ShadowKind[];
	optionCount: number;
	tight: boolean;
	fruits: FruitId[];
	shapes: ShapeId[];
	emotions: EmotionId[];
	color: ColorId;
}

export const MAX_SHADOW_LEVEL = 10;
export const SHADOW_ROUNDS = 3;

const EASY_FRUIT: FruitId[] = ['apple', 'banana', 'grapes', 'watermelon'];
const CLOSE_FRUIT: FruitId[] = ['apple', 'pear', 'orange', 'peach', 'cherry', 'strawberry'];
const EASY_SHAPE: ShapeId[] = ['circle', 'star', 'heart', 'triangle'];
const ALL_SHAPE: ShapeId[] = ['circle', 'square', 'triangle', 'star', 'heart'];
const EASY_FEEL: EmotionId[] = ['happy', 'sad', 'angry', 'surprised'];
const ALL_FEEL: EmotionId[] = ['happy', 'sad', 'angry', 'scared', 'surprised', 'tired'];

export const SHADOW_LEVELS: ShadowLevelConfig[] = [
	{
		level: 1,
		kinds: ['fruit', 'fruit', 'fruit'],
		optionCount: 2,
		tight: false,
		fruits: EASY_FRUIT,
		shapes: EASY_SHAPE,
		emotions: EASY_FEEL,
		color: 'yellow'
	},
	{
		level: 2,
		kinds: ['fruit', 'fruit', 'fruit'],
		optionCount: 3,
		tight: false,
		fruits: [...EASY_FRUIT, 'orange', 'lemon'],
		shapes: EASY_SHAPE,
		emotions: EASY_FEEL,
		color: 'yellow'
	},
	{
		level: 3,
		kinds: ['shape', 'shape', 'shape'],
		optionCount: 2,
		tight: false,
		fruits: EASY_FRUIT,
		shapes: EASY_SHAPE,
		emotions: EASY_FEEL,
		color: 'blue'
	},
	{
		level: 4,
		kinds: ['shape', 'shape', 'shape'],
		optionCount: 3,
		tight: false,
		fruits: EASY_FRUIT,
		shapes: ALL_SHAPE,
		emotions: EASY_FEEL,
		color: 'green'
	},
	{
		level: 5,
		kinds: ['feeling', 'feeling', 'feeling'],
		optionCount: 2,
		tight: false,
		fruits: EASY_FRUIT,
		shapes: EASY_SHAPE,
		emotions: EASY_FEEL,
		color: 'yellow'
	},
	{
		level: 6,
		kinds: ['fruit', 'fruit', 'fruit'],
		optionCount: 3,
		tight: true,
		fruits: CLOSE_FRUIT,
		shapes: EASY_SHAPE,
		emotions: EASY_FEEL,
		color: 'yellow'
	},
	{
		level: 7,
		kinds: ['shape', 'shape', 'shape'],
		optionCount: 3,
		tight: true,
		fruits: EASY_FRUIT,
		shapes: ALL_SHAPE,
		emotions: EASY_FEEL,
		color: 'orange'
	},
	{
		level: 8,
		kinds: ['feeling', 'feeling', 'feeling'],
		optionCount: 3,
		tight: true,
		fruits: EASY_FRUIT,
		shapes: EASY_SHAPE,
		emotions: ALL_FEEL,
		color: 'yellow'
	},
	{
		level: 9,
		kinds: ['fruit', 'shape', 'feeling'],
		optionCount: 3,
		tight: false,
		fruits: EASY_FRUIT,
		shapes: ALL_SHAPE,
		emotions: ALL_FEEL,
		color: 'purple'
	},
	{
		level: 10,
		kinds: ['fruit', 'shape', 'feeling'],
		optionCount: 3,
		tight: true,
		fruits: CLOSE_FRUIT,
		shapes: ALL_SHAPE,
		emotions: ALL_FEEL,
		color: 'red'
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

export function getShadowLevel(level: number): ShadowLevelConfig | undefined {
	return SHADOW_LEVELS.find((entry) => entry.level === level);
}

export function closePartner(kind: ShadowKind, key: string): string | undefined {
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

function poolFor(config: ShadowLevelConfig, kind: ShadowKind): string[] {
	if (kind === 'fruit') return config.fruits;
	if (kind === 'shape') return config.shapes;
	return config.emotions;
}

function optionsFor(
	kind: ShadowKind,
	answer: string,
	pool: string[],
	count: number,
	tight: boolean,
	rand: () => number
): string[] {
	const partner = closePartner(kind, answer);
	const others = pool.filter((item) => item !== answer);
	const near = partner && others.includes(partner) ? [partner] : [];
	const far = others.filter((item) => item !== partner);
	const ordered = tight
		? [...near, ...shuffled(far, rand)]
		: [...shuffled(far.length > 0 ? far : others, rand), ...near];
	const picked: string[] = [];
	for (const item of ordered) {
		if (picked.length >= count - 1) break;
		if (!picked.includes(item)) picked.push(item);
	}
	return shuffled([answer, ...picked], rand);
}

/** Three silhouettes. The answer is the matching picture. */
export function pickRounds(
	config: ShadowLevelConfig,
	rand: () => number = Math.random
): ShadowRound[] {
	return config.kinds.map((kind) => {
		const pool = shuffled(poolFor(config, kind), rand);
		const answer = pool[0];
		return {
			kind,
			answer,
			options: optionsFor(kind, answer, pool, config.optionCount, config.tight, rand),
			color: config.color
		};
	});
}
