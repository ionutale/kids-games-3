import { describe, expect, test } from 'vitest';
import { ODD_ROUNDS, closePartner, getOddLevel, isOddCard, makeBoards } from './odd-one';

describe('odd one out levels', () => {
	test('ten levels, each with enough pictures for three rounds', () => {
		for (let level = 1; level <= 10; level++) {
			const config = getOddLevel(level)!;
			expect(config).toBeDefined();
			expect(config.pool.length).toBeGreaterThanOrEqual(ODD_ROUNDS);
		}
		expect(getOddLevel(1)!.kind).toBe('fruit');
		expect(getOddLevel(6)!.close).toBe(true);
		expect(getOddLevel(11)).toBeUndefined();
	});
});

describe('makeBoards', () => {
	test('each board has three of a kind and one different picture', () => {
		for (let level = 1; level <= 10; level++) {
			const config = getOddLevel(level)!;
			const boards = makeBoards(config, () => 0.3);
			expect(boards).toHaveLength(ODD_ROUNDS);
			for (const board of boards) {
				expect(board.cards).toHaveLength(4);
				const odd = board.cards.filter((card) => isOddCard(board, card));
				expect(odd).toHaveLength(1);
				const rest = board.cards.filter((card) => !isOddCard(board, card));
				expect(new Set(rest.map((card) => card.key)).size).toBe(1);
				expect(rest[0].key).not.toBe(board.oddKey);
				if (config.close) {
					expect(board.oddKey).toBe(closePartner(config.kind, rest[0].key));
				}
			}
		}
	});
});
