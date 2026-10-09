<script lang="ts">
	import { onMount } from 'svelte';
	import { getLocale, localizeHref, locales } from '#lib/paraglide/runtime.js';
	import { m } from '#lib/paraglide/messages.js';
	import { FEELINGS_LEVELS, MAX_FEELINGS_LEVEL } from '#lib/feelings.js';
	import { isLevelOpen } from '#lib/count-fruit.js';
	import { loadProgress } from '#lib/progress.js';
	import BunnyFace from '#lib/components/BunnyFace.svelte';

	let cleared = $state(0);

	const locale = $derived(getLocale() as (typeof locales)[number]);
	const homeHref = $derived(localizeHref('/', { locale }));
	const levelHref = $derived((level: number) =>
		localizeHref(`/play/feelings/${level}`, { locale })
	);

	onMount(() => {
		cleared = loadProgress(localStorage)['feelings'].cleared;
	});
</script>

<svelte:head>
	<title>Lumi — {m.feelings_name()}</title>
</svelte:head>

<a class="back-link" href={homeHref}>← Lumi</a>

<div class="card">
	<h2 style="margin: 0; font-size: 2rem;">{m.feelings_name()}</h2>
	<p style="margin: 0.25rem 0 0; color: var(--ink-soft);">{m.chooseLevel()}</p>

	<ol class="level-path">
		{#each FEELINGS_LEVELS as entry (entry.level)}
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
					{#if entry.level === cleared + 1 && cleared < MAX_FEELINGS_LEVEL}
						<span class="badge-new">{m.newLevel()}</span>
					{/if}
					{#if open}
						<BunnyFace emotion={entry.emotions[0]} />
					{:else}
						<span class="lock" aria-hidden="true">🔒</span>
					{/if}
					<span>{m.level({ n: entry.level })}</span>
				</a>
			</li>
		{/each}
	</ol>

	{#if cleared >= MAX_FEELINGS_LEVEL}
		<p class="finish-banner">{m.finishGame()}</p>
	{/if}
</div>
