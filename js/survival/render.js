"use strict";

const SurvivalRender = (() => {

  const rand = (min, max) => min + Math.random() * (max - min);

// ---------- Rendering ----------
  function drawArena() {
    ctx.fillStyle = "#15171f";
    ctx.fillRect(0, 0, W, H);

    ctx.strokeStyle = "rgba(255,255,255,0.045)";
    ctx.lineWidth = 1;
    const grid = 56;
    ctx.beginPath();
    for (let x = 0; x <= W; x += grid) { ctx.moveTo(x, 0); ctx.lineTo(x, H); }
    for (let y = 0; y <= H; y += grid) { ctx.moveTo(0, y); ctx.lineTo(W, y); }
    ctx.stroke();

    // Risse im Boden
    ctx.strokeStyle = "rgba(0,0,0,0.35)";
    ctx.lineWidth = 1.4;
    for (const cr of SurvivalState.decor.cracks) {
      ctx.beginPath();
      ctx.moveTo(cr.x, cr.y);
      for (const [sx, sy] of cr.segs) ctx.lineTo(sx, sy);
      ctx.stroke();
    }
    // Schutt
    for (const d of SurvivalState.decor.debris) {
      ctx.save();
      ctx.translate(d.x, d.y);
      ctx.rotate(d.a);
      ctx.fillStyle = `rgba(140,145,160,${d.shade})`;
      ctx.fillRect(-d.w / 2, -d.h / 2, d.w, d.h);
      ctx.restore();
    }
    // Grasbüschel zwischen den Platten
    ctx.strokeStyle = "rgba(110,140,80,0.4)";
    ctx.lineWidth = 1.2;
    for (const g of SurvivalState.decor.grass) {
      ctx.beginPath();
      ctx.moveTo(g.x, g.y);
      ctx.lineTo(g.x - g.s * 0.5, g.y - g.s);
      ctx.moveTo(g.x, g.y);
      ctx.lineTo(g.x + g.s * 0.4, g.y - g.s * 1.1);
      ctx.stroke();
    }

    // Ichor-Flecken
    for (const st of SurvivalState.stains) {
      ctx.fillStyle = `rgba(100,140,70,${st.a})`;
      ctx.beginPath();
      ctx.ellipse(st.x, st.y, st.r, st.r * 0.7, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // Vignette
    const g = ctx.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.3, W / 2, H / 2, Math.max(W, H) * 0.75);
    g.addColorStop(0, "rgba(0,0,0,0)");
    g.addColorStop(1, "rgba(0,0,0,0.55)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
  }

  function drawPickups() {
    for (const p of SurvivalState.pickups) {
      const bob = Math.sin(SurvivalState.elapsed * 3 + p.x) * 3;
      const blink = p.t < 3 && (p.t * 6 | 0) % 2 === 0;
      if (blink) continue;
      ctx.save();
      ctx.translate(p.x, p.y + bob);
      // Schein
      const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, 26);
      glow.addColorStop(0, "rgba(255,255,255,0.14)");
      glow.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(-26, -26, 52, 52);

      if (p.type === "medkit") {
        ctx.fillStyle = "#f2f2f2";
        ctx.fillRect(-11, -8, 22, 16);
        ctx.fillStyle = "#e25555";
        ctx.fillRect(-2.5, -5.5, 5, 11);
        ctx.fillRect(-7.5, -2.5, 15, 5);
      } else {
        ctx.fillStyle = "#2c2f3a";
        ctx.fillRect(-13, -7, 26, 14);
        ctx.strokeStyle = "#ffd98a";
        ctx.lineWidth = 1.4;
        ctx.strokeRect(-13, -7, 26, 14);
        ctx.fillStyle = "#9aa2b8";
        if (p.type === "shotgun") {
          ctx.fillRect(-9, -2, 18, 4);
          ctx.fillStyle = "#7a5230";
          ctx.fillRect(3, -2, 6, 4);
        } else {
          ctx.fillRect(-9, -3, 18, 3);
          ctx.fillRect(-2, 0, 4, 5);
        }
      }
      ctx.restore();
    }
  }

  function drawBullets() {
    for (const b of SurvivalState.bullets) {
      ctx.strokeStyle = "rgba(255,226,122,0.45)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(b.x, b.y);
      ctx.lineTo(b.x - b.vx * 0.02, b.y - b.vy * 0.02);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
      ctx.fillStyle = "#ffe27a";
      ctx.fill();
    }
  }

  function drawParticles() {
    for (const p of SurvivalState.particles) {
      const alpha = Math.max(0, p.life / (p.maxLife || 1));
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color}, ${alpha})`;
      ctx.fill();
    }
    // Aufsteigende Seelen — als geisterhafte Frauen
    for (const s of SurvivalState.souls) {
      const alpha = Math.max(0, s.life / s.maxLife);
      const grad = ctx.createRadialGradient(s.x, s.y - 14, 0, s.x, s.y - 14, 30);
      grad.addColorStop(0, `hsla(${s.hue}, 90%, 80%, ${alpha * 0.8})`);
      grad.addColorStop(1, `hsla(${s.hue}, 90%, 80%, 0)`);
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(s.x, s.y - 14, 30, 0, Math.PI * 2);
      ctx.fill();

      ctx.save();
      ctx.globalAlpha = alpha * 0.75;
      Characters.drawWoman(ctx, {
        design: s.design,
        x: s.x, y: s.y,
        s: 0.8,
        time: s.maxLife - s.life,
        pose: "idle",
      });
      ctx.restore();
    }
  }

  function drawZombiesAll() {
    const sorted = SurvivalState.zombies.slice().sort((a, b) => a.y - b.y);
    for (const z of sorted) {
      Characters.drawZombie(ctx, {
        x: z.x, y: z.y + z.r,
        s: z.scale,
        time: SurvivalState.elapsed + z.wobble,
        walk: z.walk,
        facing: z.facing,
        hitFlash: z.hitFlash,
      });
      if (z.maxHp > 1 && z.hp < z.maxHp) {
        const bw = z.r * 2;
        ctx.fillStyle = "rgba(0,0,0,0.5)";
        ctx.fillRect(z.x - z.r, z.y - z.r - 26, bw, 4);
        ctx.fillStyle = "#9be07a";
        ctx.fillRect(z.x - z.r, z.y - z.r - 26, bw * (z.hp / z.maxHp), 4);
      }
    }
  }

  function draw() {
    ctx.save();
    if (SurvivalState.shake > 0) {
      ctx.translate(rand(-SurvivalState.shake, SurvivalState.shake), rand(-SurvivalState.shake, SurvivalState.shake));
    }
    drawArena();
    drawPickups();
    drawParticles();
    drawBullets();
    drawZombiesAll();
    Characters.drawHero(ctx, {
      x: SurvivalState.player.x, y: SurvivalState.player.y + 18,
      s: 1.05,
      time: SurvivalState.elapsed,
      walk: SurvivalState.player.walk,
      moving: SurvivalState.player.moving,
      aim: SurvivalState.player.angle,
    });
    ctx.restore();

    // Verletzungs-Vignette
    if (SurvivalState.hurtFlash > 0) {
      const g = ctx.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.35, W / 2, H / 2, Math.max(W, H) * 0.7);
      g.addColorStop(0, "rgba(200,30,30,0)");
      g.addColorStop(1, `rgba(200,30,30,${SurvivalState.hurtFlash * 0.45})`);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
    }

    // Wellen-Banner
    if (SurvivalState.waveBannerT > 0) {
      const a = Math.min(1, SurvivalState.waveBannerT) * Math.min(1, (2.2 - SurvivalState.waveBannerT) * 3);
      ctx.fillStyle = `rgba(255,235,180,${a})`;
      ctx.font = "800 52px 'Segoe UI', sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(`Welle ${SurvivalState.wave}`, W / 2, H * 0.3);
      ctx.textAlign = "left";
    }

    // Fadenkreuz
    ctx.strokeStyle = "rgba(255,255,255,0.75)";
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.arc(mouse.x, mouse.y, 9, 0, Math.PI * 2);
    ctx.moveTo(mouse.x - 13, mouse.y);
    ctx.lineTo(mouse.x - 5, mouse.y);
    ctx.moveTo(mouse.x + 5, mouse.y);
    ctx.lineTo(mouse.x + 13, mouse.y);
    ctx.moveTo(mouse.x, mouse.y - 13);
    ctx.lineTo(mouse.x, mouse.y - 5);
    ctx.moveTo(mouse.x, mouse.y + 5);
    ctx.lineTo(mouse.x, mouse.y + 13);
    ctx.stroke();
  }

  return { draw };
})();
