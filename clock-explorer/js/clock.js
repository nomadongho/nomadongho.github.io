// clock.js — Analog SVG clock component

const ClockComponent = (() => {

  const CX = 100, CY = 100, R = 90;

  /* ── SVG helpers ──────────────────────────────────────────── */
  function svgEl(tag, attrs) {
    const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
    Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
    return el;
  }

  function polarToXY(angleDeg, radius) {
    const rad = (angleDeg - 90) * Math.PI / 180;
    return { x: CX + radius * Math.cos(rad), y: CY + radius * Math.sin(rad) };
  }

  /* ── Build the SVG clock ──────────────────────────────────── */

  /**
   * Creates and returns a clock object.
   * @param {HTMLElement} container  - element to append SVG into
   * @param {Object}      opts
   *   opts.showMinuteMarkers  {boolean}
   *   opts.draggable          {boolean}
   *   opts.onDrag             {function({h,m})}  called while dragging
   *   opts.strokeColor        {string}
   *   opts.hourColor          {string}
   *   opts.minuteColor        {string}
   */
  function create(container, opts = {}) {
    const {
      showMinuteMarkers = false,
      draggable         = false,
      onDrag            = null,
      strokeColor       = '#5f27cd',
      hourColor         = '#ff6b6b',
      minuteColor       = '#54a0ff',
    } = opts;

    // Remove any previous clock
    container.innerHTML = '';

    const svg = svgEl('svg', {
      viewBox: '0 0 200 200',
      class:   'clock-svg',
      role:    'img',
      'aria-label': 'Analog clock',
    });

    /* Background */
    svg.appendChild(svgEl('circle', {
      cx: CX, cy: CY, r: R,
      fill: '#ffffff', stroke: strokeColor, 'stroke-width': 4
    }));

    /* Minute markers (optional) */
    if (showMinuteMarkers) {
      for (let i = 0; i < 60; i++) {
        if (i % 5 === 0) continue; // hour ticks handled separately
        const a = i * 6;
        const p1 = polarToXY(a, 82);
        const p2 = polarToXY(a, 86);
        svg.appendChild(svgEl('line', {
          x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y,
          stroke: '#ccc', 'stroke-width': 1, 'stroke-linecap': 'round'
        }));
      }
    }

    /* Hour tick marks */
    for (let i = 0; i < 12; i++) {
      const a = i * 30;
      const p1 = polarToXY(a, 75);
      const p2 = polarToXY(a, 86);
      svg.appendChild(svgEl('line', {
        x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y,
        stroke: strokeColor, 'stroke-width': 2.5, 'stroke-linecap': 'round'
      }));
    }

    /* Numbers 1–12 */
    for (let n = 1; n <= 12; n++) {
      const a = n * 30;
      const p = polarToXY(a, 65);
      const t = svgEl('text', {
        x: p.x, y: p.y,
        'text-anchor': 'middle',
        'dominant-baseline': 'central',
        'font-size': '13',
        'font-family': 'Nunito, Baloo 2, sans-serif',
        'font-weight': '800',
        fill: '#333'
      });
      t.textContent = n;
      svg.appendChild(t);
    }

    /* Hour hand group */
    const hourGroup = svgEl('g', { class: 'hand-group hour-hand-group' });
    const hourLine  = svgEl('line', {
      x1: CX, y1: CY, x2: CX, y2: CY - 45,
      stroke: hourColor, 'stroke-width': 7,
      'stroke-linecap': 'round'
    });
    hourGroup.appendChild(hourLine);
    svg.appendChild(hourGroup);

    /* Minute hand group */
    const minGroup = svgEl('g', { class: 'hand-group minute-hand-group' });
    const minLine  = svgEl('line', {
      x1: CX, y1: CY, x2: CX, y2: CY - 63,
      stroke: minuteColor, 'stroke-width': 4.5,
      'stroke-linecap': 'round'
    });
    minGroup.appendChild(minLine);
    svg.appendChild(minGroup);

    /* Center pivot */
    svg.appendChild(svgEl('circle', {
      cx: CX, cy: CY, r: 6,
      fill: '#333'
    }));

    container.appendChild(svg);

    /* ── State ────────────────────────────────────────────────── */
    let _h = 12, _m = 0;
    let _hourAngle = 0, _minAngle = 0;
    let _dragging = false;
    let _dragTarget = null; // 'hour' | 'minute'
    let _lastAngle = 0;

    function _applyAngles(hA, mA, animate = true) {
      _hourAngle = hA;
      _minAngle  = mA;
      const transition = animate ? 'transform 0.25s cubic-bezier(0.4,0,0.2,1)' : 'none';
      hourGroup.style.cssText = `transform-origin:${CX}px ${CY}px;transform:rotate(${hA}deg);transition:${transition}`;
      minGroup.style.cssText  = `transform-origin:${CX}px ${CY}px;transform:rotate(${mA}deg);transition:${transition}`;
    }

    /* ── Public: setTime ──────────────────────────────────────── */
    function setTime(h, m, animate = true) {
      _h = h; _m = m;
      const angles = Utils.timeToAngles(h, m);
      _applyAngles(angles.hour, angles.minute, animate);
    }

    /* ── Drag logic ───────────────────────────────────────────── */
    function _angleFromEvent(e) {
      const rect = svg.getBoundingClientRect();
      const cx   = rect.left + rect.width / 2;
      const cy   = rect.top  + rect.height / 2;
      let clientX, clientY;
      if (e.touches) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }
      const dx = clientX - cx;
      const dy = clientY - cy;
      // angle from 12 o'clock, clockwise
      let a = Math.atan2(dx, -dy) * 180 / Math.PI;
      if (a < 0) a += 360;
      return a;
    }

    function _angleDiff(a, b) {
      let d = a - b;
      while (d >  180) d -= 360;
      while (d < -180) d += 360;
      return d;
    }

    function _onPointerDown(e) {
      if (!draggable) return;
      const angle = _angleFromEvent(e);
      // Determine closest hand
      const dHour = Math.abs(_angleDiff(angle, _hourAngle));
      const dMin  = Math.abs(_angleDiff(angle, _minAngle));
      _dragTarget = dHour < dMin ? 'hour' : 'minute';
      _dragging   = true;
      _lastAngle  = angle;
      e.preventDefault();
    }

    function _onPointerMove(e) {
      if (!_dragging) return;
      e.preventDefault();
      const angle = _angleFromEvent(e);

      if (_dragTarget === 'minute') {
        // Snap to 6° intervals (1 minute) and update hour hand proportionally
        const snapped = Utils.snapToInterval(angle, 6);
        const minuteDelta = _angleDiff(snapped, _minAngle);
        const newHAngle = (((_hourAngle + minuteDelta * (1 / 12)) % 360) + 360) % 360;
        _applyAngles(newHAngle, snapped, false);
        const t = Utils.anglesToTime(newHAngle, snapped);
        if (onDrag) onDrag(t);
      } else {
        // Dragging hour hand directly
        const snapped = Utils.snapToInterval(angle, 30);
        _applyAngles(snapped, _minAngle, false);
        const t = Utils.anglesToTime(snapped, _minAngle);
        if (onDrag) onDrag(t);
      }
      _lastAngle = angle;
    }

    function _onPointerUp(e) {
      _dragging = false;
    }

    if (draggable) {
      svg.addEventListener('mousedown',  _onPointerDown, { passive: false });
      svg.addEventListener('touchstart', _onPointerDown, { passive: false });
      window.addEventListener('mousemove',  _onPointerMove, { passive: false });
      window.addEventListener('touchmove',  _onPointerMove, { passive: false });
      window.addEventListener('mouseup',    _onPointerUp);
      window.addEventListener('touchend',   _onPointerUp);
      svg.style.cursor = 'grab';
    }

    /* ── Live (ticking) clock ─────────────────────────────────── */
    let _tickInterval = null;

    function startLive() {
      function tick() {
        const now = new Date();
        const h = now.getHours() % 12 || 12;
        const m = now.getMinutes();
        const s = now.getSeconds();
        const hA = Utils.hourAngle(h, m) + s * (0.5 / 60);
        const mA = Utils.minuteAngle(m)  + s * (6 / 60);
        _applyAngles(hA, mA, false);
      }
      tick();
      _tickInterval = setInterval(tick, 1000);
    }

    function stopLive() {
      if (_tickInterval) { clearInterval(_tickInterval); _tickInterval = null; }
    }

    function destroy() {
      stopLive();
      if (draggable) {
        window.removeEventListener('mousemove',  _onPointerMove);
        window.removeEventListener('touchmove',  _onPointerMove);
        window.removeEventListener('mouseup',    _onPointerUp);
        window.removeEventListener('touchend',   _onPointerUp);
      }
    }

    function getAngles() { return { hour: _hourAngle, minute: _minAngle }; }
    function getTime()   { return Utils.anglesToTime(_hourAngle, _minAngle); }

    return { setTime, startLive, stopLive, destroy, getAngles, getTime, svg };
  }

  return { create };
})();
