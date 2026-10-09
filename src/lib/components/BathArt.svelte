<script lang="ts">
	import type { BathStepId } from '#lib/bath.js';

	interface Props {
		step: BathStepId;
		label?: string;
	}

	let { step, label = '' }: Props = $props();
</script>

<svg viewBox="0 0 64 64" role="img" aria-label={label}>
	{#if step === 'water'}
		<path
			d="M10,28 L54,28 L48,52 Q32,58 16,52 Z"
			fill="#d7eef8"
			stroke="#5aa9e6"
			stroke-width="3"
		/>
		<path d="M32,8 Q36,16 32,22 Q28,16 32,8" fill="#5aa9e6" />
		<ellipse cx="24" cy="40" rx="3" ry="5" fill="#7ec0f0" />
		<ellipse cx="40" cy="42" rx="3" ry="5" fill="#7ec0f0" />
	{:else if step === 'undress'}
		<path d="M22,16 L32,26 L42,16 L48,22 L36,34 L36,52 L28,52 L28,34 L16,22 Z" fill="#9b7ed9" />
		<circle cx="32" cy="12" r="6" fill="#f3e2cf" />
	{:else if step === 'soap'}
		<ellipse cx="32" cy="36" rx="16" ry="12" fill="#f7d154" />
		<ellipse cx="26" cy="32" rx="4" ry="3" fill="#fff" opacity="0.7" />
		<circle cx="44" cy="28" r="4" fill="#fff" opacity="0.55" />
	{:else if step === 'hair'}
		<circle cx="32" cy="36" r="14" fill="#f3e2cf" />
		<path d="M18,30 Q32,8 46,30 Q40,18 32,16 Q24,18 18,30" fill="#4a342e" />
		<circle cx="27" cy="36" r="2" fill="#4a342e" />
		<circle cx="37" cy="36" r="2" fill="#4a342e" />
		<path
			d="M28,44 Q32,47 36,44"
			stroke="#4a342e"
			stroke-width="2"
			fill="none"
			stroke-linecap="round"
		/>
	{:else if step === 'rinse'}
		<path
			d="M12,30 L52,30 L46,52 Q32,58 18,52 Z"
			fill="#d7eef8"
			stroke="#5aa9e6"
			stroke-width="3"
		/>
		<path
			d="M28,14 Q32,22 36,14"
			stroke="#5aa9e6"
			stroke-width="3"
			fill="none"
			stroke-linecap="round"
		/>
		<path
			d="M22,18 Q26,26 30,18"
			stroke="#7ec0f0"
			stroke-width="3"
			fill="none"
			stroke-linecap="round"
		/>
		<path
			d="M34,18 Q38,26 42,18"
			stroke="#7ec0f0"
			stroke-width="3"
			fill="none"
			stroke-linecap="round"
		/>
	{:else if step === 'dry'}
		<path d="M16,16 Q32,8 48,16 L44,50 Q32,56 20,50 Z" fill="#f4a3a3" />
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
			opacity="0.75"
		/>
	{/if}
</svg>
