// utils.js — Clock Educator utility functions (loaded first)

const Utils = (() => {

  /* ── Time ↔ Angle conversions ─────────────────────────────── */

  function hourAngle(h, m)   { return (h % 12) * 30 + m * 0.5; }
  function minuteAngle(m)    { return m * 6; }
  function secondAngle(s)    { return s * 6; }

  function timeToAngles(h, m) {
    return { hour: hourAngle(h, m), minute: minuteAngle(m) };
  }

  function anglesToTime(hAngle, mAngle) {
    let m = Math.round(mAngle / 6) % 60;
    if (m < 0) m += 60;
    let h = Math.round(hAngle / 30) % 12;
    if (h < 0) h += 12;
    if (h === 0) h = 12;
    return { h, m };
  }

  /* ── Angle snapping ───────────────────────────────────────── */

  function snapToInterval(angle, interval) {
    return Math.round(angle / interval) * interval;
  }

  /* ── Random time generation ───────────────────────────────── */

  function generateRandomTime(difficulty) {
    const h = Math.floor(Math.random() * 12) + 1; // 1-12
    let m;
    switch (difficulty) {
      case 1:  m = 0;  break;
      case 2:  m = [0, 30][Math.floor(Math.random() * 2)];  break;
      case 3:  m = [0, 15, 30, 45][Math.floor(Math.random() * 4)];  break;
      case 4:  m = Math.floor(Math.random() * 12) * 5;  break;
      default: m = Math.floor(Math.random() * 60);  break;
    }
    return { h, m };
  }

  /* ── Formatting ───────────────────────────────────────────── */

  function formatTime(h, m) {
    const mm = String(m).padStart(2, '0');
    return `${h}:${mm}`;
  }

  function timeToWords(h, m) {
    const hourNames = ['', 'one', 'two', 'three', 'four', 'five', 'six',
                       'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'];
    const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty'];
    const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six',
                  'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve',
                  'thirteen', 'fourteen', 'quarter', 'sixteen', 'seventeen',
                  'eighteen', 'nineteen'];

    function minuteWord(n) {
      if (n === 0)  return '';
      if (n === 15) return 'quarter';
      if (n === 30) return 'half';
      if (n < 20)   return ones[n];
      const t = Math.floor(n / 10);
      const o = n % 10;
      return o === 0 ? tens[t] : tens[t] + ' ' + ones[o];
    }

    const hNext = (h % 12) + 1 || 12;
    const hName = hourNames[h];
    const hNextName = hourNames[hNext];

    if (m === 0)  return `${hName} o'clock`;
    if (m === 30) return `half past ${hName}`;
    if (m === 15) return `quarter past ${hName}`;
    if (m === 45) return `quarter to ${hNextName}`;
    if (m < 30)   return `${minuteWord(m)} past ${hName}`;
    return `${minuteWord(60 - m)} to ${hNextName}`;
  }

  /* ── LocalStorage helpers ─────────────────────────────────── */

  function saveToStorage(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {}
  }

  function loadFromStorage(key, defaultValue) {
    try {
      const raw = localStorage.getItem(key);
      return raw !== null ? JSON.parse(raw) : defaultValue;
    } catch (e) { return defaultValue; }
  }

  /* ── Web Speech ───────────────────────────────────────────── */

  function speak(text) {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.rate = 0.85;
    utt.pitch = 1.1;
    window.speechSynthesis.speak(utt);
  }

  /* ── Web Audio sound effects ──────────────────────────────── */

  let _audioCtx = null;
  function _getCtx() {
    if (!_audioCtx) {
      try { _audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {}
    }
    return _audioCtx;
  }

  function _beep(freq, duration, type, gainVal, delay = 0) {
    const ctx = _getCtx();
    if (!ctx) return;
    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type      = type || 'sine';
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(gainVal || 0.3, ctx.currentTime + delay);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + duration);
    osc.start(ctx.currentTime + delay);
    osc.stop(ctx.currentTime + delay + duration + 0.05);
  }

  function soundCorrect() {
    _beep(523, 0.12, 'sine', 0.3, 0.0);
    _beep(659, 0.12, 'sine', 0.3, 0.13);
    _beep(784, 0.20, 'sine', 0.3, 0.26);
  }

  function soundWrong() {
    _beep(280, 0.18, 'sine', 0.25, 0.0);
    _beep(240, 0.22, 'sine', 0.20, 0.20);
  }

  function soundCelebration() {
    const notes = [523, 587, 659, 698, 784, 880, 988, 1047];
    notes.forEach((f, i) => _beep(f, 0.15, 'sine', 0.25, i * 0.1));
  }

  function soundTick() {
    _beep(1200, 0.04, 'square', 0.08, 0);
  }

  /* ── Confetti ─────────────────────────────────────────────── */

  function launchConfetti(container) {
    const colors = ['#ff6b6b','#feca57','#48dbfb','#ff9ff3','#54a0ff','#5f27cd','#00d2d3'];
    for (let i = 0; i < 60; i++) {
      const el = document.createElement('div');
      el.className = 'confetti-piece';
      el.style.cssText = `
        left:${Math.random() * 100}%;
        background:${colors[Math.floor(Math.random() * colors.length)]};
        width:${6 + Math.random() * 8}px;
        height:${6 + Math.random() * 8}px;
        border-radius:${Math.random() > 0.5 ? '50%' : '2px'};
        animation-delay:${Math.random() * 0.4}s;
        animation-duration:${0.8 + Math.random() * 0.8}s;
      `;
      container.appendChild(el);
      el.addEventListener('animationend', () => el.remove());
    }
  }

  /* ── Exports ──────────────────────────────────────────────── */
  return {
    hourAngle, minuteAngle, secondAngle,
    timeToAngles, anglesToTime,
    snapToInterval,
    generateRandomTime,
    formatTime, timeToWords,
    saveToStorage, loadFromStorage,
    speak,
    soundCorrect, soundWrong, soundCelebration, soundTick,
    launchConfetti
  };
})();
