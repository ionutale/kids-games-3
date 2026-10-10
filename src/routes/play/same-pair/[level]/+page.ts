import { SAME_LEVELS } from '#lib/same-pair.js';

/** Prerender every level so a refresh mid-game never lands on a 404. */
export function entries() {
	return SAME_LEVELS.map((entry) => ({ level: String(entry.level) }));
}
