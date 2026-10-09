import { SMALL_BIG_LEVELS } from '#lib/small-big.js';

/** Prerender every level so a refresh mid-game never lands on a 404. */
export function entries() {
	return SMALL_BIG_LEVELS.map((entry) => ({ level: String(entry.level) }));
}
