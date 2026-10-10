<script lang="ts">
	import { onDestroy } from 'svelte';
	import { page } from '$app/state';
	import { getLocale, localizeHref, locales } from '#lib/paraglide/runtime.js';
	import { m } from '#lib/paraglide/messages.js';
	import { hintStage, isLevelOpen } from '#lib/count-fruit.js';
	import {
		DAYS_ROUNDS,
		MAX_DAYS_LEVEL,
		getDaysLevel,
		pickRounds,
		type DayId,
		type DaysRound
	} from '#lib/days-week.js';
	import { clearLevel, loadProgress, saveProgress } from '#lib/progress.js';
	import Confetti from '#lib/components/Confetti.svelte';
	import { playSfx } from '#lib/sound.js';

	const IDLE_MS = 20000;
	const PAUSE_MS = 900;
	const DRAG_THRESHOLD = 8;

	interface DragState {
		id: DayId;
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

	let rounds = $state<DaysRound[] | null>(null);
	let roundIndex = $state(0);
	let pips = $state<boolean[]>([false, false, false]);
	let placed = $state<Record<string, boolean>>({});
	let selected = $state<DayId | null>(null);
	let drag = $state<DragState | null>(null);
	let misses = $state(0);
	let manualHints = $state(0);
	let idleHint = $state(false);
	let feedback = $state<'correct' | 'wrong' | null>(null);
	let wrongValue = $state<DayId | null>(null);
	let wrongSlot = $state<DayId | null>(null);
	let won = $state(false);
	let decided = $state(false);
	let unlocked = $state(true);
	let syncedLevel = $state(0);
	let alive = true;

	let idleTimer: ReturnType<typeof setTimeout> | null = null;
	let pauseTimer: ReturnType<typeof setTimeout> | null = null;

	const levelNumber = $derived(Number.parseInt(page.params.level ?? '', 10));
	const config = $derived(getDaysLevel(levelNumber));
	const current = $derived(rounds !== null ? (rounds[roundIndex] ?? null) : null);
	const stage = $derived(hintStage(misses, manualHints, idleHint));
	const isFill = $derived(current?.mode === 'fill');
	const fillRound = $derived(current?.mode === 'fill' ? current : null);
	const nextRound = $derived(current?.mode === 'next' ? current : null);

	const locale = $derived(getLocale() as (typeof locales)[number]);
	const pathHref = $derived(localizeHref('/play/days-week', { locale }));
	const nextHref = $derived(localizeHref(`/play/days-week/${levelNumber + 1}`, { locale }));

	function labelFor(day: DayId): string {
		if (day === 'mon') return m.day_mon();
		if (day === 'tue') return m.day_tue();
		if (day === 'wed') return m.day_wed();
		if (day === 'thu') return m.day_thu();
		if (day === 'fri') return m.day_fri();
		if (day === 'sat') return m.day_sat();
		return m.day_sun();
	}

	function isBlank(day: DayId): boolean {
		return !!fillRound && fillRound.blanks.includes(day);
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
		misses = 0;
		manualHints = 0;
		idleHint = false;
		feedback = null;
		wrongValue = null;
		wrongSlot = null;
		poke();
	}

	function advanceAfterCorrect(): void {
		const snapshot = rounds;
		if (!snapshot) return;
		pips = pips.map((done, index) => (index === roundIndex ? true : done));
		if (pauseTimer) clearTimeout(pauseTimer);
		pauseTimer = setTimeout(() => {
			if (!alive || !snapshot) return;
			feedback = null;
			wrongSlot = null;
			if (roundIndex + 1 >= snapshot.length) {
				won = true;
				playSfx('win');
				if (idleTimer) clearTimeout(idleTimer);
				const progress = loadProgress(localStorage);
				clearLevel(progress, 'days-week', levelNumber);
				saveProgress(progress, localStorage);
			} else {
				roundIndex += 1;
				startRound();
			}
		}, PAUSE_MS);
	}

	function startLevel(): void {
		if (!config) return;
		rounds = pickRounds(config);
		roundIndex = 0;
		pips = Array.from({ length: DAYS_ROUNDS }, () => false);
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
		won = false;
		const cleared = loadProgress(localStorage)['days-week'].cleared;
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
		if (won || rounds === null) return;
		manualHints += 1;
		poke();
	}

	function answerNext(value: DayId): void {
		if (won || !nextRound || feedback === 'correct') return;
		poke();
		if (value === nextRound.answer) {
			feedback = 'correct';
			playSfx('correct');
			wrongValue = null;
			advanceAfterCorrect();
		} else {
			misses += 1;
			wrongValue = value;
			feedback = 'wrong';
			playSfx('wrong');
			if (pauseTimer) clearTimeout(pauseTimer);
			pauseTimer = setTimeout(() => {
				if (!alive) return;
				feedback = null;
				wrongValue = null;
			}, PAUSE_MS);
		}
	}

	function tryPlace(dayId: DayId, slotId: DayId): void {
		if (won || !fillRound || placed[slotId] || feedback === 'correct') return;
		poke();
		if (dayId === slotId && isBlank(slotId)) {
			placed = { ...placed, [slotId]: true };
			selected = null;
			feedback = 'correct';
			playSfx('place');
			wrongSlot = null;
			const done = fillRound.blanks.every((day) => day === slotId || placed[day]);
			if (done) {
				advanceAfterCorrect();
			} else {
				if (pauseTimer) clearTimeout(pauseTimer);
				pauseTimer = setTimeout(() => {
					if (!alive) return;
					feedback = null;
				}, 450);
			}
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

	function selectPiece(id: DayId): void {
		if (won || feedback === 'correct' || placed[id]) return;
		poke();
		selected = selected === id ? null : id;
	}

	function placeInSlot(slotId: DayId): void {
		if (!selected) return;
		tryPlace(selected, slotId);
	}

	function slotIdAtPoint(clientX: number, clientY: number): DayId | null {
		const stack = document.elementsFromPoint(clientX, clientY);
		for (const node of stack) {
			if (!(node instanceof HTMLElement)) continue;
			const slot = node.closest<HTMLElement>('[data-days-slot]');
			if (slot) {
				const id = slot.dataset.daysSlot as DayId | undefined;
				if (id && isBlank(id) && !placed[id]) return id;
			}
		}
		return null;
	}

	function onPiecePointerDown(id: DayId, event: PointerEvent): void {
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
			/* ignore */
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
		if (slotId) tryPlace(id, slotId);
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
	<title>Lumi — {config ? m.level({ n: levelNumber }) : m.days_name()}</title>
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
		{#if !won}
			<div class="game-top">
				<h2 style="margin: 0; font-size: 1.8rem;">{m.level({ n: levelNumber })}</h2>
				<button class="help-btn" type="button" onclick={askForHelp}>? {m.help()}</button>
			</div>
			<p class="prompt">{isFill ? m.days_fill_prompt() : m.days_prompt()}</p>
			<div class="pips" aria-hidden="true">
				{#each pips as done, index (index)}
					<span class="pip" class:full={done}></span>
				{/each}
			</div>

			{#if nextRound}
				<div class="missing-row days-row" class:hint-pulse={stage === 1} aria-hidden="true">
					{#each nextRound.shown as value, index (index)}
						<span class="missing-num days-chip">{labelFor(value)}</span>
					{/each}
					<span class="missing-blank days-chip">?</span>
				</div>
				<div class="answers">
					{#each nextRound.options as option (option)}
						<button
							class="answer-btn word"
							class:glow={stage === 2 && option === nextRound.answer}
							class:shake={feedback === 'wrong' && option === wrongValue}
							type="button"
							disabled={feedback === 'correct'}
							onclick={() => answerNext(option)}
						>
							{labelFor(option)}
						</button>
					{/each}
				</div>
			{:else if fillRound}
				<div
					class="days-fill-board"
					class:drop-ready={drag?.active}
					class:hint-pulse={stage === 1}
				>
					{#each fillRound.board as day (day)}
						{#if isBlank(day)}
							<div
								class="days-slot"
								class:open={!placed[day]}
								class:glow={stage >= 1 &&
									(selected === day || (drag?.active && drag.id === day)) &&
									!placed[day]}
								class:shake={feedback === 'wrong' && wrongSlot === day}
								data-days-slot={day}
							>
								{#if placed[day]}
									<span class="days-chip filled snap">{labelFor(day)}</span>
								{:else}
									<button
										class="days-slot-hit"
										type="button"
										aria-label={m.days_slot()}
										disabled={!selected || !!drag?.active}
										onclick={() => placeInSlot(day)}
									>
										?
									</button>
								{/if}
							</div>
						{:else}
							<span class="days-chip fixed">{labelFor(day)}</span>
						{/if}
					{/each}
				</div>

				<p class="hands-pick">
					{#if drag?.active}
						{m.days_drop()}
					{:else if selected}
						{m.days_tap_slot()}
					{:else}
						{m.days_drag()}
					{/if}
				</p>

				<div class="days-tray">
					{#each fillRound.tray as day (day)}
						{#if !placed[day]}
							<button
								class="days-chip tray"
								class:selected={selected === day}
								class:lifting={drag?.active && drag.id === day}
								class:glow={stage === 2 &&
									fillRound.blanks.includes(day) &&
									!selected &&
									!drag?.active}
								type="button"
								aria-label={labelFor(day)}
								onpointerdown={(event) => onPiecePointerDown(day, event)}
							>
								{labelFor(day)}
							</button>
						{/if}
					{/each}
				</div>

				{#if drag?.active}
					<div
						class="days-drag-ghost days-chip"
						style="left: {drag.x}px; top: {drag.y}px; width: {drag.width}px; height: {drag.height}px;"
						aria-hidden="true"
					>
						{labelFor(drag.id)}
					</div>
				{/if}
			{/if}

			<p class="feedback" class:good={feedback === 'correct'} class:retry={feedback === 'wrong'}>
				{#if feedback === 'correct'}{m.correctTap()}{:else if feedback === 'wrong'}{m.tryAgain()}{/if}
			</p>
			{#if stage >= 1}
				<div class="hint-box">
					{#if stage === 1}
						{isFill ? m.days_fill_hint() : m.days_hint()}
					{:else}
						{m.shapes_hint_this()}
					{/if}
				</div>
			{/if}
		{:else}
			<Confetti />
			<div class="win">
				<div class="win-art"><span class="days-thumb big">Mo</span></div>
				<h2>{m.levelComplete()}</h2>
				<p class="cheer">{m.cheer()}</p>
				{#if levelNumber >= MAX_DAYS_LEVEL}
					<p>{m.finishGame()}</p>
				{/if}
				<div class="actions">
					{#if levelNumber < MAX_DAYS_LEVEL}
						<a class="btn" href={nextHref}>{m.nextLevel()}</a>
					{/if}
					<button class="btn secondary" type="button" onclick={startLevel}>{m.replay()}</button>
					<a class="btn ghost" href={pathHref}>{m.allLevels()}</a>
				</div>
			</div>
		{/if}
	</div>
{/if}
