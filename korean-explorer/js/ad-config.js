/* ═══════════════════════════════════════════════════════════════════════════
   js/ad-config.js — Google AdSense configuration for Korean Explorer

   HOW TO ENABLE REAL ADS:
     1. Set  window.ADS_ENABLED = true  in the HTML before loading this file.
     2. Replace ADSENSE_CLIENT_ID with your real publisher ID (ca-pub-XXXXXXXX).
     3. Replace AD_SLOT_ID with your real ad slot ID.
     4. Optionally set AD_TEST_MODE = true while testing.
   ═══════════════════════════════════════════════════════════════════════════ */

/* global AD_CONFIG */
const AD_CONFIG = Object.freeze({

  /* ── Master toggle ─────────────────────────────────────────── */
  // Set window.ADS_ENABLED = true in the page HTML before loading this script.
  ADS_ENABLED: window.ADS_ENABLED === true,

  /* ── Publisher credentials ──────────────────────────────────── */
  // TODO: replace with your real AdSense publisher ID
  ADSENSE_CLIENT_ID: 'ca-pub-6962989029779783',

  // TODO: replace with your real ad slot ID
  AD_SLOT_ID: '4470716363',

  /* ── Ad display options ─────────────────────────────────────── */
  AD_FORMAT: 'auto',
  AD_LAYOUT_KEY: '',

  /* ── Test mode ──────────────────────────────────────────────── */
  AD_TEST_MODE: false,

  /* ── Timing ─────────────────────────────────────────────────── */
  DELAY_MS: 60000,  // 60 seconds of visible time before the ad appears

});
