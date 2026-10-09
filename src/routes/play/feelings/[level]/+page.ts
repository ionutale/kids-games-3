import { FEELINGS_LEVELS } from '#lib/feelings.js';

/** Prerender every level so a refresh mid-game never lands on a 404. */
export function entries() {
	return FEELINGS_LEVELS.map((entry) => ({ level: String(entry.level) }));
}
