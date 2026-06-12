"use strict";

const AfterlifeRenderTerrain = (() => {
  const C = AfterlifeConfig;
  const S = AfterlifeState;
  const rand = (a, b) => a + Math.random() * (b - a);
  const dist = (ax, ay, bx, by) => Math.hypot(ax - bx, ay - by);
  const pickFrom = (arr) => arr[(Math.random() * arr.length) | 0];

  function inView(x, y, pad = 160) {
    return x > S.cam.x - pad && x < S.cam.x + W + pad && y > S.cam.y - pad && y < S.cam.y + H + pad;
  }

function drawGround() {
    const g = ctx.createLinearGradient(0, -S.cam.y, 0, C.WORLD.h - S.cam.y);
    g.addColorStop(0, "#8ec77c");
    g.addColorStop(0.5, "#7fbc72");
    g.addColorStop(1, "#74b56e");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    // Pfade
    ctx.strokeStyle = "rgba(233,219,170,0.85)";
    ctx.lineWidth = 30;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    for (const path of C.PATHS) {
      ctx.beginPath();
      ctx.moveTo(path[0][0] - S.cam.x, path[0][1] - S.cam.y);
      for (let i = 1; i < path.length; i++) ctx.lineTo(path[i][0] - S.cam.x, path[i][1] - S.cam.y);
      ctx.stroke();
    }

    // Gras-Deko
    ctx.lineWidth = 1.4;
    for (const dg of S.decoGrass) {
      if (!inView(dg.x, dg.y, 30)) continue;
      const x = dg.x - S.cam.x, y = dg.y - S.cam.y;
      ctx.strokeStyle = `hsla(${dg.hue}, 45%, 36%, 0.5)`;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x - dg.s * 0.5, y - dg.s);
      ctx.moveTo(x, y);
      ctx.lineTo(x + dg.s * 0.4, y - dg.s * 1.15);
      ctx.moveTo(x, y);
      ctx.lineTo(x, y - dg.s * 1.3);
      ctx.stroke();
    }

    // Deko-Blumen
    for (const f of S.decoFlowers) {
      if (!inView(f.x, f.y, 20)) continue;
      const x = f.x - S.cam.x, y = f.y - S.cam.y;
      ctx.fillStyle = `hsla(${f.hue}, 75%, 70%, 0.9)`;
      ctx.beginPath();
      ctx.arc(x, y, f.s, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "rgba(255,230,120,0.9)";
      ctx.beginPath();
      ctx.arc(x, y, f.s * 0.4, 0, Math.PI * 2);
      ctx.fill();
    }

    // Steine
    for (const s of S.stones) {
      if (!inView(s.x, s.y, 30)) continue;
      ctx.fillStyle = `rgba(150,155,150,${s.shade})`;
      ctx.beginPath();
      ctx.ellipse(s.x - S.cam.x, s.y - S.cam.y, s.rx, s.ry, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // Ankunftskreis am Spawn
    const sx = C.SPAWN.x - S.cam.x, sy = C.SPAWN.y - S.cam.y;
    if (inView(C.SPAWN.x, C.SPAWN.y, 200)) {
      ctx.strokeStyle = `rgba(255,255,255,${0.25 + Math.sin(S.time * 1.5) * 0.1})`;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.ellipse(sx, sy, 70, 28, 0, 0, Math.PI * 2);
      ctx.stroke();
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2 + S.time * 0.15;
        ctx.fillStyle = "rgba(220,228,235,0.8)";
        ctx.beginPath();
        ctx.ellipse(sx + Math.cos(a) * 70, sy + Math.sin(a) * 28, 6, 4, 0, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  function drawWater() {
    // Fluss
    const y1 = C.RIVER.y1 - S.cam.y, y2 = C.RIVER.y2 - S.cam.y;
    if (y2 > -40 && y1 < H + 40) {
      const g = ctx.createLinearGradient(0, y1, 0, y2);
      g.addColorStop(0, "#4f93c9");
      g.addColorStop(0.5, "#5aa5dd");
      g.addColorStop(1, "#4f93c9");
      ctx.fillStyle = g;
      ctx.fillRect(0, y1, W, y2 - y1);
      // Ufer
      ctx.fillStyle = "rgba(90,120,70,0.7)";
      ctx.fillRect(0, y1 - 4, W, 5);
      ctx.fillRect(0, y2 - 1, W, 5);
      // Wellen
      ctx.strokeStyle = "rgba(255,255,255,0.3)";
      ctx.lineWidth = 1.6;
      for (let row = 0; row < 3; row++) {
        const wy = y1 + (y2 - y1) * (0.25 + row * 0.25);
        ctx.beginPath();
        for (let x = -40; x <= W + 40; x += 14) {
          const yy = wy + Math.sin((x + S.cam.x) * 0.03 + S.time * 1.6 + row * 2) * 3;
          if (x === -40) ctx.moveTo(x, yy);
          else ctx.lineTo(x, yy);
        }
        ctx.stroke();
      }
    }

    // Brücken
    for (const [a, b] of C.BRIDGES) {
      if (!inView((a + b) / 2, (C.RIVER.y1 + C.RIVER.y2) / 2, 300)) continue;
      const x = a - S.cam.x, w = b - a;
      const by1 = C.RIVER.y1 - 10 - S.cam.y, by2 = C.RIVER.y2 + 10 - S.cam.y;
      ctx.fillStyle = "#9c7444";
      ctx.fillRect(x, by1, w, by2 - by1);
      ctx.strokeStyle = "rgba(80,55,28,0.5)";
      ctx.lineWidth = 2;
      for (let py = by1 + 8; py < by2; py += 12) {
        ctx.beginPath();
        ctx.moveTo(x + 3, py);
        ctx.lineTo(x + w - 3, py);
        ctx.stroke();
      }
      ctx.fillStyle = "#7a5a34";
      ctx.fillRect(x, by1 - 3, w, 5);
      ctx.fillRect(x, by2 - 2, w, 5);
    }

    // See
    if (inView(C.LAKE.x, C.LAKE.y, C.LAKE.rx + 150)) {
      const lx = C.LAKE.x - S.cam.x, ly = C.LAKE.y - S.cam.y;
      ctx.fillStyle = "rgba(90,120,70,0.7)";
      ctx.beginPath();
      ctx.ellipse(lx, ly, C.LAKE.rx + 6, C.LAKE.ry + 6, 0, 0, Math.PI * 2);
      ctx.fill();
      const g = ctx.createRadialGradient(lx, ly, 30, lx, ly, C.LAKE.rx);
      g.addColorStop(0, "#6db4e6");
      g.addColorStop(1, "#4a8fc4");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.ellipse(lx, ly, C.LAKE.rx, C.LAKE.ry, 0, 0, Math.PI * 2);
      ctx.fill();
      // Glitzern
      for (let i = 0; i < 14; i++) {
        const a = i * 1.7 + S.time * 0.4;
        const gx = lx + Math.cos(a) * C.LAKE.rx * 0.62;
        const gy = ly + Math.sin(a * 1.3) * C.LAKE.ry * 0.6;
        ctx.fillStyle = `rgba(255,255,255,${0.2 + 0.2 * Math.sin(S.time * 3 + i)})`;
        ctx.beginPath();
        ctx.ellipse(gx, gy, 7, 2, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      // Steg
      const dx = C.DOCK.x - S.cam.x, dy = C.DOCK.y - S.cam.y;
      ctx.fillStyle = "#9c7444";
      ctx.fillRect(dx - 14, dy - 8, 110, 26);
      ctx.strokeStyle = "rgba(80,55,28,0.5)";
      ctx.lineWidth = 2;
      for (let px = dx - 6; px < dx + 92; px += 12) {
        ctx.beginPath();
        ctx.moveTo(px, dy - 6);
        ctx.lineTo(px, dy + 16);
        ctx.stroke();
      }
      ctx.fillStyle = "#6d4e2c";
      ctx.fillRect(dx - 12, dy + 14, 5, 8);
      ctx.fillRect(dx + 86, dy + 14, 5, 8);
    }

    // Tanzfläche
    if (inView(C.DANCE_FLOOR.x, C.DANCE_FLOOR.y, 260)) {
      const fx = C.DANCE_FLOOR.x - S.cam.x, fy = C.DANCE_FLOOR.y - S.cam.y;
      ctx.fillStyle = "#d9b87c";
      ctx.beginPath();
      ctx.ellipse(fx, fy, C.DANCE_FLOOR.rx, C.DANCE_FLOOR.ry, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(150,110,60,0.6)";
      ctx.lineWidth = 2;
      for (let ring = 1; ring <= 3; ring++) {
        ctx.beginPath();
        ctx.ellipse(fx, fy, C.DANCE_FLOOR.rx * ring / 3.2, C.DANCE_FLOOR.ry * ring / 3.2, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
  }

  // ---------- Objekt-Zeichner ----------
  return { drawGround, drawWater, inView };
})();
