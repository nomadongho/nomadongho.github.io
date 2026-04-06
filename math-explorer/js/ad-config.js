/* ═══════════════════════════════════════════════════════════════════════════
 * Ad Configuration
 *
 * Ads are DISABLED by default.
 * To enable real Google AdSense ads, add ?ads=1 to the page URL
 * (e.g. https://example.com/index.html?ads=1).
 *
 * Other settings:
 *   1. Replace ADSENSE_CLIENT_ID with your publisher ID  (ca-pub-XXXXXXXXXXXXXXXX).
 *   2. Replace AD_SLOT_ID with your real ad slot number.
 *   3. Set AD_TEST_MODE to false for live traffic.
 *
 * These are the ONLY values you need to change. Everything else is automatic.
 * ═══════════════════════════════════════════════════════════════════════════ */

/* global AD_CONFIG */
const AD_CONFIG = Object.freeze({
  /** Ads are enabled when the URL contains ?ads=1 */
  ADS_ENABLED: new URLSearchParams(window.location.search).get('ads') === '1',

  /** Your AdSense publisher ID — replace with e.g. "ca-pub-1234567890123456" */
  ADSENSE_CLIENT_ID: 'ca-pub-6962989029779783',

  /** Your ad slot ID — replace with the numeric ID from AdSense */
  AD_SLOT_ID: '1672426542',

  /** Ad format passed to data-ad-format. Typical values: 'auto', 'rectangle', 'banner' */
  AD_FORMAT: 'auto',

  /** Layout key for in-feed/in-article ads (optional — leave empty string to omit) */
  AD_LAYOUT_KEY: '',

  /** Keep true during development so Google serves placeholder test ads instead of live ones */
  AD_TEST_MODE: false,

  /** How many milliseconds a learner must spend in a module before the ad appears (default 60 s) */
  DELAY_MS: 0,
});
