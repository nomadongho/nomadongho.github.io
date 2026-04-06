/* =====================================================
   AD CONFIG — js/ad-config.js
   English Explorer

   Ads are DISABLED by default.
   To enable ads, add the query parameter ?ads=1 to the URL,
   e.g. https://example.com/?ads=1

   To enable real Google Ads:
   1. Add ?ads=1 to the URL (or set ADS_ENABLED below to true)
   2. Replace ADSENSE_CLIENT_ID with your publisher ID
      (format: ca-pub-XXXXXXXXXXXXXXXX)
   3. Replace AD_SLOT_ID with your ad slot number
   4. Set AD_TEST_MODE to false for production
   ===================================================== */

'use strict';

// Resolve ad-enable flag once at startup from the URL query string.
// Add ?ads=1 to the page URL to activate ads (e.g. https://example.com/?ads=1).
var _adsEnabledByParam = (new URLSearchParams(window.location.search)).get('ads') === '1';

const AD_CONFIG = {

  // ── Enable / disable the entire ad system ──────────────────────────
  // Disabled by default. Activate by appending ?ads=1 to the page URL.
  // No Google scripts load and no ad container is shown when false.
  ADS_ENABLED: _adsEnabledByParam,

  // ── Publisher ID ───────────────────────────────────────────────────
  ADSENSE_CLIENT_ID: 'ca-pub-6962989029779783',

  // ── Ad slot ID ─────────────────────────────────────────────────────
  AD_SLOT_ID: '1668662318',

  // ── Ad format ──────────────────────────────────────────────────────
  // 'auto' lets Google choose the best size for the slot.
  AD_FORMAT: 'auto',

  // ── Layout key ─────────────────────────────────────────────────────
  // Required only for in-article format. Leave empty for banner/auto.
  AD_LAYOUT_KEY: '',

  // ── Test mode ──────────────────────────────────────────────────────
  // Set to true to display Google test ads during development.
  // Must be false for real ad revenue in production.
  AD_TEST_MODE: false,

  // Delay (in ms) before showing the ad after entering a module.
  // 0 = show immediately upon entering a module screen.
  DELAY_MS: 0,
};
