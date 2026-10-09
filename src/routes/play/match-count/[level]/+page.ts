import { MATCH_LEVELS } from '#lib/match-count.js';

/** Prerender every level so a refresh mid-game never lands on a 404. */
export function entries() {
	return MATCH_LEVELS.map((entry) => ({ level: String(entry.level) }));
}
