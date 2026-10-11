import { FRONT_BEHIND_LEVELS } from '#lib/front-behind.js';
export function entries() {
	return FRONT_BEHIND_LEVELS.map((entry) => ({ level: String(entry.level) }));
}
