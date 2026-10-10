import { SHADOW_LEVELS } from '#lib/shadow-match.js';

/** Prerender every level so a refresh mid-game never lands on a 404. */
export function entries() {
	return SHADOW_LEVELS.map((entry) => ({ level: String(entry.level) }));
}
