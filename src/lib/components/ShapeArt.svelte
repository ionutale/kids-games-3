<script lang="ts">
	import type { ColorId, ShapeId } from '#lib/color-shapes.js';

	interface Props {
		shape: ShapeId;
		color: ColorId;
		happy?: boolean;
		label?: string;
	}

	let { shape, color, happy = false, label = '' }: Props = $props();

	const FILL: Record<ColorId, string> = {
		red: '#e4574f',
		blue: '#5aa9e6',
		yellow: '#f2c230',
		green: '#5da85f',
		orange: '#ef8c3b',
		purple: '#9b7ed9'
	};

	const fill = $derived(FILL[color]);
	const mouth = $derived(happy ? 'M25,40 Q32,47 39,40' : 'M27,41 L37,41');
</script>

{#snippet face(cx: number, cy: number)}
	<g aria-hidden="true">
		<circle cx={cx - 7} {cy} r="3" fill="#4a2c2a" />
		<circle cx={cx + 7} {cy} r="3" fill="#4a2c2a" />
		<path
			d={mouth}
			transform={`translate(${cx - 32},${cy - 30})`}
			stroke="#4a2c2a"
			stroke-width="2.4"
			stroke-linecap="round"
			fill="none"
		/>
		{#if happy}
			<ellipse cx={cx - 11} cy={cy + 6} rx="3.4" ry="2.2" fill="#fff" opacity="0.55" />
			<ellipse cx={cx + 11} cy={cy + 6} rx="3.4" ry="2.2" fill="#fff" opacity="0.55" />
		{/if}
	</g>
{/snippet}

<svg viewBox="0 0 64 64" role="img" aria-label={label}>
	{#if shape === 'circle'}
		<circle cx="32" cy="36" r="18" {fill} />
		<ellipse cx="25" cy="29" rx="5" ry="7" fill="#fff" opacity="0.25" />
		{@render face(32, 35)}
	{:else if shape === 'square'}
		<rect x="14" y="18" width="36" height="36" rx="9" {fill} />
		<ellipse cx="25" cy="29" rx="4" ry="6" fill="#fff" opacity="0.25" />
		{@render face(32, 36)}
	{:else if shape === 'triangle'}
		<path
			d="M32,12 L54,50 L10,50 Z"
			{fill}
			stroke-linejoin="round"
			stroke={fill}
			stroke-width="6"
		/>
		{@render face(32, 39)}
	{:else if shape === 'star'}
		<path
			d="M32,8 L38.5,25 L56,25.5 L42,36 L47,53 L32,43 L17,53 L22,36 L8,25.5 L25.5,25 Z"
			{fill}
			stroke-linejoin="round"
		/>
		{@render face(32, 34)}
	{:else if shape === 'heart'}
		<path
			d="M32,54 C18,44 10,36 10,27 C10,19 16,14 22,14 C27,14 31,17 32,21 C33,17 37,14 42,14 C48,14 54,19 54,27 C54,36 46,44 32,54 Z"
			{fill}
		/>
		{@render face(32, 33)}
	{/if}
</svg>
