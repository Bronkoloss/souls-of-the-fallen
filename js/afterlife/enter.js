"use strict";

const AfterlifeEnter = (() => {
  const C = AfterlifeConfig;
  const S = AfterlifeState;
  const rand = (a, b) => a + Math.random() * (b - a);
  const dist = (ax, ay, bx, by) => Math.hypot(ax - bx, ay - by);
  const pickFrom = (arr) => arr[(Math.random() * arr.length) | 0];

  const { inLake, isWalkable, tryMove, buildWorld } = AfterlifeWorld;
  const { friendshipPts, hearts, tier } = AfterlifeFriendship;
// ---------- Betreten ----------
  function enter(newSoulCount) {
    if (!S.inited) buildWorld();
    S.time = 0;
    S.emotes = [];
    S.fireSparks = [];
    S.prompt = null;
    S.dialogOpen = false;
    S.activeNpc = null;
    S.followerSeed = null;

    S.playerA = {
      x: C.SPAWN.x, y: C.SPAWN.y,
      walk: 0, facing: 1, moving: false, danceT: 0,
      // Die Spielerin erscheint im Jenseits ebenfalls als Frau
      d: Characters.makeWoman(0xA11CE),
    };

    // NPCs aus gespeicherten Seelen erschaffen
    S.npcs = [];
    const seeds = Save.data.souls.slice(0, 110);
    seeds.forEach((seed, i) => {
      const d = Characters.makeWoman(seed);
      const zone = C.HOME_ZONES[(seed >>> 4) % C.HOME_ZONES.length];
      let x = zone.x, y = zone.y;
      for (let tries = 0; tries < 50; tries++) {
        const a = Math.random() * Math.PI * 2;
        const dd = Math.sqrt(Math.random()) * zone.r;
        const tx = zone.x + Math.cos(a) * dd;
        const ty = zone.y + Math.sin(a) * dd;
        if (isWalkable(tx, ty)) { x = tx; y = ty; break; }
      }
      S.npcs.push({
        seed, d, x, y,
        homeX: x, homeY: y, homeR: Math.min(zone.r, 200),
        state: "idle", target: null,
        idleT: rand(0.5, 4),
        walk: rand(0, 6), facing: 1,
        danceT: 0, blushT: 0,
        emoteCd: rand(4, 16),
        cd: {},
        waveT: i === 0 ? 0 : -1,
      });
    });

    S.cam.x = Math.max(0, Math.min(C.WORLD.w - W, S.playerA.x - W / 2));
    S.cam.y = Math.max(0, Math.min(C.WORLD.h - H, S.playerA.y - H / 2));

    S.introT = 8;
    if (S.npcs.length === 0) {
      S.introText = "Das Jenseits ist still … Noch lebt hier niemand.\nBefreie Seelen im Diesseits — das Portal liegt im Norden.";
    } else if (newSoulCount > 0) {
      S.introText = `${newSoulCount} neue ${newSoulCount === 1 ? "Seele ist" : "Seelen sind"} angekommen!\nErkunde die Welt und lerne sie kennen.`;
    } else {
      S.introText = "Willkommen zurück im Jenseits.\nDie Geretteten haben dich schon vermisst.";
    }

    updateHud();
  }

  function updateHud() {
    const extra = Save.data.souls.length - S.npcs.length;
    hudSouls.textContent = S.npcs.length + (extra > 0 ? ` (+${extra})` : "");
    hudFlowers.textContent = "🌸 " + Save.data.flowers;
    let bf = 0;
    for (const n of S.npcs) if (hearts(n.seed) >= 5) bf++;
    hudFriends.textContent = "💕 " + bf;
  }
  return { enter, updateHud };
})();
