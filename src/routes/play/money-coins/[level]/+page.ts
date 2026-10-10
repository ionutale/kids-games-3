import { MONEY_LEVELS } from '#lib/money-coins.js';

/** Prerender every level so a refresh mid-game never lands on a 404. */
export function entries() {
	return MONEY_LEVELS.map((entry) => ({ level: String(entry.level) }));
}
