import { SYL_LEVELS } from '#lib/syllable.js';

/** Prerender every level so a refresh mid-game never lands on a 404. */
export function entries() {
	return SYL_LEVELS.map((entry) => ({ level: String(entry.level) }));
}
