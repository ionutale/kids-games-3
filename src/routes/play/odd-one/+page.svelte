<script lang="ts">
	import { onMount } from 'svelte';
	import { getLocale, localizeHref, locales } from '#lib/paraglide/runtime.js';
	import { m } from '#lib/paraglide/messages.js';
	import type { ColorId, ShapeId } from '#lib/color-shapes.js';
	import type { FruitId } from '#lib/count-fruit.js';
	import { isLevelOpen } from '#lib/count-fruit.js';
	import type { EmotionId } from '#lib/feelings.js';
	import { MAX_ODD_LEVEL, ODD_LEVELS } from '#lib/odd-one.js';
	import { loadProgress } from '#lib/progress.js';
	import BunnyFace from '#lib/components/BunnyFace.svelte';
	import FruitArt from '#lib/components/FruitArt.svelte';
	import ShapeArt from '#lib/components/ShapeArt.svelte';

	let cleared = $state(0);

	const locale = $derived(getLocale() as (typeof locales)[number]);
	const homeHref = $derived(localizeHref('/', { locale }));
	const levelHref = $derived((level: number) => localizeHref(`/play/odd-one/${level}`, { locale }));

	onMount(() => {
		cleared = loadProgress(localStorage)['odd-one'].cleared;
	});
</script>

<svelte:head>
	<title>Lumi — {m.odd_name()}</title>
</svelte:head>

<a class="back-link" href={homeHref}>← Lumi</a>

<div class="card">
	<h2 style="margin: 0; font-size: 2rem;">{m.odd_name()}</h2>
	<p style="margin: 0.25rem 0 0; color: var(--ink-soft);">{m.chooseLevel()}</p>

	<ol class="level-path">
		{#each ODD_LEVELS as entry (entry.level)}
			{@const open = isLevelOpen(cleared, entry.level)}
			<li>
				<a
					class="level-tile"
					class:locked={!open}
					href={levelHref(entry.level)}
					aria-label={open
						? m.level({ n: entry.level })
						: `${m.level({ n: entry.level })} — ${m.locked()}`}
				>
					{#if entry.level === cleared + 1 && cleared < MAX_ODD_LEVEL}
						<span class="badge-new">{m.newLevel()}</span>
					{/if}
					{#if open}
						{#if entry.kind === 'fruit'}
							<FruitArt fruit={entry.pool[0] as FruitId} />
						{:else if entry.kind === 'color'}
							<ShapeArt shape="circle" color={entry.pool[0] as ColorId} />
						{:else if entry.kind === 'shape'}
							<ShapeArt shape={entry.pool[0] as ShapeId} color={entry.color} />
						{:else}
							<BunnyFace emotion={entry.pool[0] as EmotionId} />
						{/if}
					{:else}
						<span class="lock" aria-hidden="true">🔒</span>
					{/if}
					<span>{m.level({ n: entry.level })}</span>
				</a>
			</li>
		{/each}
	</ol>

	{#if cleared >= MAX_ODD_LEVEL}
		<p class="finish-banner">{m.finishGame()}</p>
	{/if}
</div>
