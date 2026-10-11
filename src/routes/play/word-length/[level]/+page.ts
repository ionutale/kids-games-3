import { WORD_LENGTH_LEVELS } from '#lib/word-length.js';

export function entries() {
	return WORD_LENGTH_LEVELS.map((entry) => ({ level: String(entry.level) }));
}
