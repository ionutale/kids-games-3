<script lang="ts">
	import type { StepId } from '#lib/wash-hands.js';

	interface Props {
		step: StepId;
		label?: string;
	}

	let { step, label = '' }: Props = $props();
</script>

<svg viewBox="0 0 64 64" role="img" aria-label={label}>
	{#if step === 'wet'}
		<rect x="28" y="8" width="8" height="14" rx="3" fill="#c5d7e6" />
		<path
			d="M30,22 Q32,28 34,22"
			stroke="#5aa9e6"
			stroke-width="3"
			fill="none"
			stroke-linecap="round"
		/>
		<ellipse cx="26" cy="40" rx="4" ry="7" fill="#5aa9e6" />
		<ellipse cx="32" cy="46" rx="4" ry="8" fill="#7ec0f0" />
		<ellipse cx="38" cy="40" rx="4" ry="7" fill="#5aa9e6" />
	{:else if step === 'soap'}
		<rect x="24" y="16" width="16" height="28" rx="6" fill="#f7d154" />
		<rect x="27" y="10" width="10" height="8" rx="3" fill="#e8c24a" />
		<circle cx="32" cy="32" r="4" fill="#fff7ec" opacity="0.8" />
		<circle cx="40" cy="46" r="3" fill="#fff" opacity="0.7" />
		<circle cx="22" cy="40" r="2.4" fill="#fff" opacity="0.7" />
	{:else if step === 'rub'}
		<ellipse cx="24" cy="36" rx="12" ry="16" fill="#f3e2cf" transform="rotate(-18 24 36)" />
		<ellipse cx="40" cy="36" rx="12" ry="16" fill="#ffe8d2" transform="rotate(18 40 36)" />
		<ellipse
			cx="24"
			cy="34"
			rx="6"
			ry="9"
			fill="#f4a3a3"
			opacity="0.35"
			transform="rotate(-18 24 34)"
		/>
	{:else if step === 'fingers'}
		<rect x="14" y="28" width="8" height="22" rx="4" fill="#f3e2cf" />
		<rect x="24" y="22" width="8" height="28" rx="4" fill="#ffe8d2" />
		<rect x="34" y="22" width="8" height="28" rx="4" fill="#f3e2cf" />
		<rect x="44" y="28" width="8" height="22" rx="4" fill="#ffe8d2" />
	{:else if step === 'rinse'}
		<path d="M32,8 Q36,16 32,20 Q28,16 32,8" fill="#5aa9e6" />
		<ellipse cx="22" cy="42" rx="10" ry="14" fill="#f3e2cf" transform="rotate(-12 22 42)" />
		<ellipse cx="42" cy="42" rx="10" ry="14" fill="#ffe8d2" transform="rotate(12 42 42)" />
		<path
			d="M30,24 Q32,34 34,24"
			stroke="#7ec0f0"
			stroke-width="3"
			fill="none"
			stroke-linecap="round"
		/>
	{:else if step === 'dry'}
		<path d="M16,18 Q32,10 48,18 L44,50 Q32,56 20,50 Z" fill="#f4a3a3" />
		<path
			d="M22,24 Q32,20 42,24"
			stroke="#fff"
			stroke-width="3"
			fill="none"
			stroke-linecap="round"
		/>
		<path
			d="M20,34 Q32,30 44,34"
			stroke="#fff"
			stroke-width="3"
			fill="none"
			stroke-linecap="round"
			opacity="0.7"
		/>
	{/if}
</svg>
