<script lang="ts">
	import { onMount } from 'svelte';
	import { getLocale, localizeHref, locales } from '#lib/paraglide/runtime.js';
	import { m } from '#lib/paraglide/messages.js';
	import { isLevelOpen } from '#lib/count-fruit.js';
	import { LEFT_RIGHT_LEVELS, MAX_LEFT_RIGHT_LEVEL } from '#lib/left-right.js';
	import { loadProgress } from '#lib/progress.js';
	import LeftRightArt from '#lib/components/LeftRightArt.svelte';

	let cleared = $state(0);

	const locale = $derived(getLocale() as (typeof locales)[number]);
	const homeHref = $derived(localizeHref('/', { locale }));
	const levelHref = $derived((level: number) =>
		localizeHref(`/play/left-right/${level}`, { locale })
	);

	onMount(() => {
		cleared = loadProgress(localStorage)['left-right'].cleared;
	});
</script>

<svelte:head>
	<title>Lumi — {m.lr_name()}</title>
</svelte:head>

<a class="back-link" href={homeHref}>← Lumi</a>

<div class="card">
	<h2 style="margin: 0; font-size: 2rem;">{m.lr_name()}</h2>
	<p style="margin: 0.25rem 0 0; color: var(--ink-soft);">{m.chooseLevel()}</p>

	<ol class="level-path">
		{#each LEFT_RIGHT_LEVELS as entry (entry.level)}
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
					{#if entry.level === cleared + 1 && cleared < MAX_LEFT_RIGHT_LEVEL}
						<span class="badge-new">{m.newLevel()}</span>
					{/if}
					{#if open}
						<span class="lr-thumb" aria-hidden="true">
							<LeftRightArt side="right" cue="arrow" />
						</span>
					{:else}
						<span class="lock" aria-hidden="true">🔒</span>
					{/if}
					<span>{m.level({ n: entry.level })}</span>
				</a>
			</li>
		{/each}
	</ol>

	{#if cleared >= MAX_LEFT_RIGHT_LEVEL}
		<p class="finish-banner">{m.finishGame()}</p>
	{/if}
</div>
