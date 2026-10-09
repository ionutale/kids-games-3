import { SHAPE_LEVELS } from '#lib/color-shapes.js';

/** Prerender every level so a refresh mid-game never lands on a 404. */
export function entries() {
	return SHAPE_LEVELS.map((entry) => ({ level: String(entry.level) }));
}
