import { ONE_LESS_LEVELS } from '#lib/one-less.js';

/** Prerender every level so a refresh mid-game never lands on a 404. */
export function entries() {
	return ONE_LESS_LEVELS.map((entry) => ({ level: String(entry.level) }));
}
