<script lang="ts">
	import type { JigsawScene } from '#lib/jigsaw.js';

	interface Props {
		scene: JigsawScene;
		width: number;
		height: number;
	}

	let { scene, width, height }: Props = $props();
</script>

<svg {width} {height} viewBox="0 0 {width} {height}" aria-hidden="true">
	{#if scene === 'sun'}
		<rect {width} {height} fill="#7ec8ff" />
		<rect y={height * 0.65} {width} height={height * 0.35} fill="#5da85f" />
		<circle
			cx={width * 0.72}
			cy={height * 0.28}
			r={Math.min(width, height) * 0.18}
			fill="#f2c230"
		/>
	{:else if scene === 'tree'}
		<rect {width} {height} fill="#b8e0ff" />
		<rect y={height * 0.7} {width} height={height * 0.3} fill="#7cbc5a" />
		<rect
			x={width * 0.45}
			y={height * 0.42}
			width={width * 0.1}
			height={height * 0.35}
			rx="4"
			fill="#8a5a3b"
		/>
		<ellipse
			cx={width * 0.5}
			cy={height * 0.38}
			rx={width * 0.28}
			ry={height * 0.28}
			fill="#4f9a4a"
		/>
	{:else if scene === 'house'}
		<rect {width} {height} fill="#9fd0f5" />
		<rect y={height * 0.72} {width} height={height * 0.28} fill="#6aa06a" />
		<rect
			x={width * 0.28}
			y={height * 0.42}
			width={width * 0.44}
			height={height * 0.36}
			rx="4"
			fill="#f0d5a8"
		/>
		<path
			d="M {width * 0.22} {height * 0.45} L {width * 0.5} {height * 0.22} L {width * 0.78} {height *
				0.45} Z"
			fill="#e85d4c"
		/>
		<rect
			x={width * 0.44}
			y={height * 0.55}
			width={width * 0.12}
			height={height * 0.23}
			rx="2"
			fill="#8a5a3b"
		/>
	{:else if scene === 'boat'}
		<rect {width} {height} fill="#6eb6e8" />
		<rect y={height * 0.55} {width} height={height * 0.45} fill="#3d8fd1" />
		<path
			d="M {width * 0.2} {height * 0.55} L {width * 0.8} {height * 0.55} L {width * 0.7} {height *
				0.72} L {width * 0.3} {height * 0.72} Z"
			fill="#c45c26"
		/>
		<path
			d="M {width * 0.5} {height * 0.22} L {width * 0.5} {height * 0.55} L {width * 0.72} {height *
				0.48} Z"
			fill="#fff7ec"
		/>
	{:else}
		<rect {width} {height} fill="#c8e6c0" />
		<rect y={height * 0.7} {width} height={height * 0.3} fill="#7cbc5a" />
		<circle cx={width * 0.5} cy={height * 0.42} r={Math.min(width, height) * 0.16} fill="#f4a3c0" />
		<circle cx={width * 0.38} cy={height * 0.38} r={Math.min(width, height) * 0.1} fill="#ef8c3b" />
		<circle cx={width * 0.62} cy={height * 0.38} r={Math.min(width, height) * 0.1} fill="#9b7ed9" />
		<circle cx={width * 0.5} cy={height * 0.3} r={Math.min(width, height) * 0.1} fill="#ffd66e" />
		<rect
			x={width * 0.47}
			y={height * 0.48}
			width={width * 0.06}
			height={height * 0.22}
			rx="2"
			fill="#5da85f"
		/>
	{/if}
</svg>
