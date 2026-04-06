# 수학 탐험대 🚀

A kid-friendly arithmetic learning web app for 5-year-old children, built with plain HTML, CSS, and JavaScript — no frameworks, no build step.

---

## How to Run

1. Clone or download this repository.
2. Open `index.html` in any modern web browser (Chrome, Firefox, Safari, Edge).
3. No server required — everything runs locally.

```
Math-Explore/
├── index.html          ← Open this in your browser
├── style.css           ← All styles
├── app.js              ← Main app logic (state, UI, routing)
├── modules/
│   ├── bignum.js       ← 100-digit big integer utilities
│   ├── rewards.js      ← Points, levels, streaks, badges, confetti
│   ├── problems.js     ← Problem generators for all 6 modes
│   └── blocks3d.js     ← Isometric CSS/JS 3D block renderer
└── README.md
```

---

## Learning Modes

| Mode | Korean | Description |
|------|--------|-------------|
| 숫자 읽기 | Number Reading | Match numbers ↔ Korean spoken names |
| 숫자 세기 | Counting | Count emoji objects, tap the answer |
| 더하기 | Addition | Visual and numeric addition |
| 빼기 | Subtraction | Visual and numeric subtraction |
| 자릿수 배우기 | Place Value | Identify digit positions (ones, tens, hundreds…) |
| 3D 블록 세기 | 3D Block Counting | Count isometric block structures with drag-to-rotate |

---

## Progression Logic

Difficulty is tied to the player's **level**, which increases automatically as points accumulate.

### Points & Levels
- Each correct answer earns **10 base points**.
- A **streak multiplier** applies: ×1.5 for 3+ streak, ×2 for 5+, ×3 for 10+.
- Level thresholds (cumulative points): 0, 100, 250, 500, 900, 1400, 2000, 2800…
- Wrong answers reset the streak but never deduct points — the experience stays positive.

### Per-mode difficulty by level
- **Levels 1–2**: Very small numbers (1–5), tiny addition (≤4), single-digit place value, 1–5 cubes.
- **Levels 3–4**: Numbers to 20, addition within 10, tens place value, up to 10 cubes.
- **Levels 5–6**: Numbers to 50, addition within 20, hundreds, 5–15 cubes.
- **Levels 7–8**: Numbers to 100, two-digit arithmetic, 8–20 cubes.
- **Levels 9+**: Numbers to 1000+, larger arithmetic, complex 3D arrangements.

The child curriculum never exposes 100-digit arithmetic — that is reserved for the parent/advanced demo.

---

## 100-Digit Number Support

All large-number logic lives in **`modules/bignum.js`**. Numbers are represented as plain decimal strings to avoid JavaScript `Number` precision limits (which break at ~15 digits).

### Implemented utilities

| Function | Description |
|----------|-------------|
| `BigNum.add(a, b)` | Add two digit strings; returns result string |
| `BigNum.subtract(a, b)` | Subtract b from a (requires a ≥ b); returns result string |
| `BigNum.compare(a, b)` | Returns −1, 0, or 1 |
| `BigNum.multiplySmall(a, n)` | Multiply digit string by a small JS integer |
| `BigNum.formatCommas(s)` | Insert comma separators (e.g. `"1234567"` → `"1,234,567"`) |
| `BigNum.toDigitArray(s)` | Split into per-digit array, least-significant first |
| `BigNum.toKorean(s)` | Convert to Korean spoken form (supports up to 해 = 10^20; digit-by-digit fallback beyond) |
| `BigNum.randomBigNum(n)` | Generate a random n-digit number string |

### Demo
Enable **Advanced Mode** in the parent settings (⚙️ → hold 2 sec → toggle "고급 숫자 데모").
The demo generates two 50-digit numbers, adds them, displays the Korean reading, and groups each digit by power of 10.

---

## 3D Block Rotation — How It Works

The 3D block viewer in **`modules/blocks3d.js`** uses a pure CSS/JS isometric projection — no Three.js or canvas.

### Approach
1. **Isometric projection**: Each cube is a `<div>` positioned absolutely. Three child `<div>` elements represent the top face, left face, and right face, shaped with `clip-path` polygons to create the illusion of depth.

2. **Painter's algorithm**: Blocks are sorted by `x + y + z` before rendering so nearer blocks always paint over farther ones.

3. **Perspective container**: The scene wrapper has CSS `perspective` set, and a `rotateX` / `rotateY` transform applied for the orbital view angle.

4. **Drag-to-rotate**: `mousedown` / `touchstart` captures the start angle. `mousemove` / `touchmove` updates `rotY` (horizontal, unbounded) and `rotX` (vertical, clamped −60°…+60°) proportionally to pointer delta.

5. **Auto-spin**: A `setInterval` at ~60 fps increments `rotY` by 0.8° per tick.

6. **Layer highlight**: After a correct answer, each z-layer lights up in sequence so the child can count layer by layer.

### Controls
- **Drag / swipe** — rotate freely
- **🔄 원래대로** — reset to default angle
- **▶ 자동 회전** — toggle auto-spin

---

## Parent / Settings

Open with the ⚙️ button (top-right on home screen).  
**Gate**: press-and-hold the button for 2 seconds to unlock parent mode.

Settings available:
- Toggle sound (Web Speech API stub, wired and ready)
- Toggle animations
- Enable advanced 100-digit demo
- Adjust starting difficulty
- View child statistics (total answered, accuracy, favorite mode, max streak)
- Reset all progress

---

## Accessibility

- All interactive elements have `aria-label`
- `aria-live` regions for feedback messages
- High-contrast color palette
- Minimum touch target size ≥ 44 × 44 px
- Works on mobile (touch events handled)

---

## Google Ads Integration

The app includes a ready-to-activate delayed ad system.  
Ads appear only inside learning/play module screens — **never on the home or rewards screen**.

### Where to put your real values

Open **`js/ad-config.js`** and update the three key values:

```js
ADS_ENABLED:      false,                  // ← change to true to go live
ADSENSE_CLIENT_ID: 'ca-pub-XXXXXXXXXXXXXXXX', // ← your publisher ID
AD_SLOT_ID:       '1234567890',           // ← your ad slot number
```

Set `AD_TEST_MODE: false` when deploying to real traffic.

### How the delayed display works

1. A timer starts the moment the learner enters a module screen.
2. Time is counted only while the browser tab is visible (tab-hidden pauses the countdown).
3. After **60 seconds** of continuous visible time, the ad banner fades in at the bottom of the screen.
4. Switching modules resets the timer.
5. Returning to the home screen destroys the timer and removes the banner.

The delay can be changed via `DELAY_MS` in `js/ad-config.js` (value is in milliseconds).

### Screens that intentionally show NO ads

| Screen | Reason |
|--------|--------|
| Home / landing screen | Entry point, mode selection — not a learning activity |
| Rewards / level screen | Celebration/review view — not a learning activity |

### Screens that show a delayed ad

All six module/play screens show an ad after the 60-second delay:

| Screen |
|--------|
| 🔢 Number Reading |
| 🍎 Counting |
| ➕ Addition |
| ➖ Subtraction |
| 📦 Place Value |
| 🧊 3D Block Counting |

### Files involved

| File | Purpose |
|------|---------|
| `js/ad-config.js` | All configurable constants (edit this to go live) |
| `js/ad-manager.js` | Timer logic, visibility pausing, banner injection |
| `app.js` | Calls `AdManager.init()` on module entry and `AdManager.destroy()` on exit |

### Disabling ads entirely

Set `ADS_ENABLED: false` in `js/ad-config.js`.  
When disabled, a subtle grey placeholder box appears after the delay instead of a real ad.  
No Google scripts are loaded.