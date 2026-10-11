/**
 * Pure rules for "Stop / go".
 */

export type StopGoId = 'stop' | 'go';
export type StopGoScene = 'red-light' | 'hand-stop' | 'closed-gate' | 'green-light' | 'walk' | 'open-gate';

export const SCENE_ANSWER: Record<StopGoScene, StopGoId> = {
	'red-light': 'stop',
	'hand-stop': 'stop',
	'closed-gate': 'stop',
	'green-light': 'go',
	walk: 'go',
	'open-gate': 'go'
};

export interface StopGoRound {
	scene: StopGoScene;
	answer: StopGoId;
	options: StopGoId[];
}

export interface StopGoLevelConfig {
	level: number;
	scenes: StopGoScene[];
}

export const MAX_STOP_GO_LEVEL = 10;
export const STOP_GO_ROUNDS = 3;

const EARLY: StopGoScene[] = ['red-light', 'green-light'];
const MID: StopGoScene[] = ['red-light', 'hand-stop', 'green-light', 'walk'];
const ALL: StopGoScene[] = ['red-light', 'hand-stop', 'closed-gate', 'green-light', 'walk', 'open-gate'];

export const STOP_GO_LEVELS: StopGoLevelConfig[] = [
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

export function getStopGoLevel(level: number): StopGoLevelConfig | undefined {
	return STOP_GO_LEVELS.find((entry) => entry.level === level);
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
	config: StopGoLevelConfig,
	rand: () => number = Math.random
): StopGoRound[] {
	const scenes = shuffled(config.scenes, rand);
	return Array.from({ length: STOP_GO_ROUNDS }, (_, index) => {
		const scene = scenes[index % scenes.length];
		return {
			scene,
			answer: SCENE_ANSWER[scene],
			options: shuffled(['stop', 'go'] as StopGoId[], rand)
		};
	});
}
