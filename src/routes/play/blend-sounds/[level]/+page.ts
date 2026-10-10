import { BLEND_LEVELS } from '#lib/blend-sounds.js';

/** Prerender every level so a refresh mid-game never lands on a 404. */
export function entries() {
	return BLEND_LEVELS.map((entry) => ({ level: String(entry.level) }));
}
