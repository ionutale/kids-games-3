import { EVEN_ODD_LEVELS } from '#lib/even-odd.js';
export function entries() {
	return EVEN_ODD_LEVELS.map((e) => ({ level: String(e.level) }));
}
