import { describe, expect, test } from 'vitest';
import { WORD_LETTERS, getWordLengthLevel, pickRounds } from './word-length';

describe('word-length', () => {
	test('longer/shorter match letter counts', () => {
		for (let level = 1; level <= 10; level++) {
			const config = getWordLengthLevel(level)!;
			for (const round of pickRounds(config, () => 0.4)) {
				const longer =
					WORD_LETTERS[round.left] > WORD_LETTERS[round.right] ? round.left : round.right;
				const shorter = longer === round.left ? round.right : round.left;
				expect(round.answer).toBe(round.ask === 'longer' ? longer : shorter);
			}
		}
		expect(getWordLengthLevel(11)).toBeUndefined();
	});
});
