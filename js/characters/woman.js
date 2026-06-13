"use strict";

const CharacterWoman = (() => {
  const { mulberry32, shade, capsule, rrect, circle, shadow, HIP, SHOULDER, HEAD, HEAD_R } = CharacterDraw;

// ---------- Frau prozedural erzeugen ----------
  function makeWoman(seed) {
    const r = mulberry32(seed);
    const pick = (arr) => arr[(r() * arr.length) | 0];
    const skin = pick(CharacterPalettes.SKIN_TONES);
    const hairColor = pick(CharacterPalettes.HAIR_COLORS);
    const outfitColor = pick(CharacterPalettes.OUTFIT_COLORS);
    let outfitColor2 = pick(CharacterPalettes.OUTFIT_COLORS);
    if (outfitColor2 === outfitColor) outfitColor2 = pick(CharacterPalettes.OUTFIT_COLORS);
    const personalityKey = pick(PERSONALITY_KEYS);
    const fetishOptions = PERSONALITIES[personalityKey].fetishPrefs || ["romantic"];
    const fetish = fetishOptions[(r() * fetishOptions.length) | 0];
    return {
      seed,
      name: pick(FIRST_NAMES),
      personality: personalityKey,
      fetish,
      backstory: pick(BACKSTORIES),
      skin,
      skinShade: shade(skin, 0.82),
      hairColor,
      hairDark: shade(hairColor, 0.72),
      hairStyle: pick(CharacterPalettes.HAIR_STYLES),
      outfit: pick(CharacterPalettes.OUTFITS),
      outfitColor,
      outfitColor2,
      accessory: pick(CharacterPalettes.ACCESSORIES),
      accColor: pick(CharacterPalettes.ACC_COLORS),
      eyeColor: pick(CharacterPalettes.EYE_COLORS),
      shoeColor: pick(CharacterPalettes.SHOE_COLORS),
      lipColor: "#b3556a",
      scale: 0.92 + r() * 0.2,
      blushy: r() < 0.3,
      // Figur: kräftigere Rundungen (Brust + Hüften), pro Seele leicht variiert
      bust: 1.7 + r() * 0.7,
      hips: 1.55 + r() * 0.55,
    };
  }

  

  // ---------- Kopf einer Frau (Ursprung = Kopfzentrum) ----------
  function drawWomanHead(c, d, o = {}) {
    const t = o.time || 0;
    const blink = ((t * 0.9 + (d.seed % 7)) % 3.4) < 0.09;
    const lookX = Math.max(-1, Math.min(1, o.lookX || 0)) * 1.0;

    // Haar-Grundform (Rand sichtbar = Pony / Haaransatz)
    circle(c, 0, -1.5, HEAD_R * 1.13, d.hairColor);
    // Gesicht
    circle(c, 0, 1.6, HEAD_R * 0.94, d.skin);

    // Pony-Fransen
    c.fillStyle = d.hairColor;
    c.beginPath();
    c.arc(-4.6, -4.2, 3.6, 0, Math.PI * 2);
    c.arc(0, -3.4, 3.8, 0, Math.PI * 2);
    c.arc(4.6, -4.2, 3.6, 0, Math.PI * 2);
    c.fill();

    // Augenbrauen
    c.strokeStyle = d.hairDark;
    c.lineWidth = 0.9;
    c.lineCap = "round";
    for (const sx of [-1, 1]) {
      c.beginPath();
      c.arc(sx * 3.9, -0.6, 2.2, Math.PI * 1.2, Math.PI * 1.8);
      c.stroke();
    }

    // Augen
    for (const sx of [-1, 1]) {
      const ex = sx * 3.9;
      if (blink) {
        c.strokeStyle = "#6b4a3a";
        c.lineWidth = 1;
        c.beginPath();
        c.moveTo(ex - 1.8, 1.6);
        c.lineTo(ex + 1.8, 1.6);
        c.stroke();
      } else {
        c.fillStyle = "#fff";
        c.beginPath();
        c.ellipse(ex, 1.5, 2.1, 2.6, 0, 0, Math.PI * 2);
        c.fill();
        circle(c, ex + lookX, 1.8, 1.35, d.eyeColor);
        circle(c, ex + lookX - 0.4, 1.2, 0.45, "#fff");
        // Wimpern
        c.strokeStyle = "#3a2a22";
        c.lineWidth = 0.8;
        c.beginPath();
        c.arc(ex, 1.3, 2.3, Math.PI * 1.15, Math.PI * 1.85);
        c.stroke();
      }
    }

    // Nase
    c.strokeStyle = d.skinShade;
    c.lineWidth = 0.8;
    c.beginPath();
    c.moveTo(0.2, 3.2);
    c.lineTo(0.8, 4.2);
    c.stroke();

    // Mund
    if (o.talking) {
      const open = 0.8 + Math.abs(Math.sin(t * 14)) * 1.3;
      c.fillStyle = "#8a3c50";
      c.beginPath();
      c.ellipse(0, 6, 1.7, open, 0, 0, Math.PI * 2);
      c.fill();
    } else {
      c.strokeStyle = d.lipColor;
      c.lineWidth = 1.1;
      c.beginPath();
      c.arc(0, 4.7, 2.3, Math.PI * 0.15, Math.PI * 0.85);
      c.stroke();
    }

    // Wangenröte
    const blushA = (d.blushy ? 0.3 : 0) + Math.min(1, o.blushT || 0) * 0.45;
    if (blushA > 0) {
      c.fillStyle = `rgba(240,110,130,${blushA})`;
      c.beginPath();
      c.ellipse(-6, 4, 1.9, 1.2, 0, 0, Math.PI * 2);
      c.ellipse(6, 4, 1.9, 1.2, 0, 0, Math.PI * 2);
      c.fill();
    }

    // Dutt oben
    if (d.hairStyle === "bun") {
      circle(c, 0, -12.5, 5, d.hairColor);
      circle(c, 0, -12.5, 5, "rgba(0,0,0,0)");
      c.strokeStyle = d.hairDark;
      c.lineWidth = 0.8;
      c.beginPath();
      c.arc(0, -12.5, 3.2, 0, Math.PI * 2);
      c.stroke();
    }

    // Accessoires
    switch (d.accessory) {
      case "flower": {
        c.fillStyle = d.accColor;
        for (let i = 0; i < 5; i++) {
          const a = (i / 5) * Math.PI * 2;
          c.beginPath();
          c.arc(-8 + Math.cos(a) * 2.1, -6.5 + Math.sin(a) * 2.1, 1.7, 0, Math.PI * 2);
          c.fill();
        }
        circle(c, -8, -6.5, 1.4, "#ffd84f");
        break;
      }
      case "bow": {
        c.fillStyle = d.accColor;
        c.beginPath();
        c.moveTo(7, -8.5);
        c.lineTo(3.6, -10.6);
        c.lineTo(3.6, -6.4);
        c.closePath();
        c.moveTo(7, -8.5);
        c.lineTo(10.4, -10.6);
        c.lineTo(10.4, -6.4);
        c.closePath();
        c.fill();
        circle(c, 7, -8.5, 1.3, shade(d.accColor, 0.75));
        break;
      }
      case "glasses": {
        c.strokeStyle = "#5a4632";
        c.lineWidth = 1;
        c.beginPath();
        c.arc(-3.9, 1.5, 3, 0, Math.PI * 2);
        c.moveTo(2.1 + 0.9, 1.5);
        c.arc(3.9, 1.5, 3, 0, Math.PI * 2);
        c.moveTo(-0.9, 1.2);
        c.lineTo(0.9, 1.2);
        c.stroke();
        break;
      }
      case "headband": {
        c.strokeStyle = d.accColor;
        c.lineWidth = 2.4;
        c.beginPath();
        c.arc(0, -1, HEAD_R * 1.02, Math.PI * 1.18, Math.PI * 1.82);
        c.stroke();
        break;
      }
      case "earrings": {
        circle(c, -9.6, 3.6, 1.1, d.accColor);
        circle(c, 9.6, 3.6, 1.1, d.accColor);
        break;
      }
      case "hat": {
        c.fillStyle = "#e8c97a";
        c.beginPath();
        c.ellipse(0, -6.5, 13.5, 3.6, 0, 0, Math.PI * 2);
        c.fill();
        c.beginPath();
        c.ellipse(0, -8.5, 7.2, 5.4, 0, Math.PI, Math.PI * 2);
        c.fill();
        c.strokeStyle = d.accColor;
        c.lineWidth = 1.8;
        c.beginPath();
        c.moveTo(-7, -7.4);
        c.lineTo(7, -7.4);
        c.stroke();
        break;
      }
    }
  }

  // ---------- Haare (hinterer Teil, vor dem Körper gezeichnet) ----------
  function drawBackHair(c, d, t) {
    const hc = d.hairColor;
    c.fillStyle = hc;
    switch (d.hairStyle) {
      case "long": {
        const sway = Math.sin(t * 1.8 + d.seed) * 0.8;
        rrect(c, -12.5 + sway * 0.3, HEAD - 11.5, 25, 36, 10);
        c.fill();
        break;
      }
      case "bob": {
        rrect(c, -12, HEAD - 11.5, 24, 19, 9);
        c.fill();
        break;
      }
      case "ponytail": {
        rrect(c, -11.5, HEAD - 11.5, 23, 15, 8);
        c.fill();
        const sway = Math.sin(t * 2.2 + d.seed) * 1.6;
        for (let i = 0; i < 5; i++) {
          const f = i / 4;
          circle(c, 8.5 + f * 2.5 + sway * f, HEAD - 6 + f * 18, 4.2 - f * 1.4, hc);
        }
        break;
      }
      case "twintails": {
        rrect(c, -11.5, HEAD - 11.5, 23, 15, 8);
        c.fill();
        const sway = Math.sin(t * 2.2 + d.seed) * 1.4;
        for (const sx of [-1, 1]) {
          for (let i = 0; i < 5; i++) {
            const f = i / 4;
            circle(c, sx * (11 + f * 3) + sway * f * sx, HEAD - 4 + f * 16, 3.8 - f * 1.2, hc);
          }
        }
        break;
      }
      case "bun":
      case "pixie": {
        rrect(c, -11.5, HEAD - 11.5, 23, 13, 8);
        c.fill();
        break;
      }
      case "curly": {
        for (let i = 0; i < 9; i++) {
          const a = Math.PI * (0.95 + (i / 8) * 1.1);
          circle(c, Math.cos(a) * 11, HEAD - 1.5 - Math.sin(a) * 11, 4.6, hc);
        }
        circle(c, -10.5, HEAD + 9, 4, hc);
        circle(c, 10.5, HEAD + 9, 4, hc);
        break;
      }
      case "braid": {
        rrect(c, -11.5, HEAD - 11.5, 23, 15, 8);
        c.fill();
        break;
      }
    }
  }

  function drawBraidFront(c, d, t) {
    if (d.hairStyle !== "braid") return;
    const sway = Math.sin(t * 2 + d.seed) * 0.8;
    for (let i = 0; i < 6; i++) {
      const f = i / 5;
      circle(c, 7 + f * 2 + sway * f, HEAD + 3 + f * 17, 3.4 - f * 0.9, i % 2 ? d.hairColor : d.hairDark);
    }
    circle(c, 9 + sway, HEAD + 21, 1.6, d.accColor);
  }

  // ---------- Beine ----------
  function drawLegs(c, skin, shoeColor, walk, moving, bare = true, pantsColor = null) {
    const sin = Math.sin(walk);
    for (const side of [-1, 1]) {
      const sw = moving ? sin * 2.6 * side : 0;
      const lift = moving ? Math.max(0, sin * side) * 2.6 : 0;
      const color = bare ? skin : pantsColor;
      capsule(c, side * 4, HIP, side * 4 + sw, -lift - 1, 4.6, color);
      // Schuh
      c.fillStyle = shoeColor;
      c.beginPath();
      c.ellipse(side * 4 + sw + 0.6, -lift - 0.6, 3.1, 2, 0, 0, Math.PI * 2);
      c.fill();
    }
  }

  // ---------- Arme ----------
  function armTargets(pose, t, walk, moving) {
    const sw = moving ? Math.sin(walk) * 1.8 : 0;
    switch (pose) {
      case "wave":
        return {
          l: { hx: -9.5, hy: -16, cx: -10.5, cy: -23 },
          r: { hx: 13, hy: -44 + Math.sin(t * 10) * 2.6, cx: 13.5, cy: -34 },
        };
      case "dance":
        return {
          l: { hx: -12, hy: -40 + Math.sin(t * 7) * 3, cx: -12.5, cy: -30 },
          r: { hx: 12, hy: -40 - Math.sin(t * 7) * 3, cx: 12.5, cy: -30 },
        };
      default:
        return {
          l: { hx: -9.5 - sw, hy: -16, cx: -10.8, cy: -23 },
          r: { hx: 9.5 + sw, hy: -16, cx: 10.8, cy: -23 },
        };
    }
  }

  function drawArms(c, skin, capColor, pose, t, walk, moving) {
    const a = armTargets(pose, t, walk, moving);
    for (const [side, arm] of [[-1, a.l], [1, a.r]]) {
      c.strokeStyle = skin;
      c.lineWidth = 4.0;
      c.lineCap = "round";
      c.beginPath();
      c.moveTo(side * 6.8, SHOULDER + 3);
      c.quadraticCurveTo(arm.cx, arm.cy, arm.hx, arm.hy);
      c.stroke();
      if (capColor) circle(c, side * 6.8, SHOULDER + 3.2, 3.2, capColor);
    }
  }

  // ---------- Oberkörper-Rundungen (Brust) ----------
  // Wird VOR dem Oberteil gezeichnet (nackte Haut), das Oberteil legt sich darüber.
  function drawBust(c, d) {
    const b = d.bust || 1;
    const cy = SHOULDER + 6.5;
    const rx = 4.4 * b, ry = 4.0 * b, sep = 3.2 * b;
    // Hautrundungen
    c.fillStyle = d.skin;
    c.beginPath();
    c.ellipse(-sep, cy, rx, ry, 0, 0, Math.PI * 2);
    c.ellipse(sep, cy, rx, ry, 0, 0, Math.PI * 2);
    c.fill();
    // sanfte Schattierung unten für Volumen
    c.fillStyle = d.skinShade;
    c.globalAlpha = 0.35;
    c.beginPath();
    c.ellipse(-sep, cy + ry * 0.45, rx * 0.85, ry * 0.5, 0, 0, Math.PI);
    c.ellipse(sep, cy + ry * 0.45, rx * 0.85, ry * 0.5, 0, 0, Math.PI);
    c.fill();
    c.globalAlpha = 1;
    // Dekolleté-Linie zwischen den Rundungen
    c.strokeStyle = d.skinShade;
    c.lineWidth = 0.9;
    c.lineCap = "round";
    c.beginPath();
    c.moveTo(0, cy - ry * 0.55);
    c.lineTo(0, cy + ry * 0.65);
    c.stroke();
  }

  // Bikini-/BH-Oberteil, das den Rundungen folgt
  function drawTopCups(c, d, color) {
    const b = d.bust || 1;
    const cy = SHOULDER + 6.5;
    const rx = 4.7 * b, ry = 4.2 * b, sep = 3.2 * b;
    c.fillStyle = color;
    c.beginPath();
    c.ellipse(-sep, cy + 0.6, rx, ry, 0, Math.PI * 0.92, Math.PI * 2.08);
    c.ellipse(sep, cy + 0.6, rx, ry, 0, Math.PI * 0.92, Math.PI * 2.08);
    c.fill();
    // Träger
    c.strokeStyle = color;
    c.lineWidth = 1.3;
    c.beginPath();
    c.moveTo(-sep - rx * 0.4, cy - ry); c.lineTo(-6.4, SHOULDER + 1.5);
    c.moveTo(sep + rx * 0.4, cy - ry); c.lineTo(6.4, SHOULDER + 1.5);
    c.stroke();
  }

  // ---------- Outfit (figurbetont & freizügig) ----------
  function drawOutfit(c, d, t, walk, moving) {
    const c1 = d.outfitColor, c2 = d.outfitColor2;
    const hp = d.hips || 1;
    const hemWave = moving ? Math.sin(walk * 2) * 0.8 : Math.sin(t * 2) * 0.4;
    // Hüft-/Po-Rundung (Haut) unter Taille, gibt Sanduhr-Silhouette
    const drawHipCurve = () => {
      c.fillStyle = d.skin;
      c.beginPath();
      c.ellipse(0, HIP + 2.5, 9.5 * hp, 6.5, 0, 0, Math.PI * 2);
      c.fill();
    };
    switch (d.outfit) {
      case "dress":
      case "sundress": {
        // freizügiges Minikleid mit tiefem Dekolleté
        drawBust(c, d);
        // Halter-Top mit tiefem V — lässt Dekolleté frei
        const b = d.bust || 1;
        const cyB = SHOULDER + 6.5, rxB = 4.7 * b, ryB = 4.2 * b, sepB = 3.2 * b;
        c.fillStyle = c1;
        c.beginPath();
        c.ellipse(-sepB, cyB + 0.6, rxB, ryB, 0, Math.PI * 0.95, Math.PI * 2.05);
        c.ellipse(sepB, cyB + 0.6, rxB, ryB, 0, Math.PI * 0.95, Math.PI * 2.05);
        c.fill();
        // Neckholder-Träger zum Hals
        c.strokeStyle = c1; c.lineWidth = 1.2; c.lineCap = "round";
        c.beginPath();
        c.moveTo(-sepB, cyB - ryB); c.lineTo(-1.5, SHOULDER + 0.5);
        c.moveTo(sepB, cyB - ryB); c.lineTo(1.5, SHOULDER + 0.5);
        c.stroke();
        // schmaler Mieder-/Taillenteil + enger Minirock
        c.fillStyle = c1;
        c.beginPath();
        c.moveTo(-3.5, SHOULDER + 11);
        c.lineTo(3.5, SHOULDER + 11);
        c.lineTo(9 * hp + hemWave, -8);
        c.quadraticCurveTo(0, -5.5, -9 * hp + hemWave, -8);
        c.closePath();
        c.fill();
        // hohe Beinschlitze andeuten (Haut)
        c.fillStyle = d.skin;
        c.beginPath();
        c.moveTo(-1.6, -9); c.lineTo(1.6, -9);
        c.lineTo(2.4, -2); c.lineTo(-2.4, -2); c.closePath();
        c.fill();
        c.fillStyle = c2;
        c.fillRect(-5.5, -19.5, 11, 1.8);
        break;
      }
      case "topskirt": {
        // bauchfreies Crop-Top + Miniröckchen
        drawBust(c, d);
        drawTopCups(c, d, c1);
        // schmaler Streifen Crop-Top unter der Brust
        c.fillStyle = c1;
        rrect(c, -5.5, SHOULDER + 11, 11, 3.5, 1.6);
        c.fill();
        drawHipCurve();
        // Minirock
        c.fillStyle = c2;
        c.beginPath();
        c.moveTo(-8 * hp, -15);
        c.lineTo(8 * hp, -15);
        c.lineTo(11 * hp + hemWave, -9);
        c.quadraticCurveTo(0, -7, -11 * hp + hemWave, -9);
        c.closePath();
        c.fill();
        break;
      }
      case "overalls": {
        // geknotetes Bikini-/Bandeau-Top + sehr kurze Hotpants
        drawBust(c, d);
        drawTopCups(c, d, c1);
        // Knoten in der Mitte
        circle(c, 0, SHOULDER + 7, 1.6, shade(c1, 0.8));
        drawHipCurve();
        // Hotpants
        c.fillStyle = c2;
        rrect(c, -8 * hp, -16, 16 * hp, 8, 3);
        c.fill();
        // Beinöffnungen
        c.fillStyle = d.skin;
        c.beginPath();
        c.ellipse(-5 * hp, -8.5, 2.4, 2.2, 0, 0, Math.PI * 2);
        c.ellipse(5 * hp, -8.5, 2.4, 2.2, 0, 0, Math.PI * 2);
        c.fill();
        break;
      }
    }
  }

  // ---------- Komplette Frau ----------
  function drawWoman(c, o) {
    const d = o.design;
    const s = (o.s || 1) * d.scale;
    const t = o.time || 0;
    const walk = o.walk || 0;
    const moving = !!o.moving;
    const facing = o.facing || 1;
    const pose = o.pose || "idle";
    const bob = moving ? Math.abs(Math.sin(walk)) * 1.8 : Math.sin(t * 1.6 + (d.seed % 10)) * 0.6;

    c.save();
    c.translate(o.x, o.y);
    c.scale(s, s);
    shadow(c, 10.5);
    c.scale(facing, 1);
    if (pose === "dance") c.rotate(Math.sin(t * 6) * 0.05);
    c.translate(0, -bob);

    drawBackHair(c, d, t);
    const bareLegs = true; // alle Outfits zeigen jetzt Bein (Hotpants/Minirock/Minikleid)
    drawLegs(c, d.skinShade, d.shoeColor, walk, moving, bareLegs, "#46588c");
    drawOutfit(c, d, t, walk, moving);
    const capColor = null; // schulterfrei
    drawArms(c, d.skin, capColor, pose, t, walk, moving);

    c.save();
    c.translate(0, HEAD);
    drawWomanHead(c, d, {
      time: t,
      talking: o.talking,
      blushT: o.blushT,
      lookX: o.lookX || 0,
    });
    c.restore();
    drawBraidFront(c, d, t);

    c.restore();
  }

  return { makeWoman, drawWoman, drawWomanHead, drawLegs, drawArms };
})();
