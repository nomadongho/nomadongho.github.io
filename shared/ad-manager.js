/* ═══════════════════════════════════════════════════════════════════════════
 * shared/ad-manager.js — Unified delayed-ad system
 *
 * Reads ad settings from the global AD_CONFIG object defined in each
 * explorer's own js/ad-config.js.
 *
 * Public API:
 *   AdManager.init([options])  — call when entering a module / activity screen
 *   AdManager.destroy()        — call when leaving a module / activity screen
 *
 * options (all optional):
 *   {Set}    allowedScreens  — only show ad when screenId is in this set
 *   {string} screenId        — current screen identifier (used with allowedScreens)
 *   {string} containerId     — existing DOM element ID to use as banner container;
 *                              when omitted, a new <div id="module-ad-wrap"> is created
 * ═══════════════════════════════════════════════════════════════════════════ */

/* global AD_CONFIG */
/* exported AdManager */

const AdManager = (() => { // eslint-disable-line no-unused-vars

  // ── Private state ─────────────────────────────────────────────────────────
  let _container     = null;   // banner wrapper DOM node
  let _intervalId    = null;   // setInterval handle for the countdown
  let _elapsed       = 0;      // accumulated visible milliseconds
  let _paused        = false;  // true while the browser tab is hidden
  let _adShown       = false;  // true once the ad has been rendered
  let _adsenseLoaded = false;  // true after the AdSense <script> has been added
  let _ownContainer  = false;  // true when this manager created the container

  // ── Helpers ───────────────────────────────────────────────────────────────

  /** Escape a string for safe use as an HTML attribute value. */
  function _escAttr(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  /** Inject the AdSense <script> tag once. Fails silently if unavailable. */
  function _loadAdsenseScript() {
    if (_adsenseLoaded) return;
    _adsenseLoaded = true;
    if (!document.getElementById('adsense-script')) {
      try {
        const s = document.createElement('script');
        s.id          = 'adsense-script';
        s.async       = true;
        s.src         = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js'
                      + '?client=' + _escAttr(AD_CONFIG.ADSENSE_CLIENT_ID);
        s.crossOrigin = 'anonymous';
        s.onerror     = () => {
          console.info('[AdManager] AdSense script unavailable — placeholder shown.');
        };
        document.head.appendChild(s);
      } catch (e) {
        console.info('[AdManager] Could not load AdSense script:', e);
      }
    }
  }

  /** Build and append a new banner wrapper to <body>. */
  function _createContainer() {
    const wrap = document.createElement('div');
    wrap.id = 'module-ad-wrap';
    wrap.setAttribute('role', 'complementary');
    wrap.setAttribute('aria-label', 'Advertisement');
    wrap.setAttribute('aria-hidden', 'true');
    document.body.appendChild(wrap);
    return wrap;
  }

  /** Populate the banner after the delay has elapsed. */
  function _showAd() {
    if (_adShown || !_container) return;
    _adShown = true;

    // Stop the interval now that the ad is ready
    if (_intervalId !== null) {
      clearInterval(_intervalId);
      _intervalId = null;
    }

    if (AD_CONFIG.ADS_ENABLED) {
      _loadAdsenseScript();

      // Build a real <ins> AdSense tag
      const ins = document.createElement('ins');
      ins.className = 'adsbygoogle';
      ins.style.display = 'block';
      ins.dataset.adClient = _escAttr(AD_CONFIG.ADSENSE_CLIENT_ID);
      ins.dataset.adSlot   = _escAttr(AD_CONFIG.AD_SLOT_ID);
      ins.dataset.adFormat = _escAttr(AD_CONFIG.AD_FORMAT);
      ins.dataset.fullWidthResponsive = 'true';
      if (AD_CONFIG.AD_LAYOUT_KEY) {
        ins.dataset.adLayoutKey = _escAttr(AD_CONFIG.AD_LAYOUT_KEY);
      }
      if (AD_CONFIG.AD_TEST_MODE) {
        ins.dataset.adtest = 'on';
      }

      _container.innerHTML = '';
      _container.appendChild(ins);

      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.info('[AdManager] adsbygoogle push failed:', e);
      }
    } else {
      // Placeholder shown when ADS_ENABLED is false
      _container.innerHTML =
        '<div class="ad-placeholder" aria-hidden="true">'
        + '<span class="ad-placeholder-label">Ad space</span>'
        + '</div>';
    }

    // Reveal the banner
    _container.classList.add('ad-visible');
    _container.setAttribute('aria-hidden', 'false');

    // Add body class so each explorer can hook CSS padding adjustments
    document.body.classList.add('ad-visible');
  }

  /** Pause or resume the countdown when the tab visibility changes. */
  function _handleVisibility() {
    _paused = document.hidden;
  }

  // ── Public API ────────────────────────────────────────────────────────────

  /**
   * Start the delayed-ad system.
   * Call when the learner enters a module or activity screen.
   *
   * @param {Object} [options]
   * @param {Set}    [options.allowedScreens]  Only show ad if screenId is in this set.
   * @param {string} [options.screenId]        Current screen identifier.
   * @param {string} [options.containerId]     Existing element ID to use as banner container.
   */
  function init(options) {
    destroy(); // clean up any running ad from a previous session

    if (!AD_CONFIG.ADS_ENABLED) return;

    // Optional screen filter (e.g. English Explorer's MODULE_SCREENS)
    if (options && options.allowedScreens && options.screenId) {
      if (!options.allowedScreens.has(options.screenId)) return;
    }

    // Use existing container or create a new one dynamically
    if (options && options.containerId) {
      _container    = document.getElementById(options.containerId);
      _ownContainer = false;
    } else {
      _container    = _createContainer();
      _ownContainer = true;
    }

    if (!_container) return;

    _elapsed = 0;
    _paused  = document.hidden;
    _adShown = false;

    const delay = AD_CONFIG.DELAY_MS || 0;

    if (delay <= 0) {
      _showAd();
      return;
    }

    document.addEventListener('visibilitychange', _handleVisibility);

    // Tick every second; only count visible time
    _intervalId = setInterval(() => {
      if (_paused || _adShown) return;
      _elapsed += 1000;
      if (_elapsed >= delay) {
        _showAd(); // _showAd() clears the interval itself
      }
    }, 1000);
  }

  /**
   * Stop the timer, remove the ad banner, and clean up event listeners.
   * Call when the learner leaves a module or activity screen.
   */
  function destroy() {
    if (_intervalId !== null) {
      clearInterval(_intervalId);
      _intervalId = null;
    }

    document.removeEventListener('visibilitychange', _handleVisibility);

    if (_container) {
      _container.classList.remove('ad-visible');
      if (_ownContainer && _container.parentNode) {
        _container.parentNode.removeChild(_container);
      }
    }

    _container    = null;
    _elapsed      = 0;
    _paused       = false;
    _adShown      = false;
    _ownContainer = false;

    // Remove layout helper class
    document.body.classList.remove('ad-visible');
  }

  return { init, destroy };

})();
