/**
 * Pure rules for "New / old".
 */

export type NewOldId = 'new' | 'old';
export type NewOldScene = 'shiny-shoe' | 'gift' | 'fresh-book' | 'worn-shoe' | 'torn-book' | 'faded-toy';

export const SCENE_ANSWER: Record<NewOldScene, NewOldId> = {
	'shiny-shoe': 'new',
	gift: 'new',
	'fresh-book': 'new',
	'worn-shoe': 'old',
	'torn-book': 'old',
	'faded-toy': 'old'
};

export interface NewOldRound {
	scene: NewOldScene;
	answer: NewOldId;
	options: NewOldId[];
}

export interface NewOldLevelConfig {
	level: number;
	scenes: NewOldScene[];
}

export const MAX_NEW_OLD_LEVEL = 10;
export const NEW_OLD_ROUNDS = 3;

const EARLY: NewOldScene[] = ['shiny-shoe', 'worn-shoe'];
const MID: NewOldScene[] = ['shiny-shoe', 'gift', 'worn-shoe', 'torn-book'];
const ALL: NewOldScene[] = ['shiny-shoe', 'gift', 'fresh-book', 'worn-shoe', 'torn-book', 'faded-toy'];

export const NEW_OLD_LEVELS: NewOldLevelConfig[] = [
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

export function getNewOldLevel(level: number): NewOldLevelConfig | undefined {
	return NEW_OLD_LEVELS.find((entry) => entry.level === level);
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
	config: NewOldLevelConfig,
	rand: () => number = Math.random
): NewOldRound[] {
	const scenes = shuffled(config.scenes, rand);
	return Array.from({ length: NEW_OLD_ROUNDS }, (_, index) => {
		const scene = scenes[index % scenes.length];
		return {
			scene,
			answer: SCENE_ANSWER[scene],
			options: shuffled(['new', 'old'] as NewOldId[], rand)
		};
	});
}
