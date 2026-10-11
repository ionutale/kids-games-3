/**
 * Pure rules for "Plant or animal".
 * A living thing is shown. The child taps plant or animal.
 */

export type PlantAnimalId = 'plant' | 'animal';

export type PlantAnimalSubject =
	| 'leaf'
	| 'flower'
	| 'tree'
	| 'dog'
	| 'fish'
	| 'bird';

export const SUBJECT_ANSWER: Record<PlantAnimalSubject, PlantAnimalId> = {
	leaf: 'plant',
	flower: 'plant',
	tree: 'plant',
	dog: 'animal',
	fish: 'animal',
	bird: 'animal'
};

export interface PlantAnimalRound {
	subject: PlantAnimalSubject;
	answer: PlantAnimalId;
	options: PlantAnimalId[];
}

export interface PlantAnimalLevelConfig {
	level: number;
	subjects: PlantAnimalSubject[];
}

export const MAX_PLANT_ANIMAL_LEVEL = 10;
export const PLANT_ANIMAL_ROUNDS = 3;

const EARLY: PlantAnimalSubject[] = ['flower', 'dog'];
const MID: PlantAnimalSubject[] = ['leaf', 'flower', 'dog', 'fish'];
const ALL: PlantAnimalSubject[] = ['leaf', 'flower', 'tree', 'dog', 'fish', 'bird'];

export const PLANT_ANIMAL_LEVELS: PlantAnimalLevelConfig[] = [
	{ level: 1, subjects: EARLY },
	{ level: 2, subjects: EARLY },
	{ level: 3, subjects: EARLY },
	{ level: 4, subjects: MID },
	{ level: 5, subjects: MID },
	{ level: 6, subjects: MID },
	{ level: 7, subjects: ALL },
	{ level: 8, subjects: ALL },
	{ level: 9, subjects: ALL },
	{ level: 10, subjects: ALL }
];

export function getPlantAnimalLevel(level: number): PlantAnimalLevelConfig | undefined {
	return PLANT_ANIMAL_LEVELS.find((entry) => entry.level === level);
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
	config: PlantAnimalLevelConfig,
	rand: () => number = Math.random
): PlantAnimalRound[] {
	const subjects = shuffled(config.subjects, rand);
	return Array.from({ length: PLANT_ANIMAL_ROUNDS }, (_, index) => {
		const subject = subjects[index % subjects.length];
		return {
			subject,
			answer: SUBJECT_ANSWER[subject],
			options: shuffled(['plant', 'animal'], rand)
		};
	});
}
