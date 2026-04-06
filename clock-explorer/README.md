# 🕐 Clock Explorer

An interactive clock-reading web app for young learners, built with plain HTML, CSS, and JavaScript — no frameworks, no build step.

---

## How to Run

1. Open `index.html` in any modern web browser.
2. No server required — everything runs locally.

---

## File Structure

```
clock-explorer/
├── index.html          ← App shell (all views and layout)
├── style.css           ← All styles (mobile-first, responsive)
├── js/
│   ├── app.js          ← Main controller (modes, questions, progress)
│   ├── clock.js        ← SVG analog clock component (draggable hands)
│   ├── utils.js        ← Time math, formatting, speech, sounds, confetti
│   └── ad-config.js    ← Ad slot configuration (see global README)
└── README.md
```

---

## Learning Modes

| Mode | Description |
|------|-------------|
| Read the Clock | Look at the analog clock; choose the correct time |
| Set the Clock | Drag the hands to match a given time |
| Match Game | Match analog clocks with digital times |
| Free Play | Explore the clock freely with live ticking |

---

## Progression & Features

- **Difficulty 1–5**: from o'clock only up to any minute
- **Draggable SVG clock**: minute-snap and hour-hand coupling
- **Milestone rewards** and streak tracking
- **Category progress** saved in `localStorage`
- Web Speech API for time read-aloud
- Web Audio API for sound effects and confetti celebrations
