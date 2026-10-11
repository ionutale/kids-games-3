<script lang="ts">
	import { onMount } from 'svelte';
	import { getLocale, localizeHref, locales } from '#lib/paraglide/runtime.js';
	import { m } from '#lib/paraglide/messages.js';
	import { isLevelOpen } from '#lib/count-fruit.js';
	import { MAX_DAY_JOBS_LEVEL, DAY_JOBS_LEVELS } from '#lib/day-jobs.js';
	import { loadProgress } from '#lib/progress.js';
	import DayJobsArt from '#lib/components/DayJobsArt.svelte';

	let cleared = $state(0);

	const locale = $derived(getLocale() as (typeof locales)[number]);
	const homeHref = $derived(localizeHref('/', { locale }));
	const levelHref = $derived((level: number) =>
		localizeHref(`/play/day-jobs/${level}`, { locale })
	);

	onMount(() => {
		cleared = loadProgress(localStorage)['day-jobs'].cleared;
	});
</script>

<svelte:head>
	<title>Lumi — {m.dayjobs_name()}</title>
</svelte:head>

<a class="btn back-link" href={homeHref}>← Lumi</a>

<div class="card">
	<h2 style="margin: 0; font-size: 2rem;">{m.dayjobs_name()}</h2>
	<p style="margin: 0.25rem 0 0; color: var(--ink-soft);">{m.chooseLevel()}</p>

	<ol class="level-path">
		{#each DAY_JOBS_LEVELS as entry (entry.level)}
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
					{#if entry.level === cleared + 1 && cleared < MAX_DAY_JOBS_LEVEL}
						<span class="badge-new">{m.newLevel()}</span>
					{/if}
					{#if open}
						<span class="dayjobs-thumb" aria-hidden="true"><DayJobsArt scene="bandage" /></span>
					{:else}
						<span class="lock" aria-hidden="true">🔒</span>
					{/if}
					<span>{m.level({ n: entry.level })}</span>
				</a>
			</li>
		{/each}
	</ol>

	{#if cleared >= MAX_DAY_JOBS_LEVEL}
		<p class="finish-banner">{m.finishGame()}</p>
	{/if}
</div>
