import { describe, expect, test } from 'vitest';
import { SUBJECT_ANSWER, getOpenClosedLevel, pickRounds } from './open-closed';

describe('open-closed', () => {
	test('levels', () => {
		for (let level = 1; level <= 10; level++) {
			const config = getOpenClosedLevel(level)!;
			for (const round of pickRounds(config, () => 0.25)) {
				expect(round.answer).toBe(SUBJECT_ANSWER[round.subject]);
			}
		}
		expect(getOpenClosedLevel(11)).toBeUndefined();
	});
});
