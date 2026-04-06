/* =============================================
   ENGLISH EXPLORER — app.js
   Complete interactive kids English learning app
   ============================================= */

(function () {
'use strict';

// ==========================================
// DATA
// ==========================================

const ALPHABET_DATA = [
  { letter:'A', upper:'A', lower:'a', sound:'a',   word:'Apple',    emoji:'🍎', word2:'Ant',      emoji2:'🐜' },
  { letter:'B', upper:'B', lower:'b', sound:'b',   word:'Ball',     emoji:'⚽', word2:'Bat',      emoji2:'🦇' },
  { letter:'C', upper:'C', lower:'c', sound:'k',   word:'Cat',      emoji:'🐱', word2:'Car',      emoji2:'🚗' },
  { letter:'D', upper:'D', lower:'d', sound:'d',   word:'Dog',      emoji:'🐶', word2:'Duck',     emoji2:'🦆' },
  { letter:'E', upper:'E', lower:'e', sound:'e',   word:'Egg',      emoji:'🥚', word2:'Elephant', emoji2:'🐘' },
  { letter:'F', upper:'F', lower:'f', sound:'f',   word:'Fish',     emoji:'🐟', word2:'Fan',      emoji2:'🌀' },
  { letter:'G', upper:'G', lower:'g', sound:'g',   word:'Goat',     emoji:'🐐', word2:'Gift',     emoji2:'🎁' },
  { letter:'H', upper:'H', lower:'h', sound:'h',   word:'Hat',      emoji:'🎩', word2:'Hand',     emoji2:'🖐️' },
  { letter:'I', upper:'I', lower:'i', sound:'i',   word:'Igloo',    emoji:'🧊', word2:'Insect',   emoji2:'🐛' },
  { letter:'J', upper:'J', lower:'j', sound:'j',   word:'Jam',      emoji:'🍓', word2:'Jet',      emoji2:'✈️' },
  { letter:'K', upper:'K', lower:'k', sound:'k',   word:'Kite',     emoji:'🪁', word2:'Key',      emoji2:'🔑' },
  { letter:'L', upper:'L', lower:'l', sound:'l',   word:'Lion',     emoji:'🦁', word2:'Leg',      emoji2:'🦵' },
  { letter:'M', upper:'M', lower:'m', sound:'m',   word:'Moon',     emoji:'🌙', word2:'Map',      emoji2:'🗺️' },
  { letter:'N', upper:'N', lower:'n', sound:'n',   word:'Nest',     emoji:'🪺', word2:'Nose',     emoji2:'👃' },
  { letter:'O', upper:'O', lower:'o', sound:'o',   word:'Octopus',  emoji:'🐙', word2:'Orange',   emoji2:'🍊' },
  { letter:'P', upper:'P', lower:'p', sound:'p',   word:'Pig',      emoji:'🐷', word2:'Pen',      emoji2:'✏️' },
  { letter:'Q', upper:'Q', lower:'q', sound:'kw',  word:'Queen',    emoji:'👸', word2:'Quilt',    emoji2:'🛌' },
  { letter:'R', upper:'R', lower:'r', sound:'r',   word:'Rabbit',   emoji:'🐰', word2:'Robot',    emoji2:'🤖' },
  { letter:'S', upper:'S', lower:'s', sound:'s',   word:'Sun',      emoji:'☀️', word2:'Sock',     emoji2:'🧦' },
  { letter:'T', upper:'T', lower:'t', sound:'t',   word:'Tiger',    emoji:'🐯', word2:'Top',      emoji2:'🌀' },
  { letter:'U', upper:'U', lower:'u', sound:'u',   word:'Umbrella', emoji:'☂️', word2:'Up',       emoji2:'⬆️' },
  { letter:'V', upper:'V', lower:'v', sound:'v',   word:'Van',      emoji:'🚐', word2:'Vest',     emoji2:'🦺' },
  { letter:'W', upper:'W', lower:'w', sound:'w',   word:'Web',      emoji:'🕸️', word2:'Wig',      emoji2:'💇' },
  { letter:'X', upper:'X', lower:'x', sound:'ks',  word:'Box',      emoji:'📦', word2:'Fox',      emoji2:'🦊' },
  { letter:'Y', upper:'Y', lower:'y', sound:'y',   word:'Yo-yo',    emoji:'🪀', word2:'Yak',      emoji2:'🐃' },
  { letter:'Z', upper:'Z', lower:'z', sound:'z',   word:'Zebra',    emoji:'🦓', word2:'Zip',      emoji2:'🤐' },
];

const PHONICS_WORDS = [
  { word:'cat', parts:['c','a','t'], sounds:['k','a','t'],   emoji:'🐱' },
  { word:'bat', parts:['b','a','t'], sounds:['b','a','t'],   emoji:'🦇' },
  { word:'hat', parts:['h','a','t'], sounds:['h','a','t'],   emoji:'🎩' },
  { word:'mat', parts:['m','a','t'], sounds:['m','a','t'],   emoji:'🧺' },
  { word:'dog', parts:['d','o','g'], sounds:['d','o','g'],   emoji:'🐶' },
  { word:'log', parts:['l','o','g'], sounds:['l','o','g'],   emoji:'🪵' },
  { word:'sun', parts:['s','u','n'], sounds:['s','u','n'],   emoji:'☀️' },
  { word:'run', parts:['r','u','n'], sounds:['r','u','n'],   emoji:'🏃' },
  { word:'pig', parts:['p','i','g'], sounds:['p','i','g'],   emoji:'🐷' },
  { word:'dig', parts:['d','i','g'], sounds:['d','i','g'],   emoji:'⛏️' },
  { word:'pen', parts:['p','e','n'], sounds:['p','e','n'],   emoji:'✏️' },
  { word:'ten', parts:['t','e','n'], sounds:['t','e','n'],   emoji:'🔟' },
  { word:'bed', parts:['b','e','d'], sounds:['b','e','d'],   emoji:'🛏️' },
  { word:'red', parts:['r','e','d'], sounds:['r','e','d'],   emoji:'🔴' },
  { word:'top', parts:['t','o','p'], sounds:['t','o','p'],   emoji:'🌀' },
  { word:'mop', parts:['m','o','p'], sounds:['m','o','p'],   emoji:'🧹' },
  { word:'hop', parts:['h','o','p'], sounds:['h','o','p'],   emoji:'🐸' },
  { word:'map', parts:['m','a','p'], sounds:['m','a','p'],   emoji:'🗺️' },
  { word:'cap', parts:['c','a','p'], sounds:['k','a','p'],   emoji:'🧢' },
  { word:'can', parts:['c','a','n'], sounds:['k','a','n'],   emoji:'🥫' },
];

const WORD_FAMILIES = [
  { family:'-at', words:['cat','bat','hat','mat','rat'], emoji:['🐱','🦇','🎩','🧺','🐀'] },
  { family:'-an', words:['can','fan','man','pan','van'], emoji:['🥫','🌀','👨','🍳','🚐'] },
  { family:'-op', words:['mop','top','hop','pop'],       emoji:['🧹','🌀','🐸','🎈'] },
  { family:'-en', words:['pen','hen','ten'],             emoji:['✏️','🐔','🔟'] },
  { family:'-ig', words:['pig','dig','big'],             emoji:['🐷','⛏️','🐘'] },
];

const READ_WORDS = {
  level1: [
    { word:'cat', emoji:'🐱' }, { word:'dog', emoji:'🐶' }, { word:'pig', emoji:'🐷' },
    { word:'bat', emoji:'🦇' }, { word:'hat', emoji:'🎩' }, { word:'mat', emoji:'🧺' },
    { word:'sun', emoji:'☀️' }, { word:'map', emoji:'🗺️' }, { word:'pen', emoji:'✏️' },
    { word:'top', emoji:'🌀' }, { word:'bed', emoji:'🛏️' }, { word:'log', emoji:'🪵' },
    { word:'hop', emoji:'🐸' }, { word:'red', emoji:'🔴' }, { word:'can', emoji:'🥫' },
    { word:'run', emoji:'🏃' }, { word:'dig', emoji:'⛏️' }, { word:'ten', emoji:'🔟' },
    { word:'mop', emoji:'🧹' }, { word:'cap', emoji:'🧢' },
  ],
  level2: [
    { word:'cat', emoji:'🐱', family:'-at' }, { word:'bat', emoji:'🦇', family:'-at' },
    { word:'hat', emoji:'🎩', family:'-at' }, { word:'mat', emoji:'🧺', family:'-at' },
    { word:'rat', emoji:'🐀', family:'-at' },
    { word:'can', emoji:'🥫', family:'-an' }, { word:'fan', emoji:'🌀', family:'-an' },
    { word:'man', emoji:'👨', family:'-an' }, { word:'pan', emoji:'🍳', family:'-an' },
    { word:'van', emoji:'🚐', family:'-an' },
    { word:'mop', emoji:'🧹', family:'-op' }, { word:'top', emoji:'🌀', family:'-op' },
    { word:'hop', emoji:'🐸', family:'-op' }, { word:'pop', emoji:'🎈', family:'-op' },
    { word:'pen', emoji:'✏️', family:'-en' }, { word:'hen', emoji:'🐔', family:'-en' },
    { word:'ten', emoji:'🔟', family:'-en' },
    { word:'pig', emoji:'🐷', family:'-ig' }, { word:'dig', emoji:'⛏️', family:'-ig' },
    { word:'big', emoji:'🐘', family:'-ig' },
  ],
  level3: [
    { word:'I',   emoji:'👤', sentence:'I see a cat.' },
    { word:'a',   emoji:'🔡', sentence:'I see a cat.' },
    { word:'the', emoji:'📖', sentence:'See the dog.' },
    { word:'go',  emoji:'🚀', sentence:'Go, go, go!' },
    { word:'see', emoji:'👀', sentence:'I see a cat.' },
    { word:'my',  emoji:'💛', sentence:'My hat.' },
  ],
};

const TRACE_MESSAGES = [
  'Great job! 🌟', 'Wonderful! 🎉', "You're a star! ⭐",
  'Amazing tracing! 🌈', 'Keep it up! 💪', 'Fantastic! 🎊',
  'Super tracing! 🦸', 'Well done! 🥳',
];

const ENCOURAGING_MESSAGES = [
  'Great job!', 'You did it!', 'Awesome!', 'Nice listening!',
  'Super tracing!', "Let's keep going!", 'You found a star!',
];

// Derived constant — use instead of the magic number 26.
// Defined here (after ALPHABET_DATA) so it is always in sync with the array.
const ALPHA_LEN = ALPHABET_DATA.length;

const BADGES = [
  { id:1, name:'Sound Scout',     icon:'🔊', type:'correctAnswers', threshold:10,  desc:'10 correct answers'  },
  { id:2, name:'Letter Explorer', icon:'🔤', type:'lettersTraced',  threshold:5,   desc:'5 letters traced'    },
  { id:3, name:'Word Walker',     icon:'📖', type:'wordsRead',      threshold:10,  desc:'10 words read'       },
  { id:4, name:'Reading Rocket',  icon:'🚀', type:'dailyComplete',  threshold:1,   desc:'Finish daily adventure' },
];

// ==========================================
// STATE
// ==========================================

function defaultState() {
  return {
    currentScreen: 'home',
    currentLetterIndex: 0,
    autoPlay: false,
    currentPhonicsTab: 'sounds',
    currentPhonicsWordIndex: 0,
    currentWordLevel: 1,
    currentWordIndex: 0,
    tracing: { currentLetter:'A', showGuide:true },
    stars: 0,
    earnedBadges: [],
    progress: {
      lettersLearned: [],
      lettersTraced: 0,
      wordsCompleted: [],
      wordsRead: 0,
      gamesPlayed: 0,
      gameScore: 0,
      correctAnswers: 0,
      gamesWon: 0,
      dailyComplete: 0,
    },
    settings: {
      autoRead: true,
      learningMode: 'mixed',
      speechSpeed: 'normal',
      uppercaseFirst: true,
      phonicsFirst: false,
      bedtimeMode: false,
      voiceURI: '',
    },
  };
}

let state = defaultState();

function saveState() {
  try { localStorage.setItem('ee_state', JSON.stringify(state)); } catch(e) {}
}

function loadState() {
  try {
    const saved = localStorage.getItem('ee_state');
    if (saved) {
      const parsed = JSON.parse(saved);
      state = Object.assign(defaultState(), parsed);
    }
  } catch(e) { state = defaultState(); }
}

// ==========================================
// SPEECH SYNTHESIS
// ==========================================

function speak(text, rate = 0.9, pitch = 1.1) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utt = new SpeechSynthesisUtterance(String(text));
  // Apply bedtime or slow-speech setting
  const speedMod = (state.settings.bedtimeMode || state.settings.speechSpeed === 'slow') ? SLOW_SPEECH_RATE : 1.0;
  utt.rate  = rate * speedMod;
  utt.pitch = state.settings.bedtimeMode ? 0.9 : pitch;
  utt.lang  = 'en-US';
  // Apply chosen voice if set
  if (state.settings.voiceURI) {
    const voices = window.speechSynthesis.getVoices();
    const v = voices.find(x => x.voiceURI === state.settings.voiceURI);
    if (v) utt.voice = v;
  }
  window.speechSynthesis.speak(utt);
}

function speakLetter(letter) {
  speak(letter, 0.8, 1.2);
}

// Map short sounds to phonetic strings TTS engines can pronounce clearly
const SOUND_SPEECH_MAP = {
  'a':'ah', 'e':'eh', 'i':'ih', 'o':'oh', 'u':'uh',
  'b':'buh', 'k':'kuh', 'd':'duh', 'f':'fuh', 'g':'guh',
  'h':'huh', 'j':'juh', 'l':'luh', 'm':'muh', 'n':'nuh',
  'p':'puh', 'r':'ruh', 's':'sss', 't':'tuh', 'v':'vuh',
  'w':'wuh', 'y':'yuh', 'z':'zzz', 'kw':'kwuh', 'ks':'ks',
};

const SLOW_SPEECH_RATE = 0.65;

function speakSound(sound) {
  const tts = SOUND_SPEECH_MAP[sound] || sound;
  speak(tts, 0.7, 1.2);
}

function speakWord(word) {
  speak(word, 0.85, 1.05);
}

// ==========================================
// SCREEN NAVIGATION
// ==========================================

// Screens that show a delayed ad banner.
// Home ('home') and Parent Zone ('parents') are intentionally excluded.
const MODULE_SCREENS = new Set(['letters', 'trace', 'phonics', 'words', 'game', 'adventure']);

let autoPlayTimer = null;

function showScreen(id) {
  // Cancel any active ad timer from the previous screen.
  AdManager.destroy();

  // Stop auto-play if leaving letters screen
  if (id !== 'letters' && autoPlayTimer) {
    clearInterval(autoPlayTimer);
    autoPlayTimer = null;
    state.autoPlay = false;
    const ab = document.getElementById('autoplay-btn');
    if (ab) { ab.textContent = '▶ Auto Play'; ab.classList.remove('on'); }
  }

  const screens = document.querySelectorAll('.screen');
  screens.forEach(s => s.classList.remove('active'));

  const target = document.getElementById('screen-' + id);
  if (target) target.classList.add('active');

  const topBar  = document.getElementById('top-bar');
  const bottomNav = document.getElementById('bottom-nav');
  const isHome  = (id === 'home');

  if (isHome) {
    topBar.classList.add('hidden');
    bottomNav.classList.add('hidden');
  } else {
    topBar.classList.remove('hidden');
    bottomNav.classList.remove('hidden');
  }

  // Update title
  const titleMap = {
    letters:'Learn Letters', trace:'Trace Letters', phonics:'Phonics Sounds',
    words:'Read Words', game:'Listening Game', adventure:'Daily Adventure',
    parents:'Parent Zone',
  };
  const titleEl = document.getElementById('screen-title-text');
  if (titleEl) titleEl.textContent = titleMap[id] || 'English Explorer';

  // Update nav active state
  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.screen === id);
  });

  // Update stars display
  updateStarsDisplay();

  state.currentScreen = id;
  saveState();

  // Screen-specific init
  switch(id) {
    case 'letters':   initLettersScreen(); break;
    case 'trace':     initTraceScreen(); break;
    case 'phonics':   initPhonicsScreen(); break;
    case 'words':     initWordsScreen(); break;
    case 'game':      initGameScreen(); break;
    case 'adventure': initAdventureScreen(); break;
    case 'parents':   initParentZone(); break;
  }

  // Auto-read instruction on screen enter
  if (state.settings.autoRead && id !== 'home') {
    const readMap = {
      letters:'Tap the letter. Listen to the letter name.',
      trace:'Trace the letter. Start here.',
      phonics:'Listen to the sound. Say it with me.',
      words:'Tap each letter. Now read the word.',
      game:'Listen carefully. Find the right answer.',
      adventure:"Let's go on an adventure!",
      parents:'Parent Zone',
    };
    setTimeout(() => speak(readMap[id] || '', 0.9, 1.1), 400);
  }

  // Start the delayed ad countdown for module screens.
  AdManager.init({ screenId: id, allowedScreens: MODULE_SCREENS });
}

function navigateFromHome(screenId, name) {
  speak(name, 0.9, 1.1);
  setTimeout(() => showScreen(screenId), 350);
}

// ==========================================
// HOME SCREEN
// ==========================================

function updateGreeting() {
  const h = new Date().getHours();
  const greet = h < 12 ? 'Good morning, Explorer! ☀️'
              : h < 17 ? 'Hello, Explorer! 👋'
              : 'Good evening, Explorer! 🌙';
  const el = document.getElementById('greeting-text');
  if (el) el.textContent = greet;
}

function speakWelcome() {
  if (state.settings.autoRead) {
    setTimeout(() => speak('Welcome to English Explorer. Let\'s learn English together.', 0.85, 1.1), 600);
  }
}

// ==========================================
// PARENT HOLD BUTTON
// ==========================================

let parentHoldTimer = null;

function startParentHold(e) {
  if (e) e.preventDefault();
  cancelParentHold();
  let progress = 0;
  const bars = document.querySelectorAll('.hold-bar-fill, .nav-hold-fill');
  bars.forEach(b => { b.style.width = '0%'; });

  parentHoldTimer = setInterval(() => {
    progress += 2;
    bars.forEach(b => { b.style.width = progress + '%'; });
    if (progress >= 100) {
      cancelParentHold();
      showScreen('parents');
    }
  }, 40);
}

function cancelParentHold() {
  if (parentHoldTimer) { clearInterval(parentHoldTimer); parentHoldTimer = null; }
  document.querySelectorAll('.hold-bar-fill, .nav-hold-fill').forEach(b => { b.style.width = '0%'; });
}

// ==========================================
// LEARN LETTERS SCREEN
// ==========================================

function initLettersScreen() {
  renderLetterScreen();
  renderProgressDots();
}

function renderLetterScreen() {
  const d = ALPHABET_DATA[state.currentLetterIndex];
  document.getElementById('letter-upper').textContent = d.upper;
  document.getElementById('letter-lower').textContent = d.lower;
  document.getElementById('ex1-emoji').textContent    = d.emoji;
  document.getElementById('ex1-word').textContent     = d.word;
  document.getElementById('ex2-emoji').textContent    = d.emoji2;
  document.getElementById('ex2-word').textContent     = d.word2;
  document.getElementById('letter-num').textContent   = state.currentLetterIndex + 1;

  const learned = state.progress.lettersLearned.length;
  const lp = document.getElementById('letters-learned-pill');
  if (lp) lp.textContent = learned + ' learned ⭐';

  markLetterLearned(state.currentLetterIndex);
}

function renderProgressDots() {
  const container = document.getElementById('letter-progress-dots');
  if (!container) return;
  container.innerHTML = '';
  ALPHABET_DATA.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = 'pdot';
    if (state.progress.lettersLearned.includes(i)) dot.classList.add('done');
    if (i === state.currentLetterIndex) dot.classList.add('current');
    dot.title = ALPHABET_DATA[i].letter;
    container.appendChild(dot);
  });
}

function markLetterLearned(index) {
  if (!state.progress.lettersLearned.includes(index)) {
    state.progress.lettersLearned.push(index);
    saveState();
  }
}

function prevLetter() {
  state.currentLetterIndex = (state.currentLetterIndex - 1 + ALPHA_LEN) % ALPHA_LEN;
  renderLetterScreen();
  renderProgressDots();
  saveState();
}

function nextLetter() {
  state.currentLetterIndex = (state.currentLetterIndex + 1) % ALPHA_LEN;
  renderLetterScreen();
  renderProgressDots();
  saveState();
}

function toggleAutoPlay() {
  state.autoPlay = !state.autoPlay;
  const btn = document.getElementById('autoplay-btn');
  if (state.autoPlay) {
    if (btn) { btn.textContent = '⏸ Stop Auto'; btn.classList.add('on'); }
    autoPlayTimer = setInterval(() => {
      nextLetter();
      const d = ALPHABET_DATA[state.currentLetterIndex];
      setTimeout(() => speakLetter(d.letter), 100);
    }, 3000);
    const d = ALPHABET_DATA[state.currentLetterIndex];
    speakLetter(d.letter);
  } else {
    if (btn) { btn.textContent = '▶ Auto Play'; btn.classList.remove('on'); }
    if (autoPlayTimer) { clearInterval(autoPlayTimer); autoPlayTimer = null; }
  }
  saveState();
}

function onHearLetter() {
  speakLetter(ALPHABET_DATA[state.currentLetterIndex].letter);
}
function onHearSound() {
  speakSound(ALPHABET_DATA[state.currentLetterIndex].sound);
}
function onHearWord() {
  speakWord(ALPHABET_DATA[state.currentLetterIndex].word);
}
function onHearWord2() {
  speakWord(ALPHABET_DATA[state.currentLetterIndex].word2);
}

// ==========================================
// TRACE SCREEN
// ==========================================

let drawCtx  = null;
let guideCtx = null;
let isDrawing = false;
let lastX = 0;
let lastY = 0;
let traceInactivityTimer = null;
let traceHasContent = false;

function initTraceScreen() {
  const guideCanvas = document.getElementById('guide-canvas');
  const drawCanvas  = document.getElementById('draw-canvas');
  if (!guideCanvas || !drawCanvas) return;

  guideCtx = guideCanvas.getContext('2d');
  drawCtx  = drawCanvas.getContext('2d');

  setupDrawEvents(drawCanvas);
  renderTracePicker();
  renderGuide(state.tracing.currentLetter);

  const tld = document.getElementById('trace-letter-display');
  if (tld) tld.textContent = state.tracing.currentLetter;

  const gtb = document.getElementById('guide-toggle-btn');
  if (gtb) {
    gtb.textContent = state.tracing.showGuide ? '👁️ Guide: ON' : '👁️ Guide: OFF';
    gtb.classList.toggle('active-guide', !state.tracing.showGuide);
  }
}

function setupDrawEvents(canvas) {
  // Use AbortController so all listeners can be cleanly removed when the trace
  // screen is re-entered, without needing to store individual listener references.
  if (canvas._drawAbort) canvas._drawAbort.abort();
  canvas._drawAbort = new AbortController();
  const sig = canvas._drawAbort.signal;
  drawCtx = canvas.getContext('2d');
  const dc = canvas;

  dc.addEventListener('mousedown',  e => { e.preventDefault(); const c = getCanvasCoords(dc, e); startDraw(c.x, c.y); }, { signal: sig });
  dc.addEventListener('mousemove',  e => { e.preventDefault(); const c = getCanvasCoords(dc, e); continueDraw(c.x, c.y); }, { signal: sig });
  dc.addEventListener('mouseup',    e => { e.preventDefault(); endDraw(); }, { signal: sig });
  dc.addEventListener('mouseleave', e => { if (isDrawing) endDraw(); }, { signal: sig });

  dc.addEventListener('touchstart',  e => { e.preventDefault(); const c = getCanvasCoords(dc, e); startDraw(c.x, c.y); }, { passive:false, signal: sig });
  dc.addEventListener('touchmove',   e => { e.preventDefault(); const c = getCanvasCoords(dc, e); continueDraw(c.x, c.y); }, { passive:false, signal: sig });
  dc.addEventListener('touchend',    e => { e.preventDefault(); endDraw(); }, { passive:false, signal: sig });
  dc.addEventListener('touchcancel', e => { e.preventDefault(); endDraw(); }, { passive:false, signal: sig });
}

function getCanvasCoords(canvas, e) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width  / rect.width;
  const scaleY = canvas.height / rect.height;
  let cx, cy;
  if (e.touches && e.touches.length > 0) {
    cx = e.touches[0].clientX;
    cy = e.touches[0].clientY;
  } else {
    cx = e.clientX;
    cy = e.clientY;
  }
  return { x: (cx - rect.left) * scaleX, y: (cy - rect.top) * scaleY };
}

function startDraw(x, y) {
  if (!drawCtx) return;
  isDrawing = true;
  lastX = x; lastY = y;
  drawCtx.beginPath();
  drawCtx.moveTo(x, y);
  resetTraceInactivity();
}

function continueDraw(x, y) {
  if (!isDrawing || !drawCtx) return;
  drawCtx.strokeStyle = '#FF6B6B';
  drawCtx.lineWidth   = 10;
  drawCtx.lineCap     = 'round';
  drawCtx.lineJoin    = 'round';
  drawCtx.lineTo(x, y);
  drawCtx.stroke();
  drawCtx.beginPath();
  drawCtx.moveTo(x, y);
  lastX = x; lastY = y;
  traceHasContent = true;
  resetTraceInactivity();
}

function endDraw() {
  if (!isDrawing) return;
  isDrawing = false;
  if (drawCtx) { drawCtx.beginPath(); }
}

function resetTraceInactivity() {
  if (traceInactivityTimer) clearTimeout(traceInactivityTimer);
  if (traceHasContent) {
    traceInactivityTimer = setTimeout(showTraceEncouragement, 3000);
  }
}

function showTraceEncouragement() {
  const msg = TRACE_MESSAGES[Math.floor(Math.random() * TRACE_MESSAGES.length)];
  const el = document.getElementById('trace-msg');
  if (el) {
    el.textContent = msg;
    el.style.color = '#FF6B6B';
    setTimeout(() => {
      if (el) { el.textContent = '✏️ Trace the letter!'; el.style.color = ''; }
    }, 2500);
  }
  speak(msg.replace(/[^\w\s!]/g, ''), 1.0, 1.2);
  addStars(1);
  // Track letters traced for Letter Explorer badge
  state.progress.lettersTraced = (state.progress.lettersTraced || 0) + 1;
  saveState();
  checkBadgeMilestones();
}

function clearDrawCanvas() {
  const dc = document.getElementById('draw-canvas');
  if (!dc) return;
  drawCtx = dc.getContext('2d');
  drawCtx.clearRect(0, 0, dc.width, dc.height);
  traceHasContent = false;
  if (traceInactivityTimer) { clearTimeout(traceInactivityTimer); traceInactivityTimer = null; }
  const el = document.getElementById('trace-msg');
  if (el) { el.textContent = '✏️ Trace the letter!'; el.style.color = ''; }
}

function toggleGuide() {
  state.tracing.showGuide = !state.tracing.showGuide;
  const btn = document.getElementById('guide-toggle-btn');
  if (btn) {
    btn.textContent = state.tracing.showGuide ? '👁️ Guide: ON' : '👁️ Guide: OFF';
    btn.classList.toggle('active-guide', !state.tracing.showGuide);
  }
  renderGuide(state.tracing.currentLetter);
  saveState();
}

function renderGuide(letter) {
  const gc = document.getElementById('guide-canvas');
  if (!gc) return;
  guideCtx = gc.getContext('2d');
  guideCtx.clearRect(0, 0, gc.width, gc.height);
  if (!state.tracing.showGuide) return;

  // Draw faint letter background
  guideCtx.font = 'bold 220px "Fredoka One", cursive';
  guideCtx.textAlign    = 'center';
  guideCtx.textBaseline = 'middle';
  guideCtx.fillStyle    = 'rgba(200, 200, 220, 0.30)';
  guideCtx.fillText(letter, 150, 158);

  // Draw stroke-start numbered circles
  const hints = STROKE_HINTS[letter] || [{ x:0.5, y:0.15, n:1 }];
  hints.forEach(h => {
    const px = h.x * gc.width;
    const py = h.y * gc.height;
    guideCtx.beginPath();
    guideCtx.arc(px, py, 14, 0, Math.PI * 2);
    guideCtx.fillStyle   = 'rgba(255,107,107,0.80)';
    guideCtx.fill();
    guideCtx.fillStyle   = '#fff';
    guideCtx.font        = 'bold 14px "Nunito", sans-serif';
    guideCtx.textAlign   = 'center';
    guideCtx.textBaseline = 'middle';
    guideCtx.fillText(String(h.n), px, py);
  });
}

// Stroke hint start positions (normalised 0-1 coords)
const STROKE_HINTS = {
  A:[ {x:0.5, y:0.12, n:1}, {x:0.28,y:0.62, n:3} ],
  B:[ {x:0.28,y:0.12, n:1} ],
  C:[ {x:0.78,y:0.26, n:1} ],
  D:[ {x:0.28,y:0.12, n:1} ],
  E:[ {x:0.28,y:0.12, n:1}, {x:0.28,y:0.52, n:3} ],
  F:[ {x:0.28,y:0.12, n:1}, {x:0.28,y:0.50, n:3} ],
  G:[ {x:0.78,y:0.26, n:1} ],
  H:[ {x:0.26,y:0.12, n:1}, {x:0.74,y:0.12, n:2} ],
  I:[ {x:0.50,y:0.12, n:1} ],
  J:[ {x:0.66,y:0.12, n:1} ],
  K:[ {x:0.28,y:0.12, n:1}, {x:0.72,y:0.12, n:2} ],
  L:[ {x:0.28,y:0.12, n:1} ],
  M:[ {x:0.22,y:0.12, n:1} ],
  N:[ {x:0.24,y:0.12, n:1} ],
  O:[ {x:0.50,y:0.12, n:1} ],
  P:[ {x:0.28,y:0.12, n:1} ],
  Q:[ {x:0.50,y:0.12, n:1} ],
  R:[ {x:0.28,y:0.12, n:1} ],
  S:[ {x:0.72,y:0.22, n:1} ],
  T:[ {x:0.22,y:0.12, n:1}, {x:0.50,y:0.12, n:2} ],
  U:[ {x:0.26,y:0.12, n:1} ],
  V:[ {x:0.22,y:0.12, n:1} ],
  W:[ {x:0.16,y:0.12, n:1} ],
  X:[ {x:0.22,y:0.12, n:1}, {x:0.78,y:0.12, n:2} ],
  Y:[ {x:0.22,y:0.12, n:1} ],
  Z:[ {x:0.22,y:0.12, n:1} ],
};

function renderTracePicker() {
  const container = document.getElementById('trace-picker');
  if (!container) return;
  container.innerHTML = '';
  ALPHABET_DATA.forEach(d => {
    const btn = document.createElement('button');
    btn.className = 'trace-pick-btn';
    btn.textContent = d.letter;
    if (d.letter === state.tracing.currentLetter) btn.classList.add('active-pick');
    btn.onclick = () => selectTraceLetter(d.letter);
    container.appendChild(btn);
  });
}

function selectTraceLetter(letter) {
  state.tracing.currentLetter = letter;
  saveState();
  clearDrawCanvas();
  renderGuide(letter);
  renderTracePicker();
  const el = document.getElementById('trace-letter-display');
  if (el) el.textContent = letter;
  const msg = document.getElementById('trace-msg');
  if (msg) { msg.textContent = '✏️ Trace the letter!'; msg.style.color = ''; }
  speakLetter(letter);
}

function nextTraceLetter() {
  const idx = ALPHABET_DATA.findIndex(d => d.letter === state.tracing.currentLetter);
  const next = ALPHABET_DATA[(idx + 1) % ALPHA_LEN].letter;
  selectTraceLetter(next);
}

function speakCurrentTraceLetter() {
  speakLetter(state.tracing.currentLetter);
}

// ==========================================
// PHONICS SCREEN
// ==========================================

function initPhonicsScreen() {
  renderPhonicsGrid();
  showPhonicsTab(state.currentPhonicsTab || 'sounds');
  renderBlendWord(state.currentPhonicsWordIndex);
}

function showPhonicsTab(tab) {
  state.currentPhonicsTab = tab;
  document.getElementById('phonics-tab-sounds').classList.toggle('active', tab === 'sounds');
  document.getElementById('phonics-tab-blend').classList.toggle('active',  tab === 'blend');
  document.getElementById('tab-btn-sounds').classList.toggle('active', tab === 'sounds');
  document.getElementById('tab-btn-blend').classList.toggle('active',  tab === 'blend');
  saveState();
}

const PHONICS_STAGE1_VOWELS = ['A','E','I','O','U'];
const PHONICS_STAGE1_CONS   = ['B','C','D','F','G','H','M','N','P','S','T'];

function renderPhonicsGrid() {
  const vowelsGrid = document.getElementById('phonics-vowels-grid');
  const consGrid   = document.getElementById('phonics-cons-grid');
  if (!vowelsGrid || !consGrid) return;
  vowelsGrid.innerHTML = '';
  consGrid.innerHTML   = '';

  ALPHABET_DATA.forEach(d => {
    const btn = document.createElement('button');
    btn.className   = 'phonics-ltr-btn';
    btn.textContent = d.letter;
    btn.title       = d.sound;
    btn.onclick = () => {
      speakSound(d.sound);
      btn.classList.add('popping');
      setTimeout(() => btn.classList.remove('popping'), 350);
    };
    if (PHONICS_STAGE1_VOWELS.includes(d.letter)) {
      btn.classList.add('phonics-vowel');
      vowelsGrid.appendChild(btn);
    } else if (PHONICS_STAGE1_CONS.includes(d.letter)) {
      btn.classList.add('phonics-cons');
      consGrid.appendChild(btn);
    } else {
      consGrid.appendChild(btn);
    }
  });
}

function renderBlendWord(index) {
  const w = PHONICS_WORDS[index];
  if (!w) return;

  document.getElementById('blend-emoji').textContent = w.emoji;
  document.getElementById('blend-num').textContent   = index + 1;
  document.getElementById('blend-total').textContent = PHONICS_WORDS.length;

  const row = document.getElementById('blend-parts-row');
  if (!row) return;
  row.innerHTML = '';

  w.parts.forEach((part, i) => {
    const btn = document.createElement('button');
    btn.className = 'blend-part-btn';
    btn.innerHTML = `<span class="blend-part-letter">${part}</span><span class="blend-part-sound">${w.sounds[i]}</span>`;
    btn.onclick = () => speakSound(w.sounds[i]);
    row.appendChild(btn);

    if (i < w.parts.length - 1) {
      const plus = document.createElement('span');
      plus.className   = 'blend-plus';
      plus.textContent = '+';
      row.appendChild(plus);
    }
  });
}

function prevPhonicsWord() {
  state.currentPhonicsWordIndex = (state.currentPhonicsWordIndex - 1 + PHONICS_WORDS.length) % PHONICS_WORDS.length;
  renderBlendWord(state.currentPhonicsWordIndex);
  saveState();
}

function nextPhonicsWord() {
  state.currentPhonicsWordIndex = (state.currentPhonicsWordIndex + 1) % PHONICS_WORDS.length;
  renderBlendWord(state.currentPhonicsWordIndex);
  saveState();
}

function blendWord() {
  const w = PHONICS_WORDS[state.currentPhonicsWordIndex];
  if (!w) return;
  speak(w.word, 0.75, 1.05);
}

function blendWordSlow() {
  const w = PHONICS_WORDS[state.currentPhonicsWordIndex];
  if (!w) return;
  // Speak each phoneme with delay, then full word
  let delay = 0;
  w.parts.forEach((part, i) => {
    setTimeout(() => speakSound(w.sounds[i]), delay);
    delay += 750;
  });
  setTimeout(() => speak(w.word, 0.6, 1.05), delay + 300);
}

// ==========================================
// READ WORDS SCREEN
// ==========================================

function initWordsScreen() {
  renderWordCard();
}

function setWordLevel(level) {
  state.currentWordLevel = level;
  state.currentWordIndex = 0;
  for (let i = 1; i <= 3; i++) {
    const btn = document.getElementById('lvl-btn-' + i);
    if (btn) btn.classList.toggle('active', i === level);
  }
  renderWordCard();
  saveState();
}

function renderWordCard() {
  const list   = READ_WORDS['level' + state.currentWordLevel];
  const entry  = list[state.currentWordIndex];
  if (!entry) return;

  document.getElementById('rw-emoji').textContent = entry.emoji;

  const lettersDiv = document.getElementById('rw-letters');
  lettersDiv.innerHTML = '';
  const word = entry.word;
  const family = entry.family || '';
  const endingLen = family.length > 1 ? family.length - 1 : 0; // -at → 'at' = 2 chars

  word.split('').forEach((ch, idx) => {
    const btn = document.createElement('button');
    btn.className = 'rw-letter-btn';
    // Highlight the shared family ending
    if (endingLen > 0 && idx >= word.length - endingLen) {
      btn.classList.add('rw-family-end');
    }
    btn.textContent = ch;
    btn.onclick = () => {
      speak(ch, 0.7, 1.2);
      btn.classList.add('rw-tapped');
      setTimeout(() => btn.classList.remove('rw-tapped'), 400);
    };
    lettersDiv.appendChild(btn);
  });

  const familyTag = document.getElementById('rw-family-tag');
  if (entry.family) {
    familyTag.textContent = 'Word family: ' + entry.family;
    familyTag.style.display = 'block';
  } else {
    familyTag.textContent = '';
    familyTag.style.display = 'none';
  }

  // Sight word sentence display
  const sentenceEl = document.getElementById('rw-sentence');
  if (sentenceEl) {
    if (entry.sentence) {
      sentenceEl.textContent = entry.sentence;
      sentenceEl.style.display = 'block';
    } else {
      sentenceEl.textContent = '';
      sentenceEl.style.display = 'none';
    }
  }

  const counter = document.getElementById('word-counter');
  if (counter) counter.textContent = (state.currentWordIndex + 1) + ' / ' + list.length;

  // Mark as completed
  markWordCompleted(entry.word);
}

function markWordCompleted(word) {
  if (!state.progress.wordsCompleted.includes(word)) {
    state.progress.wordsCompleted.push(word);
    state.progress.wordsRead = (state.progress.wordsRead || 0) + 1;
    saveState();
    checkBadgeMilestones();
  }
}

function prevWord() {
  const list = READ_WORDS['level' + state.currentWordLevel];
  state.currentWordIndex = (state.currentWordIndex - 1 + list.length) % list.length;
  renderWordCard();
  saveState();
}

function nextWord() {
  const list = READ_WORDS['level' + state.currentWordLevel];
  state.currentWordIndex = (state.currentWordIndex + 1) % list.length;
  renderWordCard();
  saveState();
}

function getCurrentWord() {
  const list = READ_WORDS['level' + state.currentWordLevel];
  return list[state.currentWordIndex].word;
}

function hearCurrentWord() {
  speakWord(getCurrentWord());
}

function readWithMe() {
  const list  = READ_WORDS['level' + state.currentWordLevel];
  const entry = list[state.currentWordIndex];
  const word  = entry.word;
  const letters = word.split('');
  let delay = 0;

  speak('Tap each letter.', 0.85, 1.1);
  delay += 1200;

  // Spell out each letter
  letters.forEach(ch => {
    setTimeout(() => speak(ch, 0.7, 1.2), delay);
    delay += 650;
  });

  // Now blend slowly
  setTimeout(() => speak('Now blend the sounds.', 0.85, 1.1), delay);
  delay += 1200;
  setTimeout(() => speak(word, 0.55, 1.05), delay);
  delay += 1400;

  // Say normally
  setTimeout(() => speak(word, 0.9, 1.1), delay);
  delay += 900;

  // Read sentence aloud if sight word
  if (entry.sentence) {
    setTimeout(() => speak(entry.sentence, 0.8, 1.05), delay);
  }

  addStars(1);
}

// ==========================================
// GAME SCREEN
// ==========================================

const gameState = {
  type: null,
  score: 0,
  lives: 3,
  qNum: 0,
  totalQ: 6,
  currentQ: null,
  waitingForAnswer: false,
};

function initGameScreen() {
  showGameSelector();
}

function showGameSelector() {
  document.getElementById('game-selector').classList.remove('hidden');
  document.getElementById('game-active').classList.add('hidden');
  document.getElementById('game-over').classList.add('hidden');
  gameState.waitingForAnswer = false;
}

function startGame(type) {
  gameState.type  = type;
  gameState.score = 0;
  gameState.lives = 3;
  gameState.qNum  = 0;
  gameState.waitingForAnswer = false;

  document.getElementById('game-selector').classList.add('hidden');
  document.getElementById('game-active').classList.remove('hidden');
  document.getElementById('game-over').classList.add('hidden');
  document.getElementById('game-score').textContent = '0';
  document.getElementById('game-feedback').textContent = '';

  updateGameLives();
  generateQuestion();

  state.progress.gamesPlayed++;
  saveState();
}

function quitGame() {
  showGameSelector();
}

function updateGameLives() {
  for (let i = 0; i < 3; i++) {
    const el = document.getElementById('life-' + i);
    if (el) el.classList.toggle('lost', i >= gameState.lives);
  }
}

function generateQuestion() {
  if (gameState.qNum >= gameState.totalQ) { endGame(); return; }
  gameState.qNum++;
  gameState.waitingForAnswer = true;
  document.getElementById('game-feedback').textContent = '';

  switch (gameState.type) {
    case 'findLetter': genFindLetterQ(); break;
    case 'findSound':  genFindSoundQ();  break;
    case 'matchWord':  genMatchWordQ();  break;
  }
}

function playGameQuestion() {
  if (!gameState.currentQ) return;
  speak(gameState.currentQ.prompt, 0.8, 1.1);
}

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function randInt(max) { return Math.floor(Math.random() * max); }

// Game A: Find the Letter
function genFindLetterQ() {
  const correctIdx = randInt(ALPHA_LEN);
  const correct    = ALPHABET_DATA[correctIdx];
  const distractors = shuffleArray(ALPHABET_DATA.filter((_, i) => i !== correctIdx)).slice(0, 3);
  const options     = shuffleArray([correct, ...distractors]);
  const prompt = 'Find the letter ' + correct.letter;

  gameState.currentQ = { prompt, correct: correct.letter, type: 'letter' };

  document.getElementById('game-question').textContent = '👂 ' + prompt;
  setTimeout(() => speak(prompt, 0.85, 1.1), 300);

  const container = document.getElementById('answer-options');
  container.innerHTML = '';
  options.forEach(opt => {
    const btn = document.createElement('button');
    btn.className   = 'answer-btn';
    btn.innerHTML   = `<span>${opt.letter}</span>`;
    btn.onclick = () => checkAnswer(opt.letter, correct.letter, btn, container);
    container.appendChild(btn);
  });
}

// Game B: Find the Sound
function genFindSoundQ() {
  const correctIdx = randInt(ALPHA_LEN);
  const correct    = ALPHABET_DATA[correctIdx];
  const distractors = shuffleArray(ALPHABET_DATA.filter((_, i) => i !== correctIdx)).slice(0, 3);
  const options     = shuffleArray([correct, ...distractors]);
  const prompt = 'Find the letter that makes the sound ' + correct.sound;

  gameState.currentQ = { prompt, correct: correct.letter, type: 'sound' };
  document.getElementById('game-question').textContent = '👂 Which letter says "' + correct.sound + '"?';
  setTimeout(() => speakSound(correct.sound), 300);

  const container = document.getElementById('answer-options');
  container.innerHTML = '';
  options.forEach(opt => {
    const btn = document.createElement('button');
    btn.className   = 'answer-btn';
    btn.innerHTML   = `<span>${opt.letter}</span><span class="answer-btn-label">"${opt.sound}"</span>`;
    btn.onclick = () => checkAnswer(opt.letter, correct.letter, btn, container);
    container.appendChild(btn);
  });
}

// Game C: Match the Word
function genMatchWordQ() {
  const allWords  = READ_WORDS.level1;
  const correctIdx = randInt(allWords.length);
  const correct   = allWords[correctIdx];
  const distractors = shuffleArray(allWords.filter((_, i) => i !== correctIdx)).slice(0, 2);
  const options   = shuffleArray([correct, ...distractors]);
  const prompt = 'Find the word ' + correct.word;

  gameState.currentQ = { prompt, correct: correct.word, type: 'word' };
  document.getElementById('game-question').textContent = '👂 Find the word!';
  setTimeout(() => speakWord(correct.word), 300);

  const container = document.getElementById('answer-options');
  container.innerHTML = '';
  container.style.gridTemplateColumns = '1fr 1fr 1fr';
  options.forEach(opt => {
    const btn = document.createElement('button');
    btn.className   = 'answer-btn';
    btn.style.fontSize = '18px';
    btn.innerHTML   = `<span style="font-size:30px">${opt.emoji}</span><span style="font-family:var(--font-h);font-size:22px">${opt.word}</span>`;
    btn.onclick = () => {
      checkAnswer(opt.word, correct.word, btn, container);
      container.style.gridTemplateColumns = '';
    };
    container.appendChild(btn);
  });
}

function checkAnswer(given, correct, btn, container) {
  if (!gameState.waitingForAnswer) return;
  gameState.waitingForAnswer = false;

  const isCorrect = (given === correct);
  const allBtns   = container.querySelectorAll('.answer-btn');
  allBtns.forEach(b => { b.style.pointerEvents = 'none'; });

  if (isCorrect) {
    btn.classList.add('correct');
    const msg = ENCOURAGING_MESSAGES[Math.floor(Math.random() * ENCOURAGING_MESSAGES.length)];
    document.getElementById('game-feedback').textContent = '⭐ ' + msg + ' 🎉';
    speak(msg, 1.0, 1.3);
    gameState.score++;
    document.getElementById('game-score').textContent = gameState.score;
    addStars(1);
    state.progress.gameScore++;
    state.progress.correctAnswers = (state.progress.correctAnswers || 0) + 1;
    saveState();
    checkBadgeMilestones();
  } else {
    btn.classList.add('wrong');
    // Highlight correct
    allBtns.forEach(b => {
      const text = b.textContent.trim();
      if (text.includes(correct)) b.classList.add('correct');
    });
    document.getElementById('game-feedback').textContent = 'Try again! 🤗';
    speak('Try again!', 1.0, 1.1);
    gameState.lives--;
    updateGameLives();
    if (gameState.lives <= 0) {
      setTimeout(() => endGame(), 1200);
      return;
    }
  }

  setTimeout(() => generateQuestion(), 1500);
}

function endGame() {
  document.getElementById('game-active').classList.add('hidden');
  document.getElementById('game-over').classList.remove('hidden');
  document.getElementById('final-score').textContent = gameState.score;
  addStars(gameState.score);
  if (gameState.score >= 3) {
    state.progress.gamesWon = (state.progress.gamesWon || 0) + 1;
    saveState();
  }
  speak('Well done! You got ' + gameState.score + ' stars!', 0.9, 1.1);
}

// ==========================================
// DAILY ADVENTURE SCREEN
// ==========================================

function initAdventureScreen() {
  const today = new Date();
  const dateEl = document.getElementById('adventure-date');
  if (dateEl) {
    dateEl.textContent = today.toLocaleDateString('en-US', { weekday:'long', month:'long', day:'numeric' });
  }

  const adventure  = getDailyAdventure();
  const completed  = getAdventureProgress();
  const stepsEl    = document.getElementById('adventure-steps');
  if (!stepsEl) return;
  stepsEl.innerHTML = '';

  const allDone = completed.length >= adventure.steps.length;
  document.getElementById('adventure-complete').classList.toggle('hidden', !allDone);

  adventure.steps.forEach((step, i) => {
    const isDone    = completed.includes(i);
    const isCurrent = !isDone && completed.length === i;

    const div = document.createElement('div');
    div.className = 'adventure-step' + (isDone ? ' step-done' : '') + (isCurrent ? ' step-current' : '');

    div.innerHTML = `
      <span class="adv-step-emoji">${step.emoji}</span>
      <span class="adv-step-label">${step.label}</span>
      <span class="adv-step-check">${isDone ? '✅' : (isCurrent ? '▶️' : '⭕')}</span>
    `;

    div.onclick = () => {
      completeAdventureStep(i);
      navigateToAdventureStep(step);
    };
    stepsEl.appendChild(div);
  });
}

function getDailyAdventure() {
  const now = new Date();
  // Use a compact YYYYMMDD integer so the seed is always unique per calendar day.
  const seed = now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
  const AL   = ALPHA_LEN;
  const WL   = READ_WORDS.level1.length;
  const lo   = (seed * 3) % AL;
  const wo   = (seed * 5) % WL;

  const l  = i => ALPHABET_DATA[(lo + i) % AL];
  const w  = i => READ_WORDS.level1[(wo + i) % WL];

  return {
    steps: [
      { type:'letter', data:l(0).letter,  label:`Learn "${l(0).letter}"`,   emoji:'🔤' },
      { type:'letter', data:l(1).letter,  label:`Learn "${l(1).letter}"`,   emoji:'🔤' },
      { type:'letter', data:l(2).letter,  label:`Learn "${l(2).letter}"`,   emoji:'🔤' },
      { type:'trace',  data:l(3).letter,  label:`Trace "${l(3).letter}"`,   emoji:'✏️' },
      { type:'trace',  data:l(4).letter,  label:`Trace "${l(4).letter}"`,   emoji:'✏️' },
      { type:'word',   data:w(0).word,    label:`Read "${w(0).word}"`,       emoji:w(0).emoji },
      { type:'word',   data:w(1).word,    label:`Read "${w(1).word}"`,       emoji:w(1).emoji },
      { type:'word',   data:w(2).word,    label:`Read "${w(2).word}"`,       emoji:w(2).emoji },
      { type:'game',   data:'findLetter', label:'Play a Game!',              emoji:'🎮' },
    ],
  };
}

function getAdventureProgress() {
  try {
    const today = new Date().toDateString();
    const saved = localStorage.getItem('ee_adventure');
    if (saved) {
      const p = JSON.parse(saved);
      if (p.date === today) return p.completed || [];
    }
  } catch(e) {}
  return [];
}

function saveAdventureProgress(completed) {
  try {
    const today = new Date().toDateString();
    localStorage.setItem('ee_adventure', JSON.stringify({ date: today, completed }));
  } catch(e) {}
}

function completeAdventureStep(index) {
  const adventure = getDailyAdventure();
  const completed = getAdventureProgress();
  if (!completed.includes(index)) {
    completed.push(index);
    saveAdventureProgress(completed);
    addStars(1);
    // Check if all steps done
    if (completed.length >= adventure.steps.length) {
      state.progress.dailyComplete = (state.progress.dailyComplete || 0) + 1;
      saveState();
      checkBadgeMilestones();
      setTimeout(() => speak('Daily Adventure Complete! You are amazing!', 0.85, 1.2), 400);
    }
  }
}

function navigateToAdventureStep(step) {
  switch (step.type) {
    case 'letter':
      state.currentLetterIndex = ALPHABET_DATA.findIndex(d => d.letter === step.data);
      showScreen('letters');
      break;
    case 'trace':
      state.tracing.currentLetter = step.data;
      showScreen('trace');
      break;
    case 'word':
      state.currentWordLevel = 1;
      state.currentWordIndex = READ_WORDS.level1.findIndex(w => w.word === step.data);
      if (state.currentWordIndex < 0) state.currentWordIndex = 0;
      showScreen('words');
      break;
    case 'game':
      showScreen('game');
      break;
  }
}

// ==========================================
// PARENT ZONE
// ==========================================

function initParentZone() {
  updateParentStats();
  updateBadgeDisplay();
  populateVoiceList();
  // Load settings into UI
  const ar = document.getElementById('setting-autoread');
  if (ar) ar.checked = state.settings.autoRead;
  const sm = document.getElementById('setting-mode');
  if (sm) sm.value = state.settings.learningMode;
  const ss = document.getElementById('setting-speed');
  if (ss) ss.value = state.settings.speechSpeed || 'normal';
  const uf = document.getElementById('setting-uppercase');
  if (uf) uf.checked = state.settings.uppercaseFirst !== false;
  const pf = document.getElementById('setting-phonics');
  if (pf) pf.checked = !!state.settings.phonicsFirst;
  const bm = document.getElementById('setting-bedtime');
  if (bm) bm.checked = !!state.settings.bedtimeMode;
  applyBedtimeMode();
}

function populateVoiceList() {
  const sel = document.getElementById('setting-voice');
  if (!sel || !window.speechSynthesis) return;
  const voices = window.speechSynthesis.getVoices();
  sel.innerHTML = '<option value="">Default voice</option>';
  voices.filter(v => v.lang.startsWith('en')).forEach(v => {
    const opt = document.createElement('option');
    opt.value = v.voiceURI;
    opt.textContent = v.name;
    if (v.voiceURI === state.settings.voiceURI) opt.selected = true;
    sel.appendChild(opt);
  });
}

function applyBedtimeMode() {
  document.body.classList.toggle('bedtime-mode', !!state.settings.bedtimeMode);
}

function updateParentStats() {
  const ll = state.progress.lettersLearned.length;
  const lt = state.progress.lettersTraced || 0;
  const wc = state.progress.wordsCompleted.length;
  const wr = state.progress.wordsRead || 0;
  const gp = state.progress.gamesPlayed;
  const gw = state.progress.gamesWon || 0;

  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  const setW = (id, pct) => { const el = document.getElementById(id); if (el) el.style.width = Math.min(pct,100) + '%'; };

  set('stat-letters',       ll + ' / ' + ALPHA_LEN);
  set('stat-letters-traced', lt);
  set('stat-words',         wc);
  set('stat-words-read',    wr);
  set('stat-games',         gp);
  set('stat-games-won',     gw);
  set('stat-stars',         state.stars);
  setW('sb-letters', (ll / ALPHA_LEN) * 100);
  setW('sb-words',   Math.min((wc / 30) * 100, 100));
}

function updateBadgeDisplay() {
  BADGES.forEach(badge => {
    const tile = document.getElementById('badge-tile-' + badge.id);
    const icon = document.getElementById('badge-icon-' + badge.id);
    const earned = state.earnedBadges.includes(badge.id);
    if (tile) tile.classList.toggle('unlocked', earned);
    if (icon) icon.textContent = earned ? badge.icon : '🔒';
  });
}

function confirmReset() {
  if (confirm('Reset all progress? This cannot be undone.')) {
    resetProgress();
  }
}

function resetProgress() {
  state = defaultState();
  saveState();
  try { localStorage.removeItem('ee_adventure'); } catch(e) {}
  updateParentStats();
  updateBadgeDisplay();
  updateStarsDisplay();
  applyBedtimeMode();
  speak('Progress reset!', 0.9, 1.1);
}

function resetDailyAdventure() {
  try { localStorage.removeItem('ee_adventure'); } catch(e) {}
  speak('Daily Adventure reset!', 0.9, 1.1);
}

// ==========================================
// REWARDS & STARS
// ==========================================

function addStars(n) {
  n = n || 1;
  state.stars += n;
  saveState();
  updateStarsDisplay();
  showStarPop();
  checkBadgeMilestones();
}

function updateStarsDisplay() {
  const el = document.getElementById('stars-count');
  if (el) el.textContent = state.stars;
}

function showStarPop() {
  const el = document.getElementById('star-pop');
  if (!el) return;
  el.classList.remove('hidden', 'popping');
  void el.offsetWidth; // reflow
  el.classList.add('popping');
  setTimeout(() => { el.classList.remove('popping'); el.classList.add('hidden'); }, 900);
}

function checkBadgeMilestones() {
  BADGES.forEach(badge => {
    if (state.earnedBadges.includes(badge.id)) return;
    let val = 0;
    switch (badge.type) {
      case 'correctAnswers': val = state.progress.correctAnswers || 0; break;
      case 'lettersTraced':  val = state.progress.lettersTraced  || 0; break;
      case 'wordsRead':      val = state.progress.wordsRead      || 0; break;
      case 'dailyComplete':  val = state.progress.dailyComplete  || 0; break;
      default: return; // unknown badge type — skip silently
    }
    if (val >= badge.threshold) {
      state.earnedBadges.push(badge.id);
      saveState();
      showBadgePopup(badge);
      launchConfetti();
    }
  });
  updateBadgeDisplay();
}

function showBadgePopup(badge) {
  const el = document.getElementById('badge-popup');
  if (!el) return;
  el.innerHTML = `🏆 New Badge: ${badge.icon} ${badge.name}!`;
  el.classList.remove('hidden', 'showing');
  void el.offsetWidth;
  el.classList.add('showing');
  speak('You earned a new badge! ' + badge.name + '!', 0.9, 1.2);
  setTimeout(() => { el.classList.remove('showing'); el.classList.add('hidden'); }, 3200);
}

function launchConfetti() {
  const container = document.getElementById('confetti-container');
  if (!container) return;
  const colors = ['#FF6B6B','#FFD93D','#4ECDC4','#45B7D1','#DDA0DD','#96CEB4'];
  for (let i = 0; i < 60; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.left  = Math.random() * 100 + 'vw';
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.animationDelay    = Math.random() * 0.6 + 's';
    piece.style.animationDuration = (Math.random() * 1.2 + 1.2) + 's';
    piece.style.width  = (Math.random() * 8 + 6) + 'px';
    piece.style.height = (Math.random() * 8 + 6) + 'px';
    piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
    container.appendChild(piece);
    setTimeout(() => piece.remove(), 2800);
  }
}

function updateSetting(key, value) {
  state.settings[key] = value;
  saveState();
  if (key === 'bedtimeMode') applyBedtimeMode();
}

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(() => {});
  } else {
    document.exitFullscreen().catch(() => {});
  }
}

// ==========================================
// INITIALISATION
// ==========================================

function init() {
  loadState();
  updateGreeting();
  updateStarsDisplay();
  applyBedtimeMode();

  // Restore active screen (always start on home)
  showScreen('home');
  speakWelcome();

  // Recover previously earned badges silently (no popup)
  updateBadgeDisplay();

  // Warm up speech engine and populate voice list when ready
  if (window.speechSynthesis) {
    window.speechSynthesis.getVoices();
    window.speechSynthesis.onvoiceschanged = () => {
      populateVoiceList();
    };
  }
}

document.addEventListener('DOMContentLoaded', init);

// ── Expose functions required by inline HTML handlers ──────────
window.showScreen           = showScreen;
window.navigateFromHome     = navigateFromHome;
window.startParentHold      = startParentHold;
window.cancelParentHold     = cancelParentHold;
window.toggleFullscreen     = toggleFullscreen;
window.onHearLetter         = onHearLetter;
window.onHearSound          = onHearSound;
window.onHearWord           = onHearWord;
window.onHearWord2          = onHearWord2;
window.prevLetter           = prevLetter;
window.nextLetter           = nextLetter;
window.toggleAutoPlay       = toggleAutoPlay;
window.clearDrawCanvas      = clearDrawCanvas;
window.toggleGuide          = toggleGuide;
window.speakCurrentTraceLetter = speakCurrentTraceLetter;
window.nextTraceLetter      = nextTraceLetter;
window.showPhonicsTab       = showPhonicsTab;
window.prevPhonicsWord      = prevPhonicsWord;
window.nextPhonicsWord      = nextPhonicsWord;
window.blendWord            = blendWord;
window.blendWordSlow        = blendWordSlow;
window.setWordLevel         = setWordLevel;
window.hearCurrentWord      = hearCurrentWord;
window.readWithMe           = readWithMe;
window.prevWord             = prevWord;
window.nextWord             = nextWord;
window.startGame            = startGame;
window.quitGame             = quitGame;
window.playGameQuestion     = playGameQuestion;
window.showGameSelector     = showGameSelector;
window.confirmReset         = confirmReset;
window.resetDailyAdventure  = resetDailyAdventure;
window.updateSetting        = updateSetting;

})();
