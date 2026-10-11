/** In / on / under — object + shelf → tap where. */

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

function shuffled<T>(items: T[], rand: () => number): T[] {
	const copy = [...items];
	for (let i = copy.length - 1; i > 0; i--) {
		const j = Math.floor(rand() * (i + 1));
		[copy[i], copy[j]] = [copy[j], copy[i]];
	}
	return copy;
}

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
