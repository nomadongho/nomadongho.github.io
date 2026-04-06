// app.js — Clock Educator main application controller

const App = (() => {

  /* ── App identity ─────────────────────────────────────────── */
  const APP_TITLE = 'Clock Explorer';
  const CONTACT_EMAIL = 'nomadongho@gmail.com';

  function _mailtoLink(type) {
    const isBug = type === 'bug';
    const subject = isBug ? `[${APP_TITLE}] Bug Report` : `[${APP_TITLE}] Suggestion`;
    const body = isBug
      ? `Hi,\n\nI found a problem in ${APP_TITLE}.\n\nWhat happened:\n...\n\nDevice/browser:\n...\n`
      : `Hi,\n\nI have an idea for ${APP_TITLE}:\n\n...\n`;
    return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  /* ── Default settings & progress ──────────────────────────── */
  const DEFAULT_SETTINGS = {
    difficulty:      1,
    showDigital:     'after',   // 'always' | 'after' | 'never'
    soundEffects:    true,
    voicePrompts:    true,
    celebrations:    true,
    minuteMarkers:   false,
    questionsPerSession: 10,
    matchDifficulty: 'easy',    // 'easy' | 'medium'
  };

  const DEFAULT_PROGRESS = {
    totalStars:    0,
    streak:        0,
    bestStreak:    0,
    correctTotal:  0,
    categoryCorrect: { oclock: 0, halfPast: 0, quarter: 0, fiveMin: 0, any: 0 },
    milestonesAchieved: [],
  };

  /* ── State ─────────────────────────────────────────────────── */
  let settings    = {};
  let progress    = {};
  let currentMode = null;
  let currentQuestion = null;
  let sessionCorrect  = 0;
  let sessionTotal    = 0;
  let activeClocks    = []; // clock instances to destroy on mode switch

  /* ── DOM refs ──────────────────────────────────────────────── */
  const $   = id  => document.getElementById(id);
  const $el = sel => document.querySelector(sel);

  /* ══════════════════════════════════════════════════════════════
     INIT
  ══════════════════════════════════════════════════════════════ */
  function init() {
    settings = Utils.loadFromStorage('ce_settings', DEFAULT_SETTINGS);
    // Merge any new keys from defaults
    settings  = Object.assign({}, DEFAULT_SETTINGS, settings);
    progress  = Utils.loadFromStorage('ce_progress', DEFAULT_PROGRESS);
    progress  = Object.assign({}, DEFAULT_PROGRESS, progress);
    if (!progress.categoryCorrect)  progress.categoryCorrect = DEFAULT_PROGRESS.categoryCorrect;
    if (!progress.milestonesAchieved) progress.milestonesAchieved = [];

    _buildUI();
    _bindGlobalEvents();

    const lastMode = Utils.loadFromStorage('ce_lastMode', null);
    showModeSelector();
    if (lastMode) {
      // Highlight last-used card but don't auto-enter
    }
    updateStarDisplay();
  }

  /* ══════════════════════════════════════════════════════════════
     UI BUILDER
  ══════════════════════════════════════════════════════════════ */
  function _buildUI() {
    document.body.innerHTML = `
    <div id="app">
      <header id="main-header">
        <div id="header-left">
          <span id="app-logo">🕐</span>
          <span id="app-title">Clock Explorer</span>
        </div>
        <div id="header-right">
          <div id="star-display" aria-label="Stars earned">
            <span id="star-icon">⭐</span>
            <span id="star-count">0</span>
          </div>
          <button id="settings-btn" class="icon-btn" aria-label="Parent Settings" title="Hold for Settings">⚙️</button>
        </div>
      </header>

      <main id="main-content"></main>

      <!-- Settings Modal -->
      <div id="settings-overlay" class="overlay hidden" role="dialog" aria-modal="true" aria-labelledby="settings-title">
        <div id="settings-modal" class="modal">
          <button id="close-settings-btn" class="icon-btn close-btn" aria-label="Close settings">✕</button>
          <h2 id="settings-title">⚙️ Parent Settings</h2>
          <div class="settings-body">
            <label class="setting-row">
              <span>Difficulty (1=Easy, 5=Hard)</span>
              <input type="range" id="s-difficulty" min="1" max="5" step="1">
              <span id="s-difficulty-val">1</span>
            </label>
            <label class="setting-row">
              <span>Show Digital Time</span>
              <select id="s-digital">
                <option value="always">Always</option>
                <option value="after">After Answer</option>
                <option value="never">Never</option>
              </select>
            </label>
            <label class="setting-row toggle-row">
              <span>Sound Effects</span>
              <input type="checkbox" id="s-sound" class="toggle">
            </label>
            <label class="setting-row toggle-row">
              <span>Voice Prompts</span>
              <input type="checkbox" id="s-voice" class="toggle">
            </label>
            <label class="setting-row toggle-row">
              <span>Celebrations</span>
              <input type="checkbox" id="s-celebrations" class="toggle">
            </label>
            <label class="setting-row toggle-row">
              <span>Minute Markers on Clock</span>
              <input type="checkbox" id="s-minute-markers" class="toggle">
            </label>
            <label class="setting-row">
              <span>Questions per Session</span>
              <select id="s-questions">
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="15">15</option>
              </select>
            </label>
            <label class="setting-row">
              <span>Match Game</span>
              <select id="s-match">
                <option value="easy">Easy (2 pairs)</option>
                <option value="medium">Medium (4 pairs)</option>
              </select>
            </label>
            <div class="setting-row">
              <span>Progress</span>
              <button id="reset-progress-btn" class="btn btn-danger">Reset Progress ⚠️</button>
            </div>
          </div>
          <button id="save-settings-btn" class="btn btn-primary">Save Settings ✅</button>
        </div>
      </div>

      <!-- Milestone popup -->
      <div id="milestone-overlay" class="overlay hidden">
        <div id="milestone-popup" class="popup">
          <div id="milestone-icon">🏆</div>
          <div id="milestone-title">Amazing!</div>
          <div id="milestone-msg"></div>
          <button id="milestone-ok-btn" class="btn btn-primary">Yay! 🎉</button>
        </div>
      </div>

      <!-- Confetti layer -->
      <div id="confetti-layer" aria-hidden="true"></div>

      <footer id="contact-footer">
        <span class="contact-footer-label">Contact the developer:</span>
        <a class="contact-footer-link" href="${_mailtoLink('suggestion')}">Suggest an idea</a>
        <span class="contact-footer-sep" aria-hidden="true">·</span>
        <a class="contact-footer-link" href="${_mailtoLink('bug')}">Report a problem</a>
      </footer>
    </div>`;
  }

  /* ══════════════════════════════════════════════════════════════
     GLOBAL EVENTS
  ══════════════════════════════════════════════════════════════ */
  function _bindGlobalEvents() {
    /* Settings button – hold for 5 seconds */
    let holdTimer = null;
    let holdStart = null;
    let progressBar = null;

    function _createHoldBar() {
      if (progressBar) return;
      progressBar = document.createElement('div');
      progressBar.id = 'hold-bar-wrap';
      progressBar.innerHTML = `<div id="hold-bar"></div><span>Hold to unlock…</span>`;
      $('settings-btn').parentElement.appendChild(progressBar);
    }

    function _removeHoldBar() {
      if (progressBar) { progressBar.remove(); progressBar = null; }
    }

    function _startHold() {
      clearInterval(holdTimer); // prevent double-start on mobile (touchstart + mousedown)
      holdStart = Date.now();
      _createHoldBar();
      holdTimer = setInterval(() => {
        const elapsed = Date.now() - holdStart;
        const pct     = Math.min(elapsed / 5000, 1) * 100;
        const bar     = $('hold-bar');
        if (bar) bar.style.width = pct + '%';
        if (elapsed >= 5000) {
          clearInterval(holdTimer);
          _removeHoldBar();
          openSettings();
        }
      }, 50);
    }

    function _endHold() {
      clearInterval(holdTimer);
      _removeHoldBar();
    }

    const sBtn = () => $('settings-btn');
    document.addEventListener('mousedown',  e => { if (e.target === sBtn()) _startHold(); });
    document.addEventListener('touchstart', e => { if (e.target === sBtn()) _startHold(); }, { passive: true });
    document.addEventListener('mouseup',    _endHold);
    document.addEventListener('touchend',   _endHold);
    document.addEventListener('mouseleave', _endHold);

    document.addEventListener('click', e => {
      if (e.target.id === 'close-settings-btn') closeSettings();
      if (e.target.id === 'save-settings-btn')  saveSettings();
      if (e.target.id === 'reset-progress-btn') resetProgress();
      if (e.target.id === 'milestone-ok-btn')   $('milestone-overlay').classList.add('hidden');
      if (e.target.id === 'back-btn')           showModeSelector();
    });
  }

  /* ══════════════════════════════════════════════════════════════
     MODE SELECTOR
  ══════════════════════════════════════════════════════════════ */
  function showModeSelector() {
    AdManager.destroy(); // no ads on the home screen
    _destroyActiveClocks();
    currentMode = null;
    Utils.saveToStorage('ce_lastMode', null);

    const content = $('main-content');
    content.innerHTML = `
      <section id="mode-selector">
        <h1 class="welcome-msg">What would you like to do? 😊</h1>
        <div class="mode-grid">
          ${_modeCard('read',      '🕐', 'Read the Clock',  'Look at the clock and choose the right time!')}
          ${_modeCard('set',       '🎯', 'Set the Clock',   'Move the hands to show the right time!')}
          ${_modeCard('match',     '🃏', 'Match Game',      'Match clocks with their times!')}
          ${_modeCard('freeplay',  '🎨', 'Free Play',       'Explore and play with the clock!')}
        </div>
      </section>`;

    content.querySelectorAll('.mode-card').forEach(card => {
      card.addEventListener('click', () => showMode(card.dataset.mode));
    });
  }

  function _modeCard(mode, emoji, title, desc) {
    return `
    <button class="mode-card" data-mode="${mode}" aria-label="${title}">
      <div class="mode-emoji">${emoji}</div>
      <div class="mode-title">${title}</div>
      <div class="mode-desc">${desc}</div>
    </button>`;
  }

  /* ══════════════════════════════════════════════════════════════
     SHOW MODE
  ══════════════════════════════════════════════════════════════ */
  function showMode(mode) {
    _destroyActiveClocks();
    currentMode = mode;
    Utils.saveToStorage('ce_lastMode', mode);
    sessionCorrect = 0;
    sessionTotal   = 0;

    switch (mode) {
      case 'read':     startReadMode();     break;
      case 'set':      startSetMode();      break;
      case 'match':    startMatchMode();    break;
      case 'freeplay': startFreePlayMode(); break;
    }

    // Start the delayed ad timer — resets automatically if switching between modules
    AdManager.init();
  }

  function _modeHeader(title) {
    return `<div class="mode-header">
      <button id="back-btn" class="btn btn-back" aria-label="Back to menu">← Back</button>
      <h2 class="mode-heading">${title}</h2>
      <div class="session-info" id="session-info"></div>
    </div>`;
  }

  function _updateSessionInfo() {
    const el = $('session-info');
    if (el) el.textContent = `${sessionCorrect} / ${sessionTotal} ⭐`;
  }

  /* ══════════════════════════════════════════════════════════════
     READ THE CLOCK MODE
  ══════════════════════════════════════════════════════════════ */
  function startReadMode() {
    const content = $('main-content');
    content.innerHTML = `
      ${_modeHeader('🕐 Read the Clock')}
      <div id="read-container">
        <p id="read-prompt" class="prompt-text">What time is it? 🕐</p>
        <div id="read-clock-wrap" class="clock-wrap"></div>
        <div id="read-digital" class="digital-time hidden"></div>
        <div id="read-choices" class="choices-grid"></div>
        <div id="read-feedback" class="feedback hidden"></div>
        <button id="read-next-btn" class="btn btn-primary next-btn hidden">Next Question ➡️</button>
      </div>`;

    generateQuestion();
  }

  function generateQuestion() {
    if (currentMode !== 'read' && currentMode !== 'set') return;

    const time = Utils.generateRandomTime(settings.difficulty);
    currentQuestion = { ...time, answered: false };

    sessionTotal++;
    _updateSessionInfo();

    if (currentMode === 'read') _renderReadQuestion(time);
    if (currentMode === 'set')  _renderSetQuestion(time);
  }

  function _renderReadQuestion(time) {
    const wrap = $('read-clock-wrap');
    const clock = ClockComponent.create(wrap, {
      showMinuteMarkers: settings.minuteMarkers,
    });
    clock.setTime(time.h, time.m);
    activeClocks.push(clock);

    // Digital helper
    const digital = $('read-digital');
    if (settings.showDigital === 'always') {
      digital.textContent = Utils.formatTime(time.h, time.m);
      digital.classList.remove('hidden');
    } else {
      digital.classList.add('hidden');
    }

    // Generate 4 choices
    const choices = _generateChoices(time);
    const choicesEl = $('read-choices');
    choicesEl.innerHTML = '';
    choices.forEach(c => {
      const btn = document.createElement('button');
      btn.className = 'choice-btn';
      btn.dataset.h = c.h;
      btn.dataset.m = c.m;
      btn.textContent = Utils.formatTime(c.h, c.m);
      btn.addEventListener('click', () => checkAnswer(c));
      choicesEl.appendChild(btn);
    });

    $('read-feedback').classList.add('hidden');
    $('read-next-btn').classList.add('hidden');
    currentQuestion.answered = false;

    if (settings.voicePrompts) {
      setTimeout(() => Utils.speak(`What time is it?`), 400);
    }
  }

  function _generateChoices(correct) {
    const choices = [correct];
    const usedKeys = new Set([`${correct.h}:${correct.m}`]);
    const stepSize = settings.difficulty < 4 ? 15 : 5;
    let attempts = 0;

    while (choices.length < 4 && attempts < 200) {
      attempts++;
      let h = correct.h;
      let m = correct.m;

      if (Math.random() < 0.5) {
        // Vary the minutes by 1–4 steps
        const direction = Math.random() < 0.5 ? -1 : 1;
        const offset    = (Math.floor(Math.random() * 4) + 1) * stepSize * direction;
        m = ((correct.m + offset) % 60 + 60) % 60;
      } else {
        // Vary the hour (pick a different hour 1–12)
        h = (correct.h % 12) + Math.floor(Math.random() * 11) + 1;
        if (h > 12) h -= 12;
      }

      if (h === correct.h && m === correct.m) continue;
      const key = `${h}:${m}`;
      if (usedKeys.has(key)) continue;
      usedKeys.add(key);
      choices.push({ h, m });
    }

    // Shuffle
    for (let i = choices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [choices[i], choices[j]] = [choices[j], choices[i]];
    }
    return choices;
  }

  function checkAnswer(chosen) {
    if (currentQuestion.answered) return;
    currentQuestion.answered = true;

    const correct = currentQuestion;
    const isCorrect = chosen.h === correct.h && chosen.m === correct.m;

    // Highlight choices
    document.querySelectorAll('.choice-btn').forEach(btn => {
      const bh = parseInt(btn.dataset.h), bm = parseInt(btn.dataset.m);
      btn.disabled = true;
      if (bh === correct.h && bm === correct.m) btn.classList.add('correct-choice');
      else if (bh === chosen.h && bm === chosen.m && !isCorrect) btn.classList.add('wrong-choice');
    });

    const digital = $('read-digital');
    if (settings.showDigital !== 'never') {
      digital.textContent = Utils.formatTime(correct.h, correct.m);
      digital.classList.remove('hidden');
    }

    if (isCorrect) {
      _onCorrect();
    } else {
      _onWrong(correct);
    }

    $('read-next-btn').classList.remove('hidden');
    $('read-next-btn').onclick = () => generateQuestion();
  }

  /* ══════════════════════════════════════════════════════════════
     SET THE CLOCK MODE
  ══════════════════════════════════════════════════════════════ */
  function startSetMode() {
    const content = $('main-content');
    content.innerHTML = `
      ${_modeHeader('🎯 Set the Clock')}
      <div id="set-container">
        <p id="set-prompt" class="prompt-text"></p>
        <div id="set-clock-wrap" class="clock-wrap"></div>
        <div id="set-current-time" class="digital-time"></div>
        <button id="set-check-btn" class="btn btn-primary check-btn">Check Answer ✅</button>
        <div id="set-feedback" class="feedback hidden"></div>
        <button id="set-next-btn" class="btn btn-primary next-btn hidden">Next Question ➡️</button>
      </div>`;

    generateQuestion();
  }

  function _renderSetQuestion(time) {
    const prompt = $('set-prompt');
    prompt.textContent = `Can you make ${Utils.formatTime(time.h, time.m)}? 🎯`;

    let currentSetTime = { h: 12, m: 0 };
    const wrap = $('set-clock-wrap');

    const clock = ClockComponent.create(wrap, {
      showMinuteMarkers: settings.minuteMarkers,
      draggable: true,
      strokeColor: '#5f27cd',
      hourColor:   '#ff6b6b',
      minuteColor: '#54a0ff',
      onDrag: (t) => {
        currentSetTime = t;
        _updateSetDisplay(t);
      }
    });
    clock.setTime(12, 0, false);
    activeClocks.push(clock);

    _updateSetDisplay({ h: 12, m: 0 });
    $('set-feedback').classList.add('hidden');
    $('set-next-btn').classList.add('hidden');
    currentQuestion.answered = false;

    $('set-check-btn').classList.remove('hidden');
    $('set-check-btn').onclick = () => {
      if (currentQuestion.answered) return;
      const t = clock.getTime();
      _checkSetAnswer(t, time);
    };

    if (settings.voicePrompts) {
      setTimeout(() => Utils.speak(`Can you make ${Utils.timeToWords(time.h, time.m)}?`), 400);
    }
  }

  function _updateSetDisplay(t) {
    const el = $('set-current-time');
    if (el) el.textContent = Utils.formatTime(t.h, t.m);
  }

  function _checkSetAnswer(given, target) {
    if (currentQuestion.answered) return;
    currentQuestion.answered = true;

    const tolerance = settings.difficulty <= 3 ? 5 : 1;
    // Normalize both hours to 0-11 range for comparison, then check within 1 step
    const givenH12  = given.h  % 12;
    const targetH12 = target.h % 12;
    const dH  = Math.abs(givenH12 - targetH12);
    const dM  = Math.abs(given.m - target.m);
    // Allow wrap-around: e.g. 12 vs 1 gives dH=11 which equals 1 step away on 12-hour clock
    const hourOk   = dH === 0 || dH === 11;
    const minuteOk = dM <= tolerance || dM >= (60 - tolerance);
    const isCorrect = hourOk && minuteOk;

    if (isCorrect) {
      _onCorrect();
    } else {
      _onWrong(target);
    }
    $('set-check-btn').classList.add('hidden');
    $('set-next-btn').classList.remove('hidden');
    $('set-next-btn').onclick = () => generateQuestion();
  }

  /* ══════════════════════════════════════════════════════════════
     MATCH GAME MODE
  ══════════════════════════════════════════════════════════════ */
  function startMatchMode() {
    const content = $('main-content');
    content.innerHTML = `
      ${_modeHeader('🃏 Match Game')}
      <div id="match-container">
        <p class="prompt-text">Tap a clock, then tap its time! 🃏</p>
        <div id="match-grid" class="match-grid"></div>
        <div id="match-feedback" class="feedback hidden"></div>
      </div>`;

    _buildMatchGame();
  }

  function _buildMatchGame() {
    const pairCount = settings.matchDifficulty === 'medium' ? 4 : 2;
    const times = [];
    const usedKeys = new Set();
    while (times.length < pairCount) {
      const t = Utils.generateRandomTime(settings.difficulty);
      const k = `${t.h}:${t.m}`;
      if (usedKeys.has(k)) continue;
      usedKeys.add(k);
      times.push(t);
    }

    // Create cards: clock cards + digital cards
    const cards = [];
    times.forEach((t, i) => {
      cards.push({ id: i, type: 'clock', time: t, matched: false });
      cards.push({ id: i, type: 'digital', time: t, matched: false });
    });

    // Shuffle
    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }

    const grid = $('match-grid');
    grid.innerHTML = '';
    grid.className = `match-grid pairs-${pairCount}`;

    let firstPick = null;
    let locked = false;

    cards.forEach((card, idx) => {
      const div = document.createElement('div');
      div.className = 'match-card';
      div.dataset.idx = idx;

      if (card.type === 'clock') {
        const clockWrap = document.createElement('div');
        clockWrap.className = 'match-clock-wrap';
        const clk = ClockComponent.create(clockWrap, {
          showMinuteMarkers: settings.minuteMarkers,
        });
        clk.setTime(card.time.h, card.time.m, false);
        activeClocks.push(clk);
        div.appendChild(clockWrap);
      } else {
        div.innerHTML = `<span class="match-digital">${Utils.formatTime(card.time.h, card.time.m)}</span>`;
      }

      div.addEventListener('click', () => {
        if (locked || div.classList.contains('matched') || div.classList.contains('selected')) return;

        div.classList.add('selected');

        if (!firstPick) {
          firstPick = { div, card };
          return;
        }

        // Second pick
        const second = { div, card };
        locked = true;

        if (firstPick.card.id === second.card.id && firstPick.card.type !== second.card.type) {
          // Match!
          setTimeout(() => {
            firstPick.div.classList.remove('selected');
            second.div.classList.remove('selected');
            firstPick.div.classList.add('matched');
            second.div.classList.add('matched');
            if (settings.soundEffects) Utils.soundCorrect();
            firstPick = null;
            locked = false;
            // Check win
            const allMatched = grid.querySelectorAll('.match-card:not(.matched)').length === 0;
            if (allMatched) _matchWin();
          }, 400);
        } else {
          // No match
          if (settings.soundEffects) Utils.soundWrong();
          setTimeout(() => {
            firstPick.div.classList.remove('selected');
            second.div.classList.remove('selected');
            firstPick = null;
            locked = false;
          }, 800);
        }
      });

      grid.appendChild(div);
    });

    sessionTotal++;
    _updateSessionInfo();
  }

  function _matchWin() {
    sessionCorrect++;
    _updateSessionInfo();
    showCelebration('win');
    const fb = $('match-feedback');
    fb.textContent = '🎉 You matched them all! Amazing!';
    fb.className = 'feedback correct-feedback';

    const replayBtn = document.createElement('button');
    replayBtn.className = 'btn btn-primary next-btn';
    replayBtn.textContent = 'Play Again 🔄';
    replayBtn.onclick = () => startMatchMode();
    $('match-container').appendChild(replayBtn);

    updateProgress(true, 'any');
  }

  /* ══════════════════════════════════════════════════════════════
     FREE PLAY MODE
  ══════════════════════════════════════════════════════════════ */
  function startFreePlayMode() {
    const content = $('main-content');
    content.innerHTML = `
      ${_modeHeader('🎨 Free Play')}
      <div id="freeplay-container">
        <p class="prompt-text">Move the hands and explore! 🎨</p>
        <div id="freeplay-clock-wrap" class="clock-wrap"></div>
        <div id="freeplay-digital" class="digital-time">12:00</div>
        <div id="freeplay-words" class="time-words">twelve o'clock</div>
        <button id="freeplay-speak-btn" class="btn btn-secondary">🔊 Say the time</button>
      </div>`;

    const wrap = $('freeplay-clock-wrap');
    let currentFPTime = { h: 12, m: 0 };

    const clock = ClockComponent.create(wrap, {
      showMinuteMarkers: settings.minuteMarkers,
      draggable: true,
      onDrag: (t) => {
        currentFPTime = t;
        $('freeplay-digital').textContent = Utils.formatTime(t.h, t.m);
        $('freeplay-words').textContent   = Utils.timeToWords(t.h, t.m);
      }
    });
    clock.setTime(12, 0, false);
    activeClocks.push(clock);

    $('freeplay-speak-btn').onclick = () => {
      Utils.speak(Utils.timeToWords(currentFPTime.h, currentFPTime.m));
    };
  }

  /* ══════════════════════════════════════════════════════════════
     FEEDBACK HELPERS
  ══════════════════════════════════════════════════════════════ */
  const CORRECT_PHRASES = [
    'Amazing! 🌟', 'Brilliant! ✨', 'Superstar! ⭐', 'You got it! 🎉',
    'Fantastic! 🌈', 'Wonderful! 💫', 'Great job! 👏', 'Spot on! 🎯'
  ];

  const WRONG_PHRASES = [
    "Good try! The answer was", "Almost! It was actually",
    "Not quite — it was", "Keep trying! The right answer was"
  ];

  function _onCorrect() {
    sessionCorrect++;
    _updateSessionInfo();
    const phrase = CORRECT_PHRASES[Math.floor(Math.random() * CORRECT_PHRASES.length)];
    if (settings.soundEffects) Utils.soundCorrect();
    if (settings.celebrations) showCelebration('correct');
    if (settings.voicePrompts) setTimeout(() => Utils.speak(phrase.replace(/[^\w\s'!]/g, '')), 200);

    const fbId = currentMode === 'read' ? 'read-feedback' : 'set-feedback';
    const fb = $(fbId);
    if (fb) {
      fb.textContent = phrase;
      fb.className = 'feedback correct-feedback';
    }
    updateProgress(true, _getTimeCategory(currentQuestion));
  }

  function _onWrong(correct) {
    const phrase = WRONG_PHRASES[Math.floor(Math.random() * WRONG_PHRASES.length)];
    const timeStr = Utils.formatTime(correct.h, correct.m);
    if (settings.soundEffects) Utils.soundWrong();
    if (settings.voicePrompts) setTimeout(() => Utils.speak(`${phrase} ${timeStr}`), 200);

    const fbId = currentMode === 'read' ? 'read-feedback' : 'set-feedback';
    const fb = $(fbId);
    if (fb) {
      fb.textContent = `${phrase} ${timeStr} 😊`;
      fb.className = 'feedback wrong-feedback';
    }
    updateProgress(false, _getTimeCategory(currentQuestion));
  }

  function _getTimeCategory(q) {
    if (!q) return 'any';
    if (q.m === 0)  return 'oclock';
    if (q.m === 30) return 'halfPast';
    if (q.m === 15 || q.m === 45) return 'quarter';
    if (q.m % 5 === 0) return 'fiveMin';
    return 'any';
  }

  /* ══════════════════════════════════════════════════════════════
     PROGRESS & REWARDS
  ══════════════════════════════════════════════════════════════ */
  function updateProgress(correct, category) {
    if (correct) {
      progress.totalStars++;
      progress.streak++;
      progress.correctTotal++;
      if (progress.streak > progress.bestStreak) progress.bestStreak = progress.streak;
      if (category && progress.categoryCorrect) {
        progress.categoryCorrect[category] = (progress.categoryCorrect[category] || 0) + 1;
      }
    } else {
      progress.streak = 0;
    }
    Utils.saveToStorage('ce_progress', progress);
    updateStarDisplay();
    _checkMilestones(correct);
  }

  function updateStarDisplay() {
    const el = $('star-count');
    if (el) el.textContent = progress.totalStars || 0;
  }

  const MILESTONES = [
    { key: 'first_star',     icon: '⭐', title: 'First Star!',       msg: 'You got your first correct answer!',          check: p => p.totalStars >= 1 },
    { key: 'streak_5',       icon: '🌟', title: '5 in a Row!',       msg: 'Amazing! 5 correct answers in a row!',        check: p => p.streak >= 5 },
    { key: 'oclock_master',  icon: '🏆', title: "O'Clock Master!",   msg: "10 o'clock times correct — you're a master!", check: p => (p.categoryCorrect.oclock  || 0) >= 10 },
    { key: 'halfpast_helper',icon: '🎉', title: 'Half Past Helper!', msg: '10 half past times correct!',                 check: p => (p.categoryCorrect.halfPast|| 0) >= 10 },
    { key: 'stars_25',       icon: '💫', title: 'Star Collector!',   msg: 'You earned 25 stars!',                        check: p => p.totalStars >= 25 },
    { key: 'stars_50',       icon: '🌈', title: 'Clock Wizard!',     msg: 'Wow — 50 stars earned!',                      check: p => p.totalStars >= 50 },
  ];

  function _checkMilestones(correct) {
    if (!correct) return;
    MILESTONES.forEach(m => {
      if (!progress.milestonesAchieved.includes(m.key) && m.check(progress)) {
        progress.milestonesAchieved.push(m.key);
        Utils.saveToStorage('ce_progress', progress);
        _showMilestone(m);
      }
    });
  }

  function _showMilestone(m) {
    $('milestone-icon').textContent  = m.icon;
    $('milestone-title').textContent = m.title;
    $('milestone-msg').textContent   = m.msg;
    $('milestone-overlay').classList.remove('hidden');
    if (settings.celebrations) showCelebration('milestone');
    if (settings.voicePrompts) Utils.speak(`${m.title} ${m.msg}`);
  }

  /* ══════════════════════════════════════════════════════════════
     CELEBRATION / ANIMATIONS
  ══════════════════════════════════════════════════════════════ */
  function showCelebration(type) {
    const layer = $('confetti-layer');
    if (!layer) return;
    if (type === 'correct' || type === 'win' || type === 'milestone') {
      Utils.launchConfetti(layer);
      if (settings.soundEffects && type !== 'correct') Utils.soundCelebration();
    }
  }

  /* ══════════════════════════════════════════════════════════════
     SETTINGS
  ══════════════════════════════════════════════════════════════ */
  function openSettings() {
    const overlay = $('settings-overlay');
    if (!overlay) return;
    // Populate form
    $('s-difficulty').value          = settings.difficulty;
    $('s-difficulty-val').textContent= settings.difficulty;
    $('s-digital').value             = settings.showDigital;
    $('s-sound').checked             = settings.soundEffects;
    $('s-voice').checked             = settings.voicePrompts;
    $('s-celebrations').checked      = settings.celebrations;
    $('s-minute-markers').checked    = settings.minuteMarkers;
    $('s-questions').value           = settings.questionsPerSession;
    $('s-match').value               = settings.matchDifficulty;

    $('s-difficulty').oninput = () => {
      $('s-difficulty-val').textContent = $('s-difficulty').value;
    };

    overlay.classList.remove('hidden');
  }

  function closeSettings() {
    $('settings-overlay').classList.add('hidden');
  }

  function saveSettings() {
    settings.difficulty          = parseInt($('s-difficulty').value);
    settings.showDigital         = $('s-digital').value;
    settings.soundEffects        = $('s-sound').checked;
    settings.voicePrompts        = $('s-voice').checked;
    settings.celebrations        = $('s-celebrations').checked;
    settings.minuteMarkers       = $('s-minute-markers').checked;
    settings.questionsPerSession = parseInt($('s-questions').value);
    settings.matchDifficulty     = $('s-match').value;
    Utils.saveToStorage('ce_settings', settings);
    closeSettings();
  }

  function resetProgress() {
    if (!confirm('Reset all progress and stars? This cannot be undone.')) return;
    progress = { ...DEFAULT_PROGRESS, categoryCorrect: { ...DEFAULT_PROGRESS.categoryCorrect }, milestonesAchieved: [] };
    Utils.saveToStorage('ce_progress', progress);
    updateStarDisplay();
    closeSettings();
  }

  /* ══════════════════════════════════════════════════════════════
     CLEANUP
  ══════════════════════════════════════════════════════════════ */
  function _destroyActiveClocks() {
    activeClocks.forEach(c => c.destroy && c.destroy());
    activeClocks = [];
  }

  return { init, showMode, showModeSelector, generateQuestion, checkAnswer, showCelebration, openSettings, closeSettings, updateProgress };
})();

// Boot
document.addEventListener('DOMContentLoaded', () => App.init());
