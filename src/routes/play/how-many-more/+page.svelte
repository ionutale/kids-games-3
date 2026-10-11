<script lang="ts">
	import { onMount } from 'svelte';
	import { getLocale, localizeHref, locales } from '#lib/paraglide/runtime.js';
	import { m } from '#lib/paraglide/messages.js';
	import { isLevelOpen } from '#lib/count-fruit.js';
	import { MAX_HOW_MANY_MORE_LEVEL, HOW_MANY_MORE_LEVELS } from '#lib/how-many-more.js';
	import { loadProgress } from '#lib/progress.js';
	let cleared = $state(0);
	const locale = $derived(getLocale() as (typeof locales)[number]);
	const homeHref = $derived(localizeHref('/', { locale }));
	const levelHref = $derived((level: number) => localizeHref(`/play/how-many-more/${level}`, { locale }));
	onMount(() => { cleared = loadProgress(localStorage)['how-many-more'].cleared; });
</script>
<svelte:head><title>Lumi — {m.howmore_name()}</title></svelte:head>
<a class="btn back-link" href={homeHref}>← Lumi</a>
<div class="card">
	<h2 style="margin: 0; font-size: 2rem;">{m.howmore_name()}</h2>
	<p style="margin: 0.25rem 0 0; color: var(--ink-soft);">{m.chooseLevel()}</p>
	<ol class="level-path">
		{#each HOW_MANY_MORE_LEVELS as entry (entry.level)}
			{@const open = isLevelOpen(cleared, entry.level)}
			<li><a class="level-tile" class:locked={!open} href={levelHref(entry.level)}
				aria-label={open ? m.level({ n: entry.level }) : `${m.level({ n: entry.level })} — ${m.locked()}`}>
				{#if entry.level === cleared + 1 && cleared < MAX_HOW_MANY_MORE_LEVEL}<span class="badge-new">{m.newLevel()}</span>{/if}
				{#if open}<span class="batch25-thumb num" aria-hidden="true">×</span>{:else}<span class="lock">🔒</span>{/if}
				<span>{m.level({ n: entry.level })}</span>
			</a></li>
		{/each}
	</ol>
</div>
