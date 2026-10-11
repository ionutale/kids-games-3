import { describe, expect, test } from 'vitest';
import { WORD_SOUND, getFirstSoundLevel, pickRounds } from './first-sound';

describe('first-sound', () => {
	test('answer is starting letter', () => {
		for (let level = 1; level <= 10; level++) {
			const config = getFirstSoundLevel(level)!;
			for (const round of pickRounds(config, () => 0.22)) {
				expect(round.answer).toBe(WORD_SOUND[round.word]);
				expect(round.options).toContain(round.answer);
			}
		}
		expect(getFirstSoundLevel(11)).toBeUndefined();
	});
});
