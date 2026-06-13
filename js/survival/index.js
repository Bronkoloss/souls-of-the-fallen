"use strict";

const Survival = (() => {

  const WEAPONS = SURVIVAL_WEAPONS;
  const S = SurvivalState;

  const rand = (min, max) => min + Math.random() * (max - min);
  const dist2 = (ax, ay, bx, by) => {
    const dx = ax - bx, dy = ay - by;
    return dx * dx + dy * dy;
  };

  function reset() {
    S.player = {
      x: W / 2, y: H / 2, r: 15,
      speed: 245, hp: 100, maxHp: 100,
      angle: 0, walk: 0, moving: false,
      weapon: "pistol", ammo: Infinity,
    };
    S.bullets = [];
    S.zombies = [];
    S.souls = [];
    S.particles = [];
    S.pickups = [];
    S.stains = [];
    S.acids = [];
    S.barrels = [];
    S.beams = [];
    S.shocks = [];
    S.soulBolts = [];
    S.freedSeeds = [];

    S.kills = 0;
    S.wave = 1;
    S.elapsed = 0;
    S.spawnTimer = 1.2;
    S.spawnInterval = 1.3;
    S.fireCooldown = 0;
    S.pickupTimer = rand(7, 11);
    S.barrelTimer = rand(5, 9);
    S.shake = 0;
    S.hurtFlash = 0;
    S.waveBannerT = 0;
    S.bossBannerT = 0;
    S.moonBannerT = 0;
    S.bloodMoon = false;
    S.lastBossWave = 0;

    buildGuardians();
    buildDecor();
    updateHud();
  }

  // ---------- Seelenwacht ----------
  // Beste Freundinnen (5 Herzen) aus dem Jenseits erscheinen als
  // Schutzgeister im Diesseits und feuern Seelenblitze auf die Untoten.
  function buildGuardians() {
    S.guardians = [];
    S.guardianBannerT = 0;
    const threshold = (typeof AfterlifeConfig !== "undefined" && AfterlifeConfig.HEART_THRESHOLDS)
      ? AfterlifeConfig.HEART_THRESHOLDS[4] : 24;
    const friends = Save.data.souls.filter((seed) => (Save.data.friendship[seed] || 0) >= threshold);
    const picked = friends.slice(0, 3);
    picked.forEach((seed, i) => {
      S.guardians.push({
        seed,
        design: Characters.makeWoman(seed),
        angle: (i / Math.max(1, picked.length)) * Math.PI * 2,
        x: W / 2, y: H / 2,
        fireT: 1.5 + i * 0.9,
        bobPhase: rand(0, Math.PI * 2),
      });
    });
    if (S.guardians.length > 0) S.guardianBannerT = 4.5;
  }

  function buildDecor() {
    const r = Characters.mulberry32(20260612);
    S.decor = { cracks: [], debris: [], grass: [] };
    for (let i = 0; i < 14; i++) {
      const x = r() * W, y = r() * H;
      const segs = [];
      let px = x, py = y;
      for (let s = 0; s < 4; s++) {
        px += (r() - 0.5) * 80;
        py += (r() - 0.5) * 80;
        segs.push([px, py]);
      }
      S.decor.cracks.push({ x, y, segs });
    }
    for (let i = 0; i < 22; i++) {
      S.decor.debris.push({
        x: r() * W, y: r() * H,
        w: 4 + r() * 14, h: 3 + r() * 8,
        a: r() * Math.PI, shade: 0.16 + r() * 0.18,
      });
    }
    for (let i = 0; i < 30; i++) {
      S.decor.grass.push({ x: r() * W, y: r() * H, s: 2 + r() * 4 });
    }
  }

  function updateHud() {
    hudKills.textContent = S.kills;
    hudWave.textContent = S.wave;
    const w = SURVIVAL_WEAPONS[S.player.weapon];
    hudWeapon.textContent = w.name + (S.player.ammo === Infinity ? "" : ` · ${S.player.ammo}`);
    healthFill.style.width = Math.max(0, (S.player.hp / S.player.maxHp) * 100) + "%";
  }

  // ---------- Spawning ----------
  function zombieTypeForWave() {
    const roll = Math.random();
    if (S.wave >= 2 && roll < 0.1 + S.wave * 0.008) return "crawler";
    if (S.wave >= 4 && roll < 0.2 + S.wave * 0.008) return "spitter";
    if (S.wave >= 3 && roll < 0.36 + S.wave * 0.01) return "runner";
    if (S.wave >= 4 && roll > 0.93 - S.wave * 0.008) return "brute";
    return "walker";
  }

  function edgeSpawnPoint() {
    const margin = 50;
    const edge = (Math.random() * 4) | 0;
    if (edge === 0) return { x: rand(0, W), y: -margin };
    if (edge === 1) return { x: W + margin, y: rand(0, H) };
    if (edge === 2) return { x: rand(0, W), y: H + margin };
    return { x: -margin, y: rand(0, H) };
  }

  function makeZombie(x, y, type, tier) {
    let z;
    if (type === "runner") {
      z = { r: 12, scale: 0.8, speed: rand(125, 155) + tier * 3, hp: 1 + (tier / 3 | 0), dmg: 16 };
    } else if (type === "brute") {
      z = { r: 22, scale: 1.45, speed: rand(36, 46), hp: 8 + tier, dmg: 44 };
    } else if (type === "crawler") {
      z = { r: 9, scale: 0.62, speed: rand(92, 118) + tier * 4, hp: 1, dmg: 9 };
    } else if (type === "spitter") {
      z = { r: 14, scale: 0.95, speed: rand(38, 50), hp: 3 + (tier / 2 | 0), dmg: 14, spitT: rand(1.2, 2.4) };
    } else {
      z = { r: 15, scale: 1, speed: rand(55, 80) + tier * 4, hp: 2 + (tier / 2 | 0), dmg: 22 };
    }
    if (S.bloodMoon) z.speed *= 1.25;
    return {
      x, y, type, ...z,
      maxHp: z.hp,
      hitFlash: 0,
      burnT: 0,
      wobble: rand(0, Math.PI * 2),
      walk: rand(0, Math.PI * 2),
      seed: (Math.random() * 2 ** 31) | 0,
      facing: 1,
    };
  }

  function spawnZombie() {
    const tier = Math.min(S.wave, 9);
    const type = zombieTypeForWave();
    const p = edgeSpawnPoint();
    if (type === "crawler") {
      // Kriecherinnen kommen im Rudel
      const count = 3 + (Math.random() * 3 | 0);
      for (let i = 0; i < count; i++) {
        S.zombies.push(makeZombie(p.x + rand(-46, 46), p.y + rand(-46, 46), "crawler", tier));
      }
    } else {
      S.zombies.push(makeZombie(p.x, p.y, type, tier));
    }
  }

  function spawnBoss() {
    const p = edgeSpawnPoint();
    const tier = Math.min(S.wave, 14);
    S.zombies.push({
      x: p.x, y: p.y, type: "boss",
      r: 34, scale: 2.3,
      speed: rand(26, 33),
      hp: 50 + tier * 5, maxHp: 50 + tier * 5,
      dmg: 60,
      stompT: 3.5,
      hitFlash: 0, burnT: 0,
      wobble: rand(0, Math.PI * 2),
      walk: rand(0, Math.PI * 2),
      seed: (Math.random() * 2 ** 31) | 0,
      facing: 1,
    });
    S.bossBannerT = 3;
    AudioFX.play("roar");
  }

  function spawnPickup() {
    const roll = Math.random();
    const type =
      roll < 0.34 ? "medkit" :
      roll < 0.54 ? "shotgun" :
      roll < 0.74 ? "mg" :
      roll < 0.89 ? "flamer" : "railgun";
    S.pickups.push({
      type,
      x: rand(90, W - 90),
      y: rand(110, H - 90),
      t: 14,
    });
  }

  function spawnBarrel() {
    if (S.barrels.length >= 2) return;
    S.barrels.push({
      x: rand(110, W - 110),
      y: rand(130, H - 110),
      hp: 3, r: 14,
      flicker: rand(0, Math.PI * 2),
    });
  }

  // ---------- Update ----------
  function update(dt) {
    S.elapsed += dt;
    S.shake = Math.max(0, S.shake - dt * 30);
    S.hurtFlash = Math.max(0, S.hurtFlash - dt * 1.6);
    S.waveBannerT = Math.max(0, S.waveBannerT - dt);
    S.bossBannerT = Math.max(0, S.bossBannerT - dt);
    S.moonBannerT = Math.max(0, S.moonBannerT - dt);
    S.guardianBannerT = Math.max(0, S.guardianBannerT - dt);

    const newWave = 1 + Math.floor(S.elapsed / 18);
    if (newWave !== S.wave) {
      S.wave = newWave;
      S.spawnInterval = Math.max(0.26, 1.3 - (S.wave - 1) * 0.11);
      S.waveBannerT = 2.2;

      // Blutmond — jede 7. Welle färbt sich der Himmel rot:
      // schnellere, rasendere Untote, aber jede befreit DOPPELT Seelen.
      const moonNow = S.wave % 7 === 0;
      if (moonNow && !S.bloodMoon) {
        S.moonBannerT = 3.2;
        AudioFX.play("bloodmoon");
      }
      S.bloodMoon = moonNow;
      if (S.bloodMoon) S.spawnInterval *= 0.6;

      // Jede 5. Welle erhebt sich ein Koloss
      if (S.wave % 5 === 0 && S.wave > S.lastBossWave) {
        S.lastBossWave = S.wave;
        spawnBoss();
      }
    }

    // Bewegung
    let mx = 0, my = 0;
    if (keys["w"] || keys["arrowup"]) my -= 1;
    if (keys["s"] || keys["arrowdown"]) my += 1;
    if (keys["a"] || keys["arrowleft"]) mx -= 1;
    if (keys["d"] || keys["arrowright"]) mx += 1;
    const len = Math.hypot(mx, my) || 1;
    S.player.moving = (mx !== 0 || my !== 0);
    if (S.player.moving) S.player.walk += dt * 11;
    S.player.x += (mx / len) * S.player.speed * dt;
    S.player.y += (my / len) * S.player.speed * dt;
    S.player.x = Math.max(S.player.r + 8, Math.min(W - S.player.r - 8, S.player.x));
    S.player.y = Math.max(S.player.r + 26, Math.min(H - S.player.r - 6, S.player.y));
    S.player.angle = Math.atan2(mouse.y - (S.player.y - 9), mouse.x - S.player.x);

    // Schießen
    S.fireCooldown -= dt;
    const weapon = SURVIVAL_WEAPONS[S.player.weapon];
    if (mouse.down && S.fireCooldown <= 0) {
      S.fireCooldown = weapon.cd;
      if (S.player.ammo !== Infinity) {
        S.player.ammo--;
        if (S.player.ammo <= 0) {
          S.player.weapon = "pistol";
          S.player.ammo = Infinity;
        }
      }
      const muzzle = Characters.heroMuzzle(S.player.x, S.player.y + 18, 1.05, S.player.angle);

      if (weapon.beam) {
        fireBeam(muzzle.x, muzzle.y, S.player.angle, weapon);
      } else {
        for (let p = 0; p < weapon.pellets; p++) {
          const a = S.player.angle + rand(-weapon.spread, weapon.spread);
          S.bullets.push({
            x: muzzle.x, y: muzzle.y,
            vx: Math.cos(a) * weapon.speed * (weapon.flame ? rand(0.7, 1.15) : 1),
            vy: Math.sin(a) * weapon.speed * (weapon.flame ? rand(0.7, 1.15) : 1),
            r: weapon.flame ? 5 : 4,
            life: weapon.flame ? rand(0.24, 0.4) : 1.2,
            dmg: weapon.flame ? 0.4 : 1,
            flame: !!weapon.flame,
          });
        }
      }

      // Mündungsfeuer
      const mCount = weapon.flame ? 2 : 4;
      for (let i = 0; i < mCount; i++) {
        const a = S.player.angle + rand(-0.3, 0.3);
        S.particles.push({
          x: muzzle.x, y: muzzle.y,
          vx: Math.cos(a) * rand(60, 200),
          vy: Math.sin(a) * rand(60, 200),
          r: rand(1.5, 3), life: rand(0.08, 0.22), maxLife: 0.22,
          color: weapon.flame ? "255, 150, 60" : "255, 220, 120",
        });
      }
      S.shake = Math.min(6, S.shake + (S.player.weapon === "shotgun" ? 4 : S.player.weapon === "railgun" ? 5 : weapon.flame ? 0.3 : 1.2));
      AudioFX.play(weapon.sound);
      updateHud();
    }

    // Zombie-Spawns
    S.spawnTimer -= dt;
    if (S.spawnTimer <= 0) {
      S.spawnTimer = S.spawnInterval;
      const count = 1 + Math.floor(rand(0, Math.min(S.wave, 4)));
      for (let i = 0; i < count; i++) spawnZombie();
    }

    // Pickups
    S.pickupTimer -= dt;
    if (S.pickupTimer <= 0) {
      S.pickupTimer = rand(8, 13);
      if (S.pickups.length < 3) spawnPickup();
    }
    for (let i = S.pickups.length - 1; i >= 0; i--) {
      const p = S.pickups[i];
      p.t -= dt;
      if (p.t <= 0) { S.pickups.splice(i, 1); continue; }
      if (dist2(p.x, p.y, S.player.x, S.player.y) < 28 * 28) {
        if (p.type === "medkit") {
          S.player.hp = Math.min(S.player.maxHp, S.player.hp + 35);
        } else {
          S.player.weapon = p.type;
          S.player.ammo = SURVIVAL_WEAPONS[p.type].ammo;
        }
        AudioFX.play("pickup");
        S.pickups.splice(i, 1);
        updateHud();
      }
    }

    // Explosive Fässer
    S.barrelTimer -= dt;
    if (S.barrelTimer <= 0) {
      S.barrelTimer = rand(9, 16);
      spawnBarrel();
    }

    // Bullets
    for (let i = S.bullets.length - 1; i >= 0; i--) {
      const b = S.bullets[i];
      b.x += b.vx * dt;
      b.y += b.vy * dt;
      b.life -= dt;
      if (b.life <= 0 || b.x < -20 || b.x > W + 20 || b.y < -20 || b.y > H + 20) {
        S.bullets.splice(i, 1);
      }
    }

    // Beams ausblenden
    for (let i = S.beams.length - 1; i >= 0; i--) {
      S.beams[i].life -= dt;
      if (S.beams[i].life <= 0) S.beams.splice(i, 1);
    }

    // Schockwellen
    for (let i = S.shocks.length - 1; i >= 0; i--) {
      const sh = S.shocks[i];
      sh.life -= dt;
      sh.r = sh.maxR * (1 - sh.life / sh.maxLife);
      if (sh.life <= 0) S.shocks.splice(i, 1);
    }

    updateZombies(dt);
    if (S.player.hp <= 0) return; // Tod wurde in updateZombies ausgelöst

    updateAcids(dt);
    if (S.player.hp <= 0) return;

    updateGuardians(dt);
    updateSoulBolts(dt);
    handleBulletHits();
    updateParticles(dt);
    updateHud();
  }

  function updateZombies(dt) {
    for (let i = S.zombies.length - 1; i >= 0; i--) {
      const z = S.zombies[i];
      z.wobble += dt * 6;
      z.walk += dt * (z.type === "runner" || z.type === "crawler" ? 13 : z.type === "brute" || z.type === "boss" ? 5 : 8);
      const a = Math.atan2(S.player.y - z.y, S.player.x - z.x);
      const d = Math.hypot(S.player.x - z.x, S.player.y - z.y);

      // Brennen (Flammenwerfer)
      if (z.burnT > 0) {
        z.burnT -= dt;
        z.hp -= 1.4 * dt;
        if (Math.random() < dt * 14) {
          S.particles.push({
            x: z.x + rand(-8, 8) * z.scale, y: z.y - rand(4, 26) * z.scale,
            vx: rand(-14, 14), vy: rand(-70, -30),
            r: rand(1.6, 3.4), life: rand(0.2, 0.45), maxLife: 0.45,
            color: "255, 150, 50",
          });
        }
        if (z.hp <= 0) {
          freeZombie(z);
          S.zombies.splice(i, 1);
          continue;
        }
      }

      // Bewegung je Typ
      if (z.type === "spitter") {
        // Hält Abstand und spuckt Säure
        let move = 0;
        if (d > 320) move = 1;
        else if (d < 190) move = -1;
        const strafe = Math.sin(z.wobble * 0.7) * 26;
        z.x += (Math.cos(a) * z.speed * move + Math.cos(a + Math.PI / 2) * strafe) * dt;
        z.y += (Math.sin(a) * z.speed * move + Math.sin(a + Math.PI / 2) * strafe) * dt;
        z.facing = Math.cos(a) >= 0 ? 1 : -1;

        z.spitT -= dt;
        if (z.spitT <= 0 && d < 430) {
          z.spitT = rand(2.2, 3.6) * (S.bloodMoon ? 0.7 : 1);
          const aa = a + rand(-0.07, 0.07);
          S.acids.push({
            x: z.x, y: z.y - 20 * z.scale,
            vx: Math.cos(aa) * 290, vy: Math.sin(aa) * 290,
            r: 6, life: 2.1,
          });
          AudioFX.play("spit");
        }
      } else if (z.type === "boss") {
        const wob = Math.sin(z.wobble) * 0.12;
        z.x += Math.cos(a + wob) * z.speed * dt;
        z.y += Math.sin(a + wob) * z.speed * dt;
        z.facing = Math.cos(a) >= 0 ? 1 : -1;

        // Bodenstampfer
        z.stompT -= dt;
        if (z.stompT <= 0 && d < 240) {
          z.stompT = rand(3.6, 4.6);
          S.shocks.push({ x: z.x, y: z.y, r: 0, maxR: 180, life: 0.55, maxLife: 0.55, color: "200,160,120" });
          S.shake = Math.min(12, S.shake + 9);
          AudioFX.play("stomp");
          if (d < 165) {
            S.player.hp -= 28;
            S.hurtFlash = Math.min(1, S.hurtFlash + 0.7);
          }
        }
      } else {
        const wob = Math.sin(z.wobble) * 0.4;
        z.x += Math.cos(a + wob) * z.speed * dt;
        z.y += Math.sin(a + wob) * z.speed * dt;
        z.facing = Math.cos(a) >= 0 ? 1 : -1;
      }

      if (z.hitFlash > 0) z.hitFlash -= dt;

      // Kontaktschaden
      const rr = z.r + S.player.r;
      if (dist2(z.x, z.y, S.player.x, S.player.y) < rr * rr) {
        S.player.hp -= z.dmg * dt;
        S.hurtFlash = Math.min(1, S.hurtFlash + dt * 3);
      }

      if (S.player.hp <= 0) {
        S.player.hp = 0;
        updateHud();
        AudioFX.play("hurt");
        if (Survival.onDeath) Survival.onDeath(S.kills, S.freedSeeds.slice(), S.wave);
        return;
      }
    }
  }

  function updateAcids(dt) {
    for (let i = S.acids.length - 1; i >= 0; i--) {
      const ac = S.acids[i];
      ac.x += ac.vx * dt;
      ac.y += ac.vy * dt;
      ac.life -= dt;
      if (Math.random() < dt * 16) {
        S.particles.push({
          x: ac.x, y: ac.y,
          vx: rand(-16, 16), vy: rand(-16, 16),
          r: rand(1.2, 2.4), life: rand(0.15, 0.35), maxLife: 0.35,
          color: "140, 220, 80",
        });
      }
      if (ac.life <= 0 || ac.x < -20 || ac.x > W + 20 || ac.y < -20 || ac.y > H + 20) {
        S.acids.splice(i, 1);
        continue;
      }
      if (dist2(ac.x, ac.y, S.player.x, S.player.y - 9) < (ac.r + S.player.r) ** 2) {
        S.player.hp -= 16;
        S.hurtFlash = Math.min(1, S.hurtFlash + 0.55);
        if (S.stains.length > 60) S.stains.shift();
        S.stains.push({ x: ac.x, y: ac.y, r: rand(8, 13), a: 0.3 });
        S.acids.splice(i, 1);
        AudioFX.play("hurt");
        if (S.player.hp <= 0) {
          S.player.hp = 0;
          updateHud();
          if (Survival.onDeath) Survival.onDeath(S.kills, S.freedSeeds.slice(), S.wave);
          return;
        }
      }
    }
  }

  // ---------- Seelenwacht ----------
  function updateGuardians(dt) {
    S.guardians.forEach((g, i) => {
      // Sanft um die Heldin schweben
      g.angle += dt * 0.55;
      const orbitionR = 70 + Math.sin(S.elapsed * 0.8 + g.bobPhase) * 8;
      const txp = S.player.x + Math.cos(g.angle + (i * Math.PI * 2) / Math.max(1, S.guardians.length)) * orbitionR;
      const typ = S.player.y + Math.sin(g.angle + (i * Math.PI * 2) / Math.max(1, S.guardians.length)) * orbitionR * 0.7;
      g.x += (txp - g.x) * Math.min(1, dt * 4);
      g.y += (typ - g.y) * Math.min(1, dt * 4);

      // Seelenblitz auf den nächsten Untoten
      g.fireT -= dt;
      if (g.fireT <= 0 && S.zombies.length > 0) {
        g.fireT = rand(2.4, 3.4);
        let best = null, bestD = 480 * 480;
        for (const z of S.zombies) {
          const dd = dist2(g.x, g.y, z.x, z.y);
          if (dd < bestD) { bestD = dd; best = z; }
        }
        if (best) {
          const a = Math.atan2(best.y - g.y, best.x - g.x);
          S.soulBolts.push({
            x: g.x, y: g.y - 30,
            vx: Math.cos(a) * 430, vy: Math.sin(a) * 430,
            r: 5, life: 1.5, dmg: 2,
          });
          AudioFX.play("bolt");
        }
      }
    });
  }

  function updateSoulBolts(dt) {
    for (let i = S.soulBolts.length - 1; i >= 0; i--) {
      const b = S.soulBolts[i];
      // Leichte Zielsuche
      let best = null, bestD = 240 * 240;
      for (const z of S.zombies) {
        const dd = dist2(b.x, b.y, z.x, z.y);
        if (dd < bestD) { bestD = dd; best = z; }
      }
      if (best) {
        const want = Math.atan2(best.y - b.y, best.x - b.x);
        const cur = Math.atan2(b.vy, b.vx);
        let diff = want - cur;
        while (diff > Math.PI) diff -= Math.PI * 2;
        while (diff < -Math.PI) diff += Math.PI * 2;
        const turn = Math.max(-3 * dt, Math.min(3 * dt, diff));
        const sp = Math.hypot(b.vx, b.vy);
        b.vx = Math.cos(cur + turn) * sp;
        b.vy = Math.sin(cur + turn) * sp;
      }
      b.x += b.vx * dt;
      b.y += b.vy * dt;
      b.life -= dt;
      if (Math.random() < dt * 22) {
        S.particles.push({
          x: b.x, y: b.y,
          vx: rand(-10, 10), vy: rand(-10, 10),
          r: rand(1, 2.2), life: rand(0.15, 0.35), maxLife: 0.35,
          color: "150, 230, 255",
        });
      }
      if (b.life <= 0) { S.soulBolts.splice(i, 1); continue; }

      for (let j = S.zombies.length - 1; j >= 0; j--) {
        const z = S.zombies[j];
        if (dist2(b.x, b.y, z.x, z.y) < (z.r + b.r) ** 2) {
          z.hp -= b.dmg;
          z.hitFlash = 0.1;
          S.soulBolts.splice(i, 1);
          spawnIchor(b.x, b.y, b.vx, b.vy);
          AudioFX.play("hit");
          if (z.hp <= 0) {
            freeZombie(z);
            S.zombies.splice(j, 1);
          }
          break;
        }
      }
    }
  }

  // ---------- Blitzlanze ----------
  function fireBeam(x, y, angle, weapon) {
    const range = 940;
    const dx = Math.cos(angle), dy = Math.sin(angle);
    const x2 = x + dx * range, y2 = y + dy * range;
    S.beams.push({ x1: x, y1: y, x2, y2, life: 0.18, maxLife: 0.18 });

    for (let j = S.zombies.length - 1; j >= 0; j--) {
      const z = S.zombies[j];
      const t = Math.max(0, Math.min(range, (z.x - x) * dx + (z.y - y) * dy));
      const px = x + dx * t, py = y + dy * t;
      if (dist2(px, py, z.x, z.y) < (z.r + 7) ** 2) {
        z.hp -= weapon.dmg;
        z.hitFlash = 0.12;
        spawnIchor(z.x, z.y, dx * 200, dy * 200);
        if (z.hp <= 0) {
          freeZombie(z);
          S.zombies.splice(j, 1);
        }
      }
    }
    // Fässer in der Schusslinie explodieren
    for (let j = S.barrels.length - 1; j >= 0; j--) {
      const br = S.barrels[j];
      const t = Math.max(0, Math.min(range, (br.x - x) * dx + (br.y - y) * dy));
      const px = x + dx * t, py = y + dy * t;
      if (dist2(px, py, br.x, br.y) < (br.r + 7) ** 2) {
        S.barrels.splice(j, 1);
        explodeBarrel(br);
      }
    }
  }

  // ---------- Treffer von Spieler-Geschossen ----------
  function handleBulletHits() {
    for (let i = S.bullets.length - 1; i >= 0; i--) {
      const b = S.bullets[i];
      let consumed = false;

      for (let j = S.zombies.length - 1; j >= 0; j--) {
        const z = S.zombies[j];
        const rr = z.r + b.r;
        if (dist2(b.x, b.y, z.x, z.y) < rr * rr) {
          z.hp -= b.dmg;
          z.hitFlash = 0.1;
          if (b.flame) z.burnT = Math.min(2.6, z.burnT + 1.6);
          S.bullets.splice(i, 1);
          consumed = true;
          if (b.flame) {
            S.particles.push({
              x: b.x, y: b.y, vx: rand(-20, 20), vy: rand(-40, -10),
              r: rand(2, 4), life: 0.3, maxLife: 0.3, color: "255, 160, 60",
            });
          } else {
            spawnIchor(b.x, b.y, b.vx, b.vy);
          }
          AudioFX.play("hit");
          if (z.hp <= 0) {
            freeZombie(z);
            S.zombies.splice(j, 1);
          }
          break;
        }
      }
      if (consumed) continue;

      // Fässer
      for (let j = S.barrels.length - 1; j >= 0; j--) {
        const br = S.barrels[j];
        if (dist2(b.x, b.y, br.x, br.y) < (br.r + b.r) ** 2) {
          br.hp -= b.dmg;
          S.bullets.splice(i, 1);
          S.particles.push({
            x: b.x, y: b.y, vx: rand(-60, 60), vy: rand(-60, 60),
            r: rand(1.5, 3), life: 0.2, maxLife: 0.2, color: "255, 200, 110",
          });
          if (br.hp <= 0) {
            S.barrels.splice(j, 1);
            explodeBarrel(br);
          }
          break;
        }
      }
    }
  }

  function explodeBarrel(br) {
    AudioFX.play("boom");
    S.shake = Math.min(14, S.shake + 10);
    S.shocks.push({ x: br.x, y: br.y, r: 0, maxR: 130, life: 0.45, maxLife: 0.45, color: "255,170,80" });

    // Brandschein-Fleck
    if (S.stains.length > 60) S.stains.shift();
    S.stains.push({ x: br.x, y: br.y, r: rand(22, 30), a: 0.4, scorch: true });

    for (let i = 0; i < 26; i++) {
      const a = rand(0, Math.PI * 2);
      const sp = rand(60, 320);
      S.particles.push({
        x: br.x, y: br.y,
        vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
        r: rand(2, 5), life: rand(0.25, 0.7), maxLife: 0.7,
        color: i % 3 === 0 ? "255, 220, 130" : "255, 140, 50",
      });
    }

    // Untote im Radius
    for (let j = S.zombies.length - 1; j >= 0; j--) {
      const z = S.zombies[j];
      const d2 = dist2(br.x, br.y, z.x, z.y);
      if (d2 < 130 * 130) {
        z.hp -= 10 * (1 - Math.sqrt(d2) / 150);
        z.burnT = Math.min(2.6, z.burnT + 1.4);
        z.hitFlash = 0.15;
        if (z.hp <= 0) {
          freeZombie(z);
          S.zombies.splice(j, 1);
        }
      }
    }
    // Spielerin im Radius
    if (dist2(br.x, br.y, S.player.x, S.player.y) < 95 * 95) {
      S.player.hp -= 24;
      S.hurtFlash = Math.min(1, S.hurtFlash + 0.7);
    }
    // Kettenreaktion
    for (let j = S.barrels.length - 1; j >= 0; j--) {
      const other = S.barrels[j];
      if (dist2(br.x, br.y, other.x, other.y) < 120 * 120) {
        S.barrels.splice(j, 1);
        explodeBarrel(other);
      }
    }
  }

  function spawnIchor(x, y, vx, vy) {
    for (let i = 0; i < 6; i++) {
      S.particles.push({
        x, y,
        vx: vx * 0.05 + rand(-60, 60),
        vy: vy * 0.05 + rand(-60, 60),
        r: rand(1.5, 3.5),
        life: rand(0.2, 0.5), maxLife: 0.5,
        color: "120, 180, 90",
      });
    }
  }

  function freeZombie(z) {
    // Blutmond: jede Untote trägt ZWEI gefangene Seelen.
    // Ein Koloss hält gleich VIER Seelen in seinem Inneren fest.
    let soulCount = 1;
    if (z.type === "boss") soulCount = 4;
    else if (S.bloodMoon) soulCount = 2;

    for (let k = 0; k < soulCount; k++) {
      const seed = k === 0 ? z.seed : ((z.seed ^ (0x9e3779b9 * (k + 1))) >>> 0) % 2 ** 31;
      S.kills++;
      S.freedSeeds.push(seed);
      S.souls.push({
        x: z.x + (k > 0 ? rand(-22, 22) : 0),
        y: z.y + (k > 0 ? rand(-14, 14) : 0),
        vy: -rand(38, 60),
        life: 1.8, maxLife: 1.8,
        hue: rand(160, 210),
        design: Characters.makeWoman(seed),
      });
    }

    if (S.stains.length > 60) S.stains.shift();
    S.stains.push({ x: z.x, y: z.y, r: z.r * rand(0.9, 1.4), a: 0.35 });

    // Der Koloss hinterlässt ein Geschenk
    if (z.type === "boss") {
      S.shake = Math.min(12, S.shake + 8);
      S.shocks.push({ x: z.x, y: z.y, r: 0, maxR: 160, life: 0.6, maxLife: 0.6, color: "180,230,255" });
      S.pickups.push({
        type: Math.random() < 0.5 ? "railgun" : "flamer",
        x: z.x, y: z.y, t: 14,
      });
    }

    const burstN = z.type === "boss" ? 34 : 14;
    for (let i = 0; i < burstN; i++) {
      const a = rand(0, Math.PI * 2);
      const sp = rand(40, z.type === "boss" ? 260 : 160);
      S.particles.push({
        x: z.x, y: z.y,
        vx: Math.cos(a) * sp,
        vy: Math.sin(a) * sp,
        r: rand(2, 4),
        life: rand(0.3, 0.7), maxLife: 0.7,
        color: "180, 230, 255",
      });
    }
    AudioFX.play("soul");
  }

  function updateParticles(dt) {
    for (let i = S.particles.length - 1; i >= 0; i--) {
      const p = S.particles[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vx *= 0.92;
      p.vy *= 0.92;
      p.life -= dt;
      if (p.life <= 0) S.particles.splice(i, 1);
    }
    for (let i = S.souls.length - 1; i >= 0; i--) {
      const s = S.souls[i];
      s.y += s.vy * dt;
      s.vy *= 0.99;
      s.life -= dt;
      if (s.life <= 0) S.souls.splice(i, 1);
    }
    for (const st of S.stains) {
      st.a = Math.max(0.08, st.a - dt * 0.01);
    }
  }

  function draw() { SurvivalRender.draw(); }

  return { reset, update, draw, onDeath: null };
})();
