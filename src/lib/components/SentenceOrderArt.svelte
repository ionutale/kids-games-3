<script lang="ts">
	import type { StoryId } from '#lib/sentence-order.js';
	let { story, step }: { story: StoryId; step: number } = $props();
</script>

<svg class="sentence-art" viewBox="0 0 80 80" role="img" aria-hidden="true">
	<rect width="80" height="80" rx="12" fill="#f5efe4" />
	{#if story === 'wash'}
		{#if step === 0}
			<circle cx="40" cy="28" r="10" fill="#f4d6a8" />
			<rect x="28" y="40" width="24" height="22" rx="4" fill="#7ec8e8" />
			<path d="M20,52 Q28,44 36,52" fill="none" stroke="#5aa0d0" stroke-width="3" />
		{:else if step === 1}
			<rect x="22" y="30" width="36" height="28" rx="4" fill="#7ec8e8" />
			<path d="M30,40 Q40,50 50,40" fill="#fff" opacity="0.5" />
			<circle cx="58" cy="24" r="6" fill="#f4d6a8" />
		{:else}
			<circle cx="40" cy="28" r="10" fill="#f4d6a8" />
			<path d="M28,48 H52" stroke="#5aa0d0" stroke-width="4" stroke-linecap="round" />
			<circle cx="32" cy="56" r="3" fill="#7ec8e8" /><circle cx="48" cy="56" r="3" fill="#7ec8e8" />
		{/if}
	{:else if story === 'plant'}
		{#if step === 0}
			<ellipse cx="40" cy="58" rx="22" ry="8" fill="#8b5a3c" />
			<path d="M28,58 Q40,40 52,58" fill="#6a4030" />
		{:else if step === 1}
			<ellipse cx="40" cy="60" rx="20" ry="7" fill="#8b5a3c" />
			<rect x="37" y="36" width="6" height="24" fill="#5da85f" />
			<circle cx="40" cy="32" r="3" fill="#3a7a3a" />
		{:else}
			<ellipse cx="40" cy="62" rx="20" ry="7" fill="#8b5a3c" />
			<rect x="37" y="34" width="6" height="28" fill="#5da85f" />
			<circle cx="40" cy="28" r="10" fill="#e07070" />
		{/if}
	{:else if step === 0}
		<rect x="24" y="40" width="32" height="20" rx="3" fill="#f0c060" />
		<circle cx="40" cy="28" r="8" fill="#f4d6a8" />
	{:else if step === 1}
		<path d="M20,50 L40,30 L60,50 Z" fill="#e07070" />
		<rect x="34" y="50" width="12" height="14" fill="#fff8e0" />
	{:else}
		<circle cx="40" cy="36" r="14" fill="#f4d6a8" />
		<path d="M32,40 Q40,48 48,40" fill="none" stroke="#4a2c2a" stroke-width="2" />
	{/if}
</svg>
