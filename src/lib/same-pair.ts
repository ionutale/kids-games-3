/**
 * Pure rules for "Same or not". Two pictures are shown.
 * The child taps whether they match.
 */

import type { ColorId, ShapeId } from './color-shapes.js';
import type { FruitId } from './count-fruit.js';
import type { EmotionId } from './feelings.js';
import { CLOSE_FEELINGS } from './feelings.js';

export type PairKind = 'fruit' | 'shape' | 'color' | 'feeling';

export interface SameRound {
	kind: PairKind;
	left: string;
	right: string;
	same: boolean;
}

export interface SameLevelConfig {
	level: number;
	kinds: PairKind[];
	tight: boolean;
	fruits: FruitId[];
	shapes: ShapeId[];
	colors: ColorId[];
	emotions: EmotionId[];
}

export const MAX_SAME_LEVEL = 10;
export const SAME_ROUNDS = 3;

const EASY_FRUIT: FruitId[] = ['apple', 'banana', 'grapes', 'watermelon'];
const CLOSE_FRUIT: FruitId[] = ['apple', 'pear', 'orange', 'peach', 'cherry', 'strawberry'];
const EASY_SHAPE: ShapeId[] = ['circle', 'star', 'heart', 'triangle'];
const ALL_SHAPE: ShapeId[] = ['circle', 'square', 'triangle', 'star', 'heart'];
const EASY_COLOR: ColorId[] = ['red', 'blue', 'yellow', 'green'];
const CLOSE_COLOR: ColorId[] = ['red', 'orange', 'blue', 'purple', 'yellow', 'green'];
const EASY_FEEL: EmotionId[] = ['happy', 'sad', 'angry', 'surprised'];
const ALL_FEEL: EmotionId[] = ['happy', 'sad', 'angry', 'scared', 'surprised', 'tired'];

export const SAME_LEVELS: SameLevelConfig[] = [
	{
		level: 1,
		kinds: ['fruit', 'fruit', 'fruit'],
		tight: false,
		fruits: EASY_FRUIT,
		shapes: EASY_SHAPE,
		colors: EASY_COLOR,
		emotions: EASY_FEEL
	},
	{
		level: 2,
		kinds: ['fruit', 'fruit', 'fruit'],
		tight: false,
		fruits: [...EASY_FRUIT, 'orange', 'lemon'],
		shapes: EASY_SHAPE,
		colors: EASY_COLOR,
		emotions: EASY_FEEL
	},
	{
		level: 3,
		kinds: ['shape', 'shape', 'shape'],
		tight: false,
		fruits: EASY_FRUIT,
		shapes: EASY_SHAPE,
		colors: EASY_COLOR,
		emotions: EASY_FEEL
	},
	{
		level: 4,
		kinds: ['color', 'color', 'color'],
		tight: false,
		fruits: EASY_FRUIT,
		shapes: EASY_SHAPE,
		colors: EASY_COLOR,
		emotions: EASY_FEEL
	},
	{
		level: 5,
		kinds: ['feeling', 'feeling', 'feeling'],
		tight: false,
		fruits: EASY_FRUIT,
		shapes: EASY_SHAPE,
		colors: EASY_COLOR,
		emotions: EASY_FEEL
	},
	{
		level: 6,
		kinds: ['fruit', 'fruit', 'fruit'],
		tight: true,
		fruits: CLOSE_FRUIT,
		shapes: EASY_SHAPE,
		colors: EASY_COLOR,
		emotions: EASY_FEEL
	},
	{
		level: 7,
		kinds: ['shape', 'shape', 'shape'],
		tight: true,
		fruits: EASY_FRUIT,
		shapes: ALL_SHAPE,
		colors: EASY_COLOR,
		emotions: EASY_FEEL
	},
	{
		level: 8,
		kinds: ['color', 'color', 'color'],
		tight: true,
		fruits: EASY_FRUIT,
		shapes: EASY_SHAPE,
		colors: CLOSE_COLOR,
		emotions: EASY_FEEL
	},
	{
		level: 9,
		kinds: ['feeling', 'feeling', 'feeling'],
		tight: true,
		fruits: EASY_FRUIT,
		shapes: EASY_SHAPE,
		colors: EASY_COLOR,
		emotions: ALL_FEEL
	},
	{
		level: 10,
		kinds: ['fruit', 'shape', 'feeling'],
		tight: true,
		fruits: CLOSE_FRUIT,
		shapes: ALL_SHAPE,
		colors: CLOSE_COLOR,
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

const COLOR_CLOSE: Record<string, string> = {
	red: 'orange',
	orange: 'red',
	yellow: 'orange',
	green: 'yellow',
	blue: 'purple',
	purple: 'blue'
};

export function getSameLevel(level: number): SameLevelConfig | undefined {
	return SAME_LEVELS.find((entry) => entry.level === level);
}

export function closePartner(kind: PairKind, key: string): string | undefined {
	if (kind === 'feeling') return CLOSE_FEELINGS[key as EmotionId]?.[0];
	if (kind === 'fruit') return FRUIT_CLOSE[key];
	if (kind === 'shape') return SHAPE_CLOSE[key];
	return COLOR_CLOSE[key];
}

function shuffled<T>(items: T[], rand: () => number): T[] {
	const copy = [...items];
	for (let i = copy.length - 1; i > 0; i--) {
		const j = Math.floor(rand() * (i + 1));
		[copy[i], copy[j]] = [copy[j], copy[i]];
	}
	return copy;
}

function poolFor(config: SameLevelConfig, kind: PairKind): string[] {
	if (kind === 'fruit') return config.fruits;
	if (kind === 'shape') return config.shapes;
	if (kind === 'color') return config.colors;
	return config.emotions;
}

function otherOf(
	pool: string[],
	left: string,
	kind: PairKind,
	tight: boolean,
	rand: () => number
): string {
	const partner = closePartner(kind, left);
	const far = pool.filter((item) => item !== left && item !== partner);
	if (tight && partner && partner !== left) return partner;
	const choices = far.length > 0 ? far : pool.filter((item) => item !== left);
	return choices[Math.floor(rand() * choices.length)] ?? left;
}

/** Three pairs. At least one match and one mismatch. */
export function pickSameRounds(
	config: SameLevelConfig,
	rand: () => number = Math.random
): SameRound[] {
	const flags = shuffled([true, false, rand() < 0.5], rand);
	return config.kinds.map((kind, index) => {
		const pool = shuffled(poolFor(config, kind), rand);
		const left = pool[index % pool.length];
		const same = flags[index];
		const right = same ? left : otherOf(pool, left, kind, config.tight, rand);
		return { kind, left, right, same: left === right };
	});
}
