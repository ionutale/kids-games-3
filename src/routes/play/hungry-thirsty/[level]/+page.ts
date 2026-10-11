import { HUNGRY_THIRSTY_LEVELS } from '#lib/hungry-thirsty.js';

/** Prerender every level so a refresh mid-game never lands on a 404. */
export function entries() {
	return HUNGRY_THIRSTY_LEVELS.map((entry) => ({ level: String(entry.level) }));
}
