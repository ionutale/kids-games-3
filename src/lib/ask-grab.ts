/**
 * Pure rules for "Ask / grab".
 */

export type AskGrabId = 'ask' | 'grab';
export type AskGrabScene = 'raise-hand' | 'please-cup' | 'wait-turn' | 'snatch' | 'push-in' | 'take-without';

export const SCENE_ANSWER: Record<AskGrabScene, AskGrabId> = {
	'raise-hand': 'ask',
	'please-cup': 'ask',
	'wait-turn': 'ask',
	snatch: 'grab',
	'push-in': 'grab',
	'take-without': 'grab'
};

export interface AskGrabRound {
	scene: AskGrabScene;
	answer: AskGrabId;
	options: AskGrabId[];
}

export interface AskGrabLevelConfig {
	level: number;
	scenes: AskGrabScene[];
}

export const MAX_ASK_GRAB_LEVEL = 10;
export const ASK_GRAB_ROUNDS = 3;

const EARLY: AskGrabScene[] = ['raise-hand', 'snatch'];
const MID: AskGrabScene[] = ['raise-hand', 'please-cup', 'snatch', 'push-in'];
const ALL: AskGrabScene[] = ['raise-hand', 'please-cup', 'wait-turn', 'snatch', 'push-in', 'take-without'];

export const ASK_GRAB_LEVELS: AskGrabLevelConfig[] = [
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

export function getAskGrabLevel(level: number): AskGrabLevelConfig | undefined {
	return ASK_GRAB_LEVELS.find((entry) => entry.level === level);
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
	config: AskGrabLevelConfig,
	rand: () => number = Math.random
): AskGrabRound[] {
	const scenes = shuffled(config.scenes, rand);
	return Array.from({ length: ASK_GRAB_ROUNDS }, (_, index) => {
		const scene = scenes[index % scenes.length];
		return {
			scene,
			answer: SCENE_ANSWER[scene],
			options: shuffled(['ask', 'grab'] as AskGrabId[], rand)
		};
	});
}
