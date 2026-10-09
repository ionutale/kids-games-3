import { MISSING_LEVELS } from '#lib/missing.js';

/** Prerender every level so a refresh mid-game never lands on a 404. */
export function entries() {
	return MISSING_LEVELS.map((entry) => ({ level: String(entry.level) }));
}
