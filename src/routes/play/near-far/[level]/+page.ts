import { NEAR_FAR_LEVELS } from '#lib/near-far.js';

/** Prerender every level so a refresh mid-game never lands on a 404. */
export function entries() {
	return NEAR_FAR_LEVELS.map((entry) => ({ level: String(entry.level) }));
}
