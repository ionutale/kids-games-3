/**
 * Pure rules for "Inside / outside".
 * A room or yard scene is shown. The child taps inside or outside.
 */

export type InsideOutsideId = 'inside' | 'outside';

export type InsideOutsideScene =
	| 'bedroom'
	| 'kitchen'
	| 'sofa'
	| 'park'
	| 'yard'
	| 'playground';

export const SCENE_ANSWER: Record<InsideOutsideScene, InsideOutsideId> = {
	bedroom: 'inside',
	kitchen: 'inside',
	sofa: 'inside',
	park: 'outside',
	yard: 'outside',
	playground: 'outside'
};

export interface InsideOutsideRound {
	scene: InsideOutsideScene;
	answer: InsideOutsideId;
	options: InsideOutsideId[];
}

export interface InsideOutsideLevelConfig {
	level: number;
	scenes: InsideOutsideScene[];
}

export const MAX_INSIDE_OUTSIDE_LEVEL = 10;
export const INSIDE_OUTSIDE_ROUNDS = 3;

const EARLY: InsideOutsideScene[] = ['bedroom', 'park'];
const MID: InsideOutsideScene[] = ['bedroom', 'kitchen', 'park', 'yard'];
const ALL: InsideOutsideScene[] = ['bedroom', 'kitchen', 'sofa', 'park', 'yard', 'playground'];

export const INSIDE_OUTSIDE_LEVELS: InsideOutsideLevelConfig[] = [
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

export function getInsideOutsideLevel(level: number): InsideOutsideLevelConfig | undefined {
	return INSIDE_OUTSIDE_LEVELS.find((entry) => entry.level === level);
}

function shuffled<T>(items: T[], rand: () => number): T[] {
	const copy = [...items];
	for (let i = copy.length - 1; i > 0; i--) {
		const j = Math.floor(rand() * (i + 1));
		[copy[i], copy[j]] = [copy[j], copy[i]];
	}
	return copy;
}

/** Three scenes. Options are always inside and outside. */
export function pickRounds(
	config: InsideOutsideLevelConfig,
	rand: () => number = Math.random
): InsideOutsideRound[] {
	const scenes = shuffled(config.scenes, rand);
	return Array.from({ length: INSIDE_OUTSIDE_ROUNDS }, (_, index) => {
		const scene = scenes[index % scenes.length];
		const answer = SCENE_ANSWER[scene];
		return {
			scene,
			answer,
			options: shuffled(['inside', 'outside'], rand)
		};
	});
}
