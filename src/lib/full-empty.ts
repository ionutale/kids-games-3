/**
 * Pure rules for "Full / empty".
 */

export type FullEmptyId = 'full' | 'empty';
export type FullEmptyScene = 'bowl-full' | 'glass-full' | 'box-full' | 'bowl-empty' | 'glass-empty' | 'box-empty';

export const SCENE_ANSWER: Record<FullEmptyScene, FullEmptyId> = {
	'bowl-full': 'full',
	'glass-full': 'full',
	'box-full': 'full',
	'bowl-empty': 'empty',
	'glass-empty': 'empty',
	'box-empty': 'empty'
};

export interface FullEmptyRound {
	scene: FullEmptyScene;
	answer: FullEmptyId;
	options: FullEmptyId[];
}

export interface FullEmptyLevelConfig {
	level: number;
	scenes: FullEmptyScene[];
}

export const MAX_FULL_EMPTY_LEVEL = 10;
export const FULL_EMPTY_ROUNDS = 3;

const EARLY: FullEmptyScene[] = ['bowl-full', 'bowl-empty'];
const MID: FullEmptyScene[] = ['bowl-full', 'glass-full', 'bowl-empty', 'glass-empty'];
const ALL: FullEmptyScene[] = ['bowl-full', 'glass-full', 'box-full', 'bowl-empty', 'glass-empty', 'box-empty'];

export const FULL_EMPTY_LEVELS: FullEmptyLevelConfig[] = [
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

export function getFullEmptyLevel(level: number): FullEmptyLevelConfig | undefined {
	return FULL_EMPTY_LEVELS.find((entry) => entry.level === level);
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
	config: FullEmptyLevelConfig,
	rand: () => number = Math.random
): FullEmptyRound[] {
	const scenes = shuffled(config.scenes, rand);
	return Array.from({ length: FULL_EMPTY_ROUNDS }, (_, index) => {
		const scene = scenes[index % scenes.length];
		return {
			scene,
			answer: SCENE_ANSWER[scene],
			options: shuffled(['full', 'empty'] as FullEmptyId[], rand)
		};
	});
}
