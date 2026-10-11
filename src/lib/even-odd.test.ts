import { describe, expect, test } from 'vitest';
import { getEvenOddLevel, pickRounds } from './even-odd';
describe('even-odd', () => {
	test('parity', () => {
		for (let level = 1; level <= 10; level++) {
			const config = getEvenOddLevel(level)!;
			for (const round of pickRounds(config, () => 0.35)) {
				expect(round.answer).toBe(round.count % 2 === 0 ? 'even' : 'odd');
			}
		}
		expect(getEvenOddLevel(11)).toBeUndefined();
	});
});
