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
    S.freedSeeds = [];

    S.kills = 0;
    S.wave = 1;
    S.elapsed = 0;
    S.spawnTimer = 1.2;
    S.spawnInterval = 1.3;
    S.fireCooldown = 0;
    S.pickupTimer = rand(7, 11);
    S.shake = 0;
    S.hurtFlash = 0;
    S.waveBannerT = 0;

    buildDecor();
    updateHud();
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
    if (S.wave >= 3 && roll < 0.16 + S.wave * 0.01) return "runner";
    if (S.wave >= 4 && roll > 0.93 - S.wave * 0.008) return "brute";
    return "walker";
  }

  function spawnZombie() {
    const margin = 50;
    const edge = (Math.random() * 4) | 0;
    let x, y;
    if (edge === 0) { x = rand(0, W); y = -margin; }
    else if (edge === 1) { x = W + margin; y = rand(0, H); }
    else if (edge === 2) { x = rand(0, W); y = H + margin; }
    else { x = -margin; y = rand(0, H); }

    const tier = Math.min(S.wave, 9);
    const type = zombieTypeForWave();
    let z;
    if (type === "runner") {
      z = { r: 12, scale: 0.8, speed: rand(125, 155) + tier * 3, hp: 1 + (tier / 3 | 0), dmg: 16 };
    } else if (type === "brute") {
      z = { r: 22, scale: 1.45, speed: rand(36, 46), hp: 8 + tier, dmg: 44 };
    } else {
      z = { r: 15, scale: 1, speed: rand(55, 80) + tier * 4, hp: 2 + (tier / 2 | 0), dmg: 22 };
    }
    S.zombies.push({
      x, y, type, ...z,
      maxHp: z.hp,
      hitFlash: 0,
      wobble: rand(0, Math.PI * 2),
      walk: rand(0, Math.PI * 2),
      seed: (Math.random() * 2 ** 31) | 0,
      facing: 1,
    });
  }

  function spawnPickup() {
    const roll = Math.random();
    const type = roll < 0.45 ? "medkit" : roll < 0.75 ? "shotgun" : "mg";
    S.pickups.push({
      type,
      x: rand(90, W - 90),
      y: rand(110, H - 90),
      t: 14,
    });
  }

  // ---------- Update ----------
  function update(dt) {
    S.elapsed += dt;
    S.shake = Math.max(0, S.shake - dt * 30);
    S.hurtFlash = Math.max(0, S.hurtFlash - dt * 1.6);
    S.waveBannerT = Math.max(0, S.waveBannerT - dt);

    const newWave = 1 + Math.floor(S.elapsed / 18);
    if (newWave !== S.wave) {
      S.wave = newWave;
      S.spawnInterval = Math.max(0.26, 1.3 - (S.wave - 1) * 0.11);
      S.waveBannerT = 2.2;
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
      for (let p = 0; p < weapon.pellets; p++) {
        const a = S.player.angle + rand(-weapon.spread, weapon.spread);
        S.bullets.push({
          x: muzzle.x, y: muzzle.y,
          vx: Math.cos(a) * weapon.speed,
          vy: Math.sin(a) * weapon.speed,
          r: 4, life: 1.2,
        });
      }
      for (let i = 0; i < 4; i++) {
        const a = S.player.angle + rand(-0.3, 0.3);
        S.particles.push({
          x: muzzle.x, y: muzzle.y,
          vx: Math.cos(a) * rand(60, 200),
          vy: Math.sin(a) * rand(60, 200),
          r: rand(1.5, 3), life: rand(0.08, 0.22), maxLife: 0.22,
          color: "255, 220, 120",
        });
      }
      S.shake = Math.min(6, S.shake + (S.player.weapon === "shotgun" ? 4 : 1.2));
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

    // Zombies
    for (let i = S.zombies.length - 1; i >= 0; i--) {
      const z = S.zombies[i];
      z.wobble += dt * 6;
      z.walk += dt * (z.type === "runner" ? 13 : z.type === "brute" ? 5 : 8);
      const a = Math.atan2(S.player.y - z.y, S.player.x - z.x);
      const wob = Math.sin(z.wobble) * 0.4;
      z.x += Math.cos(a + wob) * z.speed * dt;
      z.y += Math.sin(a + wob) * z.speed * dt;
      z.facing = Math.cos(a) >= 0 ? 1 : -1;
      if (z.hitFlash > 0) z.hitFlash -= dt;

      const rr = z.r + S.player.r;
      if (dist2(z.x, z.y, S.player.x, S.player.y) < rr * rr) {
        S.player.hp -= z.dmg * dt;
        S.hurtFlash = Math.min(1, S.hurtFlash + dt * 3);
        if (S.player.hp <= 0) {
          S.player.hp = 0;
          updateHud();
          AudioFX.play("hurt");
          if (Survival.onDeath) Survival.onDeath(S.kills, S.freedSeeds.slice(), S.wave);
          return;
        }
      }
    }

    // Bullet vs Zombie
    for (let i = S.bullets.length - 1; i >= 0; i--) {
      const b = S.bullets[i];
      for (let j = S.zombies.length - 1; j >= 0; j--) {
        const z = S.zombies[j];
        const rr = z.r + b.r;
        if (dist2(b.x, b.y, z.x, z.y) < rr * rr) {
          z.hp -= 1;
          z.hitFlash = 0.1;
          S.bullets.splice(i, 1);
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

    updateParticles(dt);
    updateHud();
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
    S.kills++;
    S.freedSeeds.push(z.seed);

    if (S.stains.length > 60) S.stains.shift();
    S.stains.push({ x: z.x, y: z.y, r: z.r * rand(0.9, 1.4), a: 0.35 });

    S.souls.push({
      x: z.x, y: z.y,
      vy: -rand(38, 60),
      life: 1.8, maxLife: 1.8,
      hue: rand(160, 210),
      design: Characters.makeWoman(z.seed),
    });
    for (let i = 0; i < 14; i++) {
      const a = rand(0, Math.PI * 2);
      const sp = rand(40, 160);
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
