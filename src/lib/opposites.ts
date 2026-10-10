/**
 * Pure rules for "Opposites". The child sees one picture and taps
 * the opposite: happy and sad, big and small, sun and moon, up and down.
 */

import type { FruitId } from './count-fruit.js';
import type { EmotionId } from './feelings.js';

export type OppKind = 'feeling' | 'size' | 'sky' | 'way';
export type Scale = 'big' | 'mid' | 'small';
export type SkyId = 'sun' | 'moon' | 'cloud' | 'star' | 'rainbow';
export type WayId = 'up' | 'down' | 'side' | 'left';

export type OppCard =
	| { id: string; kind: 'feeling'; emotion: EmotionId }
	| { id: string; kind: 'size'; fruit: FruitId; scale: Scale }
	| { id: string; kind: 'sky'; sky: SkyId }
	| { id: string; kind: 'way'; way: WayId };

export interface OppRound {
	prompt: OppCard;
	options: OppCard[];
	answerId: string;
}

export interface OppLevelConfig {
	level: number;
	rounds: OppKind[];
	tight: boolean;
	fruits: FruitId[];
}

export const MAX_OPP_LEVEL = 10;
export const OPP_ROUNDS = 3;

const FRUITS: FruitId[] = ['apple', 'pear', 'orange'];
const LATER: FruitId[] = ['banana', 'grapes', 'strawberry'];

export const OPP_LEVELS: OppLevelConfig[] = [
	{ level: 1, rounds: ['feeling', 'feeling', 'feeling'], tight: false, fruits: FRUITS },
	{ level: 2, rounds: ['feeling', 'feeling', 'feeling'], tight: false, fruits: FRUITS },
	{ level: 3, rounds: ['size', 'size', 'size'], tight: false, fruits: FRUITS },
	{ level: 4, rounds: ['sky', 'sky', 'sky'], tight: false, fruits: FRUITS },
	{ level: 5, rounds: ['way', 'way', 'way'], tight: false, fruits: FRUITS },
	{ level: 6, rounds: ['feeling', 'feeling', 'feeling'], tight: true, fruits: FRUITS },
	{ level: 7, rounds: ['size', 'size', 'size'], tight: true, fruits: LATER },
	{ level: 8, rounds: ['sky', 'sky', 'sky'], tight: true, fruits: FRUITS },
	{ level: 9, rounds: ['feeling', 'size', 'way'], tight: false, fruits: LATER },
	{ level: 10, rounds: ['feeling', 'size', 'sky'], tight: true, fruits: LATER }
];

const FEELING_FAR: EmotionId[] = ['angry', 'scared', 'surprised'];
const FEELING_TIGHT: EmotionId[] = ['surprised', 'tired'];

export function getOppLevel(level: number): OppLevelConfig | undefined {
	return OPP_LEVELS.find((entry) => entry.level === level);
}

function shuffled<T>(items: T[], rand: () => number): T[] {
	const copy = [...items];
	for (let i = copy.length - 1; i > 0; i--) {
		const j = Math.floor(rand() * (i + 1));
		[copy[i], copy[j]] = [copy[j], copy[i]];
	}
	return copy;
}

function feelingRound(index: number, tight: boolean, rand: () => number): OppRound {
	const promptEmotion: EmotionId = index % 2 === 0 ? 'happy' : 'sad';
	const answer: EmotionId = promptEmotion === 'happy' ? 'sad' : 'happy';
	const pool = tight ? FEELING_TIGHT : FEELING_FAR;
	const distractors = shuffled(pool, rand).slice(0, 2);
	const options = shuffled(
		[
			{ id: `${index}-0`, kind: 'feeling' as const, emotion: answer },
			{ id: `${index}-1`, kind: 'feeling' as const, emotion: distractors[0] },
			{ id: `${index}-2`, kind: 'feeling' as const, emotion: distractors[1] }
		],
		rand
	);
	return {
		prompt: { id: `${index}-prompt`, kind: 'feeling', emotion: promptEmotion },
		options,
		answerId: options.find((card) => card.kind === 'feeling' && card.emotion === answer)!.id
	};
}

function sizeRound(index: number, fruits: FruitId[], rand: () => number): OppRound {
	const fruit = fruits[index % fruits.length];
	const promptScale: Scale = index % 2 === 0 ? 'big' : 'small';
	const answerScale: Scale = promptScale === 'big' ? 'small' : 'big';
	const options = shuffled(
		[
			{ id: `${index}-0`, kind: 'size' as const, fruit, scale: answerScale },
			{ id: `${index}-1`, kind: 'size' as const, fruit, scale: 'mid' as const },
			{
				id: `${index}-2`,
				kind: 'size' as const,
				fruit,
				scale: (promptScale === 'big' ? 'big' : 'small') as Scale
			}
		],
		rand
	);
	return {
		prompt: { id: `${index}-prompt`, kind: 'size', fruit, scale: promptScale },
		options,
		answerId: options.find((card) => card.kind === 'size' && card.scale === answerScale)!.id
	};
}

function skyRound(index: number, tight: boolean, rand: () => number): OppRound {
	const promptSky: SkyId = index % 2 === 0 ? 'sun' : 'moon';
	const answerSky: SkyId = promptSky === 'sun' ? 'moon' : 'sun';
	const distractors: SkyId[] = tight ? ['star', 'cloud'] : ['cloud', 'rainbow'];
	const options = shuffled(
		[
			{ id: `${index}-0`, kind: 'sky' as const, sky: answerSky },
			{ id: `${index}-1`, kind: 'sky' as const, sky: distractors[0] },
			{ id: `${index}-2`, kind: 'sky' as const, sky: distractors[1] }
		],
		rand
	);
	return {
		prompt: { id: `${index}-prompt`, kind: 'sky', sky: promptSky },
		options,
		answerId: options.find((card) => card.kind === 'sky' && card.sky === answerSky)!.id
	};
}

function wayRound(index: number, rand: () => number): OppRound {
	const promptWay: WayId = index % 2 === 0 ? 'up' : 'down';
	const answerWay: WayId = promptWay === 'up' ? 'down' : 'up';
	const options = shuffled<OppCard>(
		[
			{ id: `${index}-0`, kind: 'way', way: answerWay },
			{ id: `${index}-1`, kind: 'way', way: 'side' },
			{ id: `${index}-2`, kind: 'way', way: 'left' }
		],
		rand
	);
	return {
		prompt: { id: `${index}-prompt`, kind: 'way', way: promptWay },
		options,
		answerId: options.find((card) => card.kind === 'way' && card.way === answerWay)!.id
	};
}

/** Three rounds. The answer is the opposite, and it is one of the choices. */
export function makeRounds(config: OppLevelConfig, rand: () => number = Math.random): OppRound[] {
	return config.rounds.map((kind, index) => {
		if (kind === 'feeling') return feelingRound(index, config.tight, rand);
		if (kind === 'size') return sizeRound(index, config.fruits, rand);
		if (kind === 'sky') return skyRound(index, config.tight, rand);
		return wayRound(index, rand);
	});
}
