<script lang="ts">
	import { onMount } from 'svelte';
	import { getLocale, localizeHref, locales } from '#lib/paraglide/runtime.js';
	import { m } from '#lib/paraglide/messages.js';
	import { isLevelOpen } from '#lib/count-fruit.js';
	import { JIGSAW_LEVELS, MAX_JIGSAW_LEVEL } from '#lib/jigsaw.js';
	import { loadProgress } from '#lib/progress.js';

	let cleared = $state(0);

	const locale = $derived(getLocale() as (typeof locales)[number]);
	const homeHref = $derived(localizeHref('/', { locale }));
	const levelHref = $derived((level: number) =>
		localizeHref(`/play/jigsaw/${level}`, { locale })
	);

	onMount(() => {
		cleared = loadProgress(localStorage).jigsaw.cleared;
	});
</script>

<svelte:head>
	<title>Lumi — {m.jigsaw_name()}</title>
</svelte:head>

<a class="back-link" href={homeHref}>← Lumi</a>

<div class="card">
	<h2 style="margin: 0; font-size: 2rem;">{m.jigsaw_name()}</h2>
	<p style="margin: 0.25rem 0 0; color: var(--ink-soft);">{m.chooseLevel()}</p>

	<ol class="level-path">
		{#each JIGSAW_LEVELS as entry (entry.level)}
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
					{#if entry.level === cleared + 1 && cleared < MAX_JIGSAW_LEVEL}
						<span class="badge-new">{m.newLevel()}</span>
					{/if}
					{#if open}
						<span class="jigsaw-thumb" aria-hidden="true">
							<span class="jigsaw-thumb-piece"></span>
							<span class="jigsaw-thumb-piece mid"></span>
						</span>
					{:else}
						<span class="lock" aria-hidden="true">🔒</span>
					{/if}
					<span>{m.level({ n: entry.level })}</span>
				</a>
			</li>
		{/each}
	</ol>

	{#if cleared >= MAX_JIGSAW_LEVEL}
		<p class="finish-banner">{m.finishGame()}</p>
	{/if}
</div>
