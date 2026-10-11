<script lang="ts">
	import type { DayNightScene } from '#lib/day-night.js';

	let { scene }: { scene: DayNightScene } = $props();

	const isDay = $derived(scene === 'sunny' || scene === 'blue-sky' || scene === 'park');
</script>

<svg class="day-night-art" viewBox="0 0 120 120" role="img" aria-hidden="true">
	{#if isDay}
		<rect width="120" height="120" rx="18" fill={scene === 'park' ? '#7ec8ff' : '#6eb6f0'} />
		{#if scene === 'sunny' || scene === 'park'}
			<circle cx="88" cy="28" r="14" fill="#f5c84c" />
			<line x1="88" y1="6" x2="88" y2="0" stroke="#f5c84c" stroke-width="3" stroke-linecap="round" />
			<line x1="88" y1="50" x2="88" y2="56" stroke="#f5c84c" stroke-width="3" stroke-linecap="round" />
			<line x1="66" y1="28" x2="60" y2="28" stroke="#f5c84c" stroke-width="3" stroke-linecap="round" />
			<line x1="110" y1="28" x2="116" y2="28" stroke="#f5c84c" stroke-width="3" stroke-linecap="round" />
			<line x1="72" y1="12" x2="68" y2="8" stroke="#f5c84c" stroke-width="3" stroke-linecap="round" />
			<line x1="104" y1="44" x2="108" y2="48" stroke="#f5c84c" stroke-width="3" stroke-linecap="round" />
		{:else}
			<circle cx="90" cy="26" r="10" fill="#ffe08a" />
			<ellipse cx="36" cy="36" rx="16" ry="8" fill="#fff" opacity="0.85" />
			<ellipse cx="48" cy="34" rx="12" ry="7" fill="#fff" opacity="0.85" />
		{/if}
		{#if scene === 'park'}
			<rect x="0" y="78" width="120" height="42" fill="#5da85f" />
			<rect x="28" y="62" width="8" height="20" fill="#8b5a3c" />
			<circle cx="32" cy="54" r="14" fill="#6fbf73" />
			<rect x="78" y="66" width="7" height="16" fill="#8b5a3c" />
			<circle cx="81" cy="58" r="11" fill="#7fd18a" />
		{:else}
			<rect x="0" y="86" width="120" height="34" fill="#5da85f" />
		{/if}
	{:else}
		<rect width="120" height="120" rx="18" fill="#1a2744" />
		{#if scene === 'moon' || scene === 'city-night'}
			<circle cx="86" cy="30" r="16" fill="#f0e8c8" />
			<circle cx="92" cy="26" r="12" fill="#1a2744" />
		{/if}
		<circle cx="24" cy="22" r="1.8" fill="#fff8e0" />
		<circle cx="40" cy="16" r="1.4" fill="#fff8e0" />
		<circle cx="58" cy="28" r="1.6" fill="#fff8e0" />
		<circle cx="32" cy="40" r="1.2" fill="#fff8e0" />
		<circle cx="70" cy="18" r="1.5" fill="#fff8e0" />
		<circle cx="50" cy="48" r="1.3" fill="#fff8e0" />
		{#if scene === 'city-night'}
			<rect x="0" y="78" width="120" height="42" fill="#121a2e" />
			<rect x="16" y="58" width="18" height="40" fill="#2a3a5c" />
			<rect x="42" y="48" width="22" height="50" fill="#324468" />
			<rect x="74" y="62" width="16" height="36" fill="#2a3a5c" />
			<rect x="20" y="64" width="4" height="4" fill="#f5c84c" />
			<rect x="28" y="72" width="4" height="4" fill="#f5c84c" />
			<rect x="48" y="56" width="4" height="4" fill="#f5c84c" />
			<rect x="56" y="68" width="4" height="4" fill="#f5c84c" />
			<rect x="78" y="70" width="4" height="4" fill="#f5c84c" />
		{:else}
			<rect x="0" y="88" width="120" height="32" fill="#152238" />
		{/if}
	{/if}
</svg>
