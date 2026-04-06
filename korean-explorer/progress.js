/* progress.js - Points, levels, stars system for Korean Explorer */

const ProgressManager = (() => {
  const STORAGE_KEY = 'korean_explorer_progress';

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : { points: 0, level: 1, stars: 0 };
    } catch {
      return { points: 0, level: 1, stars: 0 };
    }
  }

  function save(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  function getProgress() {
    return load();
  }

  function addPoints(pts) {
    const data = load();
    data.points += pts;
    const newLevel = Math.floor(data.points / 100) + 1;
    const leveledUp = newLevel > data.level;
    data.level = newLevel;
    save(data);
    updateUI();
    return { data, leveledUp };
  }

  function addStar() {
    const data = load();
    data.stars += 1;
    save(data);
    updateUI();
    return data;
  }

  function updateUI() {
    const data = load();
    const levelEl   = document.getElementById('level-display');
    const pointsEl  = document.getElementById('points-display');
    const starsEl   = document.getElementById('stars-display');
    const barEl     = document.getElementById('progress-bar-fill');

    if (levelEl)  levelEl.textContent  = `Level ${data.level}`;
    if (pointsEl) pointsEl.textContent = `⭐ ${data.points} pts`;
    if (starsEl)  starsEl.textContent  = '⭐'.repeat(Math.min(data.stars, 10));
    if (barEl) {
      const pct = (data.points % 100);
      barEl.style.width = pct + '%';
    }
  }

  // Initialize UI on load
  document.addEventListener('DOMContentLoaded', updateUI);

  return { getProgress, addPoints, addStar, updateUI };
})();
