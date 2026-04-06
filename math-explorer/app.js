/**
 * app.js — Main application logic for Math Explorer.
 * Coordinates state, UI transitions, problem flow, rewards.
 *
 * Depends on: BigNum, Rewards, Problems, Blocks3D (loaded via script tags)
 */

/* ══════════════════════════════════════════════════════════════════
   STRINGS — Central English UI text (i18n-ready structure).
   All user-facing text lives here.
   ══════════════════════════════════════════════════════════════════ */
const STRINGS = {
  // Feedback messages
  correctMsgs: ['Great job! 🎉', 'Amazing! 🌟', 'Perfect! ⭐', 'Awesome! 🏆', 'Fantastic! 🚀'],
  wrongMsgs:   ['Try again! 💪', "That's OK, have another go! 😊", 'So close! 🌈', 'Keep trying! 👍'],

  // Points popup
  pointsPopup: (pts) => `+${pts} pts!`,

  // Streak display
  streakDisplay: (n, mult) => `🔥 ${n} in a row! ×${mult}`,

  // Level-up sub-text (injected into #levelup-sub via JS)
  levelUpSub: (n) => `You reached Level <strong>${n}</strong>!`,

  // Badge toast
  badgeToast: (badge) => `${badge.icon} Badge: ${badge.name}`,

  // Parent gate instructions
  gateIdle:    'Hold the button',
  gateHolding: 'Holding... ⏳',

  // Settings stats (each returns a <div> for innerHTML joining)
  statTotal:    (n) => `<div>Total: <strong>${n}</strong></div>`,
  statAccuracy: (n) => `<div>Accuracy: <strong>${n}%</strong></div>`,
  statStreak:   (n) => `<div>Best streak: <strong>${n}</strong></div>`,
  statPoints:   (n) => `<div>Points: <strong>${n.toLocaleString()}</strong></div>`,
  statFav:      (mode) => `<div>Favourite: <strong>${mode}</strong></div>`,

  // Max level text
  maxLevel: 'Max!',

  // Confirm reset
  confirmReset: 'Reset all progress? This cannot be undone.',

  // Auto-spin button labels
  autoSpinStart: '▶ Auto Rotate',
  autoSpinStop:  '⏹ Stop',

  // Number reading instructions
  numToWords: 'How do you say this number?',
  wordsToNum: 'What number is this?',

  // Place value instruction
  placeValueQ: (place) => `What is the ${place} digit?`,

  // Mode names (for stats display)
  modeNames: {
    numberRead:  'Number Reading',
    counting:    'Counting',
    addition:    'Addition',
    subtraction: 'Subtraction',
    placeValue:  'Place Value',
    blocks3d:    '3D Blocks',
  },
};

/* ══════════════════════════════════════════════════════════════════
   SPEECH — Stub. Wire to Web Speech API or TTS later.
   ══════════════════════════════════════════════════════════════════ */
function speakText(text) {
  if (!text) return;
  // Web Speech API stub — enable when desired
  if ('speechSynthesis' in window) {
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = 'en-NZ';
    utt.rate = 0.85;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utt);
  }
}

/* ══════════════════════════════════════════════════════════════════
   APP STATE — localStorage-backed
   ══════════════════════════════════════════════════════════════════ */
const AppState = (() => {
  const STORAGE_KEY = 'mathExplore_state_v1';

  const DEFAULTS = {
    level: 1,
    points: 0,
    streak: 0,
    maxStreak: 0,
    totalAnswered: 0,
    correctAnswered: 0,
    badges: [],
    modeStats: { numberRead: 0, counting: 0, addition: 0, subtraction: 0, placeValue: 0, blocks3d: 0 },
    sound: false,
    animations: true,
    advancedMode: false,
    startDifficulty: 1,
  };

  let state = Object.assign({}, DEFAULTS);

  // Currently active problem (transient, not persisted)
  let currentProblem = null;
  let currentMode = null;

  function load() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
      if (saved) {
        state = Object.assign({}, DEFAULTS, saved);
        // Merge nested modeStats
        state.modeStats = Object.assign({}, DEFAULTS.modeStats, saved.modeStats || {});
      }
    } catch (e) {
      console.warn('AppState.load failed:', e);
    }
  }

  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('AppState.save failed:', e);
    }
  }

  function reset() {
    state = Object.assign({}, DEFAULTS);
    state.modeStats = Object.assign({}, DEFAULTS.modeStats);
    state.badges = [];
    save();
  }

  function setSetting(key, value) {
    state[key] = value;
    save();
    // Apply animation setting immediately
    if (key === 'animations') {
      document.body.classList.toggle('no-anim', !value);
    }
  }

  function get() { return state; }

  return { load, save, reset, get, setSetting, get currentProblem() { return currentProblem; },
    set currentProblem(v) { currentProblem = v; },
    get currentMode() { return currentMode; },
    set currentMode(v) { currentMode = v; },
  };
})();

/* ══════════════════════════════════════════════════════════════════
   UI — Screen management, rendering helpers
   ══════════════════════════════════════════════════════════════════ */
const UI = (() => {
  let blockRenderer = null;  // Blocks3D renderer instance
  let autoSpinning = false;
  let gateHoldTimer = null;
  let _gateHoldTime = null;
  let gateHoldInterval = null;
  let addVisualShown = false;
  let subVisualShown = false;
  let countAnimating = false;

  /* ── Screen switching ──────────────────────────────────────────── */
  function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const target = document.getElementById(id);
    if (target) {
      target.classList.add('active');
      target.scrollTop = 0;
      window.scrollTo(0, 0);
    }
  }

  function goHome() {
    if (blockRenderer) { blockRenderer.stopAutoSpin(); }
    autoSpinning = false;
    const btn = document.getElementById('btn-autospin');
    if (btn) btn.textContent = STRINGS.autoSpinStart;
    AdManager.destroy();
    showScreen('home-screen');
    refreshHome();
  }

  /* ── Home screen refresh ─────────────────────────────────────── */
  function refreshHome() {
    const s = AppState.get();

    _qs('#home-level').textContent = s.level;
    _qs('#home-lvl-cur').textContent = s.level;
    _qs('#home-points').textContent = s.points.toLocaleString();
    _qs('#home-streak').textContent = s.streak;

    const ptsCur  = Rewards.pointsForCurrentLevel(s.level);
    const ptsNext = Rewards.pointsForNextLevel(s.level);
    _qs('#home-lvl-pts-cur').textContent = (s.points - ptsCur).toLocaleString();
    if (ptsNext !== null) {
      _qs('#home-lvl-pts-next').textContent = (ptsNext - ptsCur).toLocaleString();
      const pct = Math.min(100, Math.round(((s.points - ptsCur) / (ptsNext - ptsCur)) * 100));
      _qs('#home-lvl-bar').style.width = pct + '%';
    } else {
      _qs('#home-lvl-pts-next').textContent = STRINGS.maxLevel;
      _qs('#home-lvl-bar').style.width = '100%';
    }

    // Earned badges strip
    const strip = _qs('#home-badges');
    const earned = Rewards.getEarnedBadges(s);
    strip.innerHTML = earned.slice(-5).map(b =>
      `<div class="badge-item">${b.icon} ${b.name}</div>`
    ).join('');
  }

  /* ── Mode start ──────────────────────────────────────────────── */
  function startMode(mode) {
    AppState.currentMode = mode;
    const s = AppState.get();
    // Update modeStats
    s.modeStats[mode] = (s.modeStats[mode] || 0) + 1;
    AppState.save();

    showScreen(mode + '-screen');
    // Reset per-mode score display
    const scoreEl = document.getElementById(modePrefix(mode) + '-score');
    if (scoreEl) scoreEl.textContent = s.points;

    addVisualShown = false;
    subVisualShown = false;

    // Generate first problem
    generateAndShowProblem(mode);

    // Start the delayed ad timer for this module screen
    AdManager.init();
  }

  function modePrefix(mode) {
    return { numberRead:'nr', counting:'cnt', addition:'add', subtraction:'sub', placeValue:'pv', blocks3d:'b3d' }[mode];
  }

  /* ── Problem generation ──────────────────────────────────────── */
  function generateAndShowProblem(mode) {
    const s = AppState.get();
    const level = s.level;
    let problem;
    switch (mode) {
      case 'numberRead':   problem = Problems.numberReadProblem(level);   break;
      case 'counting':     problem = Problems.countingProblem(level);     break;
      case 'addition':     problem = Problems.additionProblem(level);     break;
      case 'subtraction':  problem = Problems.subtractionProblem(level);  break;
      case 'placeValue':   problem = Problems.placeValueProblem(level);   break;
      case 'blocks3d':     problem = Problems.blockProblem(level);        break;
      default: return;
    }
    AppState.currentProblem = problem;
    renderProblem(mode, problem);
  }

  /* ── Render problem ──────────────────────────────────────────── */
  function renderProblem(mode, problem) {
    clearFeedback(mode);
    hideNext(mode);
    addVisualShown = false;
    subVisualShown = false;
    countAnimating = false;

    switch (mode) {
      case 'numberRead':   renderNumberRead(problem);  break;
      case 'counting':     renderCounting(problem);    break;
      case 'addition':     renderAddition(problem);    break;
      case 'subtraction':  renderSubtraction(problem); break;
      case 'placeValue':   renderPlaceValue(problem);  break;
      case 'blocks3d':     renderBlocks3D(problem);    break;
    }
  }

  /* ── Number Reading ──────────────────────────────────────────── */
  function renderNumberRead(p) {
    const instr = p.type === 'numToWords'
      ? STRINGS.numToWords
      : STRINGS.wordsToNum;
    _qs('#nr-instruction').textContent = instr;

    const display = _qs('#nr-display');
    if (p.type === 'numToWords') {
      display.className = 'question-number-big';
      display.textContent = p.display;
    } else {
      display.className = 'question-words-big';
      display.textContent = p.display;
    }

    renderChoices('nr-choices', p.choices, p.correctChoice, 'numberRead');
    _qs('#nr-score').textContent = AppState.get().points;
  }

  /* ── Counting ────────────────────────────────────────────────── */
  function renderCounting(p) {
    const grid = _qs('#cnt-emoji-grid');
    grid.innerHTML = '';
    for (let i = 0; i < p.count; i++) {
      const el = document.createElement('span');
      el.className = 'emoji-item';
      el.textContent = p.emoji;
      el.style.animationDelay = (i * 0.05) + 's';
      grid.appendChild(el);
    }
    renderChoices('cnt-choices', p.choices, p.correctChoice, 'counting');
    _qs('#cnt-score').textContent = AppState.get().points;
    _qs('#cnt-helper-btn').style.display = 'inline-flex';
  }

  /* ── Addition ────────────────────────────────────────────────── */
  function renderAddition(p) {
    const expr = _qs('#add-expr');
    expr.innerHTML = `<span>${p.a}</span> + <span>${p.b}</span> = ?`;

    const visual = _qs('#add-visual-area');
    visual.classList.add('hidden');
    visual.innerHTML = '';
    _buildArithmeticVisual(visual, p.a, p.b, '+', p.emoji);

    const helper = _qs('#add-helper-btn');
    helper.style.display = p.showBlocks ? 'inline-flex' : 'none';

    renderChoices('add-choices', p.choices, p.correctChoice, 'addition');
    _qs('#add-score').textContent = AppState.get().points;
  }

  /* ── Subtraction ─────────────────────────────────────────────── */
  function renderSubtraction(p) {
    const expr = _qs('#sub-expr');
    expr.innerHTML = `<span>${p.a}</span> − <span>${p.b}</span> = ?`;

    const visual = _qs('#sub-visual-area');
    visual.classList.add('hidden');
    visual.innerHTML = '';
    _buildArithmeticVisual(visual, p.a, p.b, '-', p.emoji);

    const helper = _qs('#sub-helper-btn');
    helper.style.display = p.showBlocks ? 'inline-flex' : 'none';

    renderChoices('sub-choices', p.choices, p.correctChoice, 'subtraction');
    _qs('#sub-score').textContent = AppState.get().points;
  }

  /** Build visual emoji groups for arithmetic problems. */
  function _buildArithmeticVisual(container, a, b, op, emoji) {
    const mk = (n, dim) => {
      const wrap = document.createElement('div');
      wrap.className = 'add-group';
      const num = document.createElement('div');
      num.className = 'add-group-num';
      num.textContent = n;
      const grid = document.createElement('div');
      grid.className = 'emoji-grid';
      for (let i = 0; i < n; i++) {
        const sp = document.createElement('span');
        sp.className = 'emoji-item' + (dim ? ' dim' : '');
        sp.textContent = emoji;
        grid.appendChild(sp);
      }
      wrap.appendChild(num);
      wrap.appendChild(grid);
      return wrap;
    };

    container.appendChild(mk(a, false));
    const opEl = document.createElement('div');
    opEl.className = 'add-operator';
    opEl.textContent = op === '+' ? '+' : '−';
    container.appendChild(opEl);
    container.appendChild(mk(b, op === '-'));
  }

  /* ── Place Value ─────────────────────────────────────────────── */
  function renderPlaceValue(p) {
    _qs('#pv-number').textContent = p.displayNumber;
    _qs('#pv-instruction').textContent = STRINGS.placeValueQ(p.targetPlace.place);

    // Visual: show digit columns
    const vis = _qs('#pv-visual');
    vis.innerHTML = '';
    const bd = p.breakdown.slice().reverse(); // most significant first
    bd.forEach(item => {
      const col = document.createElement('div');
      col.className = 'place-column' + (item.power === p.targetPlace.power ? ' target-col' : '');
      const lbl = document.createElement('div');
      lbl.className = 'place-label';
      lbl.textContent = item.place;
      const dig = document.createElement('div');
      dig.className = 'place-digit';
      dig.textContent = item.digit;
      col.appendChild(lbl);
      col.appendChild(dig);
      // Show block icons
      const blocks = document.createElement('div');
      blocks.className = 'pv-blocks';
      const blockIcon = ['🟦','📏','🟧','💠','⬛'][Math.min(item.power, 4)];
      for (let i = 0; i < item.digit; i++) {
        const b = document.createElement('span');
        b.textContent = blockIcon;
        b.className = `pv-block-${['cube','rod','flat','big','huge'][Math.min(item.power,4)]}`;
        blocks.appendChild(b);
      }
      col.appendChild(blocks);
      vis.appendChild(col);
    });

    renderChoices('pv-choices', p.choices, p.correctChoice, 'placeValue');
    _qs('#pv-score').textContent = AppState.get().points;
  }

  /* ── 3D Blocks ───────────────────────────────────────────────── */
  function renderBlocks3D(p) {
    const container = _qs('#blocks3d-container');

    // (Re)create renderer
    if (blockRenderer) blockRenderer.destroy();
    blockRenderer = Blocks3D.createRenderer(container);
    blockRenderer.setBlocks(p.blocks);

    autoSpinning = false;
    const btn = document.getElementById('btn-autospin');
    if (btn) btn.textContent = STRINGS.autoSpinStart;

    renderChoices('b3d-choices', p.choices, p.correctChoice, 'blocks3d');
    _qs('#b3d-score').textContent = AppState.get().points;
  }

  /* ── Choices rendering ───────────────────────────────────────── */
  function renderChoices(containerId, choices, correctChoice, mode) {
    const container = _qs('#' + containerId);
    container.innerHTML = '';
    choices.forEach(choice => {
      const btn = document.createElement('button');
      btn.className = 'choice-btn';
      btn.textContent = choice;
      btn.setAttribute('aria-label', String(choice));
      btn.addEventListener('click', () => handleAnswer(mode, choice, correctChoice, btn, container));
      container.appendChild(btn);
    });
  }

  /* ── Answer handling ─────────────────────────────────────────── */
  function handleAnswer(mode, choice, correctChoice, clickedBtn, container) {
    // Disable all choices
    container.querySelectorAll('.choice-btn').forEach(b => b.classList.add('disabled'));

    const isCorrect = String(choice) === String(correctChoice);
    const s = AppState.get();
    const prefix = modePrefix(mode);

    if (isCorrect) {
      clickedBtn.classList.add('correct');
      const { pointsEarned, levelUp, newBadges } = Rewards.awardCorrect(s);
      AppState.save();

      showFeedback(prefix, true, pointsEarned, s.streak);
      showPointsPopup(STRINGS.pointsPopup(pointsEarned));
      if (s.animations !== false) {
        Rewards.confetti(_qs('#confetti-container'), 20);
      }

      // Update scores
      const scoreEl = document.getElementById(prefix + '-score');
      if (scoreEl) scoreEl.textContent = s.points;

      // Handle 3D: highlight layers after correct
      if (mode === 'blocks3d' && blockRenderer) {
        blockRenderer.stopAutoSpin();
        autoSpinning = false;
        blockRenderer.highlightLayers();
      }

      if (levelUp) {
        setTimeout(() => showLevelUp(s.level), 800);
      }
      if (newBadges.length > 0) {
        setTimeout(() => showBadgeToast(newBadges[0]), levelUp ? 2200 : 800);
      }
    } else {
      clickedBtn.classList.add('wrong');
      // Highlight correct
      container.querySelectorAll('.choice-btn').forEach(b => {
        if (String(b.textContent) === String(correctChoice)) b.classList.add('correct');
      });
      Rewards.recordWrong(s);
      AppState.save();
      showFeedback(prefix, false, 0, s.streak);
    }

    showNext(mode);
  }

  /* ── Feedback ─────────────────────────────────────────────────── */

  function showFeedback(prefix, correct, pts, streak) {
    const el = _qs('#' + prefix + '-feedback');
    if (!el) return;
    const msgs = correct ? STRINGS.correctMsgs : STRINGS.wrongMsgs;
    el.textContent = msgs[Math.floor(Math.random() * msgs.length)];
    el.className = 'feedback-msg ' + (correct ? 'correct-msg' : 'wrong-msg');

    const streakEl = _qs('#' + prefix + '-streak');
    if (streakEl) {
      if (correct && streak >= 3) {
        streakEl.textContent = STRINGS.streakDisplay(streak, Rewards.streakMultiplier(streak).toFixed(1));
      } else {
        streakEl.textContent = '';
      }
    }
  }

  function clearFeedback(mode) {
    const prefix = modePrefix(mode);
    const el = _qs('#' + prefix + '-feedback');
    if (el) { el.textContent = ''; el.className = 'feedback-msg'; }
    const streakEl = _qs('#' + prefix + '-streak');
    if (streakEl) streakEl.textContent = '';
  }

  /* ── Points popup ────────────────────────────────────────────── */
  function showPointsPopup(text) {
    const el = document.createElement('div');
    el.className = 'points-popup';
    el.textContent = text;
    document.body.appendChild(el);
    el.addEventListener('animationend', () => el.remove());
  }

  /* ── Level-up ────────────────────────────────────────────────── */
  function showLevelUp(newLevel) {
    _qs('#levelup-new').textContent = newLevel;
    _qs('#levelup-overlay').classList.add('show');
    if (AppState.get().animations !== false) {
      Rewards.confetti(_qs('#confetti-container'), 50);
    }
  }

  function closeLevelUp() {
    _qs('#levelup-overlay').classList.remove('show');
  }

  /* ── Badge toast ─────────────────────────────────────────────── */
  function showBadgeToast(badge) {
    const el = document.createElement('div');
    el.style.cssText = [
      'position:fixed','bottom:24px','left:50%',
      'transform:translateX(-50%) translateY(80px)',
      'background:white','border-radius:50px',
      'padding:12px 24px','font-weight:800','font-size:1rem',
      'box-shadow:0 6px 20px rgba(0,0,0,0.18)',
      'z-index:600','transition:transform 0.4s cubic-bezier(.18,.89,.32,1.28)',
      'white-space:nowrap',
    ].join(';');
    el.textContent = STRINGS.badgeToast(badge);
    document.body.appendChild(el);
    requestAnimationFrame(() => {
      el.style.transform = 'translateX(-50%) translateY(0)';
    });
    setTimeout(() => {
      el.style.transform = 'translateX(-50%) translateY(80px)';
      el.addEventListener('transitionend', () => el.remove());
    }, 2500);
  }

  /* ── Next button ─────────────────────────────────────────────── */
  function showNext(mode) {
    const prefix = modePrefix(mode);
    const btn = _qs('#' + prefix + '-next');
    if (btn) btn.classList.add('show');
  }

  function hideNext(mode) {
    const prefix = modePrefix(mode);
    const btn = _qs('#' + prefix + '-next');
    if (btn) btn.classList.remove('show');
  }

  function nextQuestion(mode) {
    generateAndShowProblem(mode);
  }

  /* ── Counting helper: one by one ─────────────────────────────── */
  function countOneByOne() {
    if (countAnimating) return;
    countAnimating = true;
    const items = _qs('#cnt-emoji-grid').querySelectorAll('.emoji-item');
    items.forEach(el => el.classList.remove('highlighted'));
    let i = 0;
    function step() {
      if (i < items.length) {
        if (i > 0) items[i-1].classList.remove('highlighted');
        items[i].classList.add('highlighted');
        speakText(String(i + 1));
        i++;
        setTimeout(step, 700);
      } else {
        if (i > 0) items[i-1].classList.remove('highlighted');
        countAnimating = false;
      }
    }
    step();
  }

  /* ── Addition visual toggle ──────────────────────────────────── */
  function toggleAddVisual() {
    addVisualShown = !addVisualShown;
    const el = _qs('#add-visual-area');
    const expr = _qs('#add-expr');
    if (addVisualShown) {
      el.classList.remove('hidden');
      expr.classList.add('hidden');
    } else {
      el.classList.add('hidden');
      expr.classList.remove('hidden');
    }
  }

  /* ── Subtraction visual toggle ───────────────────────────────── */
  function toggleSubVisual() {
    subVisualShown = !subVisualShown;
    const el = _qs('#sub-visual-area');
    const expr = _qs('#sub-expr');
    if (subVisualShown) {
      el.classList.remove('hidden');
      expr.classList.add('hidden');
    } else {
      el.classList.add('hidden');
      expr.classList.remove('hidden');
    }
  }

  /* ── 3D block controls ───────────────────────────────────────── */
  function resetBlock3DView() {
    if (blockRenderer) blockRenderer.resetView();
  }

  function toggleAutoSpin() {
    if (!blockRenderer) return;
    autoSpinning = !autoSpinning;
    const btn = document.getElementById('btn-autospin');
    if (autoSpinning) {
      blockRenderer.startAutoSpin();
      if (btn) btn.textContent = STRINGS.autoSpinStop;
    } else {
      blockRenderer.stopAutoSpin();
      if (btn) btn.textContent = STRINGS.autoSpinStart;
    }
  }

  /* ── Rewards screen ──────────────────────────────────────────── */
  function refreshRewards() {
    const s = AppState.get();
    _qs('#rew-level').textContent = s.level;
    _qs('#rew-lvl-cur').textContent = s.level;
    _qs('#rew-total').textContent = s.totalAnswered;
    _qs('#rew-correct').textContent = s.correctAnswered;
    const acc = s.totalAnswered > 0
      ? Math.round((s.correctAnswered / s.totalAnswered) * 100) : 0;
    _qs('#rew-accuracy').textContent = acc + '%';
    _qs('#rew-maxstreak').textContent = s.maxStreak;

    const ptsCur  = Rewards.pointsForCurrentLevel(s.level);
    const ptsNext = Rewards.pointsForNextLevel(s.level);
    _qs('#rew-lvl-pts-cur').textContent = (s.points - ptsCur).toLocaleString();
    if (ptsNext !== null) {
      _qs('#rew-lvl-pts-next').textContent = (ptsNext - ptsCur).toLocaleString();
      const pct = Math.min(100, Math.round(((s.points - ptsCur) / (ptsNext - ptsCur)) * 100));
      _qs('#rew-lvl-bar').style.width = pct + '%';
    } else {
      _qs('#rew-lvl-pts-next').textContent = STRINGS.maxLevel;
      _qs('#rew-lvl-bar').style.width = '100%';
    }

    // Badges
    const grid = _qs('#rew-badges');
    grid.innerHTML = '';
    Rewards.getAllBadges().forEach(badge => {
      const earned = (s.badges || []).includes(badge.id);
      const card = document.createElement('div');
      card.className = 'badge-card' + (earned ? '' : ' locked');
      card.setAttribute('role', 'listitem');
      card.setAttribute('aria-label', badge.name + (earned ? ' — earned' : ' — locked'));
      card.innerHTML = `<div class="badge-icon">${badge.icon}</div><div class="badge-name">${badge.name}</div>`;
      grid.appendChild(card);
    });
  }

  /* ── Parent gate ─────────────────────────────────────────────── */
  function openParentGate() {
    _qs('#parent-gate-modal').classList.add('open');
    _qs('#gate-instruction').textContent = STRINGS.gateIdle;
    _qs('#gate-hold-progress').style.height = '0%';
  }

  function closeParentGate() {
    _qs('#parent-gate-modal').classList.remove('open');
    gateHoldEnd();
  }

  function gateHoldStart(e) {
    if (e) e.preventDefault();
    if (gateHoldInterval) { clearInterval(gateHoldInterval); gateHoldInterval = null; }
    _gateHoldTime = Date.now();
    _qs('#gate-instruction').textContent = STRINGS.gateHolding;

    const progress = _qs('#gate-hold-progress');
    const DURATION = 2000;
    gateHoldInterval = setInterval(() => {
      const elapsed = Date.now() - _gateHoldTime;
      const pct = Math.min(100, (elapsed / DURATION) * 100);
      progress.style.height = pct + '%';
      if (elapsed >= DURATION) {
        clearInterval(gateHoldInterval);
        gateHoldInterval = null;
        _qs('#parent-gate-modal').classList.remove('open');
        openSettings();
      }
    }, 30);
  }

  function gateHoldEnd() {
    if (gateHoldInterval) {
      clearInterval(gateHoldInterval);
      gateHoldInterval = null;
    }
    _qs('#gate-hold-progress').style.height = '0%';
    _qs('#gate-instruction').textContent = STRINGS.gateIdle;
  }

  /* ── Settings ────────────────────────────────────────────────── */
  function openSettings() {
    const s = AppState.get();
    _qs('#toggle-sound').checked   = !!s.sound;
    _qs('#toggle-anim').checked    = s.animations !== false;
    _qs('#toggle-advanced').checked = !!s.advancedMode;
    _qs('#select-difficulty').value = String(s.startDifficulty || 1);

    // Stats
    const statsEl = _qs('#settings-stats');
    const acc = s.totalAnswered > 0
      ? Math.round((s.correctAnswered / s.totalAnswered) * 100) : 0;
    const favMode = Object.entries(s.modeStats || {}).filter(([,v]) => v > 0).sort((a,b) => b[1]-a[1])[0];
    statsEl.innerHTML = [
      STRINGS.statTotal(s.totalAnswered),
      STRINGS.statAccuracy(acc),
      STRINGS.statStreak(s.maxStreak),
      STRINGS.statPoints(s.points || 0),
      favMode ? STRINGS.statFav(STRINGS.modeNames[favMode[0]] || favMode[0]) : '',
    ].join('');

    // Big number demo area
    const demoArea = _qs('#bignum-demo-area');
    if (s.advancedMode) {
      demoArea.classList.remove('hidden');
      refreshBignumDemo();
    } else {
      demoArea.classList.add('hidden');
    }

    _qs('#settings-modal').classList.add('open');
  }

  function closeSettings() {
    _qs('#settings-modal').classList.remove('open');
  }

  function confirmReset() {
    if (confirm(STRINGS.confirmReset)) {
      AppState.reset();
      closeSettings();
      refreshHome();
    }
  }

  /* ── Big number demo ─────────────────────────────────────────── */
  function refreshBignumDemo() {
    const A = BigNum.randomBigNum(50);
    const B = BigNum.randomBigNum(50);
    const sum = BigNum.add(A, B);
    _qs('#bignum-A').textContent = BigNum.formatCommas(A);
    _qs('#bignum-B').textContent = BigNum.formatCommas(B);
    _qs('#bignum-sum').textContent = BigNum.formatCommas(sum);
    // English reading (first 120 chars to keep it manageable)
    const english = BigNum.toEnglish(A);
    _qs('#bignum-korean').textContent = english.length > 120 ? english.slice(0, 120) + '...' : english;
    // Digit groups
    const digits = BigNum.toDigitArray(A).reverse();
    const grouped = digits.reduce((acc, d, i) => {
      const exp = digits.length - 1 - i;
      acc += d + (exp > 0 ? `<sup style="font-size:0.55em;opacity:0.6">(10^${exp})</sup>` : '');
      return acc;
    }, '');
    _qs('#bignum-groups').innerHTML = grouped;
  }

  /* ── Utility ─────────────────────────────────────────────────── */
  function speakCurrentProblem() {
    const p = AppState.currentProblem;
    speakText(p ? p.display : '');
  }

  function _qs(sel) { return document.querySelector(sel); }

  return {
    showScreen, goHome, refreshHome, refreshRewards,
    startMode, nextQuestion, speakCurrentProblem,
    countOneByOne, toggleAddVisual, toggleSubVisual,
    resetBlock3DView, toggleAutoSpin,
    openParentGate, closeParentGate, gateHoldStart, gateHoldEnd,
    openSettings, closeSettings, confirmReset,
    refreshBignumDemo, closeLevelUp,
  };
})();

/* ══════════════════════════════════════════════════════════════════
   INIT
   ══════════════════════════════════════════════════════════════════ */
(function init() {
  AppState.load();
  const s = AppState.get();

  // Apply saved settings
  if (s.animations === false) document.body.classList.add('no-anim');

  UI.refreshHome();

  // Refresh rewards screen data when its card is clicked
  document.querySelectorAll('[data-mode="rewards"]').forEach(el => {
    el.addEventListener('click', () => UI.refreshRewards());
  });
})();
