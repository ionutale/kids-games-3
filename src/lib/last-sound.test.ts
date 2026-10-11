import { describe, expect, test } from 'vitest';
import { WORD_END, getLastSoundLevel, pickRounds } from './last-sound';
describe('last-sound', () => {
	test('ending letter', () => {
		for (let level = 1; level <= 10; level++) {
			const config = getLastSoundLevel(level)!;
			for (const round of pickRounds(config, () => 0.2)) {
				expect(round.answer).toBe(WORD_END[round.word]);
			}
		}
		expect(getLastSoundLevel(11)).toBeUndefined();
	});
});
