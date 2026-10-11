import { FIVE_SENSES_LEVELS } from '#lib/five-senses.js';

/** Prerender every level so a refresh mid-game never lands on a 404. */
export function entries() {
	return FIVE_SENSES_LEVELS.map((entry) => ({ level: String(entry.level) }));
}
