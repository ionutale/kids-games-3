/**
 * Pure rules for "Syllable clap". A word (with a picture) is shown,
 * split into spoken parts. The child taps how many parts the word has.
 */

export type SylLocale = 'it' | 'ro' | 'en' | 'de';

export interface SylWord {
	word: string;
	picture: string;
	/** Spoken parts, in order. Length must match `parts`. */
	chunks: string[];
	parts: number;
}

export interface SylRound {
	prompt: SylWord;
	answer: number;
	options: number[];
}

export interface SylLevelConfig {
	level: number;
	minParts: number;
	maxParts: number;
}

export const MAX_SYL_LEVEL = 10;
export const SYL_ROUNDS = 3;

/**
 * Levels 1–6 ease in. Levels 7–9 drop short words and push longer,
 * trickier syllable counts (up to 5 parts by level 9).
 */
export const SYL_LEVELS: SylLevelConfig[] = [
	{ level: 1, minParts: 1, maxParts: 2 },
	{ level: 2, minParts: 1, maxParts: 2 },
	{ level: 3, minParts: 1, maxParts: 2 },
	{ level: 4, minParts: 1, maxParts: 3 },
	{ level: 5, minParts: 2, maxParts: 3 },
	{ level: 6, minParts: 2, maxParts: 3 },
	{ level: 7, minParts: 2, maxParts: 4 },
	{ level: 8, minParts: 3, maxParts: 4 },
	{ level: 9, minParts: 3, maxParts: 5 },
	{ level: 10, minParts: 4, maxParts: 5 }
];

/** Kid-friendly words with syllable splits for each language. */
export const SYL_BANK: Record<SylLocale, SylWord[]> = {
	en: [
		{ word: 'cat', picture: '🐱', chunks: ['cat'], parts: 1 },
		{ word: 'dog', picture: '🐶', chunks: ['dog'], parts: 1 },
		{ word: 'sun', picture: '☀️', chunks: ['sun'], parts: 1 },
		{ word: 'bee', picture: '🐝', chunks: ['bee'], parts: 1 },
		{ word: 'ball', picture: '⚽', chunks: ['ball'], parts: 1 },
		{ word: 'fish', picture: '🐟', chunks: ['fish'], parts: 1 },
		{ word: 'book', picture: '📖', chunks: ['book'], parts: 1 },
		{ word: 'star', picture: '⭐', chunks: ['star'], parts: 1 },
		{ word: 'cup', picture: '☕', chunks: ['cup'], parts: 1 },
		{ word: 'moon', picture: '🌙', chunks: ['moon'], parts: 1 },
		{ word: 'tree', picture: '🌳', chunks: ['tree'], parts: 1 },
		{ word: 'car', picture: '🚗', chunks: ['car'], parts: 1 },
		{ word: 'hat', picture: '🎩', chunks: ['hat'], parts: 1 },
		{ word: 'duck', picture: '🦆', chunks: ['duck'], parts: 1 },
		{ word: 'frog', picture: '🐸', chunks: ['frog'], parts: 1 },
		{ word: 'rain', picture: '🌧️', chunks: ['rain'], parts: 1 },
		{ word: 'apple', picture: '🍎', chunks: ['ap', 'ple'], parts: 2 },
		{ word: 'tiger', picture: '🐯', chunks: ['ti', 'ger'], parts: 2 },
		{ word: 'happy', picture: '😊', chunks: ['hap', 'py'], parts: 2 },
		{ word: 'water', picture: '💧', chunks: ['wa', 'ter'], parts: 2 },
		{ word: 'pizza', picture: '🍕', chunks: ['piz', 'za'], parts: 2 },
		{ word: 'rabbit', picture: '🐰', chunks: ['rab', 'bit'], parts: 2 },
		{ word: 'puppy', picture: '🐕', chunks: ['pup', 'py'], parts: 2 },
		{ word: 'lemon', picture: '🍋', chunks: ['lem', 'on'], parts: 2 },
		{ word: 'cookie', picture: '🍪', chunks: ['coo', 'kie'], parts: 2 },
		{ word: 'pencil', picture: '✏️', chunks: ['pen', 'cil'], parts: 2 },
		{ word: 'window', picture: '🪟', chunks: ['win', 'dow'], parts: 2 },
		{ word: 'garden', picture: '🪴', chunks: ['gar', 'den'], parts: 2 },
		{ word: 'monkey', picture: '🐵', chunks: ['mon', 'key'], parts: 2 },
		{ word: 'orange', picture: '🍊', chunks: ['or', 'ange'], parts: 2 },
		{ word: 'banana', picture: '🍌', chunks: ['ba', 'na', 'na'], parts: 3 },
		{ word: 'elephant', picture: '🐘', chunks: ['el', 'e', 'phant'], parts: 3 },
		{ word: 'butterfly', picture: '🦋', chunks: ['but', 'ter', 'fly'], parts: 3 },
		{ word: 'dinosaur', picture: '🦕', chunks: ['di', 'no', 'saur'], parts: 3 },
		{ word: 'tomato', picture: '🍅', chunks: ['to', 'ma', 'to'], parts: 3 },
		{ word: 'octopus', picture: '🐙', chunks: ['oc', 'to', 'pus'], parts: 3 },
		{ word: 'umbrella', picture: '☂️', chunks: ['um', 'brel', 'la'], parts: 3 },
		{ word: 'cucumber', picture: '🥒', chunks: ['cu', 'cum', 'ber'], parts: 3 },
		{ word: 'strawberry', picture: '🍓', chunks: ['straw', 'ber', 'ry'], parts: 3 },
		{ word: 'kangaroo', picture: '🦘', chunks: ['kan', 'ga', 'roo'], parts: 3 },
		{ word: 'family', picture: '👨‍👩‍👧', chunks: ['fam', 'i', 'ly'], parts: 3 },
		{ word: 'pineapple', picture: '🍍', chunks: ['pine', 'ap', 'ple'], parts: 3 },
		{ word: 'helicopter', picture: '🚁', chunks: ['hel', 'i', 'cop', 'ter'], parts: 4 },
		{ word: 'alligator', picture: '🐊', chunks: ['al', 'li', 'ga', 'tor'], parts: 4 },
		{ word: 'watermelon', picture: '🍉', chunks: ['wa', 'ter', 'mel', 'on'], parts: 4 },
		{ word: 'television', picture: '📺', chunks: ['tel', 'e', 'vi', 'sion'], parts: 4 },
		{ word: 'calculator', picture: '🧮', chunks: ['cal', 'cu', 'la', 'tor'], parts: 4 },
		{ word: 'motorcycle', picture: '🏍️', chunks: ['mo', 'tor', 'cy', 'cle'], parts: 4 },
		{ word: 'dictionary', picture: '📕', chunks: ['dic', 'tion', 'ar', 'y'], parts: 4 },
		{ word: 'avocado', picture: '🥑', chunks: ['a', 'vo', 'ca', 'do'], parts: 4 },
		{ word: 'caterpillar', picture: '🐛', chunks: ['cat', 'er', 'pil', 'lar'], parts: 4 },
		{ word: 'hippopotamus', picture: '🦛', chunks: ['hip', 'po', 'pot', 'a', 'mus'], parts: 5 },
		{ word: 'refrigerator', picture: '🧊', chunks: ['re', 'frig', 'er', 'a', 'tor'], parts: 5 },
		{ word: 'cafeteria', picture: '🍽️', chunks: ['caf', 'e', 'te', 'ri', 'a'], parts: 5 },
		{ word: 'imagination', picture: '💭', chunks: ['i', 'mag', 'i', 'na', 'tion'], parts: 5 }
	],
	it: [
		{ word: 'blu', picture: '🔵', chunks: ['blu'], parts: 1 },
		{ word: 're', picture: '👑', chunks: ['re'], parts: 1 },
		{ word: 'tè', picture: '🍵', chunks: ['tè'], parts: 1 },
		{ word: 'sci', picture: '⛷️', chunks: ['sci'], parts: 1 },
		{ word: 'zoo', picture: '🦁', chunks: ['zoo'], parts: 1 },
		{ word: 'bus', picture: '🚌', chunks: ['bus'], parts: 1 },
		{ word: 'no', picture: '🚫', chunks: ['no'], parts: 1 },
		{ word: 'sì', picture: '✅', chunks: ['sì'], parts: 1 },
		{ word: 'cane', picture: '🐶', chunks: ['ca', 'ne'], parts: 2 },
		{ word: 'sole', picture: '☀️', chunks: ['so', 'le'], parts: 2 },
		{ word: 'gatto', picture: '🐱', chunks: ['gat', 'to'], parts: 2 },
		{ word: 'casa', picture: '🏠', chunks: ['ca', 'sa'], parts: 2 },
		{ word: 'pane', picture: '🍞', chunks: ['pa', 'ne'], parts: 2 },
		{ word: 'mela', picture: '🍎', chunks: ['me', 'la'], parts: 2 },
		{ word: 'fiore', picture: '🌸', chunks: ['fio', 're'], parts: 2 },
		{ word: 'cuore', picture: '❤️', chunks: ['cuo', 're'], parts: 2 },
		{ word: 'luna', picture: '🌙', chunks: ['lu', 'na'], parts: 2 },
		{ word: 'topo', picture: '🐭', chunks: ['to', 'po'], parts: 2 },
		{ word: 'uovo', picture: '🥚', chunks: ['uo', 'vo'], parts: 2 },
		{ word: 'latte', picture: '🥛', chunks: ['lat', 'te'], parts: 2 },
		{ word: 'palla', picture: '⚽', chunks: ['pal', 'la'], parts: 2 },
		{ word: 'mare', picture: '🌊', chunks: ['ma', 're'], parts: 2 },
		{ word: 'rosa', picture: '🌹', chunks: ['ro', 'sa'], parts: 2 },
		{ word: 'nube', picture: '☁️', chunks: ['nu', 'be'], parts: 2 },
		{ word: 'banana', picture: '🍌', chunks: ['ba', 'na', 'na'], parts: 3 },
		{ word: 'limone', picture: '🍋', chunks: ['li', 'mo', 'ne'], parts: 3 },
		{ word: 'farfalla', picture: '🦋', chunks: ['far', 'fal', 'la'], parts: 3 },
		{ word: 'macchina', picture: '🚗', chunks: ['mac', 'chi', 'na'], parts: 3 },
		{ word: 'gelato', picture: '🍦', chunks: ['ge', 'la', 'to'], parts: 3 },
		{ word: 'cavallo', picture: '🐴', chunks: ['ca', 'val', 'lo'], parts: 3 },
		{ word: 'stella', picture: '⭐', chunks: ['stel', 'la'], parts: 2 },
		{ word: 'tavolo', picture: '🪵', chunks: ['ta', 'vo', 'lo'], parts: 3 },
		{ word: 'nonna', picture: '👵', chunks: ['non', 'na'], parts: 2 },
		{ word: 'scuola', picture: '🏫', chunks: ['scuo', 'la'], parts: 2 },
		{ word: 'asino', picture: '🫏', chunks: ['a', 'si', 'no'], parts: 3 },
		{ word: 'ombrello', picture: '☂️', chunks: ['om', 'brel', 'lo'], parts: 3 },
		{ word: 'computer', picture: '💻', chunks: ['com', 'pu', 'ter'], parts: 3 },
		{ word: 'elefante', picture: '🐘', chunks: ['e', 'le', 'fan', 'te'], parts: 4 },
		{ word: 'anguria', picture: '🍉', chunks: ['an', 'gu', 'ri', 'a'], parts: 4 },
		{ word: 'telefono', picture: '☎️', chunks: ['te', 'le', 'fo', 'no'], parts: 4 },
		{ word: 'bicicletta', picture: '🚲', chunks: ['bi', 'ci', 'clet', 'ta'], parts: 4 },
		{ word: 'cioccolato', picture: '🍫', chunks: ['cioc', 'co', 'la', 'to'], parts: 4 },
		{ word: 'cocomero', picture: '🍉', chunks: ['co', 'co', 'me', 'ro'], parts: 4 },
		{ word: 'patatina', picture: '🍟', chunks: ['pa', 'ta', 'ti', 'na'], parts: 4 },
		{ word: 'coccodrillo', picture: '🐊', chunks: ['coc', 'co', 'dril', 'lo'], parts: 4 },
		{ word: 'ippopotamo', picture: '🦛', chunks: ['ip', 'po', 'po', 'ta', 'mo'], parts: 5 },
		{ word: 'televisione', picture: '📺', chunks: ['te', 'le', 'vi', 'sio', 'ne'], parts: 5 },
		{ word: 'matematica', picture: '➕', chunks: ['ma', 'te', 'ma', 'ti', 'ca'], parts: 5 },
		{ word: 'calendario', picture: '📅', chunks: ['ca', 'len', 'da', 'rio'], parts: 4 },
		{ word: 'biblioteca', picture: '📚', chunks: ['bi', 'bli', 'o', 'te', 'ca'], parts: 5 },
		{ word: 'automobile', picture: '🚙', chunks: ['au', 'to', 'mo', 'bi', 'le'], parts: 5 }
	],
	ro: [
		{ word: 'cal', picture: '🐴', chunks: ['cal'], parts: 1 },
		{ word: 'măr', picture: '🍎', chunks: ['măr'], parts: 1 },
		{ word: 'nor', picture: '☁️', chunks: ['nor'], parts: 1 },
		{ word: 'urs', picture: '🐻', chunks: ['urs'], parts: 1 },
		{ word: 'tren', picture: '🚂', chunks: ['tren'], parts: 1 },
		{ word: 'ou', picture: '🥚', chunks: ['ou'], parts: 1 },
		{ word: 'foc', picture: '🔥', chunks: ['foc'], parts: 1 },
		{ word: 'cap', picture: '👤', chunks: ['cap'], parts: 1 },
		{ word: 'lac', picture: '🏞️', chunks: ['lac'], parts: 1 },
		{ word: 'casă', picture: '🏠', chunks: ['ca', 'să'], parts: 2 },
		{ word: 'pâine', picture: '🍞', chunks: ['pâi', 'ne'], parts: 2 },
		{ word: 'soare', picture: '☀️', chunks: ['soa', 're'], parts: 2 },
		{ word: 'floare', picture: '🌸', chunks: ['floa', 're'], parts: 2 },
		{ word: 'carte', picture: '📖', chunks: ['car', 'te'], parts: 2 },
		{ word: 'mână', picture: '✋', chunks: ['mâ', 'nă'], parts: 2 },
		{ word: 'lapte', picture: '🥛', chunks: ['lap', 'te'], parts: 2 },
		{ word: 'lună', picture: '🌙', chunks: ['lu', 'nă'], parts: 2 },
		{ word: 'minge', picture: '⚽', chunks: ['min', 'ge'], parts: 2 },
		{ word: 'vacă', picture: '🐄', chunks: ['va', 'că'], parts: 2 },
		{ word: 'apă', picture: '💧', chunks: ['a', 'pă'], parts: 2 },
		{ word: 'școală', picture: '🏫', chunks: ['școa', 'lă'], parts: 2 },
		{ word: 'masă', picture: '🪑', chunks: ['ma', 'să'], parts: 2 },
		{ word: 'pisică', picture: '🐱', chunks: ['pi', 'si', 'că'], parts: 3 },
		{ word: 'banană', picture: '🍌', chunks: ['ba', 'na', 'nă'], parts: 3 },
		{ word: 'elefant', picture: '🐘', chunks: ['e', 'le', 'fant'], parts: 3 },
		{ word: 'fluture', picture: '🦋', chunks: ['flu', 'tu', 're'], parts: 3 },
		{ word: 'mașină', picture: '🚗', chunks: ['ma', 'și', 'nă'], parts: 3 },
		{ word: 'telefon', picture: '☎️', chunks: ['te', 'le', 'fon'], parts: 3 },
		{ word: 'crocodil', picture: '🐊', chunks: ['cro', 'co', 'dil'], parts: 3 },
		{ word: 'ombrelă', picture: '☂️', chunks: ['om', 'bre', 'lă'], parts: 3 },
		{ word: 'căpșună', picture: '🍓', chunks: ['căp', 'șu', 'nă'], parts: 3 },
		{ word: 'familie', picture: '👨‍👩‍👧', chunks: ['fa', 'mi', 'lie'], parts: 3 },
		{ word: 'elicopter', picture: '🚁', chunks: ['e', 'li', 'cop', 'ter'], parts: 4 },
		{ word: 'televizor', picture: '📺', chunks: ['te', 'le', 'vi', 'zor'], parts: 4 },
		{ word: 'aligator', picture: '🐊', chunks: ['a', 'li', 'ga', 'tor'], parts: 4 },
		{ word: 'ciocolată', picture: '🍫', chunks: ['cio', 'co', 'la', 'tă'], parts: 4 },
		{ word: 'înghețată', picture: '🍦', chunks: ['în', 'ghe', 'ța', 'tă'], parts: 4 },
		{ word: 'calculator', picture: '🧮', chunks: ['cal', 'cu', 'la', 'tor'], parts: 4 },
		{ word: 'fereastră', picture: '🪟', chunks: ['fe', 're', 'as', 'tră'], parts: 4 },
		{ word: 'hipopotam', picture: '🦛', chunks: ['hi', 'po', 'po', 'tam'], parts: 4 },
		{ word: 'bicicletă', picture: '🚲', chunks: ['bi', 'ci', 'cle', 'tă'], parts: 4 },
		{ word: 'matematică', picture: '➕', chunks: ['ma', 'te', 'ma', 'ti', 'că'], parts: 5 },
		{ word: 'televiziune', picture: '📺', chunks: ['te', 'le', 'vi', 'ziu', 'ne'], parts: 5 },
		{ word: 'refrigerator', picture: '🧊', chunks: ['re', 'fri', 'ge', 'ra', 'tor'], parts: 5 },
		{ word: 'bibliotecă', picture: '📚', chunks: ['bib', 'li', 'o', 'te', 'că'], parts: 5 },
		{ word: 'calendar', picture: '📅', chunks: ['ca', 'len', 'dar'], parts: 3 },
		{ word: 'locomotivă', picture: '🚂', chunks: ['lo', 'co', 'mo', 'ti', 'vă'], parts: 5 },
		{ word: 'dinozaur', picture: '🦕', chunks: ['di', 'no', 'zaur'], parts: 3 }
	],
	de: [
		{ word: 'Hut', picture: '🎩', chunks: ['Hut'], parts: 1 },
		{ word: 'Ball', picture: '⚽', chunks: ['Ball'], parts: 1 },
		{ word: 'Hund', picture: '🐶', chunks: ['Hund'], parts: 1 },
		{ word: 'Fisch', picture: '🐟', chunks: ['Fisch'], parts: 1 },
		{ word: 'Buch', picture: '📖', chunks: ['Buch'], parts: 1 },
		{ word: 'Stern', picture: '⭐', chunks: ['Stern'], parts: 1 },
		{ word: 'Brot', picture: '🍞', chunks: ['Brot'], parts: 1 },
		{ word: 'Kind', picture: '🧒', chunks: ['Kind'], parts: 1 },
		{ word: 'Mond', picture: '🌙', chunks: ['Mond'], parts: 1 },
		{ word: 'Baum', picture: '🌳', chunks: ['Baum'], parts: 1 },
		{ word: 'Zug', picture: '🚂', chunks: ['Zug'], parts: 1 },
		{ word: 'Nest', picture: '🪺', chunks: ['Nest'], parts: 1 },
		{ word: 'Apfel', picture: '🍎', chunks: ['Ap', 'fel'], parts: 2 },
		{ word: 'Sonne', picture: '☀️', chunks: ['Son', 'ne'], parts: 2 },
		{ word: 'Katze', picture: '🐱', chunks: ['Kat', 'ze'], parts: 2 },
		{ word: 'Wasser', picture: '💧', chunks: ['Was', 'ser'], parts: 2 },
		{ word: 'Tiger', picture: '🐯', chunks: ['Ti', 'ger'], parts: 2 },
		{ word: 'Blume', picture: '🌸', chunks: ['Blu', 'me'], parts: 2 },
		{ word: 'Nase', picture: '👃', chunks: ['Na', 'se'], parts: 2 },
		{ word: 'Mutter', picture: '👩', chunks: ['Mut', 'ter'], parts: 2 },
		{ word: 'Vater', picture: '👨', chunks: ['Va', 'ter'], parts: 2 },
		{ word: 'Schule', picture: '🏫', chunks: ['Schu', 'le'], parts: 2 },
		{ word: 'Fenster', picture: '🪟', chunks: ['Fens', 'ter'], parts: 2 },
		{ word: 'Milch', picture: '🥛', chunks: ['Milch'], parts: 1 },
		{ word: 'Auto', picture: '🚗', chunks: ['Au', 'to'], parts: 2 },
		{ word: 'Banane', picture: '🍌', chunks: ['Ba', 'na', 'ne'], parts: 3 },
		{ word: 'Elefant', picture: '🐘', chunks: ['E', 'le', 'fant'], parts: 3 },
		{ word: 'Schmetterling', picture: '🦋', chunks: ['Schmet', 'ter', 'ling'], parts: 3 },
		{ word: 'Erdbeere', picture: '🍓', chunks: ['Erd', 'bee', 're'], parts: 3 },
		{ word: 'Telefon', picture: '☎️', chunks: ['Te', 'le', 'fon'], parts: 3 },
		{ word: 'Krokodil', picture: '🐊', chunks: ['Kro', 'ko', 'dil'], parts: 3 },
		{ word: 'Tomate', picture: '🍅', chunks: ['To', 'ma', 'te'], parts: 3 },
		{ word: 'Ananas', picture: '🍍', chunks: ['A', 'na', 'nas'], parts: 3 },
		{ word: 'Computer', picture: '💻', chunks: ['Com', 'pu', 'ter'], parts: 3 },
		{ word: 'Kartoffel', picture: '🥔', chunks: ['Kar', 'tof', 'fel'], parts: 3 },
		{ word: 'Kalender', picture: '📅', chunks: ['Ka', 'len', 'der'], parts: 3 },
		{ word: 'Familie', picture: '👨‍👩‍👧', chunks: ['Fa', 'mi', 'lie'], parts: 3 },
		{ word: 'Helikopter', picture: '🚁', chunks: ['He', 'li', 'kop', 'ter'], parts: 4 },
		{ word: 'Schokolade', picture: '🍫', chunks: ['Scho', 'ko', 'la', 'de'], parts: 4 },
		{ word: 'Bibliothek', picture: '📚', chunks: ['Bi', 'bli', 'o', 'thek'], parts: 4 },
		{ word: 'Mathematik', picture: '➕', chunks: ['Ma', 'the', 'ma', 'tik'], parts: 4 },
		{ word: 'Känguru', picture: '🦘', chunks: ['Kän', 'gu', 'ru'], parts: 3 },
		{ word: 'Dinosaurier', picture: '🦕', chunks: ['Di', 'no', 'sau', 'ri', 'er'], parts: 5 },
		{ word: 'Lokomotive', picture: '🚂', chunks: ['Lo', 'ko', 'mo', 'ti', 've'], parts: 5 },
		{ word: 'Universität', picture: '🎓', chunks: ['U', 'ni', 'ver', 'si', 'tät'], parts: 5 },
		{ word: 'Hippopotamus', picture: '🦛', chunks: ['Hip', 'po', 'po', 'ta', 'mus'], parts: 5 },
		{ word: 'Refrigerator', picture: '🧊', chunks: ['Re', 'fri', 'ge', 'ra', 'tor'], parts: 5 },
		{ word: 'Alligator', picture: '🐊', chunks: ['Al', 'li', 'ga', 'tor'], parts: 4 },
		{ word: 'Wassermelone', picture: '🍉', chunks: ['Was', 'ser', 'me', 'lo', 'ne'], parts: 5 }
	]
};

export function getSylLevel(level: number): SylLevelConfig | undefined {
	return SYL_LEVELS.find((entry) => entry.level === level);
}

export function bankFor(locale: SylLocale): SylWord[] {
	return SYL_BANK[locale] ?? SYL_BANK.en;
}

/** Join chunks with a kid-friendly separator, e.g. ba·na·na */
export function joinChunks(chunks: string[], sep = '·'): string {
	return chunks.join(sep);
}

function shuffled<T>(items: T[], rand: () => number): T[] {
	const copy = [...items];
	for (let i = copy.length - 1; i > 0; i--) {
		const j = Math.floor(rand() * (i + 1));
		[copy[i], copy[j]] = [copy[j], copy[i]];
	}
	return copy;
}

function optionsFor(config: SylLevelConfig): number[] {
	const options: number[] = [];
	for (let value = config.minParts; value <= config.maxParts; value++) options.push(value);
	return options;
}

function poolFor(locale: SylLocale, config: SylLevelConfig): SylWord[] {
	return bankFor(locale).filter(
		(word) => word.parts >= config.minParts && word.parts <= config.maxParts
	);
}

/** Prefer longer words on later levels so hard rounds stay hard. */
function weightedPool(pool: SylWord[], config: SylLevelConfig, rand: () => number): SylWord[] {
	if (config.level < 7) return shuffled(pool, rand);
	const hard = pool.filter((word) => word.parts >= Math.max(config.minParts, 3));
	const soft = pool.filter((word) => word.parts < Math.max(config.minParts, 3));
	return [...shuffled(hard, rand), ...shuffled(soft, rand)];
}

/** Three words. The answer is how many parts each word has. */
export function pickRounds(
	locale: SylLocale,
	config: SylLevelConfig,
	rand: () => number = Math.random
): SylRound[] {
	const pool = weightedPool(poolFor(locale, config), config, rand);
	const options = optionsFor(config);
	return pool.slice(0, SYL_ROUNDS).map((prompt) => ({
		prompt,
		answer: prompt.parts,
		options
	}));
}
