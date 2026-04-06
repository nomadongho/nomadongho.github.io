# 🌿 Māori Explorer

> **A playful first step into Te Reo Māori for young children**

Māori Explorer is a free, framework-free static web app designed to help young children (ages 4–7) begin learning Te Reo Māori (the Māori language of New Zealand) through listening, tapping, and gentle games.

---

## ✨ Features

- **7 Learning Modules**: Greetings, Numbers, Colors, Whānau (Family), Animals, Body Parts, Feelings
- **4 Mini Games**: Listen & Tap, Match the Cards, Count the Objects, Find the Picture
- **Audio-first**: Every vocabulary card has a "Listen" button powered by the browser's SpeechSynthesis API (with easy hooks to add real recorded audio later)
- **Rewards system**: Stars and badges saved locally — no login required
- **Word of the Day**: A new word every day to keep things fresh
- **Mobile-first**: Works great on phones and tablets
- **Fully static**: Runs on GitHub Pages with no server or build step needed

---

## 🚀 How to Run Locally

1. Clone this repository:
   ```bash
   git clone https://github.com/nomadongho/maori-explorer.git
   cd maori-explorer
   ```

2. Open `index.html` in your browser — no build step or server required!

   If you prefer a local server (to avoid any CORS issues with audio files):
   ```bash
   # Python 3
   python -m http.server 8080

   # Node.js (npx)
   npx serve .
   ```
   Then open `http://localhost:8080`.

---

## 🌐 Deploy to GitHub Pages

1. Push this repository to GitHub.
2. Go to **Settings → Pages**.
3. Under **Source**, select **Branch: main** (or your default branch) and **/ (root)**.
4. Click **Save**.
5. Your site will be live at `https://<username>.github.io/<repo-name>/`.

---

## 🔊 How to Add Real Recorded Audio

All vocabulary items currently use the browser's built-in SpeechSynthesis API as a fallback.

To add real recorded audio:

1. Place your `.mp3` or `.ogg` audio files in `assets/audio/` (see `assets/audio/README.md` for naming conventions).
2. In `data.js`, update the `audio` field for each vocabulary item:

   ```js
   {
     id: "kia-ora",
     maori: "Kia ora",
     // ...
     audio: "assets/audio/kia-ora.mp3"   // ← change from null to the file path
   }
   ```

The audio system in `script.js` will automatically use the file when provided and fall back to speech synthesis when `audio` is `null`.

---

## 📝 Where to Edit Vocabulary Content

All vocabulary is defined in **`data.js`**.

Each vocabulary item has this structure:

```js
{
  id: "kia-ora",           // Unique identifier (used as audio filename key too)
  maori: "Kia ora",        // The Māori word or phrase
  pronunciation: "kee-ah OH-rah", // Simple child-friendly pronunciation guide
  english: "Hello / Thank you",   // Short English meaning
  category: "greetings",   // Module category key
  emoji: "👋",             // Visual emoji placeholder
  audio: null              // Path to audio file, or null for speech synthesis
}
```

To add a new vocabulary item, simply add a new object to the relevant array in `data.js` (e.g., `VOCAB.greetings`, `VOCAB.numbers`, etc.).

---

## 📢 Google Ad Slot Integration (Future)

Banner ad placeholders are included on module and game pages. They are **hidden by default** and appear 60 seconds after the user enters a page.

To integrate real Google AdSense ads:

1. In `index.html`, find the `<div class="ad-placeholder">` elements (one per module/game view).
2. Replace the placeholder content with your AdSense snippet:
   ```html
   <ins class="adsbygoogle"
        style="display:block"
        data-ad-client="ca-pub-XXXXXXXX"
        data-ad-slot="XXXXXXXXXX"
        data-ad-format="auto"
        data-full-width-responsive="true"></ins>
   <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
   ```
3. Add the AdSense `<script>` tag to the `<head>` of `index.html`.
4. The 60-second delay logic is in `script.js` → `startAdTimer()` function.

---

## 📁 File Structure

```
maori-explorer/
├── index.html          # Main HTML shell (all views, header, footer)
├── style.css           # All styles (mobile-first, child-friendly)
├── script.js           # App logic: routing, audio, games, rewards
├── data.js             # All vocabulary content and module config
├── assets/
│   ├── audio/
│   │   └── README.md   # Instructions for adding recorded audio files
│   └── images/
│       └── README.md   # Instructions for adding illustrations
└── README.md           # This file
```

---

## 🎨 Design Philosophy

- **Child-first**: Large tap targets, big text, lots of whitespace
- **Audio-first**: Every word has a listen button; games are hearing-based
- **No stress**: No timers, no harsh failure states, always encouraging
- **Culturally respectful**: Te Reo Māori presented warmly and accurately
- **Accessible**: Keyboard support, focus states, ARIA labels, reduced-motion support

---

## 📬 Feedback

Found a bug or have a suggestion? Use the feedback links at the bottom of the app, or email [nomadongho@gmail.com](mailto:nomadongho@gmail.com).

---

## ⚖️ Licence

This project is open source. Vocabulary content is sourced from publicly available beginner Te Reo Māori resources.