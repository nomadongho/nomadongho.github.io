/* script.js - Shared utilities for Korean Explorer */

// ─── Toast Notification ────────────────────────
function showToast(message, type = 'info', duration = 2000) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.className = 'show ' + type;
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => {
    toast.className = '';
  }, duration);
}

// ─── Confetti Effect ───────────────────────────
function launchConfetti(count = 60) {
  const colors = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#A855F7', '#4ADE80', '#FB923C', '#60A5FA', '#F472B6'];
  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    el.classList.add('confetti-piece');
    el.style.left = Math.random() * 100 + 'vw';
    el.style.top  = '-20px';
    el.style.background = colors[Math.floor(Math.random() * colors.length)];
    el.style.animationDelay = Math.random() * 1.5 + 's';
    el.style.animationDuration = (1.5 + Math.random() * 2) + 's';
    el.style.transform = `rotate(${Math.random() * 360}deg)`;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 4000);
  }
}

// ─── Shuffle Array ─────────────────────────────
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ─── Pick random N items ───────────────────────
function pickRandom(arr, n) {
  return shuffle(arr).slice(0, n);
}

// ─── Add pop animation ─────────────────────────
function popElement(el) {
  el.classList.remove('pop-anim');
  void el.offsetWidth; // reflow
  el.classList.add('pop-anim');
  setTimeout(() => el.classList.remove('pop-anim'), 500);
}

function shakeElement(el) {
  el.classList.remove('shake-anim');
  void el.offsetWidth;
  el.classList.add('shake-anim');
  setTimeout(() => el.classList.remove('shake-anim'), 500);
}

// ─── Mark active nav link ──────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const links = document.querySelectorAll('nav a');
  const path  = window.location.pathname.split('/').pop() || 'index.html';
  links.forEach(link => {
    if (link.getAttribute('href') === path) {
      link.classList.add('active');
    }
  });
});
