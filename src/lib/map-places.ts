/**
 * Pure rules for "Map / places".
 * A prompt names a place. The child taps the matching picture.
 */

export type PlaceId = 'home' | 'school' | 'park' | 'store' | 'library' | 'beach';

export interface PlaceRound {
	answer: PlaceId;
	options: PlaceId[];
}

export interface PlaceLevelConfig {
	level: number;
	places: PlaceId[];
	optionCount: number;
}

export const MAX_PLACE_LEVEL = 10;
export const PLACE_ROUNDS = 3;

const EARLY: PlaceId[] = ['home', 'school', 'park', 'store'];
const ALL: PlaceId[] = ['home', 'school', 'park', 'store', 'library', 'beach'];

export const PLACE_LEVELS: PlaceLevelConfig[] = [
	{ level: 1, places: EARLY, optionCount: 2 },
	{ level: 2, places: EARLY, optionCount: 2 },
	{ level: 3, places: EARLY, optionCount: 3 },
	{ level: 4, places: EARLY, optionCount: 3 },
	{ level: 5, places: EARLY, optionCount: 4 },
	{ level: 6, places: EARLY, optionCount: 4 },
	{ level: 7, places: ALL, optionCount: 4 },
	{ level: 8, places: ALL, optionCount: 4 },
	{ level: 9, places: ALL, optionCount: 5 },
	{ level: 10, places: ALL, optionCount: 5 }
];

export function getPlaceLevel(level: number): PlaceLevelConfig | undefined {
	return PLACE_LEVELS.find((entry) => entry.level === level);
}

function shuffled<T>(items: T[], rand: () => number): T[] {
	const copy = [...items];
	for (let i = copy.length - 1; i > 0; i--) {
		const j = Math.floor(rand() * (i + 1));
		[copy[i], copy[j]] = [copy[j], copy[i]];
	}
	return copy;
}

/** Three place prompts. Options are map pictures. */
export function pickRounds(
	config: PlaceLevelConfig,
	rand: () => number = Math.random
): PlaceRound[] {
	const picks = shuffled(config.places, rand);
	const rounds: PlaceRound[] = [];
	for (let i = 0; i < PLACE_ROUNDS; i++) {
		const answer = picks[i % picks.length];
		const others = shuffled(
			config.places.filter((place) => place !== answer),
			rand
		).slice(0, config.optionCount - 1);
		rounds.push({
			answer,
			options: shuffled([answer, ...others], rand)
		});
	}
	return rounds;
}
