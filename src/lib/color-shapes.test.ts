import { describe, expect, test } from 'vitest';
import {
	MAX_SHAPE_LEVEL,
	SHAPE_ROUNDS_PER_LEVEL,
	figurePhrase,
	getShapeLevel,
	makeFigureOptions,
	pickFigures,
	type Figure
} from './color-shapes';

const key = (figure: Figure) => `${figure.color}-${figure.shape}`;

describe('shape levels', () => {
	test('ten levels with at least three possible figures', () => {
		expect(MAX_SHAPE_LEVEL).toBe(10);
		for (let level = 1; level <= 10; level++) {
			const config = getShapeLevel(level)!;
			expect(config).toBeDefined();
			expect(config.colors.length * config.shapes.length).toBeGreaterThanOrEqual(
				SHAPE_ROUNDS_PER_LEVEL
			);
		}
		expect(getShapeLevel(1)!.fullPrompt).toBe(false);
		expect(getShapeLevel(4)!.fullPrompt).toBe(true);
		expect(getShapeLevel(11)).toBeUndefined();
	});
});

describe('pickFigures', () => {
	test('three different figures from the level sets', () => {
		for (let level = 1; level <= 10; level++) {
			const config = getShapeLevel(level)!;
			const figures = pickFigures(config, () => 0.42);
			expect(figures).toHaveLength(SHAPE_ROUNDS_PER_LEVEL);
			expect(new Set(figures.map(key)).size).toBe(SHAPE_ROUNDS_PER_LEVEL);
			for (const figure of figures) {
				expect(config.colors).toContain(figure.color);
				expect(config.shapes).toContain(figure.shape);
			}
		}
	});
});

describe('makeFigureOptions', () => {
	test('three options including the right figure', () => {
		for (let level = 1; level <= 10; level++) {
			const config = getShapeLevel(level)!;
			const correct = pickFigures(config, () => 0.1)[0];
			const options = makeFigureOptions(config, correct, () => 0.7);
			expect(options).toHaveLength(3);
			expect(options.map(key)).toContain(key(correct));
			expect(new Set(options.map(key)).size).toBe(3);
		}
	});

	test('tight shape levels share the shape', () => {
		const config = getShapeLevel(7)!;
		const correct: Figure = { color: 'red', shape: 'circle' };
		const options = makeFigureOptions(config, correct, () => 0.99);
		const others = options.filter((figure) => key(figure) !== key(correct));
		expect(others.length).toBe(2);
		for (const other of others) {
			expect(other.shape).toBe('circle');
			expect(other.color).not.toBe('red');
		}
	});

	test('tight color levels share the color', () => {
		const config = getShapeLevel(8)!;
		const correct: Figure = { color: 'green', shape: 'triangle' };
		const options = makeFigureOptions(config, correct, () => 0.99);
		const others = options.filter((figure) => key(figure) !== key(correct));
		for (const other of others) {
			expect(other.color).toBe('green');
			expect(other.shape).not.toBe('triangle');
		}
	});

	test('mixed levels bring one of each', () => {
		const config = getShapeLevel(10)!;
		const correct: Figure = { color: 'blue', shape: 'star' };
		const options = makeFigureOptions(config, correct, () => 0.3);
		const others = options.filter((figure) => key(figure) !== key(correct));
		expect(others.some((figure) => figure.shape === 'star')).toBe(true);
		expect(others.some((figure) => figure.color === 'blue')).toBe(true);
	});
});

describe('figurePhrase', () => {
	const t = (words: Record<string, string>) => (key: string) => words[key] ?? '';

	test('english joins color and shape', () => {
		const en = t({ color_red: 'red', shape_circle: 'circle' });
		expect(figurePhrase(en, 'en', { color: 'red', shape: 'circle' }, true)).toBe('red circle');
		expect(figurePhrase(en, 'en', { color: 'red', shape: 'circle' }, false)).toBe('red');
	});

	test('italian agrees with the shape gender', () => {
		const it = t({
			color_red: 'rosso',
			color_red_f: 'rossa',
			color_blue: 'blu',
			color_blue_f: 'blu',
			color_blue_solo: 'il blu',
			shape_circle: 'il cerchio',
			shape_star: 'la stella'
		});
		expect(figurePhrase(it, 'it', { color: 'red', shape: 'circle' }, true)).toBe(
			'il cerchio rosso'
		);
		expect(figurePhrase(it, 'it', { color: 'blue', shape: 'star' }, true)).toBe('la stella blu');
		expect(figurePhrase(it, 'it', { color: 'blue', shape: 'circle' }, false)).toBe('il blu');
	});

	test('romanian agrees with the shape gender', () => {
		const ro = t({
			color_yellow: 'galben',
			color_yellow_f: 'galbenă',
			color_yellow_solo: 'galbenă',
			shape_triangle: 'triunghiul',
			shape_heart: 'inima',
			shape_circle: 'cercul'
		});
		expect(figurePhrase(ro, 'ro', { color: 'yellow', shape: 'triangle' }, true)).toBe(
			'triunghiul galben'
		);
		expect(figurePhrase(ro, 'ro', { color: 'yellow', shape: 'heart' }, true)).toBe('inima galbenă');
		expect(figurePhrase(ro, 'ro', { color: 'yellow', shape: 'circle' }, false)).toBe('galbenă');
	});

	test('german declines the adjective', () => {
		const de = t({
			color_green: 'grün',
			color_green_solo: 'Grün',
			color_orange: 'orange',
			shape_square: 'Quadrat'
		});
		expect(figurePhrase(de, 'de', { color: 'green', shape: 'square' }, true)).toBe(
			'das grüne Quadrat'
		);
		expect(figurePhrase(de, 'de', { color: 'orange', shape: 'square' }, true)).toBe(
			'das orange Quadrat'
		);
		expect(figurePhrase(de, 'de', { color: 'green', shape: 'square' }, false)).toBe('Grün');
	});
});
