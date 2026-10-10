import { describe, expect, test } from 'vitest';
import { trackForPath } from './sound';

describe('trackForPath', () => {
	test('shelf uses home, play routes use game', () => {
		expect(trackForPath('/')).toBe('home');
		expect(trackForPath('/it')).toBe('home');
		expect(trackForPath('/play/count-fruit')).toBe('game');
		expect(trackForPath('/ro/play/jigsaw/3')).toBe('game');
	});
});
