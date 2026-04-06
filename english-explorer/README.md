# english-explorer

A static, client-side English learning app for young learners, hosted on GitHub Pages.

---

## Google Ads Integration

The app includes a **delayed ad banner** that appears on learning/play screens only. It never shows on the home screen or Parent Zone.

### How it works

- A 60-second countdown starts when a learner enters a module screen (Letters, Trace, Phonics, Words, Game, Adventure).
- The timer pauses if the browser tab is hidden and resumes when the tab becomes visible again.
- Switching to a different module resets the timer.
- After 60 seconds a subtle banner slides in above the bottom navigation bar.
- While `ADS_ENABLED` is `false`, a quiet grey placeholder is shown instead of a real ad.

### Where to find the config

All ad settings live in one place:

```
js/ad-config.js
```

### How to enable real Google Ads

1. Open `js/ad-config.js`.
2. Set `ADS_ENABLED` to `true`.
3. Replace `ADSENSE_CLIENT_ID` with your publisher ID (format: `ca-pub-XXXXXXXXXXXXXXXX`).
4. Replace `AD_SLOT_ID` with your ad slot number from Google AdSense.
5. Set `AD_TEST_MODE` to `false` for production.
6. (Optional) Adjust `AD_DELAY_MS` if you want a different delay.

```js
const AD_CONFIG = {
  ADS_ENABLED:       true,
  ADSENSE_CLIENT_ID: 'ca-pub-YOUR_REAL_ID_HERE',
  AD_SLOT_ID:        'YOUR_REAL_SLOT_ID',
  AD_FORMAT:         'auto',
  AD_LAYOUT_KEY:     '',
  AD_TEST_MODE:      false,
  AD_DELAY_MS:       60000,
};
```

### Screens that intentionally do not show ads

| Screen | Reason |
|--------|--------|
| **Home** (`#screen-home`) | Landing / navigation hub — keeps the start experience clean |
| **Parent Zone** (`#screen-parents`) | Admin/progress screen — no need for ad exposure |

All other screens (Letters, Trace, Phonics, Words, Game, Daily Adventure) show the delayed banner.
