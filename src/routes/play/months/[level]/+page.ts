import { MONTHS_LEVELS } from '#lib/months.js';

/** Prerender every level so a refresh mid-game never lands on a 404. */
export function entries() {
	return MONTHS_LEVELS.map((entry) => ({ level: String(entry.level) }));
}
