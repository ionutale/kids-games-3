import { HOW_MANY_MORE_LEVELS } from '#lib/how-many-more.js';
export function entries() {
	return HOW_MANY_MORE_LEVELS.map((e) => ({ level: String(e.level) }));
}
