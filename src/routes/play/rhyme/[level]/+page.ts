import { RHYME_LEVELS } from '#lib/rhyme.js';

/** Prerender every level so a refresh mid-game never lands on a 404. */
export function entries() {
	return RHYME_LEVELS.map((entry) => ({ level: String(entry.level) }));
}
