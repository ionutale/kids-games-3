/** Safe or not — gentle street safety scenes → tap safe or not safe. */

export type SafeChoiceId = 'safe' | 'unsafe';

export type SafeScene =
	| 'crosswalk'
	| 'helmet'
	| 'hand-adult'
	| 'mid-street'
	| 'no-helmet'
	| 'alone-road';

export const SCENE_ANSWER: Record<SafeScene, SafeChoiceId> = {
	crosswalk: 'safe',
	helmet: 'safe',
	'hand-adult': 'safe',
	'mid-street': 'unsafe',
	'no-helmet': 'unsafe',
	'alone-road': 'unsafe'
};

export interface SafeChoiceRound {
	scene: SafeScene;
	answer: SafeChoiceId;
	options: SafeChoiceId[];
}

export interface SafeChoiceLevelConfig {
	level: number;
	scenes: SafeScene[];
}

export const MAX_SAFE_CHOICE_LEVEL = 10;
export const SAFE_CHOICE_ROUNDS = 3;

const EARLY: SafeScene[] = ['crosswalk', 'mid-street'];
const MID: SafeScene[] = ['crosswalk', 'helmet', 'mid-street', 'no-helmet'];
const ALL: SafeScene[] = [
	'crosswalk',
	'helmet',
	'hand-adult',
	'mid-street',
	'no-helmet',
	'alone-road'
];

export const SAFE_CHOICE_LEVELS: SafeChoiceLevelConfig[] = [
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

export function getSafeChoiceLevel(level: number): SafeChoiceLevelConfig | undefined {
	return SAFE_CHOICE_LEVELS.find((entry) => entry.level === level);
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
	config: SafeChoiceLevelConfig,
	rand: () => number = Math.random
): SafeChoiceRound[] {
	const scenes = shuffled(config.scenes, rand);
	return Array.from({ length: SAFE_CHOICE_ROUNDS }, (_, index) => {
		const scene = scenes[index % scenes.length];
		return {
			scene,
			answer: SCENE_ANSWER[scene],
			options: shuffled(['safe', 'unsafe'], rand)
		};
	});
}
