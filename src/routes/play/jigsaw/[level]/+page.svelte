<script lang="ts">
	import { onDestroy } from 'svelte';
	import { page } from '$app/state';
	import { getLocale, localizeHref, locales } from '#lib/paraglide/runtime.js';
	import { m } from '#lib/paraglide/messages.js';
	import { hintStage, isLevelOpen } from '#lib/count-fruit.js';
	import {
		JIGSAW_CELL,
		JIGSAW_OVERFLOW,
		JIGSAW_ROUNDS,
		JIGSAW_TAB,
		MAX_JIGSAW_LEVEL,
		boardPadding,
		getJigsawLevel,
		pickRounds,
		type JigsawPiece as PieceModel,
		type JigsawRound
	} from '#lib/jigsaw.js';
	import { clearLevel, loadProgress, saveProgress } from '#lib/progress.js';
	import Confetti from '#lib/components/Confetti.svelte';
	import JigsawPiece from '#lib/components/JigsawPiece.svelte';
	import JigsawSceneArt from '#lib/components/JigsawSceneArt.svelte';
	import { playSfx } from '#lib/sound.js';

	const IDLE_MS = 20000;
	const PAUSE_MS = 700;
	/** Move this far before a press counts as a drag. */
	const DRAG_THRESHOLD = 8;

	interface DragState {
		id: string;
		pointerId: number;
		startX: number;
		startY: number;
		x: number;
		y: number;
		offsetX: number;
		offsetY: number;
		width: number;
		height: number;
		active: boolean;
	}

	let rounds = $state<JigsawRound[] | null>(null);
	let roundIndex = $state(0);
	let pips = $state<boolean[]>([false, false, false]);
	let placed = $state<Record<string, boolean>>({});
	let selected = $state<string | null>(null);
	let drag = $state<DragState | null>(null);
	let justPlaced = $state<string | null>(null);
	let boardComplete = $state(false);
	let trayAnimKey = $state(0);
	let misses = $state(0);
	let manualHints = $state(0);
	let idleHint = $state(false);
	let feedback = $state<'correct' | 'wrong' | null>(null);
	let wrongSlot = $state<string | null>(null);
	let won = $state(false);
	let decided = $state(false);
	let unlocked = $state(true);
	let syncedLevel = $state(0);
	let alive = true;

	let idleTimer: ReturnType<typeof setTimeout> | null = null;
	let pauseTimer: ReturnType<typeof setTimeout> | null = null;

	const levelNumber = $derived(Number.parseInt(page.params.level ?? '', 10));
	const config = $derived(getJigsawLevel(levelNumber));
	const current = $derived(rounds !== null ? (rounds[roundIndex] ?? null) : null);
	const stage = $derived(hintStage(misses, manualHints, idleHint));
	const pad = boardPadding();
	const allPlaced = $derived(current !== null && current.pieces.every((piece) => placed[piece.id]));
	const hintPieceId = $derived(current?.tray.find((id) => !placed[id]) ?? null);
	const dragPiece = $derived(drag ? pieceById(drag.id) : null);

	const locale = $derived(getLocale() as (typeof locales)[number]);
	const pathHref = $derived(localizeHref('/play/jigsaw', { locale }));
	const nextHref = $derived(localizeHref(`/play/jigsaw/${levelNumber + 1}`, { locale }));

	function pieceById(id: string): PieceModel | undefined {
		return current?.pieces.find((piece) => piece.id === id);
	}

	function poke(): void {
		if (idleTimer) clearTimeout(idleTimer);
		if (won) return;
		idleTimer = setTimeout(() => {
			idleHint = true;
		}, IDLE_MS);
	}

	function clearDrag(): void {
		drag = null;
	}

	function startRound(): void {
		placed = {};
		selected = null;
		clearDrag();
		justPlaced = null;
		boardComplete = false;
		trayAnimKey += 1;
		misses = 0;
		manualHints = 0;
		idleHint = false;
		feedback = null;
		wrongSlot = null;
		poke();
	}

	function startLevel(): void {
		if (!config) return;
		rounds = pickRounds(config);
		roundIndex = 0;
		pips = Array.from({ length: JIGSAW_ROUNDS }, () => false);
		won = false;
		startRound();
	}

	function syncLevel(): void {
		if (!config) return;
		if (idleTimer) clearTimeout(idleTimer);
		if (pauseTimer) clearTimeout(pauseTimer);
		alive = true;
		rounds = null;
		roundIndex = 0;
		pips = [false, false, false];
		placed = {};
		selected = null;
		clearDrag();
		misses = 0;
		manualHints = 0;
		idleHint = false;
		feedback = null;
		wrongSlot = null;
		won = false;
		const cleared = loadProgress(localStorage).jigsaw.cleared;
		unlocked = isLevelOpen(cleared, levelNumber);
		decided = true;
		if (unlocked) startLevel();
	}

	$effect(() => {
		if (config && syncedLevel !== levelNumber) {
			syncedLevel = levelNumber;
			syncLevel();
		}
	});

	function askForHelp(): void {
		if (won || rounds === null || allPlaced) return;
		manualHints += 1;
		poke();
	}

	function selectPiece(id: string): void {
		if (won || feedback === 'correct' || placed[id] || drag?.active) return;
		poke();
		selected = selected === id ? null : id;
	}

	function tryPlace(pieceId: string, slotId: string): void {
		if (won || !current || placed[slotId] || feedback === 'correct') return;
		poke();
		if (pieceId === slotId) {
			placed = { ...placed, [slotId]: true };
			selected = null;
			justPlaced = slotId;
			feedback = 'correct';
			playSfx('place');
			wrongSlot = null;
			const done = current.pieces.every((piece) => (piece.id === slotId ? true : placed[piece.id]));
			if (done) boardComplete = true;
			if (pauseTimer) clearTimeout(pauseTimer);
			pauseTimer = setTimeout(
				() => {
					if (!alive) return;
					feedback = null;
					justPlaced = null;
					if (done) {
						pips = pips.map((pip, index) => (index === roundIndex ? true : pip));
						const snapshot = rounds;
						if (!snapshot) return;
						if (roundIndex + 1 >= snapshot.length) {
							won = true;
							playSfx('win');
							boardComplete = false;
							if (idleTimer) clearTimeout(idleTimer);
							const progress = loadProgress(localStorage);
							clearLevel(progress, 'jigsaw', levelNumber);
							saveProgress(progress, localStorage);
						} else {
							roundIndex += 1;
							startRound();
						}
					}
				},
				done ? 1100 : PAUSE_MS
			);
		} else {
			misses += 1;
			wrongSlot = slotId;
			feedback = 'wrong';
			playSfx('wrong');
			if (pauseTimer) clearTimeout(pauseTimer);
			pauseTimer = setTimeout(() => {
				if (!alive) return;
				feedback = null;
				wrongSlot = null;
			}, PAUSE_MS);
		}
	}

	function placeInSlot(slotId: string): void {
		if (!selected) return;
		tryPlace(selected, slotId);
	}

	function slotIdAtPoint(clientX: number, clientY: number): string | null {
		const stack = document.elementsFromPoint(clientX, clientY);
		for (const node of stack) {
			if (!(node instanceof HTMLElement)) continue;
			const slot = node.closest<HTMLElement>('[data-jigsaw-slot]');
			if (slot) {
				const id = slot.dataset.jigsawSlot;
				if (id && !placed[id]) return id;
			}
		}
		return null;
	}

	function onPiecePointerDown(id: string, event: PointerEvent): void {
		if (won || feedback === 'correct' || placed[id] || event.button !== 0) return;
		const target = event.currentTarget;
		if (!(target instanceof HTMLElement)) return;
		event.preventDefault();
		poke();
		const rect = target.getBoundingClientRect();
		drag = {
			id,
			pointerId: event.pointerId,
			startX: event.clientX,
			startY: event.clientY,
			x: rect.left,
			y: rect.top,
			offsetX: event.clientX - rect.left,
			offsetY: event.clientY - rect.top,
			width: rect.width,
			height: rect.height,
			active: false
		};
		try {
			target.setPointerCapture(event.pointerId);
		} catch {
			/* Some environments reject capture on synthetic events. */
		}
	}

	function onPointerMove(event: PointerEvent): void {
		if (!drag || event.pointerId !== drag.pointerId) return;
		const dx = event.clientX - drag.startX;
		const dy = event.clientY - drag.startY;
		if (!drag.active && Math.hypot(dx, dy) >= DRAG_THRESHOLD) {
			selected = drag.id;
			drag = { ...drag, active: true };
		}
		if (!drag.active) return;
		event.preventDefault();
		drag = {
			...drag,
			x: event.clientX - drag.offsetX,
			y: event.clientY - drag.offsetY
		};
	}

	function onPointerUp(event: PointerEvent): void {
		if (!drag || event.pointerId !== drag.pointerId) return;
		const wasDrag = drag.active;
		const id = drag.id;
		const x = event.clientX;
		const y = event.clientY;
		clearDrag();
		if (!wasDrag) {
			selectPiece(id);
			return;
		}
		const slotId = slotIdAtPoint(x, y);
		if (slotId) {
			tryPlace(id, slotId);
		}
	}

	function onPointerCancel(event: PointerEvent): void {
		if (!drag || event.pointerId !== drag.pointerId) return;
		clearDrag();
	}

	onDestroy(() => {
		alive = false;
		if (idleTimer) clearTimeout(idleTimer);
		if (pauseTimer) clearTimeout(pauseTimer);
	});
</script>

<svelte:window
	onpointermove={onPointerMove}
	onpointerup={onPointerUp}
	onpointercancel={onPointerCancel}
/>

<svelte:head>
	<title>Lumi — {config ? m.level({ n: levelNumber }) : m.jigsaw_name()}</title>
</svelte:head>

{#if !config}
	<a class="back-link" href={pathHref}>← {m.allLevels()}</a>
	<div class="card">
		<p>{m.invalidLevel()}</p>
	</div>
{:else if !decided}
	<a class="back-link" href={pathHref}>← {m.allLevels()}</a>
	<div class="card">
		<p class="prompt">…</p>
	</div>
{:else if !unlocked}
	<a class="back-link" href={pathHref}>← {m.allLevels()}</a>
	<div class="card win">
		<div class="win-art" aria-hidden="true"><span style="font-size: 3.5rem;">🔒</span></div>
		<h2>{m.level({ n: levelNumber })} — {m.locked()}</h2>
		<p class="cheer">{m.lockedDetail({ n: levelNumber - 1 })}</p>
		<div class="actions">
			<a class="btn" href={pathHref}>{m.allLevels()}</a>
		</div>
	</div>
{:else}
	<a class="back-link" href={pathHref}>← {m.allLevels()}</a>
	<div class="card">
		{#if !won && current}
			<div class="game-top">
				<h2 style="margin: 0; font-size: 1.8rem;">{m.level({ n: levelNumber })}</h2>
				<button class="help-btn" type="button" onclick={askForHelp}>? {m.help()}</button>
			</div>
			<p class="prompt">{m.jigsaw_prompt()}</p>
			<div class="pips" aria-hidden="true">
				{#each pips as done, index (index)}
					<span class="pip" class:full={done}></span>
				{/each}
			</div>

			<div
				class="jigsaw-board"
				class:drop-ready={drag?.active}
				class:complete={boardComplete}
				style="--jig-cols: {current.cols}; --jig-rows: {current.rows}; --jig-pad: {pad}px; --jig-overflow: {JIGSAW_OVERFLOW};"
			>
				<div class="jigsaw-board-ghost" aria-hidden="true">
					<JigsawSceneArt
						scene={current.scene}
						width={current.cols * JIGSAW_CELL}
						height={current.rows * JIGSAW_CELL}
					/>
				</div>
				{#each current.pieces as piece (piece.id)}
					<div
						class="jigsaw-slot"
						class:open={!placed[piece.id]}
						class:glow={stage >= 1 &&
							(selected === piece.id || (drag?.active && drag.id === piece.id)) &&
							!placed[piece.id]}
						class:shake={feedback === 'wrong' && wrongSlot === piece.id}
						style="grid-column: {piece.col + 1}; grid-row: {piece.row + 1};"
						data-jigsaw-slot={piece.id}
					>
						{#if placed[piece.id]}
							<JigsawPiece
								{piece}
								scene={current.scene}
								rows={current.rows}
								cols={current.cols}
								placed={true}
								snap={justPlaced === piece.id}
							/>
						{:else}
							<button
								class="jigsaw-slot-hit"
								type="button"
								aria-label={m.jigsaw_slot()}
								disabled={!selected || !!drag?.active}
								onclick={() => placeInSlot(piece.id)}
							></button>
						{/if}
					</div>
				{/each}
			</div>

			<p class="hands-pick">
				{#if drag?.active}
					{m.jigsaw_drop()}
				{:else if selected}
					{m.jigsaw_tap_slot()}
				{:else}
					{m.jigsaw_drag()}
				{/if}
			</p>

			{#key trayAnimKey}
				<div class="jigsaw-tray">
					{#each current.tray as id, trayIndex (id)}
						{@const piece = pieceById(id)}
						{#if piece && !placed[id]}
							<div
								class="jigsaw-tray-item"
								class:lifting={drag?.active && drag.id === id}
								style="width: calc(4.2rem + {JIGSAW_TAB}px); --jig-i: {trayIndex};"
							>
								<JigsawPiece
									{piece}
									scene={current.scene}
									rows={current.rows}
									cols={current.cols}
									selected={selected === id}
									dragging={drag?.active && drag.id === id}
									glow={stage === 2 && hintPieceId === id}
									onpointerdown={(event) => onPiecePointerDown(id, event)}
								/>
							</div>
						{/if}
					{/each}
				</div>
			{/key}

			{#if drag?.active && dragPiece && current}
				<div
					class="jigsaw-drag-ghost"
					style="left: {drag.x}px; top: {drag.y}px; width: {drag.width}px; height: {drag.height}px;"
					aria-hidden="true"
				>
					<JigsawPiece
						piece={dragPiece}
						scene={current.scene}
						rows={current.rows}
						cols={current.cols}
						ghost={true}
					/>
				</div>
			{/if}

			<p class="feedback" class:good={feedback === 'correct'} class:retry={feedback === 'wrong'}>
				{#if feedback === 'correct'}{m.correctTap()}{:else if feedback === 'wrong'}{m.tryAgain()}{/if}
			</p>
			{#if stage >= 1}
				<div class="hint-box">
					{#if stage === 1}
						{m.jigsaw_hint()}
					{:else}
						{m.shapes_hint_this()}
					{/if}
				</div>
			{/if}
		{:else if won}
			<Confetti />
			<div class="win">
				<div class="win-art jigsaw-win-art" aria-hidden="true">
					<span class="jigsaw-thumb">
						<span class="jigsaw-thumb-piece"></span>
						<span class="jigsaw-thumb-piece mid"></span>
					</span>
				</div>
				<h2>{m.levelComplete()}</h2>
				<p class="cheer">{m.cheer()}</p>
				{#if levelNumber >= MAX_JIGSAW_LEVEL}
					<p>{m.finishGame()}</p>
				{/if}
				<div class="actions">
					{#if levelNumber < MAX_JIGSAW_LEVEL}
						<a class="btn" href={nextHref}>{m.nextLevel()}</a>
					{/if}
					<button class="btn secondary" type="button" onclick={startLevel}>{m.replay()}</button>
					<a class="btn ghost" href={pathHref}>{m.allLevels()}</a>
				</div>
			</div>
		{/if}
	</div>
{/if}
