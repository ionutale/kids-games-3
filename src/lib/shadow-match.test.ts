import { describe, expect, test } from 'vitest';
import { SHADOW_ROUNDS, closePartner, getShadowLevel, pickRounds } from './shadow-match';

describe('shadow match levels', () => {
	test('ten levels of three rounds', () => {
		for (let level = 1; level <= 10; level++) {
			const config = getShadowLevel(level)!;
			expect(config.kinds).toHaveLength(SHADOW_ROUNDS);
		}
		expect(getShadowLevel(1)!.kinds[0]).toBe('fruit');
		expect(getShadowLevel(1)!.optionCount).toBe(2);
		expect(getShadowLevel(6)!.tight).toBe(true);
		expect(getShadowLevel(11)).toBeUndefined();
	});
});

describe('pickRounds', () => {
	test('the answer is among the options', () => {
		for (let level = 1; level <= 10; level++) {
			const config = getShadowLevel(level)!;
			const rounds = pickRounds(config, () => 0.25);
			expect(rounds).toHaveLength(SHADOW_ROUNDS);
			for (const round of rounds) {
				expect(round.options).toHaveLength(config.optionCount);
				expect(new Set(round.options).size).toBe(round.options.length);
				expect(round.options).toContain(round.answer);
				if (config.tight) {
					const partner = closePartner(round.kind, round.answer);
					if (partner && poolHas(config, round.kind, partner)) {
						expect(round.options).toContain(partner);
					}
				}
			}
		}
	});
});

function poolHas(
	config: NonNullable<ReturnType<typeof getShadowLevel>>,
	kind: 'fruit' | 'shape' | 'feeling',
	key: string
): boolean {
	if (kind === 'fruit') return config.fruits.includes(key as never);
	if (kind === 'shape') return config.shapes.includes(key as never);
	return config.emotions.includes(key as never);
}
