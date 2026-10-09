<script lang="ts">
	import type { EmotionId } from '#lib/feelings.js';

	interface Props {
		emotion: EmotionId;
		label?: string;
	}

	let { emotion, label = '' }: Props = $props();
</script>

<svg viewBox="4 4 56 56" role="img" aria-label={label}>
	<!-- ears -->
	<ellipse cx="24" cy="13" rx="6.5" ry="12" fill="#f3e2cf" />
	<ellipse cx="40" cy="13" rx="6.5" ry="12" fill="#f3e2cf" />
	<ellipse cx="24" cy="14" rx="3" ry="7.5" fill="#f4a3a3" opacity="0.8" />
	<ellipse cx="40" cy="14" rx="3" ry="7.5" fill="#f4a3a3" opacity="0.8" />
	<!-- head -->
	<circle cx="32" cy="40" r="19" fill="#fffdf7" stroke="#ead9bd" stroke-width="2" />
	<ellipse cx="21" cy="46" rx="3.6" ry="2.4" fill="#f4a3a3" opacity="0.7" />
	<ellipse cx="43" cy="46" rx="3.6" ry="2.4" fill="#f4a3a3" opacity="0.7" />

	{#if emotion === 'happy'}
		<path
			d="M21,38 Q25,33 29,38"
			stroke="#4a2c2a"
			stroke-width="2.4"
			fill="none"
			stroke-linecap="round"
		/>
		<path
			d="M35,38 Q39,33 43,38"
			stroke="#4a2c2a"
			stroke-width="2.4"
			fill="none"
			stroke-linecap="round"
		/>
		<path d="M24,45 Q32,54 40,45 Q32,49 24,45 Z" fill="#b93a34" />
		<ellipse cx="32" cy="48" rx="3.4" ry="2" fill="#f4a3a3" />
	{:else if emotion === 'sad'}
		<circle cx="25" cy="39" r="2.6" fill="#4a2c2a" />
		<circle cx="39" cy="39" r="2.6" fill="#4a2c2a" />
		<path
			d="M20,32 L28,35 M44,32 L36,35"
			stroke="#4a2c2a"
			stroke-width="2.2"
			stroke-linecap="round"
		/>
		<path
			d="M25,50 Q32,45 39,50"
			stroke="#4a2c2a"
			stroke-width="2.4"
			fill="none"
			stroke-linecap="round"
		/>
		<path d="M19,43 q-2.5,4 0,6 q2.5,-2 0,-6" fill="#5aa9e6" />
	{:else if emotion === 'angry'}
		<circle cx="25" cy="40" r="2.6" fill="#4a2c2a" />
		<circle cx="39" cy="40" r="2.6" fill="#4a2c2a" />
		<path
			d="M19,31 L29,35 M45,31 L35,35"
			stroke="#4a2c2a"
			stroke-width="2.6"
			stroke-linecap="round"
		/>
		<path
			d="M24,51 Q32,46 40,51"
			stroke="#4a2c2a"
			stroke-width="2.6"
			fill="none"
			stroke-linecap="round"
		/>
	{:else if emotion === 'scared'}
		<circle cx="25" cy="39" r="4.4" fill="#fff" stroke="#4a2c2a" stroke-width="1.6" />
		<circle cx="39" cy="39" r="4.4" fill="#fff" stroke="#4a2c2a" stroke-width="1.6" />
		<circle cx="25" cy="40" r="1.8" fill="#4a2c2a" />
		<circle cx="39" cy="40" r="1.8" fill="#4a2c2a" />
		<path
			d="M20,30 Q24,28 28,30 M36,30 Q40,28 44,30"
			stroke="#4a2c2a"
			stroke-width="2"
			fill="none"
			stroke-linecap="round"
		/>
		<path
			d="M28,49 q2,-2 4,0 q2,2 4,0 q2,-2 4,0"
			stroke="#4a2c2a"
			stroke-width="2.2"
			fill="none"
			stroke-linecap="round"
		/>
		<path d="M49,44 q-3,4.5 0,7 q3,-2.5 0,-7" fill="#9ecfec" />
	{:else if emotion === 'surprised'}
		<circle cx="25" cy="39" r="4.4" fill="#fff" stroke="#4a2c2a" stroke-width="1.6" />
		<circle cx="39" cy="39" r="4.4" fill="#fff" stroke="#4a2c2a" stroke-width="1.6" />
		<circle cx="25" cy="40" r="1.8" fill="#4a2c2a" />
		<circle cx="39" cy="40" r="1.8" fill="#4a2c2a" />
		<path
			d="M20,30 Q24,27 29,29 M35,29 Q40,27 44,30"
			stroke="#4a2c2a"
			stroke-width="2"
			fill="none"
			stroke-linecap="round"
		/>
		<ellipse cx="32" cy="50" rx="3" ry="3.8" fill="#4a2c2a" />
	{:else if emotion === 'tired'}
		<circle cx="25" cy="40" r="2.6" fill="#4a2c2a" />
		<circle cx="39" cy="40" r="2.6" fill="#4a2c2a" />
		<path
			d="M21,36 L29,36 M35,36 L43,36"
			stroke="#4a2c2a"
			stroke-width="2"
			stroke-linecap="round"
		/>
		<path d="M27,50 L37,49" stroke="#4a2c2a" stroke-width="2.4" stroke-linecap="round" />
	{/if}
</svg>
