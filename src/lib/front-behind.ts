/**
 * Pure rules for "Front / behind".
 */

export type FrontBehindId = 'front' | 'behind';
export type FrontBehindScene = 'ball-front' | 'cat-front' | 'bike-front' | 'ball-behind' | 'cat-behind' | 'bike-behind';

export const SCENE_ANSWER: Record<FrontBehindScene, FrontBehindId> = {
	'ball-front': 'front',
	'cat-front': 'front',
	'bike-front': 'front',
	'ball-behind': 'behind',
	'cat-behind': 'behind',
	'bike-behind': 'behind'
};

export interface FrontBehindRound {
	scene: FrontBehindScene;
	answer: FrontBehindId;
	options: FrontBehindId[];
}

export interface FrontBehindLevelConfig {
	level: number;
	scenes: FrontBehindScene[];
}

export const MAX_FRONT_BEHIND_LEVEL = 10;
export const FRONT_BEHIND_ROUNDS = 3;

const EARLY: FrontBehindScene[] = ['ball-front', 'ball-behind'];
const MID: FrontBehindScene[] = ['ball-front', 'cat-front', 'ball-behind', 'cat-behind'];
const ALL: FrontBehindScene[] = ['ball-front', 'cat-front', 'bike-front', 'ball-behind', 'cat-behind', 'bike-behind'];

export const FRONT_BEHIND_LEVELS: FrontBehindLevelConfig[] = [
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

export function getFrontBehindLevel(level: number): FrontBehindLevelConfig | undefined {
	return FRONT_BEHIND_LEVELS.find((entry) => entry.level === level);
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
	config: FrontBehindLevelConfig,
	rand: () => number = Math.random
): FrontBehindRound[] {
	const scenes = shuffled(config.scenes, rand);
	return Array.from({ length: FRONT_BEHIND_ROUNDS }, (_, index) => {
		const scene = scenes[index % scenes.length];
		return {
			scene,
			answer: SCENE_ANSWER[scene],
			options: shuffled(['front', 'behind'] as FrontBehindId[], rand)
		};
	});
}
