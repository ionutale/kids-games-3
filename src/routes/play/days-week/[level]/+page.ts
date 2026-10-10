import { DAYS_LEVELS } from '#lib/days-week.js';

/** Prerender every level so a refresh mid-game never lands on a 404. */
export function entries() {
	return DAYS_LEVELS.map((entry) => ({ level: String(entry.level) }));
}
