import { NEXT_LEVELS } from '#lib/next-number.js';

/** Prerender every level so a refresh mid-game never lands on a 404. */
export function entries() {
	return NEXT_LEVELS.map((entry) => ({ level: String(entry.level) }));
}
