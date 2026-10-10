import { describe, expect, test } from 'vitest';
import { JIGSAW_ROUNDS, buildEdges, getJigsawLevel, pickRounds, piecePath } from './jigsaw';

describe('jigsaw levels', () => {
	test('ten levels, each with more pieces than the last', () => {
		let previous = 0;
		for (let level = 1; level <= 10; level++) {
			const config = getJigsawLevel(level)!;
			expect(config).toBeDefined();
			const pieces = config.rows * config.cols;
			expect(pieces).toBeGreaterThan(previous);
			previous = pieces;
		}
		expect(getJigsawLevel(1)!.rows * getJigsawLevel(1)!.cols).toBe(4);
		expect(getJigsawLevel(10)!.rows * getJigsawLevel(10)!.cols).toBe(30);
		expect(getJigsawLevel(11)).toBeUndefined();
	});
});

describe('buildEdges', () => {
	test('neighbors lock together and borders stay flat', () => {
		const edges = buildEdges(2, 3, () => 0.25);
		expect(edges).toHaveLength(2);
		expect(edges[0]).toHaveLength(3);
		for (let c = 0; c < 3; c++) {
			expect(edges[0][c].top).toBe(0);
			expect(edges[1][c].bottom).toBe(0);
			expect(edges[0][c].bottom).toBe(-edges[1][c].top);
		}
		for (let r = 0; r < 2; r++) {
			expect(edges[r][0].left).toBe(0);
			expect(edges[r][2].right).toBe(0);
			expect(edges[r][0].right).toBe(-edges[r][1].left);
			expect(edges[r][1].right).toBe(-edges[r][2].left);
		}
	});
});

describe('piecePath', () => {
	test('returns a closed path with rounded corners', () => {
		const path = piecePath({ top: 1, right: -1, bottom: 0, left: 0 });
		expect(path.startsWith('M ')).toBe(true);
		expect(path.endsWith('Z')).toBe(true);
		expect(path.includes('Q ')).toBe(true);
	});
});

describe('pickRounds', () => {
	test('three puzzles with matching piece ids', () => {
		for (let level = 1; level <= 10; level++) {
			const config = getJigsawLevel(level)!;
			const rounds = pickRounds(config, () => 0.3);
			expect(rounds).toHaveLength(JIGSAW_ROUNDS);
			for (const round of rounds) {
				expect(round.pieces).toHaveLength(config.rows * config.cols);
				expect(round.tray).toHaveLength(round.pieces.length);
				expect(new Set(round.tray).size).toBe(round.pieces.length);
				expect(config.scenes).toContain(round.scene);
				for (const id of round.tray) {
					expect(round.pieces.some((piece) => piece.id === id)).toBe(true);
				}
			}
		}
	});
});
