"use strict";

const AfterlifeWorld = (() => {
  const C = AfterlifeConfig;
  const S = AfterlifeState;
  const rand = (a, b) => a + Math.random() * (b - a);
  const dist = (ax, ay, bx, by) => Math.hypot(ax - bx, ay - by);
  const pickFrom = (arr) => arr[(Math.random() * arr.length) | 0];

// ---------- Begehbarkeit ----------
  function inLake(x, y, pad = 14) {
    const dx = (x - C.LAKE.x) / (C.LAKE.rx + pad);
    const dy = (y - C.LAKE.y) / (C.LAKE.ry + pad);
    return dx * dx + dy * dy < 1;
  }

  function isWalkable(x, y) {
    if (x < 30 || x > C.WORLD.w - 30 || y < 40 || y > C.WORLD.h - 30) return false;
    if (y > C.RIVER.y1 && y < C.RIVER.y2) {
      let onBridge = false;
      for (const [a, b] of C.BRIDGES) if (x > a && x < b) { onBridge = true; break; }
      if (!onBridge) return false;
    }
    if (inLake(x, y)) return false;
    for (const h of C.HOUSES) {
      if (x > h.x - 8 && x < h.x + h.w + 8 && y > h.y - 8 && y < h.y + h.h + 10) return false;
    }
    for (const t of S.trees) {
      const dx = x - t.x, dy = y - t.y;
      if (dx * dx + dy * dy < 15 * 15) return false;
    }
    const dw = dist(x, y, C.WELL.x, C.WELL.y);
    if (dw < 34) return false;
    return true;
  }

  function tryMove(ent, dx, dy) {
    if (dx !== 0 && isWalkable(ent.x + dx, ent.y)) ent.x += dx;
    if (dy !== 0 && isWalkable(ent.x, ent.y + dy)) ent.y += dy;
  }

  // ---------- Statische Welt einmalig erzeugen ----------
  function buildWorld() {
    const r = Characters.mulberry32(777123);
    const variants = ["#5fae5f", "#4f9e57", "#6fbb66", "#54a86b", "#69b573"];

    S.trees = [];
    let guard = 0;
    while (S.trees.length < 85 && guard++ < 3000) {
      const x = 60 + r() * (C.WORLD.w - 120);
      const y = 80 + r() * (C.WORLD.h - 140);
      if (y > C.RIVER.y1 - 50 && y < C.RIVER.y2 + 30) continue;
      if (inLake(x, y, 60)) continue;
      let bad = false;
      for (const h of C.HOUSES) {
        if (x > h.x - 60 && x < h.x + h.w + 60 && y > h.y - 60 && y < h.y + h.h + 80) { bad = true; break; }
      }
      if (!bad && dist(x, y, C.SPAWN.x, C.SPAWN.y) < 200) bad = true;
      if (!bad && dist(x, y, C.PORTAL.x, C.PORTAL.y) < 170) bad = true;
      if (!bad && dist(x, y, C.DANCE_FLOOR.x, C.DANCE_FLOOR.y) < 230) bad = true;
      if (!bad && dist(x, y, C.CAMPFIRE.x, C.CAMPFIRE.y) < 110) bad = true;
      if (!bad && dist(x, y, C.WELL.x, C.WELL.y) < 120) bad = true;
      if (!bad) {
        for (const t of S.trees) {
          if (dist(x, y, t.x, t.y) < 90) { bad = true; break; }
        }
      }
      if (!bad) {
        for (const path of C.PATHS) {
          for (const [px, py] of path) {
            if (dist(x, y, px, py) < 90) { bad = true; break; }
          }
          if (bad) break;
        }
      }
      if (bad) continue;
      S.trees.push({ x, y, s: 0.85 + r() * 0.5, color: variants[(r() * variants.length) | 0] });
    }

    S.stones = [];
    for (let i = 0; i < 26; i++) {
      const x = 60 + r() * (C.WORLD.w - 120);
      const y = 80 + r() * (C.WORLD.h - 140);
      if ((y > C.RIVER.y1 - 20 && y < C.RIVER.y2 + 20) || inLake(x, y, 30)) continue;
      S.stones.push({ x, y, rx: 5 + r() * 10, ry: 3 + r() * 6, shade: 0.5 + r() * 0.3 });
    }

    S.decoGrass = [];
    for (let i = 0; i < 520; i++) {
      const x = r() * C.WORLD.w, y = r() * C.WORLD.h;
      if ((y > C.RIVER.y1 && y < C.RIVER.y2) || inLake(x, y)) continue;
      S.decoGrass.push({ x, y, s: 3 + r() * 5, hue: 95 + r() * 35 });
    }

    S.decoFlowers = [];
    for (let i = 0; i < 230; i++) {
      const x = r() * C.WORLD.w, y = r() * C.WORLD.h;
      if ((y > C.RIVER.y1 - 10 && y < C.RIVER.y2 + 10) || inLake(x, y, 20)) continue;
      S.decoFlowers.push({ x, y, hue: [350, 45, 200, 280, 18][(r() * 5) | 0], s: 1.6 + r() * 1.6 });
    }

    // Sammelbare Blumen — gehäuft im Blumenfeld
    S.flowers = [];
    for (let i = 0; i < 46; i++) {
      let x, y;
      if (i < 24) {
        const zone = i % 2 === 0 ? { x: 700, y: 1600, r: 260 } : { x: 1200, y: 1850, r: 220 };
        const a = r() * Math.PI * 2, d = Math.sqrt(r()) * zone.r;
        x = zone.x + Math.cos(a) * d;
        y = zone.y + Math.sin(a) * d;
      } else {
        x = 80 + r() * (C.WORLD.w - 160);
        y = 100 + r() * (C.WORLD.h - 180);
      }
      if (!isWalkableRough(x, y)) continue;
      S.flowers.push({ x, y, taken: false, respawn: 0, hue: [330, 0, 45, 270, 200][(r() * 5) | 0] });
    }

    S.butterflies = [];
    for (let i = 0; i < 14; i++) {
      S.butterflies.push({
        x: r() * C.WORLD.w, y: r() * C.WORLD.h * 0.9,
        a: r() * Math.PI * 2, t: r() * 10,
        hue: [330, 45, 200, 270][(r() * 4) | 0],
      });
    }

    S.inited = true;

    function isWalkableRough(x, y) {
      if (x < 50 || x > C.WORLD.w - 50 || y < 60 || y > C.WORLD.h - 50) return false;
      if (y > C.RIVER.y1 - 10 && y < C.RIVER.y2 + 10) return false;
      if (inLake(x, y, 30)) return false;
      for (const h of C.HOUSES) {
        if (x > h.x - 20 && x < h.x + h.w + 20 && y > h.y - 20 && y < h.y + h.h + 20) return false;
      }
      return true;
    }
  }
  return { inLake, isWalkable, tryMove, buildWorld };
})();
