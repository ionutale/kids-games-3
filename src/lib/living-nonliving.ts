/**
 * Pure rules for "Living / non-living".
 */

export type LivingId = 'living' | 'nonliving';
export type LivingScene = 'cat' | 'tree' | 'fish' | 'rock' | 'ball' | 'car';

export const SCENE_ANSWER: Record<LivingScene, LivingId> = {
	cat: 'living',
	tree: 'living',
	fish: 'living',
	rock: 'nonliving',
	ball: 'nonliving',
	car: 'nonliving'
};

export interface LivingNonlivingRound {
	scene: LivingScene;
	answer: LivingId;
	options: LivingId[];
}

export interface LivingNonlivingLevelConfig {
	level: number;
	scenes: LivingScene[];
}

export const MAX_LIVING_NONLIVING_LEVEL = 10;
export const LIVING_NONLIVING_ROUNDS = 3;

const EARLY: LivingScene[] = ['cat', 'rock'];
const MID: LivingScene[] = ['cat', 'tree', 'rock', 'ball'];
const ALL: LivingScene[] = ['cat', 'tree', 'fish', 'rock', 'ball', 'car'];

export const LIVING_NONLIVING_LEVELS: LivingNonlivingLevelConfig[] = [
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

export function getLivingNonlivingLevel(level: number): LivingNonlivingLevelConfig | undefined {
	return LIVING_NONLIVING_LEVELS.find((entry) => entry.level === level);
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
	config: LivingNonlivingLevelConfig,
	rand: () => number = Math.random
): LivingNonlivingRound[] {
	const scenes = shuffled(config.scenes, rand);
	return Array.from({ length: LIVING_NONLIVING_ROUNDS }, (_, index) => {
		const scene = scenes[index % scenes.length];
		return {
			scene,
			answer: SCENE_ANSWER[scene],
			options: shuffled(['living', 'nonliving'] as LivingId[], rand)
		};
	});
}
