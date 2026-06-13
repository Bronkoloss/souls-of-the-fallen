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

    // Ichor- und Brandflecken
    for (const st of SurvivalState.stains) {
      ctx.fillStyle = st.scorch ? `rgba(30,26,24,${st.a})` : `rgba(100,140,70,${st.a})`;
      ctx.beginPath();
      ctx.ellipse(st.x, st.y, st.r, st.r * 0.7, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // Vignette
    const g = ctx.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.3, W / 2, H / 2, Math.max(W, H) * 0.75);
    g.addColorStop(0, "rgba(0,0,0,0)");
    g.addColorStop(1, SurvivalState.bloodMoon ? "rgba(60,0,8,0.6)" : "rgba(0,0,0,0.55)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    // Blutmond-Tönung über der ganzen Arena
    if (SurvivalState.bloodMoon) {
      const pulse = 0.07 + Math.sin(SurvivalState.elapsed * 2.2) * 0.02;
      ctx.fillStyle = `rgba(180,20,40,${pulse})`;
      ctx.fillRect(0, 0, W, H);
    }
  }

  function drawBarrels() {
    for (const b of SurvivalState.barrels) {
      ctx.save();
      ctx.translate(b.x, b.y);
      // Warnschein
      const fl = 0.5 + Math.sin(SurvivalState.elapsed * 5 + b.flicker) * 0.5;
      const glow = ctx.createRadialGradient(0, 0, 2, 0, 0, 26);
      glow.addColorStop(0, `rgba(255,140,40,${0.18 + fl * 0.1})`);
      glow.addColorStop(1, "rgba(255,140,40,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(-26, -26, 52, 52);
      // Fass
      ctx.fillStyle = "#7a2e22";
      ctx.beginPath();
      ctx.roundRect(-11, -15, 22, 30, 5);
      ctx.fill();
      ctx.fillStyle = "#94392a";
      ctx.fillRect(-11, -9, 22, 5);
      ctx.fillRect(-11, 3, 22, 5);
      // Warnstreifen
      ctx.fillStyle = "#ffc24a";
      ctx.fillRect(-11, -3, 22, 4);
      ctx.fillStyle = "#2a2018";
      for (let i = 0; i < 3; i++) ctx.fillRect(-9 + i * 8, -3, 4, 4);
      // Beschädigung
      if (b.hp < 3) {
        ctx.strokeStyle = "rgba(20,10,8,0.6)";
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(-6, -12); ctx.lineTo(-1, -4); ctx.lineTo(-5, 3);
        ctx.stroke();
      }
      ctx.restore();
    }
  }

  function drawAcids() {
    for (const a of SurvivalState.acids) {
      const grad = ctx.createRadialGradient(a.x, a.y, 1, a.x, a.y, 12);
      grad.addColorStop(0, "rgba(190,255,120,0.85)");
      grad.addColorStop(0.55, "rgba(120,210,60,0.5)");
      grad.addColorStop(1, "rgba(90,180,40,0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(a.x, a.y, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#a8e060";
      ctx.beginPath();
      ctx.ellipse(a.x, a.y, a.r, a.r * 0.8, Math.atan2(a.vy, a.vx), 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function drawBeams() {
    for (const b of SurvivalState.beams) {
      const a = b.life / b.maxLife;
      ctx.save();
      ctx.lineCap = "round";
      ctx.strokeStyle = `rgba(120,200,255,${a * 0.35})`;
      ctx.lineWidth = 11;
      ctx.beginPath(); ctx.moveTo(b.x1, b.y1); ctx.lineTo(b.x2, b.y2); ctx.stroke();
      ctx.strokeStyle = `rgba(190,235,255,${a * 0.8})`;
      ctx.lineWidth = 4.5;
      ctx.beginPath(); ctx.moveTo(b.x1, b.y1); ctx.lineTo(b.x2, b.y2); ctx.stroke();
      ctx.strokeStyle = `rgba(255,255,255,${a})`;
      ctx.lineWidth = 1.6;
      ctx.beginPath(); ctx.moveTo(b.x1, b.y1); ctx.lineTo(b.x2, b.y2); ctx.stroke();
      ctx.restore();
    }
  }

  function drawShocks() {
    for (const sh of SurvivalState.shocks) {
      const a = sh.life / sh.maxLife;
      ctx.strokeStyle = `rgba(${sh.color},${a * 0.7})`;
      ctx.lineWidth = 5 * a + 1;
      ctx.beginPath();
      ctx.arc(sh.x, sh.y, sh.r, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  function drawSoulBolts() {
    for (const b of SurvivalState.soulBolts) {
      const grad = ctx.createRadialGradient(b.x, b.y, 1, b.x, b.y, 14);
      grad.addColorStop(0, "rgba(220,245,255,0.9)");
      grad.addColorStop(0.5, "rgba(140,220,255,0.45)");
      grad.addColorStop(1, "rgba(140,220,255,0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(b.x, b.y, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#dff4ff";
      ctx.beginPath();
      ctx.arc(b.x, b.y, 3.4, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Schutzgeister — beste Freundinnen aus dem Jenseits
  function drawGuardians() {
    for (const gd of SurvivalState.guardians) {
      const bob = Math.sin(SurvivalState.elapsed * 2 + gd.bobPhase) * 4;
      const gy = gd.y + bob;
      // Lichthof
      const halo = ctx.createRadialGradient(gd.x, gy - 22, 4, gd.x, gy - 22, 42);
      halo.addColorStop(0, "rgba(170,225,255,0.3)");
      halo.addColorStop(1, "rgba(170,225,255,0)");
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(gd.x, gy - 22, 42, 0, Math.PI * 2);
      ctx.fill();

      ctx.save();
      ctx.globalAlpha = 0.6;
      Characters.drawWoman(ctx, {
        design: gd.design,
        x: gd.x, y: gy,
        s: 0.82,
        time: SurvivalState.elapsed,
        pose: "idle",
        facing: SurvivalState.player.x >= gd.x ? 1 : -1,
      });
      ctx.restore();

      // Funkeln
      if (Math.random() < 0.12) {
        SurvivalState.particles.push({
          x: gd.x + (Math.random() - 0.5) * 26, y: gy - Math.random() * 44,
          vx: (Math.random() - 0.5) * 16, vy: -16 - Math.random() * 18,
          r: 1 + Math.random() * 1.6, life: 0.4, maxLife: 0.4,
          color: "170, 225, 255",
        });
      }
    }
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
        ctx.strokeStyle = p.type === "flamer" ? "#ff9a52" : p.type === "railgun" ? "#8ed4ff" : "#ffd98a";
        ctx.lineWidth = 1.4;
        ctx.strokeRect(-13, -7, 26, 14);
        ctx.fillStyle = "#9aa2b8";
        if (p.type === "shotgun") {
          ctx.fillRect(-9, -2, 18, 4);
          ctx.fillStyle = "#7a5230";
          ctx.fillRect(3, -2, 6, 4);
        } else if (p.type === "flamer") {
          ctx.fillStyle = "#b04a2a";
          ctx.fillRect(-9, -3, 14, 6);
          ctx.fillStyle = "#ffae52";
          ctx.beginPath();
          ctx.arc(8, 0, 3.6, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.type === "railgun") {
          ctx.fillStyle = "#5a7e9a";
          ctx.fillRect(-10, -2.5, 20, 5);
          ctx.fillStyle = "#bfe7ff";
          ctx.fillRect(6, -4, 4, 8);
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
      if (b.flame) {
        // Flammenzungen
        const a = Math.max(0, b.life / 0.4);
        const grad = ctx.createRadialGradient(b.x, b.y, 0.5, b.x, b.y, 11);
        grad.addColorStop(0, `rgba(255,235,170,${a * 0.9})`);
        grad.addColorStop(0.5, `rgba(255,150,50,${a * 0.6})`);
        grad.addColorStop(1, "rgba(220,70,20,0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(b.x, b.y, 11, 0, Math.PI * 2);
        ctx.fill();
        continue;
      }
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
      // Brennende Untote glühen
      if (z.burnT > 0) {
        const fg = ctx.createRadialGradient(z.x, z.y, 2, z.x, z.y, z.r * 2.2);
        fg.addColorStop(0, "rgba(255,150,50,0.3)");
        fg.addColorStop(1, "rgba(255,150,50,0)");
        ctx.fillStyle = fg;
        ctx.beginPath();
        ctx.arc(z.x, z.y, z.r * 2.2, 0, Math.PI * 2);
        ctx.fill();
      }

      let filter = null;
      if (z.type === "spitter") filter = "hue-rotate(45deg) saturate(1.5)";
      else if (z.type === "boss") filter = "hue-rotate(-25deg) saturate(1.3) brightness(0.88)";
      else if (z.type === "crawler") filter = "saturate(0.7) brightness(1.1)";

      Characters.drawZombie(ctx, {
        x: z.x, y: z.y + z.r,
        s: z.scale,
        time: SurvivalState.elapsed + z.wobble,
        walk: z.walk,
        facing: z.facing,
        hitFlash: z.hitFlash,
        filter,
      });
      if (z.type !== "boss" && z.maxHp > 1 && z.hp < z.maxHp) {
        const bw = z.r * 2;
        ctx.fillStyle = "rgba(0,0,0,0.5)";
        ctx.fillRect(z.x - z.r, z.y - z.r - 26, bw, 4);
        ctx.fillStyle = "#9be07a";
        ctx.fillRect(z.x - z.r, z.y - z.r - 26, bw * (z.hp / z.maxHp), 4);
      }
    }
  }

  // Boss-Lebensbalken am oberen Bildschirmrand
  function drawBossBar() {
    const boss = SurvivalState.zombies.find((z) => z.type === "boss");
    if (!boss) return;
    const bw = Math.min(520, W * 0.5);
    const bx = W / 2 - bw / 2, by = 64;
    ctx.fillStyle = "rgba(0,0,0,0.55)";
    ctx.beginPath();
    ctx.roundRect(bx - 4, by - 4, bw + 8, 18, 9);
    ctx.fill();
    const frac = Math.max(0, boss.hp / boss.maxHp);
    const grad = ctx.createLinearGradient(bx, 0, bx + bw, 0);
    grad.addColorStop(0, "#c93a5e");
    grad.addColorStop(1, "#8a2747");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.roundRect(bx, by, bw * frac, 10, 5);
    ctx.fill();
    ctx.fillStyle = "rgba(255,225,235,0.92)";
    ctx.font = "700 13px 'Segoe UI', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("KOLOSS — in ihm sind vier Seelen gefangen", W / 2, by - 10);
    ctx.textAlign = "left";
  }

  function draw() {
    ctx.save();
    if (SurvivalState.shake > 0) {
      ctx.translate(rand(-SurvivalState.shake, SurvivalState.shake), rand(-SurvivalState.shake, SurvivalState.shake));
    }
    drawArena();
    drawPickups();
    drawBarrels();
    drawShocks();
    drawParticles();
    drawBullets();
    drawAcids();
    drawZombiesAll();
    Characters.drawHero(ctx, {
      x: SurvivalState.player.x, y: SurvivalState.player.y + 18,
      s: 1.05,
      time: SurvivalState.elapsed,
      walk: SurvivalState.player.walk,
      moving: SurvivalState.player.moving,
      aim: SurvivalState.player.angle,
    });
    drawGuardians();
    drawSoulBolts();
    drawBeams();
    ctx.restore();

    // Verletzungs-Vignette
    if (SurvivalState.hurtFlash > 0) {
      const g = ctx.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.35, W / 2, H / 2, Math.max(W, H) * 0.7);
      g.addColorStop(0, "rgba(200,30,30,0)");
      g.addColorStop(1, `rgba(200,30,30,${SurvivalState.hurtFlash * 0.45})`);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
    }

    drawBossBar();

    // Wellen-Banner
    if (SurvivalState.waveBannerT > 0) {
      const a = Math.min(1, SurvivalState.waveBannerT) * Math.min(1, (2.2 - SurvivalState.waveBannerT) * 3);
      ctx.fillStyle = `rgba(255,235,180,${a})`;
      ctx.font = "800 52px 'Segoe UI', sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(`Welle ${SurvivalState.wave}`, W / 2, H * 0.3);
      ctx.textAlign = "left";
    }

    // Blutmond-Banner
    if (SurvivalState.moonBannerT > 0) {
      const a = Math.min(1, SurvivalState.moonBannerT) * Math.min(1, (3.2 - SurvivalState.moonBannerT) * 3);
      ctx.textAlign = "center";
      ctx.fillStyle = `rgba(255,90,110,${a})`;
      ctx.font = "800 44px 'Segoe UI', sans-serif";
      ctx.fillText("🌕 BLUTMOND", W / 2, H * 0.4);
      ctx.font = "600 19px 'Segoe UI', sans-serif";
      ctx.fillStyle = `rgba(255,200,205,${a})`;
      ctx.fillText("Die Untoten rasen — doch jede trägt zwei Seelen in sich!", W / 2, H * 0.4 + 36);
      ctx.textAlign = "left";
    }

    // Koloss-Banner
    if (SurvivalState.bossBannerT > 0) {
      const a = Math.min(1, SurvivalState.bossBannerT) * Math.min(1, (3 - SurvivalState.bossBannerT) * 3);
      ctx.textAlign = "center";
      ctx.fillStyle = `rgba(220,120,255,${a})`;
      ctx.font = "800 40px 'Segoe UI', sans-serif";
      ctx.fillText("⚠ EIN KOLOSS ERHEBT SICH", W / 2, H * 0.5);
      ctx.textAlign = "left";
    }

    // Seelenwacht-Banner (Rundenstart)
    if (SurvivalState.guardianBannerT > 0) {
      const t = SurvivalState.guardianBannerT;
      const a = Math.min(1, t) * Math.min(1, (4.5 - t) * 1.6);
      const n = SurvivalState.guardians.length;
      ctx.textAlign = "center";
      ctx.fillStyle = `rgba(180,230,255,${a})`;
      ctx.font = "700 22px 'Segoe UI', sans-serif";
      ctx.fillText(
        n === 1
          ? "💕 Deine beste Freundin wacht aus dem Jenseits über dich"
          : `💕 ${n} deiner besten Freundinnen wachen aus dem Jenseits über dich`,
        W / 2, H * 0.62);
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
