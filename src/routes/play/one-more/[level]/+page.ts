import { ONE_MORE_LEVELS } from '#lib/one-more.js';

/** Prerender every level so a refresh mid-game never lands on a 404. */
export function entries() {
	return ONE_MORE_LEVELS.map((entry) => ({ level: String(entry.level) }));
}
