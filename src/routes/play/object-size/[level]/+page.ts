import { OBJECT_SIZE_LEVELS } from '#lib/object-size.js';
export function entries() {
	return OBJECT_SIZE_LEVELS.map((entry) => ({ level: String(entry.level) }));
}
