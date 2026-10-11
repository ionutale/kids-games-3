import { IN_ON_UNDER_LEVELS } from '#lib/in-on-under.js';
export function entries() {
	return IN_ON_UNDER_LEVELS.map((entry) => ({ level: String(entry.level) }));
}
