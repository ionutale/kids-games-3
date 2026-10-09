import { ADDING_LEVELS } from '#lib/adding.js';

/** Prerender every level so a refresh mid-game never lands on a 404. */
export function entries() {
	return ADDING_LEVELS.map((entry) => ({ level: String(entry.level) }));
}
