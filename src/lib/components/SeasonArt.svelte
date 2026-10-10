<script lang="ts">
	import type { SeasonId } from '#lib/seasons.js';

	interface Props {
		season: SeasonId;
		label?: string;
	}

	let { season, label = '' }: Props = $props();

	const sky = $derived(
		season === 'spring'
			? '#b8e0ff'
			: season === 'summer'
				? '#7ec8ff'
				: season === 'autumn'
					? '#f0c27a'
					: '#d8e6f2'
	);
	const ground = $derived(
		season === 'spring'
			? '#7cbc5a'
			: season === 'summer'
				? '#5da85f'
				: season === 'autumn'
					? '#c48a3a'
					: '#eef5fb'
	);
	const leaves = $derived(
		season === 'spring'
			? '#8fd18a'
			: season === 'summer'
				? '#4f9a4a'
				: season === 'autumn'
					? '#e07a2f'
					: '#d9e3ec'
	);
</script>

<svg viewBox="0 0 96 96" role="img" aria-label={label}>
	<rect x="0" y="0" width="96" height="96" rx="18" fill={sky} />
	<rect x="0" y="64" width="96" height="32" fill={ground} />

	{#if season === 'winter'}
		<circle cx="72" cy="22" r="11" fill="#fff" opacity="0.9" />
		<circle cx="18" cy="72" r="7" fill="#fff" />
		<circle cx="18" cy="64" r="5.5" fill="#fff" />
		<circle cx="18" cy="58" r="4" fill="#fff" />
		<circle cx="16.5" cy="57" r="0.7" fill="#4a2c2a" />
		<circle cx="19.5" cy="57" r="0.7" fill="#4a2c2a" />
		<path d="M16,59.5 L20,59.5" stroke="#ef8c3b" stroke-width="1.2" stroke-linecap="round" />
	{:else if season === 'summer'}
		<circle cx="74" cy="20" r="12" fill="#f2c230" />
	{:else if season === 'spring'}
		<circle cx="74" cy="20" r="10" fill="#f2c230" />
		<circle cx="16" cy="72" r="3" fill="#f4a3c0" />
		<circle cx="28" cy="76" r="2.5" fill="#ef8c3b" />
		<circle cx="40" cy="72" r="3" fill="#9b7ed9" />
	{:else}
		<circle cx="74" cy="22" r="9" fill="#f0a04b" />
		<path d="M12,58 Q20,50 28,58" stroke="#c45c26" stroke-width="2" fill="none" />
		<path d="M34,56 Q42,48 50,56" stroke="#e07a2f" stroke-width="2" fill="none" />
	{/if}

	<!-- tree -->
	<rect x="44" y="48" width="6" height="22" rx="2" fill="#8a5a3b" />
	{#if season === 'winter'}
		<path
			d="M47,50 L36,38 L42,38 L33,28 L41,28 L47,18 L53,28 L61,28 L52,38 L58,38 Z"
			fill="#9aa7b5"
		/>
	{:else}
		<ellipse cx="47" cy="40" rx="18" ry="16" fill={leaves} />
		{#if season === 'spring'}
			<circle cx="36" cy="36" r="3" fill="#f4a3c0" />
			<circle cx="52" cy="32" r="2.8" fill="#ffd0e0" />
			<circle cx="44" cy="44" r="2.5" fill="#f4a3c0" />
		{:else if season === 'autumn'}
			<circle cx="34" cy="50" r="2.2" fill="#e07a2f" />
			<circle cx="58" cy="52" r="2" fill="#c45c26" />
			<circle cx="48" cy="56" r="1.8" fill="#f0a04b" />
		{/if}
	{/if}
</svg>
