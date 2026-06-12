"use strict";

/* Menü-Hintergrund und Spielstand-Anzeige. */

let menuTime = 0;

function drawMenuBackdrop(dt) {
  menuTime += dt;
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, "#171a24");
  g.addColorStop(1, "#0b0d12");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);

  for (let i = 0; i < 26; i++) {
    const speed = 12 + (i % 5) * 6;
    const x = (i * 149.3) % W + Math.sin(menuTime * 0.6 + i) * 24;
    const y = H - ((menuTime * speed + i * 173) % (H + 80)) + 40;
    const a = 0.1 + 0.12 * Math.sin(menuTime + i * 2);
    const r = 2 + (i % 4);
    const grad = ctx.createRadialGradient(x, y, 0, x, y, r * 4);
    grad.addColorStop(0, `rgba(150,220,255,${a})`);
    grad.addColorStop(1, "rgba(150,220,255,0)");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, r * 4, 0, Math.PI * 2);
    ctx.fill();
  }
}

function refreshMenu() {
  const n = Save.data.souls.length;
  const hasSave = n > 0 || Save.data.flowers > 0;
  enterAfterlifeBtn.classList.toggle("hidden", n === 0);
  resetSaveBtn.classList.toggle("hidden", !hasSave);
  saveInfo.classList.toggle("hidden", !hasSave);
  if (hasSave) {
    saveInfo.textContent =
      `Spielstand: ${n} gerettete ${n === 1 ? "Seele" : "Seelen"} · ` +
      `${Save.data.flowers} Blumen · Beste Welle: ${Save.data.bestWave}`;
  }
}

refreshMenu();
