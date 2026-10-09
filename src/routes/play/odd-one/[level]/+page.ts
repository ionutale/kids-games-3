import { ODD_LEVELS } from '#lib/odd-one.js';

/** Prerender every level so a refresh mid-game never lands on a 404. */
export function entries() {
	return ODD_LEVELS.map((entry) => ({ level: String(entry.level) }));
}
