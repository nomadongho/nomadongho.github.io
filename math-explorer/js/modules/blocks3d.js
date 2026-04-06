/**
 * blocks3d.js — Genuine CSS 3D cube renderer. No frameworks. Pure HTML/CSS/JS.
 *
 * DOM hierarchy (per renderer instance):
 *   container
 *     └─ .b3d-stage   — perspective:900px; no overflow:hidden (avoids Safari flatten bug)
 *         └─ .b3d-scene  — rotateX/rotateY applied here; transform-style:preserve-3d
 *             └─ .b3d-model — zero-size anchor; transform-style:preserve-3d
 *                 └─ .b3d-cube × N  — translate3d(x,y,z); transform-style:preserve-3d
 *                     └─ .b3d-face × 6  — rotateX/Y + translateZ(S/2) per face
 *
 * Coordinate system (integer grid positions):
 *   x = column  (left → right)
 *   y = row     (front → back; increases depth into scene)
 *   z = height  (bottom → top)
 *
 * CSS 3D mapping for each cube:
 *   CSS translate X =  (gx - cx) * S - S/2
 *   CSS translate Y = -(gz - cz) * S - S/2   (CSS Y axis is down; z is height)
 *   CSS translate Z = -(gy - cy) * S          (CSS Z toward viewer; y grows away)
 *
 * Face placement (applied to each S×S face div):
 *   front:  translateZ(S/2)
 *   back:   rotateY(180deg) translateZ(S/2)
 *   right:  rotateY(90deg)  translateZ(S/2)
 *   left:   rotateY(-90deg) translateZ(S/2)
 *   top:    rotateX(90deg)  translateZ(S/2)
 *   bottom: rotateX(-90deg) translateZ(S/2)
 */

const Blocks3D = (() => {

  /* ── Visual constants ───────────────────────────────────────────── */
  const BASE_SIZE = 52;   // px per cube side (auto-scaled down for large structures)
  const MIN_SIZE  = 26;   // minimum px per cube side (floor for tiny structures)

  const COLORS = {
    top:    '#FFD93D',   // bright yellow  — top    (lightest)
    front:  '#FF6B6B',   // coral red      — front  (medium)
    right:  '#FF922B',   // orange         — right  (medium-dark)
    left:   '#D06818',   // dark orange    — left
    back:   '#CC4040',   // dark coral     — back
    bottom: '#CC9922',   // dark yellow    — bottom (darkest)
    // Highlighted variants shown during layer reveal
    topHL:    '#FFF4CC',
    frontHL:  '#FFB3B3',
    rightHL:  '#FFD4A8',
  };

  /* ── Face definitions ───────────────────────────────────────────── */
  // Each entry: [transform string, color key]
  // Transforms follow the rule: rotate face into position, then push out S/2
  function faceTransforms(S) {
    return [
      { t: `translateZ(${S / 2}px)`,                  ck: 'front'  },
      { t: `rotateY(180deg) translateZ(${S / 2}px)`,  ck: 'back'   },
      { t: `rotateY(90deg)  translateZ(${S / 2}px)`,  ck: 'right'  },
      { t: `rotateY(-90deg) translateZ(${S / 2}px)`,  ck: 'left'   },
      { t: `rotateX(90deg)  translateZ(${S / 2}px)`,  ck: 'top'    },
      { t: `rotateX(-90deg) translateZ(${S / 2}px)`,  ck: 'bottom' },
    ];
  }

  /* ── Renderer factory ───────────────────────────────────────────── */
  function createRenderer(container) {
    let blocks = [];
    let rotX = -25;     // negative = looking down from above (top faces visible)
    let rotY = -35;     // swivel left so right + front faces are both visible
    let isDragging   = false;
    let dragStart    = { x: 0, y: 0, rotX: 0, rotY: 0 };
    let autoRafId    = null;
    let autoLastTs   = null;
    let highlightedLayer = null;   // z-value of the currently highlighted layer (or null)

    /* ── Build DOM structure ──────────────────────────────────────── */

    // stage: fills the container; provides perspective.
    // IMPORTANT: perspective must NOT be on the same element as overflow:hidden —
    // that combination flattens 3D in Safari/WebKit.
    const stage = document.createElement('div');
    stage.className = 'b3d-stage';
    stage.setAttribute('aria-hidden', 'true');

    // scene: receives the drag rotation transform; preserve-3d so children stay 3D
    const scene = document.createElement('div');
    scene.className = 'b3d-scene';

    // model: zero-size anchor; cubes are positioned absolutely around its origin
    const model = document.createElement('div');
    model.className = 'b3d-model';

    scene.appendChild(model);
    stage.appendChild(scene);
    container.innerHTML = '';
    container.appendChild(stage);

    /* ── Render all cubes ─────────────────────────────────────────── */
    function render() {
      model.innerHTML = '';
      if (!blocks.length) return;

      const xs = blocks.map(b => b.x);
      const ys = blocks.map(b => b.y);
      const zs = blocks.map(b => b.z);
      const minX = Math.min(...xs), maxX = Math.max(...xs);
      const minY = Math.min(...ys), maxY = Math.max(...ys);
      const minZ = Math.min(...zs), maxZ = Math.max(...zs);

      // Auto-scale: largest axis span determines cube size so structure fits stage
      const span = Math.max(maxX - minX + 1, maxY - minY + 1, maxZ - minZ + 1);
      const S = Math.max(MIN_SIZE, Math.min(BASE_SIZE, Math.floor(190 / Math.max(span, 1))));

      // Center the structure on the model origin
      const cx = (minX + maxX) / 2;
      const cy = (minY + maxY) / 2;
      const cz = (minZ + maxZ) / 2;

      blocks.forEach(b => {
        const hl = highlightedLayer !== null && b.z === highlightedLayer;
        model.appendChild(buildCube(b.x, b.y, b.z, cx, cy, cz, S, hl));
      });

      applyRotation();
    }

    /* ── Build one CSS 3D cube ────────────────────────────────────── */
    function buildCube(gx, gy, gz, cx, cy, cz, S, isHL) {
      // Pixel position of this cube's wrapper origin in 3D space.
      // Subtract S/2 so the wrapper's center aligns with the grid point.
      const tx = (gx - cx) * S - S / 2;
      const ty = -(gz - cz) * S - S / 2;   // invert z: higher z → higher on screen
      const tz = -(gy - cy) * S;            // invert y: larger y → further from viewer

      const cube = document.createElement('div');
      cube.style.cssText = [
        'position:absolute',
        `width:${S}px`,
        `height:${S}px`,
        'transform-style:preserve-3d',
        '-webkit-transform-style:preserve-3d',
        `transform:translate3d(${tx}px,${ty}px,${tz}px)`,
      ].join(';');

      // Choose colors (highlighted layer uses lighter variants)
      const colorMap = {
        front:  isHL ? COLORS.frontHL : COLORS.front,
        back:   COLORS.back,
        right:  isHL ? COLORS.rightHL : COLORS.right,
        left:   COLORS.left,
        top:    isHL ? COLORS.topHL   : COLORS.top,
        bottom: COLORS.bottom,
      };

      faceTransforms(S).forEach(({ t, ck }) => {
        const face = document.createElement('div');
        face.style.cssText = [
          'position:absolute',
          `width:${S}px`,
          `height:${S}px`,
          `background:${colorMap[ck]}`,
          'border:1.5px solid rgba(0,0,0,0.18)',
          'box-sizing:border-box',
          'backface-visibility:hidden',
          '-webkit-backface-visibility:hidden',
          `transform:${t}`,
        ].join(';');
        cube.appendChild(face);
      });

      return cube;
    }

    /* ── Apply rotation to scene element ─────────────────────────── */
    function applyRotation() {
      scene.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
    }

    /* ── Pointer / touch drag ─────────────────────────────────────── */
    function getPoint(e) {
      return (e.touches && e.touches[0])
        ? { x: e.touches[0].clientX, y: e.touches[0].clientY }
        : { x: e.clientX, y: e.clientY };
    }

    function onPointerDown(e) {
      isDragging = true;
      stopAutoSpin();
      const pt = getPoint(e);
      dragStart = { x: pt.x, y: pt.y, rotX, rotY };
      if (e.cancelable) e.preventDefault();
    }

    function onPointerMove(e) {
      if (!isDragging) return;
      const pt = getPoint(e);
      rotY = dragStart.rotY + (pt.x - dragStart.x) * 0.5;
      // Clamp rotX so the model always shows top faces — never flip below horizontal
      rotX = Math.max(-75, Math.min(-10, dragStart.rotX - (pt.y - dragStart.y) * 0.4));
      applyRotation();
      if (e.cancelable) e.preventDefault();
    }

    function onPointerUp() { isDragging = false; }

    // Attach drag listeners to stage (not window) for pointer-down, window for move/up
    stage.addEventListener('mousedown',  onPointerDown);
    stage.addEventListener('touchstart', onPointerDown, { passive: false });
    window.addEventListener('mousemove',  onPointerMove);
    window.addEventListener('touchmove',  onPointerMove, { passive: false });
    window.addEventListener('mouseup',   onPointerUp);
    window.addEventListener('touchend',  onPointerUp);

    /* ── Auto-spin (rotateY) using requestAnimationFrame ─────────── */
    function startAutoSpin() {
      stopAutoSpin();
      autoLastTs = null;
      function frame(ts) {
        if (autoLastTs !== null) rotY += (ts - autoLastTs) * 0.04;
        autoLastTs = ts;
        applyRotation();
        autoRafId = requestAnimationFrame(frame);
      }
      autoRafId = requestAnimationFrame(frame);
    }

    function stopAutoSpin() {
      if (autoRafId !== null) { cancelAnimationFrame(autoRafId); autoRafId = null; }
      autoLastTs = null;
    }

    /* ── Reset to default viewing angle ──────────────────────────── */
    function resetView() {
      rotX = -25;
      rotY = -35;
      applyRotation();
    }

    /* ── Layer highlight: illuminate one height layer at a time ───── */
    function highlightLayers(callback) {
      const maxZ = blocks.length ? Math.max(...blocks.map(b => b.z)) : 0;
      let z = 0;
      function step() {
        highlightedLayer = z;
        render();
        if (z <= maxZ) {
          z++;
          setTimeout(step, 600);
        } else {
          highlightedLayer = null;
          render();
          if (callback) callback();
        }
      }
      step();
    }

    /* ── Public interface ─────────────────────────────────────────── */
    function setBlocks(newBlocks) {
      blocks = newBlocks;
      highlightedLayer = null;
      render();
    }

    function destroy() {
      stopAutoSpin();
      stage.removeEventListener('mousedown',  onPointerDown);
      stage.removeEventListener('touchstart', onPointerDown);
      window.removeEventListener('mousemove',  onPointerMove);
      window.removeEventListener('touchmove',  onPointerMove);
      window.removeEventListener('mouseup',   onPointerUp);
      window.removeEventListener('touchend',  onPointerUp);
      container.innerHTML = '';
    }

    return { setBlocks, render, resetView, startAutoSpin, stopAutoSpin, highlightLayers, destroy };
  }

  /* ── Developer test shapes (accessible via browser console) ──────
   * Usage: Blocks3D.runTest(renderer, 'cube2x2x2')
   * Shapes: 'single', 'stack2', 'base2x2', 'stair4', 'cube2x2x2'
   * ────────────────────────────────────────────────────────────── */
  const TEST_SHAPES = {
    single:   [{ x:0, y:0, z:0 }],
    stack2:   [{ x:0, y:0, z:0 }, { x:0, y:0, z:1 }],
    base2x2:  [
      { x:0, y:0, z:0 }, { x:1, y:0, z:0 },
      { x:0, y:1, z:0 }, { x:1, y:1, z:0 },
    ],
    stair4:   [
      { x:0, y:0, z:0 },
      { x:1, y:0, z:0 }, { x:1, y:0, z:1 },
      { x:2, y:0, z:0 }, { x:2, y:0, z:1 }, { x:2, y:0, z:2 },
    ],
    cube2x2x2: [
      { x:0, y:0, z:0 }, { x:1, y:0, z:0 },
      { x:0, y:1, z:0 }, { x:1, y:1, z:0 },
      { x:0, y:0, z:1 }, { x:1, y:0, z:1 },
      { x:0, y:1, z:1 }, { x:1, y:1, z:1 },
    ],
  };

  function runTest(renderer, shapeName) {
    const shape = TEST_SHAPES[shapeName];
    if (!shape) {
      console.warn('Unknown test shape. Available:', Object.keys(TEST_SHAPES).join(', '));
      return;
    }
    renderer.setBlocks(shape);
    console.log(`Test shape "${shapeName}" rendered (${shape.length} cubes).`);
  }

  return { createRenderer, TEST_SHAPES, runTest };
})();

if (typeof module !== 'undefined') module.exports = Blocks3D;
