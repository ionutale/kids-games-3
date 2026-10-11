/**
 * Pure rules for "Day animal / night animal".
 */

export type DnaId = 'day' | 'night';
export type DnaScene = 'rooster' | 'butterfly' | 'squirrel' | 'owl' | 'bat' | 'firefly';

export const SCENE_ANSWER: Record<DnaScene, DnaId> = {
	rooster: 'day',
	butterfly: 'day',
	squirrel: 'day',
	owl: 'night',
	bat: 'night',
	firefly: 'night'
};

export interface DayNightAnimalRound {
	scene: DnaScene;
	answer: DnaId;
	options: DnaId[];
}

export interface DayNightAnimalLevelConfig {
	level: number;
	scenes: DnaScene[];
}

export const MAX_DAY_NIGHT_ANIMAL_LEVEL = 10;
export const DAY_NIGHT_ANIMAL_ROUNDS = 3;

const EARLY: DnaScene[] = ['rooster', 'owl'];
const MID: DnaScene[] = ['rooster', 'butterfly', 'owl', 'bat'];
const ALL: DnaScene[] = ['rooster', 'butterfly', 'squirrel', 'owl', 'bat', 'firefly'];

export const DAY_NIGHT_ANIMAL_LEVELS: DayNightAnimalLevelConfig[] = [
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

export function getDayNightAnimalLevel(level: number): DayNightAnimalLevelConfig | undefined {
	return DAY_NIGHT_ANIMAL_LEVELS.find((entry) => entry.level === level);
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
	config: DayNightAnimalLevelConfig,
	rand: () => number = Math.random
): DayNightAnimalRound[] {
	const scenes = shuffled(config.scenes, rand);
	return Array.from({ length: DAY_NIGHT_ANIMAL_ROUNDS }, (_, index) => {
		const scene = scenes[index % scenes.length];
		return {
			scene,
			answer: SCENE_ANSWER[scene],
			options: shuffled(['day', 'night'] as DnaId[], rand)
		};
	});
}
