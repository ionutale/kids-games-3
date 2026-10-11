/**
 * Pure rules for "Big / small".
 */

export type ObjectSizeId = 'big' | 'small';
export type ObjectSizeScene = 'elephant' | 'house' | 'truck' | 'ant' | 'marble' | 'seed';

export const SCENE_ANSWER: Record<ObjectSizeScene, ObjectSizeId> = {
	elephant: 'big',
	house: 'big',
	truck: 'big',
	ant: 'small',
	marble: 'small',
	seed: 'small'
};

export interface ObjectSizeRound {
	scene: ObjectSizeScene;
	answer: ObjectSizeId;
	options: ObjectSizeId[];
}

export interface ObjectSizeLevelConfig {
	level: number;
	scenes: ObjectSizeScene[];
}

export const MAX_OBJECT_SIZE_LEVEL = 10;
export const OBJECT_SIZE_ROUNDS = 3;

const EARLY: ObjectSizeScene[] = ['elephant', 'ant'];
const MID: ObjectSizeScene[] = ['elephant', 'house', 'ant', 'marble'];
const ALL: ObjectSizeScene[] = ['elephant', 'house', 'truck', 'ant', 'marble', 'seed'];

export const OBJECT_SIZE_LEVELS: ObjectSizeLevelConfig[] = [
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

export function getObjectSizeLevel(level: number): ObjectSizeLevelConfig | undefined {
	return OBJECT_SIZE_LEVELS.find((entry) => entry.level === level);
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
	config: ObjectSizeLevelConfig,
	rand: () => number = Math.random
): ObjectSizeRound[] {
	const scenes = shuffled(config.scenes, rand);
	return Array.from({ length: OBJECT_SIZE_ROUNDS }, (_, index) => {
		const scene = scenes[index % scenes.length];
		return {
			scene,
			answer: SCENE_ANSWER[scene],
			options: shuffled(['big', 'small'] as ObjectSizeId[], rand)
		};
	});
}
