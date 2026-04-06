/**
 * Māori Explorer – script.js
 * Main application logic: routing, audio, games, progress, rewards
 */

/* ================================================================
   PROGRESS / STORAGE
   ================================================================ */

const DEFAULT_PROGRESS = {
  stars: 0,
  audioPlayed: 0,
  gamesPlayed: 0,
  modulesCompleted: [],
  moduleProgress: {},   // { moduleId: number 0–100 }
  wordsHeard: [],       // ids of vocab items heard
  badges: [],           // ids of earned badges
  streak: 0,
  lastVisit: null
};

function loadProgress() {
  try {
    const raw = localStorage.getItem("maoriExplorerProgress");
    if (raw) {
      const saved = JSON.parse(raw);
      return Object.assign({}, DEFAULT_PROGRESS, saved);
    }
  } catch (_) { /* ignore */ }
  return Object.assign({}, DEFAULT_PROGRESS);
}

function saveProgress(p) {
  try { localStorage.setItem("maoriExplorerProgress", JSON.stringify(p)); } catch (_) { /* ignore */ }
}

function resetProgress() {
  localStorage.removeItem("maoriExplorerProgress");
  return Object.assign({}, DEFAULT_PROGRESS);
}

/* Mutable global progress object */
let progress = loadProgress();

/* Update streak on new day */
(function updateStreak() {
  const today = new Date().toDateString();
  if (progress.lastVisit !== today) {
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    progress.streak = (progress.lastVisit === yesterday) ? (progress.streak || 0) + 1 : 1;
    progress.lastVisit = today;
    saveProgress(progress);
  }
})();

/* ================================================================
   AUDIO SYSTEM
   ================================================================ */

const SpeechAPI = window.speechSynthesis;
let currentUtterance = null;

/**
 * Play audio for a vocabulary item.
 * If item.audio is a path, load the file; otherwise fall back to SpeechSynthesis.
 * @param {object} item - vocabulary item
 * @param {HTMLElement} [btn] - optional button to show playing state
 * @param {boolean} [slow] - speak slower if true
 */
function playVocabAudio(item, btn, slow) {
  if (item.audio) {
    playAudioFile(item.audio, btn);
  } else {
    speakWord(item.maori, btn, slow ? 0.65 : 0.85);
  }
  // Track audio played for badges
  progress.audioPlayed++;
  if (!progress.wordsHeard.includes(item.id)) {
    progress.wordsHeard.push(item.id);
  }
  saveProgress(progress);
  checkBadges();
  refreshHeaderStars();
}

/** Play a local audio file */
function playAudioFile(path, btn) {
  const audio = new Audio(path);
  setPlayingState(btn, true);
  audio.play().catch(() => {
    // Fallback to speech synthesis if file fails
    speakWord(path, btn, 0.85);
  });
  audio.addEventListener("ended", () => setPlayingState(btn, false));
  audio.addEventListener("error", () => setPlayingState(btn, false));
}

/** Use browser SpeechSynthesis to speak a word */
function speakWord(text, btn, rate) {
  if (!SpeechAPI) return;
  SpeechAPI.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "mi-NZ";   // Māori locale if available; browsers fall back gracefully
  utterance.rate = rate || 0.85;
  utterance.pitch = 1.1;
  currentUtterance = utterance;

  setPlayingState(btn, true);
  utterance.addEventListener("end", () => setPlayingState(btn, false));
  utterance.addEventListener("error", () => setPlayingState(btn, false));
  SpeechAPI.speak(utterance);
}

/** Play an English instruction via speech synthesis */
function speakInstruction(text) {
  if (!SpeechAPI) return;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-NZ";
  utterance.rate = 0.9;
  utterance.pitch = 1.1;
  SpeechAPI.cancel();
  SpeechAPI.speak(utterance);
}

function setPlayingState(btn, isPlaying) {
  if (!btn) return;
  if (isPlaying) {
    btn.classList.add("playing");
    btn.setAttribute("aria-label", "Playing…");
  } else {
    btn.classList.remove("playing");
    btn.setAttribute("aria-label", btn.dataset.defaultLabel || "Listen");
  }
}

/* ================================================================
   ROUTING – simple hash-based SPA
   ================================================================ */

const views = {
  home: document.getElementById("view-home"),
  module: document.getElementById("view-module"),
  miniGames: document.getElementById("view-mini-games"),
  gamePlay: document.getElementById("view-game-play"),
  rewards: document.getElementById("view-rewards")
};

let currentModule = null;   // active module config
let adTimer = null;         // timer for delayed ad placeholder

// Views that show ads (all non-home views)
const AD_VIEWS = ["module", "miniGames", "gamePlay", "rewards"];

function showView(viewName) {
  // Clear any existing ad timer
  clearTimeout(adTimer);

  Object.values(views).forEach(v => { if (v) v.classList.remove("active"); });

  const target = views[viewName];
  if (target) {
    target.classList.add("active", "fade-enter");
    target.addEventListener("animationend", () => target.classList.remove("fade-enter"), { once: true });
  }

  if (AD_VIEWS.includes(viewName)) {
    startAdTimer(viewName);
  } else {
    hideAdPlaceholder(viewName);
  }
}

function startAdTimer(viewName) {
  const bar = document.getElementById("ad-bar");
  if (!bar) return;
  bar.classList.remove("visible");
  document.body.classList.remove("ad-visible");
  const delay = ADSENSE_CONFIG.delaySeconds * 1000;
  adTimer = setTimeout(() => {
    bar.classList.add("visible");
    document.body.classList.add("ad-visible");
    // Trigger AdSense fill when the slot becomes visible
    if (ADSENSE_CONFIG.enabled) {
      const ins = bar.querySelector("ins.adsbygoogle");
      if (ins && !ins.dataset.adsbygoogleStatus) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    }
  }, delay);
}

function hideAdPlaceholder(viewName) {
  const bar = document.getElementById("ad-bar");
  if (bar) bar.classList.remove("visible");
  document.body.classList.remove("ad-visible");
}

/**
 * Initialise Google AdSense.
 * Injects the loader <script> into <head> and inserts an <ins> tag into
 * every non-home view's .ad-placeholder container.
 * Reads all settings from ADSENSE_CONFIG in data.js.
 */
function initAdsense() {
  if (!ADSENSE_CONFIG.enabled || !ADSENSE_CONFIG.publisherId) return;

  // Inject the AdSense loader script once
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CONFIG.publisherId}`;
  script.crossOrigin = "anonymous";
  document.head.appendChild(script);

  // Insert a single <ins> tag into the bottom ad bar
  const bar = document.getElementById("ad-bar");
  if (bar && ADSENSE_CONFIG.slots.banner) {
    bar.innerHTML =
      `<ins class="adsbygoogle"` +
      ` style="display:block"` +
      ` data-ad-client="${ADSENSE_CONFIG.publisherId}"` +
      ` data-ad-slot="${ADSENSE_CONFIG.slots.banner}"` +
      ` data-ad-format="auto"` +
      ` data-full-width-responsive="true"></ins>`;
  }
}

function kebab(str) {
  return str.replace(/([A-Z])/g, m => `-${m.toLowerCase()}`);
}

/* ================================================================
   HEADER
   ================================================================ */

function refreshHeaderStars() {
  const el = document.getElementById("header-stars-count");
  if (el) el.textContent = progress.stars;
}

function setHeaderShowHome(visible) {
  const btn = document.getElementById("btn-header-home");
  if (btn) btn.classList.toggle("hidden", !visible);
}

/* ================================================================
   HOME VIEW
   ================================================================ */

function renderHome() {
  renderModuleCards();
  renderWordOfDay();
  renderProgressSummary();
  setHeaderShowHome(false);
  refreshHeaderStars();
}

function renderModuleCards() {
  const grid = document.getElementById("module-grid");
  if (!grid) return;
  grid.innerHTML = MODULES.map(mod => `
    <button
      class="module-card"
      data-module="${mod.id}"
      tabindex="0"
      aria-label="${mod.label}: ${mod.description}"
      style="border-color: ${mod.color}33; background: linear-gradient(135deg, ${mod.color}18, ${mod.color}08);"
    >
      <span class="module-icon" aria-hidden="true">${mod.emoji}</span>
      <span class="module-label">${mod.label}</span>
      <span class="module-desc">${mod.description}</span>
    </button>
  `).join("");

  grid.querySelectorAll(".module-card").forEach(card => {
    card.addEventListener("click", () => handleModuleClick(card.dataset.module));
  });
}

function renderWordOfDay() {
  const item = getWordOfTheDay();
  const container = document.getElementById("wotd-content");
  if (!container || !item) return;

  container.innerHTML = `
    <div class="wotd-label">✨ Word of the Day</div>
    <div class="wotd-emoji">${item.emoji}</div>
    <div class="wotd-word">${item.maori}</div>
    <div class="wotd-pron">${item.pronunciation}</div>
    <div class="wotd-english">${item.english}</div>
    <button class="btn-audio mt-1" id="btn-wotd-audio" aria-label="Listen to ${item.maori}" data-default-label="Listen">
      🔊 Listen
    </button>
  `;

  const audioBtn = container.querySelector("#btn-wotd-audio");
  audioBtn.addEventListener("click", () => playVocabAudio(item, audioBtn));
}

function renderProgressSummary() {
  const bar = document.getElementById("overall-progress-bar");
  const statsEl = document.getElementById("progress-stats");
  if (!bar || !statsEl) return;

  const totalModules = MODULES.filter(m => m.vocabKey).length;
  const completed = progress.modulesCompleted.length;
  const pct = Math.round((completed / totalModules) * 100);

  bar.style.width = pct + "%";
  bar.setAttribute("aria-valuenow", pct);

  statsEl.innerHTML = `
    <div class="stat-chip">⭐ ${progress.stars} Stars</div>
    <div class="stat-chip">🎮 ${progress.gamesPlayed} Games</div>
    <div class="stat-chip">🔥 ${progress.streak} Day streak</div>
    <div class="stat-chip">📚 ${progress.wordsHeard.length} Words</div>
  `;
}

function handleModuleClick(moduleId) {
  if (moduleId === "miniGames") { navigateToMiniGames(); return; }
  if (moduleId === "rewards")   { navigateToRewards();   return; }

  const mod = MODULES.find(m => m.id === moduleId);
  if (!mod) return;
  currentModule = mod;
  renderModuleView(mod);
  showView("module");
  setHeaderShowHome(true);
}

/* ================================================================
   MODULE VIEW (vocabulary cards)
   ================================================================ */

function renderModuleView(mod) {
  const vocab = VOCAB[mod.vocabKey] || [];

  const header = document.getElementById("module-view-header");
  const grid   = document.getElementById("vocab-grid");
  const actions = document.getElementById("module-view-actions");

  if (header) {
    header.innerHTML = `
      <div class="module-big-emoji">${mod.emoji}</div>
      <h2>${mod.label}</h2>
      <p>${mod.description}</p>
    `;
    header.style.background = `linear-gradient(135deg, ${mod.color}, ${adjustColor(mod.color, -20)})`;
  }

  if (grid) {
    grid.innerHTML = vocab.map(item => renderVocabCard(item, mod)).join("");
    grid.querySelectorAll(".btn-audio").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.id;
        const item = vocab.find(v => v.id === id);
        if (item) playVocabAudio(item, btn);
      });
    });
    grid.querySelectorAll(".btn-say-it").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.id;
        const item = vocab.find(v => v.id === id);
        if (item) {
          speakInstruction(`Say it with me: ${item.maori}`);
          showMiniToast(`Let's say it: ${item.maori} 🎵`);
        }
      });
    });
  }

  // Track module visit – mark partial progress
  if (!progress.moduleProgress[mod.id]) {
    progress.moduleProgress[mod.id] = 0;
  }

  if (actions) {
    actions.innerHTML = `
      <button class="btn-game" id="btn-listen-tap">
        🎵 Listen &amp; Tap Game
      </button>
      <button class="btn-game" id="btn-match-cards">
        🃏 Match Cards
      </button>
    `;
    document.getElementById("btn-listen-tap").addEventListener("click", () => {
      startListenTapGame(vocab, mod);
    });
    document.getElementById("btn-match-cards").addEventListener("click", () => {
      startMatchCardsGame(vocab, mod);
    });
  }

  // Mark module as "viewed" and award a star
  if (!progress.modulesCompleted.includes(mod.id) && vocab.length > 0) {
    // Award a star for visiting a new module
    awardStars(1, `You explored ${mod.label}! 🌟`);
  }

  // Start ad timer for this view
  startAdTimer("module");
}

function renderVocabCard(item, mod) {
  const colorSwatch = item.hex
    ? `<div class="vocab-color-swatch" style="background:${item.hex};" aria-hidden="true"></div>`
    : `<div class="vocab-emoji" aria-hidden="true">${item.emoji}</div>`;

  return `
    <div class="vocab-card" role="article" aria-label="${item.maori} – ${item.english}">
      ${colorSwatch}
      <div class="vocab-maori">${item.maori}</div>
      <div class="vocab-pron">${item.pronunciation}</div>
      <div class="vocab-english">${item.english}</div>
      <button class="btn-audio" data-id="${item.id}" aria-label="Listen to ${item.maori}" data-default-label="Listen">
        🔊 Listen
      </button>
      <button class="btn-say-it" data-id="${item.id}" aria-label="Say it with me: ${item.maori}">
        🗣️ Say it with me
      </button>
    </div>
  `;
}

/* Simple color darkening helper */
function adjustColor(hex, amount) {
  if (!hex || !hex.startsWith("#")) return hex;
  try {
    const num = parseInt(hex.slice(1), 16);
    const r = Math.max(0, Math.min(255, (num >> 16) + amount));
    const g = Math.max(0, Math.min(255, ((num >> 8) & 0xff) + amount));
    const b = Math.max(0, Math.min(255, (num & 0xff) + amount));
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
  } catch (_) { return hex; }
}

/* ================================================================
   MINI GAMES NAVIGATION
   ================================================================ */

function navigateToMiniGames() {
  renderMiniGamesMenu();
  showView("miniGames");
  setHeaderShowHome(true);
}

function renderMiniGamesMenu() {
  const grid = document.getElementById("games-grid");
  if (!grid) return;

  const games = [
    { id: "listen-tap",    icon: "🎵", label: "Listen & Tap",    desc: "Hear a word and tap the right one!" },
    { id: "match-cards",   icon: "🃏", label: "Match the Cards",  desc: "Match numbers to their Māori words" },
    { id: "count-objects", icon: "🔢", label: "Count the Objects", desc: "How many objects can you see?" },
    { id: "find-picture",  icon: "🔍", label: "Find the Picture",  desc: "Tap the right picture when you hear the word" }
  ];

  grid.innerHTML = games.map(g => `
    <button class="game-card" data-game="${g.id}" aria-label="${g.label}: ${g.desc}">
      <span class="game-icon" aria-hidden="true">${g.icon}</span>
      <div class="game-label">${g.label}</div>
      <div class="game-desc">${g.desc}</div>
    </button>
  `).join("");

  grid.querySelectorAll(".game-card").forEach(card => {
    card.addEventListener("click", () => startGameById(card.dataset.game));
  });
}

function startGameById(gameId) {
  const allVocab = [
    ...VOCAB.greetings, ...VOCAB.numbers, ...VOCAB.colors,
    ...VOCAB.family, ...VOCAB.animals, ...VOCAB.bodyParts, ...VOCAB.feelings
  ];
  const shuffled = shuffle([...allVocab]);

  switch (gameId) {
    case "listen-tap":    startListenTapGame(shuffled.slice(0, 8), null); break;
    case "match-cards":   startMatchCardsGame(VOCAB.numbers, null); break;
    case "count-objects": startCountObjectsGame(); break;
    case "find-picture":  startFindPictureGame(shuffled.slice(0, 8), null); break;
  }
}

/* ================================================================
   GAME: Listen & Tap
   ================================================================ */

let listenTapState = {};

function startListenTapGame(vocab, mod) {
  const items = shuffle([...vocab]).slice(0, Math.min(8, vocab.length));
  listenTapState = { items, current: 0, score: 0, total: 5, parentMod: mod };
  renderListenTapRound();
  showView("gamePlay");
  setHeaderShowHome(true);
}

function renderListenTapRound() {
  const { items, current, score, total } = listenTapState;
  if (current >= total || current >= items.length) {
    showGameComplete("Listen & Tap", listenTapState.score, total);
    return;
  }

  const correct = items[current];
  const distractors = shuffle(items.filter(i => i.id !== correct.id)).slice(0, 3);
  const options = shuffle([correct, ...distractors]);

  const area = document.getElementById("game-play-content");
  if (!area) return;

  area.innerHTML = `
    <div class="game-play-header">
      <h2>🎵 Listen &amp; Tap</h2>
      <div class="game-score">
        <div class="score-item"><span class="score-value">${current + 1}/${total}</span>Round</div>
        <div class="score-item"><span class="score-value">⭐ ${score}</span>Score</div>
      </div>
    </div>
    <div class="game-prompt">
      <span class="prompt-text">Tap the word you hear!</span>
      <span class="prompt-instruction">Press 🔊 to hear it again</span>
      <button class="btn-primary mt-2" id="btn-play-word" data-id="${correct.id}" aria-label="Play word">
        🔊 Play word
      </button>
    </div>
    <div class="options-grid" id="options-grid">
      ${options.map(opt => `
        <button class="option-btn" data-id="${opt.id}" aria-label="${opt.maori}">
          <span class="opt-emoji">${opt.emoji}</span>
          <span class="opt-text">${opt.maori}</span>
        </button>
      `).join("")}
    </div>
    <div id="feedback-area"></div>
    <div class="btn-row" id="next-btn-area"></div>
  `;

  // Auto-play the word after a short delay
  setTimeout(() => {
    const btn = area.querySelector("#btn-play-word");
    playVocabAudio(correct, btn);
  }, 600);

  area.querySelector("#btn-play-word").addEventListener("click", e => {
    playVocabAudio(correct, e.currentTarget);
  });

  area.querySelectorAll(".option-btn").forEach(btn => {
    btn.addEventListener("click", () => handleListenTapAnswer(btn, correct, options));
  });
}

function handleListenTapAnswer(btn, correct, options) {
  const isCorrect = btn.dataset.id === correct.id;

  // Disable all buttons
  document.querySelectorAll(".option-btn").forEach(b => {
    b.disabled = true;
    if (b.dataset.id === correct.id) b.classList.add("correct");
    else if (b === btn && !isCorrect) b.classList.add("wrong");
  });

  const feedbackEl = document.getElementById("feedback-area");
  const nextArea   = document.getElementById("next-btn-area");

  if (isCorrect) {
    listenTapState.score++;
    const msg = getRandom(FEEDBACK_POSITIVE);
    feedbackEl.innerHTML = `<div class="feedback-banner positive">${msg}</div>`;
    awardStars(1);
    launchConfetti();
  } else {
    const msg = getRandom(FEEDBACK_TRY_AGAIN);
    feedbackEl.innerHTML = `<div class="feedback-banner negative">${msg}</div>`;
  }

  nextArea.innerHTML = `
    <button class="btn-primary" id="btn-next-round">Next ➡️</button>
  `;
  document.getElementById("btn-next-round").addEventListener("click", () => {
    listenTapState.current++;
    renderListenTapRound();
  });
}

/* ================================================================
   GAME: Match Cards (numbers game)
   ================================================================ */

let matchState = {};

function startMatchCardsGame(vocab, mod) {
  // Use numbers vocab for matching; trim to 5 pairs max for good UX
  const items = shuffle([...vocab]).slice(0, 5);
  matchState = { items, matched: 0, selected: null, parentMod: mod, errors: 0 };
  renderMatchCardsGame();
  showView("gamePlay");
  setHeaderShowHome(true);
}

function renderMatchCardsGame() {
  const { items } = matchState;

  // Create two columns: numerals/emoji and Māori words, shuffled independently
  const leftCards  = shuffle(items.map(item => ({
    id: item.id,
    display: item.value !== undefined ? String(item.value) : item.emoji,
    type: "numeral"
  })));
  const rightCards = shuffle(items.map(item => ({
    id: item.id,
    display: item.maori,
    type: "maori"
  })));

  matchState.leftCards  = leftCards;
  matchState.rightCards = rightCards;

  const area = document.getElementById("game-play-content");
  if (!area) return;

  area.innerHTML = `
    <div class="game-play-header">
      <h2>🃏 Match the Cards</h2>
      <p style="font-size:0.82rem;color:var(--color-text-soft);font-weight:600;">
        Tap a number, then tap its Māori word!
      </p>
      <div class="game-score">
        <div class="score-item"><span class="score-value">${matchState.matched}/${items.length}</span>Matched</div>
      </div>
    </div>
    <div class="match-grid" id="match-grid">
      ${leftCards.map(c => `
        <button class="match-card numeral" data-id="${c.id}" data-side="left" aria-label="${c.display}">
          ${c.display}
        </button>
      `).join("")}
      ${rightCards.map(c => `
        <button class="match-card" data-id="${c.id}" data-side="right" aria-label="${c.display}">
          ${c.display}
        </button>
      `).join("")}
    </div>
    <div id="feedback-area"></div>
  `;

  area.querySelectorAll(".match-card").forEach(card => {
    card.addEventListener("click", () => handleMatchCardClick(card));
  });
}

function handleMatchCardClick(card) {
  if (card.classList.contains("matched") || card.disabled) return;

  const id   = card.dataset.id;
  const side = card.dataset.side;

  if (!matchState.selected) {
    // First selection
    matchState.selected = { id, side, el: card };
    card.classList.add("selected");
    // Play audio for the word
    const item = matchState.items.find(i => i.id === id);
    if (item) playVocabAudio(item, null);
  } else {
    const prev = matchState.selected;

    // Must select from different sides
    if (prev.side === side) {
      prev.el.classList.remove("selected");
      matchState.selected = { id, side, el: card };
      card.classList.add("selected");
      return;
    }

    prev.el.classList.remove("selected");
    matchState.selected = null;

    if (prev.id === id) {
      // Match!
      prev.el.classList.add("matched");
      card.classList.add("matched");
      prev.el.disabled = true;
      card.disabled = true;
      matchState.matched++;

      const feedbackEl = document.getElementById("feedback-area");
      feedbackEl.innerHTML = `<div class="feedback-banner positive">${getRandom(FEEDBACK_POSITIVE)}</div>`;
      awardStars(1);

      if (matchState.matched >= matchState.items.length) {
        setTimeout(() => {
          launchConfetti();
          showGameComplete("Match the Cards", matchState.items.length, matchState.items.length);
        }, 500);
      }

      // Update matched count display
      const countEl = document.querySelector(".score-value");
      if (countEl) countEl.textContent = `${matchState.matched}/${matchState.items.length}`;
    } else {
      // Wrong pair
      matchState.errors++;
      prev.el.classList.add("wrong-flash");
      card.classList.add("wrong-flash");
      const feedbackEl = document.getElementById("feedback-area");
      feedbackEl.innerHTML = `<div class="feedback-banner negative">${getRandom(FEEDBACK_TRY_AGAIN)}</div>`;
      setTimeout(() => {
        prev.el.classList.remove("wrong-flash");
        card.classList.remove("wrong-flash");
        feedbackEl.innerHTML = "";
      }, 700);
    }
  }
}

/* ================================================================
   GAME: Count the Objects
   ================================================================ */

let countState = {};

function startCountObjectsGame() {
  countState = { round: 0, total: 5, score: 0 };
  renderCountRound();
  showView("gamePlay");
  setHeaderShowHome(true);
}

function renderCountRound() {
  const { round, total, score } = countState;
  if (round >= total) {
    showGameComplete("Count the Objects", score, total);
    return;
  }

  // Pick a random number 1–10
  const targetNum   = Math.floor(Math.random() * 10) + 1;
  const targetItem  = VOCAB.numbers.find(n => n.value === targetNum);
  const countEmoji  = getRandom(COUNTING_OBJECTS);

  // Generate 4 options
  const optionValues = generateUniqueNumbers(targetNum, 4, 1, 10);
  const options = shuffle(optionValues.map(n => VOCAB.numbers.find(v => v.value === n)));

  const area = document.getElementById("game-play-content");
  if (!area) return;

  area.innerHTML = `
    <div class="game-play-header">
      <h2>🔢 Count the Objects</h2>
      <div class="game-score">
        <div class="score-item"><span class="score-value">${round + 1}/${total}</span>Round</div>
        <div class="score-item"><span class="score-value">⭐ ${score}</span>Score</div>
      </div>
    </div>
    <div class="game-prompt">
      <span class="prompt-text">How many?</span>
      <div class="count-objects" aria-label="${targetNum} objects" role="img">
        ${countEmoji.repeat(targetNum)}
      </div>
    </div>
    <div class="options-grid" id="options-grid">
      ${options.map(opt => `
        <button class="option-btn" data-id="${opt.id}" data-value="${opt.value}" aria-label="${opt.maori}">
          <span class="opt-emoji" style="font-size:1.4rem;">${opt.value}</span>
          <span class="opt-text">${opt.maori}</span>
        </button>
      `).join("")}
    </div>
    <div id="feedback-area"></div>
    <div class="btn-row" id="next-btn-area"></div>
  `;

  area.querySelectorAll(".option-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const isCorrect = parseInt(btn.dataset.value, 10) === targetNum;
      handleSimpleQuizAnswer(btn, isCorrect, countState, () => {
        countState.round++;
        renderCountRound();
      }, targetItem);
    });
  });
}

function generateUniqueNumbers(target, count, min, max) {
  const set = new Set([target]);
  while (set.size < count && set.size < (max - min + 1)) {
    set.add(Math.floor(Math.random() * (max - min + 1)) + min);
  }
  return [...set];
}

/* ================================================================
   GAME: Find the Picture
   ================================================================ */

let findPicState = {};

function startFindPictureGame(vocab, mod) {
  const items = shuffle([...vocab]).slice(0, Math.min(8, vocab.length));
  findPicState = { items, current: 0, score: 0, total: 5, parentMod: mod };
  renderFindPictureRound();
  showView("gamePlay");
  setHeaderShowHome(true);
}

function renderFindPictureRound() {
  const { items, current, score, total } = findPicState;
  if (current >= total || current >= items.length) {
    showGameComplete("Find the Picture", findPicState.score, total);
    return;
  }

  const correct = items[current];
  const distractors = shuffle(items.filter(i => i.id !== correct.id)).slice(0, 3);
  const options = shuffle([correct, ...distractors]);

  const area = document.getElementById("game-play-content");
  if (!area) return;

  area.innerHTML = `
    <div class="game-play-header">
      <h2>🔍 Find the Picture</h2>
      <div class="game-score">
        <div class="score-item"><span class="score-value">${current + 1}/${total}</span>Round</div>
        <div class="score-item"><span class="score-value">⭐ ${score}</span>Score</div>
      </div>
    </div>
    <div class="game-prompt">
      <span class="prompt-text">${correct.maori}</span>
      <span class="prompt-instruction">${correct.pronunciation}</span>
      <button class="btn-primary mt-2" id="btn-play-word" aria-label="Listen to ${correct.maori}">
        🔊 Listen
      </button>
    </div>
    <div class="options-grid" id="options-grid">
      ${options.map(opt => `
        <button class="option-btn" data-id="${opt.id}" aria-label="${opt.maori}">
          <span class="opt-emoji" style="font-size:2.8rem;">${opt.emoji}</span>
          <span class="opt-text" style="font-size:0.72rem;">${opt.english}</span>
        </button>
      `).join("")}
    </div>
    <div id="feedback-area"></div>
    <div class="btn-row" id="next-btn-area"></div>
  `;

  setTimeout(() => {
    const btn = area.querySelector("#btn-play-word");
    if (btn) playVocabAudio(correct, btn);
  }, 500);

  area.querySelector("#btn-play-word").addEventListener("click", e => {
    playVocabAudio(correct, e.currentTarget);
  });

  area.querySelectorAll(".option-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const isCorrect = btn.dataset.id === correct.id;
      handleSimpleQuizAnswer(btn, isCorrect, findPicState, () => {
        findPicState.current++;
        renderFindPictureRound();
      }, correct);
    });
  });
}

/* ── Shared quiz answer handler ── */
function handleSimpleQuizAnswer(btn, isCorrect, state, onNext, correctItem) {
  document.querySelectorAll(".option-btn").forEach(b => {
    b.disabled = true;
    if (b.dataset.id === correctItem.id) b.classList.add("correct");
  });
  if (!isCorrect) btn.classList.add("wrong");

  const feedbackEl = document.getElementById("feedback-area");
  const nextArea   = document.getElementById("next-btn-area");

  if (isCorrect) {
    if (state.score !== undefined) state.score++;
    feedbackEl.innerHTML = `<div class="feedback-banner positive">${getRandom(FEEDBACK_POSITIVE)}</div>`;
    awardStars(1);
    launchConfetti();
  } else {
    feedbackEl.innerHTML = `<div class="feedback-banner negative">${getRandom(FEEDBACK_TRY_AGAIN)}</div>`;
  }

  nextArea.innerHTML = `<button class="btn-primary" id="btn-next-round">Next ➡️</button>`;
  document.getElementById("btn-next-round").addEventListener("click", onNext);
}

/* ================================================================
   GAME COMPLETE SCREEN
   ================================================================ */

function showGameComplete(gameName, score, total) {
  progress.gamesPlayed++;
  saveProgress(progress);
  checkBadges();

  const stars = score >= total ? 3 : score >= Math.ceil(total / 2) ? 2 : 1;
  const starStr = "⭐".repeat(stars);

  const area = document.getElementById("game-play-content");
  if (!area) return;

  area.innerHTML = `
    <div style="text-align:center;padding:2rem 1rem;">
      <div style="font-size:5rem;margin-bottom:0.5rem;">🎉</div>
      <h2 style="font-size:1.6rem;font-weight:900;color:var(--color-primary);margin-bottom:0.5rem;">
        ${gameName} Complete!
      </h2>
      <div style="font-size:2.5rem;margin:0.75rem 0;">${starStr}</div>
      <p style="font-size:1.1rem;font-weight:800;color:var(--color-text-soft);margin-bottom:1.5rem;">
        You got ${score} out of ${total}! Ka pai! 🌟
      </p>
      <div class="btn-row">
        <button class="btn-primary" id="btn-play-again">🔄 Play Again</button>
        <button class="btn-secondary" id="btn-back-games">🏠 Games Menu</button>
      </div>
    </div>
  `;

  launchConfetti();

  document.getElementById("btn-play-again").addEventListener("click", () => {
    // Replay the same game type from mini games
    navigateToMiniGames();
  });

  document.getElementById("btn-back-games").addEventListener("click", () => {
    navigateToMiniGames();
  });
}

/* ================================================================
   REWARDS VIEW
   ================================================================ */

function navigateToRewards() {
  renderRewardsView();
  showView("rewards");
  setHeaderShowHome(true);
}

function renderRewardsView() {
  const starsEl        = document.getElementById("rewards-star-number");
  const badgesEl       = document.getElementById("badges-grid");
  const modProgressEl  = document.getElementById("module-progress-list");

  if (starsEl) starsEl.textContent = progress.stars;

  if (badgesEl) {
    badgesEl.innerHTML = BADGES.map(badge => {
      const earned = progress.badges.includes(badge.id);
      return `
        <div class="badge-item ${earned ? "earned" : ""}" aria-label="${badge.label}${earned ? " – earned" : " – not yet earned"}">
          <div class="badge-emoji">${badge.emoji}</div>
          <div class="badge-label">${badge.label}</div>
          <div class="badge-desc">${badge.description}</div>
        </div>
      `;
    }).join("");
  }

  if (modProgressEl) {
    const learningMods = MODULES.filter(m => m.vocabKey);
    modProgressEl.innerHTML = learningMods.map(mod => {
      const pct = progress.moduleProgress[mod.id] || 0;
      return `
        <div class="mod-prog-item">
          <span class="mod-emoji" aria-hidden="true">${mod.emoji}</span>
          <span class="mod-name">${mod.label}</span>
          <div class="mod-prog-outer" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100">
            <div class="mod-prog-inner" style="width:${pct}%"></div>
          </div>
          <span class="mod-prog-pct">${pct}%</span>
        </div>
      `;
    }).join("");
  }
}

/* ================================================================
   REWARDS / STARS / BADGES
   ================================================================ */

function awardStars(amount, message) {
  progress.stars += amount;
  saveProgress(progress);
  refreshHeaderStars();
  checkBadges();
  if (message) {
    setTimeout(() => showMiniToast("⭐ " + message), 300);
  }
}

function checkBadges() {
  let newBadge = null;
  BADGES.forEach(badge => {
    if (!progress.badges.includes(badge.id) && badge.condition(progress)) {
      progress.badges.push(badge.id);
      saveProgress(progress);
      newBadge = badge;
    }
  });
  if (newBadge) {
    setTimeout(() => showBadgePopup(newBadge), 500);
  }
}

function showBadgePopup(badge) {
  const overlay = document.createElement("div");
  overlay.className = "reward-popup-overlay";
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.setAttribute("aria-label", `New badge: ${badge.label}`);
  overlay.innerHTML = `
    <div class="reward-popup">
      <span class="reward-popup-emoji">${badge.emoji}</span>
      <h3>New Badge! 🎉</h3>
      <p><strong>${badge.label}</strong><br>${badge.description}</p>
      <button class="btn-primary" id="btn-close-badge">Awesome! 🌟</button>
    </div>
  `;
  document.body.appendChild(overlay);
  overlay.querySelector("#btn-close-badge").addEventListener("click", () => overlay.remove());
  overlay.addEventListener("click", e => { if (e.target === overlay) overlay.remove(); });

  // Auto-dismiss after 5 seconds
  setTimeout(() => { if (overlay.parentNode) overlay.remove(); }, 5000);
}

function showMiniToast(msg) {
  const existing = document.getElementById("mini-toast");
  if (existing) existing.remove();

  const toast = document.createElement("div");
  toast.id = "mini-toast";
  toast.textContent = msg;
  toast.style.cssText = `
    position: fixed; bottom: 1.5rem; left: 50%; transform: translateX(-50%);
    background: var(--color-text); color: #fff;
    padding: 0.6rem 1.25rem; border-radius: 999px;
    font-size: 0.9rem; font-weight: 700;
    z-index: 300; animation: fadeIn 0.25s ease;
    pointer-events: none; max-width: 90vw; text-align: center;
  `;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2200);
}

/* ================================================================
   CONFETTI
   ================================================================ */

const confettiCanvas = document.getElementById("confetti-canvas");
const confettiCtx = confettiCanvas ? confettiCanvas.getContext("2d") : null;
let confettiParticles = [];
let confettiRaf = null;

function launchConfetti() {
  if (!confettiCanvas || !confettiCtx) return;
  // Respect reduced motion
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  confettiCanvas.width  = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
  confettiParticles = [];

  const colors = ["#FF7043","#FFC107","#42A5F5","#66BB6A","#AB47BC","#FFD54F"];
  for (let i = 0; i < 80; i++) {
    confettiParticles.push({
      x: Math.random() * confettiCanvas.width,
      y: -10 - Math.random() * 40,
      r: 5 + Math.random() * 6,
      dx: (Math.random() - 0.5) * 3,
      dy: 2 + Math.random() * 3,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.15
    });
  }

  if (confettiRaf) cancelAnimationFrame(confettiRaf);
  let tick = 0;
  function animate() {
    confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    confettiParticles.forEach(p => {
      confettiCtx.save();
      confettiCtx.translate(p.x, p.y);
      confettiCtx.rotate(p.rotation);
      confettiCtx.fillStyle = p.color;
      confettiCtx.fillRect(-p.r / 2, -p.r / 2, p.r, p.r * 0.6);
      confettiCtx.restore();
      p.x += p.dx;
      p.y += p.dy;
      p.rotation += p.rotationSpeed;
    });
    tick++;
    if (tick < 120) confettiRaf = requestAnimationFrame(animate);
    else confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  }
  animate();
}

/* ================================================================
   UTILITY
   ================================================================ */

function shuffle(array) {
  const a = [...array];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getRandom(array) {
  return array[Math.floor(Math.random() * array.length)];
}

/* ================================================================
   INIT
   ================================================================ */

document.addEventListener("DOMContentLoaded", () => {
  // Header home button
  const btnHeaderHome = document.getElementById("btn-header-home");
  if (btnHeaderHome) {
    btnHeaderHome.addEventListener("click", () => {
      showView("home");
      renderHome();
      setHeaderShowHome(false);
    });
  }

  // Reset progress button (in rewards view)
  const btnReset = document.getElementById("btn-reset-progress");
  if (btnReset) {
    btnReset.addEventListener("click", () => {
      if (confirm("Reset all progress? This cannot be undone.")) {
        progress = resetProgress();
        renderRewardsView();
        refreshHeaderStars();
        showMiniToast("Progress reset 🔄");
      }
    });
  }

  // Module back button
  const btnModBack = document.getElementById("btn-module-back");
  if (btnModBack) {
    btnModBack.addEventListener("click", () => {
      showView("home");
      renderHome();
      setHeaderShowHome(false);
    });
  }

  // Games back button
  const btnGamesBack = document.getElementById("btn-games-back");
  if (btnGamesBack) {
    btnGamesBack.addEventListener("click", () => {
      showView("home");
      renderHome();
      setHeaderShowHome(false);
    });
  }

  // Game play back button
  const btnGamePlayBack = document.getElementById("btn-game-play-back");
  if (btnGamePlayBack) {
    btnGamePlayBack.addEventListener("click", () => {
      navigateToMiniGames();
    });
  }

  // Render home on start
  renderHome();
  showView("home");

  // Initialise AdSense (reads ADSENSE_CONFIG from data.js)
  initAdsense();

  // Mark module as completed when all audio played (simple heuristic)
  // This runs on progress save – mark module if >60% words heard
  MODULES.filter(m => m.vocabKey).forEach(mod => {
    const vocab = VOCAB[mod.vocabKey] || [];
    if (vocab.length === 0) return;
    const heard = vocab.filter(v => progress.wordsHeard.includes(v.id)).length;
    const pct   = Math.round((heard / vocab.length) * 100);
    progress.moduleProgress[mod.id] = pct;
    if (pct >= 60 && !progress.modulesCompleted.includes(mod.id)) {
      progress.modulesCompleted.push(mod.id);
    }
  });
  saveProgress(progress);
  checkBadges();
});
