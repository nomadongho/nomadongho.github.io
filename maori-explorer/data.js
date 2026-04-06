/**
 * Māori Explorer - Vocabulary Data
 *
 * Each vocabulary item has:
 *   id          - unique string identifier
 *   maori       - the Māori word / phrase
 *   pronunciation - simplified child-friendly pronunciation guide
 *   english     - short English meaning
 *   category    - module category
 *   emoji       - visual icon (emoji used as placeholder for illustrations)
 *   audio       - optional path to local audio file (null = use speech synthesis)
 */

const VOCAB = {
  greetings: [
    {
      id: "kia-ora",
      maori: "Kia ora",
      pronunciation: "kee-ah OH-rah",
      english: "Hello / Thank you",
      category: "greetings",
      emoji: "👋",
      audio: null
    },
    {
      id: "morena",
      maori: "Mōrena",
      pronunciation: "moh-REH-nah",
      english: "Good morning",
      category: "greetings",
      emoji: "🌅",
      audio: null
    },
    {
      id: "tena-koe",
      maori: "Tēnā koe",
      pronunciation: "teh-NAH koh-EH",
      english: "Hello (formal)",
      category: "greetings",
      emoji: "🤝",
      audio: null
    },
    {
      id: "ka-kite",
      maori: "Ka kite",
      pronunciation: "kah KEE-teh",
      english: "Goodbye / See you",
      category: "greetings",
      emoji: "🌊",
      audio: null
    },
    {
      id: "aroha",
      maori: "Aroha",
      pronunciation: "ah-ROH-hah",
      english: "Love / Compassion",
      category: "greetings",
      emoji: "❤️",
      audio: null
    }
  ],

  numbers: [
    { id: "tahi",   maori: "Tahi",   pronunciation: "TAH-hee",      english: "One",   category: "numbers", emoji: "1️⃣", value: 1, audio: null },
    { id: "rua",    maori: "Rua",    pronunciation: "ROO-ah",        english: "Two",   category: "numbers", emoji: "2️⃣", value: 2, audio: null },
    { id: "toru",   maori: "Toru",   pronunciation: "TOH-roo",       english: "Three", category: "numbers", emoji: "3️⃣", value: 3, audio: null },
    { id: "wha",    maori: "Whā",    pronunciation: "FAH",           english: "Four",  category: "numbers", emoji: "4️⃣", value: 4, audio: null },
    { id: "rima",   maori: "Rima",   pronunciation: "REE-mah",       english: "Five",  category: "numbers", emoji: "5️⃣", value: 5, audio: null },
    { id: "ono",    maori: "Ono",    pronunciation: "OH-noh",        english: "Six",   category: "numbers", emoji: "6️⃣", value: 6, audio: null },
    { id: "whitu",  maori: "Whitu",  pronunciation: "FEE-too",       english: "Seven", category: "numbers", emoji: "7️⃣", value: 7, audio: null },
    { id: "waru",   maori: "Waru",   pronunciation: "WAH-roo",       english: "Eight", category: "numbers", emoji: "8️⃣", value: 8, audio: null },
    { id: "iwa",    maori: "Iwa",    pronunciation: "EE-wah",        english: "Nine",  category: "numbers", emoji: "9️⃣", value: 9, audio: null },
    { id: "tekau",  maori: "Tekau",  pronunciation: "TEH-kow",       english: "Ten",   category: "numbers", emoji: "🔟", value: 10, audio: null }
  ],

  colors: [
    { id: "whero",     maori: "Whero",     pronunciation: "FEH-roh",      english: "Red",    category: "colors", emoji: "🔴", hex: "#e74c3c", audio: null },
    { id: "kakariki",  maori: "Kākāriki",  pronunciation: "kah-kah-REE-kee", english: "Green",  category: "colors", emoji: "🟢", hex: "#27ae60", audio: null },
    { id: "kikorangi", maori: "Kikorangi", pronunciation: "kee-koh-RANG-ee", english: "Blue",   category: "colors", emoji: "🔵", hex: "#2980b9", audio: null },
    { id: "kowhai",    maori: "Kōwhai",    pronunciation: "KOH-fai",      english: "Yellow", category: "colors", emoji: "🟡", hex: "#f1c40f", audio: null },
    { id: "pango",     maori: "Pango",     pronunciation: "PANG-oh",      english: "Black",  category: "colors", emoji: "⚫", hex: "#2c2c2c", audio: null },
    { id: "ma",        maori: "Mā",        pronunciation: "MAH",          english: "White",  category: "colors", emoji: "⚪", hex: "#ecf0f1", audio: null }
  ],

  family: [
    { id: "whanau",  maori: "Whānau",  pronunciation: "FAH-noh",    english: "Family",  category: "family", emoji: "👨‍👩‍👧‍👦", audio: null },
    { id: "mama",    maori: "Māmā",    pronunciation: "MAH-mah",    english: "Mum",     category: "family", emoji: "👩", audio: null },
    { id: "papa",    maori: "Pāpā",    pronunciation: "PAH-pah",    english: "Dad",     category: "family", emoji: "👨", audio: null },
    { id: "pepi",    maori: "Pēpi",    pronunciation: "PAY-pee",    english: "Baby",    category: "family", emoji: "👶", audio: null },
    { id: "koroua",  maori: "Koroua",  pronunciation: "koh-ROH-oo-ah", english: "Grandad", category: "family", emoji: "👴", audio: null },
    { id: "kuia",    maori: "Kuia",    pronunciation: "KOO-ee-ah",  english: "Grandma", category: "family", emoji: "👵", audio: null }
  ],

  animals: [
    { id: "kuri",   maori: "Kurī",   pronunciation: "KOO-ree",   english: "Dog",   category: "animals", emoji: "🐕", audio: null },
    { id: "ngeru",  maori: "Ngeru",  pronunciation: "NGEH-roo",  english: "Cat",   category: "animals", emoji: "🐈", audio: null },
    { id: "manu",   maori: "Manu",   pronunciation: "MAH-noo",   english: "Bird",  category: "animals", emoji: "🐦", audio: null },
    { id: "ika",    maori: "Ika",    pronunciation: "EE-kah",    english: "Fish",  category: "animals", emoji: "🐟", audio: null },
    { id: "hori",   maori: "Hōiho", pronunciation: "HOH-ee-hoh", english: "Horse", category: "animals", emoji: "🐴", audio: null },
    { id: "kiwi",   maori: "Kiwi",   pronunciation: "KEE-wee",   english: "Kiwi bird", category: "animals", emoji: "🥝", audio: null }
  ],

  bodyParts: [
    { id: "upoko",   maori: "Upoko",   pronunciation: "oo-POH-koh",  english: "Head",  category: "bodyParts", emoji: "🗣️", audio: null },
    { id: "ringa",   maori: "Ringa",   pronunciation: "RING-ah",     english: "Hand",  category: "bodyParts", emoji: "🤚", audio: null },
    { id: "waewae",  maori: "Waewae",  pronunciation: "wai-WAI",     english: "Foot / Leg", category: "bodyParts", emoji: "🦶", audio: null },
    { id: "ihu",     maori: "Ihu",     pronunciation: "EE-hoo",      english: "Nose",  category: "bodyParts", emoji: "👃", audio: null },
    { id: "taringa", maori: "Taringa", pronunciation: "tah-RING-ah", english: "Ear",   category: "bodyParts", emoji: "👂", audio: null },
    { id: "kanohi",  maori: "Kanohi",  pronunciation: "kah-NOH-hee", english: "Face",  category: "bodyParts", emoji: "😊", audio: null }
  ],

  feelings: [
    { id: "harikoa",  maori: "Harikoa",  pronunciation: "hah-ree-KOH-ah", english: "Happy",  category: "feelings", emoji: "😄", audio: null },
    { id: "pouri",    maori: "Pōuri",    pronunciation: "POH-oo-ree",     english: "Sad",    category: "feelings", emoji: "😢", audio: null },
    { id: "ngenge",   maori: "Ngenge",   pronunciation: "NGENG-eh",       english: "Tired",  category: "feelings", emoji: "😴", audio: null },
    { id: "mataku",   maori: "Mataku",   pronunciation: "mah-TAH-koo",    english: "Scared", category: "feelings", emoji: "😨", audio: null },
    { id: "hiakai",   maori: "Hiakai",   pronunciation: "hee-ah-KAI",     english: "Hungry", category: "feelings", emoji: "🍽️", audio: null }
  ]
};

/** Module configuration for the home screen cards */
const MODULES = [
  {
    id: "greetings",
    label: "Greetings",
    description: "Say hello and goodbye",
    emoji: "👋",
    color: "#FF8C69",
    vocabKey: "greetings"
  },
  {
    id: "numbers",
    label: "Numbers",
    description: "Count from 1 to 10",
    emoji: "🔢",
    color: "#FFB347",
    vocabKey: "numbers"
  },
  {
    id: "colors",
    label: "Colors",
    description: "Learn colorful words",
    emoji: "🎨",
    color: "#87CEEB",
    vocabKey: "colors"
  },
  {
    id: "family",
    label: "Whānau",
    description: "Family words",
    emoji: "🏡",
    color: "#98FB98",
    vocabKey: "family"
  },
  {
    id: "animals",
    label: "Animals",
    description: "Meet Māori animals",
    emoji: "🐾",
    color: "#DDA0DD",
    vocabKey: "animals"
  },
  {
    id: "bodyParts",
    label: "Body Parts",
    description: "Head, hands and feet",
    emoji: "🖐️",
    color: "#F0E68C",
    vocabKey: "bodyParts"
  },
  {
    id: "feelings",
    label: "Feelings",
    description: "How do you feel?",
    emoji: "😊",
    color: "#FFD1DC",
    vocabKey: "feelings"
  },
  {
    id: "miniGames",
    label: "Mini Games",
    description: "Play and learn!",
    emoji: "🎮",
    color: "#B0E0E6",
    vocabKey: null
  },
  {
    id: "rewards",
    label: "My Stars",
    description: "See your rewards",
    emoji: "⭐",
    color: "#FFDAB9",
    vocabKey: null
  }
];

/** Positive feedback messages for games */
const FEEDBACK_POSITIVE = [
  "Awesome! 🌟",
  "Great job! ⭐",
  "You got it! 🎉",
  "Ka pai! (Well done!) 🥳",
  "Superstar! 💫",
  "Amazing! 🌈",
  "You're a champion! 🏆"
];

/** Gentle try-again messages */
const FEEDBACK_TRY_AGAIN = [
  "Great try! Let's go again 😊",
  "Nice listening! Try once more 🎵",
  "So close! Give it another go 🌟",
  "Good effort! Let's try again 💪",
  "Keep going! You can do it 🌈"
];

/** Badge definitions */
const BADGES = [
  { id: "great-listener",    label: "Great Listener",    emoji: "👂", description: "Played 5 audio cards", condition: p => p.audioPlayed >= 5 },
  { id: "number-finder",     label: "Number Finder",     emoji: "🔢", description: "Completed Numbers module", condition: p => p.modulesCompleted.includes("numbers") },
  { id: "color-spotter",     label: "Color Spotter",     emoji: "🎨", description: "Completed Colors module", condition: p => p.modulesCompleted.includes("colors") },
  { id: "animal-explorer",   label: "Animal Explorer",   emoji: "🐾", description: "Completed Animals module", condition: p => p.modulesCompleted.includes("animals") },
  { id: "greeting-star",     label: "Greeting Star",     emoji: "🌟", description: "Completed Greetings module", condition: p => p.modulesCompleted.includes("greetings") },
  { id: "family-friend",     label: "Family Friend",     emoji: "🏡", description: "Completed Whānau module", condition: p => p.modulesCompleted.includes("family") },
  { id: "game-player",       label: "Game Player",       emoji: "🎮", description: "Played 3 mini games", condition: p => p.gamesPlayed >= 3 },
  { id: "super-explorer",    label: "Super Explorer",    emoji: "🚀", description: "Earned 20 stars", condition: p => p.stars >= 20 }
];

/** Counting objects for the numbers counting game */
const COUNTING_OBJECTS = ["🌸", "⭐", "🐠", "🦋", "🍎", "🐸", "🌈", "🎈", "🍭", "🌺"];

/**
 * Google AdSense configuration
 *
 * ‣ publisherId  — your AdSense publisher ID (ca-pub-XXXXXXXXXXXXXXXX)
 * ‣ enabled      — set to true once your AdSense account is approved
 * ‣ delaySeconds — seconds after entering a page before the ad appears
 * ‣ slots        — ad-unit slot ID for the bottom banner bar
 *
 * All AdSense settings live here so you only need to edit one place.
 */
const ADSENSE_CONFIG = {
  publisherId: "ca-pub-6962989029779783",
  enabled: typeof window.ADS_ENABLED !== "undefined" ? !!window.ADS_ENABLED : false,
  delaySeconds: 0,
  slots: {
    banner: "6729417308"
  }
};

/** Word of the day – picks based on day of year */
function getWordOfTheDay() {
  const allWords = [
    ...VOCAB.greetings,
    ...VOCAB.numbers,
    ...VOCAB.colors,
    ...VOCAB.family,
    ...VOCAB.animals,
    ...VOCAB.bodyParts,
    ...VOCAB.feelings
  ];
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000
  );
  return allWords[dayOfYear % allWords.length];
}
