/**
 * Pure rules for "Land / water / air".
 * An animal or vehicle is shown. The child taps where it goes.
 */

export type HabitatId = 'land' | 'water' | 'air';

export type HabitatSubject =
	| 'dog'
	| 'bunny'
	| 'car'
	| 'fish'
	| 'duck'
	| 'boat'
	| 'bird'
	| 'plane'
	| 'bee';

export const SUBJECT_ANSWER: Record<HabitatSubject, HabitatId> = {
	dog: 'land',
	bunny: 'land',
	car: 'land',
	fish: 'water',
	duck: 'water',
	boat: 'water',
	bird: 'air',
	plane: 'air',
	bee: 'air'
};

export interface LandWaterAirRound {
	subject: HabitatSubject;
	answer: HabitatId;
	options: HabitatId[];
}

export interface LandWaterAirLevelConfig {
	level: number;
	subjects: HabitatSubject[];
	habitats: HabitatId[];
}

export const MAX_LAND_WATER_AIR_LEVEL = 10;
export const LAND_WATER_AIR_ROUNDS = 3;

const LAND_WATER: HabitatSubject[] = ['dog', 'bunny', 'fish', 'duck'];
const LAND_WATER_VEHICLES: HabitatSubject[] = ['dog', 'car', 'fish', 'boat', 'duck'];
const ALL: HabitatSubject[] = ['dog', 'bunny', 'car', 'fish', 'duck', 'boat', 'bird', 'plane', 'bee'];

export const LAND_WATER_AIR_LEVELS: LandWaterAirLevelConfig[] = [
	{ level: 1, subjects: LAND_WATER, habitats: ['land', 'water'] },
	{ level: 2, subjects: LAND_WATER, habitats: ['land', 'water'] },
	{ level: 3, subjects: LAND_WATER, habitats: ['land', 'water'] },
	{ level: 4, subjects: LAND_WATER_VEHICLES, habitats: ['land', 'water'] },
	{ level: 5, subjects: LAND_WATER_VEHICLES, habitats: ['land', 'water'] },
	{ level: 6, subjects: ALL, habitats: ['land', 'water', 'air'] },
	{ level: 7, subjects: ALL, habitats: ['land', 'water', 'air'] },
	{ level: 8, subjects: ALL, habitats: ['land', 'water', 'air'] },
	{ level: 9, subjects: ALL, habitats: ['land', 'water', 'air'] },
	{ level: 10, subjects: ALL, habitats: ['land', 'water', 'air'] }
];

export function getLandWaterAirLevel(level: number): LandWaterAirLevelConfig | undefined {
	return LAND_WATER_AIR_LEVELS.find((entry) => entry.level === level);
}

function shuffled<T>(items: T[], rand: () => number): T[] {
	const copy = [...items];
	for (let i = copy.length - 1; i > 0; i--) {
		const j = Math.floor(rand() * (i + 1));
		[copy[i], copy[j]] = [copy[j], copy[i]];
	}
	return copy;
}

/** Three subjects. Options match the level's habitats. */
export function pickRounds(
	config: LandWaterAirLevelConfig,
	rand: () => number = Math.random
): LandWaterAirRound[] {
	const pool = config.subjects.filter((subject) =>
		config.habitats.includes(SUBJECT_ANSWER[subject])
	);
	const subjects = shuffled(pool, rand);
	return Array.from({ length: LAND_WATER_AIR_ROUNDS }, (_, index) => {
		const subject = subjects[index % subjects.length];
		const answer = SUBJECT_ANSWER[subject];
		return {
			subject,
			answer,
			options: shuffled(config.habitats, rand)
		};
	});
}
