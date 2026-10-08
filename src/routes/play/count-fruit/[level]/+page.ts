import { LEVELS } from '#lib/count-fruit.js';

/** Prerender every level so a refresh mid-game never lands on a 404. */
export function entries() {
	return LEVELS.map((entry) => ({ level: String(entry.level) }));
}
