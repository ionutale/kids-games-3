import { REAL_WORD_LEVELS } from '#lib/real-word.js';
export function entries() {
	return REAL_WORD_LEVELS.map((e) => ({ level: String(e.level) }));
}
