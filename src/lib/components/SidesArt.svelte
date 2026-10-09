<script lang="ts">
	import type { SideShape } from '#lib/sides.js';

	interface Props {
		shape: SideShape;
		happy?: boolean;
		label?: string;
	}

	let { shape, happy = false, label = '' }: Props = $props();

	const mouth = $derived(happy ? 'M25,40 Q32,47 39,40' : 'M27,41 L37,41');

	function points(sides: number, cx: number, cy: number, radius: number): string {
		const start = sides === 6 ? -Math.PI / 2 + Math.PI / 6 : -Math.PI / 2;
		return Array.from({ length: sides }, (_, index) => {
			const angle = start + (index * 2 * Math.PI) / sides;
			const x = cx + radius * Math.cos(angle);
			const y = cy + radius * Math.sin(angle);
			return `${x.toFixed(1)},${y.toFixed(1)}`;
		}).join(' ');
	}
</script>

<svg viewBox="0 0 64 64" role="img" aria-label={label}>
	{#if shape === 'square'}
		<rect x="14" y="14" width="36" height="36" rx="2" fill="#5aa9e6" />
	{:else if shape === 'triangle'}
		<polygon points={points(3, 32, 34, 22)} fill="#e4574f" />
	{:else if shape === 'pentagon'}
		<polygon points={points(5, 32, 33, 22)} fill="#f5a623" />
	{:else}
		<polygon points={points(6, 32, 32, 22)} fill="#5da85f" />
	{/if}
	<g aria-hidden="true">
		<circle cx="25" cy="34" r="2.4" fill="#4a2c2a" />
		<circle cx="39" cy="34" r="2.4" fill="#4a2c2a" />
		<path d={mouth} stroke="#4a2c2a" stroke-width="2.2" stroke-linecap="round" fill="none" />
	</g>
</svg>
