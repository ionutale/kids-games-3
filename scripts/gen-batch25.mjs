#!/usr/bin/env node
/**
 * Generate binary/ternary classify games + special math/literacy pages for batch 25.
 */
import { mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;

/** @typedef {{ id: string, answer: string }} Scene */

function shuffledCode() {
	return `function shuffled<T>(items: T[], rand: () => number): T[] {
	const copy = [...items];
	for (let i = copy.length - 1; i > 0; i--) {
		const j = Math.floor(rand() * (i + 1));
		[copy[i], copy[j]] = [copy[j], copy[i]];
	}
	return copy;
}`;
}

function writeBinaryGame({
	slug,
	typeName,
	sceneType,
	answerType,
	answers,
	scenes,
	early,
	mid,
	all,
	title
}) {
	const P = slug
		.split('-')
		.map((p) => p[0].toUpperCase() + p.slice(1))
		.join('');
	const U = slug.replace(/-/g, '_').toUpperCase();
	const sceneUnion = scenes.map((s) => `'${s.id}'`).join(' | ');
	const answerUnion = answers.map((a) => `'${a}'`).join(' | ');
	const mapEntries = scenes.map((s) => `\t${/'/.test(s.id) ? `'${s.id}'` : s.id}: '${s.answer}'`).join(',\n');
	// fix keys that need quotes
	const mapLines = scenes
		.map((s) => {
			const key = /[^a-zA-Z0-9_]/.test(s.id) ? `'${s.id}'` : s.id;
			return `\t${key}: '${s.answer}'`;
		})
		.join(',\n');

	const ts = `/**
 * Pure rules for "${title}".
 */

export type ${answerType} = ${answerUnion};
export type ${sceneType} = ${sceneUnion};

export const SCENE_ANSWER: Record<${sceneType}, ${answerType}> = {
${mapLines}
};

export interface ${P}Round {
	scene: ${sceneType};
	answer: ${answerType};
	options: ${answerType}[];
}

export interface ${P}LevelConfig {
	level: number;
	scenes: ${sceneType}[];
}

export const MAX_${U}_LEVEL = 10;
export const ${U}_ROUNDS = 3;

const EARLY: ${sceneType}[] = [${early.map((s) => `'${s}'`).join(', ')}];
const MID: ${sceneType}[] = [${mid.map((s) => `'${s}'`).join(', ')}];
const ALL: ${sceneType}[] = [${all.map((s) => `'${s}'`).join(', ')}];

export const ${U}_LEVELS: ${P}LevelConfig[] = [
	{ level: 1, scenes: EARLY },
	{ level: 2, scenes: EARLY },
	{ level: 3, scenes: EARLY },
	{ level: 4, scenes: MID },
	{ level: 5, scenes: MID },
	{ level: 6, scenes: MID },
	{ level: 7, scenes: ALL },
	{ level: 8, scenes: ALL },
	{ level: 9, scenes: ALL },
	{ level: 10, scenes: ALL }
];

export function get${P}Level(level: number): ${P}LevelConfig | undefined {
	return ${U}_LEVELS.find((entry) => entry.level === level);
}

${shuffledCode()}

export function pickRounds(
	config: ${P}LevelConfig,
	rand: () => number = Math.random
): ${P}Round[] {
	const scenes = shuffled(config.scenes, rand);
	return Array.from({ length: ${U}_ROUNDS }, (_, index) => {
		const scene = scenes[index % scenes.length];
		return {
			scene,
			answer: SCENE_ANSWER[scene],
			options: shuffled([${answers.map((a) => `'${a}'`).join(', ')}] as ${answerType}[], rand)
		};
	});
}
`;
	const test = `import { describe, expect, test } from 'vitest';
import { SCENE_ANSWER, ${U}_ROUNDS, get${P}Level, pickRounds } from './${slug}';

describe('${slug}', () => {
	test('ten levels and matching answers', () => {
		for (let level = 1; level <= 10; level++) {
			const config = get${P}Level(level)!;
			expect(config).toBeDefined();
			const rounds = pickRounds(config, () => 0.25);
			expect(rounds).toHaveLength(${U}_ROUNDS);
			for (const round of rounds) {
				expect(round.answer).toBe(SCENE_ANSWER[round.scene]);
				expect(round.options).toContain(round.answer);
			}
		}
		expect(get${P}Level(11)).toBeUndefined();
	});
});
`;
	writeFileSync(join(root, `src/lib/${slug}.ts`), ts);
	writeFileSync(join(root, `src/lib/${slug}.test.ts`), test);
	console.log('rules', slug);
}

// --- binary classify catalog ---
const binaries = [
	{
		slug: 'hot-cold',
		typeName: 'HotCold',
		sceneType: 'HotColdScene',
		answerType: 'HotColdId',
		answers: ['hot', 'cold'],
		title: 'Hot / cold',
		scenes: [
			{ id: 'sun', answer: 'hot' },
			{ id: 'soup', answer: 'hot' },
			{ id: 'fire', answer: 'hot' },
			{ id: 'snow', answer: 'cold' },
			{ id: 'ice', answer: 'cold' },
			{ id: 'fridge', answer: 'cold' }
		],
		early: ['sun', 'snow'],
		mid: ['sun', 'soup', 'snow', 'ice'],
		all: ['sun', 'soup', 'fire', 'snow', 'ice', 'fridge']
	},
	{
		slug: 'loud-quiet',
		typeName: 'LoudQuiet',
		sceneType: 'LoudQuietScene',
		answerType: 'LoudQuietId',
		answers: ['loud', 'quiet'],
		title: 'Loud / quiet',
		scenes: [
			{ id: 'drum', answer: 'loud' },
			{ id: 'siren', answer: 'loud' },
			{ id: 'cheer', answer: 'loud' },
			{ id: 'whisper', answer: 'quiet' },
			{ id: 'library', answer: 'quiet' },
			{ id: 'sleep', answer: 'quiet' }
		],
		early: ['drum', 'whisper'],
		mid: ['drum', 'siren', 'whisper', 'library'],
		all: ['drum', 'siren', 'cheer', 'whisper', 'library', 'sleep']
	},
	{
		slug: 'full-empty',
		typeName: 'FullEmpty',
		sceneType: 'FullEmptyScene',
		answerType: 'FullEmptyId',
		answers: ['full', 'empty'],
		title: 'Full / empty',
		scenes: [
			{ id: 'bowl-full', answer: 'full' },
			{ id: 'glass-full', answer: 'full' },
			{ id: 'box-full', answer: 'full' },
			{ id: 'bowl-empty', answer: 'empty' },
			{ id: 'glass-empty', answer: 'empty' },
			{ id: 'box-empty', answer: 'empty' }
		],
		early: ['bowl-full', 'bowl-empty'],
		mid: ['bowl-full', 'glass-full', 'bowl-empty', 'glass-empty'],
		all: ['bowl-full', 'glass-full', 'box-full', 'bowl-empty', 'glass-empty', 'box-empty']
	},
	{
		slug: 'stop-go',
		typeName: 'StopGo',
		sceneType: 'StopGoScene',
		answerType: 'StopGoId',
		answers: ['stop', 'go'],
		title: 'Stop / go',
		scenes: [
			{ id: 'red-light', answer: 'stop' },
			{ id: 'hand-stop', answer: 'stop' },
			{ id: 'closed-gate', answer: 'stop' },
			{ id: 'green-light', answer: 'go' },
			{ id: 'walk', answer: 'go' },
			{ id: 'open-gate', answer: 'go' }
		],
		early: ['red-light', 'green-light'],
		mid: ['red-light', 'hand-stop', 'green-light', 'walk'],
		all: ['red-light', 'hand-stop', 'closed-gate', 'green-light', 'walk', 'open-gate']
	},
	{
		slug: 'living-nonliving',
		typeName: 'LivingNonliving',
		sceneType: 'LivingScene',
		answerType: 'LivingId',
		answers: ['living', 'nonliving'],
		title: 'Living / non-living',
		scenes: [
			{ id: 'cat', answer: 'living' },
			{ id: 'tree', answer: 'living' },
			{ id: 'fish', answer: 'living' },
			{ id: 'rock', answer: 'nonliving' },
			{ id: 'ball', answer: 'nonliving' },
			{ id: 'car', answer: 'nonliving' }
		],
		early: ['cat', 'rock'],
		mid: ['cat', 'tree', 'rock', 'ball'],
		all: ['cat', 'tree', 'fish', 'rock', 'ball', 'car']
	},
	{
		slug: 'hard-soft',
		typeName: 'HardSoft',
		sceneType: 'HardSoftScene',
		answerType: 'HardSoftId',
		answers: ['hard', 'soft'],
		title: 'Hard / soft',
		scenes: [
			{ id: 'rock', answer: 'hard' },
			{ id: 'block', answer: 'hard' },
			{ id: 'key', answer: 'hard' },
			{ id: 'pillow', answer: 'soft' },
			{ id: 'teddy', answer: 'soft' },
			{ id: 'cotton', answer: 'soft' }
		],
		early: ['rock', 'pillow'],
		mid: ['rock', 'block', 'pillow', 'teddy'],
		all: ['rock', 'block', 'key', 'pillow', 'teddy', 'cotton']
	},
	{
		slug: 'rough-smooth',
		typeName: 'RoughSmooth',
		sceneType: 'RoughSmoothScene',
		answerType: 'RoughSmoothId',
		answers: ['rough', 'smooth'],
		title: 'Rough / smooth',
		scenes: [
			{ id: 'bark', answer: 'rough' },
			{ id: 'sandpaper', answer: 'rough' },
			{ id: 'pinecone', answer: 'rough' },
			{ id: 'glass', answer: 'smooth' },
			{ id: 'marble', answer: 'smooth' },
			{ id: 'mirror', answer: 'smooth' }
		],
		early: ['bark', 'glass'],
		mid: ['bark', 'sandpaper', 'glass', 'marble'],
		all: ['bark', 'sandpaper', 'pinecone', 'glass', 'marble', 'mirror']
	},
	{
		slug: 'object-size',
		typeName: 'ObjectSize',
		sceneType: 'ObjectSizeScene',
		answerType: 'ObjectSizeId',
		answers: ['big', 'small'],
		title: 'Big / small',
		scenes: [
			{ id: 'elephant', answer: 'big' },
			{ id: 'house', answer: 'big' },
			{ id: 'truck', answer: 'big' },
			{ id: 'ant', answer: 'small' },
			{ id: 'marble', answer: 'small' },
			{ id: 'seed', answer: 'small' }
		],
		early: ['elephant', 'ant'],
		mid: ['elephant', 'house', 'ant', 'marble'],
		all: ['elephant', 'house', 'truck', 'ant', 'marble', 'seed']
	},
	{
		slug: 'new-old',
		typeName: 'NewOld',
		sceneType: 'NewOldScene',
		answerType: 'NewOldId',
		answers: ['new', 'old'],
		title: 'New / old',
		scenes: [
			{ id: 'shiny-shoe', answer: 'new' },
			{ id: 'gift', answer: 'new' },
			{ id: 'fresh-book', answer: 'new' },
			{ id: 'worn-shoe', answer: 'old' },
			{ id: 'torn-book', answer: 'old' },
			{ id: 'faded-toy', answer: 'old' }
		],
		early: ['shiny-shoe', 'worn-shoe'],
		mid: ['shiny-shoe', 'gift', 'worn-shoe', 'torn-book'],
		all: ['shiny-shoe', 'gift', 'fresh-book', 'worn-shoe', 'torn-book', 'faded-toy']
	},
	{
		slug: 'morning-evening',
		typeName: 'MorningEvening',
		sceneType: 'MorningEveningScene',
		answerType: 'MorningEveningId',
		answers: ['morning', 'evening'],
		title: 'Morning / evening',
		scenes: [
			{ id: 'sunrise', answer: 'morning' },
			{ id: 'breakfast', answer: 'morning' },
			{ id: 'brush-am', answer: 'morning' },
			{ id: 'sunset', answer: 'evening' },
			{ id: 'pajamas', answer: 'evening' },
			{ id: 'bedtime', answer: 'evening' }
		],
		early: ['sunrise', 'sunset'],
		mid: ['sunrise', 'breakfast', 'sunset', 'pajamas'],
		all: ['sunrise', 'breakfast', 'brush-am', 'sunset', 'pajamas', 'bedtime']
	},
	{
		slug: 'clean-dirty',
		typeName: 'CleanDirty',
		sceneType: 'CleanDirtyScene',
		answerType: 'CleanDirtyId',
		answers: ['clean', 'dirty'],
		title: 'Clean / dirty',
		scenes: [
			{ id: 'clean-plate', answer: 'clean' },
			{ id: 'clean-shirt', answer: 'clean' },
			{ id: 'soap', answer: 'clean' },
			{ id: 'messy-plate', answer: 'dirty' },
			{ id: 'muddy-shoes', answer: 'dirty' },
			{ id: 'stain', answer: 'dirty' }
		],
		early: ['clean-plate', 'messy-plate'],
		mid: ['clean-plate', 'clean-shirt', 'messy-plate', 'muddy-shoes'],
		all: ['clean-plate', 'clean-shirt', 'soap', 'messy-plate', 'muddy-shoes', 'stain']
	},
	{
		slug: 'share-keep',
		typeName: 'ShareKeep',
		sceneType: 'ShareKeepScene',
		answerType: 'ShareKeepId',
		answers: ['share', 'keep'],
		title: 'Share / keep',
		scenes: [
			{ id: 'two-kids-toy', answer: 'share' },
			{ id: 'split-snack', answer: 'share' },
			{ id: 'pass-ball', answer: 'share' },
			{ id: 'hug-teddy', answer: 'keep' },
			{ id: 'own-cup', answer: 'keep' },
			{ id: 'private-box', answer: 'keep' }
		],
		early: ['two-kids-toy', 'hug-teddy'],
		mid: ['two-kids-toy', 'split-snack', 'hug-teddy', 'own-cup'],
		all: ['two-kids-toy', 'split-snack', 'pass-ball', 'hug-teddy', 'own-cup', 'private-box']
	},
	{
		slug: 'ask-grab',
		typeName: 'AskGrab',
		sceneType: 'AskGrabScene',
		answerType: 'AskGrabId',
		answers: ['ask', 'grab'],
		title: 'Ask / grab',
		scenes: [
			{ id: 'raise-hand', answer: 'ask' },
			{ id: 'please-cup', answer: 'ask' },
			{ id: 'wait-turn', answer: 'ask' },
			{ id: 'snatch', answer: 'grab' },
			{ id: 'push-in', answer: 'grab' },
			{ id: 'take-without', answer: 'grab' }
		],
		early: ['raise-hand', 'snatch'],
		mid: ['raise-hand', 'please-cup', 'snatch', 'push-in'],
		all: ['raise-hand', 'please-cup', 'wait-turn', 'snatch', 'push-in', 'take-without']
	},
	{
		slug: 'magnet-or-not',
		typeName: 'MagnetOrNot',
		sceneType: 'MagnetScene',
		answerType: 'MagnetId',
		answers: ['magnet', 'not'],
		title: 'Magnet or not',
		scenes: [
			{ id: 'paperclip', answer: 'magnet' },
			{ id: 'key', answer: 'magnet' },
			{ id: 'nail', answer: 'magnet' },
			{ id: 'wood', answer: 'not' },
			{ id: 'plastic', answer: 'not' },
			{ id: 'paper', answer: 'not' }
		],
		early: ['paperclip', 'wood'],
		mid: ['paperclip', 'key', 'wood', 'plastic'],
		all: ['paperclip', 'key', 'nail', 'wood', 'plastic', 'paper']
	},
	{
		slug: 'solid-liquid',
		typeName: 'SolidLiquid',
		sceneType: 'SolidLiquidScene',
		answerType: 'SolidLiquidId',
		answers: ['solid', 'liquid'],
		title: 'Solid / liquid',
		scenes: [
			{ id: 'block', answer: 'solid' },
			{ id: 'rock', answer: 'solid' },
			{ id: 'ice-cube', answer: 'solid' },
			{ id: 'water', answer: 'liquid' },
			{ id: 'juice', answer: 'liquid' },
			{ id: 'milk', answer: 'liquid' }
		],
		early: ['block', 'water'],
		mid: ['block', 'rock', 'water', 'juice'],
		all: ['block', 'rock', 'ice-cube', 'water', 'juice', 'milk']
	},
	{
		slug: 'day-night-animal',
		typeName: 'DayNightAnimal',
		sceneType: 'DnaScene',
		answerType: 'DnaId',
		answers: ['day', 'night'],
		title: 'Day animal / night animal',
		scenes: [
			{ id: 'rooster', answer: 'day' },
			{ id: 'butterfly', answer: 'day' },
			{ id: 'squirrel', answer: 'day' },
			{ id: 'owl', answer: 'night' },
			{ id: 'bat', answer: 'night' },
			{ id: 'firefly', answer: 'night' }
		],
		early: ['rooster', 'owl'],
		mid: ['rooster', 'butterfly', 'owl', 'bat'],
		all: ['rooster', 'butterfly', 'squirrel', 'owl', 'bat', 'firefly']
	},
	{
		slug: 'push-pull',
		typeName: 'PushPull',
		sceneType: 'PushPullScene',
		answerType: 'PushPullId',
		answers: ['push', 'pull'],
		title: 'Push / pull',
		scenes: [
			{ id: 'push-door', answer: 'push' },
			{ id: 'push-swing', answer: 'push' },
			{ id: 'push-cart', answer: 'push' },
			{ id: 'pull-door', answer: 'pull' },
			{ id: 'pull-wagon', answer: 'pull' },
			{ id: 'pull-rope', answer: 'pull' }
		],
		early: ['push-door', 'pull-door'],
		mid: ['push-door', 'push-swing', 'pull-door', 'pull-wagon'],
		all: ['push-door', 'push-swing', 'push-cart', 'pull-door', 'pull-wagon', 'pull-rope']
	},
	{
		slug: 'front-behind',
		typeName: 'FrontBehind',
		sceneType: 'FrontBehindScene',
		answerType: 'FrontBehindId',
		answers: ['front', 'behind'],
		title: 'Front / behind',
		scenes: [
			{ id: 'ball-front', answer: 'front' },
			{ id: 'cat-front', answer: 'front' },
			{ id: 'bike-front', answer: 'front' },
			{ id: 'ball-behind', answer: 'behind' },
			{ id: 'cat-behind', answer: 'behind' },
			{ id: 'bike-behind', answer: 'behind' }
		],
		early: ['ball-front', 'ball-behind'],
		mid: ['ball-front', 'cat-front', 'ball-behind', 'cat-behind'],
		all: ['ball-front', 'cat-front', 'bike-front', 'ball-behind', 'cat-behind', 'bike-behind']
	}
];

for (const g of binaries) writeBinaryGame(g);

// Ternary: in-on-under
writeFileSync(
	join(root, 'src/lib/in-on-under.ts'),
	`/** In / on / under — object + shelf → tap where. */

export type InOnUnderId = 'in' | 'on' | 'under';
export type InOnUnderScene = 'ball-in' | 'apple-in' | 'cup-on' | 'book-on' | 'cat-under' | 'box-under';

export const SCENE_ANSWER: Record<InOnUnderScene, InOnUnderId> = {
	'ball-in': 'in',
	'apple-in': 'in',
	'cup-on': 'on',
	'book-on': 'on',
	'cat-under': 'under',
	'box-under': 'under'
};

export interface InOnUnderRound {
	scene: InOnUnderScene;
	answer: InOnUnderId;
	options: InOnUnderId[];
}

export interface InOnUnderLevelConfig {
	level: number;
	scenes: InOnUnderScene[];
	options: InOnUnderId[];
}

export const MAX_IN_ON_UNDER_LEVEL = 10;
export const IN_ON_UNDER_ROUNDS = 3;

const IN_ON: InOnUnderScene[] = ['ball-in', 'cup-on'];
const MID: InOnUnderScene[] = ['ball-in', 'apple-in', 'cup-on', 'book-on'];
const ALL: InOnUnderScene[] = ['ball-in', 'apple-in', 'cup-on', 'book-on', 'cat-under', 'box-under'];

export const IN_ON_UNDER_LEVELS: InOnUnderLevelConfig[] = [
	{ level: 1, scenes: IN_ON, options: ['in', 'on'] },
	{ level: 2, scenes: IN_ON, options: ['in', 'on'] },
	{ level: 3, scenes: MID, options: ['in', 'on'] },
	{ level: 4, scenes: MID, options: ['in', 'on'] },
	{ level: 5, scenes: ALL, options: ['in', 'on', 'under'] },
	{ level: 6, scenes: ALL, options: ['in', 'on', 'under'] },
	{ level: 7, scenes: ALL, options: ['in', 'on', 'under'] },
	{ level: 8, scenes: ALL, options: ['in', 'on', 'under'] },
	{ level: 9, scenes: ALL, options: ['in', 'on', 'under'] },
	{ level: 10, scenes: ALL, options: ['in', 'on', 'under'] }
];

export function getInOnUnderLevel(level: number): InOnUnderLevelConfig | undefined {
	return IN_ON_UNDER_LEVELS.find((entry) => entry.level === level);
}

${shuffledCode()}

export function pickRounds(
	config: InOnUnderLevelConfig,
	rand: () => number = Math.random
): InOnUnderRound[] {
	const pool = config.scenes.filter((scene) => config.options.includes(SCENE_ANSWER[scene]));
	const scenes = shuffled(pool, rand);
	return Array.from({ length: IN_ON_UNDER_ROUNDS }, (_, index) => {
		const scene = scenes[index % scenes.length];
		return {
			scene,
			answer: SCENE_ANSWER[scene],
			options: shuffled(config.options, rand)
		};
	});
}
`
);

writeFileSync(
	join(root, 'src/lib/in-on-under.test.ts'),
	`import { describe, expect, test } from 'vitest';
import { SCENE_ANSWER, getInOnUnderLevel, pickRounds } from './in-on-under';
describe('in-on-under', () => {
	test('levels', () => {
		for (let level = 1; level <= 10; level++) {
			const config = getInOnUnderLevel(level)!;
			for (const round of pickRounds(config, () => 0.3)) {
				expect(round.answer).toBe(SCENE_ANSWER[round.scene]);
			}
		}
		expect(getInOnUnderLevel(11)).toBeUndefined();
	});
});
`
);

// Math specials
writeFileSync(
	join(root, 'src/lib/double-number.ts'),
	`/** Double — see n → tap 2n. */

export interface DoubleRound {
	shown: number;
	answer: number;
	options: number[];
}

export interface DoubleLevelConfig {
	level: number;
	maxShown: number;
	optionCount: number;
}

export const MAX_DOUBLE_NUMBER_LEVEL = 10;
export const DOUBLE_NUMBER_ROUNDS = 3;

export const DOUBLE_NUMBER_LEVELS: DoubleLevelConfig[] = [
	{ level: 1, maxShown: 3, optionCount: 2 },
	{ level: 2, maxShown: 3, optionCount: 2 },
	{ level: 3, maxShown: 4, optionCount: 3 },
	{ level: 4, maxShown: 5, optionCount: 3 },
	{ level: 5, maxShown: 5, optionCount: 3 },
	{ level: 6, maxShown: 6, optionCount: 4 },
	{ level: 7, maxShown: 7, optionCount: 4 },
	{ level: 8, maxShown: 8, optionCount: 4 },
	{ level: 9, maxShown: 9, optionCount: 5 },
	{ level: 10, maxShown: 10, optionCount: 5 }
];

export function getDoubleNumberLevel(level: number): DoubleLevelConfig | undefined {
	return DOUBLE_NUMBER_LEVELS.find((entry) => entry.level === level);
}

${shuffledCode()}

export function pickRounds(
	config: DoubleLevelConfig,
	rand: () => number = Math.random
): DoubleRound[] {
	return Array.from({ length: DOUBLE_NUMBER_ROUNDS }, () => {
		const shown = 1 + Math.floor(rand() * config.maxShown);
		const answer = shown * 2;
		const distractors: number[] = [];
		for (let n = 1; n <= answer + 4; n++) if (n !== answer) distractors.push(n);
		return {
			shown,
			answer,
			options: shuffled([answer, ...shuffled(distractors, rand).slice(0, config.optionCount - 1)], rand)
		};
	});
}
`
);

writeFileSync(
	join(root, 'src/lib/double-number.test.ts'),
	`import { describe, expect, test } from 'vitest';
import { getDoubleNumberLevel, pickRounds } from './double-number';
describe('double-number', () => {
	test('answer is double', () => {
		for (let level = 1; level <= 10; level++) {
			const config = getDoubleNumberLevel(level)!;
			for (const round of pickRounds(config, () => 0.2)) {
				expect(round.answer).toBe(round.shown * 2);
			}
		}
		expect(getDoubleNumberLevel(11)).toBeUndefined();
	});
});
`
);

writeFileSync(
	join(root, 'src/lib/even-odd.ts'),
	`/** Even / odd — count pile → tap even or odd. */

export type EvenOddId = 'even' | 'odd';

export interface EvenOddRound {
	count: number;
	answer: EvenOddId;
	options: EvenOddId[];
}

export interface EvenOddLevelConfig {
	level: number;
	maxCount: number;
}

export const MAX_EVEN_ODD_LEVEL = 10;
export const EVEN_ODD_ROUNDS = 3;

export const EVEN_ODD_LEVELS: EvenOddLevelConfig[] = [
	{ level: 1, maxCount: 4 },
	{ level: 2, maxCount: 4 },
	{ level: 3, maxCount: 5 },
	{ level: 4, maxCount: 6 },
	{ level: 5, maxCount: 6 },
	{ level: 6, maxCount: 7 },
	{ level: 7, maxCount: 8 },
	{ level: 8, maxCount: 8 },
	{ level: 9, maxCount: 9 },
	{ level: 10, maxCount: 10 }
];

export function getEvenOddLevel(level: number): EvenOddLevelConfig | undefined {
	return EVEN_ODD_LEVELS.find((entry) => entry.level === level);
}

${shuffledCode()}

export function pickRounds(
	config: EvenOddLevelConfig,
	rand: () => number = Math.random
): EvenOddRound[] {
	return Array.from({ length: EVEN_ODD_ROUNDS }, () => {
		const count = 1 + Math.floor(rand() * config.maxCount);
		const answer: EvenOddId = count % 2 === 0 ? 'even' : 'odd';
		return { count, answer, options: shuffled(['even', 'odd'], rand) };
	});
}
`
);

writeFileSync(
	join(root, 'src/lib/even-odd.test.ts'),
	`import { describe, expect, test } from 'vitest';
import { getEvenOddLevel, pickRounds } from './even-odd';
describe('even-odd', () => {
	test('parity', () => {
		for (let level = 1; level <= 10; level++) {
			const config = getEvenOddLevel(level)!;
			for (const round of pickRounds(config, () => 0.35)) {
				expect(round.answer).toBe(round.count % 2 === 0 ? 'even' : 'odd');
			}
		}
		expect(getEvenOddLevel(11)).toBeUndefined();
	});
});
`
);

writeFileSync(
	join(root, 'src/lib/how-many-more.ts'),
	`/** How many more? — two piles → tap the difference (1–3 early). */

export interface HowManyMoreRound {
	left: number;
	right: number;
	answer: number;
	options: number[];
}

export interface HowManyMoreLevelConfig {
	level: number;
	maxCount: number;
	maxDiff: number;
	optionCount: number;
}

export const MAX_HOW_MANY_MORE_LEVEL = 10;
export const HOW_MANY_MORE_ROUNDS = 3;

export const HOW_MANY_MORE_LEVELS: HowManyMoreLevelConfig[] = [
	{ level: 1, maxCount: 4, maxDiff: 1, optionCount: 2 },
	{ level: 2, maxCount: 5, maxDiff: 1, optionCount: 2 },
	{ level: 3, maxCount: 5, maxDiff: 2, optionCount: 3 },
	{ level: 4, maxCount: 6, maxDiff: 2, optionCount: 3 },
	{ level: 5, maxCount: 6, maxDiff: 3, optionCount: 3 },
	{ level: 6, maxCount: 7, maxDiff: 3, optionCount: 3 },
	{ level: 7, maxCount: 8, maxDiff: 3, optionCount: 4 },
	{ level: 8, maxCount: 8, maxDiff: 4, optionCount: 4 },
	{ level: 9, maxCount: 9, maxDiff: 4, optionCount: 4 },
	{ level: 10, maxCount: 10, maxDiff: 5, optionCount: 4 }
];

export function getHowManyMoreLevel(level: number): HowManyMoreLevelConfig | undefined {
	return HOW_MANY_MORE_LEVELS.find((entry) => entry.level === level);
}

${shuffledCode()}

export function pickRounds(
	config: HowManyMoreLevelConfig,
	rand: () => number = Math.random
): HowManyMoreRound[] {
	return Array.from({ length: HOW_MANY_MORE_ROUNDS }, () => {
		const diff = 1 + Math.floor(rand() * config.maxDiff);
		const smaller = 1 + Math.floor(rand() * Math.max(1, config.maxCount - diff));
		const bigger = smaller + diff;
		const flip = rand() < 0.5;
		const left = flip ? bigger : smaller;
		const right = flip ? smaller : bigger;
		const distractors: number[] = [];
		for (let n = 1; n <= config.maxDiff + 2; n++) if (n !== diff) distractors.push(n);
		return {
			left,
			right,
			answer: diff,
			options: shuffled([diff, ...shuffled(distractors, rand).slice(0, config.optionCount - 1)], rand)
		};
	});
}
`
);

writeFileSync(
	join(root, 'src/lib/how-many-more.test.ts'),
	`import { describe, expect, test } from 'vitest';
import { getHowManyMoreLevel, pickRounds } from './how-many-more';
describe('how-many-more', () => {
	test('diff matches piles', () => {
		for (let level = 1; level <= 10; level++) {
			const config = getHowManyMoreLevel(level)!;
			for (const round of pickRounds(config, () => 0.22)) {
				expect(round.answer).toBe(Math.abs(round.left - round.right));
			}
		}
		expect(getHowManyMoreLevel(11)).toBeUndefined();
	});
});
`
);

// Literacy
writeFileSync(
	join(root, 'src/lib/last-sound.ts'),
	`/** Last sound — picture → tap ending letter. */

export type LastWord = 'cat' | 'dog' | 'sun' | 'ball' | 'fish' | 'moon' | 'cup' | 'bed';
export const WORD_END: Record<LastWord, string> = {
	cat: 't', dog: 'g', sun: 'n', ball: 'l', fish: 'h', moon: 'n', cup: 'p', bed: 'd'
};

export interface LastSoundRound {
	word: LastWord;
	answer: string;
	options: string[];
}

export interface LastSoundLevelConfig {
	level: number;
	words: LastWord[];
	optionCount: number;
}

export const MAX_LAST_SOUND_LEVEL = 10;
export const LAST_SOUND_ROUNDS = 3;
const EARLY: LastWord[] = ['cat', 'dog', 'sun', 'cup'];
const MID: LastWord[] = ['cat', 'dog', 'sun', 'ball', 'fish', 'cup'];
const ALL: LastWord[] = ['cat', 'dog', 'sun', 'ball', 'fish', 'moon', 'cup', 'bed'];

export const LAST_SOUND_LEVELS: LastSoundLevelConfig[] = [
	{ level: 1, words: EARLY, optionCount: 2 },
	{ level: 2, words: EARLY, optionCount: 2 },
	{ level: 3, words: EARLY, optionCount: 3 },
	{ level: 4, words: MID, optionCount: 3 },
	{ level: 5, words: MID, optionCount: 3 },
	{ level: 6, words: MID, optionCount: 4 },
	{ level: 7, words: ALL, optionCount: 4 },
	{ level: 8, words: ALL, optionCount: 4 },
	{ level: 9, words: ALL, optionCount: 5 },
	{ level: 10, words: ALL, optionCount: 5 }
];

export function getLastSoundLevel(level: number): LastSoundLevelConfig | undefined {
	return LAST_SOUND_LEVELS.find((entry) => entry.level === level);
}

${shuffledCode()}

export function pickRounds(config: LastSoundLevelConfig, rand: () => number = Math.random): LastSoundRound[] {
	const words = shuffled(config.words, rand);
	const letters = [...new Set(config.words.map((w) => WORD_END[w]))];
	return Array.from({ length: LAST_SOUND_ROUNDS }, (_, index) => {
		const word = words[index % words.length];
		const answer = WORD_END[word];
		const distractors = shuffled(letters.filter((l) => l !== answer), rand).slice(0, config.optionCount - 1);
		return { word, answer, options: shuffled([answer, ...distractors], rand) };
	});
}
`
);

writeFileSync(
	join(root, 'src/lib/last-sound.test.ts'),
	`import { describe, expect, test } from 'vitest';
import { WORD_END, getLastSoundLevel, pickRounds } from './last-sound';
describe('last-sound', () => {
	test('ending letter', () => {
		for (let level = 1; level <= 10; level++) {
			const config = getLastSoundLevel(level)!;
			for (const round of pickRounds(config, () => 0.2)) {
				expect(round.answer).toBe(WORD_END[round.word]);
			}
		}
		expect(getLastSoundLevel(11)).toBeUndefined();
	});
});
`
);

writeFileSync(
	join(root, 'src/lib/real-word.ts'),
	`/** Real / nonsense word — tap real or nonsense. */

export type RealWordId = 'real' | 'nonsense';
export type RealWordItem = 'cat' | 'dog' | 'sun' | 'blorp' | 'zorp' | 'miffle';

export const WORD_ANSWER: Record<RealWordItem, RealWordId> = {
	cat: 'real', dog: 'real', sun: 'real', blorp: 'nonsense', zorp: 'nonsense', miffle: 'nonsense'
};

export interface RealWordRound {
	word: RealWordItem;
	answer: RealWordId;
	options: RealWordId[];
}

export interface RealWordLevelConfig {
	level: number;
	words: RealWordItem[];
}

export const MAX_REAL_WORD_LEVEL = 10;
export const REAL_WORD_ROUNDS = 3;
const EARLY: RealWordItem[] = ['cat', 'blorp'];
const MID: RealWordItem[] = ['cat', 'dog', 'blorp', 'zorp'];
const ALL: RealWordItem[] = ['cat', 'dog', 'sun', 'blorp', 'zorp', 'miffle'];

export const REAL_WORD_LEVELS: RealWordLevelConfig[] = [
	{ level: 1, words: EARLY }, { level: 2, words: EARLY }, { level: 3, words: EARLY },
	{ level: 4, words: MID }, { level: 5, words: MID }, { level: 6, words: MID },
	{ level: 7, words: ALL }, { level: 8, words: ALL }, { level: 9, words: ALL }, { level: 10, words: ALL }
];

export function getRealWordLevel(level: number): RealWordLevelConfig | undefined {
	return REAL_WORD_LEVELS.find((entry) => entry.level === level);
}

${shuffledCode()}

export function pickRounds(config: RealWordLevelConfig, rand: () => number = Math.random): RealWordRound[] {
	const words = shuffled(config.words, rand);
	return Array.from({ length: REAL_WORD_ROUNDS }, (_, index) => {
		const word = words[index % words.length];
		return { word, answer: WORD_ANSWER[word], options: shuffled(['real', 'nonsense'], rand) };
	});
}
`
);

writeFileSync(
	join(root, 'src/lib/real-word.test.ts'),
	`import { describe, expect, test } from 'vitest';
import { WORD_ANSWER, getRealWordLevel, pickRounds } from './real-word';
describe('real-word', () => {
	test('answers', () => {
		for (let level = 1; level <= 10; level++) {
			const config = getRealWordLevel(level)!;
			for (const round of pickRounds(config, () => 0.25)) {
				expect(round.answer).toBe(WORD_ANSWER[round.word]);
			}
		}
		expect(getRealWordLevel(11)).toBeUndefined();
	});
});
`
);

writeFileSync(
	join(root, 'src/lib/word-or-picture.ts'),
	`/** Word or picture? — see word or picture, tap the match. */

export type WopItem = 'cat' | 'dog' | 'sun' | 'ball' | 'fish' | 'cup';
export type WopMode = 'word-to-pic' | 'pic-to-word';

export interface WordOrPictureRound {
	item: WopItem;
	mode: WopMode;
	answer: WopItem;
	options: WopItem[];
}

export interface WordOrPictureLevelConfig {
	level: number;
	items: WopItem[];
	modes: WopMode[];
	optionCount: number;
}

export const MAX_WORD_OR_PICTURE_LEVEL = 10;
export const WORD_OR_PICTURE_ROUNDS = 3;
const EARLY: WopItem[] = ['cat', 'dog', 'sun', 'ball'];
const ALL: WopItem[] = ['cat', 'dog', 'sun', 'ball', 'fish', 'cup'];

export const WORD_OR_PICTURE_LEVELS: WordOrPictureLevelConfig[] = [
	{ level: 1, items: EARLY, modes: ['word-to-pic'], optionCount: 2 },
	{ level: 2, items: EARLY, modes: ['word-to-pic'], optionCount: 2 },
	{ level: 3, items: EARLY, modes: ['pic-to-word'], optionCount: 2 },
	{ level: 4, items: EARLY, modes: ['word-to-pic', 'pic-to-word'], optionCount: 3 },
	{ level: 5, items: EARLY, modes: ['word-to-pic', 'pic-to-word'], optionCount: 3 },
	{ level: 6, items: ALL, modes: ['word-to-pic', 'pic-to-word'], optionCount: 3 },
	{ level: 7, items: ALL, modes: ['word-to-pic', 'pic-to-word'], optionCount: 4 },
	{ level: 8, items: ALL, modes: ['word-to-pic', 'pic-to-word'], optionCount: 4 },
	{ level: 9, items: ALL, modes: ['word-to-pic', 'pic-to-word'], optionCount: 4 },
	{ level: 10, items: ALL, modes: ['word-to-pic', 'pic-to-word'], optionCount: 5 }
];

export function getWordOrPictureLevel(level: number): WordOrPictureLevelConfig | undefined {
	return WORD_OR_PICTURE_LEVELS.find((entry) => entry.level === level);
}

${shuffledCode()}

export function pickRounds(
	config: WordOrPictureLevelConfig,
	rand: () => number = Math.random
): WordOrPictureRound[] {
	const items = shuffled(config.items, rand);
	const modes = shuffled(config.modes, rand);
	return Array.from({ length: WORD_OR_PICTURE_ROUNDS }, (_, index) => {
		const item = items[index % items.length];
		const mode = modes[index % modes.length];
		const distractors = shuffled(config.items.filter((i) => i !== item), rand).slice(0, config.optionCount - 1);
		return {
			item,
			mode,
			answer: item,
			options: shuffled([item, ...distractors], rand)
		};
	});
}
`
);

writeFileSync(
	join(root, 'src/lib/word-or-picture.test.ts'),
	`import { describe, expect, test } from 'vitest';
import { getWordOrPictureLevel, pickRounds } from './word-or-picture';
describe('word-or-picture', () => {
	test('answer is prompt item', () => {
		for (let level = 1; level <= 10; level++) {
			const config = getWordOrPictureLevel(level)!;
			for (const round of pickRounds(config, () => 0.2)) {
				expect(round.answer).toBe(round.item);
				expect(round.options).toContain(round.answer);
			}
		}
		expect(getWordOrPictureLevel(11)).toBeUndefined();
	});
});
`
);

console.log('rules done');
