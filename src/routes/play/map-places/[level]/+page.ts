import { PLACE_LEVELS } from '#lib/map-places.js';

/** Prerender every level so a refresh mid-game never lands on a 404. */
export function entries() {
	return PLACE_LEVELS.map((entry) => ({ level: String(entry.level) }));
}
