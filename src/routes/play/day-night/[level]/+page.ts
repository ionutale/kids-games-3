import { DAY_NIGHT_LEVELS } from '#lib/day-night.js';

/** Prerender every level so a refresh mid-game never lands on a 404. */
export function entries() {
	return DAY_NIGHT_LEVELS.map((entry) => ({ level: String(entry.level) }));
}
