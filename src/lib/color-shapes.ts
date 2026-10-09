/**
 * Pure rules for "Colors and shapes". The child taps the named figure;
 * early levels name only the color, later ones color and shape.
 */

export type ColorId = 'red' | 'blue' | 'yellow' | 'green' | 'orange' | 'purple';

export type ShapeId = 'circle' | 'square' | 'triangle' | 'star' | 'heart';

export interface Figure {
	color: ColorId;
	shape: ShapeId;
}

/** Which attribute the distractors share with the answer. */
export type Tight = 'shape' | 'color' | 'mixed' | null;

export interface ShapeLevelConfig {
	level: number;
	colors: ColorId[];
	shapes: ShapeId[];
	/** Name color and shape, not just the color. */
	fullPrompt: boolean;
	tight: Tight;
}

export const MAX_SHAPE_LEVEL = 10;
export const SHAPE_ROUNDS_PER_LEVEL = 3;

export const SHAPE_LEVELS: ShapeLevelConfig[] = [
	{
		level: 1,
		colors: ['red', 'blue', 'yellow'],
		shapes: ['circle'],
		fullPrompt: false,
		tight: null
	},
	{
		level: 2,
		colors: ['red', 'blue', 'yellow', 'green'],
		shapes: ['circle'],
		fullPrompt: false,
		tight: null
	},
	{
		level: 3,
		colors: ['red', 'blue', 'yellow', 'green'],
		shapes: ['circle', 'square'],
		fullPrompt: false,
		tight: null
	},
	{
		level: 4,
		colors: ['red', 'blue', 'yellow', 'green'],
		shapes: ['circle', 'square', 'triangle'],
		fullPrompt: true,
		tight: null
	},
	{
		level: 5,
		colors: ['red', 'blue', 'yellow', 'green', 'orange'],
		shapes: ['circle', 'square', 'triangle', 'star'],
		fullPrompt: true,
		tight: null
	},
	{
		level: 6,
		colors: ['red', 'blue', 'yellow', 'green', 'orange', 'purple'],
		shapes: ['circle', 'square', 'triangle', 'star'],
		fullPrompt: true,
		tight: null
	},
	{
		level: 7,
		colors: ['red', 'blue', 'yellow', 'green', 'orange'],
		shapes: ['circle', 'square'],
		fullPrompt: true,
		tight: 'shape'
	},
	{
		level: 8,
		colors: ['red', 'blue', 'yellow', 'green'],
		shapes: ['circle', 'square', 'triangle'],
		fullPrompt: true,
		tight: 'color'
	},
	{
		level: 9,
		colors: ['red', 'blue', 'yellow', 'green', 'orange', 'purple'],
		shapes: ['circle', 'square', 'triangle', 'star', 'heart'],
		fullPrompt: true,
		tight: null
	},
	{
		level: 10,
		colors: ['red', 'blue', 'yellow', 'green', 'orange', 'purple'],
		shapes: ['circle', 'square', 'triangle', 'star', 'heart'],
		fullPrompt: true,
		tight: 'mixed'
	}
];

export function getShapeLevel(level: number): ShapeLevelConfig | undefined {
	return SHAPE_LEVELS.find((entry) => entry.level === level);
}

export type WordLocale = 'it' | 'ro' | 'en' | 'de';

/** Message lookup, so the composer stays testable without Paraglide. */
export type Lookup = (key: string) => string;

// Adjective agreement for "the red circle" style phrases.
const SHAPE_GENDER: Record<'it' | 'ro', Record<ShapeId, 'm' | 'f' | 'mn'>> = {
	it: { circle: 'm', square: 'm', triangle: 'm', star: 'f', heart: 'm' },
	ro: { circle: 'mn', square: 'mn', triangle: 'mn', star: 'f', heart: 'f' }
};

const DE_ARTICLE: Record<ShapeId, { art: string; ending: string }> = {
	circle: { art: 'den', ending: 'en' },
	square: { art: 'das', ending: 'e' },
	triangle: { art: 'das', ending: 'e' },
	star: { art: 'den', ending: 'en' },
	heart: { art: 'das', ending: 'e' }
};

// orange and lila never decline in German.
const DE_PLAIN: Record<ColorId, boolean> = {
	red: false,
	blue: false,
	yellow: false,
	green: false,
	orange: true,
	purple: true
};

function colorWord(t: Lookup, locale: WordLocale, color: ColorId, feminine: boolean): string {
	if (feminine && (locale === 'it' || locale === 'ro')) {
		const form = t(`color_${color}_f`);
		if (form) return form;
	}
	return t(`color_${color}`);
}

/**
 * The {phrase} for the prompt templates: "red circle", "il cerchio rosso",
 * "cercul roșu", "den roten Kreis", or the color alone on early levels.
 */
export function figurePhrase(t: Lookup, locale: WordLocale, figure: Figure, full: boolean): string {
	if (!full) {
		if (locale === 'it' || locale === 'de') return t(`color_${figure.color}_solo`);
		if (locale === 'ro') return colorWord(t, locale, figure.color, true);
		return t(`color_${figure.color}`);
	}
	if (locale === 'en') {
		return `${t(`color_${figure.color}`)} ${t(`shape_${figure.shape}`)}`;
	}
	if (locale === 'it' || locale === 'ro') {
		const feminine = SHAPE_GENDER[locale][figure.shape] === 'f';
		return `${t(`shape_${figure.shape}`)} ${colorWord(t, locale, figure.color, feminine)}`;
	}
	const { art, ending } = DE_ARTICLE[figure.shape];
	const stem = t(`color_${figure.color}`);
	const adjective = DE_PLAIN[figure.color] ? stem : stem + ending;
	return `${art} ${adjective} ${t(`shape_${figure.shape}`)}`;
}

function sameFigure(a: Figure, b: Figure): boolean {
	return a.color === b.color && a.shape === b.shape;
}

function shuffled<T>(items: T[], rand: () => number): T[] {
	const copy = [...items];
	for (let i = copy.length - 1; i > 0; i--) {
		const j = Math.floor(rand() * (i + 1));
		[copy[i], copy[j]] = [copy[j], copy[i]];
	}
	return copy;
}

function allCombos(config: ShapeLevelConfig): Figure[] {
	const combos: Figure[] = [];
	for (const color of config.colors) {
		for (const shape of config.shapes) {
			combos.push({ color, shape });
		}
	}
	return combos;
}

/** Three different figures for one level, in play order. */
export function pickFigures(config: ShapeLevelConfig, rand: () => number = Math.random): Figure[] {
	return shuffled(allCombos(config), rand).slice(0, SHAPE_ROUNDS_PER_LEVEL);
}

/**
 * Three tappable figures: the right one plus two distractors.
 * Tight levels share the shape, the color, or one of each.
 */
export function makeFigureOptions(
	config: ShapeLevelConfig,
	correct: Figure,
	rand: () => number = Math.random
): Figure[] {
	const others = allCombos(config).filter((figure) => !sameFigure(figure, correct));
	const sameShape = others.filter((figure) => figure.shape === correct.shape);
	const sameColor = others.filter((figure) => figure.color === correct.color);
	const rest = others.filter(
		(figure) => figure.shape !== correct.shape && figure.color !== correct.color
	);

	let distractors: Figure[] = [];
	if (config.tight === 'shape') {
		distractors = [...shuffled(sameShape, rand), ...shuffled(rest, rand)].slice(0, 2);
	} else if (config.tight === 'color') {
		distractors = [...shuffled(sameColor, rand), ...shuffled(rest, rand)].slice(0, 2);
	} else if (config.tight === 'mixed') {
		const first = shuffled(sameShape, rand)[0];
		const second = shuffled(
			sameColor.filter((figure) => (first ? !sameFigure(figure, first) : true)),
			rand
		)[0];
		distractors = [first, second].filter((figure) => figure !== undefined);
		if (distractors.length < 2) {
			distractors = [...distractors, ...shuffled(rest, rand)].slice(0, 2);
		}
	} else {
		distractors = shuffled(others, rand).slice(0, 2);
	}
	return shuffled([correct, ...distractors], rand);
}
