import { MAKE_TEN_LEVELS } from '#lib/make-ten.js';
export function entries() {
	return MAKE_TEN_LEVELS.map((entry) => ({ level: String(entry.level) }));
}
