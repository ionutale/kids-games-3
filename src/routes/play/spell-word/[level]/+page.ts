import { SPELL_LEVELS } from '#lib/spell-word.js';

/** Prerender every level so a refresh mid-game never lands on a 404. */
export function entries() {
	return SPELL_LEVELS.map((entry) => ({ level: String(entry.level) }));
}
