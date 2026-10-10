import { ABC_LEVELS } from '#lib/abc-order.js';

/** Prerender every level so a refresh mid-game never lands on a 404. */
export function entries() {
	return ABC_LEVELS.map((entry) => ({ level: String(entry.level) }));
}
