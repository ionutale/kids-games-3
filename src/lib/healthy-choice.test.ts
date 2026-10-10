import { describe, expect, test } from 'vitest';
import { HEALTHY_ROUNDS, getHealthyLevel, isHealthy, pickRounds } from './healthy-choice';

describe('healthy-choice levels', () => {
	test('ten levels', () => {
		for (let level = 1; level <= 10; level++) {
			expect(getHealthyLevel(level)).toBeDefined();
		}
		expect(getHealthyLevel(1)!.healthy.length).toBe(4);
		expect(getHealthyLevel(10)!.healthy.length).toBe(8);
		expect(getHealthyLevel(11)).toBeUndefined();
	});
});

describe('pickRounds', () => {
	test('each round has one healthy answer and one treat', () => {
		for (let level = 1; level <= 10; level++) {
			const config = getHealthyLevel(level)!;
			const rounds = pickRounds(config, () => 0.25);
			expect(rounds).toHaveLength(HEALTHY_ROUNDS);
			for (const round of rounds) {
				expect(round.options).toHaveLength(2);
				expect(round.options).toContain(round.answer);
				expect(round.options).toContain(round.treat);
				expect(isHealthy(round.answer)).toBe(true);
				expect(isHealthy(round.treat)).toBe(false);
				expect(config.healthy).toContain(round.healthy);
				expect(config.treats).toContain(round.treat);
			}
		}
	});
});
