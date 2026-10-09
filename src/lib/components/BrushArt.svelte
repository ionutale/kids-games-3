<script lang="ts">
	import type { ToothStepId } from '#lib/brush-teeth.js';

	interface Props {
		step: ToothStepId;
		label?: string;
	}

	let { step, label = '' }: Props = $props();
</script>

<svg viewBox="0 0 64 64" role="img" aria-label={label}>
	{#if step === 'wet'}
		<rect x="30" y="8" width="6" height="16" rx="3" fill="#d7e6f2" />
		<path
			d="M31,24 Q33,32 35,24"
			stroke="#5aa9e6"
			stroke-width="3"
			fill="none"
			stroke-linecap="round"
		/>
		<rect x="28" y="34" width="8" height="20" rx="3" fill="#7ec0f0" />
		<rect x="26" y="50" width="12" height="6" rx="2" fill="#fff" />
	{:else if step === 'paste'}
		<rect
			x="18"
			y="22"
			width="28"
			height="14"
			rx="6"
			fill="#f7d154"
			transform="rotate(-28 32 29)"
		/>
		<circle cx="20" cy="40" r="5" fill="#fff7ec" stroke="#e8c24a" stroke-width="2" />
		<path
			d="M38,36 Q44,40 40,48"
			stroke="#fff"
			stroke-width="4"
			fill="none"
			stroke-linecap="round"
		/>
	{:else if step === 'top'}
		<path d="M12,36 Q32,18 52,36 L48,42 Q32,28 16,42 Z" fill="#f3e2cf" />
		<path
			d="M18,34 Q32,24 46,34"
			stroke="#fff"
			stroke-width="4"
			fill="none"
			stroke-linecap="round"
		/>
		<rect x="30" y="40" width="6" height="14" rx="2" fill="#7ec0f0" />
	{:else if step === 'bottom'}
		<path d="M12,28 Q32,46 52,28 L48,22 Q32,36 16,22 Z" fill="#f3e2cf" />
		<path
			d="M18,30 Q32,40 46,30"
			stroke="#fff"
			stroke-width="4"
			fill="none"
			stroke-linecap="round"
		/>
		<rect x="30" y="12" width="6" height="14" rx="2" fill="#7ec0f0" />
	{:else if step === 'tongue'}
		<ellipse cx="32" cy="40" rx="16" ry="12" fill="#f4a3a3" />
		<path d="M20,38 Q32,48 44,38" stroke="#e07d7d" stroke-width="2" fill="none" />
		<rect x="29" y="16" width="6" height="14" rx="2" fill="#7ec0f0" />
	{:else if step === 'rinse'}
		<path
			d="M20,18 L44,18 L40,48 Q32,54 24,48 Z"
			fill="#d7eef8"
			stroke="#5aa9e6"
			stroke-width="3"
		/>
		<ellipse cx="32" cy="36" rx="6" ry="4" fill="#7ec0f0" />
	{/if}
</svg>
