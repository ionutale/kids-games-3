/**
 * Pure rules for "Day / night".
 * A sky scene is shown. The child taps day or night.
 */

export type DayNightId = 'day' | 'night';

/** Visual scenes that clearly read as day or night. */
export type DayNightScene =
	| 'sunny'
	| 'blue-sky'
	| 'park'
	| 'moon'
	| 'stars'
	| 'city-night';

export const SCENE_ANSWER: Record<DayNightScene, DayNightId> = {
	sunny: 'day',
	'blue-sky': 'day',
	park: 'day',
	moon: 'night',
	stars: 'night',
	'city-night': 'night'
};

export interface DayNightRound {
	scene: DayNightScene;
	answer: DayNightId;
	options: DayNightId[];
}

export interface DayNightLevelConfig {
	level: number;
	scenes: DayNightScene[];
}

export const MAX_DAY_NIGHT_LEVEL = 10;
export const DAY_NIGHT_ROUNDS = 3;

const EARLY: DayNightScene[] = ['sunny', 'moon'];
const MID: DayNightScene[] = ['sunny', 'blue-sky', 'moon', 'stars'];
const ALL: DayNightScene[] = ['sunny', 'blue-sky', 'park', 'moon', 'stars', 'city-night'];

export const DAY_NIGHT_LEVELS: DayNightLevelConfig[] = [
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

export function getDayNightLevel(level: number): DayNightLevelConfig | undefined {
	return DAY_NIGHT_LEVELS.find((entry) => entry.level === level);
}

function shuffled<T>(items: T[], rand: () => number): T[] {
	const copy = [...items];
	for (let i = copy.length - 1; i > 0; i--) {
		const j = Math.floor(rand() * (i + 1));
		[copy[i], copy[j]] = [copy[j], copy[i]];
	}
	return copy;
}

/** Three sky scenes. Options are always day and night. */
export function pickRounds(
	config: DayNightLevelConfig,
	rand: () => number = Math.random
): DayNightRound[] {
	const scenes = shuffled(config.scenes, rand);
	return Array.from({ length: DAY_NIGHT_ROUNDS }, (_, index) => {
		const scene = scenes[index % scenes.length];
		const answer = SCENE_ANSWER[scene];
		return {
			scene,
			answer,
			options: shuffled(['day', 'night'], rand)
		};
	});
}
