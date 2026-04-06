# 🇰🇷 Korean Explorer

An interactive Korean language learning app for young learners, built with plain HTML, CSS, and JavaScript — no frameworks, no build step.

---

## How to Run

1. Open `index.html` in any modern web browser.
2. No server required — everything runs locally.

---

## File Structure

```
korean-explorer/
├── index.html          ← App shell (all views and navigation)
├── style.css           ← All styles (mobile-first, responsive)
├── js/
│   ├── app.js          ← Main app logic (routing, games, UI)
│   ├── audio.js        ← Speech synthesis wrapper (Korean + English)
│   ├── progress.js     ← Points, levels, stars (localStorage)
│   ├── ads.js          ← Ad integration helper
│   └── ad-config.js    ← Ad slot configuration (see global README)
└── README.md
```

---

## Activity Pages

| Page | Content |
|------|---------|
| Hangul | Korean alphabet with pronunciation |
| Words | Vocabulary by category (animals, colors, food…) |
| Numbers | Korean numbers 1–20 |
| Phrases | Common everyday phrases |
| Games | Matching and listening mini-games |

---

## Features

- **Points and level progression** saved in `localStorage`
- **Korean and English TTS** via `AudioManager` (Web Speech API)
- Toast notifications, confetti, and shuffle utilities
- Mobile-first layout with large tap targets