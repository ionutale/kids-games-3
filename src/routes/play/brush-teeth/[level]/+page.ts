import { BRUSH_LEVELS } from '#lib/brush-teeth.js';

/** Prerender every level so a refresh mid-game never lands on a 404. */
export function entries() {
	return BRUSH_LEVELS.map((entry) => ({ level: String(entry.level) }));
}
