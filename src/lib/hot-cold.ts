/**
 * Pure rules for "Hot / cold".
 */

export type HotColdId = 'hot' | 'cold';
export type HotColdScene = 'sun' | 'soup' | 'fire' | 'snow' | 'ice' | 'fridge';

export const SCENE_ANSWER: Record<HotColdScene, HotColdId> = {
	sun: 'hot',
	soup: 'hot',
	fire: 'hot',
	snow: 'cold',
	ice: 'cold',
	fridge: 'cold'
};

export interface HotColdRound {
	scene: HotColdScene;
	answer: HotColdId;
	options: HotColdId[];
}

export interface HotColdLevelConfig {
	level: number;
	scenes: HotColdScene[];
}

export const MAX_HOT_COLD_LEVEL = 10;
export const HOT_COLD_ROUNDS = 3;

const EARLY: HotColdScene[] = ['sun', 'snow'];
const MID: HotColdScene[] = ['sun', 'soup', 'snow', 'ice'];
const ALL: HotColdScene[] = ['sun', 'soup', 'fire', 'snow', 'ice', 'fridge'];

export const HOT_COLD_LEVELS: HotColdLevelConfig[] = [
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

export function getHotColdLevel(level: number): HotColdLevelConfig | undefined {
	return HOT_COLD_LEVELS.find((entry) => entry.level === level);
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
	config: HotColdLevelConfig,
	rand: () => number = Math.random
): HotColdRound[] {
	const scenes = shuffled(config.scenes, rand);
	return Array.from({ length: HOT_COLD_ROUNDS }, (_, index) => {
		const scene = scenes[index % scenes.length];
		return {
			scene,
			answer: SCENE_ANSWER[scene],
			options: shuffled(['hot', 'cold'] as HotColdId[], rand)
		};
	});
}
