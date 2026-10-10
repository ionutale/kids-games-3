import { describe, expect, test } from 'vitest';
import { SAME_ROUNDS, closePartner, getSameLevel, pickSameRounds } from './same-pair';

describe('same or not levels', () => {
	test('ten levels of three pairs', () => {
		for (let level = 1; level <= 10; level++) {
			const config = getSameLevel(level)!;
			expect(config.kinds).toHaveLength(SAME_ROUNDS);
		}
		expect(getSameLevel(1)!.kinds[0]).toBe('fruit');
		expect(getSameLevel(6)!.tight).toBe(true);
		expect(getSameLevel(11)).toBeUndefined();
	});
});

describe('pickSameRounds', () => {
	test('a match means both pictures are the same, and both answers appear', () => {
		for (let level = 1; level <= 10; level++) {
			const config = getSameLevel(level)!;
			const rounds = pickSameRounds(config, () => 0.2);
			expect(rounds).toHaveLength(SAME_ROUNDS);
			expect(rounds.some((round) => round.same)).toBe(true);
			expect(rounds.some((round) => !round.same)).toBe(true);
			for (const round of rounds) {
				expect(round.same).toBe(round.left === round.right);
				if (!round.same && config.tight) {
					const partner = closePartner(round.kind, round.left);
					if (partner) expect(round.right).toBe(partner);
				}
			}
		}
	});
});
