/** Up / down — balloon vs slide → tap. */

export type UpDownId = 'up' | 'down';

export type UpDownScene =
	| 'balloon'
	| 'bird-up'
	| 'rocket'
	| 'slide'
	| 'rain'
	| 'apple-fall';

export const SCENE_ANSWER: Record<UpDownScene, UpDownId> = {
	balloon: 'up',
	'bird-up': 'up',
	rocket: 'up',
	slide: 'down',
	rain: 'down',
	'apple-fall': 'down'
};

export interface UpDownRound {
	scene: UpDownScene;
	answer: UpDownId;
	options: UpDownId[];
}

export interface UpDownLevelConfig {
	level: number;
	scenes: UpDownScene[];
}

export const MAX_UP_DOWN_LEVEL = 10;
export const UP_DOWN_ROUNDS = 3;

const EARLY: UpDownScene[] = ['balloon', 'slide'];
const MID: UpDownScene[] = ['balloon', 'bird-up', 'slide', 'rain'];
const ALL: UpDownScene[] = ['balloon', 'bird-up', 'rocket', 'slide', 'rain', 'apple-fall'];

export const UP_DOWN_LEVELS: UpDownLevelConfig[] = [
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

export function getUpDownLevel(level: number): UpDownLevelConfig | undefined {
	return UP_DOWN_LEVELS.find((entry) => entry.level === level);
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
	config: UpDownLevelConfig,
	rand: () => number = Math.random
): UpDownRound[] {
	const scenes = shuffled(config.scenes, rand);
	return Array.from({ length: UP_DOWN_ROUNDS }, (_, index) => {
		const scene = scenes[index % scenes.length];
		return {
			scene,
			answer: SCENE_ANSWER[scene],
			options: shuffled(['up', 'down'], rand)
		};
	});
}
