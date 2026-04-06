/**
 * problems.js — Problem generators for all 6 learning modes.
 * Depends on: BigNum (global)
 */

const Problems = (() => {

  /* ── Utilities ─────────────────────────────────────────────────── */

  function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = randInt(0, i);
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  /** Pick n unique items from arr. */
  function pickUnique(arr, n) {
    return shuffle(arr).slice(0, n);
  }

  /** Generate n wrong number choices different from correct. */
  function wrongNumbers(correct, n, min, max) {
    const choices = new Set([correct]);
    let tries = 0;
    while (choices.size < n + 1 && tries++ < 200) {
      choices.add(randInt(min, max));
    }
    choices.delete(correct);
    return Array.from(choices).slice(0, n);
  }

  /* ── Object emojis for counting/addition/subtraction ───────────── */
  const EASY_EMOJIS = ['🍎','🌟','🐶','🐱','🌸','⭐','🍊','🦋','🍭','🎈'];
  const MED_EMOJIS  = ['🚀','🎵','🏀','🍕','🦄','🐸','🌈','🍓','🎨','🦁'];

  function emojiSet(level) {
    return level <= 3 ? EASY_EMOJIS : MED_EMOJIS;
  }

  /* ══════════════════════════════════════════════════════════════════
   * MODE 1: Number Reading
   * ══════════════════════════════════════════════════════════════════ */

  /** Number range by level. */
  function numberReadRange(level) {
    if (level <= 2)  return [1, 10];
    if (level <= 4)  return [1, 20];
    if (level <= 6)  return [1, 50];
    if (level <= 8)  return [1, 100];
    if (level <= 10) return [1, 1000];
    return [1, 9999];
  }

  /**
   * Generate a number-reading problem.
   * type 'numToWords': show number, pick English word reading.
   * type 'wordsToNum': show English words, pick number.
   */
  function numberReadProblem(level) {
    const [min, max] = numberReadRange(level);
    const correct = randInt(min, max);
    const wrongNums = wrongNumbers(correct, 2, min, max);
    const allNums = shuffle([correct, ...wrongNums]);

    const type = Math.random() < 0.5 ? 'numToWords' : 'wordsToNum';

    if (type === 'numToWords') {
      return {
        type: 'numToWords',
        display: String(correct),
        answer: BigNum.toEnglish(String(correct)),
        choices: allNums.map(n => BigNum.toEnglish(String(n))),
        correctChoice: BigNum.toEnglish(String(correct)),
        number: correct,
      };
    } else {
      return {
        type: 'wordsToNum',
        display: BigNum.toEnglish(String(correct)),
        answer: String(correct),
        choices: allNums.map(n => String(n)),
        correctChoice: String(correct),
        number: correct,
      };
    }
  }

  /* ══════════════════════════════════════════════════════════════════
   * MODE 2: Counting
   * ══════════════════════════════════════════════════════════════════ */

  function countingRange(level) {
    if (level <= 2)  return [1, 5];
    if (level <= 4)  return [1, 10];
    if (level <= 6)  return [1, 20];
    if (level <= 8)  return [1, 30];
    return [1, 50];
  }

  function countingProblem(level) {
    const [min, max] = countingRange(level);
    const correct = randInt(min, max);
    const emojis = emojiSet(level);
    const emoji = emojis[randInt(0, emojis.length - 1)];
    const wrongNums = wrongNumbers(correct, 2, Math.max(1, min), max + 3);
    const choices = shuffle([correct, ...wrongNums]);

    return {
      type: 'counting',
      emoji,
      count: correct,
      choices,
      correctChoice: correct,
    };
  }

  /* ══════════════════════════════════════════════════════════════════
   * MODE 3: Addition
   * ══════════════════════════════════════════════════════════════════ */

  function additionRange(level) {
    // Returns [maxA, maxB, maxSum]
    if (level <= 2)  return [2, 2, 4];      // within 5, tiny
    if (level <= 3)  return [4, 4, 5];      // within 5
    if (level <= 5)  return [5, 5, 10];     // within 10
    if (level <= 7)  return [9, 9, 18];     // within 20 (no carry emphasis)
    if (level <= 9)  return [19, 19, 38];   // within 40
    if (level <= 11) return [49, 49, 99];   // within 100
    return [99, 99, 198];
  }

  function additionProblem(level) {
    const [maxA, maxB, maxSum] = additionRange(level);
    let a, b;
    do {
      a = randInt(1, maxA);
      b = randInt(1, maxB);
    } while (a + b > maxSum);

    const correct = a + b;
    const showBlocks = level <= 5;
    const wrongNums = wrongNumbers(correct, 2, Math.max(0, correct - 5), correct + 5);
    const choices = shuffle([correct, ...wrongNums]);

    return {
      type: 'addition',
      a, b,
      correct,
      choices,
      correctChoice: correct,
      showBlocks,
      emoji: EASY_EMOJIS[randInt(0, EASY_EMOJIS.length - 1)],
    };
  }

  /* ══════════════════════════════════════════════════════════════════
   * MODE 4: Subtraction
   * ══════════════════════════════════════════════════════════════════ */

  function subtractionRange(level) {
    if (level <= 2)  return [4, 4];
    if (level <= 3)  return [5, 5];
    if (level <= 5)  return [10, 10];
    if (level <= 7)  return [20, 20];
    if (level <= 9)  return [50, 50];
    if (level <= 11) return [99, 99];
    return [199, 199];
  }

  function subtractionProblem(level) {
    const [maxA] = subtractionRange(level);
    const a = randInt(1, maxA);
    const b = randInt(0, a);
    const correct = a - b;
    const wrongNums = wrongNumbers(correct, 2, 0, maxA);
    const choices = shuffle([correct, ...wrongNums]);
    const showBlocks = level <= 5;

    return {
      type: 'subtraction',
      a, b,
      correct,
      choices,
      correctChoice: correct,
      showBlocks,
      emoji: EASY_EMOJIS[randInt(0, EASY_EMOJIS.length - 1)],
    };
  }

  /* ══════════════════════════════════════════════════════════════════
   * MODE 5: Place Value
   * ══════════════════════════════════════════════════════════════════ */

  function placeValueRange(level) {
    if (level <= 2)  return [1, 9];
    if (level <= 4)  return [10, 99];
    if (level <= 6)  return [100, 999];
    if (level <= 8)  return [1000, 9999];
    return [10000, 99999];
  }

  /** Build place-value breakdown: { ones, tens, hundreds, thousands, ... } */
  function placeValueBreakdown(n) {
    const digits = BigNum.toDigitArray(String(n)); // [ones, tens, ...]
    const names = ['ones', 'tens', 'hundreds', 'thousands', 'ten-thousands'];
    const result = [];
    for (let i = 0; i < digits.length; i++) {
      result.push({ place: names[i] || `10^${i}`, digit: Number(digits[i]), power: i });
    }
    return result;
  }

  /**
   * Problem: given a number, identify how many of a specific place-value unit there are.
   * E.g. 345 → how many tens? Answer: 4.
   */
  function placeValueProblem(level) {
    const [min, max] = placeValueRange(level);
    const n = randInt(min, max);
    const breakdown = placeValueBreakdown(n);
    // Pick a random place
    const place = breakdown[randInt(0, breakdown.length - 1)];
    const correct = place.digit;
    const wrongNums = wrongNumbers(correct, 2, 0, 9);
    const choices = shuffle([correct, ...wrongNums]);

    return {
      type: 'placeValue',
      number: n,
      displayNumber: BigNum.formatCommas(String(n)),
      breakdown,
      targetPlace: place,
      correct,
      choices,
      correctChoice: correct,
    };
  }

  /* ══════════════════════════════════════════════════════════════════
   * MODE 6: 3D Block Counting
   * ══════════════════════════════════════════════════════════════════ */

  function blockCountRange(level) {
    if (level <= 2)  return [1, 5];
    if (level <= 4)  return [3, 10];
    if (level <= 6)  return [5, 15];
    if (level <= 8)  return [8, 20];
    if (level <= 10) return [12, 27];
    return [15, 36];
  }

  /**
   * Generate a 3D block structure.
   * Returns an array of {x, y, z} positions (integer grid).
   * Grid: x=col, y=row, z=layer (height).
   */
  function blockStructure(level) {
    const [minBlocks, maxBlocks] = blockCountRange(level);
    const count = randInt(minBlocks, maxBlocks);

    // Build a "stable" structure: place blocks on top of each other
    // using a 2D base grid, each cell stacked with 1–n blocks
    const gridSize = level <= 4 ? 2 : level <= 8 ? 3 : 4;
    const maxHeight = level <= 2 ? 2 : level <= 5 ? 3 : 4;

    // Fill a height map: key → current height (number of blocks placed so far)
    // Use a Map to guarantee consistent iteration order
    const heightMap = new Map();
    const cellList = [];  // ordered list of cells for stable random selection
    const blocks = [];
    let placed = 0;

    // Seed first block at (0,0)
    heightMap.set('0,0', 0);
    cellList.push([0, 0]);

    const queue = [[0, 0]];
    const neighbors = [[1,0],[-1,0],[0,1],[0,-1]];

    while (placed < count) {
      // Pick a random occupied cell from the stable list
      const [cx, cy] = cellList[randInt(0, cellList.length - 1)];
      const key = `${cx},${cy}`;
      const curH = heightMap.get(key) || 0;

      if (curH < maxHeight && placed < count) {
        blocks.push({ x: cx, y: cy, z: curH });
        heightMap.set(key, curH + 1);
        placed++;

        // Occasionally expand to a neighbor cell
        if (placed < count && Math.random() < 0.4) {
          const [dx, dy] = neighbors[randInt(0, 3)];
          const nx = cx + dx, ny = cy + dy;
          if (Math.abs(nx) < gridSize && Math.abs(ny) < gridSize) {
            const nk = `${nx},${ny}`;
            if (!heightMap.has(nk)) {
              heightMap.set(nk, 0);
              cellList.push([nx, ny]);
              queue.push([nx, ny]);
            }
          }
        }
      } else if (cellList.length < gridSize * gridSize && placed < count) {
        // Expand to a new neighboring cell
        const [dx, dy] = neighbors[randInt(0, 3)];
        const nx = cx + dx, ny = cy + dy;
        if (Math.abs(nx) < gridSize && Math.abs(ny) < gridSize) {
          const nk = `${nx},${ny}`;
          if (!heightMap.has(nk)) {
            heightMap.set(nk, 0);
            cellList.push([nx, ny]);
          }
        }
      } else {
        // Find an existing cell with remaining height capacity
        let found = false;
        for (const [kx, ky] of shuffle([...cellList])) {
          const kk = `${kx},${ky}`;
          const h = heightMap.get(kk) || 0;
          if (h < maxHeight) {
            blocks.push({ x: kx, y: ky, z: h });
            heightMap.set(kk, h + 1);
            placed++;
            found = true;
            break;
          }
        }
        if (!found) break; // All cells at max height; stop
      }
    }

    return { blocks, count: blocks.length };
  }

  function blockProblem(level) {
    const { blocks, count } = blockStructure(level);
    const wrongNums = wrongNumbers(count, 2, Math.max(1, count - 3), count + 4);
    const choices = shuffle([count, ...wrongNums]);

    return {
      type: 'blocks3d',
      blocks,
      correct: count,
      choices,
      correctChoice: count,
    };
  }

  /* ── Public API ─────────────────────────────────────────────────── */
  return {
    numberReadProblem,
    countingProblem,
    additionProblem,
    subtractionProblem,
    placeValueProblem,
    placeValueBreakdown,
    blockProblem,
    shuffle,
    randInt,
  };
})();

if (typeof module !== 'undefined') module.exports = Problems;
