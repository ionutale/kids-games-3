<script lang="ts">
	import type { CueKind, SideId } from '#lib/left-right.js';

	interface Props {
		side: SideId;
		cue: CueKind;
		subtle?: boolean;
		label?: string;
	}

	let { side, cue, subtle = false, label = '' }: Props = $props();

	const arrowPath = $derived(
		side === 'left'
			? 'M62,48 L38,48 M48,34 L34,48 L48,62'
			: 'M34,48 L58,48 M48,34 L62,48 L48,62'
	);
</script>

<svg viewBox="0 0 96 96" role="img" aria-label={label} class:subtle>
	<rect x="0" y="0" width="96" height="96" rx="18" fill="#e8f4ff" />
	<rect x="8" y="8" width="80" height="80" rx="14" fill="#fff7ec" stroke="#e8d4b8" stroke-width="2" />

	{#if cue === 'arrow'}
		<path
			d={arrowPath}
			fill="none"
			stroke="#3d8fd1"
			stroke-width={subtle ? 5 : 8}
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
	{:else}
		<!-- empty half + fruit on the named side -->
		<rect
			x={side === 'left' ? 14 : 50}
			y="28"
			width="32"
			height="40"
			rx="10"
			fill={subtle ? '#d6ebf8' : '#b8dff5'}
		/>
		{#if side === 'left'}
			<circle cx={subtle ? 30 : 30} cy="48" r={subtle ? 9 : 12} fill="#e85d4c" />
			<ellipse cx={subtle ? 30 : 30} cy={subtle ? 38 : 35} rx="4" ry="3" fill="#5da85f" />
		{:else}
			<circle cx={subtle ? 66 : 66} cy="48" r={subtle ? 9 : 12} fill="#e85d4c" />
			<ellipse cx={subtle ? 66 : 66} cy={subtle ? 38 : 35} rx="4" ry="3" fill="#5da85f" />
		{/if}
	{/if}
</svg>

<style>
	.subtle {
		opacity: 0.92;
	}
</style>
