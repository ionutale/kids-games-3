import { LAST_SOUND_LEVELS } from '#lib/last-sound.js';
export function entries() {
	return LAST_SOUND_LEVELS.map((e) => ({ level: String(e.level) }));
}
