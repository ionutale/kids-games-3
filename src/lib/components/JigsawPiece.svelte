<script lang="ts">
	import {
		JIGSAW_CELL,
		JIGSAW_CORNER,
		JIGSAW_TAB,
		piecePath,
		type JigsawPiece as Piece,
		type JigsawScene
	} from '#lib/jigsaw.js';
	import JigsawSceneArt from './JigsawSceneArt.svelte';

	interface Props {
		piece: Piece;
		scene: JigsawScene;
		rows: number;
		cols: number;
		selected?: boolean;
		placed?: boolean;
		glow?: boolean;
		shake?: boolean;
		dragging?: boolean;
		ghost?: boolean;
		snap?: boolean;
		onclick?: () => void;
		onpointerdown?: (event: PointerEvent) => void;
	}

	let {
		piece,
		scene,
		rows,
		cols,
		selected = false,
		placed = false,
		glow = false,
		shake = false,
		dragging = false,
		ghost = false,
		snap = false,
		onclick,
		onpointerdown
	}: Props = $props();

	const cell = JIGSAW_CELL;
	const tab = JIGSAW_TAB;
	const path = $derived(piecePath(piece.edges, cell, tab, JIGSAW_CORNER));
	const boardW = $derived(cols * cell);
	const boardH = $derived(rows * cell);
	const viewX = $derived(-tab);
	const viewY = $derived(-tab);
	const viewW = $derived(cell + tab * 2);
	const viewH = $derived(cell + tab * 2);
	const clipId = $derived(`jig-clip-${piece.id}-${placed ? 'p' : ghost ? 'g' : 't'}`);
</script>

<button
	class="jigsaw-piece"
	class:selected
	class:placed
	class:glow
	class:shake
	class:dragging
	class:ghost
	class:snap
	type="button"
	aria-label={piece.id}
	aria-grabbed={dragging || ghost ? 'true' : 'false'}
	{onclick}
	{onpointerdown}
>
	<svg viewBox="{viewX} {viewY} {viewW} {viewH}" width="100%" height="100%">
		<defs>
			<clipPath id={clipId}>
				<path d={path} />
			</clipPath>
		</defs>
		<g clip-path="url(#{clipId})">
			<g transform="translate({-piece.col * cell}, {-piece.row * cell})">
				<JigsawSceneArt {scene} width={boardW} height={boardH} />
			</g>
		</g>
		<path
			d={path}
			fill="none"
			stroke="#5a3d1a"
			stroke-width={placed ? 1.4 : 2.2}
			stroke-linejoin="round"
		/>
	</svg>
</button>
