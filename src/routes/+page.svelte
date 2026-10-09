<script lang="ts">
	import { onMount } from 'svelte';
	import { getLocale, localizeHref, locales } from '#lib/paraglide/runtime.js';
	import { m } from '#lib/paraglide/messages.js';
	import { loadProgress } from '#lib/progress.js';
	import FruitArt from '#lib/components/FruitArt.svelte';
	import ShapeArt from '#lib/components/ShapeArt.svelte';
	import BunnyFace from '#lib/components/BunnyFace.svelte';
	import StepArt from '#lib/components/StepArt.svelte';
	import BrushArt from '#lib/components/BrushArt.svelte';
	import BathArt from '#lib/components/BathArt.svelte';
	import favicon from '#lib/assets/favicon.svg';

	let cleared = $state(0);
	let clearedShapes = $state(0);
	let clearedFeelings = $state(0);
	let clearedLetters = $state(0);
	let clearedAdding = $state(0);
	let clearedWash = $state(0);
	let clearedBrush = $state(0);
	let clearedBath = $state(0);
	let clearedSubtract = $state(0);
	let clearedMemory = $state(0);

	const locale = $derived(getLocale() as (typeof locales)[number]);
	const gameHref = $derived(localizeHref('/play/count-fruit', { locale }));
	const shapesHref = $derived(localizeHref('/play/color-shapes', { locale }));
	const feelingsHref = $derived(localizeHref('/play/feelings', { locale }));
	const lettersHref = $derived(localizeHref('/play/letters', { locale }));
	const addingHref = $derived(localizeHref('/play/adding', { locale }));
	const washHref = $derived(localizeHref('/play/wash-hands', { locale }));
	const brushHref = $derived(localizeHref('/play/brush-teeth', { locale }));
	const bathHref = $derived(localizeHref('/play/bath', { locale }));
	const subtractHref = $derived(localizeHref('/play/subtract', { locale }));
	const memoryHref = $derived(localizeHref('/play/memory', { locale }));

	onMount(() => {
		const progress = loadProgress(localStorage);
		cleared = progress['count-fruit'].cleared;
		clearedShapes = progress['color-shapes'].cleared;
		clearedFeelings = progress['feelings'].cleared;
		clearedLetters = progress['letters'].cleared;
		clearedAdding = progress['adding'].cleared;
		clearedWash = progress['wash-hands'].cleared;
		clearedBrush = progress['brush-teeth'].cleared;
		clearedBath = progress['bath'].cleared;
		clearedSubtract = progress['subtract'].cleared;
		clearedMemory = progress['memory'].cleared;
	});
</script>

<svelte:head>
	<title>Lumi — {m.game_name()}</title>
</svelte:head>

<div class="hero">
	<div class="hero-art">
		<img src={favicon} alt="" width="112" height="112" />
	</div>
	<h1>Lumi</h1>
	<p>{m.tagline()}</p>
</div>

<section class="card game-card" aria-label={m.game_name()}>
	<div class="thumb">
		<FruitArt fruit="apple" happy={true} />
	</div>
	<div>
		<h2>{m.game_name()}</h2>
		<p>{m.game_desc()}</p>
		<div class="row">
			<a class="btn" href={gameHref}>{m.play()}</a>
			<span class="progress-note">{m.progress({ done: cleared })}</span>
		</div>
	</div>
</section>

<section class="card game-card" aria-label={m.shapes_name()} style="margin-top: 1.25rem;">
	<div class="thumb">
		<ShapeArt shape="star" color="blue" happy={true} />
	</div>
	<div>
		<h2>{m.shapes_name()}</h2>
		<p>{m.shapes_desc()}</p>
		<div class="row">
			<a class="btn" href={shapesHref}>{m.play()}</a>
			<span class="progress-note">{m.progress({ done: clearedShapes })}</span>
		</div>
	</div>
</section>

<section class="card game-card" aria-label={m.feelings_name()} style="margin-top: 1.25rem;">
	<div class="thumb">
		<BunnyFace emotion="happy" />
	</div>
	<div>
		<h2>{m.feelings_name()}</h2>
		<p>{m.feelings_desc()}</p>
		<div class="row">
			<a class="btn" href={feelingsHref}>{m.play()}</a>
			<span class="progress-note">{m.progress({ done: clearedFeelings })}</span>
		</div>
	</div>
</section>

<section class="card game-card" aria-label={m.letters_name()} style="margin-top: 1.25rem;">
	<div class="thumb tile-letter" aria-hidden="true">Aa</div>
	<div>
		<h2>{m.letters_name()}</h2>
		<p>{m.letters_desc()}</p>
		<div class="row">
			<a class="btn" href={lettersHref}>{m.play()}</a>
			<span class="progress-note">{m.progress({ done: clearedLetters })}</span>
		</div>
	</div>
</section>

<section class="card game-card" aria-label={m.adding_name()} style="margin-top: 1.25rem;">
	<div class="thumb">
		<FruitArt fruit="apple" happy={true} />
	</div>
	<div>
		<h2>{m.adding_name()}</h2>
		<p>{m.adding_desc()}</p>
		<div class="row">
			<a class="btn" href={addingHref}>{m.play()}</a>
			<span class="progress-note">{m.progress({ done: clearedAdding })}</span>
		</div>
	</div>
</section>

<section class="card game-card" aria-label={m.wash_name()} style="margin-top: 1.25rem;">
	<div class="thumb">
		<StepArt step="soap" />
	</div>
	<div>
		<h2>{m.wash_name()}</h2>
		<p>{m.wash_desc()}</p>
		<div class="row">
			<a class="btn" href={washHref}>{m.play()}</a>
			<span class="progress-note">{m.progress({ done: clearedWash })}</span>
		</div>
	</div>
</section>

<section class="card game-card" aria-label={m.brush_name()} style="margin-top: 1.25rem;">
	<div class="thumb">
		<BrushArt step="paste" />
	</div>
	<div>
		<h2>{m.brush_name()}</h2>
		<p>{m.brush_desc()}</p>
		<div class="row">
			<a class="btn" href={brushHref}>{m.play()}</a>
			<span class="progress-note">{m.progress({ done: clearedBrush })}</span>
		</div>
	</div>
</section>

<section class="card game-card" aria-label={m.bath_name()} style="margin-top: 1.25rem;">
	<div class="thumb">
		<BathArt step="water" />
	</div>
	<div>
		<h2>{m.bath_name()}</h2>
		<p>{m.bath_desc()}</p>
		<div class="row">
			<a class="btn" href={bathHref}>{m.play()}</a>
			<span class="progress-note">{m.progress({ done: clearedBath })}</span>
		</div>
	</div>
</section>

<section class="card game-card" aria-label={m.subtract_name()} style="margin-top: 1.25rem;">
	<div class="thumb">
		<FruitArt fruit="pear" />
	</div>
	<div>
		<h2>{m.subtract_name()}</h2>
		<p>{m.subtract_desc()}</p>
		<div class="row">
			<a class="btn" href={subtractHref}>{m.play()}</a>
			<span class="progress-note">{m.progress({ done: clearedSubtract })}</span>
		</div>
	</div>
</section>

<section class="card game-card" aria-label={m.memory_name()} style="margin-top: 1.25rem;">
	<div class="thumb">
		<img src={favicon} alt="" />
	</div>
	<div>
		<h2>{m.memory_name()}</h2>
		<p>{m.memory_desc()}</p>
		<div class="row">
			<a class="btn" href={memoryHref}>{m.play()}</a>
			<span class="progress-note">{m.progress({ done: clearedMemory })}</span>
		</div>
	</div>
</section>
