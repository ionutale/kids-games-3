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
	import KindArt from '#lib/components/KindArt.svelte';
	import BodyArt from '#lib/components/BodyArt.svelte';
	import PlaceArt from '#lib/components/PlaceArt.svelte';
	import FoodArt from '#lib/components/FoodArt.svelte';
	import SetFaceArt from '#lib/components/SetFaceArt.svelte';
	import PathArt from '#lib/components/PathArt.svelte';
	import CoinArt from '#lib/components/CoinArt.svelte';
	import ClothesArt from '#lib/components/ClothesArt.svelte';
	import WeightArt from '#lib/components/WeightArt.svelte';
	import HomeAnimalArt from '#lib/components/HomeAnimalArt.svelte';
	import DayNightArt from '#lib/components/DayNightArt.svelte';
	import InsideOutsideArt from '#lib/components/InsideOutsideArt.svelte';
	import LandWaterAirArt from '#lib/components/LandWaterAirArt.svelte';
	import WetDryArt from '#lib/components/WetDryArt.svelte';
	import HotColdArt from '#lib/components/HotColdArt.svelte';
	import BatchSceneArt from '#lib/components/BatchSceneArt.svelte';
	import FirstSoundArt from '#lib/components/FirstSoundArt.svelte';
	import PlantAnimalArt from '#lib/components/PlantAnimalArt.svelte';
	import SinkFloatTank from '#lib/components/SinkFloatTank.svelte';
	import DayJobsArt from '#lib/components/DayJobsArt.svelte';
	import RecycleArt from '#lib/components/RecycleArt.svelte';
	import HungryThirstyArt from '#lib/components/HungryThirstyArt.svelte';
	import SafeChoiceArt from '#lib/components/SafeChoiceArt.svelte';
	import FiveSensesArt from '#lib/components/FiveSensesArt.svelte';
	import NearFarArt from '#lib/components/NearFarArt.svelte';
	import OpenClosedArt from '#lib/components/OpenClosedArt.svelte';
	import UpDownArt from '#lib/components/UpDownArt.svelte';
	import SentenceOrderArt from '#lib/components/SentenceOrderArt.svelte';
	import favicon from '#lib/assets/favicon.svg';
	import LumiSun from '#lib/components/LumiSun.svelte';

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
	let clearedOless = $state(0);
	let clearedOmore = $state(0);
	let clearedMonths = $state(0);
	let clearedSkip = $state(0);
	let clearedKind = $state(0);
	let clearedHalf = $state(0);
	let clearedCmp = $state(0);
	let clearedPlace = $state(0);
	let clearedBlend = $state(0);
	let clearedCase = $state(0);
	let clearedSpell = $state(0);
	let clearedBody = $state(0);
	let clearedMap = $state(0);
	let clearedHealthy = $state(0);
	let clearedAbove = $state(0);
	let clearedSet = $state(0);
	let clearedPath = $state(0);
	let clearedMoney = $state(0);
	let clearedDress = $state(0);
	let clearedHeavy = $state(0);
	let clearedHomes = $state(0);
	let clearedDayNight = $state(0);
	let clearedInOut = $state(0);
	let clearedHabitat = $state(0);
	let clearedWetDry = $state(0);
	let clearedPlant = $state(0);
	let clearedSink = $state(0);
	let clearedJobs = $state(0);
	let clearedRecycle = $state(0);
	let clearedHunger = $state(0);
	let clearedSafe = $state(0);
	let clearedSenses = $state(0);
	let clearedSameNum = $state(0);
	let clearedNumBa = $state(0);
	let clearedMakeTen = $state(0);
	let clearedFirstSound = $state(0);
	let clearedWordLen = $state(0);
	let clearedSentOrd = $state(0);
	let clearedNearFar = $state(0);
	let clearedOpen = $state(0);
	let clearedUpDown = $state(0);
	let clearedHotCold = $state(0);
	let clearedLoudQuiet = $state(0);
	let clearedFullEmpty = $state(0);
	let clearedStopGo = $state(0);
	let clearedLiving = $state(0);
	let clearedHardSoft = $state(0);
	let clearedRough = $state(0);
	let clearedObjSize = $state(0);
	let clearedNewOld = $state(0);
	let clearedMornEve = $state(0);
	let clearedClean = $state(0);
	let clearedShare = $state(0);
	let clearedAsk = $state(0);
	let clearedMagnet = $state(0);
	let clearedSolid = $state(0);
	let clearedDna = $state(0);
	let clearedDouble = $state(0);
	let clearedEvenOdd = $state(0);
	let clearedHowMore = $state(0);
	let clearedLastSound = $state(0);
	let clearedRealWord = $state(0);
	let clearedWop = $state(0);
	let clearedInOn = $state(0);
	let clearedFront = $state(0);
	let clearedPush = $state(0);

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
	const olessHref = $derived(localizeHref('/play/one-less', { locale }));
	const omoreHref = $derived(localizeHref('/play/one-more', { locale }));
	const monthsHref = $derived(localizeHref('/play/months', { locale }));
	const skipHref = $derived(localizeHref('/play/skip-count', { locale }));
	const kindHref = $derived(localizeHref('/play/sort-kind', { locale }));
	const halfHref = $derived(localizeHref('/play/half-share', { locale }));
	const cmpHref = $derived(localizeHref('/play/compare-numbers', { locale }));
	const placeHref = $derived(localizeHref('/play/place-value', { locale }));
	const blendHref = $derived(localizeHref('/play/blend-sounds', { locale }));
	const caseHref = $derived(localizeHref('/play/letter-case', { locale }));
	const spellHref = $derived(localizeHref('/play/spell-word', { locale }));
	const bodyHref = $derived(localizeHref('/play/body-parts', { locale }));
	const mapHref = $derived(localizeHref('/play/map-places', { locale }));
	const healthyHref = $derived(localizeHref('/play/healthy-choice', { locale }));
	const aboveHref = $derived(localizeHref('/play/above-below', { locale }));
	const setHref = $derived(localizeHref('/play/complete-set', { locale }));
	const pathGameHref = $derived(localizeHref('/play/follow-path', { locale }));
	const moneyHref = $derived(localizeHref('/play/money-coins', { locale }));
	const dressHref = $derived(localizeHref('/play/dress-weather', { locale }));
	const heavyHref = $derived(localizeHref('/play/heavy-light', { locale }));
	const homesHref = $derived(localizeHref('/play/animal-homes', { locale }));
	const dayNightHref = $derived(localizeHref('/play/day-night', { locale }));
	const inOutHref = $derived(localizeHref('/play/inside-outside', { locale }));
	const habitatHref = $derived(localizeHref('/play/land-water-air', { locale }));
	const wetDryHref = $derived(localizeHref('/play/wet-dry', { locale }));
	const plantHref = $derived(localizeHref('/play/plant-animal', { locale }));
	const sinkHref = $derived(localizeHref('/play/sink-float', { locale }));
	const jobsHref = $derived(localizeHref('/play/day-jobs', { locale }));
	const recycleHref = $derived(localizeHref('/play/recycle-sort', { locale }));
	const hungerHref = $derived(localizeHref('/play/hungry-thirsty', { locale }));
	const safeHref = $derived(localizeHref('/play/safe-choice', { locale }));
	const sensesHref = $derived(localizeHref('/play/five-senses', { locale }));
	const sameNumHref = $derived(localizeHref('/play/same-number', { locale }));
	const numBaHref = $derived(localizeHref('/play/num-before-after', { locale }));
	const makeTenHref = $derived(localizeHref('/play/make-ten', { locale }));
	const firstSoundHref = $derived(localizeHref('/play/first-sound', { locale }));
	const wordLenHref = $derived(localizeHref('/play/word-length', { locale }));
	const sentOrdHref = $derived(localizeHref('/play/sentence-order', { locale }));
	const nearFarHref = $derived(localizeHref('/play/near-far', { locale }));
	const openHref = $derived(localizeHref('/play/open-closed', { locale }));
	const upDownHref = $derived(localizeHref('/play/up-down', { locale }));
	const hotColdHref = $derived(localizeHref('/play/hot-cold', { locale }));
	const loudQuietHref = $derived(localizeHref('/play/loud-quiet', { locale }));
	const fullEmptyHref = $derived(localizeHref('/play/full-empty', { locale }));
	const stopGoHref = $derived(localizeHref('/play/stop-go', { locale }));
	const livingHref = $derived(localizeHref('/play/living-nonliving', { locale }));
	const hardSoftHref = $derived(localizeHref('/play/hard-soft', { locale }));
	const roughHref = $derived(localizeHref('/play/rough-smooth', { locale }));
	const objSizeHref = $derived(localizeHref('/play/object-size', { locale }));
	const newOldHref = $derived(localizeHref('/play/new-old', { locale }));
	const mornEveHref = $derived(localizeHref('/play/morning-evening', { locale }));
	const cleanHref = $derived(localizeHref('/play/clean-dirty', { locale }));
	const shareHref = $derived(localizeHref('/play/share-keep', { locale }));
	const askHref = $derived(localizeHref('/play/ask-grab', { locale }));
	const magnetHref = $derived(localizeHref('/play/magnet-or-not', { locale }));
	const solidHref = $derived(localizeHref('/play/solid-liquid', { locale }));
	const dnaHref = $derived(localizeHref('/play/day-night-animal', { locale }));
	const doubleHref = $derived(localizeHref('/play/double-number', { locale }));
	const evenOddHref = $derived(localizeHref('/play/even-odd', { locale }));
	const howMoreHref = $derived(localizeHref('/play/how-many-more', { locale }));
	const lastSoundHref = $derived(localizeHref('/play/last-sound', { locale }));
	const realWordHref = $derived(localizeHref('/play/real-word', { locale }));
	const wopHref = $derived(localizeHref('/play/word-or-picture', { locale }));
	const inOnHref = $derived(localizeHref('/play/in-on-under', { locale }));
	const frontHref = $derived(localizeHref('/play/front-behind', { locale }));
	const pushHref = $derived(localizeHref('/play/push-pull', { locale }));

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
		clearedOless = progress['one-less'].cleared;
		clearedOmore = progress['one-more'].cleared;
		clearedMonths = progress.months.cleared;
		clearedSkip = progress['skip-count'].cleared;
		clearedKind = progress['sort-kind'].cleared;
		clearedHalf = progress['half-share'].cleared;
		clearedCmp = progress['compare-numbers'].cleared;
		clearedPlace = progress['place-value'].cleared;
		clearedBlend = progress['blend-sounds'].cleared;
		clearedCase = progress['letter-case'].cleared;
		clearedSpell = progress['spell-word'].cleared;
		clearedBody = progress['body-parts'].cleared;
		clearedMap = progress['map-places'].cleared;
		clearedHealthy = progress['healthy-choice'].cleared;
		clearedAbove = progress['above-below'].cleared;
		clearedSet = progress['complete-set'].cleared;
		clearedPath = progress['follow-path'].cleared;
		clearedMoney = progress['money-coins'].cleared;
		clearedDress = progress['dress-weather'].cleared;
		clearedHeavy = progress['heavy-light'].cleared;
		clearedHomes = progress['animal-homes'].cleared;
		clearedDayNight = progress['day-night'].cleared;
		clearedInOut = progress['inside-outside'].cleared;
		clearedHabitat = progress['land-water-air'].cleared;
		clearedWetDry = progress['wet-dry'].cleared;
		clearedPlant = progress['plant-animal'].cleared;
		clearedSink = progress['sink-float'].cleared;
		clearedJobs = progress['day-jobs'].cleared;
		clearedRecycle = progress['recycle-sort'].cleared;
		clearedHunger = progress['hungry-thirsty'].cleared;
		clearedSafe = progress['safe-choice'].cleared;
		clearedSenses = progress['five-senses'].cleared;
		clearedSameNum = progress['same-number'].cleared;
		clearedNumBa = progress['num-before-after'].cleared;
		clearedMakeTen = progress['make-ten'].cleared;
		clearedFirstSound = progress['first-sound'].cleared;
		clearedWordLen = progress['word-length'].cleared;
		clearedSentOrd = progress['sentence-order'].cleared;
		clearedNearFar = progress['near-far'].cleared;
		clearedOpen = progress['open-closed'].cleared;
		clearedUpDown = progress['up-down'].cleared;
		clearedHotCold = progress['hot-cold'].cleared;
		clearedLoudQuiet = progress['loud-quiet'].cleared;
		clearedFullEmpty = progress['full-empty'].cleared;
		clearedStopGo = progress['stop-go'].cleared;
		clearedLiving = progress['living-nonliving'].cleared;
		clearedHardSoft = progress['hard-soft'].cleared;
		clearedRough = progress['rough-smooth'].cleared;
		clearedObjSize = progress['object-size'].cleared;
		clearedNewOld = progress['new-old'].cleared;
		clearedMornEve = progress['morning-evening'].cleared;
		clearedClean = progress['clean-dirty'].cleared;
		clearedShare = progress['share-keep'].cleared;
		clearedAsk = progress['ask-grab'].cleared;
		clearedMagnet = progress['magnet-or-not'].cleared;
		clearedSolid = progress['solid-liquid'].cleared;
		clearedDna = progress['day-night-animal'].cleared;
		clearedDouble = progress['double-number'].cleared;
		clearedEvenOdd = progress['even-odd'].cleared;
		clearedHowMore = progress['how-many-more'].cleared;
		clearedLastSound = progress['last-sound'].cleared;
		clearedRealWord = progress['real-word'].cleared;
		clearedWop = progress['word-or-picture'].cleared;
		clearedInOn = progress['in-on-under'].cleared;
		clearedFront = progress['front-behind'].cleared;
		clearedPush = progress['push-pull'].cleared;
	});
</script>

<svelte:head>
	<title>Lumi — {m.game_name()}</title>
</svelte:head>

<div class="hero">
	<div class="hero-art">
		<LumiSun size="7rem" />
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

<section class="card game-card" aria-label={m.kind_name()} style="margin-top: 1.25rem;">
	<div class="thumb">
		<span class="kind-thumb" aria-hidden="true"><KindArt face="cat" /></span>
	</div>
	<div>
		<h2>{m.kind_name()}</h2>
		<p>{m.kind_desc()}</p>
		<div class="row">
			<a class="btn" href={kindHref}>{m.play()}</a>
			<span class="progress-note">{m.progress({ done: clearedKind })}</span>
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

<section class="card game-card" aria-label={m.months_name()} style="margin-top: 1.25rem;">
	<div class="thumb">
		<span class="months-thumb" aria-hidden="true">Ja</span>
	</div>
	<div>
		<h2>{m.months_name()}</h2>
		<p>{m.months_desc()}</p>
		<div class="row">
			<a class="btn" href={monthsHref}>{m.play()}</a>
			<span class="progress-note">{m.progress({ done: clearedMonths })}</span>
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

<section class="card game-card" aria-label={m.oless_name()} style="margin-top: 1.25rem;">
	<div class="thumb">
		<span class="oless-thumb" aria-hidden="true">−1</span>
	</div>
	<div>
		<h2>{m.oless_name()}</h2>
		<p>{m.oless_desc()}</p>
		<div class="row">
			<a class="btn" href={olessHref}>{m.play()}</a>
			<span class="progress-note">{m.progress({ done: clearedOless })}</span>
		</div>
	</div>
</section>

<section class="card game-card" aria-label={m.omore_name()} style="margin-top: 1.25rem;">
	<div class="thumb">
		<span class="omore-thumb" aria-hidden="true">+1</span>
	</div>
	<div>
		<h2>{m.omore_name()}</h2>
		<p>{m.omore_desc()}</p>
		<div class="row">
			<a class="btn" href={omoreHref}>{m.play()}</a>
			<span class="progress-note">{m.progress({ done: clearedOmore })}</span>
		</div>
	</div>
</section>

<section class="card game-card" aria-label={m.skip_name()} style="margin-top: 1.25rem;">
	<div class="thumb">
		<span class="skip-thumb" aria-hidden="true">2</span>
	</div>
	<div>
		<h2>{m.skip_name()}</h2>
		<p>{m.skip_desc()}</p>
		<div class="row">
			<a class="btn" href={skipHref}>{m.play()}</a>
			<span class="progress-note">{m.progress({ done: clearedSkip })}</span>
		</div>
	</div>
</section>

<section class="card game-card" aria-label={m.half_name()} style="margin-top: 1.25rem;">
	<div class="thumb">
		<span class="half-thumb" aria-hidden="true">½</span>
	</div>
	<div>
		<h2>{m.half_name()}</h2>
		<p>{m.half_desc()}</p>
		<div class="row">
			<a class="btn" href={halfHref}>{m.play()}</a>
			<span class="progress-note">{m.progress({ done: clearedHalf })}</span>
		</div>
	</div>
</section>

<section class="card game-card" aria-label={m.cmp_name()} style="margin-top: 1.25rem;">
	<div class="thumb">
		<span class="cmp-thumb" aria-hidden="true">&gt;</span>
	</div>
	<div>
		<h2>{m.cmp_name()}</h2>
		<p>{m.cmp_desc()}</p>
		<div class="row">
			<a class="btn" href={cmpHref}>{m.play()}</a>
			<span class="progress-note">{m.progress({ done: clearedCmp })}</span>
		</div>
	</div>
</section>

<section class="card game-card" aria-label={m.place_name()} style="margin-top: 1.25rem;">
	<div class="thumb">
		<span class="place-thumb" aria-hidden="true">10</span>
	</div>
	<div>
		<h2>{m.place_name()}</h2>
		<p>{m.place_desc()}</p>
		<div class="row">
			<a class="btn" href={placeHref}>{m.play()}</a>
			<span class="progress-note">{m.progress({ done: clearedPlace })}</span>
		</div>
	</div>
</section>

<section class="card game-card" aria-label={m.blend_name()} style="margin-top: 1.25rem;">
	<div class="thumb">
		<span class="blend-thumb" aria-hidden="true">c+at</span>
	</div>
	<div>
		<h2>{m.blend_name()}</h2>
		<p>{m.blend_desc()}</p>
		<div class="row">
			<a class="btn" href={blendHref}>{m.play()}</a>
			<span class="progress-note">{m.progress({ done: clearedBlend })}</span>
		</div>
	</div>
</section>

<section class="card game-card" aria-label={m.case_name()} style="margin-top: 1.25rem;">
	<div class="thumb">
		<span class="case-thumb" aria-hidden="true">Aa</span>
	</div>
	<div>
		<h2>{m.case_name()}</h2>
		<p>{m.case_desc()}</p>
		<div class="row">
			<a class="btn" href={caseHref}>{m.play()}</a>
			<span class="progress-note">{m.progress({ done: clearedCase })}</span>
		</div>
	</div>
</section>

<section class="card game-card" aria-label={m.spell_name()} style="margin-top: 1.25rem;">
	<div class="thumb">
		<span class="spell-thumb" aria-hidden="true">abc</span>
	</div>
	<div>
		<h2>{m.spell_name()}</h2>
		<p>{m.spell_desc()}</p>
		<div class="row">
			<a class="btn" href={spellHref}>{m.play()}</a>
			<span class="progress-note">{m.progress({ done: clearedSpell })}</span>
		</div>
	</div>
</section>

<section class="card game-card" aria-label={m.body_name()} style="margin-top: 1.25rem;">
	<div class="thumb">
		<span class="body-thumb" aria-hidden="true"><BodyArt /></span>
	</div>
	<div>
		<h2>{m.body_name()}</h2>
		<p>{m.body_desc()}</p>
		<div class="row">
			<a class="btn" href={bodyHref}>{m.play()}</a>
			<span class="progress-note">{m.progress({ done: clearedBody })}</span>
		</div>
	</div>
</section>

<section class="card game-card" aria-label={m.map_name()} style="margin-top: 1.25rem;">
	<div class="thumb">
		<span class="place-thumb" aria-hidden="true"><PlaceArt place="home" /></span>
	</div>
	<div>
		<h2>{m.map_name()}</h2>
		<p>{m.map_desc()}</p>
		<div class="row">
			<a class="btn" href={mapHref}>{m.play()}</a>
			<span class="progress-note">{m.progress({ done: clearedMap })}</span>
		</div>
	</div>
</section>

<section class="card game-card" aria-label={m.healthy_name()} style="margin-top: 1.25rem;">
	<div class="thumb">
		<span class="food-thumb" aria-hidden="true"><FoodArt food="apple" /></span>
	</div>
	<div>
		<h2>{m.healthy_name()}</h2>
		<p>{m.healthy_desc()}</p>
		<div class="row">
			<a class="btn" href={healthyHref}>{m.play()}</a>
			<span class="progress-note">{m.progress({ done: clearedHealthy })}</span>
		</div>
	</div>
</section>

<section class="card game-card" aria-label={m.above_name()} style="margin-top: 1.25rem;">
	<div class="thumb">
		<span class="above-thumb" aria-hidden="true"><FruitArt fruit="pear" /></span>
	</div>
	<div>
		<h2>{m.above_name()}</h2>
		<p>{m.above_desc()}</p>
		<div class="row">
			<a class="btn" href={aboveHref}>{m.play()}</a>
			<span class="progress-note">{m.progress({ done: clearedAbove })}</span>
		</div>
	</div>
</section>

<section class="card game-card" aria-label={m.set_name()} style="margin-top: 1.25rem;">
	<div class="thumb">
		<span class="set-thumb" aria-hidden="true"><SetFaceArt face="star" /></span>
	</div>
	<div>
		<h2>{m.set_name()}</h2>
		<p>{m.set_desc()}</p>
		<div class="row">
			<a class="btn" href={setHref}>{m.play()}</a>
			<span class="progress-note">{m.progress({ done: clearedSet })}</span>
		</div>
	</div>
</section>

<section class="card game-card" aria-label={m.path_name()} style="margin-top: 1.25rem;">
	<div class="thumb">
		<span class="path-thumb" aria-hidden="true"><PathArt layout="straight-right" /></span>
	</div>
	<div>
		<h2>{m.path_name()}</h2>
		<p>{m.path_desc()}</p>
		<div class="row">
			<a class="btn" href={pathGameHref}>{m.play()}</a>
			<span class="progress-note">{m.progress({ done: clearedPath })}</span>
		</div>
	</div>
</section>

<section class="card game-card" aria-label={m.money_name()} style="margin-top: 1.25rem;">
	<div class="thumb">
		<span class="coin-thumb" aria-hidden="true"><CoinArt value={5} /></span>
	</div>
	<div>
		<h2>{m.money_name()}</h2>
		<p>{m.money_desc()}</p>
		<div class="row">
			<a class="btn" href={moneyHref}>{m.play()}</a>
			<span class="progress-note">{m.progress({ done: clearedMoney })}</span>
		</div>
	</div>
</section>

<section class="card game-card" aria-label={m.dress_name()} style="margin-top: 1.25rem;">
	<div class="thumb">
		<span class="clothes-thumb" aria-hidden="true"><ClothesArt clothes="coat" /></span>
	</div>
	<div>
		<h2>{m.dress_name()}</h2>
		<p>{m.dress_desc()}</p>
		<div class="row">
			<a class="btn" href={dressHref}>{m.play()}</a>
			<span class="progress-note">{m.progress({ done: clearedDress })}</span>
		</div>
	</div>
</section>

<section class="card game-card" aria-label={m.heavy_name()} style="margin-top: 1.25rem;">
	<div class="thumb">
		<span class="weight-thumb" aria-hidden="true"><WeightArt object="rock" /></span>
	</div>
	<div>
		<h2>{m.heavy_name()}</h2>
		<p>{m.heavy_desc()}</p>
		<div class="row">
			<a class="btn" href={heavyHref}>{m.play()}</a>
			<span class="progress-note">{m.progress({ done: clearedHeavy })}</span>
		</div>
	</div>
</section>

<section class="card game-card" aria-label={m.homes_name()} style="margin-top: 1.25rem;">
	<div class="thumb">
		<span class="homes-thumb" aria-hidden="true"><HomeAnimalArt animal="bird" /></span>
	</div>
	<div>
		<h2>{m.homes_name()}</h2>
		<p>{m.homes_desc()}</p>
		<div class="row">
			<a class="btn" href={homesHref}>{m.play()}</a>
			<span class="progress-note">{m.progress({ done: clearedHomes })}</span>
		</div>
	</div>
</section>

<section class="card game-card" aria-label={m.daynight_name()} style="margin-top: 1.25rem;">
	<div class="thumb">
		<span class="daynight-thumb" aria-hidden="true"><DayNightArt scene="sunny" /></span>
	</div>
	<div>
		<h2>{m.daynight_name()}</h2>
		<p>{m.daynight_desc()}</p>
		<div class="row">
			<a class="btn" href={dayNightHref}>{m.play()}</a>
			<span class="progress-note">{m.progress({ done: clearedDayNight })}</span>
		</div>
	</div>
</section>

<section class="card game-card" aria-label={m.inout_name()} style="margin-top: 1.25rem;">
	<div class="thumb">
		<span class="inout-thumb" aria-hidden="true"><InsideOutsideArt scene="bedroom" /></span>
	</div>
	<div>
		<h2>{m.inout_name()}</h2>
		<p>{m.inout_desc()}</p>
		<div class="row">
			<a class="btn" href={inOutHref}>{m.play()}</a>
			<span class="progress-note">{m.progress({ done: clearedInOut })}</span>
		</div>
	</div>
</section>

<section class="card game-card" aria-label={m.habitat_name()} style="margin-top: 1.25rem;">
	<div class="thumb">
		<span class="habitat-thumb" aria-hidden="true"><LandWaterAirArt subject="bird" /></span>
	</div>
	<div>
		<h2>{m.habitat_name()}</h2>
		<p>{m.habitat_desc()}</p>
		<div class="row">
			<a class="btn" href={habitatHref}>{m.play()}</a>
			<span class="progress-note">{m.progress({ done: clearedHabitat })}</span>
		</div>
	</div>
</section>

<section class="card game-card" aria-label={m.wetdry_name()} style="margin-top: 1.25rem;">
	<div class="thumb">
		<span class="wetdry-thumb" aria-hidden="true"><WetDryArt scene="puddle" /></span>
	</div>
	<div>
		<h2>{m.wetdry_name()}</h2>
		<p>{m.wetdry_desc()}</p>
		<div class="row">
			<a class="btn" href={wetDryHref}>{m.play()}</a>
			<span class="progress-note">{m.progress({ done: clearedWetDry })}</span>
		</div>
	</div>
</section>

<section class="card game-card" aria-label={m.plantani_name()} style="margin-top: 1.25rem;">
	<div class="thumb"><span class="plantani-thumb" aria-hidden="true"><PlantAnimalArt subject="flower" /></span></div>
	<div><h2>{m.plantani_name()}</h2><p>{m.plantani_desc()}</p>
		<div class="row"><a class="btn" href={plantHref}>{m.play()}</a><span class="progress-note">{m.progress({ done: clearedPlant })}</span></div></div>
</section>
<section class="card game-card" aria-label={m.sinkfloat_name()} style="margin-top: 1.25rem;">
	<div class="thumb"><span class="sinkfloat-thumb" aria-hidden="true"><SinkFloatTank object="leaf" /></span></div>
	<div><h2>{m.sinkfloat_name()}</h2><p>{m.sinkfloat_desc()}</p>
		<div class="row"><a class="btn" href={sinkHref}>{m.play()}</a><span class="progress-note">{m.progress({ done: clearedSink })}</span></div></div>
</section>
<section class="card game-card" aria-label={m.dayjobs_name()} style="margin-top: 1.25rem;">
	<div class="thumb"><span class="dayjobs-thumb" aria-hidden="true"><DayJobsArt scene="bandage" /></span></div>
	<div><h2>{m.dayjobs_name()}</h2><p>{m.dayjobs_desc()}</p>
		<div class="row"><a class="btn" href={jobsHref}>{m.play()}</a><span class="progress-note">{m.progress({ done: clearedJobs })}</span></div></div>
</section>
<section class="card game-card" aria-label={m.recycle_name()} style="margin-top: 1.25rem;">
	<div class="thumb"><span class="recycle-thumb" aria-hidden="true"><RecycleArt item="newspaper" /></span></div>
	<div><h2>{m.recycle_name()}</h2><p>{m.recycle_desc()}</p>
		<div class="row"><a class="btn" href={recycleHref}>{m.play()}</a><span class="progress-note">{m.progress({ done: clearedRecycle })}</span></div></div>
</section>
<section class="card game-card" aria-label={m.hunger_name()} style="margin-top: 1.25rem;">
	<div class="thumb"><span class="hunger-thumb" aria-hidden="true"><HungryThirstyArt cue="apple" /></span></div>
	<div><h2>{m.hunger_name()}</h2><p>{m.hunger_desc()}</p>
		<div class="row"><a class="btn" href={hungerHref}>{m.play()}</a><span class="progress-note">{m.progress({ done: clearedHunger })}</span></div></div>
</section>
<section class="card game-card" aria-label={m.safe_name()} style="margin-top: 1.25rem;">
	<div class="thumb"><span class="safe-thumb" aria-hidden="true"><SafeChoiceArt scene="crosswalk" /></span></div>
	<div><h2>{m.safe_name()}</h2><p>{m.safe_desc()}</p>
		<div class="row"><a class="btn" href={safeHref}>{m.play()}</a><span class="progress-note">{m.progress({ done: clearedSafe })}</span></div></div>
</section>
<section class="card game-card" aria-label={m.senses_name()} style="margin-top: 1.25rem;">
	<div class="thumb"><span class="senses-thumb" aria-hidden="true"><FiveSensesArt cue="rainbow" /></span></div>
	<div><h2>{m.senses_name()}</h2><p>{m.senses_desc()}</p>
		<div class="row"><a class="btn" href={sensesHref}>{m.play()}</a><span class="progress-note">{m.progress({ done: clearedSenses })}</span></div></div>
</section>
<section class="card game-card" aria-label={m.samenum_name()} style="margin-top: 1.25rem;">
	<div class="thumb"><span class="samenum-thumb" aria-hidden="true"><FruitArt fruit="apple" /></span></div>
	<div><h2>{m.samenum_name()}</h2><p>{m.samenum_desc()}</p>
		<div class="row"><a class="btn" href={sameNumHref}>{m.play()}</a><span class="progress-note">{m.progress({ done: clearedSameNum })}</span></div></div>
</section>
<section class="card game-card" aria-label={m.numba_name()} style="margin-top: 1.25rem;">
	<div class="thumb"><span class="numba-thumb" aria-hidden="true">5</span></div>
	<div><h2>{m.numba_name()}</h2><p>{m.numba_desc()}</p>
		<div class="row"><a class="btn" href={numBaHref}>{m.play()}</a><span class="progress-note">{m.progress({ done: clearedNumBa })}</span></div></div>
</section>
<section class="card game-card" aria-label={m.maketen_name()} style="margin-top: 1.25rem;">
	<div class="thumb"><span class="maketen-thumb" aria-hidden="true">10</span></div>
	<div><h2>{m.maketen_name()}</h2><p>{m.maketen_desc()}</p>
		<div class="row"><a class="btn" href={makeTenHref}>{m.play()}</a><span class="progress-note">{m.progress({ done: clearedMakeTen })}</span></div></div>
</section>
<section class="card game-card" aria-label={m.firstsound_name()} style="margin-top: 1.25rem;">
	<div class="thumb"><span class="firstsound-thumb" aria-hidden="true"><FirstSoundArt word="sun" /></span></div>
	<div><h2>{m.firstsound_name()}</h2><p>{m.firstsound_desc()}</p>
		<div class="row"><a class="btn" href={firstSoundHref}>{m.play()}</a><span class="progress-note">{m.progress({ done: clearedFirstSound })}</span></div></div>
</section>
<section class="card game-card" aria-label={m.wordlen_name()} style="margin-top: 1.25rem;">
	<div class="thumb"><span class="wordlen-thumb" aria-hidden="true">cat</span></div>
	<div><h2>{m.wordlen_name()}</h2><p>{m.wordlen_desc()}</p>
		<div class="row"><a class="btn" href={wordLenHref}>{m.play()}</a><span class="progress-note">{m.progress({ done: clearedWordLen })}</span></div></div>
</section>
<section class="card game-card" aria-label={m.sentord_name()} style="margin-top: 1.25rem;">
	<div class="thumb"><span class="sentord-thumb" aria-hidden="true"><SentenceOrderArt story="wash" step={0} /></span></div>
	<div><h2>{m.sentord_name()}</h2><p>{m.sentord_desc()}</p>
		<div class="row"><a class="btn" href={sentOrdHref}>{m.play()}</a><span class="progress-note">{m.progress({ done: clearedSentOrd })}</span></div></div>
</section>
<section class="card game-card" aria-label={m.nearfar_name()} style="margin-top: 1.25rem;">
	<div class="thumb"><span class="nearfar-thumb" aria-hidden="true"><NearFarArt scene="ball-near" /></span></div>
	<div><h2>{m.nearfar_name()}</h2><p>{m.nearfar_desc()}</p>
		<div class="row"><a class="btn" href={nearFarHref}>{m.play()}</a><span class="progress-note">{m.progress({ done: clearedNearFar })}</span></div></div>
</section>
<section class="card game-card" aria-label={m.openclosed_name()} style="margin-top: 1.25rem;">
	<div class="thumb"><span class="openclosed-thumb" aria-hidden="true"><OpenClosedArt subject="door-open" /></span></div>
	<div><h2>{m.openclosed_name()}</h2><p>{m.openclosed_desc()}</p>
		<div class="row"><a class="btn" href={openHref}>{m.play()}</a><span class="progress-note">{m.progress({ done: clearedOpen })}</span></div></div>
</section>
<section class="card game-card" aria-label={m.updown_name()} style="margin-top: 1.25rem;">
	<div class="thumb"><span class="updown-thumb" aria-hidden="true"><UpDownArt scene="balloon" /></span></div>
	<div><h2>{m.updown_name()}</h2><p>{m.updown_desc()}</p>
		<div class="row"><a class="btn" href={upDownHref}>{m.play()}</a><span class="progress-note">{m.progress({ done: clearedUpDown })}</span></div></div>
</section>

<section class="card game-card" aria-label={m.hotcold_name()} style="margin-top: 1.25rem;">
	<div class="thumb"><span class="batch25-thumb" aria-hidden="true"><HotColdArt scene="sun" /></span></div>
	<div><h2>{m.hotcold_name()}</h2><p>{m.hotcold_desc()}</p>
		<div class="row"><a class="btn" href={hotColdHref}>{m.play()}</a><span class="progress-note">{m.progress({ done: clearedHotCold })}</span></div></div>
</section>
<section class="card game-card" aria-label={m.loudquiet_name()} style="margin-top: 1.25rem;">
	<div class="thumb"><span class="batch25-thumb" aria-hidden="true"><BatchSceneArt game="loud-quiet" scene="drum" /></span></div>
	<div><h2>{m.loudquiet_name()}</h2><p>{m.loudquiet_desc()}</p>
		<div class="row"><a class="btn" href={loudQuietHref}>{m.play()}</a><span class="progress-note">{m.progress({ done: clearedLoudQuiet })}</span></div></div>
</section>
<section class="card game-card" aria-label={m.fullempty_name()} style="margin-top: 1.25rem;">
	<div class="thumb"><span class="batch25-thumb" aria-hidden="true"><BatchSceneArt game="full-empty" scene="bowl-full" /></span></div>
	<div><h2>{m.fullempty_name()}</h2><p>{m.fullempty_desc()}</p>
		<div class="row"><a class="btn" href={fullEmptyHref}>{m.play()}</a><span class="progress-note">{m.progress({ done: clearedFullEmpty })}</span></div></div>
</section>
<section class="card game-card" aria-label={m.stopgo_name()} style="margin-top: 1.25rem;">
	<div class="thumb"><span class="batch25-thumb" aria-hidden="true"><BatchSceneArt game="stop-go" scene="red-light" /></span></div>
	<div><h2>{m.stopgo_name()}</h2><p>{m.stopgo_desc()}</p>
		<div class="row"><a class="btn" href={stopGoHref}>{m.play()}</a><span class="progress-note">{m.progress({ done: clearedStopGo })}</span></div></div>
</section>
<section class="card game-card" aria-label={m.living_name()} style="margin-top: 1.25rem;">
	<div class="thumb"><span class="batch25-thumb" aria-hidden="true"><BatchSceneArt game="living-nonliving" scene="cat" /></span></div>
	<div><h2>{m.living_name()}</h2><p>{m.living_desc()}</p>
		<div class="row"><a class="btn" href={livingHref}>{m.play()}</a><span class="progress-note">{m.progress({ done: clearedLiving })}</span></div></div>
</section>
<section class="card game-card" aria-label={m.hardsoft_name()} style="margin-top: 1.25rem;">
	<div class="thumb"><span class="batch25-thumb" aria-hidden="true"><BatchSceneArt game="hard-soft" scene="rock" /></span></div>
	<div><h2>{m.hardsoft_name()}</h2><p>{m.hardsoft_desc()}</p>
		<div class="row"><a class="btn" href={hardSoftHref}>{m.play()}</a><span class="progress-note">{m.progress({ done: clearedHardSoft })}</span></div></div>
</section>
<section class="card game-card" aria-label={m.roughsmooth_name()} style="margin-top: 1.25rem;">
	<div class="thumb"><span class="batch25-thumb" aria-hidden="true"><BatchSceneArt game="rough-smooth" scene="bark" /></span></div>
	<div><h2>{m.roughsmooth_name()}</h2><p>{m.roughsmooth_desc()}</p>
		<div class="row"><a class="btn" href={roughHref}>{m.play()}</a><span class="progress-note">{m.progress({ done: clearedRough })}</span></div></div>
</section>
<section class="card game-card" aria-label={m.objsize_name()} style="margin-top: 1.25rem;">
	<div class="thumb"><span class="batch25-thumb" aria-hidden="true"><BatchSceneArt game="object-size" scene="elephant" /></span></div>
	<div><h2>{m.objsize_name()}</h2><p>{m.objsize_desc()}</p>
		<div class="row"><a class="btn" href={objSizeHref}>{m.play()}</a><span class="progress-note">{m.progress({ done: clearedObjSize })}</span></div></div>
</section>
<section class="card game-card" aria-label={m.newold_name()} style="margin-top: 1.25rem;">
	<div class="thumb"><span class="batch25-thumb" aria-hidden="true"><BatchSceneArt game="new-old" scene="shiny-shoe" /></span></div>
	<div><h2>{m.newold_name()}</h2><p>{m.newold_desc()}</p>
		<div class="row"><a class="btn" href={newOldHref}>{m.play()}</a><span class="progress-note">{m.progress({ done: clearedNewOld })}</span></div></div>
</section>
<section class="card game-card" aria-label={m.morneve_name()} style="margin-top: 1.25rem;">
	<div class="thumb"><span class="batch25-thumb" aria-hidden="true"><BatchSceneArt game="morning-evening" scene="sunrise" /></span></div>
	<div><h2>{m.morneve_name()}</h2><p>{m.morneve_desc()}</p>
		<div class="row"><a class="btn" href={mornEveHref}>{m.play()}</a><span class="progress-note">{m.progress({ done: clearedMornEve })}</span></div></div>
</section>
<section class="card game-card" aria-label={m.cleandirty_name()} style="margin-top: 1.25rem;">
	<div class="thumb"><span class="batch25-thumb" aria-hidden="true"><BatchSceneArt game="clean-dirty" scene="clean-plate" /></span></div>
	<div><h2>{m.cleandirty_name()}</h2><p>{m.cleandirty_desc()}</p>
		<div class="row"><a class="btn" href={cleanHref}>{m.play()}</a><span class="progress-note">{m.progress({ done: clearedClean })}</span></div></div>
</section>
<section class="card game-card" aria-label={m.sharekeep_name()} style="margin-top: 1.25rem;">
	<div class="thumb"><span class="batch25-thumb" aria-hidden="true"><BatchSceneArt game="share-keep" scene="two-kids-toy" /></span></div>
	<div><h2>{m.sharekeep_name()}</h2><p>{m.sharekeep_desc()}</p>
		<div class="row"><a class="btn" href={shareHref}>{m.play()}</a><span class="progress-note">{m.progress({ done: clearedShare })}</span></div></div>
</section>
<section class="card game-card" aria-label={m.askgrab_name()} style="margin-top: 1.25rem;">
	<div class="thumb"><span class="batch25-thumb" aria-hidden="true"><BatchSceneArt game="ask-grab" scene="raise-hand" /></span></div>
	<div><h2>{m.askgrab_name()}</h2><p>{m.askgrab_desc()}</p>
		<div class="row"><a class="btn" href={askHref}>{m.play()}</a><span class="progress-note">{m.progress({ done: clearedAsk })}</span></div></div>
</section>
<section class="card game-card" aria-label={m.magnet_name()} style="margin-top: 1.25rem;">
	<div class="thumb"><span class="batch25-thumb" aria-hidden="true"><BatchSceneArt game="magnet-or-not" scene="paperclip" /></span></div>
	<div><h2>{m.magnet_name()}</h2><p>{m.magnet_desc()}</p>
		<div class="row"><a class="btn" href={magnetHref}>{m.play()}</a><span class="progress-note">{m.progress({ done: clearedMagnet })}</span></div></div>
</section>
<section class="card game-card" aria-label={m.solidliq_name()} style="margin-top: 1.25rem;">
	<div class="thumb"><span class="batch25-thumb" aria-hidden="true"><BatchSceneArt game="solid-liquid" scene="block" /></span></div>
	<div><h2>{m.solidliq_name()}</h2><p>{m.solidliq_desc()}</p>
		<div class="row"><a class="btn" href={solidHref}>{m.play()}</a><span class="progress-note">{m.progress({ done: clearedSolid })}</span></div></div>
</section>
<section class="card game-card" aria-label={m.dna_name()} style="margin-top: 1.25rem;">
	<div class="thumb"><span class="batch25-thumb" aria-hidden="true"><BatchSceneArt game="day-night-animal" scene="rooster" /></span></div>
	<div><h2>{m.dna_name()}</h2><p>{m.dna_desc()}</p>
		<div class="row"><a class="btn" href={dnaHref}>{m.play()}</a><span class="progress-note">{m.progress({ done: clearedDna })}</span></div></div>
</section>
<section class="card game-card" aria-label={m.doublenum_name()} style="margin-top: 1.25rem;">
	<div class="thumb"><span class="batch25-thumb num" aria-hidden="true">×2</span></div>
	<div><h2>{m.doublenum_name()}</h2><p>{m.doublenum_desc()}</p>
		<div class="row"><a class="btn" href={doubleHref}>{m.play()}</a><span class="progress-note">{m.progress({ done: clearedDouble })}</span></div></div>
</section>
<section class="card game-card" aria-label={m.evenodd_name()} style="margin-top: 1.25rem;">
	<div class="thumb"><span class="batch25-thumb num" aria-hidden="true">2</span></div>
	<div><h2>{m.evenodd_name()}</h2><p>{m.evenodd_desc()}</p>
		<div class="row"><a class="btn" href={evenOddHref}>{m.play()}</a><span class="progress-note">{m.progress({ done: clearedEvenOdd })}</span></div></div>
</section>
<section class="card game-card" aria-label={m.howmore_name()} style="margin-top: 1.25rem;">
	<div class="thumb"><span class="batch25-thumb num" aria-hidden="true">+?</span></div>
	<div><h2>{m.howmore_name()}</h2><p>{m.howmore_desc()}</p>
		<div class="row"><a class="btn" href={howMoreHref}>{m.play()}</a><span class="progress-note">{m.progress({ done: clearedHowMore })}</span></div></div>
</section>
<section class="card game-card" aria-label={m.lastsound_name()} style="margin-top: 1.25rem;">
	<div class="thumb"><span class="batch25-thumb" aria-hidden="true"><FirstSoundArt word="cat" /></span></div>
	<div><h2>{m.lastsound_name()}</h2><p>{m.lastsound_desc()}</p>
		<div class="row"><a class="btn" href={lastSoundHref}>{m.play()}</a><span class="progress-note">{m.progress({ done: clearedLastSound })}</span></div></div>
</section>
<section class="card game-card" aria-label={m.realword_name()} style="margin-top: 1.25rem;">
	<div class="thumb"><span class="batch25-thumb num" aria-hidden="true">Aa</span></div>
	<div><h2>{m.realword_name()}</h2><p>{m.realword_desc()}</p>
		<div class="row"><a class="btn" href={realWordHref}>{m.play()}</a><span class="progress-note">{m.progress({ done: clearedRealWord })}</span></div></div>
</section>
<section class="card game-card" aria-label={m.wop_name()} style="margin-top: 1.25rem;">
	<div class="thumb"><span class="batch25-thumb" aria-hidden="true"><KindArt face="cat" /></span></div>
	<div><h2>{m.wop_name()}</h2><p>{m.wop_desc()}</p>
		<div class="row"><a class="btn" href={wopHref}>{m.play()}</a><span class="progress-note">{m.progress({ done: clearedWop })}</span></div></div>
</section>
<section class="card game-card" aria-label={m.inonunder_name()} style="margin-top: 1.25rem;">
	<div class="thumb"><span class="batch25-thumb" aria-hidden="true"><BatchSceneArt game="in-on-under" scene="ball-in" /></span></div>
	<div><h2>{m.inonunder_name()}</h2><p>{m.inonunder_desc()}</p>
		<div class="row"><a class="btn" href={inOnHref}>{m.play()}</a><span class="progress-note">{m.progress({ done: clearedInOn })}</span></div></div>
</section>
<section class="card game-card" aria-label={m.frontbehind_name()} style="margin-top: 1.25rem;">
	<div class="thumb"><span class="batch25-thumb" aria-hidden="true"><BatchSceneArt game="front-behind" scene="ball-front" /></span></div>
	<div><h2>{m.frontbehind_name()}</h2><p>{m.frontbehind_desc()}</p>
		<div class="row"><a class="btn" href={frontHref}>{m.play()}</a><span class="progress-note">{m.progress({ done: clearedFront })}</span></div></div>
</section>
<section class="card game-card" aria-label={m.pushpull_name()} style="margin-top: 1.25rem;">
	<div class="thumb"><span class="batch25-thumb" aria-hidden="true"><BatchSceneArt game="push-pull" scene="push-door" /></span></div>
	<div><h2>{m.pushpull_name()}</h2><p>{m.pushpull_desc()}</p>
		<div class="row"><a class="btn" href={pushHref}>{m.play()}</a><span class="progress-note">{m.progress({ done: clearedPush })}</span></div></div>
</section>


