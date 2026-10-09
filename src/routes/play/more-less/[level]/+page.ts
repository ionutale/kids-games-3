import { MORE_LEVELS } from '#lib/more-less.js';

/** Prerender every level so a refresh mid-game never lands on a 404. */
export function entries() {
	return MORE_LEVELS.map((entry) => ({ level: String(entry.level) }));
}
