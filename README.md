# explorer — Leo's Learning Apps

A polished, mobile-friendly hub for [Leo's Explorer](https://nomadongho.github.io/) — a collection of five interactive learning apps built with love for Leo Park.

---

## Live Site

**[https://nomadongho.github.io/](https://nomadongho.github.io/)**

---

## Apps

| App | URL | What it teaches |
|-----|-----|-----------------|
| 🔢 **Math Explorer** | [/math-explorer](https://nomadongho.github.io/math-explorer) | Numbers, counting, addition, subtraction, place value, 3D blocks |
| 📖 **English Explorer** | [/english-explorer](https://nomadongho.github.io/english-explorer) | Alphabet, phonics, word blending, sight words, tracing, daily adventures |
| 🕐 **Clock Explorer** | [/clock-explorer](https://nomadongho.github.io/clock-explorer) | Telling time, setting clock hands, time-matching game |
| 🌿 **Māori Explorer** | [/maori-explorer](https://nomadongho.github.io/maori-explorer) | Te Reo Māori vocabulary, greetings, numbers, phrases, mini-games |
| 🇰🇷 **Korean Explorer** | [/korean-explorer](https://nomadongho.github.io/korean-explorer) | Hangul basics, Korean words, numbers, phrases, mini-games |

---

## Repository Structure

```
explorer/
├── index.html              ← Landing page (app hub)
├── style.css               ← Landing page styles (mobile-first, responsive)
├── script.js               ← Landing page JS (year, mailto links, scroll animation)
│
├── shared/
│   └── ad-manager.js       ← Unified delayed-ad banner (used by all apps)
│
├── math-explorer/
│   ├── index.html
│   ├── app.js              ← Main controller (state, UI, problem flow, rewards)
│   ├── style.css
│   └── modules/
│       ├── problems.js     ← Problem generators for all 6 modes
│       ├── rewards.js      ← Points, levels, streaks, badges
│       ├── bignum.js       ← 100-digit big-integer utilities
│       └── blocks3d.js     ← Isometric CSS/JS 3D block renderer
│
├── english-explorer/
│   ├── index.html
│   ├── app.js              ← Full app logic (IIFE-encapsulated)
│   └── style.css
│
├── clock-explorer/
│   ├── index.html
│   ├── style.css
│   └── js/
│       ├── app.js          ← Main controller (modes, questions, progress)
│       ├── clock.js        ← SVG analog clock component (draggable)
│       └── utils.js        ← Time math, formatting, speech, sounds, confetti
│
├── maori-explorer/
│   ├── index.html
│   ├── script.js           ← Full app logic (routing, games, progress, audio)
│   ├── data.js             ← Vocabulary data, module configs, badges
│   ├── env.js              ← Ad-enable flag
│   └── style.css
│
└── korean-explorer/
    ├── index.html          ← Nav hub
    ├── script.js           ← Shared utilities (toast, confetti, shuffle)
    ├── audio.js            ← Speech synthesis wrapper (Korean + English)
    ├── progress.js         ← Points, levels, stars (localStorage)
    ├── ads.js              ← Ad integration helper
    ├── style.css
    ├── hangul.html         ← Hangul alphabet explorer
    ├── numbers.html        ← Korean numbers 1–20
    ├── words.html          ← Vocabulary cards (categories)
    ├── phrases.html        ← Common phrases
    └── games.html          ← Mini-games
```

---

## Tech Stack

- **Plain HTML, CSS, and JavaScript** — no frameworks, no build step
- Google Fonts (Nunito + Lora) loaded from CDN
- Web Speech API for read-aloud in all five apps
- Web Audio API for sound effects in Math Explorer and Clock Explorer
- CSS custom properties, `clamp()`, and `grid`/`flexbox` for responsive layout
- Intersection Observer API for scroll-triggered animations
- `localStorage` for progress persistence across sessions
- Responsive down to 320 px; respects `prefers-reduced-motion`

---

## Deployment (GitHub Pages)

This project requires **no build step**.

1. Push to the `main` branch of `nomadongho/explorer`.
2. Enable GitHub Pages: **Settings → Pages → Deploy from branch → main → / (root)**.
3. The landing page is served at `https://nomadongho.github.io/`.
4. Each sub-app is served from its own subdirectory (e.g. `https://nomadongho.github.io/math-explorer/`).

---

## App Highlights

### 🔢 Math Explorer

Six learning modes with automatic difficulty progression:

| Mode | Description |
|------|-------------|
| Number Reading | Match numbers ↔ spoken/written names |
| Counting | Count emoji objects, tap the answer |
| Addition | Visual and numeric addition |
| Subtraction | Visual and numeric subtraction |
| Place Value | Identify digit positions (ones, tens, hundreds…) |
| 3D Blocks | Count isometric block structures, drag to rotate |

- Points, streaks, and a badge system drive engagement
- Parent gate (2-second hold) protects settings
- Supports 100-digit big-integer arithmetic in advanced mode

### 📖 English Explorer

Six activity screens:

| Screen | Activity |
|--------|----------|
| Learn Letters | See upper/lower case, hear letter names and sounds |
| Trace Letters | Draw on canvas, guide overlay, inactivity prompts |
| Phonics | Hear letter sounds; blend CVC words step-by-step |
| Read Words | CVC words → word families → sight words |
| Listening Game | Find the Letter / Find the Sound / Match the Word |
| Daily Adventure | Curated 9-step sequence refreshed each day |

- Badge system (Sound Scout, Letter Explorer, Word Walker, Reading Rocket)
- Bedtime calm mode, slow-speech mode, voice selection
- Parent Zone with full progress stats and settings

### 🕐 Clock Explorer

Four modes:

| Mode | Activity |
|------|----------|
| Read the Clock | Look at the analog clock; choose the correct time |
| Set the Clock | Drag the hands to match a given time |
| Match Game | Match analog clocks with digital times |
| Free Play | Explore the clock freely with live ticking |

- Difficulty 1–5 (o'clock → any minute)
- Draggable SVG clock with minute-snap and hour-hand coupling
- Milestone rewards, streak tracking, category progress

### 🌿 Māori Explorer

Seven vocabulary modules (greetings, numbers, colors, family, animals, body parts, feelings) plus:

| Game | Description |
|------|-------------|
| Listen & Tap | Hear a word; tap the matching card |
| Match Cards | Memory-style card flip game |
| Counting | Interactive number learning |

- Streak system (day-over-day)
- Badge rewards
- Word-of-the-day feature
- Fallback to SpeechSynthesis when audio files are absent

### 🇰🇷 Korean Explorer

Five activity pages:

| Page | Content |
|------|---------|
| Hangul | Korean alphabet with pronunciation |
| Words | Vocabulary by category (animals, colors, food…) |
| Numbers | Korean numbers 1–20 |
| Phrases | Common everyday phrases |
| Games | Matching and listening mini-games |

- Points and level progression stored in `localStorage`
- Korean and English TTS via `AudioManager` IIFE
- Shared utility functions: toast notifications, confetti, shuffle

---

## Google Ads

All five apps include a **shared delayed-ad system** (`shared/ad-manager.js`):

- Each app has a `js/ad-config.js` with its own slot ID
- Ads appear **only on learning/module screens**, never on home or parent/settings screens
- The banner fades in after **60 seconds** of continuous visible time
- Tab-hidden time is excluded from the countdown
- Set `ADS_ENABLED: false` in `js/ad-config.js` to disable (a subtle placeholder shows instead)

---

*Made with love for Leo Park. 💛*
