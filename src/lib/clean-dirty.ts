/**
 * Pure rules for "Clean / dirty".
 */

export type CleanDirtyId = 'clean' | 'dirty';
export type CleanDirtyScene = 'clean-plate' | 'clean-shirt' | 'soap' | 'messy-plate' | 'muddy-shoes' | 'stain';

export const SCENE_ANSWER: Record<CleanDirtyScene, CleanDirtyId> = {
	'clean-plate': 'clean',
	'clean-shirt': 'clean',
	soap: 'clean',
	'messy-plate': 'dirty',
	'muddy-shoes': 'dirty',
	stain: 'dirty'
};

export interface CleanDirtyRound {
	scene: CleanDirtyScene;
	answer: CleanDirtyId;
	options: CleanDirtyId[];
}

export interface CleanDirtyLevelConfig {
	level: number;
	scenes: CleanDirtyScene[];
}

export const MAX_CLEAN_DIRTY_LEVEL = 10;
export const CLEAN_DIRTY_ROUNDS = 3;

const EARLY: CleanDirtyScene[] = ['clean-plate', 'messy-plate'];
const MID: CleanDirtyScene[] = ['clean-plate', 'clean-shirt', 'messy-plate', 'muddy-shoes'];
const ALL: CleanDirtyScene[] = ['clean-plate', 'clean-shirt', 'soap', 'messy-plate', 'muddy-shoes', 'stain'];

export const CLEAN_DIRTY_LEVELS: CleanDirtyLevelConfig[] = [
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

export function getCleanDirtyLevel(level: number): CleanDirtyLevelConfig | undefined {
	return CLEAN_DIRTY_LEVELS.find((entry) => entry.level === level);
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
	config: CleanDirtyLevelConfig,
	rand: () => number = Math.random
): CleanDirtyRound[] {
	const scenes = shuffled(config.scenes, rand);
	return Array.from({ length: CLEAN_DIRTY_ROUNDS }, (_, index) => {
		const scene = scenes[index % scenes.length];
		return {
			scene,
			answer: SCENE_ANSWER[scene],
			options: shuffled(['clean', 'dirty'] as CleanDirtyId[], rand)
		};
	});
}
