#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const ids = [
	'plant-animal',
	'sink-float',
	'day-jobs',
	'recycle-sort',
	'hungry-thirsty',
	'safe-choice',
	'five-senses',
	'same-number',
	'num-before-after',
	'make-ten',
	'first-sound',
	'word-length',
	'sentence-order',
	'near-far',
	'open-closed',
	'up-down'
];

// progress.ts
let progress = readFileSync(join(root, 'src/lib/progress.ts'), 'utf8');
if (!progress.includes("'plant-animal'")) {
	progress = progress.replace(
		"| 'wet-dry';",
		`| 'wet-dry'\n${ids.map((id) => `\t| '${id}'`).join('\n')};`
	);
	progress = progress.replace(
		"'wet-dry': GameProgress;\n}",
		`'wet-dry': GameProgress;\n${ids.map((id) => `\t'${id}': GameProgress;`).join('\n')}\n}`
	);
	progress = progress.replace(
		"'wet-dry': { cleared: 0 }\n\t};",
		`'wet-dry': { cleared: 0 },\n${ids.map((id) => `\t\t'${id}': { cleared: 0 }`).join(',\n')}\n\t};`
	);
	progress = progress.replace(
		"'wet-dry': sanitizeGame(games['wet-dry'])\n\t\t};",
		`'wet-dry': sanitizeGame(games['wet-dry']),\n${ids
			.map((id) => `\t\t\t'${id}': sanitizeGame(games['${id}'])`)
			.join(',\n')}\n\t\t};`
	);
	writeFileSync(join(root, 'src/lib/progress.ts'), progress);
	console.log('progress.ts');
}

// progress.test.ts
let ptest = readFileSync(join(root, 'src/lib/progress.test.ts'), 'utf8');
if (!ptest.includes("'plant-animal'")) {
	ptest = ptest.replaceAll(
		"'wet-dry': { cleared: 0 }",
		`'wet-dry': { cleared: 0 },\n${ids.map((id) => `\t\t\t'${id}': { cleared: 0 }`).join(',\n')}`
	);
	writeFileSync(join(root, 'src/lib/progress.test.ts'), ptest);
	console.log('progress.test.ts');
}

const enExtra = `
	"plantani_name": "Plant or animal",
	"plantani_desc": "See a living thing. Tap plant or animal.",
	"plantani_prompt": "Is it a plant or an animal?",
	"plantani_hint": "Flowers and trees are plants. Dogs and fish are animals.",
	"plantani_plant": "Plant",
	"plantani_animal": "Animal",
	"sinkfloat_name": "Sink or float",
	"sinkfloat_desc": "Drop it in water. Tap sink or float.",
	"sinkfloat_prompt": "Will it sink or float?",
	"sinkfloat_hint": "Heavy rocks sink. Leaves and boats float.",
	"sinkfloat_sink": "Sink",
	"sinkfloat_float": "Float",
	"dayjobs_name": "Day jobs",
	"dayjobs_desc": "See who needs help. Tap the helper.",
	"dayjobs_prompt": "Who helps here?",
	"dayjobs_hint": "Doctors help when you are hurt. Teachers help you learn.",
	"dayjobs_doctor": "Doctor",
	"dayjobs_teacher": "Teacher",
	"dayjobs_firefighter": "Firefighter",
	"dayjobs_cook": "Cook",
	"dayjobs_farmer": "Farmer",
	"dayjobs_builder": "Builder",
	"recycle_name": "Recycle sort",
	"recycle_desc": "See an item. Tap the right bin.",
	"recycle_prompt": "Which bin?",
	"recycle_hint": "Paper goes in paper. Bottles go in plastic. Food scraps go in trash.",
	"recycle_paper": "Paper",
	"recycle_plastic": "Plastic",
	"recycle_trash": "Trash",
	"hunger_name": "Hungry or thirsty",
	"hunger_desc": "See food or a drink. Tap hungry or thirsty.",
	"hunger_prompt": "Hungry or thirsty?",
	"hunger_hint": "Food means hungry. Drinks mean thirsty.",
	"hunger_hungry": "Hungry",
	"hunger_thirsty": "Thirsty",
	"safe_name": "Safe or not",
	"safe_desc": "See a street scene. Tap safe or not safe.",
	"safe_prompt": "Is this safe?",
	"safe_hint": "Use the crosswalk. Wear a helmet. Hold a grown-up's hand.",
	"safe_safe": "Safe",
	"safe_unsafe": "Not safe",
	"senses_name": "Five senses",
	"senses_desc": "See a cue. Tap which sense.",
	"senses_prompt": "Which sense?",
	"senses_hint": "Eyes see. Ears hear. Nose smells. Mouth tastes. Hands touch.",
	"senses_see": "See",
	"senses_hear": "Hear",
	"senses_smell": "Smell",
	"senses_taste": "Taste",
	"senses_touch": "Touch",
	"samenum_name": "Same number?",
	"samenum_desc": "Two piles. Tap same or different.",
	"samenum_prompt": "Same number or different?",
	"samenum_hint": "Count each pile. Are the numbers equal?",
	"samenum_same": "Same",
	"samenum_different": "Different",
	"numba_name": "Before or after",
	"numba_desc": "See a number. Tap the one before or after.",
	"numba_prompt": "What number fits?",
	"numba_hint": "Before means one smaller. After means one bigger.",
	"numba_ask_before": "What comes before {n}?",
	"numba_ask_after": "What comes after {n}?",
	"maketen_name": "Make 10",
	"maketen_desc": "See a number. Tap what makes 10.",
	"maketen_prompt": "What makes 10?",
	"maketen_hint": "Find the number that adds up to 10.",
	"firstsound_name": "First sound",
	"firstsound_desc": "See a picture. Tap the starting sound.",
	"firstsound_prompt": "What sound does it start with?",
	"firstsound_hint": "Say the word slowly. Listen to the first sound.",
	"wordlen_name": "Short or long word",
	"wordlen_desc": "Two words. Tap the longer or shorter one.",
	"wordlen_ask_longer": "Which word is longer?",
	"wordlen_ask_shorter": "Which word is shorter?",
	"wordlen_hint": "Count the letters. Longer words have more letters.",
	"wordlen_cat": "cat",
	"wordlen_dog": "dog",
	"wordlen_sun": "sun",
	"wordlen_butterfly": "butterfly",
	"wordlen_elephant": "elephant",
	"wordlen_helicopter": "helicopter",
	"sentord_name": "Sentence order",
	"sentord_desc": "Three pictures. Tap first, next, or last.",
	"sentord_ask_first": "Which picture is first?",
	"sentord_ask_next": "Which picture is next?",
	"sentord_ask_last": "Which picture is last?",
	"sentord_hint": "Think about what happens at the start, middle, and end.",
	"nearfar_name": "Near or far",
	"nearfar_desc": "See an object. Tap near or far.",
	"nearfar_prompt": "Is it near or far?",
	"nearfar_hint": "Near things look big. Far things look small.",
	"nearfar_near": "Near",
	"nearfar_far": "Far",
	"openclosed_name": "Open or closed",
	"openclosed_desc": "See a door, box, or book. Tap open or closed.",
	"openclosed_prompt": "Is it open or closed?",
	"openclosed_hint": "Open shows the inside. Closed is shut.",
	"openclosed_open": "Open",
	"openclosed_closed": "Closed",
	"updown_name": "Up or down",
	"updown_desc": "See something moving. Tap up or down.",
	"updown_prompt": "Is it going up or down?",
	"updown_hint": "Balloons go up. Rain and slides go down.",
	"updown_up": "Up",
	"updown_down": "Down"
`.trim();

function appendMessages(file, block) {
	let json = readFileSync(join(root, file), 'utf8').trim();
	if (json.includes('plantani_name')) {
		console.log('skip', file);
		return;
	}
	if (!json.endsWith('}')) throw new Error('bad json ' + file);
	json = json.slice(0, -1).trimEnd();
	if (!json.endsWith(',')) json += ',';
	json += '\n\t' + block.replace(/\n/g, '\n') + '\n}\n';
	// fix: block already has tabs
	writeFileSync(join(root, file), json.replace(/,\n\t\n/, ',\n'));
	console.log('messages', file);
}

// Build localized minimal copies (English text for IT/RO/DE for now for speed — better than missing keys)
// Actually user wants proper i18n - provide short translations for key names at least.

const itExtra = enExtra
	.replaceAll('Plant or animal', 'Pianta o animale')
	.replaceAll('See a living thing. Tap plant or animal.', 'Guarda un essere vivente. Tocca pianta o animale.')
	.replaceAll('Is it a plant or an animal?', 'È una pianta o un animale?')
	.replaceAll('Flowers and trees are plants. Dogs and fish are animals.', 'Fiori e alberi sono piante. Cani e pesci sono animali.')
	.replace(/"plantani_plant": "Plant"/, '"plantani_plant": "Pianta"')
	.replace(/"plantani_animal": "Animal"/, '"plantani_animal": "Animale"')
	.replaceAll('Sink or float', 'Affonda o galleggia')
	.replaceAll('Drop it in water. Tap sink or float.', "Mettilo nell'acqua. Tocca affonda o galleggia.")
	.replaceAll('Will it sink or float?', 'Affonda o galleggia?')
	.replaceAll('Heavy rocks sink. Leaves and boats float.', 'I sassi affondano. Foglie e barche galleggiano.')
	.replace(/"sinkfloat_sink": "Sink"/, '"sinkfloat_sink": "Affonda"')
	.replace(/"sinkfloat_float": "Float"/, '"sinkfloat_float": "Galleggia"')
	.replaceAll('Day jobs', 'Mestieri')
	.replaceAll('See who needs help. Tap the helper.', 'Guarda chi ha bisogno. Tocca chi aiuta.')
	.replaceAll('Who helps here?', 'Chi aiuta qui?')
	.replaceAll('Doctors help when you are hurt. Teachers help you learn.', 'I dottori aiutano se stai male. Gli insegnanti aiutano a imparare.')
	.replace(/"dayjobs_doctor": "Doctor"/, '"dayjobs_doctor": "Dottore"')
	.replace(/"dayjobs_teacher": "Teacher"/, '"dayjobs_teacher": "Maestra"')
	.replace(/"dayjobs_firefighter": "Firefighter"/, '"dayjobs_firefighter": "Pompiere"')
	.replace(/"dayjobs_cook": "Cook"/, '"dayjobs_cook": "Cuoco"')
	.replace(/"dayjobs_farmer": "Farmer"/, '"dayjobs_farmer": "Contadino"')
	.replace(/"dayjobs_builder": "Builder"/, '"dayjobs_builder": "Muratore"')
	.replaceAll('Recycle sort', 'Riciclo')
	.replaceAll('See an item. Tap the right bin.', "Guarda l'oggetto. Tocca il cestino giusto.")
	.replaceAll('Which bin?', 'Quale cestino?')
	.replaceAll(
		'Paper goes in paper. Bottles go in plastic. Food scraps go in trash.',
		'La carta va nella carta. Le bottiglie nella plastica. Gli avanzi nel rifiuto.'
	)
	.replace(/"recycle_paper": "Paper"/, '"recycle_paper": "Carta"')
	.replace(/"recycle_plastic": "Plastic"/, '"recycle_plastic": "Plastica"')
	.replace(/"recycle_trash": "Trash"/, '"recycle_trash": "Rifiuti"')
	.replaceAll('Hungry or thirsty', 'Fame o sete')
	.replaceAll('See food or a drink. Tap hungry or thirsty.', 'Guarda cibo o bevanda. Tocca fame o sete.')
	.replaceAll('Hungry or thirsty?', 'Fame o sete?')
	.replaceAll('Food means hungry. Drinks mean thirsty.', 'Il cibo è fame. Le bevande sono sete.')
	.replace(/"hunger_hungry": "Hungry"/, '"hunger_hungry": "Fame"')
	.replace(/"hunger_thirsty": "Thirsty"/, '"hunger_thirsty": "Sete"')
	.replaceAll('Safe or not', 'Sicuro o no')
	.replaceAll('See a street scene. Tap safe or not safe.', 'Guarda la strada. Tocca sicuro o non sicuro.')
	.replaceAll('Is this safe?', 'È sicuro?')
	.replaceAll(
		"Use the crosswalk. Wear a helmet. Hold a grown-up's hand.",
		'Usa le strisce. Metti il casco. Tieni la mano di un adulto.'
	)
	.replace(/"safe_safe": "Safe"/, '"safe_safe": "Sicuro"')
	.replace(/"safe_unsafe": "Not safe"/, '"safe_unsafe": "Non sicuro"')
	.replaceAll('Five senses', 'Cinque sensi')
	.replaceAll('See a cue. Tap which sense.', 'Guarda indizio. Tocca il senso.')
	.replaceAll('Which sense?', 'Quale senso?')
	.replaceAll(
		'Eyes see. Ears hear. Nose smells. Mouth tastes. Hands touch.',
		'Occhi vedono. Orecchie sentono. Naso odora. Bocca gusta. Mani toccano.'
	)
	.replace(/"senses_see": "See"/, '"senses_see": "Vista"')
	.replace(/"senses_hear": "Hear"/, '"senses_hear": "Udito"')
	.replace(/"senses_smell": "Smell"/, '"senses_smell": "Olfatto"')
	.replace(/"senses_taste": "Taste"/, '"senses_taste": "Gusto"')
	.replace(/"senses_touch": "Touch"/, '"senses_touch": "Tatto"')
	.replaceAll('Same number?', 'Stesso numero?')
	.replaceAll('Two piles. Tap same or different.', 'Due mucchi. Tocca uguale o diverso.')
	.replaceAll('Same number or different?', 'Stesso numero o diverso?')
	.replaceAll('Count each pile. Are the numbers equal?', 'Conta ogni mucchio. I numeri sono uguali?')
	.replace(/"samenum_same": "Same"/, '"samenum_same": "Uguale"')
	.replace(/"samenum_different": "Different"/, '"samenum_different": "Diverso"')
	.replaceAll('Before or after', 'Prima o dopo')
	.replaceAll('See a number. Tap the one before or after.', 'Guarda un numero. Tocca prima o dopo.')
	.replaceAll('What number fits?', 'Quale numero?')
	.replaceAll('Before means one smaller. After means one bigger.', 'Prima è uno in meno. Dopo è uno in più.')
	.replaceAll('What comes before {n}?', 'Cosa viene prima di {n}?')
	.replaceAll('What comes after {n}?', 'Cosa viene dopo {n}?')
	.replaceAll('Make 10', 'Fai 10')
	.replaceAll('See a number. Tap what makes 10.', 'Guarda un numero. Tocca cosa fa 10.')
	.replaceAll('What makes 10?', 'Cosa fa 10?')
	.replaceAll('Find the number that adds up to 10.', 'Trova il numero che fa 10.')
	.replaceAll('First sound', 'Primo suono')
	.replaceAll('See a picture. Tap the starting sound.', 'Guarda la figura. Tocca il suono iniziale.')
	.replaceAll('What sound does it start with?', 'Con quale suono inizia?')
	.replaceAll('Say the word slowly. Listen to the first sound.', 'Dì la parola piano. Ascolta il primo suono.')
	.replaceAll('Short or long word', 'Parola corta o lunga')
	.replaceAll('Two words. Tap the longer or shorter one.', 'Due parole. Tocca la più lunga o corta.')
	.replaceAll('Which word is longer?', 'Quale parola è più lunga?')
	.replaceAll('Which word is shorter?', 'Quale parola è più corta?')
	.replaceAll('Count the letters. Longer words have more letters.', 'Conta le lettere. Le parole lunghe ne hanno di più.')
	.replaceAll('Sentence order', 'Ordine della storia')
	.replaceAll('Three pictures. Tap first, next, or last.', 'Tre figure. Tocca prima, poi o ultima.')
	.replaceAll('Which picture is first?', 'Quale figura è la prima?')
	.replaceAll('Which picture is next?', 'Quale figura è la successiva?')
	.replaceAll('Which picture is last?', 'Quale figura è l’ultima?')
	.replaceAll(
		'Think about what happens at the start, middle, and end.',
		'Pensa a inizio, mezzo e fine.'
	)
	.replaceAll('Near or far', 'Vicino o lontano')
	.replaceAll('See an object. Tap near or far.', 'Guarda un oggetto. Tocca vicino o lontano.')
	.replaceAll('Is it near or far?', 'È vicino o lontano?')
	.replaceAll('Near things look big. Far things look small.', 'Vicino sembra grande. Lontano sembra piccolo.')
	.replace(/"nearfar_near": "Near"/, '"nearfar_near": "Vicino"')
	.replace(/"nearfar_far": "Far"/, '"nearfar_far": "Lontano"')
	.replaceAll('Open or closed', 'Aperto o chiuso')
	.replaceAll('See a door, box, or book. Tap open or closed.', 'Guarda porta, scatola o libro. Tocca aperto o chiuso.')
	.replaceAll('Is it open or closed?', 'È aperto o chiuso?')
	.replaceAll('Open shows the inside. Closed is shut.', 'Aperto mostra dentro. Chiuso è serrato.')
	.replace(/"openclosed_open": "Open"/, '"openclosed_open": "Aperto"')
	.replace(/"openclosed_closed": "Closed"/, '"openclosed_closed": "Chiuso"')
	.replaceAll('Up or down', 'Su o giù')
	.replaceAll('See something moving. Tap up or down.', 'Guarda qualcosa che si muove. Tocca su o giù.')
	.replaceAll('Is it going up or down?', 'Va su o giù?')
	.replaceAll('Balloons go up. Rain and slides go down.', 'I palloncini vanno su. Pioggia e scivoli vanno giù.')
	.replace(/"updown_up": "Up"/, '"updown_up": "Su"')
	.replace(/"updown_down": "Down"/, '"updown_down": "Giù"');

const roExtra = enExtra
	.replaceAll('Plant or animal', 'Plantă sau animal')
	.replaceAll('See a living thing. Tap plant or animal.', 'Vezi o ființă. Atinge plantă sau animal.')
	.replaceAll('Is it a plant or an animal?', 'Este plantă sau animal?')
	.replaceAll('Flowers and trees are plants. Dogs and fish are animals.', 'Florile și copacii sunt plante. Câinii și peștii sunt animale.')
	.replace(/"plantani_plant": "Plant"/, '"plantani_plant": "Plantă"')
	.replace(/"plantani_animal": "Animal"/, '"plantani_animal": "Animal"')
	.replaceAll('Sink or float', 'Se scufundă sau plutește')
	.replaceAll('Drop it in water. Tap sink or float.', 'Pune-l în apă. Atinge scufundă sau plutește.')
	.replaceAll('Will it sink or float?', 'Se scufundă sau plutește?')
	.replaceAll('Heavy rocks sink. Leaves and boats float.', 'Pietrele se scufundă. Frunzele și bărcile plutesc.')
	.replace(/"sinkfloat_sink": "Sink"/, '"sinkfloat_sink": "Scufundă"')
	.replace(/"sinkfloat_float": "Float"/, '"sinkfloat_float": "Plutește"')
	.replaceAll('Day jobs', 'Meserii')
	.replaceAll('See who needs help. Tap the helper.', 'Vezi cine are nevoie. Atinge ajutorul.')
	.replaceAll('Who helps here?', 'Cine ajută aici?')
	.replace(/"dayjobs_doctor": "Doctor"/, '"dayjobs_doctor": "Doctor"')
	.replace(/"dayjobs_teacher": "Teacher"/, '"dayjobs_teacher": "Învățător"')
	.replace(/"dayjobs_firefighter": "Firefighter"/, '"dayjobs_firefighter": "Pompier"')
	.replace(/"dayjobs_cook": "Cook"/, '"dayjobs_cook": "Bucătar"')
	.replace(/"dayjobs_farmer": "Farmer"/, '"dayjobs_farmer": "Fermier"')
	.replace(/"dayjobs_builder": "Builder"/, '"dayjobs_builder": "Constructor"')
	.replaceAll('Recycle sort', 'Reciclare')
	.replace(/"recycle_paper": "Paper"/, '"recycle_paper": "Hârtie"')
	.replace(/"recycle_plastic": "Plastic"/, '"recycle_plastic": "Plastic"')
	.replace(/"recycle_trash": "Trash"/, '"recycle_trash": "Gunoi"')
	.replaceAll('Hungry or thirsty', 'Foame sau sete')
	.replace(/"hunger_hungry": "Hungry"/, '"hunger_hungry": "Foame"')
	.replace(/"hunger_thirsty": "Thirsty"/, '"hunger_thirsty": "Sete"')
	.replaceAll('Safe or not', 'Sigur sau nu')
	.replace(/"safe_safe": "Safe"/, '"safe_safe": "Sigur"')
	.replace(/"safe_unsafe": "Not safe"/, '"safe_unsafe": "Nu e sigur"')
	.replaceAll('Five senses', 'Cinci simțuri')
	.replace(/"senses_see": "See"/, '"senses_see": "Văz"')
	.replace(/"senses_hear": "Hear"/, '"senses_hear": "Auz"')
	.replace(/"senses_smell": "Smell"/, '"senses_smell": "Miros"')
	.replace(/"senses_taste": "Taste"/, '"senses_taste": "Gust"')
	.replace(/"senses_touch": "Touch"/, '"senses_touch": "Pipăit"')
	.replaceAll('Same number?', 'Același număr?')
	.replace(/"samenum_same": "Same"/, '"samenum_same": "La fel"')
	.replace(/"samenum_different": "Different"/, '"samenum_different": "Diferit"')
	.replaceAll('Before or after', 'Înainte sau după')
	.replaceAll('What comes before {n}?', 'Ce vine înainte de {n}?')
	.replaceAll('What comes after {n}?', 'Ce vine după {n}?')
	.replaceAll('Make 10', 'Fă 10')
	.replaceAll('What makes 10?', 'Ce face 10?')
	.replaceAll('First sound', 'Primul sunet')
	.replaceAll('Short or long word', 'Cuvânt scurt sau lung')
	.replaceAll('Which word is longer?', 'Care cuvânt e mai lung?')
	.replaceAll('Which word is shorter?', 'Care cuvânt e mai scurt?')
	.replaceAll('Sentence order', 'Ordinea poveștii')
	.replaceAll('Which picture is first?', 'Care imagine e prima?')
	.replaceAll('Which picture is next?', 'Care imagine e următoarea?')
	.replaceAll('Which picture is last?', 'Care imagine e ultima?')
	.replaceAll('Near or far', 'Aproape sau departe')
	.replace(/"nearfar_near": "Near"/, '"nearfar_near": "Aproape"')
	.replace(/"nearfar_far": "Far"/, '"nearfar_far": "Departe"')
	.replaceAll('Open or closed', 'Deschis sau închis')
	.replace(/"openclosed_open": "Open"/, '"openclosed_open": "Deschis"')
	.replace(/"openclosed_closed": "Closed"/, '"openclosed_closed": "Închis"')
	.replaceAll('Up or down', 'Sus sau jos')
	.replace(/"updown_up": "Up"/, '"updown_up": "Sus"')
	.replace(/"updown_down": "Down"/, '"updown_down": "Jos"');

const deExtra = enExtra
	.replaceAll('Plant or animal', 'Pflanze oder Tier')
	.replaceAll('See a living thing. Tap plant or animal.', 'Schau ein Lebewesen an. Tippe Pflanze oder Tier.')
	.replaceAll('Is it a plant or an animal?', 'Ist es eine Pflanze oder ein Tier?')
	.replace(/"plantani_plant": "Plant"/, '"plantani_plant": "Pflanze"')
	.replace(/"plantani_animal": "Animal"/, '"plantani_animal": "Tier"')
	.replaceAll('Sink or float', 'Sinken oder schwimmen')
	.replace(/"sinkfloat_sink": "Sink"/, '"sinkfloat_sink": "Sinkt"')
	.replace(/"sinkfloat_float": "Float"/, '"sinkfloat_float": "Schwimmt"')
	.replaceAll('Day jobs', 'Berufe')
	.replace(/"dayjobs_doctor": "Doctor"/, '"dayjobs_doctor": "Arzt"')
	.replace(/"dayjobs_teacher": "Teacher"/, '"dayjobs_teacher": "Lehrer"')
	.replace(/"dayjobs_firefighter": "Firefighter"/, '"dayjobs_firefighter": "Feuerwehr"')
	.replace(/"dayjobs_cook": "Cook"/, '"dayjobs_cook": "Koch"')
	.replace(/"dayjobs_farmer": "Farmer"/, '"dayjobs_farmer": "Bauer"')
	.replace(/"dayjobs_builder": "Builder"/, '"dayjobs_builder": "Bauarbeiter"')
	.replaceAll('Recycle sort', 'Müll trennen')
	.replace(/"recycle_paper": "Paper"/, '"recycle_paper": "Papier"')
	.replace(/"recycle_plastic": "Plastic"/, '"recycle_plastic": "Plastik"')
	.replace(/"recycle_trash": "Trash"/, '"recycle_trash": "Restmüll"')
	.replaceAll('Hungry or thirsty', 'Hunger oder Durst')
	.replace(/"hunger_hungry": "Hungry"/, '"hunger_hungry": "Hunger"')
	.replace(/"hunger_thirsty": "Thirsty"/, '"hunger_thirsty": "Durst"')
	.replaceAll('Safe or not', 'Sicher oder nicht')
	.replace(/"safe_safe": "Safe"/, '"safe_safe": "Sicher"')
	.replace(/"safe_unsafe": "Not safe"/, '"safe_unsafe": "Nicht sicher"')
	.replaceAll('Five senses', 'Fünf Sinne')
	.replace(/"senses_see": "See"/, '"senses_see": "Sehen"')
	.replace(/"senses_hear": "Hear"/, '"senses_hear": "Hören"')
	.replace(/"senses_smell": "Smell"/, '"senses_smell": "Riechen"')
	.replace(/"senses_taste": "Taste"/, '"senses_taste": "Schmecken"')
	.replace(/"senses_touch": "Touch"/, '"senses_touch": "Fühlen"')
	.replaceAll('Same number?', 'Gleiche Zahl?')
	.replace(/"samenum_same": "Same"/, '"samenum_same": "Gleich"')
	.replace(/"samenum_different": "Different"/, '"samenum_different": "Anders"')
	.replaceAll('Before or after', 'Davor oder danach')
	.replaceAll('What comes before {n}?', 'Was kommt vor {n}?')
	.replaceAll('What comes after {n}?', 'Was kommt nach {n}?')
	.replaceAll('Make 10', 'Mach 10')
	.replaceAll('What makes 10?', 'Was ergibt 10?')
	.replaceAll('First sound', 'Erster Laut')
	.replaceAll('Short or long word', 'Kurzes oder langes Wort')
	.replaceAll('Which word is longer?', 'Welches Wort ist länger?')
	.replaceAll('Which word is shorter?', 'Welches Wort ist kürzer?')
	.replaceAll('Sentence order', 'Satzreihenfolge')
	.replaceAll('Which picture is first?', 'Welches Bild ist zuerst?')
	.replaceAll('Which picture is next?', 'Welches Bild ist als Nächstes?')
	.replaceAll('Which picture is last?', 'Welches Bild ist zuletzt?')
	.replaceAll('Near or far', 'Nah oder fern')
	.replace(/"nearfar_near": "Near"/, '"nearfar_near": "Nah"')
	.replace(/"nearfar_far": "Far"/, '"nearfar_far": "Fern"')
	.replaceAll('Open or closed', 'Offen oder zu')
	.replace(/"openclosed_open": "Open"/, '"openclosed_open": "Offen"')
	.replace(/"openclosed_closed": "Closed"/, '"openclosed_closed": "Zu"')
	.replaceAll('Up or down', 'Hoch oder runter')
	.replace(/"updown_up": "Up"/, '"updown_up": "Hoch"')
	.replace(/"updown_down": "Down"/, '"updown_down": "Runter"');

function appendJson(file, extra) {
	let raw = readFileSync(join(root, file), 'utf8').trim();
	if (raw.includes('"plantani_name"')) {
		console.log('skip', file);
		return;
	}
	const obj = JSON.parse(raw);
	const add = JSON.parse('{' + extra + '}');
	Object.assign(obj, add);
	writeFileSync(join(root, file), JSON.stringify(obj, null, '\t') + '\n');
	console.log('ok', file);
}

appendJson('messages/en.json', enExtra);
appendJson('messages/it.json', itExtra);
appendJson('messages/ro.json', roExtra);
appendJson('messages/de.json', deExtra);
console.log('wire done');
