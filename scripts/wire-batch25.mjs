#!/usr/bin/env node
import { readFileSync, writeFileSync, appendFileSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const ids = [
	'hot-cold', 'loud-quiet', 'full-empty', 'stop-go', 'living-nonliving',
	'hard-soft', 'rough-smooth', 'object-size', 'new-old', 'morning-evening',
	'clean-dirty', 'share-keep', 'ask-grab', 'magnet-or-not', 'solid-liquid',
	'day-night-animal', 'double-number', 'even-odd', 'how-many-more',
	'last-sound', 'real-word', 'word-or-picture', 'in-on-under', 'front-behind', 'push-pull'
];

let progress = readFileSync(join(root, 'src/lib/progress.ts'), 'utf8');
if (!progress.includes("'hot-cold'")) {
	progress = progress.replace(
		"| 'up-down';",
		`| 'up-down'\n${ids.map((id) => `\t| '${id}'`).join('\n')};`
	);
	progress = progress.replace(
		"'up-down': GameProgress;\n}",
		`'up-down': GameProgress;\n${ids.map((id) => `\t'${id}': GameProgress;`).join('\n')}\n}`
	);
	progress = progress.replace(
		"'up-down': { cleared: 0 }\n\t};",
		`'up-down': { cleared: 0 },\n${ids.map((id) => `\t\t'${id}': { cleared: 0 }`).join(',\n')}\n\t};`
	);
	progress = progress.replace(
		"'up-down': sanitizeGame(games['up-down'])\n\t\t};",
		`'up-down': sanitizeGame(games['up-down']),\n${ids
			.map((id) => `\t\t\t'${id}': sanitizeGame(games['${id}'])`)
			.join(',\n')}\n\t\t};`
	);
	writeFileSync(join(root, 'src/lib/progress.ts'), progress);
	console.log('progress');
}

let ptest = readFileSync(join(root, 'src/lib/progress.test.ts'), 'utf8');
if (!ptest.includes("'hot-cold'")) {
	ptest = ptest.replaceAll(
		"'up-down': { cleared: 0 }",
		`'up-down': { cleared: 0 },\n${ids.map((id) => `\t\t\t'${id}': { cleared: 0 }`).join(',\n')}`
	);
	writeFileSync(join(root, 'src/lib/progress.test.ts'), ptest);
	console.log('progress.test');
}

const en = {
	hotcold_name: 'Hot or cold',
	hotcold_desc: 'See a scene. Tap hot or cold.',
	hotcold_prompt: 'Is it hot or cold?',
	hotcold_hint: 'Sun and soup are hot. Snow and ice are cold.',
	hotcold_hot: 'Hot',
	hotcold_cold: 'Cold',
	loudquiet_name: 'Loud or quiet',
	loudquiet_desc: 'See a sound cue. Tap loud or quiet.',
	loudquiet_prompt: 'Is it loud or quiet?',
	loudquiet_hint: 'Drums are loud. Whispering is quiet.',
	loudquiet_loud: 'Loud',
	loudquiet_quiet: 'Quiet',
	fullempty_name: 'Full or empty',
	fullempty_desc: 'See a bowl or glass. Tap full or empty.',
	fullempty_prompt: 'Is it full or empty?',
	fullempty_hint: 'Full has something inside. Empty does not.',
	fullempty_full: 'Full',
	fullempty_empty: 'Empty',
	stopgo_name: 'Stop or go',
	stopgo_desc: 'See a light or sign. Tap stop or go.',
	stopgo_prompt: 'Stop or go?',
	stopgo_hint: 'Red means stop. Green means go.',
	stopgo_stop: 'Stop',
	stopgo_go: 'Go',
	living_name: 'Living or not',
	living_desc: 'See a thing. Tap living or not living.',
	living_prompt: 'Is it living?',
	living_hint: 'Animals and plants are living. Rocks and cars are not.',
	living_living: 'Living',
	living_nonliving: 'Not living',
	hardsoft_name: 'Hard or soft',
	hardsoft_desc: 'See an object. Tap hard or soft.',
	hardsoft_prompt: 'Is it hard or soft?',
	hardsoft_hint: 'Rocks are hard. Pillows are soft.',
	hardsoft_hard: 'Hard',
	hardsoft_soft: 'Soft',
	roughsmooth_name: 'Rough or smooth',
	roughsmooth_desc: 'See a surface. Tap rough or smooth.',
	roughsmooth_prompt: 'Is it rough or smooth?',
	roughsmooth_hint: 'Bark is rough. Glass is smooth.',
	roughsmooth_rough: 'Rough',
	roughsmooth_smooth: 'Smooth',
	objsize_name: 'Big or small',
	objsize_desc: 'See one thing. Tap big or small.',
	objsize_prompt: 'Is it big or small?',
	objsize_hint: 'Elephants are big. Ants are small.',
	objsize_big: 'Big',
	objsize_small: 'Small',
	newold_name: 'New or old',
	newold_desc: 'See a thing. Tap new or old.',
	newold_prompt: 'Is it new or old?',
	newold_hint: 'Shiny and fresh look new. Worn things look old.',
	newold_new: 'New',
	newold_old: 'Old',
	morneve_name: 'Morning or evening',
	morneve_desc: 'See a routine. Tap morning or evening.',
	morneve_prompt: 'Morning or evening?',
	morneve_hint: 'Breakfast is morning. Pajamas are evening.',
	morneve_morning: 'Morning',
	morneve_evening: 'Evening',
	cleandirty_name: 'Clean or dirty',
	cleandirty_desc: 'See a plate or shirt. Tap clean or dirty.',
	cleandirty_prompt: 'Is it clean or dirty?',
	cleandirty_hint: 'Soap makes things clean. Mud makes them dirty.',
	cleandirty_clean: 'Clean',
	cleandirty_dirty: 'Dirty',
	sharekeep_name: 'Share or keep',
	sharekeep_desc: 'See a kind choice. Tap share or keep.',
	sharekeep_prompt: 'Share or keep?',
	sharekeep_hint: 'Sharing means taking turns. Some things are just yours.',
	sharekeep_share: 'Share',
	sharekeep_keep: 'Keep',
	askgrab_name: 'Ask or grab',
	askgrab_desc: 'See a choice. Tap ask or grab.',
	askgrab_prompt: 'Ask or grab?',
	askgrab_hint: 'Asking is kind. Grabbing is not.',
	askgrab_ask: 'Ask',
	askgrab_grab: 'Grab',
	magnet_name: 'Magnet or not',
	magnet_desc: 'See an object. Tap if a magnet pulls it.',
	magnet_prompt: 'Will a magnet pull it?',
	magnet_hint: 'Metal like a paperclip sticks. Wood and paper do not.',
	magnet_yes: 'Magnet',
	magnet_no: 'Not magnet',
	solidliq_name: 'Solid or liquid',
	solidliq_desc: 'See matter. Tap solid or liquid.',
	solidliq_prompt: 'Solid or liquid?',
	solidliq_hint: 'Blocks are solid. Water is liquid.',
	solidliq_solid: 'Solid',
	solidliq_liquid: 'Liquid',
	dna_name: 'Day or night animal',
	dna_desc: 'See an animal. Tap day or night.',
	dna_prompt: 'Day animal or night animal?',
	dna_hint: 'Roosters are awake by day. Owls are awake at night.',
	dna_day: 'Day',
	dna_night: 'Night',
	doublenum_name: 'Double it',
	doublenum_desc: 'See a number. Tap what is double.',
	doublenum_prompt: 'What is double?',
	doublenum_hint: 'Double means two groups of that number.',
	evenodd_name: 'Even or odd',
	evenodd_desc: 'Count the pile. Tap even or odd.',
	evenodd_prompt: 'Even or odd?',
	evenodd_hint: 'Even numbers pair up. Odd numbers have one left over.',
	evenodd_even: 'Even',
	evenodd_odd: 'Odd',
	howmore_name: 'How many more?',
	howmore_desc: 'Two piles. Tap how many more.',
	howmore_prompt: 'How many more?',
	howmore_hint: 'Count both piles. Find the difference.',
	lastsound_name: 'Last sound',
	lastsound_desc: 'See a picture. Tap the ending sound.',
	lastsound_prompt: 'What sound does it end with?',
	lastsound_hint: 'Say the word slowly. Listen to the last sound.',
	realword_name: 'Real or nonsense',
	realword_desc: 'See a word. Tap real or nonsense.',
	realword_prompt: 'Is it a real word?',
	realword_hint: 'Real words mean something. Nonsense words are made up.',
	realword_real: 'Real',
	realword_nonsense: 'Nonsense',
	wop_name: 'Word or picture',
	wop_desc: 'Match the word to the picture — or the picture to the word.',
	wop_prompt_word: 'Which picture matches the word?',
	wop_prompt_pic: 'Which word matches the picture?',
	wop_hint: 'Look carefully. Find the pair that belongs together.',
	inonunder_name: 'In, on, under',
	inonunder_desc: 'See where it is. Tap in, on, or under.',
	inonunder_prompt: 'Where is it?',
	inonunder_hint: 'In is inside. On is on top. Under is below.',
	inonunder_in: 'In',
	inonunder_on: 'On',
	inonunder_under: 'Under',
	frontbehind_name: 'Front or behind',
	frontbehind_desc: 'See two things. Tap front or behind.',
	frontbehind_prompt: 'Is it in front or behind?',
	frontbehind_hint: 'Front is closer to you. Behind is hidden in back.',
	frontbehind_front: 'Front',
	frontbehind_behind: 'Behind',
	pushpull_name: 'Push or pull',
	pushpull_desc: 'See a motion. Tap push or pull.',
	pushpull_prompt: 'Push or pull?',
	pushpull_hint: 'Push moves away from you. Pull brings it closer.',
	pushpull_push: 'Push',
	pushpull_pull: 'Pull'
};

function appendMessages(file) {
	const path = join(root, file);
	const obj = JSON.parse(readFileSync(path, 'utf8'));
	if (obj.hotcold_name) {
		console.log('skip', file);
		return;
	}
	Object.assign(obj, en);
	writeFileSync(path, JSON.stringify(obj, null, '\t') + '\n');
	console.log('messages', file);
}

for (const f of ['messages/en.json', 'messages/it.json', 'messages/ro.json', 'messages/de.json']) {
	appendMessages(f);
}

// Shelf + CSS via python-like patch in node
let page = readFileSync(join(root, 'src/routes/+page.svelte'), 'utf8');
if (!page.includes('HotColdArt')) {
	page = page.replace(
		"import WetDryArt from '#lib/components/WetDryArt.svelte';",
		`import WetDryArt from '#lib/components/WetDryArt.svelte';
	import HotColdArt from '#lib/components/HotColdArt.svelte';
	import BatchSceneArt from '#lib/components/BatchSceneArt.svelte';
	import FirstSoundArt from '#lib/components/FirstSoundArt.svelte';`
	);
	// FirstSoundArt may already be imported from batch16 - check
	if ((page.match(/FirstSoundArt/g) || []).length > 2) {
		page = page.replace(
			"\timport FirstSoundArt from '#lib/components/FirstSoundArt.svelte';\n\timport FirstSoundArt from '#lib/components/FirstSoundArt.svelte';",
			"\timport FirstSoundArt from '#lib/components/FirstSoundArt.svelte';"
		);
	}
	const clearedBlock = ids
		.map((id) => {
			const camel = id.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
			return `\tlet cleared${camel[0].toUpperCase() + camel.slice(1)} = $state(0);`;
		})
		.join('\n');
	// simpler cleared vars
	const clearedVars = `	let clearedHotCold = $state(0);
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
`;
	page = page.replace('\tlet clearedUpDown = $state(0);\n', '\tlet clearedUpDown = $state(0);\n' + clearedVars);

	const hrefs = `	const hotColdHref = $derived(localizeHref('/play/hot-cold', { locale }));
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
`;
	page = page.replace(
		"\tconst upDownHref = $derived(localizeHref('/play/up-down', { locale }));\n",
		"\tconst upDownHref = $derived(localizeHref('/play/up-down', { locale }));\n" + hrefs
	);

	const onmount = `
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
`;
	page = page.replace(
		"\t\tclearedUpDown = progress['up-down'].cleared;\n\t});",
		"\t\tclearedUpDown = progress['up-down'].cleared;" + onmount + '\t});'
	);

	const cards = `
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
`;

	const marker = 'aria-label={m.updown_name()}';
	const idx = page.indexOf(marker);
	if (idx === -1) throw new Error('updown card missing');
	const end = page.indexOf('</section>', idx) + '</section>'.length;
	page = page.slice(0, end) + '\n' + cards + page.slice(end);
	writeFileSync(join(root, 'src/routes/+page.svelte'), page);
	console.log('shelf');
}

appendFileSync(
	join(root, 'src/app.css'),
	`
.batch25-thumb {
	display: grid; place-items: center; width: 3.6rem; height: 3.6rem;
	border-radius: 0.85rem; overflow: hidden; border: 3px solid #a09078;
	background: linear-gradient(160deg, #f5efe4, #d8e8f0);
	font-weight: 800; color: var(--ink);
}
.batch25-thumb.num { font-size: 1rem; }
.batch25-thumb :global(.hc-art),
.batch25-thumb :global(.batch-scene-art) { width: 100%; height: 100%; margin: 0; border: 0; border-radius: 0; }
.game-card .batch25-thumb { width: 4.6rem; height: 4.6rem; }
.level-tile .batch25-thumb { width: 2.8rem; height: 2.8rem; border-width: 2px; }
.batch25-stage { display: flex; justify-content: center; margin: 0.75rem 0 0.5rem; flex-wrap: wrap; gap: 0.75rem; }
`
);
console.log('wire done');
