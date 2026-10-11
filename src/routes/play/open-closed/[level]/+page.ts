import { OPEN_CLOSED_LEVELS } from '#lib/open-closed.js';

/** Prerender every level so a refresh mid-game never lands on a 404. */
export function entries() {
	return OPEN_CLOSED_LEVELS.map((entry) => ({ level: String(entry.level) }));
}
