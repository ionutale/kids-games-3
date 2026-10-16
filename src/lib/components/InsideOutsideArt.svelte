<script lang="ts">
	import type { InsideOutsideScene } from '#lib/inside-outside.js';

	let { scene }: { scene: InsideOutsideScene } = $props();

	const isInside = $derived(
		scene === 'bedroom' || scene === 'kitchen' || scene === 'sofa'
	);
</script>

<svg class="inside-outside-art" viewBox="0 0 120 120" role="img" aria-hidden="true">
	{#if isInside}
		<rect width="120" height="120" rx="18" fill="#f5e6d0" />
		<rect x="0" y="88" width="120" height="32" fill="#d4b896" />
		{#if scene === 'bedroom'}
			<rect x="18" y="48" width="50" height="36" rx="4" fill="#7ec8e8" stroke="#4a8fc0" stroke-width="3" />
			<rect x="22" y="42" width="42" height="10" rx="3" fill="#e8a0b0" />
			<circle cx="88" cy="36" r="10" fill="#fff8e0" stroke="#e0d0a0" stroke-width="2" />
			<rect x="84" y="46" width="8" height="18" fill="#c8b090" />
		{:else if scene === 'kitchen'}
			<rect x="14" y="50" width="92" height="38" rx="4" fill="#e8d0b0" stroke="#c4a070" stroke-width="3" />
			<rect x="22" y="38" width="28" height="16" rx="2" fill="#a0c8e8" />
			<rect x="58" y="56" width="22" height="18" rx="2" fill="#f0c060" />
			<circle cx="90" cy="42" r="8" fill="#e07070" />
		{:else}
			<rect x="20" y="58" width="56" height="28" rx="4" fill="#c45c3a" />
			<rect x="28" y="48" width="40" height="14" rx="6" fill="#e07070" />
			<rect x="24" y="72" width="12" height="14" fill="#a04030" />
			<rect x="60" y="72" width="12" height="14" fill="#a04030" />
			<rect x="86" y="40" width="18" height="48" rx="2" fill="#8b5a3c" />
		{/if}
	{:else}
		<rect width="120" height="120" rx="18" fill="#7ec8ff" />
		<circle class="idle-pulse" cx="92" cy="26" r="12" fill="#f5c84c" />
		<rect x="0" y="78" width="120" height="42" fill="#5da85f" />
		{#if scene === 'park'}
			<g class="idle-sway">
				<rect x="28" y="50" width="8" height="28" fill="#8b5a3c" />
				<circle cx="32" cy="42" r="16" fill="#6fbf73" />
			</g>
			<g class="idle-sway">
				<rect x="70" y="56" width="7" height="22" fill="#8b5a3c" />
				<circle cx="73" cy="48" r="12" fill="#7fd18a" />
			</g>
		{:else if scene === 'yard'}
			<rect x="18" y="48" width="36" height="30" rx="3" fill="#f4d6a8" stroke="#d4a574" stroke-width="2" />
			<path d="M14,48 L36,30 L58,48" fill="#c45c3a" />
			<g class="idle-sway">
				<rect x="72" y="54" width="8" height="24" fill="#8b5a3c" />
				<circle cx="76" cy="46" r="14" fill="#6fbf73" />
			</g>
		{:else}
			<rect x="28" y="62" width="64" height="8" rx="2" fill="#e0a040" />
			<rect x="36" y="42" width="6" height="20" fill="#c08030" />
			<rect x="78" y="42" width="6" height="20" fill="#c08030" />
			<circle cx="39" cy="38" r="8" fill="#e07070" />
			<circle cx="81" cy="38" r="8" fill="#7ec8e8" />
			<rect x="52" y="50" width="16" height="12" rx="2" fill="#f0c060" />
		{/if}
	{/if}
</svg>
