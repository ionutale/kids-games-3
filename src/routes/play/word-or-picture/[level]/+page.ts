import { WORD_OR_PICTURE_LEVELS } from '#lib/word-or-picture.js';

export function entries() {
	return WORD_OR_PICTURE_LEVELS.map((entry) => ({ level: String(entry.level) }));
}
