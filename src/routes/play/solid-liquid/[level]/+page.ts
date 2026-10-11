import { SOLID_LIQUID_LEVELS } from '#lib/solid-liquid.js';
export function entries() {
	return SOLID_LIQUID_LEVELS.map((entry) => ({ level: String(entry.level) }));
}
