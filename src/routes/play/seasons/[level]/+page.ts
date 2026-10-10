import { SEASON_LEVELS } from '#lib/seasons.js';

/** Prerender every level so a refresh mid-game never lands on a 404. */
export function entries() {
	return SEASON_LEVELS.map((entry) => ({ level: String(entry.level) }));
}
