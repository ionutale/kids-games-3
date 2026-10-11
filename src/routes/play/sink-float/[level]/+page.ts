import { SINK_FLOAT_LEVELS } from '#lib/sink-float.js';

/** Prerender every level so a refresh mid-game never lands on a 404. */
export function entries() {
	return SINK_FLOAT_LEVELS.map((entry) => ({ level: String(entry.level) }));
}
