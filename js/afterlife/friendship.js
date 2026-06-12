"use strict";

const AfterlifeFriendship = (() => {
  const C = AfterlifeConfig;
  const S = AfterlifeState;
  const rand = (a, b) => a + Math.random() * (b - a);
  const dist = (ax, ay, bx, by) => Math.hypot(ax - bx, ay - by);
  const pickFrom = (arr) => arr[(Math.random() * arr.length) | 0];

// ---------- Freundschaft ----------
  function friendshipPts(seed) {
    return Save.data.friendship[seed] || 0;
  }

  function hearts(seed) {
    const pts = friendshipPts(seed);
    let h = 0;
    for (const t of C.HEART_THRESHOLDS) if (pts >= t) h++;
    return h;
  }

  function tier(seed) {
    const h = hearts(seed);
    return h >= 4 ? 2 : h >= 2 ? 1 : 0;
  }
  return { friendshipPts, hearts, tier };
})();
