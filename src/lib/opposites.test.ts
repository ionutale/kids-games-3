import { describe, expect, test } from 'vitest';
import { OPP_ROUNDS, getOppLevel, makeRounds, type OppCard } from './opposites';

function sameThing(prompt: OppCard, answer: OppCard): boolean {
	if (prompt.kind === 'feeling' && answer.kind === 'feeling') {
		return (
			(prompt.emotion === 'happy' && answer.emotion === 'sad') ||
			(prompt.emotion === 'sad' && answer.emotion === 'happy')
		);
	}
	if (prompt.kind === 'size' && answer.kind === 'size') {
		return (
			prompt.fruit === answer.fruit &&
			((prompt.scale === 'big' && answer.scale === 'small') ||
				(prompt.scale === 'small' && answer.scale === 'big'))
		);
	}
	if (prompt.kind === 'sky' && answer.kind === 'sky') {
		return (
			(prompt.sky === 'sun' && answer.sky === 'moon') ||
			(prompt.sky === 'moon' && answer.sky === 'sun')
		);
	}
	if (prompt.kind === 'way' && answer.kind === 'way') {
		return (
			(prompt.way === 'up' && answer.way === 'down') ||
			(prompt.way === 'down' && answer.way === 'up')
		);
	}
	return false;
}

describe('opposites levels', () => {
	test('ten levels of three rounds', () => {
		for (let level = 1; level <= 10; level++) {
			const config = getOppLevel(level)!;
			expect(config.rounds).toHaveLength(OPP_ROUNDS);
		}
		expect(getOppLevel(1)!.rounds[0]).toBe('feeling');
		expect(getOppLevel(6)!.tight).toBe(true);
		expect(getOppLevel(11)).toBeUndefined();
	});
});

describe('makeRounds', () => {
	test('the answer is the opposite and sits among the choices', () => {
		for (let level = 1; level <= 10; level++) {
			const config = getOppLevel(level)!;
			const rounds = makeRounds(config, () => 0.35);
			expect(rounds).toHaveLength(OPP_ROUNDS);
			for (const round of rounds) {
				expect(round.options).toHaveLength(3);
				const answer = round.options.find((card) => card.id === round.answerId);
				expect(answer).toBeDefined();
				expect(sameThing(round.prompt, answer!)).toBe(true);
				expect(round.options.some((card) => card.id === round.prompt.id)).toBe(false);
			}
		}
	});
});
