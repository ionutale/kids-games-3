/**
 * Pure rules for "Share / keep".
 */

export type ShareKeepId = 'share' | 'keep';
export type ShareKeepScene = 'two-kids-toy' | 'split-snack' | 'pass-ball' | 'hug-teddy' | 'own-cup' | 'private-box';

export const SCENE_ANSWER: Record<ShareKeepScene, ShareKeepId> = {
	'two-kids-toy': 'share',
	'split-snack': 'share',
	'pass-ball': 'share',
	'hug-teddy': 'keep',
	'own-cup': 'keep',
	'private-box': 'keep'
};

export interface ShareKeepRound {
	scene: ShareKeepScene;
	answer: ShareKeepId;
	options: ShareKeepId[];
}

export interface ShareKeepLevelConfig {
	level: number;
	scenes: ShareKeepScene[];
}

export const MAX_SHARE_KEEP_LEVEL = 10;
export const SHARE_KEEP_ROUNDS = 3;

const EARLY: ShareKeepScene[] = ['two-kids-toy', 'hug-teddy'];
const MID: ShareKeepScene[] = ['two-kids-toy', 'split-snack', 'hug-teddy', 'own-cup'];
const ALL: ShareKeepScene[] = ['two-kids-toy', 'split-snack', 'pass-ball', 'hug-teddy', 'own-cup', 'private-box'];

export const SHARE_KEEP_LEVELS: ShareKeepLevelConfig[] = [
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

export function getShareKeepLevel(level: number): ShareKeepLevelConfig | undefined {
	return SHARE_KEEP_LEVELS.find((entry) => entry.level === level);
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
	config: ShareKeepLevelConfig,
	rand: () => number = Math.random
): ShareKeepRound[] {
	const scenes = shuffled(config.scenes, rand);
	return Array.from({ length: SHARE_KEEP_ROUNDS }, (_, index) => {
		const scene = scenes[index % scenes.length];
		return {
			scene,
			answer: SCENE_ANSWER[scene],
			options: shuffled(['share', 'keep'] as ShareKeepId[], rand)
		};
	});
}
