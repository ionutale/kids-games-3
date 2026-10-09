import { READ_LEVELS } from '#lib/read-word.js';

/** Prerender every level so a refresh mid-game never lands on a 404. */
export function entries() {
	return READ_LEVELS.map((entry) => ({ level: String(entry.level) }));
}
