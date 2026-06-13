"use strict";

const CharacterZombie = (() => {
  const { mulberry32, shade, capsule, rrect, circle, shadow, HIP, SHOULDER, HEAD, HEAD_R } = CharacterDraw;

// ---------- Zombie ----------
  const ZOMBIE = {
    skin: "#8fb56a",
    skinShade: "#6d9148",
    shirt: "#4a4f5a",
    shirtDark: "#383c46",
    pants: "#3a3340",
    hair: "#3b3f33",
  };

  function drawZombie(c, o) {
    const s = o.s || 1;
    const t = o.time || 0;
    const walk = o.walk || 0;
    const facing = o.facing || 1;
    const lurch = Math.sin(walk * 0.5) * 0.07;

    c.save();
    c.translate(o.x, o.y);
    c.scale(s, s);
    shadow(c, 11);
    c.scale(facing, 1);
    c.rotate(lurch);
    const bob = Math.abs(Math.sin(walk)) * 1.4;
    c.translate(0, -bob);
    const filters = [];
    if (o.filter) filters.push(o.filter);
    if (o.hitFlash > 0) filters.push("brightness(2) saturate(0.4)");
    if (filters.length) c.filter = filters.join(" ");

    // Beine — schlurfend, ungleich
    const sin = Math.sin(walk);
    for (const side of [-1, 1]) {
      const sw = sin * (side === 1 ? 3.2 : 1.4) * side;
      const lift = Math.max(0, sin * side) * (side === 1 ? 2.8 : 1);
      capsule(c, side * 4, CharacterDraw.HIP, side * 4 + sw, -lift - 1, 4.6, ZOMBIE.pants);
      c.fillStyle = "#26222c";
      c.beginPath();
      c.ellipse(side * 4 + sw + 0.6, -lift - 0.6, 3.1, 2, 0, 0, Math.PI * 2);
      c.fill();
    }

    // Zerrissenes Hemd mit Zackensaum
    c.fillStyle = ZOMBIE.shirt;
    c.beginPath();
    c.moveTo(-7.6, CharacterDraw.SHOULDER + 1);
    c.lineTo(7.6, CharacterDraw.SHOULDER + 1);
    c.lineTo(8.2, -16);
    c.lineTo(5.4, -18.5);
    c.lineTo(3, -14.5);
    c.lineTo(0.2, -18);
    c.lineTo(-2.8, -14);
    c.lineTo(-5.6, -17.5);
    c.lineTo(-8.2, -15);
    c.closePath();
    c.fill();
    // Riss im Hemd
    c.fillStyle = ZOMBIE.skinShade;
    c.beginPath();
    c.ellipse(3.4, -25, 2.1, 2.8, 0.4, 0, Math.PI * 2);
    c.fill();

    // Beide Arme nach vorn gestreckt (klassische Zombie-Pose)
    c.strokeStyle = ZOMBIE.skin;
    c.lineWidth = 4;
    c.lineCap = "round";
    c.beginPath();
    c.moveTo(-5, CharacterDraw.SHOULDER + 4);
    c.lineTo(13, CharacterDraw.SHOULDER + 7 + Math.sin(walk) * 1.6);
    c.moveTo(5.5, CharacterDraw.SHOULDER + 5);
    c.lineTo(14.5, CharacterDraw.SHOULDER + 12 - Math.sin(walk) * 1.6);
    c.stroke();
    circle(c, 13.6, CharacterDraw.SHOULDER + 7 + Math.sin(walk) * 1.6, 2.4, ZOMBIE.skin);
    circle(c, 15, CharacterDraw.SHOULDER + 12 - Math.sin(walk) * 1.6, 2.4, ZOMBIE.skin);

    // Kopf — leicht zur Seite geneigt
    c.save();
    c.translate(0, CharacterDraw.HEAD);
    c.rotate(0.12 + Math.sin(t * 1.3) * 0.05);

    // Struppiges Haar
    c.fillStyle = ZOMBIE.hair;
    c.beginPath();
    c.arc(-4, -6.5, 5.2, 0, Math.PI * 2);
    c.arc(2, -8, 5, 0, Math.PI * 2);
    c.arc(6.5, -4.5, 4, 0, Math.PI * 2);
    c.fill();
    // Gesicht
    circle(c, 0, 0.8, CharacterDraw.HEAD_R * 0.96, ZOMBIE.skin);
    // Haarfransen
    c.fillStyle = ZOMBIE.hair;
    c.beginPath();
    c.arc(-5, -5, 3.4, 0, Math.PI * 2);
    c.arc(0.5, -5.8, 3.6, 0, Math.PI * 2);
    c.arc(5.5, -4.6, 3, 0, Math.PI * 2);
    c.fill();

    // Leere, weiße Augen
    for (const sx of [-1, 1]) {
      c.fillStyle = "#e8f0d8";
      c.beginPath();
      c.ellipse(sx * 3.9, 1.2, 2.3, 2.7, 0, 0, Math.PI * 2);
      c.fill();
      c.strokeStyle = ZOMBIE.skinShade;
      c.lineWidth = 0.9;
      c.stroke();
    }
    // Offener Mund
    c.fillStyle = "#3c2430";
    c.beginPath();
    c.ellipse(0.6, 5.6, 2.5, 2.9 + Math.sin(t * 3) * 0.5, 0.1, 0, Math.PI * 2);
    c.fill();
    // Wunde an der Wange
    c.fillStyle = ZOMBIE.skinShade;
    c.beginPath();
    c.ellipse(-5.8, 3.4, 1.7, 1.1, 0.5, 0, Math.PI * 2);
    c.fill();

    c.restore();
    c.restore();
  }

  return { drawZombie };
})();
