"use strict";

const AfterlifeUpdate = (() => {
  const C = AfterlifeConfig;
  const S = AfterlifeState;
  const rand = (a, b) => a + Math.random() * (b - a);
  const dist = (ax, ay, bx, by) => Math.hypot(ax - bx, ay - by);
  const pickFrom = (arr) => arr[(Math.random() * arr.length) | 0];

  const { inLake, isWalkable, tryMove, buildWorld } = AfterlifeWorld;
  const { friendshipPts, hearts, tier } = AfterlifeFriendship;
  const { emote } = AfterlifeEmotes;
  const { updateHud } = AfterlifeEnter;
// ---------- Update ----------
  function update(dt) {
    S.time += dt;
    S.introT = Math.max(0, S.introT - dt);

    updatePlayer(dt);
    updateNpcs(dt);
    updateFlowers(dt);
    updateButterflies(dt);
    updateEmotes(dt);
    updateCampfire(dt);
    updatePrompt();

    // Kamera weich nachführen
    const tx = Math.max(0, Math.min(C.WORLD.w - W, S.playerA.x - W / 2));
    const ty = Math.max(0, Math.min(C.WORLD.h - H, S.playerA.y - H / 2));
    S.cam.x += (tx - S.cam.x) * Math.min(1, dt * 5);
    S.cam.y += (ty - S.cam.y) * Math.min(1, dt * 5);
  }

  function updatePlayer(dt) {
    S.playerA.danceT = Math.max(0, S.playerA.danceT - dt);
    if (S.dialogOpen) {
      S.playerA.moving = false;
      return;
    }
    let mx = 0, my = 0;
    if (keys["w"] || keys["arrowup"]) my -= 1;
    if (keys["s"] || keys["arrowdown"]) my += 1;
    if (keys["a"] || keys["arrowleft"]) mx -= 1;
    if (keys["d"] || keys["arrowright"]) mx += 1;
    const len = Math.hypot(mx, my) || 1;
    const sprint = keys["shift"];
    const speed = sprint ? 330 : 215;
    S.playerA.moving = (mx !== 0 || my !== 0);
    if (S.playerA.moving) {
      S.playerA.walk += dt * (sprint ? 15 : 11);
      if (mx !== 0) S.playerA.facing = mx > 0 ? 1 : -1;
      tryMove(S.playerA, (mx / len) * speed * dt, (my / len) * speed * dt);
    }
  }

  function updateNpcs(dt) {
    for (const n of S.npcs) {
      n.blushT = Math.max(0, n.blushT - dt);
      n.danceT = Math.max(0, n.danceT - dt);
      if (n.waveT >= 0) n.waveT = Math.min(3, n.waveT + dt);

      if (n === S.activeNpc && S.dialogOpen) {
        n.facing = S.playerA.x >= n.x ? 1 : -1;
        continue;
      }

      // Begleiterin folgt
      if (n.seed === S.followerSeed) {
        const d = dist(n.x, n.y, S.playerA.x, S.playerA.y);
        if (d > 700) { n.x = S.playerA.x - S.playerA.facing * 40; n.y = S.playerA.y + 10; }
        else if (d > 58) {
          const a = Math.atan2(S.playerA.y - n.y, S.playerA.x - n.x);
          const sp = d > 220 ? 330 : 200;
          tryMove(n, Math.cos(a) * sp * dt, Math.sin(a) * sp * dt);
          n.walk += dt * 11;
          n.facing = Math.cos(a) >= 0 ? 1 : -1;
          n.moving = true;
        } else {
          n.moving = false;
        }
        continue;
      }

      // Normales Umherwandern
      if (n.state === "idle") {
        n.idleT -= dt;
        n.moving = false;
        const dp = dist(n.x, n.y, S.playerA.x, S.playerA.y);
        if (dp < 140) n.facing = S.playerA.x >= n.x ? 1 : -1;
        if (n.idleT <= 0) {
          const a = Math.random() * Math.PI * 2;
          const dd = rand(40, n.homeR);
          const tx = n.homeX + Math.cos(a) * dd;
          const ty = n.homeY + Math.sin(a) * dd;
          if (isWalkable(tx, ty)) {
            n.target = { x: tx, y: ty };
            n.state = "walk";
          } else {
            n.idleT = rand(0.5, 1.5);
          }
        }
      } else if (n.state === "walk") {
        const d = dist(n.x, n.y, n.target.x, n.target.y);
        if (d < 8) {
          n.state = "idle";
          n.idleT = rand(1.5, 6);
        } else {
          const a = Math.atan2(n.target.y - n.y, n.target.x - n.x);
          const ox = n.x, oy = n.y;
          tryMove(n, Math.cos(a) * 62 * dt, Math.sin(a) * 62 * dt);
          if (Math.abs(n.x - ox) < 0.01 && Math.abs(n.y - oy) < 0.01) {
            n.state = "idle";
            n.idleT = rand(0.5, 2);
          }
          n.walk += dt * 9;
          n.facing = Math.cos(a) >= 0 ? 1 : -1;
          n.moving = true;
        }
      }

      // Gelegentliche Emotes
      n.emoteCd -= dt;
      if (n.emoteCd <= 0) {
        n.emoteCd = rand(8, 22);
        emote(n.x, n.y - 52 * n.d.scale, pickFrom(["🎵", "✨", "💭", "🦋", "☁️"]), { size: 16 });
      }
    }

    // NPCs plaudern miteinander
    if (S.npcs.length > 1 && Math.random() < dt * 0.4) {
      const a = pickFrom(S.npcs);
      const b = pickFrom(S.npcs);
      if (a !== b && dist(a.x, a.y, b.x, b.y) < 110) {
        emote(a.x, a.y - 52, "💬", { size: 15 });
        emote(b.x, b.y - 52, "💬", { size: 15 });
      }
    }

    // Tanz-Noten
    if (S.playerA.danceT > 0 && Math.random() < dt * 4) {
      emote(S.playerA.x + rand(-30, 30), S.playerA.y - 60, pickFrom(["🎵", "🎶"]), { size: 17 });
    }
  }

  function updateFlowers(dt) {
    for (const f of S.flowers) {
      if (f.taken) {
        f.respawn -= dt;
        if (f.respawn <= 0) f.taken = false;
        continue;
      }
      if (!S.dialogOpen && dist(f.x, f.y, S.playerA.x, S.playerA.y) < 26) {
        f.taken = true;
        f.respawn = rand(45, 90);
        Save.data.flowers++;
        Save.write();
        AudioFX.play("flower");
        emote(f.x, f.y - 20, "🌸", { size: 18 });
        emote(f.x, f.y - 8, "✨", { size: 13 });
        updateHud();
      }
    }
  }

  function updateButterflies(dt) {
    for (const b of S.butterflies) {
      b.t += dt;
      b.a += (Math.random() - 0.5) * dt * 3;
      b.x += Math.cos(b.a) * 32 * dt;
      b.y += Math.sin(b.a) * 22 * dt + Math.sin(b.t * 6) * 8 * dt;
      if (b.x < 30) b.a = 0;
      if (b.x > C.WORLD.w - 30) b.a = Math.PI;
      if (b.y < 60) b.a = Math.PI / 2;
      if (b.y > C.WORLD.h - 40) b.a = -Math.PI / 2;
    }
  }

  function updateEmotes(dt) {
    for (let i = S.emotes.length - 1; i >= 0; i--) {
      const e = S.emotes[i];
      e.t += dt;
      e.y += e.vy * dt;
      if (e.t >= e.life) S.emotes.splice(i, 1);
    }
  }

  function updateCampfire(dt) {
    if (Math.random() < dt * 14) {
      S.fireSparks.push({
        x: C.CAMPFIRE.x + rand(-7, 7), y: C.CAMPFIRE.y - 12,
        vx: rand(-10, 10), vy: rand(-55, -30),
        life: rand(0.4, 1.1), t: 0,
      });
    }
    for (let i = S.fireSparks.length - 1; i >= 0; i--) {
      const s = S.fireSparks[i];
      s.t += dt;
      s.x += s.vx * dt;
      s.y += s.vy * dt;
      if (s.t >= s.life) S.fireSparks.splice(i, 1);
    }
  }

  function updatePrompt() {
    S.prompt = null;
    if (S.dialogOpen) return;
    // Portal
    if (dist(S.playerA.x, S.playerA.y, C.PORTAL.x, C.PORTAL.y + 40) < 95) {
      S.prompt = { text: "E — Portal ins Diesseits benutzen", x: C.PORTAL.x, y: C.PORTAL.y - 110, type: "portal" };
      return;
    }
    // Nächste NPC
    let best = null, bestD = 70;
    for (const n of S.npcs) {
      const d = dist(n.x, n.y, S.playerA.x, S.playerA.y);
      if (d < bestD) { bestD = d; best = n; }
    }
    if (best) {
      S.prompt = { text: `E — Mit ${best.d.name} reden`, x: best.x, y: best.y - 70 * best.d.scale, type: "npc", npc: best };
    }
  }
  return { update, updatePlayer, updateNpcs, updateFlowers, updateButterflies, updateEmotes, updateCampfire, updatePrompt };
})();
