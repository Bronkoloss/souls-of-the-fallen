"use strict";

const AfterlifeRenderStructures = (() => {
  const C = AfterlifeConfig;
  const S = AfterlifeState;
  const rand = (a, b) => a + Math.random() * (b - a);
  const dist = (ax, ay, bx, by) => Math.hypot(ax - bx, ay - by);
  const pickFrom = (arr) => arr[(Math.random() * arr.length) | 0];

  const { inView } = AfterlifeRenderTerrain;

function drawTree(t) {
    const x = t.x - S.cam.x, y = t.y - S.cam.y;
    const s = t.s;
    const sway = Math.sin(S.time * 0.9 + t.x * 0.01) * 2 * s;
    ctx.fillStyle = "rgba(30,50,25,0.22)";
    ctx.beginPath();
    ctx.ellipse(x, y + 3, 26 * s, 9 * s, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#7a5230";
    ctx.lineWidth = 9 * s;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + sway * 0.3, y - 34 * s);
    ctx.stroke();
    const fc = t.color;
    ctx.fillStyle = fc;
    ctx.beginPath();
    ctx.arc(x - 16 * s + sway, y - 44 * s, 21 * s, 0, Math.PI * 2);
    ctx.arc(x + 16 * s + sway, y - 44 * s, 21 * s, 0, Math.PI * 2);
    ctx.arc(x + sway, y - 60 * s, 24 * s, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.12)";
    ctx.beginPath();
    ctx.arc(x - 6 * s + sway, y - 64 * s, 12 * s, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawHouse(h) {
    const x = h.x - S.cam.x, y = h.y - S.cam.y;
    ctx.fillStyle = "rgba(30,50,25,0.2)";
    ctx.beginPath();
    ctx.ellipse(x + h.w / 2, y + h.h + 4, h.w * 0.6, 13, 0, 0, Math.PI * 2);
    ctx.fill();
    // Wand
    ctx.fillStyle = h.wall;
    ctx.fillRect(x, y, h.w, h.h);
    ctx.fillStyle = "rgba(0,0,0,0.07)";
    ctx.fillRect(x + h.w - 14, y, 14, h.h);
    // Dach
    ctx.fillStyle = h.roof;
    ctx.beginPath();
    ctx.moveTo(x - 14, y + 6);
    ctx.lineTo(x + h.w * 0.5, y - 52);
    ctx.lineTo(x + h.w + 14, y + 6);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "rgba(0,0,0,0.12)";
    ctx.beginPath();
    ctx.moveTo(x + h.w * 0.5, y - 52);
    ctx.lineTo(x + h.w + 14, y + 6);
    ctx.lineTo(x + h.w * 0.5, y + 6);
    ctx.closePath();
    ctx.fill();
    // Tür
    ctx.fillStyle = "#7a5230";
    const dw = 26, dh = 42;
    ctx.fillRect(x + h.w / 2 - dw / 2, y + h.h - dh, dw, dh);
    ctx.fillStyle = "#e3c44f";
    ctx.beginPath();
    ctx.arc(x + h.w / 2 + dw / 2 - 6, y + h.h - dh / 2, 2.2, 0, Math.PI * 2);
    ctx.fill();
    // Fenster
    for (const wx of [x + 22, x + h.w - 46]) {
      ctx.fillStyle = "#bfe0f0";
      ctx.fillRect(wx, y + 26, 24, 22);
      ctx.strokeStyle = "#8a6a45";
      ctx.lineWidth = 2.4;
      ctx.strokeRect(wx, y + 26, 24, 22);
      ctx.beginPath();
      ctx.moveTo(wx + 12, y + 26);
      ctx.lineTo(wx + 12, y + 48);
      ctx.stroke();
      // Blumenkasten
      ctx.fillStyle = "#8a5a34";
      ctx.fillRect(wx - 2, y + 48, 28, 6);
      for (let i = 0; i < 4; i++) {
        ctx.fillStyle = ["#e84d6f", "#f2b53a", "#bb6ad6"][i % 3];
        ctx.beginPath();
        ctx.arc(wx + 3 + i * 7, y + 47, 2.6, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  function drawWell() {
    const x = C.WELL.x - S.cam.x, y = C.WELL.y - S.cam.y;
    ctx.fillStyle = "rgba(30,50,25,0.2)";
    ctx.beginPath();
    ctx.ellipse(x, y + 4, 34, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#9a9a96";
    ctx.beginPath();
    ctx.ellipse(x, y, 28, 17, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#3e6f9e";
    ctx.beginPath();
    ctx.ellipse(x, y - 2, 20, 11, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#6d4e2c";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(x - 22, y - 4);
    ctx.lineTo(x - 22, y - 48);
    ctx.moveTo(x + 22, y - 4);
    ctx.lineTo(x + 22, y - 48);
    ctx.stroke();
    ctx.fillStyle = "#b85c4a";
    ctx.beginPath();
    ctx.moveTo(x - 32, y - 44);
    ctx.lineTo(x, y - 66);
    ctx.lineTo(x + 32, y - 44);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "#4a3a26";
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(x, y - 44);
    ctx.lineTo(x, y - 16);
    ctx.stroke();
    ctx.fillStyle = "#8a6a45";
    ctx.fillRect(x - 5, y - 18, 10, 8);
  }

  function drawStall() {
    const x = C.STALL.x - S.cam.x, y = C.STALL.y - S.cam.y;
    ctx.fillStyle = "rgba(30,50,25,0.2)";
    ctx.beginPath();
    ctx.ellipse(x, y + 4, 48, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    // Theke
    ctx.fillStyle = "#a87c4e";
    ctx.fillRect(x - 42, y - 26, 84, 28);
    ctx.fillStyle = "rgba(0,0,0,0.1)";
    ctx.fillRect(x - 42, y - 8, 84, 10);
    // Waren: Körbe mit Obst
    for (let i = 0; i < 3; i++) {
      const bx = x - 26 + i * 26;
      ctx.fillStyle = "#8a6a45";
      ctx.beginPath();
      ctx.ellipse(bx, y - 28, 10, 6, 0, 0, Math.PI);
      ctx.fill();
      ctx.fillStyle = ["#e25555", "#f2b53a", "#9f86e8"][i];
      for (let f = 0; f < 3; f++) {
        ctx.beginPath();
        ctx.arc(bx - 4 + f * 4, y - 30, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    // Pfosten + Markise
    ctx.strokeStyle = "#6d4e2c";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(x - 40, y - 26);
    ctx.lineTo(x - 40, y - 64);
    ctx.moveTo(x + 40, y - 26);
    ctx.lineTo(x + 40, y - 64);
    ctx.stroke();
    for (let i = 0; i < 6; i++) {
      ctx.fillStyle = i % 2 ? "#e86a6a" : "#f6f0e0";
      ctx.beginPath();
      ctx.moveTo(x - 48 + i * 16, y - 62);
      ctx.lineTo(x - 32 + i * 16, y - 62);
      ctx.lineTo(x - 32 + i * 16, y - 50);
      ctx.quadraticCurveTo(x - 40 + i * 16, y - 44, x - 48 + i * 16, y - 50);
      ctx.closePath();
      ctx.fill();
    }
  }

  function drawCampfire() {
    const x = C.CAMPFIRE.x - S.cam.x, y = C.CAMPFIRE.y - S.cam.y;
    // Glühen
    const glow = ctx.createRadialGradient(x, y - 10, 0, x, y - 10, 70);
    glow.addColorStop(0, "rgba(255,170,60,0.32)");
    glow.addColorStop(1, "rgba(255,170,60,0)");
    ctx.fillStyle = glow;
    ctx.fillRect(x - 70, y - 80, 140, 140);
    // Steine
    for (let i = 0; i < 7; i++) {
      const a = (i / 7) * Math.PI * 2;
      ctx.fillStyle = "#8a8a86";
      ctx.beginPath();
      ctx.ellipse(x + Math.cos(a) * 20, y + Math.sin(a) * 9, 5.5, 4, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    // Holz
    ctx.strokeStyle = "#6d4e2c";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(x - 11, y + 2);
    ctx.lineTo(x + 11, y - 6);
    ctx.moveTo(x + 11, y + 2);
    ctx.lineTo(x - 11, y - 6);
    ctx.stroke();
    // Flammen
    for (let i = 0; i < 3; i++) {
      const flick = Math.sin(S.time * (7 + i * 2) + i * 2) * 3;
      const fh = 22 - i * 5 + flick;
      ctx.fillStyle = ["rgba(255,120,40,0.85)", "rgba(255,180,60,0.9)", "rgba(255,235,140,0.95)"][i];
      ctx.beginPath();
      ctx.moveTo(x - 8 + i * 2, y - 4);
      ctx.quadraticCurveTo(x - 10 + flick, y - fh * 0.6, x + flick * 0.6, y - 4 - fh);
      ctx.quadraticCurveTo(x + 10 + flick, y - fh * 0.6, x + 8 - i * 2, y - 4);
      ctx.closePath();
      ctx.fill();
    }
    // Funken
    for (const s of S.fireSparks) {
      const a = 1 - s.t / s.life;
      ctx.fillStyle = `rgba(255,200,90,${a})`;
      ctx.beginPath();
      ctx.arc(s.x - S.cam.x, s.y - S.cam.y, 1.6, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function drawLantern(x0, y0) {
    const x = x0 - S.cam.x, y = y0 - S.cam.y;
    ctx.strokeStyle = "#5a4632";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, y - 58);
    ctx.lineTo(x + 14, y - 58);
    ctx.stroke();
    const pulse = 0.75 + Math.sin(S.time * 2.4 + x0) * 0.25;
    const glow = ctx.createRadialGradient(x + 14, y - 50, 0, x + 14, y - 50, 26);
    glow.addColorStop(0, `rgba(255,220,130,${0.4 * pulse})`);
    glow.addColorStop(1, "rgba(255,220,130,0)");
    ctx.fillStyle = glow;
    ctx.fillRect(x - 12, y - 76, 52, 52);
    ctx.fillStyle = `rgba(255,225,140,${0.85 * pulse + 0.1})`;
    ctx.beginPath();
    ctx.arc(x + 14, y - 50, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#5a4632";
    ctx.lineWidth = 1.6;
    ctx.strokeRect(x + 9, y - 56, 10, 12);
  }

  function drawPortal() {
    const x = C.PORTAL.x - S.cam.x, y = C.PORTAL.y - S.cam.y;
    // Steinplattform
    ctx.fillStyle = "#a8a8a2";
    ctx.beginPath();
    ctx.ellipse(x, y + 46, 90, 26, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(0,0,0,0.08)";
    ctx.beginPath();
    ctx.ellipse(x, y + 46, 64, 17, 0, 0, Math.PI * 2);
    ctx.fill();
    // Wirbel
    const swirl = ctx.createRadialGradient(x, y - 10, 4, x, y - 10, 56);
    swirl.addColorStop(0, "rgba(240,230,255,0.95)");
    swirl.addColorStop(0.5, `rgba(170,120,255,${0.65 + Math.sin(S.time * 2) * 0.15})`);
    swirl.addColorStop(1, "rgba(110,70,200,0)");
    ctx.fillStyle = swirl;
    ctx.beginPath();
    ctx.ellipse(x, y - 10, 46, 62, 0, 0, Math.PI * 2);
    ctx.fill();
    // Funken im Wirbel
    for (let i = 0; i < 8; i++) {
      const a = S.time * 1.4 + i * 0.79;
      const rr = 18 + (i % 3) * 9;
      ctx.fillStyle = `rgba(220,190,255,${0.5 + 0.4 * Math.sin(S.time * 3 + i)})`;
      ctx.beginPath();
      ctx.arc(x + Math.cos(a) * rr * 0.7, y - 10 + Math.sin(a) * rr, 2.2, 0, Math.PI * 2);
      ctx.fill();
    }
    // Steinbogen
    ctx.strokeStyle = "#8a8a85";
    ctx.lineWidth = 14;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(x - 52, y + 46);
    ctx.lineTo(x - 52, y - 30);
    ctx.quadraticCurveTo(x, y - 95, x + 52, y - 30);
    ctx.lineTo(x + 52, y + 46);
    ctx.stroke();
    ctx.strokeStyle = "rgba(255,255,255,0.18)";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(x - 55, y + 40);
    ctx.lineTo(x - 55, y - 28);
    ctx.stroke();
  }

  function drawButterfly(b) {
    const x = b.x - S.cam.x, y = b.y - S.cam.y;
    const flap = Math.sin(b.t * 16);
    ctx.fillStyle = `hsla(${b.hue}, 80%, 70%, 0.95)`;
    ctx.beginPath();
    ctx.ellipse(x - 3 * Math.abs(flap), y, 3.4 * Math.abs(flap) + 0.6, 4, -0.4, 0, Math.PI * 2);
    ctx.ellipse(x + 3 * Math.abs(flap), y, 3.4 * Math.abs(flap) + 0.6, 4, 0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#4a3a30";
    ctx.fillRect(x - 0.7, y - 3.5, 1.4, 7);
  }

  function drawCollectibleFlower(f) {
    const x = f.x - S.cam.x, y = f.y - S.cam.y;
    const pulse = 1 + Math.sin(S.time * 3 + f.x) * 0.12;
    // Schein
    ctx.fillStyle = "rgba(255,255,255,0.18)";
    ctx.beginPath();
    ctx.arc(x, y - 8, 13 * pulse, 0, Math.PI * 2);
    ctx.fill();
    // Stiel
    ctx.strokeStyle = "#4a8a3e";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.quadraticCurveTo(x + 2, y - 6, x, y - 11);
    ctx.stroke();
    // Blüte
    ctx.fillStyle = `hsl(${f.hue}, 80%, 70%)`;
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2 + S.time * 0.5;
      ctx.beginPath();
      ctx.arc(x + Math.cos(a) * 4 * pulse, y - 12 + Math.sin(a) * 4 * pulse, 3.2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = "#ffd84f";
    ctx.beginPath();
    ctx.arc(x, y - 12, 2.6, 0, Math.PI * 2);
    ctx.fill();
  }
  return { drawTree, drawHouse, drawWell, drawStall, drawCampfire, drawLantern, drawPortal, drawButterfly, drawCollectibleFlower };
})();
