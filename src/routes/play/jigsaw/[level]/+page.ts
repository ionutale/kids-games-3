import { JIGSAW_LEVELS } from '#lib/jigsaw.js';

/** Prerender every level so a refresh mid-game never lands on a 404. */
export function entries() {
	return JIGSAW_LEVELS.map((entry) => ({ level: String(entry.level) }));
}
