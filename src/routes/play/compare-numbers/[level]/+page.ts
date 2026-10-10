import { COMPARE_LEVELS } from '#lib/compare-numbers.js';

/** Prerender every level so a refresh mid-game never lands on a 404. */
export function entries() {
	return COMPARE_LEVELS.map((entry) => ({ level: String(entry.level) }));
}
