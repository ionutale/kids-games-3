/**
 * Pure rules for "Hard / soft".
 */

export type HardSoftId = 'hard' | 'soft';
export type HardSoftScene = 'rock' | 'block' | 'key' | 'pillow' | 'teddy' | 'cotton';

export const SCENE_ANSWER: Record<HardSoftScene, HardSoftId> = {
	rock: 'hard',
	block: 'hard',
	key: 'hard',
	pillow: 'soft',
	teddy: 'soft',
	cotton: 'soft'
};

export interface HardSoftRound {
	scene: HardSoftScene;
	answer: HardSoftId;
	options: HardSoftId[];
}

export interface HardSoftLevelConfig {
	level: number;
	scenes: HardSoftScene[];
}

export const MAX_HARD_SOFT_LEVEL = 10;
export const HARD_SOFT_ROUNDS = 3;

const EARLY: HardSoftScene[] = ['rock', 'pillow'];
const MID: HardSoftScene[] = ['rock', 'block', 'pillow', 'teddy'];
const ALL: HardSoftScene[] = ['rock', 'block', 'key', 'pillow', 'teddy', 'cotton'];

export const HARD_SOFT_LEVELS: HardSoftLevelConfig[] = [
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

export function getHardSoftLevel(level: number): HardSoftLevelConfig | undefined {
	return HARD_SOFT_LEVELS.find((entry) => entry.level === level);
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
	config: HardSoftLevelConfig,
	rand: () => number = Math.random
): HardSoftRound[] {
	const scenes = shuffled(config.scenes, rand);
	return Array.from({ length: HARD_SOFT_ROUNDS }, (_, index) => {
		const scene = scenes[index % scenes.length];
		return {
			scene,
			answer: SCENE_ANSWER[scene],
			options: shuffled(['hard', 'soft'] as HardSoftId[], rand)
		};
	});
}
