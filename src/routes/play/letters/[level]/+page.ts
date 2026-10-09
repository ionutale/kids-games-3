import { LETTER_LEVELS } from '#lib/letters.js';

/** Prerender every level so a refresh mid-game never lands on a 404. */
export function entries() {
	return LETTER_LEVELS.map((entry) => ({ level: String(entry.level) }));
}
