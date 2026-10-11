/**
 * Pure rules for "Magnet or not".
 */

export type MagnetId = 'magnet' | 'not';
export type MagnetScene = 'paperclip' | 'key' | 'nail' | 'wood' | 'plastic' | 'paper';

export const SCENE_ANSWER: Record<MagnetScene, MagnetId> = {
	paperclip: 'magnet',
	key: 'magnet',
	nail: 'magnet',
	wood: 'not',
	plastic: 'not',
	paper: 'not'
};

export interface MagnetOrNotRound {
	scene: MagnetScene;
	answer: MagnetId;
	options: MagnetId[];
}

export interface MagnetOrNotLevelConfig {
	level: number;
	scenes: MagnetScene[];
}

export const MAX_MAGNET_OR_NOT_LEVEL = 10;
export const MAGNET_OR_NOT_ROUNDS = 3;

const EARLY: MagnetScene[] = ['paperclip', 'wood'];
const MID: MagnetScene[] = ['paperclip', 'key', 'wood', 'plastic'];
const ALL: MagnetScene[] = ['paperclip', 'key', 'nail', 'wood', 'plastic', 'paper'];

export const MAGNET_OR_NOT_LEVELS: MagnetOrNotLevelConfig[] = [
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

export function getMagnetOrNotLevel(level: number): MagnetOrNotLevelConfig | undefined {
	return MAGNET_OR_NOT_LEVELS.find((entry) => entry.level === level);
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
	config: MagnetOrNotLevelConfig,
	rand: () => number = Math.random
): MagnetOrNotRound[] {
	const scenes = shuffled(config.scenes, rand);
	return Array.from({ length: MAGNET_OR_NOT_ROUNDS }, (_, index) => {
		const scene = scenes[index % scenes.length];
		return {
			scene,
			answer: SCENE_ANSWER[scene],
			options: shuffled(['magnet', 'not'] as MagnetId[], rand)
		};
	});
}
