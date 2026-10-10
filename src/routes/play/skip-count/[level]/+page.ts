import { SKIP_LEVELS } from '#lib/skip-count.js';

/** Prerender every level so a refresh mid-game never lands on a 404. */
export function entries() {
	return SKIP_LEVELS.map((entry) => ({ level: String(entry.level) }));
}
