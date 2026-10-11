import { NEW_OLD_LEVELS } from '#lib/new-old.js';
export function entries() {
	return NEW_OLD_LEVELS.map((entry) => ({ level: String(entry.level) }));
}
