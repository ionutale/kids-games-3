<script lang="ts">
	import type { WeatherId } from '#lib/weather.js';

	interface Props {
		weather: WeatherId;
		label?: string;
	}

	let { weather, label = '' }: Props = $props();

	const sky = $derived(
		weather === 'sunny'
			? '#7ec8ff'
			: weather === 'cloudy'
				? '#b8c8d8'
				: weather === 'rainy'
					? '#8aa0b8'
					: '#c8d8e8'
	);
	const ground = $derived(
		weather === 'sunny'
			? '#5da85f'
			: weather === 'cloudy'
				? '#6aa06a'
				: weather === 'rainy'
					? '#4a7a55'
					: '#e8f0f6'
	);
</script>

<svg viewBox="0 0 96 96" role="img" aria-label={label}>
	<rect x="0" y="0" width="96" height="96" rx="18" fill={sky} />
	<rect x="0" y="64" width="96" height="32" fill={ground} />

	{#if weather === 'sunny'}
		<circle cx="68" cy="26" r="12" fill="#f2c230" />
		<line x1="68" y1="8" x2="68" y2="2" stroke="#f2c230" stroke-width="3" stroke-linecap="round" />
		<line
			x1="68"
			y1="44"
			x2="68"
			y2="50"
			stroke="#f2c230"
			stroke-width="3"
			stroke-linecap="round"
		/>
		<line
			x1="50"
			y1="26"
			x2="44"
			y2="26"
			stroke="#f2c230"
			stroke-width="3"
			stroke-linecap="round"
		/>
		<line
			x1="86"
			y1="26"
			x2="92"
			y2="26"
			stroke="#f2c230"
			stroke-width="3"
			stroke-linecap="round"
		/>
		<line x1="55" y1="13" x2="51" y2="9" stroke="#f2c230" stroke-width="3" stroke-linecap="round" />
		<line
			x1="81"
			y1="39"
			x2="85"
			y2="43"
			stroke="#f2c230"
			stroke-width="3"
			stroke-linecap="round"
		/>
		<line x1="81" y1="13" x2="85" y2="9" stroke="#f2c230" stroke-width="3" stroke-linecap="round" />
		<line
			x1="55"
			y1="39"
			x2="51"
			y2="43"
			stroke="#f2c230"
			stroke-width="3"
			stroke-linecap="round"
		/>
	{:else if weather === 'cloudy'}
		<ellipse cx="38" cy="30" rx="16" ry="10" fill="#fff" />
		<ellipse cx="52" cy="28" rx="14" ry="12" fill="#f4f7fa" />
		<ellipse cx="64" cy="32" rx="12" ry="9" fill="#fff" />
	{:else if weather === 'rainy'}
		<ellipse cx="38" cy="26" rx="16" ry="10" fill="#9aabbc" />
		<ellipse cx="52" cy="24" rx="14" ry="12" fill="#8799ab" />
		<ellipse cx="64" cy="28" rx="12" ry="9" fill="#9aabbc" />
		<line
			x1="30"
			y1="42"
			x2="28"
			y2="52"
			stroke="#5a9fd4"
			stroke-width="2.2"
			stroke-linecap="round"
		/>
		<line
			x1="42"
			y1="48"
			x2="40"
			y2="58"
			stroke="#5a9fd4"
			stroke-width="2.2"
			stroke-linecap="round"
		/>
		<line
			x1="54"
			y1="44"
			x2="52"
			y2="54"
			stroke="#5a9fd4"
			stroke-width="2.2"
			stroke-linecap="round"
		/>
		<line
			x1="66"
			y1="50"
			x2="64"
			y2="60"
			stroke="#5a9fd4"
			stroke-width="2.2"
			stroke-linecap="round"
		/>
		<line
			x1="36"
			y1="56"
			x2="34"
			y2="66"
			stroke="#5a9fd4"
			stroke-width="2.2"
			stroke-linecap="round"
		/>
		<line
			x1="50"
			y1="58"
			x2="48"
			y2="68"
			stroke="#5a9fd4"
			stroke-width="2.2"
			stroke-linecap="round"
		/>
		<line
			x1="62"
			y1="54"
			x2="60"
			y2="64"
			stroke="#5a9fd4"
			stroke-width="2.2"
			stroke-linecap="round"
		/>
	{:else}
		<ellipse cx="38" cy="26" rx="16" ry="10" fill="#dce6ef" />
		<ellipse cx="52" cy="24" rx="14" ry="12" fill="#cfdceb" />
		<ellipse cx="64" cy="28" rx="12" ry="9" fill="#dce6ef" />
		<circle cx="30" cy="46" r="1.6" fill="#fff" />
		<circle cx="42" cy="52" r="1.8" fill="#fff" />
		<circle cx="54" cy="48" r="1.5" fill="#fff" />
		<circle cx="66" cy="54" r="1.7" fill="#fff" />
		<circle cx="36" cy="60" r="1.4" fill="#fff" />
		<circle cx="50" cy="62" r="1.6" fill="#fff" />
		<circle cx="62" cy="58" r="1.5" fill="#fff" />
		<circle cx="74" cy="50" r="1.4" fill="#fff" />
		<circle cx="18" cy="74" r="7" fill="#fff" />
		<circle cx="18" cy="66" r="5.5" fill="#fff" />
		<circle cx="18" cy="60" r="4" fill="#fff" />
		<circle cx="16.5" cy="59" r="0.7" fill="#4a2c2a" />
		<circle cx="19.5" cy="59" r="0.7" fill="#4a2c2a" />
	{/if}

	{#if weather !== 'snowy'}
		<rect x="72" y="52" width="5" height="16" rx="1.5" fill="#8a5a3b" />
		<ellipse cx="74.5" cy="46" rx="11" ry="10" fill="#4f9a4a" />
	{/if}
</svg>
