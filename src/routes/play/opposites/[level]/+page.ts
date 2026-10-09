import { OPP_LEVELS } from '#lib/opposites.js';

/** Prerender every level so a refresh mid-game never lands on a 404. */
export function entries() {
	return OPP_LEVELS.map((entry) => ({ level: String(entry.level) }));
}
