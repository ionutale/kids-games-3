<script lang="ts">
	import type { PathLayout } from '#lib/follow-path.js';

	let { layout }: { layout: PathLayout } = $props();
</script>

<svg class="path-art" viewBox="0 0 160 160" role="img" aria-hidden="true">
	<rect width="160" height="160" rx="16" fill="#d8ecc8" />
	{#if layout === 'straight-right'}
		<rect x="20" y="66" width="120" height="28" rx="10" fill="#e8d4a8" stroke="#c4a878" stroke-width="3" />
		<circle cx="36" cy="80" r="9" fill="#7ec8e8" />
		<circle cx="124" cy="80" r="9" fill="#6fbf73" />
	{:else if layout === 'straight-left'}
		<rect x="20" y="66" width="120" height="28" rx="10" fill="#e8d4a8" stroke="#c4a878" stroke-width="3" />
		<circle cx="124" cy="80" r="9" fill="#7ec8e8" />
		<circle cx="36" cy="80" r="9" fill="#6fbf73" />
	{:else if layout === 'straight-down'}
		<rect x="66" y="20" width="28" height="120" rx="10" fill="#e8d4a8" stroke="#c4a878" stroke-width="3" />
		<circle cx="80" cy="36" r="9" fill="#7ec8e8" />
		<circle cx="80" cy="124" r="9" fill="#6fbf73" />
	{:else if layout === 'turn-right'}
		<!-- coming down, turn right to goal -->
		<rect x="66" y="20" width="28" height="86" rx="10" fill="#e8d4a8" stroke="#c4a878" stroke-width="3" />
		<rect x="66" y="78" width="74" height="28" rx="10" fill="#e8d4a8" stroke="#c4a878" stroke-width="3" />
		<circle cx="80" cy="34" r="9" fill="#7ec8e8" />
		<circle cx="126" cy="92" r="9" fill="#6fbf73" />
	{:else if layout === 'turn-left'}
		<!-- coming down, turn left to goal -->
		<rect x="66" y="20" width="28" height="86" rx="10" fill="#e8d4a8" stroke="#c4a878" stroke-width="3" />
		<rect x="20" y="78" width="74" height="28" rx="10" fill="#e8d4a8" stroke="#c4a878" stroke-width="3" />
		<circle cx="80" cy="34" r="9" fill="#7ec8e8" />
		<circle cx="34" cy="92" r="9" fill="#6fbf73" />
	{:else}
		<!-- T: start on stem from left; left arm blocked; go right -->
		<rect x="20" y="66" width="120" height="28" rx="10" fill="#e8d4a8" stroke="#c4a878" stroke-width="3" />
		<rect x="66" y="20" width="28" height="74" rx="10" fill="#e8d4a8" stroke="#c4a878" stroke-width="3" />
		<circle cx="36" cy="80" r="9" fill="#7ec8e8" />
		<!-- bush blocks the up exit -->
		<circle cx="80" cy="30" r="11" fill="#5aaa60" />
		<circle cx="124" cy="80" r="9" fill="#6fbf73" />
	{/if}
</svg>
