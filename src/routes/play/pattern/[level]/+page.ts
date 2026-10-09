import { PATTERN_LEVELS } from '#lib/pattern.js';

/** Prerender every level so a refresh mid-game never lands on a 404. */
export function entries() {
	return PATTERN_LEVELS.map((entry) => ({ level: String(entry.level) }));
}
