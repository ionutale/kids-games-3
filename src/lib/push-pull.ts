/**
 * Pure rules for "Push / pull".
 */

export type PushPullId = 'push' | 'pull';
export type PushPullScene = 'push-door' | 'push-swing' | 'push-cart' | 'pull-door' | 'pull-wagon' | 'pull-rope';

export const SCENE_ANSWER: Record<PushPullScene, PushPullId> = {
	'push-door': 'push',
	'push-swing': 'push',
	'push-cart': 'push',
	'pull-door': 'pull',
	'pull-wagon': 'pull',
	'pull-rope': 'pull'
};

export interface PushPullRound {
	scene: PushPullScene;
	answer: PushPullId;
	options: PushPullId[];
}

export interface PushPullLevelConfig {
	level: number;
	scenes: PushPullScene[];
}

export const MAX_PUSH_PULL_LEVEL = 10;
export const PUSH_PULL_ROUNDS = 3;

const EARLY: PushPullScene[] = ['push-door', 'pull-door'];
const MID: PushPullScene[] = ['push-door', 'push-swing', 'pull-door', 'pull-wagon'];
const ALL: PushPullScene[] = ['push-door', 'push-swing', 'push-cart', 'pull-door', 'pull-wagon', 'pull-rope'];

export const PUSH_PULL_LEVELS: PushPullLevelConfig[] = [
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

export function getPushPullLevel(level: number): PushPullLevelConfig | undefined {
	return PUSH_PULL_LEVELS.find((entry) => entry.level === level);
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
	config: PushPullLevelConfig,
	rand: () => number = Math.random
): PushPullRound[] {
	const scenes = shuffled(config.scenes, rand);
	return Array.from({ length: PUSH_PULL_ROUNDS }, (_, index) => {
		const scene = scenes[index % scenes.length];
		return {
			scene,
			answer: SCENE_ANSWER[scene],
			options: shuffled(['push', 'pull'] as PushPullId[], rand)
		};
	});
}
