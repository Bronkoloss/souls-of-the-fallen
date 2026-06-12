"use strict";

const AfterlifeEmotes = (() => {
  const C = AfterlifeConfig;
  const S = AfterlifeState;
  const rand = (a, b) => a + Math.random() * (b - a);
  const dist = (ax, ay, bx, by) => Math.hypot(ax - bx, ay - by);
  const pickFrom = (arr) => arr[(Math.random() * arr.length) | 0];

// ---------- Emotes ----------
  function emote(x, y, char, opts = {}) {
    S.emotes.push({
      x: x + rand(-6, 6), y,
      t: 0, life: opts.life || 1.4,
      char, size: opts.size || 19,
      vy: opts.vy || -26,
    });
  }
  return { emote };
})();
