import { RECYCLE_LEVELS } from '#lib/recycle-sort.js';

/** Prerender every level so a refresh mid-game never lands on a 404. */
export function entries() {
	return RECYCLE_LEVELS.map((entry) => ({ level: String(entry.level) }));
}
