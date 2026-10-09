/**
 * Pure rules for "Odd one out". Four pictures, three the same.
 * The child taps the one that is different. Later levels use a
 * look-alike (pear next to apples, tired next to sad).
 */

import type { ColorId, ShapeId } from './color-shapes.js';
import type { EmotionId } from './feelings.js';
import { CLOSE_FEELINGS } from './feelings.js';

export type OddKind = 'fruit' | 'color' | 'shape' | 'feeling';

export interface OddCard {
	id: string;
	key: string;
}

export interface OddBoard {
	kind: OddKind;
	cards: OddCard[];
	oddKey: string;
	/** Shared color when the difference is the shape. */
	color: ColorId;
	/** Shared shape when the difference is the color. */
	shape: ShapeId;
}

export interface OddLevelConfig {
	level: number;
	kind: OddKind;
	pool: string[];
	/** The different picture is a look-alike of the other three. */
	close: boolean;
	color: ColorId;
	shape: ShapeId;
}

export const MAX_ODD_LEVEL = 10;
export const ODD_ROUNDS = 3;

export const ODD_LEVELS: OddLevelConfig[] = [
	{
		level: 1,
		kind: 'fruit',
		pool: ['apple', 'banana', 'grapes', 'watermelon'],
		close: false,
		color: 'red',
		shape: 'circle'
	},
	{
		level: 2,
		kind: 'fruit',
		pool: ['apple', 'orange', 'lemon', 'strawberry'],
		close: false,
		color: 'red',
		shape: 'circle'
	},
	{
		level: 3,
		kind: 'color',
		pool: ['red', 'blue', 'yellow', 'green'],
		close: false,
		color: 'red',
		shape: 'circle'
	},
	{
		level: 4,
		kind: 'shape',
		pool: ['circle', 'star', 'heart', 'triangle'],
		close: false,
		color: 'red',
		shape: 'circle'
	},
	{
		level: 5,
		kind: 'feeling',
		pool: ['happy', 'sad', 'angry', 'surprised'],
		close: false,
		color: 'red',
		shape: 'circle'
	},
	{
		level: 6,
		kind: 'fruit',
		pool: ['apple', 'pear', 'orange', 'peach', 'cherry', 'strawberry'],
		close: true,
		color: 'red',
		shape: 'circle'
	},
	{
		level: 7,
		kind: 'color',
		pool: ['red', 'orange', 'blue', 'purple', 'yellow', 'green'],
		close: true,
		color: 'red',
		shape: 'circle'
	},
	{
		level: 8,
		kind: 'shape',
		pool: ['circle', 'square', 'triangle'],
		close: true,
		color: 'blue',
		shape: 'circle'
	},
	{
		level: 9,
		kind: 'feeling',
		pool: ['sad', 'tired', 'scared', 'angry'],
		close: true,
		color: 'red',
		shape: 'circle'
	},
	{
		level: 10,
		kind: 'feeling',
		pool: ['happy', 'sad', 'angry', 'scared', 'surprised', 'tired'],
		close: true,
		color: 'red',
		shape: 'circle'
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

const COLOR_CLOSE: Record<string, string> = {
	red: 'orange',
	orange: 'red',
	yellow: 'orange',
	green: 'yellow',
	blue: 'purple',
	purple: 'blue'
};

const SHAPE_CLOSE: Record<string, string> = {
	circle: 'square',
	square: 'circle',
	triangle: 'square',
	star: 'heart',
	heart: 'star'
};

export function getOddLevel(level: number): OddLevelConfig | undefined {
	return ODD_LEVELS.find((entry) => entry.level === level);
}

/** The look-alike used when a level wants a close difference. */
export function closePartner(kind: OddKind, key: string): string | undefined {
	if (kind === 'feeling') return CLOSE_FEELINGS[key as EmotionId]?.[0];
	if (kind === 'fruit') return FRUIT_CLOSE[key];
	if (kind === 'color') return COLOR_CLOSE[key];
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

function boardFor(
	config: OddLevelConfig,
	common: string,
	rand: () => number,
	round: number
): OddBoard {
	const partner = closePartner(config.kind, common);
	const others = config.pool.filter((item) => item !== common);
	const far = others.filter((item) => item !== partner);
	let odd: string;
	if (config.close && partner && partner !== common) {
		odd = partner;
	} else {
		const choices = far.length > 0 ? far : others;
		odd = choices[Math.floor(rand() * choices.length)] ?? others[0];
	}
	const cards: OddCard[] = shuffled(
		[
			{ id: `${round}-a`, key: common },
			{ id: `${round}-b`, key: common },
			{ id: `${round}-c`, key: common },
			{ id: `${round}-odd`, key: odd }
		],
		rand
	);
	return {
		kind: config.kind,
		cards,
		oddKey: odd,
		color: config.color,
		shape: config.shape
	};
}

/** Three boards. Each has three matching pictures and one different one. */
export function makeBoards(config: OddLevelConfig, rand: () => number = Math.random): OddBoard[] {
	const commons = shuffled(config.pool, rand).slice(0, ODD_ROUNDS);
	return commons.map((common, round) => boardFor(config, common, rand, round));
}

export function isOddCard(board: OddBoard, card: OddCard): boolean {
	return card.key === board.oddKey;
}
