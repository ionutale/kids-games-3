/**
 * Pure rules for "Rough / smooth".
 */

export type RoughSmoothId = 'rough' | 'smooth';
export type RoughSmoothScene = 'bark' | 'sandpaper' | 'pinecone' | 'glass' | 'marble' | 'mirror';

export const SCENE_ANSWER: Record<RoughSmoothScene, RoughSmoothId> = {
	bark: 'rough',
	sandpaper: 'rough',
	pinecone: 'rough',
	glass: 'smooth',
	marble: 'smooth',
	mirror: 'smooth'
};

export interface RoughSmoothRound {
	scene: RoughSmoothScene;
	answer: RoughSmoothId;
	options: RoughSmoothId[];
}

export interface RoughSmoothLevelConfig {
	level: number;
	scenes: RoughSmoothScene[];
}

export const MAX_ROUGH_SMOOTH_LEVEL = 10;
export const ROUGH_SMOOTH_ROUNDS = 3;

const EARLY: RoughSmoothScene[] = ['bark', 'glass'];
const MID: RoughSmoothScene[] = ['bark', 'sandpaper', 'glass', 'marble'];
const ALL: RoughSmoothScene[] = ['bark', 'sandpaper', 'pinecone', 'glass', 'marble', 'mirror'];

export const ROUGH_SMOOTH_LEVELS: RoughSmoothLevelConfig[] = [
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

export function getRoughSmoothLevel(level: number): RoughSmoothLevelConfig | undefined {
	return ROUGH_SMOOTH_LEVELS.find((entry) => entry.level === level);
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
	config: RoughSmoothLevelConfig,
	rand: () => number = Math.random
): RoughSmoothRound[] {
	const scenes = shuffled(config.scenes, rand);
	return Array.from({ length: ROUGH_SMOOTH_ROUNDS }, (_, index) => {
		const scene = scenes[index % scenes.length];
		return {
			scene,
			answer: SCENE_ANSWER[scene],
			options: shuffled(['rough', 'smooth'] as RoughSmoothId[], rand)
		};
	});
}
