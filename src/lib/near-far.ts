/** Near / far — close vs distant object → tap. */

export type NearFarId = 'near' | 'far';

export type NearFarScene = 'ball-near' | 'tree-far' | 'bird-near' | 'moon-far' | 'car-near' | 'hill-far';

export const SCENE_ANSWER: Record<NearFarScene, NearFarId> = {
	'ball-near': 'near',
	'tree-far': 'far',
	'bird-near': 'near',
	'moon-far': 'far',
	'car-near': 'near',
	'hill-far': 'far'
};

export interface NearFarRound {
	scene: NearFarScene;
	answer: NearFarId;
	options: NearFarId[];
}

export interface NearFarLevelConfig {
	level: number;
	scenes: NearFarScene[];
}

export const MAX_NEAR_FAR_LEVEL = 10;
export const NEAR_FAR_ROUNDS = 3;

const EARLY: NearFarScene[] = ['ball-near', 'tree-far'];
const MID: NearFarScene[] = ['ball-near', 'tree-far', 'bird-near', 'moon-far'];
const ALL: NearFarScene[] = [
	'ball-near',
	'tree-far',
	'bird-near',
	'moon-far',
	'car-near',
	'hill-far'
];

export const NEAR_FAR_LEVELS: NearFarLevelConfig[] = [
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

export function getNearFarLevel(level: number): NearFarLevelConfig | undefined {
	return NEAR_FAR_LEVELS.find((entry) => entry.level === level);
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
	config: NearFarLevelConfig,
	rand: () => number = Math.random
): NearFarRound[] {
	const scenes = shuffled(config.scenes, rand);
	return Array.from({ length: NEAR_FAR_ROUNDS }, (_, index) => {
		const scene = scenes[index % scenes.length];
		return {
			scene,
			answer: SCENE_ANSWER[scene],
			options: shuffled(['near', 'far'], rand)
		};
	});
}
