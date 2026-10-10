/**
 * Pure rules for "Body parts".
 * A prompt names a body part. The child taps it on a figure.
 */

export type BodyPartId =
	| 'head'
	| 'eye'
	| 'nose'
	| 'mouth'
	| 'ear'
	| 'arm'
	| 'hand'
	| 'leg'
	| 'foot'
	| 'tummy';

export interface BodyRound {
	answer: BodyPartId;
	options: BodyPartId[];
}

export interface BodyLevelConfig {
	level: number;
	parts: BodyPartId[];
	optionCount: number;
}

export const MAX_BODY_LEVEL = 10;
export const BODY_ROUNDS = 3;

const EARLY: BodyPartId[] = ['head', 'hand', 'foot', 'nose'];
const MID: BodyPartId[] = ['head', 'eye', 'nose', 'mouth', 'hand', 'foot'];
const ALL: BodyPartId[] = [
	'head',
	'eye',
	'nose',
	'mouth',
	'ear',
	'arm',
	'hand',
	'leg',
	'foot',
	'tummy'
];

export const BODY_LEVELS: BodyLevelConfig[] = [
	{ level: 1, parts: EARLY, optionCount: 2 },
	{ level: 2, parts: EARLY, optionCount: 2 },
	{ level: 3, parts: EARLY, optionCount: 3 },
	{ level: 4, parts: MID, optionCount: 3 },
	{ level: 5, parts: MID, optionCount: 3 },
	{ level: 6, parts: MID, optionCount: 4 },
	{ level: 7, parts: ALL, optionCount: 4 },
	{ level: 8, parts: ALL, optionCount: 4 },
	{ level: 9, parts: ALL, optionCount: 5 },
	{ level: 10, parts: ALL, optionCount: 5 }
];

export function getBodyLevel(level: number): BodyLevelConfig | undefined {
	return BODY_LEVELS.find((entry) => entry.level === level);
}

function shuffled<T>(items: T[], rand: () => number): T[] {
	const copy = [...items];
	for (let i = copy.length - 1; i > 0; i--) {
		const j = Math.floor(rand() * (i + 1));
		[copy[i], copy[j]] = [copy[j], copy[i]];
	}
	return copy;
}

/** Three body-part prompts. Options are hotspots on the figure. */
export function pickRounds(
	config: BodyLevelConfig,
	rand: () => number = Math.random
): BodyRound[] {
	const picks = shuffled(config.parts, rand);
	const rounds: BodyRound[] = [];
	for (let i = 0; i < BODY_ROUNDS; i++) {
		const answer = picks[i % picks.length];
		const others = shuffled(
			config.parts.filter((part) => part !== answer),
			rand
		).slice(0, config.optionCount - 1);
		rounds.push({
			answer,
			options: shuffled([answer, ...others], rand)
		});
	}
	return rounds;
}
