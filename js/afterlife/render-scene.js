"use strict";

const AfterlifeRenderScene = (() => {
  const C = AfterlifeConfig;
  const S = AfterlifeState;
  const rand = (a, b) => a + Math.random() * (b - a);
  const dist = (ax, ay, bx, by) => Math.hypot(ax - bx, ay - by);
  const pickFrom = (arr) => arr[(Math.random() * arr.length) | 0];

  const { inView, drawGround, drawWater } = AfterlifeRenderTerrain;
  const R = AfterlifeRenderStructures;
  const { hearts } = AfterlifeFriendship;

// ---------- Hauptzeichnung ----------
  function draw() {
    drawGround();
    drawWater();

    // Sammelbare Blumen (Bodenebene)
    for (const f of S.flowers) {
      if (!f.taken && inView(f.x, f.y, 40)) R.drawCollectibleFlower(f);
    }

    // Render-Liste nach y sortieren (Painter-Algorithmus)
    const list = [];
    for (const t of S.trees) if (inView(t.x, t.y)) list.push({ y: t.y, fn: () => R.drawTree(t) });
    for (const h of C.HOUSES) if (inView(h.x + h.w / 2, h.y + h.h)) list.push({ y: h.y + h.h, fn: () => R.drawHouse(h) });
    if (inView(C.WELL.x, C.WELL.y)) list.push({ y: C.WELL.y, fn: R.drawWell });
    if (inView(C.STALL.x, C.STALL.y)) list.push({ y: C.STALL.y, fn: R.drawStall });
    if (inView(C.CAMPFIRE.x, C.CAMPFIRE.y)) list.push({ y: C.CAMPFIRE.y, fn: R.drawCampfire });
    if (inView(C.PORTAL.x, C.PORTAL.y, 220)) list.push({ y: C.PORTAL.y + 46, fn: R.drawPortal });

    // Laternen um den Festplatz
    const lanternSpots = [
      [C.DANCE_FLOOR.x - 180, C.DANCE_FLOOR.y - 60], [C.DANCE_FLOOR.x + 160, C.DANCE_FLOOR.y - 70],
      [C.DANCE_FLOOR.x - 150, C.DANCE_FLOOR.y + 90], [C.DANCE_FLOOR.x + 180, C.DANCE_FLOOR.y + 80],
    ];
    for (const [lx, ly] of lanternSpots) {
      if (inView(lx, ly)) list.push({ y: ly, fn: () => R.drawLantern(lx, ly) });
    }

    // NPCs
    for (const n of S.npcs) {
      if (!inView(n.x, n.y)) continue;
      list.push({
        y: n.y,
        fn: () => {
          Characters.drawWoman(ctx, {
            design: n.d,
            x: n.x - S.cam.x, y: n.y - S.cam.y,
            s: 1.05,
            time: S.time,
            walk: n.walk,
            moving: n.moving,
            facing: n.facing,
            pose: n.danceT > 0 ? "dance" : (n.waveT >= 0 && n.waveT < 3 ? "wave" : "idle"),
            talking: S.dialogOpen && n === S.activeNpc,
            blushT: n.blushT,
            lookX: n.facing * 0.7,
          });
        },
      });
    }

    // Spieler (Spielerin — erscheint im Jenseits als Frau)
    list.push({
      y: S.playerA.y,
      fn: () => {
        Characters.drawWoman(ctx, {
          design: S.playerA.d,
          x: S.playerA.x - S.cam.x, y: S.playerA.y - S.cam.y,
          s: 1.05,
          time: S.time,
          walk: S.playerA.walk,
          moving: S.playerA.moving,
          facing: S.playerA.facing,
          pose: S.playerA.danceT > 0 ? "dance" : "idle",
          lookX: S.playerA.facing * 0.6,
        });
      },
    });

    list.sort((a, b) => a.y - b.y);
    for (const item of list) item.fn();

    // Schmetterlinge (über allem)
    for (const b of S.butterflies) if (inView(b.x, b.y, 40)) R.drawButterfly(b);

    // Namen über nahen NPCs
    ctx.textAlign = "center";
    for (const n of S.npcs) {
      const d = dist(n.x, n.y, S.playerA.x, S.playerA.y);
      if (d < 190 && inView(n.x, n.y)) {
        const alpha = Math.min(1, (190 - d) / 70);
        const nx = n.x - S.cam.x, ny = n.y - S.cam.y - 68 * n.d.scale;
        ctx.font = "600 13px 'Segoe UI', sans-serif";
        ctx.fillStyle = `rgba(40,55,35,${alpha * 0.85})`;
        ctx.fillText(n.d.name, nx + 1, ny + 1);
        ctx.fillStyle = `rgba(255,255,250,${alpha})`;
        ctx.fillText(n.d.name, nx, ny);
        const h = hearts(n.seed);
        if (h > 0) {
          ctx.font = "10px 'Segoe UI', sans-serif";
          ctx.fillStyle = `rgba(240,110,140,${alpha})`;
          ctx.fillText("❤".repeat(h), nx, ny + 13);
        }
      }
    }

    // Emotes
    for (const e of S.emotes) {
      const a = e.t < 0.15 ? e.t / 0.15 : Math.max(0, 1 - (e.t - e.life * 0.55) / (e.life * 0.45));
      ctx.globalAlpha = Math.max(0, Math.min(1, a));
      ctx.font = `${e.size}px serif`;
      ctx.fillText(e.char, e.x - S.cam.x, e.y - S.cam.y);
      ctx.globalAlpha = 1;
    }

    // Interaktions-Hinweis
    if (S.prompt && !S.dialogOpen) {
      const px = S.prompt.x - S.cam.x, py = S.prompt.y - S.cam.y;
      ctx.font = "600 14px 'Segoe UI', sans-serif";
      const tw = ctx.measureText(S.prompt.text).width;
      ctx.fillStyle = "rgba(25,40,25,0.72)";
      const bw = tw + 22;
      ctx.beginPath();
      ctx.roundRect(px - bw / 2, py - 16, bw, 26, 13);
      ctx.fill();
      ctx.fillStyle = "#fdf8e8";
      ctx.fillText(S.prompt.text, px, py + 2);
    }
    ctx.textAlign = "left";

    // Warmes Licht / sanfte Vignette
    const warm = ctx.createRadialGradient(W / 2, H * 0.25, Math.min(W, H) * 0.2, W / 2, H * 0.5, Math.max(W, H) * 0.85);
    warm.addColorStop(0, "rgba(255,240,190,0.1)");
    warm.addColorStop(1, "rgba(70,90,50,0.18)");
    ctx.fillStyle = warm;
    ctx.fillRect(0, 0, W, H);

    // Schwebende Lichtfunken
    for (let i = 0; i < 24; i++) {
      const t = S.time * 0.4 + i;
      const x = (i * 137.3 + Math.sin(t) * 40) % W;
      const y = (i * 89.7 + Math.cos(t * 0.7) * 26) % H;
      const a = 0.12 + 0.12 * Math.sin(t * 2);
      ctx.fillStyle = `rgba(255,255,225,${a})`;
      ctx.beginPath();
      ctx.arc(x, y, 1.6, 0, Math.PI * 2);
      ctx.fill();
    }

    drawMinimap();

    // Intro-Text
    if (S.introT > 0) {
      const a = Math.min(1, S.introT) * Math.min(1, (8 - S.introT) * 2);
      ctx.textAlign = "center";
      ctx.font = "600 24px 'Segoe UI', sans-serif";
      const lines = S.introText.split("\n");
      lines.forEach((line, i) => {
        ctx.fillStyle = `rgba(30,45,28,${a * 0.7})`;
        ctx.fillText(line, W / 2 + 1, H * 0.18 + i * 34 + 1);
        ctx.fillStyle = `rgba(255,253,240,${a})`;
        ctx.fillText(line, W / 2, H * 0.18 + i * 34);
      });
      ctx.textAlign = "left";
    }
  }

  function drawMinimap() {
    const mw = 176, mh = mw * (C.WORLD.h / C.WORLD.w);
    const mx = W - mw - 18, my = 70;
    const sx = mw / C.WORLD.w, sy = mh / C.WORLD.h;

    ctx.save();
    ctx.globalAlpha = 0.92;
    ctx.fillStyle = "rgba(20,35,18,0.55)";
    ctx.beginPath();
    ctx.roundRect(mx - 5, my - 5, mw + 10, mh + 10, 9);
    ctx.fill();
    ctx.fillStyle = "#6fae62";
    ctx.fillRect(mx, my, mw, mh);
    // Fluss & See
    ctx.fillStyle = "#549ad0";
    ctx.fillRect(mx, my + C.RIVER.y1 * sy, mw, (C.RIVER.y2 - C.RIVER.y1) * sy);
    ctx.beginPath();
    ctx.ellipse(mx + C.LAKE.x * sx, my + C.LAKE.y * sy, C.LAKE.rx * sx, C.LAKE.ry * sy, 0, 0, Math.PI * 2);
    ctx.fill();
    // Brücken
    ctx.fillStyle = "#9c7444";
    for (const [a, b] of C.BRIDGES) {
      ctx.fillRect(mx + a * sx, my + C.RIVER.y1 * sy, (b - a) * sx, (C.RIVER.y2 - C.RIVER.y1) * sy);
    }
    // Häuser
    ctx.fillStyle = "#c98c5a";
    for (const h of C.HOUSES) {
      ctx.fillRect(mx + h.x * sx - 1, my + h.y * sy - 1, Math.max(3, h.w * sx), Math.max(3, h.h * sy));
    }
    // Portal
    ctx.fillStyle = "#c89bff";
    ctx.beginPath();
    ctx.arc(mx + C.PORTAL.x * sx, my + C.PORTAL.y * sy, 3.4, 0, Math.PI * 2);
    ctx.fill();
    // NPCs
    ctx.fillStyle = "#ffb3cd";
    for (const n of S.npcs) {
      ctx.fillRect(mx + n.x * sx - 1, my + n.y * sy - 1, 2.4, 2.4);
    }
    // Spieler
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(mx + S.playerA.x * sx, my + S.playerA.y * sy, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.7)";
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore();
  }
  return { draw, drawMinimap };
})();
