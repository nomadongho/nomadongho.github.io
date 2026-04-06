/* ═══════════════════════════════════════════════════════════════
   js/ad-config.js — Google AdSense configuration
   ═══════════════════════════════════════════════════════════════
   HOW TO ENABLE REAL ADS:
     1. Append  ?ads=1  to the page URL  (e.g. index.html?ads=1)
        — or set ADS_ENABLED below to true for a permanent deploy.
     2. Set  ADSENSE_CLIENT_ID → your real publisher ID
     3. Set  AD_SLOT_ID        → your real ad slot ID
     4. Optionally set AD_TEST_MODE → true while testing
   ═══════════════════════════════════════════════════════════════ */

/* global Object */
const AD_CONFIG = Object.freeze({

  /* ── Master toggle ────────────────────────────────────────── */
  // Disabled by default. Activate via URL query-param (?ads=1)
  // or override to true for a production deploy that always shows ads.
  ADS_ENABLED: new URLSearchParams(window.location.search).get('ads') === '1',

  /* ── Publisher credentials ───────────────────────────────── */
  // TODO: replace with your real AdSense publisher ID
  ADSENSE_CLIENT_ID: 'ca-pub-6962989029779783',

  // TODO: replace with your real ad slot ID
  AD_SLOT_ID: '6733181538',

  /* ── Ad display options ──────────────────────────────────── */
  AD_FORMAT: 'auto',           // 'auto' = responsive banner
  AD_LAYOUT_KEY: '',           // only needed for in-article/in-feed formats

  /* ── Test mode (requires real client ID to work) ─────────── */
  AD_TEST_MODE: false,

  /* ── Timing ──────────────────────────────────────────────── */
  DELAY_MS: 0,                // milliseconds of visible time before the ad appears

});
