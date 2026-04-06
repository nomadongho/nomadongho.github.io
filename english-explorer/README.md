# 📖 English Explorer

A static, client-side English learning app for young learners, hosted on GitHub Pages. Built with plain HTML, CSS, and JavaScript — no frameworks, no build step.

---

## How to Run

1. Open `index.html` in any modern web browser.
2. No server required — everything runs locally.

---

## File Structure

```
english-explorer/
├── index.html          ← App shell (all views and layout)
├── style.css           ← All styles (mobile-first, responsive)
├── js/
│   ├── app.js          ← Full app logic (IIFE-encapsulated)
│   └── ad-config.js    ← Ad slot configuration (see global README)
└── README.md
```

---

## Activity Screens

| Screen | Activity |
|--------|----------|
| Learn Letters | See upper/lower case, hear letter names and sounds |
| Trace Letters | Draw on canvas, guide overlay, inactivity prompts |
| Phonics | Hear letter sounds; blend CVC words step-by-step |
| Read Words | CVC words → word families → sight words |
| Listening Game | Find the Letter / Find the Sound / Match the Word |
| Daily Adventure | Curated 9-step sequence refreshed each day |

---

## Features

- **Badge system**: Sound Scout, Letter Explorer, Word Walker, Reading Rocket
- **Bedtime calm mode** and slow-speech mode
- **Voice selection** via Web Speech API
- **Parent Zone** with full progress stats and settings
- Progress saved in `localStorage`
