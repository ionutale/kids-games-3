import { PLANT_ANIMAL_LEVELS } from '#lib/plant-animal.js';

/** Prerender every level so a refresh mid-game never lands on a 404. */
export function entries() {
	return PLANT_ANIMAL_LEVELS.map((entry) => ({ level: String(entry.level) }));
}
