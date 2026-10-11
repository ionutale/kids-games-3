/**
 * Pure rules for "Solid / liquid".
 */

export type SolidLiquidId = 'solid' | 'liquid';
export type SolidLiquidScene = 'block' | 'rock' | 'ice-cube' | 'water' | 'juice' | 'milk';

export const SCENE_ANSWER: Record<SolidLiquidScene, SolidLiquidId> = {
	block: 'solid',
	rock: 'solid',
	'ice-cube': 'solid',
	water: 'liquid',
	juice: 'liquid',
	milk: 'liquid'
};

export interface SolidLiquidRound {
	scene: SolidLiquidScene;
	answer: SolidLiquidId;
	options: SolidLiquidId[];
}

export interface SolidLiquidLevelConfig {
	level: number;
	scenes: SolidLiquidScene[];
}

export const MAX_SOLID_LIQUID_LEVEL = 10;
export const SOLID_LIQUID_ROUNDS = 3;

const EARLY: SolidLiquidScene[] = ['block', 'water'];
const MID: SolidLiquidScene[] = ['block', 'rock', 'water', 'juice'];
const ALL: SolidLiquidScene[] = ['block', 'rock', 'ice-cube', 'water', 'juice', 'milk'];

export const SOLID_LIQUID_LEVELS: SolidLiquidLevelConfig[] = [
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

export function getSolidLiquidLevel(level: number): SolidLiquidLevelConfig | undefined {
	return SOLID_LIQUID_LEVELS.find((entry) => entry.level === level);
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
	config: SolidLiquidLevelConfig,
	rand: () => number = Math.random
): SolidLiquidRound[] {
	const scenes = shuffled(config.scenes, rand);
	return Array.from({ length: SOLID_LIQUID_ROUNDS }, (_, index) => {
		const scene = scenes[index % scenes.length];
		return {
			scene,
			answer: SCENE_ANSWER[scene],
			options: shuffled(['solid', 'liquid'] as SolidLiquidId[], rand)
		};
	});
}
