import { describe, expect, test } from 'vitest';
import { getHowManyMoreLevel, pickRounds } from './how-many-more';
describe('how-many-more', () => {
	test('diff matches piles', () => {
		for (let level = 1; level <= 10; level++) {
			const config = getHowManyMoreLevel(level)!;
			for (const round of pickRounds(config, () => 0.22)) {
				expect(round.answer).toBe(Math.abs(round.left - round.right));
			}
		}
		expect(getHowManyMoreLevel(11)).toBeUndefined();
	});
});
