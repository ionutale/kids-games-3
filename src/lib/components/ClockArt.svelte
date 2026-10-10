<script lang="ts">
	import type { DayPart } from '#lib/what-time.js';

	interface Props {
		hour: number;
		part: DayPart;
		label?: string;
	}

	let { hour, part, label = '' }: Props = $props();

	const hourAngle = $derived(((hour % 12) / 12) * 360);
	const sky = $derived(
		part === 'morning' ? '#ffe2b0' : part === 'day' ? '#9fd7ff' : '#2c3a66'
	);
	const ground = $derived(
		part === 'morning' ? '#8fbf6a' : part === 'day' ? '#6aa84f' : '#3d4a3a'
	);
</script>

<svg viewBox="0 0 96 96" role="img" aria-label={label}>
	<rect x="0" y="0" width="96" height="96" rx="18" fill={sky} />
	<rect x="0" y="68" width="96" height="28" fill={ground} />

	{#if part === 'night'}
		<circle cx="72" cy="22" r="10" fill="#f4f1c8" />
		<circle cx="76" cy="20" r="9" fill={sky} />
		<circle cx="20" cy="18" r="1.4" fill="#fff" />
		<circle cx="32" cy="28" r="1.1" fill="#fff" />
		<circle cx="48" cy="14" r="1.2" fill="#fff" />
	{:else if part === 'morning'}
		<circle cx="74" cy="26" r="12" fill="#f2c230" />
		<path
			d="M10,58 C24,48 36,52 48,58 C60,64 72,60 86,52 L86,68 L10,68 Z"
			fill="#fff6"
		/>
	{:else}
		<circle cx="72" cy="22" r="13" fill="#f2c230" />
	{/if}

	<circle cx="40" cy="46" r="24" fill="#fffdf8" stroke="#4a2c2a" stroke-width="3" />
	{#each [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] as mark, index (mark)}
		{@const angle = (index / 12) * Math.PI * 2 - Math.PI / 2}
		{@const x = 40 + Math.cos(angle) * 18}
		{@const y = 46 + Math.sin(angle) * 18}
		<circle cx={x} cy={y} r={mark % 3 === 0 ? 1.8 : 1.1} fill="#4a2c2a" />
	{/each}
	<line
		x1="40"
		y1="46"
		x2="40"
		y2="30"
		stroke="#4a2c2a"
		stroke-width="3.2"
		stroke-linecap="round"
		transform={`rotate(${hourAngle} 40 46)`}
	/>
	<line
		x1="40"
		y1="46"
		x2="40"
		y2="26"
		stroke="#e4574f"
		stroke-width="2.2"
		stroke-linecap="round"
	/>
	<circle cx="40" cy="46" r="3" fill="#4a2c2a" />
</svg>
