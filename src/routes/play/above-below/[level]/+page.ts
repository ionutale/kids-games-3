import { ABOVE_LEVELS } from '#lib/above-below.js';

/** Prerender every level so a refresh mid-game never lands on a 404. */
export function entries() {
	return ABOVE_LEVELS.map((entry) => ({ level: String(entry.level) }));
}
