/* ads.js - Delayed ad banner for Korean Explorer activity pages
 *
 * Requires: ../shared/ad-manager.js and js/ad-config.js to be loaded first.
 *
 * Ads are disabled by default. To enable, set window.ADS_ENABLED = true
 * in the page HTML before loading js/ad-config.js:
 *   <script>window.ADS_ENABLED = true;</script>
 */

(function () {
  // Only show ads on activity pages (not the index page)
  var path = window.location.pathname;
  var isActivityPage = !path.endsWith('index.html') &&
                       !path.endsWith('/') &&
                       path !== '';

  if (!isActivityPage) return;

  document.addEventListener('DOMContentLoaded', function () {
    AdManager.init({ containerId: 'ad-banner' });
  });
}());
