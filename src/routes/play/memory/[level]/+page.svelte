<script lang="ts">
	import { onDestroy } from 'svelte';
	import { page } from '$app/state';
	import { getLocale, localizeHref, locales } from '#lib/paraglide/runtime.js';
	import { m } from '#lib/paraglide/messages.js';
	import {
		MAX_MEMORY_LEVEL,
		dealMemory,
		faceKey,
		getMemoryLevel,
		type MemoryFace
	} from '#lib/memory.js';
	import { isLevelOpen } from '#lib/count-fruit.js';
	import { clearLevel, loadProgress, saveProgress } from '#lib/progress.js';
	import FruitArt from '#lib/components/FruitArt.svelte';
	import ShapeArt from '#lib/components/ShapeArt.svelte';
	import Confetti from '#lib/components/Confetti.svelte';
	import favicon from '#lib/assets/favicon.svg';

	interface Card {
		face: MemoryFace;
		key: string;
		up: boolean;
		matched: boolean;
	}

	const FLIP_BACK_MS = 800;
	const PEEK_MS = 1400;

	let cards = $state<Card[]>([]);
	let first = $state<number | null>(null);
	let busy = $state(false);
	let misses = $state(0);
	let peek = $state(false);
	let won = $state(false);
	let decided = $state(false);
	let unlocked = $state(true);
	let syncedLevel = $state(0);
	let alive = true;

	let flipTimer: ReturnType<typeof setTimeout> | null = null;
	let peekTimer: ReturnType<typeof setTimeout> | null = null;

	const levelNumber = $derived(Number.parseInt(page.params.level ?? '', 10));
	const config = $derived(getMemoryLevel(levelNumber));
	const columns = $derived(cards.length <= 4 ? 2 : cards.length <= 6 ? 3 : 4);

	const locale = $derived(getLocale() as (typeof locales)[number]);
	const pathHref = $derived(localizeHref('/play/memory', { locale }));
	const nextHref = $derived(localizeHref(`/play/memory/${levelNumber + 1}`, { locale }));

	function startLevel(): void {
		if (!config) return;
		cards = dealMemory(config.faces).map((face) => ({
			face,
			key: faceKey(face),
			up: false,
			matched: false
		}));
		first = null;
		busy = false;
		misses = 0;
		peek = false;
		won = false;
	}

	function syncLevel(): void {
		if (!config) return;
		if (flipTimer) clearTimeout(flipTimer);
		if (peekTimer) clearTimeout(peekTimer);
		alive = true;
		const cleared = loadProgress(localStorage)['memory'].cleared;
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

	function finishIfDone(): void {
		if (cards.length > 0 && cards.every((card) => card.matched)) {
			won = true;
			const progress = loadProgress(localStorage);
			clearLevel(progress, 'memory', levelNumber);
			saveProgress(progress, localStorage);
		}
	}

	function askForHelp(): void {
		if (won || busy || cards.length === 0) return;
		peek = true;
		if (peekTimer) clearTimeout(peekTimer);
		peekTimer = setTimeout(() => {
			if (!alive) return;
			peek = false;
		}, PEEK_MS);
	}

	function flip(index: number): void {
		const card = cards[index];
		if (!card || card.matched || card.up || busy || won || peek) return;
		cards[index] = { ...card, up: true };
		if (first === null) {
			first = index;
			return;
		}
		const other = cards[first];
		if (other.key === card.key) {
			cards[first] = { ...other, matched: true };
			cards[index] = { ...cards[index], matched: true };
			first = null;
			finishIfDone();
			return;
		}
		const previous = first;
		first = null;
		busy = true;
		misses += 1;
		flipTimer = setTimeout(() => {
			if (!alive) return;
			cards[previous] = { ...cards[previous], up: false };
			cards[index] = { ...cards[index], up: false };
			busy = false;
		}, FLIP_BACK_MS);
	}

	onDestroy(() => {
		alive = false;
		if (flipTimer) clearTimeout(flipTimer);
		if (peekTimer) clearTimeout(peekTimer);
	});
</script>

<svelte:head>
	<title>Lumi — {config ? m.level({ n: levelNumber }) : m.memory_name()}</title>
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
			<p class="prompt">{m.memory_prompt()}</p>
			<div class="mem-grid" style={`--cols: ${columns}`}>
				{#each cards as card, index (index)}
					<button
						class="mem-card"
						class:show={card.up || card.matched || peek}
						class:matched={card.matched}
						type="button"
						disabled={card.matched || busy}
						onclick={() => flip(index)}
						aria-label={card.up || card.matched || peek ? card.key : m.memory_prompt()}
						data-key={card.key}
					>
						<span class="mem-face back"><img src={favicon} alt="" /></span>
						<span class="mem-face front">
							{#if card.face.kind === 'fruit'}
								<FruitArt fruit={card.face.fruit} happy={card.matched} />
							{:else}
								<ShapeArt shape={card.face.shape} color={card.face.color} happy={card.matched} />
							{/if}
						</span>
					</button>
				{/each}
			</div>
			{#if misses >= 2}
				<p class="hint-box">{m.memory_hint()}</p>
			{/if}
		{:else}
			<Confetti />
			<div class="win">
				<div class="win-art">
					<FruitArt fruit="apple" happy={true} />
				</div>
				<h2>{m.levelComplete()}</h2>
				<p class="cheer">{m.cheer()}</p>
				{#if levelNumber >= MAX_MEMORY_LEVEL}
					<p>{m.finishGame()}</p>
				{/if}
				<div class="actions">
					{#if levelNumber < MAX_MEMORY_LEVEL}
						<a class="btn" href={nextHref}>{m.nextLevel()}</a>
					{/if}
					<button class="btn secondary" type="button" onclick={startLevel}>{m.replay()}</button>
					<a class="btn ghost" href={pathHref}>{m.allLevels()}</a>
				</div>
			</div>
		{/if}
	</div>
{/if}
