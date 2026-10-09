import { SIDES_LEVELS } from '#lib/sides.js';

/** Prerender every level so a refresh mid-game never lands on a 404. */
export function entries() {
	return SIDES_LEVELS.map((entry) => ({ level: String(entry.level) }));
}
