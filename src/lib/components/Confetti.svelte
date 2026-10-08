<script lang="ts">
	import { onMount } from 'svelte';

	/** A short canvas confetti burst. Fires once when mounted. */
	let canvas: HTMLCanvasElement | null = $state(null);
	let active = $state(true);

	const COLORS = ['#e4574f', '#f5a623', '#5aa9e6', '#6aa84f', '#9b7ed9', '#f4a3a3'];

	onMount(() => {
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !canvas) {
			active = false;
			return;
		}
		const context = canvas.getContext('2d');
		if (!context) {
			active = false;
			return;
		}
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		const pieces = Array.from({ length: 130 }, () => ({
			x: window.innerWidth / 2 + (Math.random() - 0.5) * 220,
			y: window.innerHeight * 0.35,
			vx: (Math.random() - 0.5) * 11,
			vy: -Math.random() * 10 - 3,
			size: 6 + Math.random() * 7,
			spin: Math.random() * Math.PI * 2,
			spinSpeed: (Math.random() - 0.5) * 0.3,
			color: COLORS[Math.floor(Math.random() * COLORS.length)],
			round: Math.random() > 0.6
		}));
		const start = performance.now();
		const DURATION = 2600;
		let frame = 0;
		const tick = (now: number) => {
			frame = requestAnimationFrame(tick);
			const elapsed = now - start;
			context.clearRect(0, 0, canvas!.width, canvas!.height);
			for (const piece of pieces) {
				piece.vy += 0.28;
				piece.vx *= 0.99;
				piece.x += piece.vx + Math.sin(now / 180 + piece.spin) * 1.2;
				piece.y += piece.vy;
				piece.spin += piece.spinSpeed;
				context.save();
				context.translate(piece.x, piece.y);
				context.rotate(piece.spin);
				context.fillStyle = piece.color;
				context.globalAlpha =
					elapsed > DURATION - 500 ? Math.max(0, 1 - (elapsed - (DURATION - 500)) / 500) : 1;
				if (piece.round) {
					context.beginPath();
					context.arc(0, 0, piece.size / 2, 0, Math.PI * 2);
					context.fill();
				} else {
					context.fillRect(-piece.size / 2, -piece.size / 4, piece.size, piece.size / 2);
				}
				context.restore();
			}
			if (elapsed > DURATION) {
				cancelAnimationFrame(frame);
				active = false;
			}
		};
		frame = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(frame);
	});
</script>

{#if active}
	<canvas bind:this={canvas} class="confetti" aria-hidden="true"></canvas>
{/if}

<style>
	.confetti {
		position: fixed;
		inset: 0;
		width: 100vw;
		height: 100vh;
		pointer-events: none;
		z-index: 60;
	}
</style>
