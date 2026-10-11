import { describe, expect, test } from 'vitest';
import { SAME_NUMBER_ROUNDS, getSameNumberLevel, pickRounds } from './same-number';

describe('same-number', () => {
	test('answer matches pile equality', () => {
		for (let level = 1; level <= 10; level++) {
			const config = getSameNumberLevel(level)!;
			const rounds = pickRounds(config, () => 0.25);
			expect(rounds).toHaveLength(SAME_NUMBER_ROUNDS);
			for (const round of rounds) {
				expect(round.answer).toBe(round.left === round.right ? 'same' : 'different');
			}
		}
		expect(getSameNumberLevel(11)).toBeUndefined();
	});
});
