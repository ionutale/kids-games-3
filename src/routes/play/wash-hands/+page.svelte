<script lang="ts">
	import { onMount } from 'svelte';
	import { getLocale, localizeHref, locales } from '#lib/paraglide/runtime.js';
	import { m } from '#lib/paraglide/messages.js';
	import { MAX_WASH_LEVEL, WASH_LEVELS } from '#lib/wash-hands.js';
	import { isLevelOpen } from '#lib/count-fruit.js';
	import { loadProgress } from '#lib/progress.js';
	import HandsWash from '#lib/components/HandsWash.svelte';
	import StepArt from '#lib/components/StepArt.svelte';

	let cleared = $state(0);

	const locale = $derived(getLocale() as (typeof locales)[number]);
	const homeHref = $derived(localizeHref('/', { locale }));
	const levelHref = $derived((level: number) =>
		localizeHref(`/play/wash-hands/${level}`, { locale })
	);

	onMount(() => {
		cleared = loadProgress(localStorage)['wash-hands'].cleared;
	});
</script>

<svelte:head>
	<title>Lumi — {m.wash_name()}</title>
</svelte:head>

<a class="back-link" href={homeHref}>← Lumi</a>

<div class="card">
	<h2 style="margin: 0; font-size: 2rem;">{m.wash_name()}</h2>
	<HandsWash />
	<p class="hands-how">{m.wash_how()}</p>
	<p class="hands-pick">{m.chooseLevel()}</p>

	<ol class="level-path">
		{#each WASH_LEVELS as entry (entry.level)}
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
					{#if entry.level === cleared + 1 && cleared < MAX_WASH_LEVEL}
						<span class="badge-new">{m.newLevel()}</span>
					{/if}
					{#if open}
						<StepArt step={entry.steps[0]} />
					{:else}
						<span class="lock" aria-hidden="true">🔒</span>
					{/if}
					<span>{m.level({ n: entry.level })}</span>
				</a>
			</li>
		{/each}
	</ol>

	{#if cleared >= MAX_WASH_LEVEL}
		<p class="finish-banner">{m.finishGame()}</p>
	{/if}
</div>
