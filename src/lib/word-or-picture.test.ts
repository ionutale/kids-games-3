import { describe, expect, test } from 'vitest';
import { getWordOrPictureLevel, pickRounds } from './word-or-picture';
describe('word-or-picture', () => {
	test('answer is prompt item', () => {
		for (let level = 1; level <= 10; level++) {
			const config = getWordOrPictureLevel(level)!;
			for (const round of pickRounds(config, () => 0.2)) {
				expect(round.answer).toBe(round.item);
				expect(round.options).toContain(round.answer);
			}
		}
		expect(getWordOrPictureLevel(11)).toBeUndefined();
	});
});
