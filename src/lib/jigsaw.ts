/**
 * Pure rules for "Jigsaw puzzle". Pieces have rounded tabs and corners.
 * The child places each piece into the matching board slot.
 */

export type Tab = -1 | 0 | 1;

export type JigsawScene = 'sun' | 'tree' | 'house' | 'boat' | 'flower';

export interface PieceEdges {
	top: Tab;
	right: Tab;
	bottom: Tab;
	left: Tab;
}

export interface JigsawPiece {
	id: string;
	row: number;
	col: number;
	edges: PieceEdges;
}

export interface JigsawRound {
	rows: number;
	cols: number;
	scene: JigsawScene;
	pieces: JigsawPiece[];
	/** Scrambled order for the tray. */
	tray: string[];
}

export interface JigsawLevelConfig {
	level: number;
	rows: number;
	cols: number;
	scenes: JigsawScene[];
}

export const MAX_JIGSAW_LEVEL = 10;
export const JIGSAW_ROUNDS = 3;

/** Unit size of one piece cell (SVG user units). */
export const JIGSAW_CELL = 80;
/** How far a tab sticks out past the cell. */
export const JIGSAW_TAB = 18;
/** Rounded corner radius on outer puzzle corners. */
export const JIGSAW_CORNER = 16;
/** Slot overflow so tabs lock into neighbors (tab / cell). */
export const JIGSAW_OVERFLOW = JIGSAW_TAB / JIGSAW_CELL;

/** Each level adds pieces: 4 → 6 → 8 → 9 → 12 → 16 → 20 → 24 → 25 → 30. */
export const JIGSAW_LEVELS: JigsawLevelConfig[] = [
	{ level: 1, rows: 2, cols: 2, scenes: ['sun', 'flower'] },
	{ level: 2, rows: 2, cols: 3, scenes: ['tree', 'boat'] },
	{ level: 3, rows: 2, cols: 4, scenes: ['sun', 'house'] },
	{ level: 4, rows: 3, cols: 3, scenes: ['tree', 'flower'] },
	{ level: 5, rows: 3, cols: 4, scenes: ['boat', 'house'] },
	{ level: 6, rows: 4, cols: 4, scenes: ['sun', 'tree', 'flower'] },
	{ level: 7, rows: 4, cols: 5, scenes: ['house', 'boat'] },
	{ level: 8, rows: 4, cols: 6, scenes: ['sun', 'tree'] },
	{ level: 9, rows: 5, cols: 5, scenes: ['house', 'boat', 'flower'] },
	{ level: 10, rows: 5, cols: 6, scenes: ['sun', 'tree', 'house', 'boat', 'flower'] }
];

export function getJigsawLevel(level: number): JigsawLevelConfig | undefined {
	return JIGSAW_LEVELS.find((entry) => entry.level === level);
}

function shuffled<T>(items: T[], rand: () => number): T[] {
	const copy = [...items];
	for (let i = copy.length - 1; i > 0; i--) {
		const j = Math.floor(rand() * (i + 1));
		[copy[i], copy[j]] = [copy[j], copy[i]];
	}
	return copy;
}

function randomTab(rand: () => number): Tab {
	return rand() < 0.5 ? 1 : -1;
}

/** Build interlocking edge tabs for a rows×cols grid. */
export function buildEdges(
	rows: number,
	cols: number,
	rand: () => number = Math.random
): PieceEdges[][] {
	const grid: PieceEdges[][] = [];
	for (let r = 0; r < rows; r++) {
		grid[r] = [];
		for (let c = 0; c < cols; c++) {
			const top: Tab = r === 0 ? 0 : ((-grid[r - 1][c].bottom) as Tab);
			const left: Tab = c === 0 ? 0 : ((-grid[r][c - 1].right) as Tab);
			const right: Tab = c === cols - 1 ? 0 : randomTab(rand);
			const bottom: Tab = r === rows - 1 ? 0 : randomTab(rand);
			grid[r][c] = { top, right, bottom, left };
		}
	}
	return grid;
}

/**
 * Classic jigsaw knob: narrow neck + round bulb.
 * Travels along an edge from `from` toward `to`; `out` is the outward normal.
 * `sign` 1 = tab out, -1 = blank in, 0 = flat.
 */
function knob(
	axis: 'h' | 'v',
	from: number,
	to: number,
	fixed: number,
	out: 1 | -1,
	sign: Tab,
	span: number,
	depth: number
): string {
	if (sign === 0) return axis === 'h' ? `L ${to} ${fixed}` : `L ${fixed} ${to}`;
	const mid = (from + to) / 2;
	const half = span / 2;
	const start = mid - Math.sign(to - from || 1) * half;
	const end = mid + Math.sign(to - from || 1) * half;
	const deep = fixed + out * sign * depth;
	const neck = fixed + out * sign * depth * 0.18;
	const side = depth * 0.72;

	if (axis === 'h') {
		const yDeep = deep;
		const yNeck = neck;
		const ySide = fixed + out * sign * side;
		return [
			`L ${start} ${fixed}`,
			`C ${start + (mid - start) * 0.25} ${fixed}, ${start + (mid - start) * 0.2} ${yNeck}, ${start + (mid - start) * 0.45} ${ySide}`,
			`C ${start + (mid - start) * 0.7} ${yDeep}, ${end - (end - mid) * 0.7} ${yDeep}, ${end - (end - mid) * 0.45} ${ySide}`,
			`C ${end - (end - mid) * 0.2} ${yNeck}, ${end - (end - mid) * 0.25} ${fixed}, ${end} ${fixed}`,
			`L ${to} ${fixed}`
		].join(' ');
	}

	const xDeep = deep;
	const xNeck = neck;
	const xSide = fixed + out * sign * side;
	return [
		`L ${fixed} ${start}`,
		`C ${fixed} ${start + (mid - start) * 0.25}, ${xNeck} ${start + (mid - start) * 0.2}, ${xSide} ${start + (mid - start) * 0.45}`,
		`C ${xDeep} ${start + (mid - start) * 0.7}, ${xDeep} ${end - (end - mid) * 0.7}, ${xSide} ${end - (end - mid) * 0.45}`,
		`C ${xNeck} ${end - (end - mid) * 0.2}, ${fixed} ${end - (end - mid) * 0.25}, ${fixed} ${end}`,
		`L ${fixed} ${to}`
	].join(' ');
}

/**
 * SVG path for one piece in local cell coordinates (0..cell).
 * Round jigsaw knobs; only outer puzzle corners are heavily rounded.
 */
export function piecePath(
	edges: PieceEdges,
	cell: number = JIGSAW_CELL,
	tab: number = JIGSAW_TAB,
	corner: number = JIGSAW_CORNER
): string {
	const span = cell * 0.34;
	const depth = tab;
	const soft = 2.5;
	const tl = edges.top === 0 && edges.left === 0 ? Math.min(corner, cell * 0.28) : soft;
	const tr = edges.top === 0 && edges.right === 0 ? Math.min(corner, cell * 0.28) : soft;
	const br = edges.bottom === 0 && edges.right === 0 ? Math.min(corner, cell * 0.28) : soft;
	const bl = edges.bottom === 0 && edges.left === 0 ? Math.min(corner, cell * 0.28) : soft;

	const parts: string[] = [`M ${tl} 0`];

	// Top →
	parts.push(knob('h', tl, cell - tr, 0, -1, edges.top, span, depth));
	parts.push(`Q ${cell} 0 ${cell} ${tr}`);

	// Right ↓
	parts.push(knob('v', tr, cell - br, cell, 1, edges.right, span, depth));
	parts.push(`Q ${cell} ${cell} ${cell - br} ${cell}`);

	// Bottom ←
	parts.push(knob('h', cell - br, bl, cell, 1, edges.bottom, span, depth));
	parts.push(`Q 0 ${cell} 0 ${cell - bl}`);

	// Left ↑
	parts.push(knob('v', cell - bl, tl, 0, -1, edges.left, span, depth));
	parts.push(`Q 0 0 ${tl} 0`);
	parts.push('Z');

	return parts.join(' ');
}

/** How much padding the board needs so edge tabs are not clipped. */
export function boardPadding(tab: number = JIGSAW_TAB): number {
	return tab + 4;
}

export function pickRounds(
	config: JigsawLevelConfig,
	rand: () => number = Math.random
): JigsawRound[] {
	const scenes = shuffled(config.scenes, rand);
	return Array.from({ length: JIGSAW_ROUNDS }, (_, index) => {
		const edges = buildEdges(config.rows, config.cols, rand);
		const pieces: JigsawPiece[] = [];
		for (let r = 0; r < config.rows; r++) {
			for (let c = 0; c < config.cols; c++) {
				pieces.push({
					id: `${r}-${c}`,
					row: r,
					col: c,
					edges: edges[r][c]
				});
			}
		}
		let tray = shuffled(
			pieces.map((piece) => piece.id),
			rand
		);
		// Avoid starting already solved.
		if (tray.every((id, i) => id === pieces[i]?.id) && tray.length > 1) {
			tray = shuffled(tray, () => 0.9);
		}
		return {
			rows: config.rows,
			cols: config.cols,
			scene: scenes[index % scenes.length],
			pieces,
			tray
		};
	});
}
