<script lang="ts">
	import { onMount } from 'svelte';
	import { getLocale, localizeHref, locales } from '#lib/paraglide/runtime.js';
	import { m } from '#lib/paraglide/messages.js';
	import { loadProgress } from '#lib/progress.js';
	import FruitArt from '#lib/components/FruitArt.svelte';
	import ShapeArt from '#lib/components/ShapeArt.svelte';
	import SidesArt from '#lib/components/SidesArt.svelte';
	import BunnyFace from '#lib/components/BunnyFace.svelte';
	import StepArt from '#lib/components/StepArt.svelte';
	import BrushArt from '#lib/components/BrushArt.svelte';
	import BathArt from '#lib/components/BathArt.svelte';
	import ClockArt from '#lib/components/ClockArt.svelte';
	import SeasonArt from '#lib/components/SeasonArt.svelte';
	import WeatherArt from '#lib/components/WeatherArt.svelte';
	import LeftRightArt from '#lib/components/LeftRightArt.svelte';
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
	let clearedOdd = $state(0);
	let clearedMore = $state(0);
	let clearedOpp = $state(0);
	let clearedRead = $state(0);
	let clearedOrder = $state(0);
	let clearedMiss = $state(0);
	let clearedPos = $state(0);
	let clearedMatch = $state(0);
	let clearedPat = $state(0);
	let clearedSides = $state(0);
	let clearedShp = $state(0);
	let clearedSame = $state(0);
	let clearedNext = $state(0);
	let clearedAbc = $state(0);
	let clearedBef = $state(0);
	let clearedRhyme = $state(0);
	let clearedSyl = $state(0);
	let clearedSort = $state(0);
	let clearedShadow = $state(0);
	let clearedTime = $state(0);
	let clearedSeason = $state(0);
	let clearedDays = $state(0);
	let clearedWeather = $state(0);
	let clearedLr = $state(0);
	let clearedJigsaw = $state(0);

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
	const oddHref = $derived(localizeHref('/play/odd-one', { locale }));
	const moreHref = $derived(localizeHref('/play/more-less', { locale }));
	const oppHref = $derived(localizeHref('/play/opposites', { locale }));
	const readHref = $derived(localizeHref('/play/read-word', { locale }));
	const orderHref = $derived(localizeHref('/play/small-big', { locale }));
	const missHref = $derived(localizeHref('/play/missing', { locale }));
	const posHref = $derived(localizeHref('/play/position', { locale }));
	const matchHref = $derived(localizeHref('/play/match-count', { locale }));
	const patHref = $derived(localizeHref('/play/pattern', { locale }));
	const sidesHref = $derived(localizeHref('/play/sides', { locale }));
	const shpHref = $derived(localizeHref('/play/shape-pattern', { locale }));
	const sameHref = $derived(localizeHref('/play/same-pair', { locale }));
	const nextNumHref = $derived(localizeHref('/play/next-number', { locale }));
	const abcHref = $derived(localizeHref('/play/abc-order', { locale }));
	const befHref = $derived(localizeHref('/play/before-after', { locale }));
	const rhymeHref = $derived(localizeHref('/play/rhyme', { locale }));
	const sylHref = $derived(localizeHref('/play/syllable', { locale }));
	const sortHref = $derived(localizeHref('/play/sort-color', { locale }));
	const shadowHref = $derived(localizeHref('/play/shadow-match', { locale }));
	const timeHref = $derived(localizeHref('/play/what-time', { locale }));
	const seasonHref = $derived(localizeHref('/play/seasons', { locale }));
	const daysHref = $derived(localizeHref('/play/days-week', { locale }));
	const weatherHref = $derived(localizeHref('/play/weather', { locale }));
	const lrHref = $derived(localizeHref('/play/left-right', { locale }));
	const jigsawHref = $derived(localizeHref('/play/jigsaw', { locale }));

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
		clearedOdd = progress['odd-one'].cleared;
		clearedMore = progress['more-less'].cleared;
		clearedOpp = progress['opposites'].cleared;
		clearedRead = progress['read-word'].cleared;
		clearedOrder = progress['small-big'].cleared;
		clearedMiss = progress['missing'].cleared;
		clearedPos = progress['position'].cleared;
		clearedMatch = progress['match-count'].cleared;
		clearedPat = progress['pattern'].cleared;
		clearedSides = progress['sides'].cleared;
		clearedShp = progress['shape-pattern'].cleared;
		clearedSame = progress['same-pair'].cleared;
		clearedNext = progress['next-number'].cleared;
		clearedAbc = progress['abc-order'].cleared;
		clearedBef = progress['before-after'].cleared;
		clearedRhyme = progress.rhyme.cleared;
		clearedSyl = progress.syllable.cleared;
		clearedSort = progress['sort-color'].cleared;
		clearedShadow = progress['shadow-match'].cleared;
		clearedTime = progress['what-time'].cleared;
		clearedSeason = progress.seasons.cleared;
		clearedDays = progress['days-week'].cleared;
		clearedWeather = progress.weather.cleared;
		clearedLr = progress['left-right'].cleared;
		clearedJigsaw = progress.jigsaw.cleared;
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

<section class="card game-card" aria-label={m.odd_name()} style="margin-top: 1.25rem;">
	<div class="thumb">
		<ShapeArt shape="star" color="yellow" />
	</div>
	<div>
		<h2>{m.odd_name()}</h2>
		<p>{m.odd_desc()}</p>
		<div class="row">
			<a class="btn" href={oddHref}>{m.play()}</a>
			<span class="progress-note">{m.progress({ done: clearedOdd })}</span>
		</div>
	</div>
</section>

<section class="card game-card" aria-label={m.more_name()} style="margin-top: 1.25rem;">
	<div class="thumb">
		<FruitArt fruit="grapes" />
	</div>
	<div>
		<h2>{m.more_name()}</h2>
		<p>{m.more_desc()}</p>
		<div class="row">
			<a class="btn" href={moreHref}>{m.play()}</a>
			<span class="progress-note">{m.progress({ done: clearedMore })}</span>
		</div>
	</div>
</section>

<section class="card game-card" aria-label={m.opp_name()} style="margin-top: 1.25rem;">
	<div class="thumb">
		<BunnyFace emotion="sad" />
	</div>
	<div>
		<h2>{m.opp_name()}</h2>
		<p>{m.opp_desc()}</p>
		<div class="row">
			<a class="btn" href={oppHref}>{m.play()}</a>
			<span class="progress-note">{m.progress({ done: clearedOpp })}</span>
		</div>
	</div>
</section>

<section class="card game-card" aria-label={m.read_name()} style="margin-top: 1.25rem;">
	<div class="thumb">
		<FruitArt fruit="cherry" />
	</div>
	<div>
		<h2>{m.read_name()}</h2>
		<p>{m.read_desc()}</p>
		<div class="row">
			<a class="btn" href={readHref}>{m.play()}</a>
			<span class="progress-note">{m.progress({ done: clearedRead })}</span>
		</div>
	</div>
</section>

<section class="card game-card" aria-label={m.order_name()} style="margin-top: 1.25rem;">
	<div class="thumb">
		<FruitArt fruit="pear" />
	</div>
	<div>
		<h2>{m.order_name()}</h2>
		<p>{m.order_desc()}</p>
		<div class="row">
			<a class="btn" href={orderHref}>{m.play()}</a>
			<span class="progress-note">{m.progress({ done: clearedOrder })}</span>
		</div>
	</div>
</section>

<section class="card game-card" aria-label={m.miss_name()} style="margin-top: 1.25rem;">
	<div class="thumb">
		<span class="tile-letter">?</span>
	</div>
	<div>
		<h2>{m.miss_name()}</h2>
		<p>{m.miss_desc()}</p>
		<div class="row">
			<a class="btn" href={missHref}>{m.play()}</a>
			<span class="progress-note">{m.progress({ done: clearedMiss })}</span>
		</div>
	</div>
</section>

<section class="card game-card" aria-label={m.pos_name()} style="margin-top: 1.25rem;">
	<div class="thumb">
		<FruitArt fruit="banana" />
	</div>
	<div>
		<h2>{m.pos_name()}</h2>
		<p>{m.pos_desc()}</p>
		<div class="row">
			<a class="btn" href={posHref}>{m.play()}</a>
			<span class="progress-note">{m.progress({ done: clearedPos })}</span>
		</div>
	</div>
</section>

<section class="card game-card" aria-label={m.match_name()} style="margin-top: 1.25rem;">
	<div class="thumb">
		<span class="tile-letter">4</span>
	</div>
	<div>
		<h2>{m.match_name()}</h2>
		<p>{m.match_desc()}</p>
		<div class="row">
			<a class="btn" href={matchHref}>{m.play()}</a>
			<span class="progress-note">{m.progress({ done: clearedMatch })}</span>
		</div>
	</div>
</section>

<section class="card game-card" aria-label={m.pat_name()} style="margin-top: 1.25rem;">
	<div class="thumb">
		<ShapeArt shape="circle" color="red" />
	</div>
	<div>
		<h2>{m.pat_name()}</h2>
		<p>{m.pat_desc()}</p>
		<div class="row">
			<a class="btn" href={patHref}>{m.play()}</a>
			<span class="progress-note">{m.progress({ done: clearedPat })}</span>
		</div>
	</div>
</section>

<section class="card game-card" aria-label={m.sides_name()} style="margin-top: 1.25rem;">
	<div class="thumb">
		<SidesArt shape="triangle" />
	</div>
	<div>
		<h2>{m.sides_name()}</h2>
		<p>{m.sides_desc()}</p>
		<div class="row">
			<a class="btn" href={sidesHref}>{m.play()}</a>
			<span class="progress-note">{m.progress({ done: clearedSides })}</span>
		</div>
	</div>
</section>

<section class="card game-card" aria-label={m.shp_name()} style="margin-top: 1.25rem;">
	<div class="thumb">
		<ShapeArt shape="star" color="yellow" />
	</div>
	<div>
		<h2>{m.shp_name()}</h2>
		<p>{m.shp_desc()}</p>
		<div class="row">
			<a class="btn" href={shpHref}>{m.play()}</a>
			<span class="progress-note">{m.progress({ done: clearedShp })}</span>
		</div>
	</div>
</section>

<section class="card game-card" aria-label={m.same_name()} style="margin-top: 1.25rem;">
	<div class="thumb">
		<FruitArt fruit="apple" />
	</div>
	<div>
		<h2>{m.same_name()}</h2>
		<p>{m.same_desc()}</p>
		<div class="row">
			<a class="btn" href={sameHref}>{m.play()}</a>
			<span class="progress-note">{m.progress({ done: clearedSame })}</span>
		</div>
	</div>
</section>

<section class="card game-card" aria-label={m.next_name()} style="margin-top: 1.25rem;">
	<div class="thumb">
		<span class="tile-letter">3</span>
	</div>
	<div>
		<h2>{m.next_name()}</h2>
		<p>{m.next_desc()}</p>
		<div class="row">
			<a class="btn" href={nextNumHref}>{m.play()}</a>
			<span class="progress-note">{m.progress({ done: clearedNext })}</span>
		</div>
	</div>
</section>

<section class="card game-card" aria-label={m.abc_name()} style="margin-top: 1.25rem;">
	<div class="thumb">
		<span class="tile-letter">C</span>
	</div>
	<div>
		<h2>{m.abc_name()}</h2>
		<p>{m.abc_desc()}</p>
		<div class="row">
			<a class="btn" href={abcHref}>{m.play()}</a>
			<span class="progress-note">{m.progress({ done: clearedAbc })}</span>
		</div>
	</div>
</section>

<section class="card game-card" aria-label={m.bef_name()} style="margin-top: 1.25rem;">
	<div class="thumb">
		<span class="tile-letter">B</span>
	</div>
	<div>
		<h2>{m.bef_name()}</h2>
		<p>{m.bef_desc()}</p>
		<div class="row">
			<a class="btn" href={befHref}>{m.play()}</a>
			<span class="progress-note">{m.progress({ done: clearedBef })}</span>
		</div>
	</div>
</section>

<section class="card game-card" aria-label={m.rhyme_name()} style="margin-top: 1.25rem;">
	<div class="thumb">
		<span class="tile-letter" aria-hidden="true">🐱</span>
	</div>
	<div>
		<h2>{m.rhyme_name()}</h2>
		<p>{m.rhyme_desc()}</p>
		<div class="row">
			<a class="btn" href={rhymeHref}>{m.play()}</a>
			<span class="progress-note">{m.progress({ done: clearedRhyme })}</span>
		</div>
	</div>
</section>

<section class="card game-card" aria-label={m.syl_name()} style="margin-top: 1.25rem;">
	<div class="thumb">
		<span class="tile-letter">2</span>
	</div>
	<div>
		<h2>{m.syl_name()}</h2>
		<p>{m.syl_desc()}</p>
		<div class="row">
			<a class="btn" href={sylHref}>{m.play()}</a>
			<span class="progress-note">{m.progress({ done: clearedSyl })}</span>
		</div>
	</div>
</section>

<section class="card game-card" aria-label={m.sort_name()} style="margin-top: 1.25rem;">
	<div class="thumb">
		<ShapeArt shape="circle" color="red" />
	</div>
	<div>
		<h2>{m.sort_name()}</h2>
		<p>{m.sort_desc()}</p>
		<div class="row">
			<a class="btn" href={sortHref}>{m.play()}</a>
			<span class="progress-note">{m.progress({ done: clearedSort })}</span>
		</div>
	</div>
</section>

<section class="card game-card" aria-label={m.shadow_name()} style="margin-top: 1.25rem;">
	<div class="thumb">
		<span class="shadow-art" aria-hidden="true"><FruitArt fruit="apple" /></span>
	</div>
	<div>
		<h2>{m.shadow_name()}</h2>
		<p>{m.shadow_desc()}</p>
		<div class="row">
			<a class="btn" href={shadowHref}>{m.play()}</a>
			<span class="progress-note">{m.progress({ done: clearedShadow })}</span>
		</div>
	</div>
</section>

<section class="card game-card" aria-label={m.time_name()} style="margin-top: 1.25rem;">
	<div class="thumb">
		<span class="time-thumb" aria-hidden="true"><ClockArt hour={8} part="morning" /></span>
	</div>
	<div>
		<h2>{m.time_name()}</h2>
		<p>{m.time_desc()}</p>
		<div class="row">
			<a class="btn" href={timeHref}>{m.play()}</a>
			<span class="progress-note">{m.progress({ done: clearedTime })}</span>
		</div>
	</div>
</section>

<section class="card game-card" aria-label={m.season_name()} style="margin-top: 1.25rem;">
	<div class="thumb">
		<span class="season-thumb" aria-hidden="true"><SeasonArt season="spring" /></span>
	</div>
	<div>
		<h2>{m.season_name()}</h2>
		<p>{m.season_desc()}</p>
		<div class="row">
			<a class="btn" href={seasonHref}>{m.play()}</a>
			<span class="progress-note">{m.progress({ done: clearedSeason })}</span>
		</div>
	</div>
</section>

<section class="card game-card" aria-label={m.days_name()} style="margin-top: 1.25rem;">
	<div class="thumb">
		<span class="days-thumb" aria-hidden="true">Mo</span>
	</div>
	<div>
		<h2>{m.days_name()}</h2>
		<p>{m.days_desc()}</p>
		<div class="row">
			<a class="btn" href={daysHref}>{m.play()}</a>
			<span class="progress-note">{m.progress({ done: clearedDays })}</span>
		</div>
	</div>
</section>

<section class="card game-card" aria-label={m.weather_name()} style="margin-top: 1.25rem;">
	<div class="thumb">
		<span class="weather-thumb" aria-hidden="true"><WeatherArt weather="sunny" /></span>
	</div>
	<div>
		<h2>{m.weather_name()}</h2>
		<p>{m.weather_desc()}</p>
		<div class="row">
			<a class="btn" href={weatherHref}>{m.play()}</a>
			<span class="progress-note">{m.progress({ done: clearedWeather })}</span>
		</div>
	</div>
</section>

<section class="card game-card" aria-label={m.lr_name()} style="margin-top: 1.25rem;">
	<div class="thumb">
		<span class="lr-thumb" aria-hidden="true"><LeftRightArt side="right" cue="arrow" /></span>
	</div>
	<div>
		<h2>{m.lr_name()}</h2>
		<p>{m.lr_desc()}</p>
		<div class="row">
			<a class="btn" href={lrHref}>{m.play()}</a>
			<span class="progress-note">{m.progress({ done: clearedLr })}</span>
		</div>
	</div>
</section>

<section class="card game-card" aria-label={m.jigsaw_name()} style="margin-top: 1.25rem;">
	<div class="thumb">
		<span class="jigsaw-thumb" aria-hidden="true">
			<span class="jigsaw-thumb-piece"></span>
			<span class="jigsaw-thumb-piece mid"></span>
		</span>
	</div>
	<div>
		<h2>{m.jigsaw_name()}</h2>
		<p>{m.jigsaw_desc()}</p>
		<div class="row">
			<a class="btn" href={jigsawHref}>{m.play()}</a>
			<span class="progress-note">{m.progress({ done: clearedJigsaw })}</span>
		</div>
	</div>
</section>
