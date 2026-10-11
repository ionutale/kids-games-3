import { DAY_JOBS_LEVELS } from '#lib/day-jobs.js';

/** Prerender every level so a refresh mid-game never lands on a 404. */
export function entries() {
	return DAY_JOBS_LEVELS.map((entry) => ({ level: String(entry.level) }));
}
