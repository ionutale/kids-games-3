import { SHAPE_PATTERN_LEVELS } from '#lib/shape-pattern.js';

/** Prerender every level so a refresh mid-game never lands on a 404. */
export function entries() {
	return SHAPE_PATTERN_LEVELS.map((entry) => ({ level: String(entry.level) }));
}
