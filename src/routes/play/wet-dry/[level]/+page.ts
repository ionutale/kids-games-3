import { WET_DRY_LEVELS } from '#lib/wet-dry.js';

/** Prerender every level so a refresh mid-game never lands on a 404. */
export function entries() {
	return WET_DRY_LEVELS.map((entry) => ({ level: String(entry.level) }));
}
