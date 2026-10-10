import { CASE_LEVELS } from '#lib/letter-case.js';

/** Prerender every level so a refresh mid-game never lands on a 404. */
export function entries() {
	return CASE_LEVELS.map((entry) => ({ level: String(entry.level) }));
}
