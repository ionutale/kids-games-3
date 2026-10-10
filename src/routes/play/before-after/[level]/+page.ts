import { BEF_LEVELS } from '#lib/before-after.js';

/** Prerender every level so a refresh mid-game never lands on a 404. */
export function entries() {
	return BEF_LEVELS.map((entry) => ({ level: String(entry.level) }));
}
