import { SORT_LEVELS } from '#lib/sort-color.js';

/** Prerender every level so a refresh mid-game never lands on a 404. */
export function entries() {
	return SORT_LEVELS.map((entry) => ({ level: String(entry.level) }));
}
