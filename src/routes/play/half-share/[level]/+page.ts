import { HALF_LEVELS } from '#lib/half-share.js';

/** Prerender every level so a refresh mid-game never lands on a 404. */
export function entries() {
	return HALF_LEVELS.map((entry) => ({ level: String(entry.level) }));
}
