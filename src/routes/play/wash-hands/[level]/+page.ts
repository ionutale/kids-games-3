import { WASH_LEVELS } from '#lib/wash-hands.js';

/** Prerender every level so a refresh mid-game never lands on a 404. */
export function entries() {
	return WASH_LEVELS.map((entry) => ({ level: String(entry.level) }));
}
