/**
 * rewards.js — Points, levels, streaks, badges, confetti.
 * Depends on: app state (window.AppState)
 */

const Rewards = (() => {
  // Points awarded per correct answer (multiplied by streak bonus)
  const BASE_POINTS = 10;

  // Points required to reach each level (cumulative)
  const LEVEL_THRESHOLDS = [
    0,      // L1
    100,    // L2
    250,    // L3
    500,    // L4
    900,    // L5
    1400,   // L6
    2000,   // L7
    2800,   // L8
    3800,   // L9
    5000,   // L10
    6500,   // L11
    8500,   // L12
    11000,  // L13
    14000,  // L14
    18000,  // L15 (max shown)
  ];

  const BADGES = [
    { id: 'first_answer',  icon: '⭐', name: 'First Answer!',   condition: s => s.totalAnswered >= 1 },
    { id: 'streak_3',      icon: '🔥', name: '3 in a Row!',     condition: s => s.maxStreak >= 3 },
    { id: 'streak_5',      icon: '🌟', name: '5 in a Row!',     condition: s => s.maxStreak >= 5 },
    { id: 'streak_10',     icon: '💫', name: '10 in a Row!',    condition: s => s.maxStreak >= 10 },
    { id: 'points_100',    icon: '🏅', name: '100 Points!',     condition: s => s.points >= 100 },
    { id: 'points_500',    icon: '🥈', name: '500 Points!',     condition: s => s.points >= 500 },
    { id: 'points_1000',   icon: '🥇', name: '1,000 Points!',   condition: s => s.points >= 1000 },
    { id: 'level_3',       icon: '🚀', name: 'Level 3!',        condition: s => s.level >= 3 },
    { id: 'level_5',       icon: '🎉', name: 'Level 5!',        condition: s => s.level >= 5 },
    { id: 'level_10',      icon: '👑', name: 'Level 10!',       condition: s => s.level >= 10 },
    { id: 'correct_10',    icon: '🎯', name: '10 Correct!',     condition: s => s.correctAnswered >= 10 },
    { id: 'correct_50',    icon: '🏆', name: '50 Correct!',     condition: s => s.correctAnswered >= 50 },
    { id: 'correct_100',   icon: '💎', name: '100 Correct!',    condition: s => s.correctAnswered >= 100 },
    { id: 'all_modes', icon: '🌈', name: 'All Modes!', condition: s => {
      const stats = s.modeStats || {};
      const modeKeys = ['numberRead','counting','addition','subtraction','placeValue','blocks3d'];
      return modeKeys.every(k => stats[k] > 0);
    }},
  ];

  /** Return current level (1-indexed) based on total points. */
  function levelForPoints(points) {
    let lvl = 1;
    for (let i = 1; i < LEVEL_THRESHOLDS.length; i++) {
      if (points >= LEVEL_THRESHOLDS[i]) lvl = i + 1;
      else break;
    }
    return lvl;
  }

  /** Points needed for next level. Returns null if at max. */
  function pointsForNextLevel(currentLevel) {
    return LEVEL_THRESHOLDS[currentLevel] ?? null; // index = level (1-based → index = level)
  }

  /** Points at start of current level. */
  function pointsForCurrentLevel(currentLevel) {
    return LEVEL_THRESHOLDS[currentLevel - 1] ?? 0;
  }

  /** Streak multiplier: 1× for 1-2, 1.5× for 3-4, 2× for 5-9, 3× for 10+. */
  function streakMultiplier(streak) {
    if (streak >= 10) return 3;
    if (streak >= 5)  return 2;
    if (streak >= 3)  return 1.5;
    return 1;
  }

  /**
   * Award points for a correct answer.
   * Returns { pointsEarned, levelUp, newBadges }.
   */
  function awardCorrect(state) {
    state.streak = (state.streak || 0) + 1;
    if (state.streak > (state.maxStreak || 0)) state.maxStreak = state.streak;
    state.totalAnswered = (state.totalAnswered || 0) + 1;
    state.correctAnswered = (state.correctAnswered || 0) + 1;

    const mult = streakMultiplier(state.streak);
    const earned = Math.round(BASE_POINTS * mult);
    const prevPoints = state.points || 0;
    state.points = prevPoints + earned;

    const prevLevel = state.level || 1;
    state.level = levelForPoints(state.points);
    const levelUp = state.level > prevLevel;

    const newBadges = checkBadges(state);

    return { pointsEarned: earned, levelUp, newBadges };
  }

  /** Record a wrong answer (reset streak, increment total). */
  function recordWrong(state) {
    state.streak = 0;
    state.totalAnswered = (state.totalAnswered || 0) + 1;
  }

  /** Check which badges are newly earned. Mutates state.badges. */
  function checkBadges(state) {
    if (!state.badges) state.badges = [];
    const newBadges = [];
    for (const badge of BADGES) {
      if (!state.badges.includes(badge.id) && badge.condition(state)) {
        state.badges.push(badge.id);
        newBadges.push(badge);
      }
    }
    return newBadges;
  }

  /** Get badge objects for earned badge ids. */
  function getEarnedBadges(state) {
    return BADGES.filter(b => (state.badges || []).includes(b.id));
  }

  /** All badge definitions (for display in rewards screen). */
  function getAllBadges() { return BADGES; }

  /**
   * Launch lightweight confetti effect into a container element.
   * Creates colored circles that float up and fade out.
   */
  function confetti(container, count = 30) {
    if (!container) return;
    const colors = ['#FF6B6B','#FFD93D','#6BCB77','#4D96FF','#FF922B','#CC5DE8','#F06595'];
    for (let i = 0; i < count; i++) {
      const el = document.createElement('div');
      el.className = 'confetti-piece';
      el.style.cssText = [
        `left:${Math.random() * 100}%`,
        `background:${colors[Math.floor(Math.random() * colors.length)]}`,
        `width:${6 + Math.random() * 8}px`,
        `height:${6 + Math.random() * 8}px`,
        `border-radius:${Math.random() > 0.5 ? '50%' : '2px'}`,
        `animation-duration:${0.8 + Math.random() * 0.8}s`,
        `animation-delay:${Math.random() * 0.4}s`,
      ].join(';');
      container.appendChild(el);
      el.addEventListener('animationend', () => el.remove());
    }
  }

  return {
    levelForPoints,
    pointsForNextLevel,
    pointsForCurrentLevel,
    streakMultiplier,
    awardCorrect,
    recordWrong,
    checkBadges,
    getEarnedBadges,
    getAllBadges,
    confetti,
    LEVEL_THRESHOLDS,
    BASE_POINTS,
  };
})();

if (typeof module !== 'undefined') module.exports = Rewards;
