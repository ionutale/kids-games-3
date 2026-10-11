import { describe, expect, test } from 'vitest';
import {
	LAND_WATER_AIR_ROUNDS,
	SUBJECT_ANSWER,
	getLandWaterAirLevel,
	pickRounds
} from './land-water-air';

describe('land-water-air levels', () => {
	test('ten levels', () => {
		for (let level = 1; level <= 10; level++) {
			expect(getLandWaterAirLevel(level)).toBeDefined();
		}
		expect(getLandWaterAirLevel(1)!.habitats).toEqual(['land', 'water']);
		expect(getLandWaterAirLevel(6)!.habitats).toEqual(['land', 'water', 'air']);
		expect(getLandWaterAirLevel(11)).toBeUndefined();
	});
});

describe('pickRounds', () => {
	test('answer matches the subject and options match level habitats', () => {
		for (let level = 1; level <= 10; level++) {
			const config = getLandWaterAirLevel(level)!;
			const rounds = pickRounds(config, () => 0.25);
			expect(rounds).toHaveLength(LAND_WATER_AIR_ROUNDS);
			for (const round of rounds) {
				expect(round.answer).toBe(SUBJECT_ANSWER[round.subject]);
				expect(round.options).toHaveLength(config.habitats.length);
				for (const habitat of config.habitats) {
					expect(round.options).toContain(habitat);
				}
				expect(config.subjects).toContain(round.subject);
				expect(config.habitats).toContain(round.answer);
			}
		}
	});
});
