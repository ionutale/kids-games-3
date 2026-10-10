import { SET_LEVELS } from '#lib/complete-set.js';

/** Prerender every level so a refresh mid-game never lands on a 404. */
export function entries() {
	return SET_LEVELS.map((entry) => ({ level: String(entry.level) }));
}
