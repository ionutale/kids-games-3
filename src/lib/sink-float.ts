/**
 * Pure rules for "Sink or float".
 * An object is dropped in water. The child taps sink or float.
 */

export type SinkFloatId = 'sink' | 'float';

export type SinkFloatObject =
	| 'rock'
	| 'key'
	| 'coin'
	| 'leaf'
	| 'cork'
	| 'boat';

export const OBJECT_ANSWER: Record<SinkFloatObject, SinkFloatId> = {
	rock: 'sink',
	key: 'sink',
	coin: 'sink',
	leaf: 'float',
	cork: 'float',
	boat: 'float'
};

export interface SinkFloatRound {
	object: SinkFloatObject;
	answer: SinkFloatId;
	options: SinkFloatId[];
}

export interface SinkFloatLevelConfig {
	level: number;
	objects: SinkFloatObject[];
}

export const MAX_SINK_FLOAT_LEVEL = 10;
export const SINK_FLOAT_ROUNDS = 3;

const EARLY: SinkFloatObject[] = ['rock', 'leaf'];
const MID: SinkFloatObject[] = ['rock', 'key', 'leaf', 'cork'];
const ALL: SinkFloatObject[] = ['rock', 'key', 'coin', 'leaf', 'cork', 'boat'];

export const SINK_FLOAT_LEVELS: SinkFloatLevelConfig[] = [
	{ level: 1, objects: EARLY },
	{ level: 2, objects: EARLY },
	{ level: 3, objects: EARLY },
	{ level: 4, objects: MID },
	{ level: 5, objects: MID },
	{ level: 6, objects: MID },
	{ level: 7, objects: ALL },
	{ level: 8, objects: ALL },
	{ level: 9, objects: ALL },
	{ level: 10, objects: ALL }
];

export function getSinkFloatLevel(level: number): SinkFloatLevelConfig | undefined {
	return SINK_FLOAT_LEVELS.find((entry) => entry.level === level);
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
	config: SinkFloatLevelConfig,
	rand: () => number = Math.random
): SinkFloatRound[] {
	const objects = shuffled(config.objects, rand);
	return Array.from({ length: SINK_FLOAT_ROUNDS }, (_, index) => {
		const object = objects[index % objects.length];
		return {
			object,
			answer: OBJECT_ANSWER[object],
			options: shuffled(['sink', 'float'], rand)
		};
	});
}
