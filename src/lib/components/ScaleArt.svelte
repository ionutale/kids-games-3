<script lang="ts">
	import type { WeightSide } from '#lib/heavy-light.js';

	let { tip = 'none' }: { tip?: WeightSide | 'none' } = $props();

	const tilt = $derived(tip === 'left' ? -12 : tip === 'right' ? 12 : 0);
</script>

<svg class="scale-art" viewBox="0 0 220 120" role="img" aria-hidden="true">
	<path d="M70,112 L110,78 L150,112 Z" fill="#c4a878" stroke="#a08858" stroke-width="3" />
	<rect x="104" y="58" width="12" height="28" rx="2" fill="#a08858" />
	<g transform="rotate({tilt} 110 64)">
		<rect x="28" y="58" width="164" height="10" rx="4" fill="#8b6a40" />
		<line x1="48" y1="68" x2="48" y2="84" stroke="#8b6a40" stroke-width="3" />
		<path d="M26,84 L70,84 L64,100 L32,100 Z" fill="#e8d4a8" stroke="#c4a878" stroke-width="2.5" />
		<line x1="172" y1="68" x2="172" y2="84" stroke="#8b6a40" stroke-width="3" />
		<path d="M150,84 L194,84 L188,100 L156,100 Z" fill="#e8d4a8" stroke="#c4a878" stroke-width="2.5" />
	</g>
</svg>
