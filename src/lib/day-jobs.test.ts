import { describe, expect, test } from 'vitest';
import { DAY_JOBS_ROUNDS, SCENE_JOB, getDayJobsLevel, pickRounds } from './day-jobs';

describe('day-jobs', () => {
	test('ten levels and valid options', () => {
		for (let level = 1; level <= 10; level++) {
			const config = getDayJobsLevel(level)!;
			const rounds = pickRounds(config, () => 0.2);
			expect(rounds).toHaveLength(DAY_JOBS_ROUNDS);
			for (const round of rounds) {
				expect(round.answer).toBe(SCENE_JOB[round.scene]);
				expect(round.options).toContain(round.answer);
				expect(round.options.length).toBe(config.optionCount);
			}
		}
		expect(getDayJobsLevel(11)).toBeUndefined();
	});
});
