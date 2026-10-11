<script lang="ts">
	import type { OpenClosedSubject } from '#lib/open-closed.js';
	let { subject }: { subject: OpenClosedSubject } = $props();
	const isOpen = $derived(subject.includes('open'));
</script>

<svg class="open-closed-art" class:open={isOpen} class:closed={!isOpen} viewBox="0 0 120 120" role="img" aria-hidden="true">
	<rect width="120" height="120" rx="18" fill="#f0e6d4" />
	{#if subject.startsWith('door')}
		<rect x="28" y="20" width="64" height="84" rx="4" fill="#d4a574" stroke="#a07850" stroke-width="3" />
		{#if isOpen}
			<path class="panel" d="M32,24 L70,18 L70,100 L32,104 Z" fill="#e8c4a0" stroke="#a07850" stroke-width="3" />
			<circle cx="62" cy="62" r="3" fill="#c0a040" />
		{:else}
			<rect class="panel" x="32" y="24" width="56" height="76" fill="#e8c4a0" />
			<circle cx="74" cy="62" r="3" fill="#c0a040" />
		{/if}
	{:else if subject.startsWith('box')}
		{#if isOpen}
			<path d="M24,48 L60,28 L96,48 L60,68 Z" fill="#e8a04a" />
			<path class="lid" d="M24,48 L60,28 L96,48 L60,20 Z" fill="#f0c060" />
			<path d="M24,48 V78 L60,98 L96,78 V48 L60,68 Z" fill="#d48830" />
		{:else}
			<path class="lid" d="M24,40 L60,22 L96,40 L60,58 Z" fill="#f0c060" />
			<path d="M24,40 V72 L60,90 L96,72 V40 L60,58 Z" fill="#d48830" />
		{/if}
	{:else if isOpen}
		<path d="M20,30 L60,22 L60,90 L20,82 Z" fill="#fff8e0" stroke="#c4a070" stroke-width="3" />
		<path class="lid" d="M60,22 L100,30 L100,82 L60,90 Z" fill="#fff0d0" stroke="#c4a070" stroke-width="3" />
	{:else}
		<rect class="panel" x="30" y="24" width="60" height="72" rx="3" fill="#e8d0b0" stroke="#c4a070" stroke-width="3" />
		<path d="M60,24 V96" stroke="#c4a070" stroke-width="3" />
	{/if}
</svg>

<style>
	.open-closed-art.open .lid,
	.open-closed-art.open .panel {
		transform-box: fill-box;
		transform-origin: left center;
		animation: oc-swing 1.8s ease-in-out infinite;
	}
	.open-closed-art.closed .panel,
	.open-closed-art.closed .lid {
		transform-box: fill-box;
		transform-origin: center;
		animation: oc-shut 2s ease-in-out infinite;
	}
	@keyframes oc-swing {
		0%, 100% { transform: rotate(0deg); }
		50% { transform: rotate(-6deg); }
	}
	@keyframes oc-shut {
		0%, 100% { transform: scaleX(1); }
		50% { transform: scaleX(0.97); }
	}
</style>
