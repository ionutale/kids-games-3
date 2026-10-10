import { BODY_LEVELS } from '#lib/body-parts.js';

/** Prerender every level so a refresh mid-game never lands on a 404. */
export function entries() {
	return BODY_LEVELS.map((entry) => ({ level: String(entry.level) }));
}
