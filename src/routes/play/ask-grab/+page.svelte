<script lang="ts">
	import { onMount } from 'svelte';
	import { getLocale, localizeHref, locales } from '#lib/paraglide/runtime.js';
	import { m } from '#lib/paraglide/messages.js';
	import { isLevelOpen } from '#lib/count-fruit.js';
	import { MAX_ASK_GRAB_LEVEL, ASK_GRAB_LEVELS } from '#lib/ask-grab.js';
	import { loadProgress } from '#lib/progress.js';
	import BatchSceneArt from '#lib/components/BatchSceneArt.svelte';
	let cleared = $state(0);
	const locale = $derived(getLocale() as (typeof locales)[number]);
	const homeHref = $derived(localizeHref('/', { locale }));
	const levelHref = $derived((level: number) => localizeHref(`/play/ask-grab/${level}`, { locale }));
	onMount(() => { cleared = loadProgress(localStorage)['ask-grab'].cleared; });
</script>
<svelte:head><title>Lumi — {m.askgrab_name()}</title></svelte:head>
<a class="btn back-link" href={homeHref}>← Lumi</a>
<div class="card">
	<h2 style="margin: 0; font-size: 2rem;">{m.askgrab_name()}</h2>
	<p style="margin: 0.25rem 0 0; color: var(--ink-soft);">{m.chooseLevel()}</p>
	<ol class="level-path">
		{#each ASK_GRAB_LEVELS as entry (entry.level)}
			{@const open = isLevelOpen(cleared, entry.level)}
			<li>
				<a class="level-tile" class:locked={!open} href={levelHref(entry.level)}
					aria-label={open ? m.level({ n: entry.level }) : `${m.level({ n: entry.level })} — ${m.locked()}`}>
					{#if entry.level === cleared + 1 && cleared < MAX_ASK_GRAB_LEVEL}<span class="badge-new">{m.newLevel()}</span>{/if}
					{#if open}<span class="batch25-thumb" aria-hidden="true"><BatchSceneArt game="ask-grab" scene="raise-hand" /></span>
					{:else}<span class="lock" aria-hidden="true">🔒</span>{/if}
					<span>{m.level({ n: entry.level })}</span>
				</a>
			</li>
		{/each}
	</ol>
	{#if cleared >= MAX_ASK_GRAB_LEVEL}<p class="finish-banner">{m.finishGame()}</p>{/if}
</div>
