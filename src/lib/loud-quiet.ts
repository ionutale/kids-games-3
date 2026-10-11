/**
 * Pure rules for "Loud / quiet".
 */

export type LoudQuietId = 'loud' | 'quiet';
export type LoudQuietScene = 'drum' | 'siren' | 'cheer' | 'whisper' | 'library' | 'sleep';

export const SCENE_ANSWER: Record<LoudQuietScene, LoudQuietId> = {
	drum: 'loud',
	siren: 'loud',
	cheer: 'loud',
	whisper: 'quiet',
	library: 'quiet',
	sleep: 'quiet'
};

export interface LoudQuietRound {
	scene: LoudQuietScene;
	answer: LoudQuietId;
	options: LoudQuietId[];
}

export interface LoudQuietLevelConfig {
	level: number;
	scenes: LoudQuietScene[];
}

export const MAX_LOUD_QUIET_LEVEL = 10;
export const LOUD_QUIET_ROUNDS = 3;

const EARLY: LoudQuietScene[] = ['drum', 'whisper'];
const MID: LoudQuietScene[] = ['drum', 'siren', 'whisper', 'library'];
const ALL: LoudQuietScene[] = ['drum', 'siren', 'cheer', 'whisper', 'library', 'sleep'];

export const LOUD_QUIET_LEVELS: LoudQuietLevelConfig[] = [
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

export function getLoudQuietLevel(level: number): LoudQuietLevelConfig | undefined {
	return LOUD_QUIET_LEVELS.find((entry) => entry.level === level);
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
	config: LoudQuietLevelConfig,
	rand: () => number = Math.random
): LoudQuietRound[] {
	const scenes = shuffled(config.scenes, rand);
	return Array.from({ length: LOUD_QUIET_ROUNDS }, (_, index) => {
		const scene = scenes[index % scenes.length];
		return {
			scene,
			answer: SCENE_ANSWER[scene],
			options: shuffled(['loud', 'quiet'] as LoudQuietId[], rand)
		};
	});
}
