/**
 * Pure rules for "Morning / evening".
 */

export type MorningEveningId = 'morning' | 'evening';
export type MorningEveningScene = 'sunrise' | 'breakfast' | 'brush-am' | 'sunset' | 'pajamas' | 'bedtime';

export const SCENE_ANSWER: Record<MorningEveningScene, MorningEveningId> = {
	sunrise: 'morning',
	breakfast: 'morning',
	'brush-am': 'morning',
	sunset: 'evening',
	pajamas: 'evening',
	bedtime: 'evening'
};

export interface MorningEveningRound {
	scene: MorningEveningScene;
	answer: MorningEveningId;
	options: MorningEveningId[];
}

export interface MorningEveningLevelConfig {
	level: number;
	scenes: MorningEveningScene[];
}

export const MAX_MORNING_EVENING_LEVEL = 10;
export const MORNING_EVENING_ROUNDS = 3;

const EARLY: MorningEveningScene[] = ['sunrise', 'sunset'];
const MID: MorningEveningScene[] = ['sunrise', 'breakfast', 'sunset', 'pajamas'];
const ALL: MorningEveningScene[] = ['sunrise', 'breakfast', 'brush-am', 'sunset', 'pajamas', 'bedtime'];

export const MORNING_EVENING_LEVELS: MorningEveningLevelConfig[] = [
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

export function getMorningEveningLevel(level: number): MorningEveningLevelConfig | undefined {
	return MORNING_EVENING_LEVELS.find((entry) => entry.level === level);
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
	config: MorningEveningLevelConfig,
	rand: () => number = Math.random
): MorningEveningRound[] {
	const scenes = shuffled(config.scenes, rand);
	return Array.from({ length: MORNING_EVENING_ROUNDS }, (_, index) => {
		const scene = scenes[index % scenes.length];
		return {
			scene,
			answer: SCENE_ANSWER[scene],
			options: shuffled(['morning', 'evening'] as MorningEveningId[], rand)
		};
	});
}
