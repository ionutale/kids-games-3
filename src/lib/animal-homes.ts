/**
 * Pure rules for "Animal homes".
 * Soft science: match an animal to where it lives (bird→nest, fish→water…).
 */

export type HomeAnimalId = 'bird' | 'fish' | 'bunny' | 'dog' | 'bear' | 'bee' | 'cat';

export type HomeId = 'nest' | 'water' | 'burrow' | 'kennel' | 'cave' | 'hive' | 'cushion';

export const HOME_FOR: Record<HomeAnimalId, HomeId> = {
	bird: 'nest',
	fish: 'water',
	bunny: 'burrow',
	dog: 'kennel',
	bear: 'cave',
	bee: 'hive',
	cat: 'cushion'
};

export const ANIMAL_FOR: Record<HomeId, HomeAnimalId> = {
	nest: 'bird',
	water: 'fish',
	burrow: 'bunny',
	kennel: 'dog',
	cave: 'bear',
	hive: 'bee',
	cushion: 'cat'
};

export interface AnimalHomeRound {
	/** Show animal → tap home, or show home → tap animal. */
	mode: 'animal-to-home' | 'home-to-animal';
	animal: HomeAnimalId;
	home: HomeId;
	answer: HomeAnimalId | HomeId;
	options: Array<HomeAnimalId | HomeId>;
}

export interface AnimalHomeLevelConfig {
	level: number;
	animals: HomeAnimalId[];
	optionCount: number;
	modes: Array<'animal-to-home' | 'home-to-animal'>;
}

export const MAX_HOME_LEVEL = 10;
export const HOME_ROUNDS = 3;

const EARLY: HomeAnimalId[] = ['bird', 'fish', 'dog', 'bunny'];
const MID: HomeAnimalId[] = ['bird', 'fish', 'dog', 'bunny', 'bear', 'bee'];
const ALL: HomeAnimalId[] = ['bird', 'fish', 'dog', 'bunny', 'bear', 'bee', 'cat'];

export const HOME_LEVELS: AnimalHomeLevelConfig[] = [
	{ level: 1, animals: EARLY, optionCount: 2, modes: ['animal-to-home'] },
	{ level: 2, animals: EARLY, optionCount: 2, modes: ['animal-to-home'] },
	{ level: 3, animals: EARLY, optionCount: 2, modes: ['home-to-animal'] },
	{ level: 4, animals: EARLY, optionCount: 3, modes: ['animal-to-home'] },
	{ level: 5, animals: MID, optionCount: 3, modes: ['animal-to-home', 'home-to-animal'] },
	{ level: 6, animals: MID, optionCount: 3, modes: ['animal-to-home', 'home-to-animal'] },
	{ level: 7, animals: MID, optionCount: 4, modes: ['animal-to-home', 'home-to-animal'] },
	{ level: 8, animals: ALL, optionCount: 4, modes: ['animal-to-home', 'home-to-animal'] },
	{ level: 9, animals: ALL, optionCount: 4, modes: ['animal-to-home', 'home-to-animal'] },
	{ level: 10, animals: ALL, optionCount: 5, modes: ['animal-to-home', 'home-to-animal'] }
];

export function getHomeLevel(level: number): AnimalHomeLevelConfig | undefined {
	return HOME_LEVELS.find((entry) => entry.level === level);
}

export function isHomeId(value: HomeAnimalId | HomeId): value is HomeId {
	return (
		value === 'nest' ||
		value === 'water' ||
		value === 'burrow' ||
		value === 'kennel' ||
		value === 'cave' ||
		value === 'hive' ||
		value === 'cushion'
	);
}

function shuffled<T>(items: T[], rand: () => number): T[] {
	const copy = [...items];
	for (let i = copy.length - 1; i > 0; i--) {
		const j = Math.floor(rand() * (i + 1));
		[copy[i], copy[j]] = [copy[j], copy[i]];
	}
	return copy;
}

/** Three animal↔home matches. */
export function pickRounds(
	config: AnimalHomeLevelConfig,
	rand: () => number = Math.random
): AnimalHomeRound[] {
	const animals = shuffled(config.animals, rand);
	const modes = shuffled(config.modes, rand);
	return Array.from({ length: HOME_ROUNDS }, (_, index) => {
		const animal = animals[index % animals.length];
		const home = HOME_FOR[animal];
		const mode = modes[index % modes.length];
		if (mode === 'animal-to-home') {
			const homes = config.animals.map((entry) => HOME_FOR[entry]);
			const others = shuffled(
				homes.filter((entry) => entry !== home),
				rand
			).slice(0, config.optionCount - 1);
			return {
				mode,
				animal,
				home,
				answer: home,
				options: shuffled([home, ...others], rand)
			};
		}
		const others = shuffled(
			config.animals.filter((entry) => entry !== animal),
			rand
		).slice(0, config.optionCount - 1);
		return {
			mode,
			animal,
			home,
			answer: animal,
			options: shuffled([animal, ...others], rand)
		};
	});
}
