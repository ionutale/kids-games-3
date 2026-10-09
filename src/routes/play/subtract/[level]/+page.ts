import { SUBTRACT_LEVELS } from '#lib/subtract.js';

/** Prerender every level so a refresh mid-game never lands on a 404. */
export function entries() {
	return SUBTRACT_LEVELS.map((entry) => ({ level: String(entry.level) }));
}
