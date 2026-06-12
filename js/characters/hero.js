"use strict";

const CharacterHero = (() => {
  const { mulberry32, shade, capsule, rrect, circle, shadow, HIP, SHOULDER, HEAD, HEAD_R } = CharacterDraw;
  const { drawLegs, drawArms } = CharacterWoman;

// ---------- Held ----------
  const HERO = {
    skin: "#f2c79a",
    skinShade: "#d9a878",
    hair: "#5a4226",
    hairDark: "#3e2d1a",
    jacket: "#3e6fd1",
    jacketDark: "#2b4a8f",
    pants: "#2e3140",
    shoes: "#23252e",
  };

  function drawHeroHead(c, o = {}) {
    const t = o.time || 0;
    const blink = ((t * 0.9) % 3.1) < 0.09;
    const lookX = Math.max(-1, Math.min(1, o.lookX || 0)) * 1.1;

    // Haare (kurze, obere Kappe)
    circle(c, 0, -2.2, HEAD_R * 1.08, HERO.hair);
    // Gesicht
    circle(c, 0, 1.2, HEAD_R * 0.98, HERO.skin);
    // Haaransatz
    c.fillStyle = HERO.hair;
    c.beginPath();
    c.arc(0, -3.4, HEAD_R * 0.92, Math.PI * 1.02, Math.PI * 1.98);
    c.closePath();
    c.fill();

    // Brauen
    c.strokeStyle = HERO.hairDark;
    c.lineWidth = 1.2;
    c.lineCap = "round";
    for (const sx of [-1, 1]) {
      c.beginPath();
      c.moveTo(sx * 5.5, -1.4);
      c.lineTo(sx * 2.3, -1.9);
      c.stroke();
    }
    // Augen
    for (const sx of [-1, 1]) {
      const ex = sx * 3.9;
      if (blink) {
        c.strokeStyle = "#5a3e2c";
        c.lineWidth = 1;
        c.beginPath();
        c.moveTo(ex - 1.7, 1.4);
        c.lineTo(ex + 1.7, 1.4);
        c.stroke();
      } else {
        c.fillStyle = "#fff";
        c.beginPath();
        c.ellipse(ex, 1.4, 2, 2.4, 0, 0, Math.PI * 2);
        c.fill();
        circle(c, ex + lookX, 1.6, 1.3, "#4a3526");
      }
    }
    // Nase + Mund
    c.strokeStyle = HERO.skinShade;
    c.lineWidth = 0.9;
    c.beginPath();
    c.moveTo(0.2, 3);
    c.lineTo(0.9, 4.2);
    c.stroke();
    c.strokeStyle = "#9c6450";
    c.lineWidth = 1.1;
    c.beginPath();
    c.arc(0, 4.8, 2.1, Math.PI * 0.2, Math.PI * 0.8);
    c.stroke();
  }

  function drawHero(c, o) {
    const s = o.s || 1;
    const t = o.time || 0;
    const walk = o.walk || 0;
    const moving = !!o.moving;
    const aim = (o.aim === undefined || o.aim === null) ? null : o.aim;
    const facing = o.facing || 1;
    const bob = moving ? Math.abs(Math.sin(walk)) * 1.8 : Math.sin(t * 1.5) * 0.6;

    c.save();
    c.translate(o.x, o.y);
    c.scale(s, s);
    shadow(c, 11);
    c.translate(0, -bob);

    // Beine (Hose)
    drawLegs(c, HERO.skin, HERO.shoes, walk, moving, false, HERO.pants);

    // Jacke
    c.fillStyle = HERO.jacket;
    rrect(c, -8, SHOULDER + 1, 16, 15, 4);
    c.fill();
    c.fillStyle = HERO.jacketDark;
    c.fillRect(-1, SHOULDER + 1, 2, 15);
    c.fillRect(-8, -19.5, 16, 2.5);

    // Arme
    if (aim !== null) {
      // hinterer Arm angewinkelt
      c.strokeStyle = HERO.jacketDark;
      c.lineWidth = 4.2;
      c.lineCap = "round";
      c.beginPath();
      c.moveTo(-6.8, SHOULDER + 4);
      c.quadraticCurveTo(-10.5, -22, -8.5, -17);
      c.stroke();
      // Ziel-Arm mit Waffe
      c.save();
      c.translate(0, SHOULDER + 5);
      c.rotate(aim);
      capsule(c, 2, 0, 15, 0, 4.2, HERO.jacketDark);
      circle(c, 15.5, 0, 2.3, HERO.skin);
      c.fillStyle = "#383c46";
      c.fillRect(13, -2.6, 13.5, 5.2);
      c.fillStyle = "#23252e";
      c.fillRect(14.5, 2, 4, 5.5);
      c.fillStyle = "#5a6070";
      c.fillRect(24.5, -2.6, 2, 2.4);
      c.restore();
    } else {
      c.save();
      c.scale(facing, 1);
      drawArms(c, HERO.skin, HERO.jacket, o.pose || "idle", t, walk, moving);
      c.restore();
    }

    // Kopf
    c.save();
    c.translate(0, HEAD);
    let lookX = o.lookX || 0;
    if (aim !== null) lookX = Math.cos(aim) * 1.2;
    else lookX = facing * 0.6;
    drawHeroHead(c, { time: t, lookX });
    c.restore();

    c.restore();
  }

  function heroMuzzle(x, y, s, aim) {
    const sx = 0, sy = (SHOULDER + 5) * s;
    return {
      x: x + sx + Math.cos(aim) * 27 * s,
      y: y + sy + Math.sin(aim) * 27 * s,
    };
  }

  return { drawHero, heroMuzzle };
})();
