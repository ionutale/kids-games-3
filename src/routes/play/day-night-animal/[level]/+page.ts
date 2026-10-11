import { DAY_NIGHT_ANIMAL_LEVELS } from '#lib/day-night-animal.js';
export function entries() {
	return DAY_NIGHT_ANIMAL_LEVELS.map((entry) => ({ level: String(entry.level) }));
}
