import { WEIGHT_LEVELS } from '#lib/heavy-light.js';

/** Prerender every level so a refresh mid-game never lands on a 404. */
export function entries() {
	return WEIGHT_LEVELS.map((entry) => ({ level: String(entry.level) }));
}
