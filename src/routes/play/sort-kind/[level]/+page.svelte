<script lang="ts">
	import { onDestroy } from 'svelte';
	import { page } from '$app/state';
	import { getLocale, localizeHref, locales } from '#lib/paraglide/runtime.js';
	import { m } from '#lib/paraglide/messages.js';
	import { hintStage, isLevelOpen } from '#lib/count-fruit.js';
	import {
		MAX_KIND_LEVEL,
		KIND_ROUNDS,
		getKindLevel,
		pickRounds,
		type KindFaceId,
		type KindId,
		type KindItem,
		type KindRound
	} from '#lib/sort-kind.js';
	import { clearLevel, loadProgress, saveProgress } from '#lib/progress.js';
	import Confetti from '#lib/components/Confetti.svelte';
	import KindArt from '#lib/components/KindArt.svelte';
	import { playSfx } from '#lib/sound.js';

	const IDLE_MS = 20000;
	const PAUSE_MS = 900;

	let rounds = $state<KindRound[] | null>(null);
	let roundIndex = $state(0);
	let pips = $state<boolean[]>([false, false, false]);
	let placed = $state<Record<string, boolean>>({});
	let selectedId = $state<string | null>(null);
	let misses = $state(0);
	let manualHints = $state(0);
	let idleHint = $state(false);
	let feedback = $state<'correct' | 'wrong' | null>(null);
	let wrongBucket = $state<KindId | null>(null);
	let won = $state(false);
	let decided = $state(false);
	let unlocked = $state(true);
	let syncedLevel = $state(0);
	let alive = true;

	let idleTimer: ReturnType<typeof setTimeout> | null = null;
	let pauseTimer: ReturnType<typeof setTimeout> | null = null;

	const levelNumber = $derived(Number.parseInt(page.params.level ?? '', 10));
	const config = $derived(getKindLevel(levelNumber));
	const current = $derived(rounds !== null ? (rounds[roundIndex] ?? null) : null);
	const stage = $derived(hintStage(misses, manualHints, idleHint));
	const loose = $derived(current?.items.filter((item) => !placed[item.id]) ?? []);
	const selected = $derived(
		current?.items.find((item) => item.id === selectedId && !placed[item.id]) ?? null
	);

	const locale = $derived(getLocale() as (typeof locales)[number]);
	const pathHref = $derived(localizeHref('/play/sort-kind', { locale }));
	const nextHref = $derived(localizeHref(`/play/sort-kind/${levelNumber + 1}`, { locale }));

	function bucketLabel(kind: KindId): string {
		if (kind === 'animal') return m.kind_animal();
		if (kind === 'food') return m.kind_food();
		return m.kind_toy();
	}

	function faceLabel(face: KindFaceId): string {
		if (face === 'cat') return m.kind_face_cat();
		if (face === 'dog') return m.kind_face_dog();
		if (face === 'bird') return m.kind_face_bird();
		if (face === 'fish') return m.kind_face_fish();
		if (face === 'bunny') return m.kind_face_bunny();
		if (face === 'bear') return m.kind_face_bear();
		if (face === 'apple') return m.kind_face_apple();
		if (face === 'banana') return m.kind_face_banana();
		if (face === 'carrot') return m.kind_face_carrot();
		if (face === 'bread') return m.kind_face_bread();
		if (face === 'cookie') return m.kind_face_cookie();
		if (face === 'cheese') return m.kind_face_cheese();
		if (face === 'ball') return m.kind_face_ball();
		if (face === 'block') return m.kind_face_block();
		if (face === 'car') return m.kind_face_car();
		if (face === 'doll') return m.kind_face_doll();
		if (face === 'kite') return m.kind_face_kite();
		return m.kind_face_drum();
	}

	function poke(): void {
		if (idleTimer) clearTimeout(idleTimer);
		if (won) return;
		idleTimer = setTimeout(() => {
			idleHint = true;
		}, IDLE_MS);
	}

	function startRound(): void {
		placed = {};
		selectedId = null;
		misses = 0;
		manualHints = 0;
		idleHint = false;
		feedback = null;
		wrongBucket = null;
		poke();
	}

	function startLevel(): void {
		if (!config) return;
		rounds = pickRounds(config);
		roundIndex = 0;
		pips = Array.from({ length: KIND_ROUNDS }, () => false);
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
		selectedId = null;
		misses = 0;
		manualHints = 0;
		idleHint = false;
		feedback = null;
		wrongBucket = null;
		won = false;
		const cleared = loadProgress(localStorage)['sort-kind'].cleared;
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
		if (!selectedId && loose.length > 0) selectedId = loose[0].id;
		poke();
	}

	function selectItem(item: KindItem): void {
		if (won || feedback === 'correct' || placed[item.id]) return;
		poke();
		selectedId = item.id;
	}

	function putInBucket(bucket: KindId): void {
		if (won || rounds === null || current === null || feedback === 'correct') return;
		const target = selected ?? (loose.length === 1 ? loose[0] : null);
		if (!target) return;
		poke();
		const snapshot = rounds;
		if (target.kind === bucket) {
			const nextPlaced = { ...placed, [target.id]: true };
			feedback = 'correct';
			playSfx('correct');
			wrongBucket = null;
			placed = nextPlaced;
			selectedId = null;
			const allDone = current.items.every((entry) => nextPlaced[entry.id]);
			if (pauseTimer) clearTimeout(pauseTimer);
			pauseTimer = setTimeout(() => {
				if (!alive || !snapshot) return;
				feedback = null;
				if (allDone) {
					pips = pips.map((done, index) => (index === roundIndex ? true : done));
					if (roundIndex + 1 >= snapshot.length) {
						won = true;
						playSfx('win');
						if (idleTimer) clearTimeout(idleTimer);
						const progress = loadProgress(localStorage);
						clearLevel(progress, 'sort-kind', levelNumber);
						saveProgress(progress, localStorage);
					} else {
						roundIndex += 1;
						startRound();
					}
				}
			}, PAUSE_MS);
		} else {
			misses += 1;
			wrongBucket = bucket;
			feedback = 'wrong';
			playSfx('wrong');
			selectedId = target.id;
			if (pauseTimer) clearTimeout(pauseTimer);
			pauseTimer = setTimeout(() => {
				if (!alive) return;
				feedback = null;
				wrongBucket = null;
			}, PAUSE_MS);
		}
	}

	function inBucket(bucket: KindId): KindItem[] {
		if (!current) return [];
		return current.items.filter((item) => placed[item.id] && item.kind === bucket);
	}

	onDestroy(() => {
		alive = false;
		if (idleTimer) clearTimeout(idleTimer);
		if (pauseTimer) clearTimeout(pauseTimer);
	});
</script>

<svelte:head>
	<title>Lumi — {config ? m.level({ n: levelNumber }) : m.kind_name()}</title>
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
			<p class="prompt">{m.kind_prompt()}</p>
			<div class="pips" aria-hidden="true">
				{#each pips as done, index (index)}
					<span class="pip" class:full={done}></span>
				{/each}
			</div>
			{#if current}
				<div
					class="sort-loose"
					class:hint-pulse={stage === 1 && !!selected}
					aria-label={m.kind_prompt()}
				>
					{#each loose as item (item.id)}
						<button
							class="sort-item"
							class:selected={selectedId === item.id}
							class:glow={stage >= 1 && selectedId === item.id}
							type="button"
							aria-label={faceLabel(item.face)}
							aria-pressed={selectedId === item.id}
							disabled={feedback === 'correct'}
							onclick={() => selectItem(item)}
						>
							<KindArt
								face={item.face}
								happy={feedback === 'correct' && selected?.id === item.id}
								label={faceLabel(item.face)}
							/>
						</button>
					{/each}
				</div>
				<div class="sort-buckets">
					{#each current.buckets as bucket (bucket)}
						<button
							class="sort-bucket"
							class:glow={stage === 2 && selected?.kind === bucket}
							class:shake={feedback === 'wrong' && wrongBucket === bucket}
							type="button"
							data-kind={bucket}
							aria-label={bucketLabel(bucket)}
							disabled={feedback === 'correct'}
							onclick={() => putInBucket(bucket)}
						>
							<span class="sort-bucket-label">{bucketLabel(bucket)}</span>
							<span class="sort-bucket-tray" aria-hidden="true">
								{#each inBucket(bucket) as item (item.id)}
									<span class="sort-placed">
										<KindArt face={item.face} happy={true} />
									</span>
								{/each}
							</span>
						</button>
					{/each}
				</div>
				<p class="feedback" class:good={feedback === 'correct'} class:retry={feedback === 'wrong'}>
					{#if feedback === 'correct'}{m.correctTap()}{:else if feedback === 'wrong'}{m.tryAgain()}{/if}
				</p>
				{#if stage >= 1}
					<div class="hint-box">
						{#if stage === 1}
							{m.kind_hint()}
						{:else}
							{m.shapes_hint_this()}
						{/if}
					</div>
				{/if}
			{/if}
		{:else}
			<Confetti />
			<div class="win">
				<div class="win-art">
					<span class="kind-thumb big" aria-hidden="true">
						<KindArt face="cat" happy={true} />
					</span>
				</div>
				<h2>{m.levelComplete()}</h2>
				<p class="cheer">{m.cheer()}</p>
				{#if levelNumber >= MAX_KIND_LEVEL}
					<p>{m.finishGame()}</p>
				{/if}
				<div class="actions">
					{#if levelNumber < MAX_KIND_LEVEL}
						<a class="btn" href={nextHref}>{m.nextLevel()}</a>
					{/if}
					<button class="btn secondary" type="button" onclick={startLevel}>{m.replay()}</button>
					<a class="btn ghost" href={pathHref}>{m.allLevels()}</a>
				</div>
			</div>
		{/if}
	</div>
{/if}
