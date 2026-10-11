import { FIRST_SOUND_LEVELS } from '#lib/first-sound.js';
export function entries() {
	return FIRST_SOUND_LEVELS.map((entry) => ({ level: String(entry.level) }));
}
