import { SAFE_CHOICE_LEVELS } from '#lib/safe-choice.js';

/** Prerender every level so a refresh mid-game never lands on a 404. */
export function entries() {
	return SAFE_CHOICE_LEVELS.map((entry) => ({ level: String(entry.level) }));
}
