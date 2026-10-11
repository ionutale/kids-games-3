/**
 * Pure rules for "Wet / dry".
 * A scene is shown. The child taps wet or dry.
 */

export type WetDryId = 'wet' | 'dry';

export type WetDryScene = 'puddle' | 'rain' | 'bath' | 'towel' | 'desert' | 'sand';

export const SCENE_ANSWER: Record<WetDryScene, WetDryId> = {
	puddle: 'wet',
	rain: 'wet',
	bath: 'wet',
	towel: 'dry',
	desert: 'dry',
	sand: 'dry'
};

export interface WetDryRound {
	scene: WetDryScene;
	answer: WetDryId;
	options: WetDryId[];
}

export interface WetDryLevelConfig {
	level: number;
	scenes: WetDryScene[];
}

export const MAX_WET_DRY_LEVEL = 10;
export const WET_DRY_ROUNDS = 3;

const EARLY: WetDryScene[] = ['puddle', 'towel'];
const MID: WetDryScene[] = ['puddle', 'rain', 'towel', 'desert'];
const ALL: WetDryScene[] = ['puddle', 'rain', 'bath', 'towel', 'desert', 'sand'];

export const WET_DRY_LEVELS: WetDryLevelConfig[] = [
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

export function getWetDryLevel(level: number): WetDryLevelConfig | undefined {
	return WET_DRY_LEVELS.find((entry) => entry.level === level);
}

function shuffled<T>(items: T[], rand: () => number): T[] {
	const copy = [...items];
	for (let i = copy.length - 1; i > 0; i--) {
		const j = Math.floor(rand() * (i + 1));
		[copy[i], copy[j]] = [copy[j], copy[i]];
	}
	return copy;
}

/** Three scenes. Options are always wet and dry. */
export function pickRounds(
	config: WetDryLevelConfig,
	rand: () => number = Math.random
): WetDryRound[] {
	const scenes = shuffled(config.scenes, rand);
	return Array.from({ length: WET_DRY_ROUNDS }, (_, index) => {
		const scene = scenes[index % scenes.length];
		const answer = SCENE_ANSWER[scene];
		return {
			scene,
			answer,
			options: shuffled(['wet', 'dry'], rand)
		};
	});
}
