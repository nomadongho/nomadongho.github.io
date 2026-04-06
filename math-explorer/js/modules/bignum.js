/**
 * bignum.js — String-based big integer utilities.
 * Supports integers up to 100+ digits.
 * All inputs/outputs are decimal strings (no leading zeros, except "0" itself).
 */

const BigNum = (() => {
  /** Remove leading zeros from a digit string. */
  function normalize(s) {
    s = String(s).replace(/^0+/, '');
    return s === '' ? '0' : s;
  }

  /** Compare two non-negative integer strings. Returns -1, 0, or 1. */
  function compare(a, b) {
    a = normalize(a);
    b = normalize(b);
    if (a.length !== b.length) return a.length < b.length ? -1 : 1;
    return a < b ? -1 : a > b ? 1 : 0;
  }

  /** Add two non-negative integer strings. */
  function add(a, b) {
    a = normalize(a);
    b = normalize(b);
    let i = a.length - 1;
    let j = b.length - 1;
    let carry = 0;
    let result = '';
    while (i >= 0 || j >= 0 || carry) {
      const da = i >= 0 ? a.charCodeAt(i--) - 48 : 0;
      const db = j >= 0 ? b.charCodeAt(j--) - 48 : 0;
      const sum = da + db + carry;
      carry = Math.floor(sum / 10);
      result = String(sum % 10) + result;
    }
    return result || '0';
  }

  /**
   * Subtract b from a (a >= b required). Returns the non-negative result as string.
   */
  function subtract(a, b) {
    a = normalize(a);
    b = normalize(b);
    if (compare(a, b) < 0) throw new Error('subtract: a < b');
    let i = a.length - 1;
    let j = b.length - 1;
    let borrow = 0;
    let result = '';
    while (i >= 0) {
      let da = a.charCodeAt(i--) - 48 - borrow;
      const db = j >= 0 ? b.charCodeAt(j--) - 48 : 0;
      da -= db;
      if (da < 0) { da += 10; borrow = 1; } else { borrow = 0; }
      result = String(da) + result;
    }
    return normalize(result);
  }

  /**
   * Multiply a big integer string by a small JS integer (< 2^53).
   */
  function multiplySmall(a, n) {
    a = normalize(a);
    let carry = 0;
    let result = '';
    for (let i = a.length - 1; i >= 0 || carry; i--) {
      const d = i >= 0 ? a.charCodeAt(i) - 48 : 0;
      const prod = d * n + carry;
      carry = Math.floor(prod / 10);
      result = String(prod % 10) + result;
    }
    return normalize(result) || '0';
  }

  /**
   * Format a big integer string into groups of 3 digits from the right,
   * separated by commas. E.g. "1234567" → "1,234,567".
   */
  function formatCommas(s) {
    s = normalize(s);
    let result = '';
    let count = 0;
    for (let i = s.length - 1; i >= 0; i--) {
      if (count > 0 && count % 3 === 0) result = ',' + result;
      result = s[i] + result;
      count++;
    }
    return result;
  }

  /**
   * Split a big integer string into an array of digit-groups
   * [ones, tens, hundreds, thousands, ...] (least-significant first).
   * E.g. "12345" → ['5', '4', '3', '2', '1'] (single digits)
   *
   * For place-value display we return groups of 1 digit each,
   * with the index representing the power of 10.
   */
  function toDigitArray(s) {
    s = normalize(s);
    return s.split('').reverse(); // index 0 = ones digit
  }

  /**
   * Korean number names for integers 0–9999.
   * Handles up to 4-digit numbers natively; larger numbers are decomposed.
   */
  const ONES = ['', '일', '이', '삼', '사', '오', '육', '칠', '팔', '구'];
  const TENS_KR = ['', '십', '이십', '삼십', '사십', '오십', '육십', '칠십', '팔십', '구십'];
  const HUNDREDS_KR = ['', '백', '이백', '삼백', '사백', '오백', '육백', '칠백', '팔백', '구백'];
  const THOUSANDS_KR = ['', '천', '이천', '삼천', '사천', '오천', '육천', '칠천', '팔천', '구천'];
  const UNIT_KR = ['', '만', '억', '조', '경', '해']; // 10^4 groups

  /** Convert an integer 1–9999 to Korean. */
  function _segment(n) {
    if (n === 0) return '';
    let s = '';
    const th = Math.floor(n / 1000);
    const hu = Math.floor((n % 1000) / 100);
    const te = Math.floor((n % 100) / 10);
    const on = n % 10;
    if (th) s += THOUSANDS_KR[th];
    if (hu) s += HUNDREDS_KR[hu];
    if (te) s += TENS_KR[te];
    if (on) s += ONES[on];
    return s;
  }

  /**
   * Convert a big integer string to Korean spoken form.
   * Handles numbers representable within the Korean unit system (경, etc.).
   * For very large numbers (> 해's range) it falls back to digit-by-digit reading.
   */
  function toKorean(s) {
    s = normalize(s);
    if (s === '0') return '영';

    // Split into groups of 4 digits from the right
    const groups = [];
    let tmp = s;
    while (tmp.length > 0) {
      groups.unshift(tmp.slice(-4));
      tmp = tmp.slice(0, -4);
    }

    if (groups.length > UNIT_KR.length) {
      // Fallback: just read digits
      return s.split('').map(d => ONES[Number(d)] || '영').join(' ');
    }

    let result = '';
    for (let i = 0; i < groups.length; i++) {
      const val = parseInt(groups[i], 10);
      const unitIdx = groups.length - 1 - i;
      if (val === 0) continue;
      result += _segment(val) + UNIT_KR[unitIdx];
    }
    return result || '영';
  }

  /**
   * Generate a random big-integer string with `digits` digits.
   */
  function randomBigNum(digits) {
    if (digits <= 0) return '0';
    let s = String(Math.floor(Math.random() * 9) + 1); // first digit 1–9
    for (let i = 1; i < digits; i++) {
      s += String(Math.floor(Math.random() * 10));
    }
    return s;
  }

  /* ─────────────────────────────────────────────────────────────────
   * English number words — supports 0–999,999 (for the number-reading
   * game mode at all current levels).  Very large numbers fall back to
   * a digit-by-digit reading.
   * ─────────────────────────────────────────────────────────────────*/
  const ONES_EN = [
    '', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine',
    'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen',
    'sixteen', 'seventeen', 'eighteen', 'nineteen',
  ];
  const TENS_EN = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

  /** Convert 1–999 to English words. */
  function _segEn(n) {
    if (n <= 0) return '';
    if (n < 20) return ONES_EN[n];
    const tens = Math.floor(n / 10);
    const ones = n % 10;
    if (n < 100) return TENS_EN[tens] + (ones ? '-' + ONES_EN[ones] : '');
    const h = Math.floor(n / 100);
    const rem = n % 100;
    return ONES_EN[h] + ' hundred' + (rem ? ' ' + _segEn(rem) : '');
  }

  /**
   * Convert a non-negative integer string to English spoken form.
   * Handles 0–999,999,999 natively; falls back to digit reading for larger.
   */
  function toEnglish(s) {
    s = normalize(s);
    if (s === '0') return 'zero';
    const n = parseInt(s, 10);
    if (isNaN(n) || s.length > 9) {
      // Digit-by-digit fallback for very large numbers
      return s.split('').map(d => ONES_EN[Number(d)] || 'zero').join(' ');
    }
    const millions  = Math.floor(n / 1_000_000);
    const thousands = Math.floor((n % 1_000_000) / 1_000);
    const rest      = n % 1_000;
    const parts = [];
    if (millions)  parts.push(_segEn(millions)  + ' million');
    if (thousands) parts.push(_segEn(thousands) + ' thousand');
    if (rest)      parts.push(_segEn(rest));
    return parts.join(' ');
  }

  return { normalize, compare, add, subtract, multiplySmall, formatCommas, toDigitArray, toKorean, toEnglish, randomBigNum };
})();

// Export for use in other modules (also available as global BigNum)
if (typeof module !== 'undefined') module.exports = BigNum;
