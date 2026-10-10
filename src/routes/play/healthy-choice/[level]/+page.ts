import { HEALTHY_LEVELS } from '#lib/healthy-choice.js';

/** Prerender every level so a refresh mid-game never lands on a 404. */
export function entries() {
	return HEALTHY_LEVELS.map((entry) => ({ level: String(entry.level) }));
}
