import { BATH_LEVELS } from '#lib/bath.js';

/** Prerender every level so a refresh mid-game never lands on a 404. */
export function entries() {
	return BATH_LEVELS.map((entry) => ({ level: String(entry.level) }));
}
