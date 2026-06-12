"use strict";

const AfterlifeDialog = (() => {
  const C = AfterlifeConfig;
  const S = AfterlifeState;
  const rand = (a, b) => a + Math.random() * (b - a);
  const dist = (ax, ay, bx, by) => Math.hypot(ax - bx, ay - by);
  const pickFrom = (arr) => arr[(Math.random() * arr.length) | 0];

  const { inLake, isWalkable, tryMove, buildWorld } = AfterlifeWorld;
  const { friendshipPts, hearts, tier } = AfterlifeFriendship;
  const { emote } = AfterlifeEmotes;
  const { updateHud } = AfterlifeEnter;
// ---------- Interaktion ----------
  function interact() {
    if (S.dialogOpen) return;
    if (!S.prompt) return;
    if (S.prompt.type === "portal") {
      AudioFX.play("portal");
      if (Afterlife.onPortal) Afterlife.onPortal();
    } else if (S.prompt.type === "npc") {
      openDialog(S.prompt.npc);
    }
  }

  function openDialog(npc) {
    S.dialogOpen = true;
    S.activeNpc = npc;
    npc.state = "idle";
    npc.idleT = rand(1, 3);
    const p = PERSONALITIES[npc.d.personality];
    const t = tier(npc.seed);
    setDialogText(pickFrom(p.greet[t]));
    Characters.drawPortrait(dialogPortrait, npc.d, S.time);
    dialogName.textContent = npc.d.name;
    dialogPersonality.textContent = `${p.emoji} ${p.label}`;
    renderHearts(npc);
    renderActions(npc);
    dialogPanel.classList.remove("hidden");
    AudioFX.play("talk");
  }

  function closeDialog() {
    if (!S.dialogOpen) return;
    S.dialogOpen = false;
    S.activeNpc = null;
    dialogPanel.classList.add("hidden");
  }

  function setDialogText(html) {
    dialogText.innerHTML = html;
  }

  function renderHearts(npc) {
    const h = hearts(npc.seed);
    dialogHearts.textContent = "❤".repeat(h) + "♡".repeat(5 - h);
  }

  function gainFriendship(npc, action, pts, cdSec) {
    const now = S.time;
    if (npc.cd[action] !== undefined && now < npc.cd[action]) {
      return { gained: 0, onCd: true };
    }
    npc.cd[action] = now + cdSec;
    const before = hearts(npc.seed);
    Save.data.friendship[npc.seed] = Math.min(30, friendshipPts(npc.seed) + pts);
    Save.write();
    const after = hearts(npc.seed);
    if (after > before) {
      emote(npc.x, npc.y - 60 * npc.d.scale, "💗", { size: 24 });
      AudioFX.play("heart");
    }
    renderHearts(npc);
    updateHud();
    return { gained: pts, levelUp: after > before, onCd: false };
  }

  function gainSuffix(res) {
    if (res.onCd) return ` <span class="gain">(${pickFrom(COOLDOWN_LINES)})</span>`;
    let s = ` <span class="gain">+${res.gained} ❤</span>`;
    if (res.levelUp) s += ` <span class="gain">— Eure Freundschaft wächst!</span>`;
    return s;
  }

  // --- Aktionen ---
  function actTalk(npc) {
    const p = PERSONALITIES[npc.d.personality];
    const t = tier(npc.seed);
    let line;
    if (t >= 1 && Math.random() < 0.28) {
      line = `Weißt du eigentlich, wer ich früher war? ${npc.d.backstory}`;
    } else {
      line = pickFrom(p.talk[t]);
    }
    const res = gainFriendship(npc, "talk", 1, 8);
    setDialogText(line + gainSuffix(res));
    emote(npc.x, npc.y - 56 * npc.d.scale, "💬", { size: 16 });
    AudioFX.play("talk");
  }

  function actJoke(npc) {
    const p = PERSONALITIES[npc.d.personality];
    const joke = pickFrom(JOKES);
    const reaction = pickFrom(p.jokeReact);
    const res = gainFriendship(npc, "joke", 2, 14);
    setDialogText(`<i>Du: „${joke}“</i><br/>${reaction}` + gainSuffix(res));
    emote(npc.x, npc.y - 60 * npc.d.scale, "😂", { size: 22 });
    AudioFX.play("laugh");
  }

  function actCompliment(npc) {
    const p = PERSONALITIES[npc.d.personality];
    const comp = pickFrom(COMPLIMENTS);
    const reaction = pickFrom(p.complimentReact);
    npc.blushT = 4;
    const res = gainFriendship(npc, "compliment", 2, 14);
    setDialogText(`<i>Du: „${comp}“</i><br/>${reaction}` + gainSuffix(res));
    emote(npc.x, npc.y - 60 * npc.d.scale, "💗", { size: 20 });
    AudioFX.play("heart");
  }

  function actDance(npc) {
    const p = PERSONALITIES[npc.d.personality];
    npc.danceT = 4.5;
    S.playerA.danceT = 4.5;
    const res = gainFriendship(npc, "dance", 3, 24);
    setDialogText(pickFrom(p.danceReact) + gainSuffix(res));
    emote(npc.x, npc.y - 60 * npc.d.scale, "💃", { size: 22 });
    AudioFX.play("dance");
  }

  function actGift(npc) {
    if (Save.data.flowers <= 0) return;
    Save.data.flowers--;
    const p = PERSONALITIES[npc.d.personality];
    npc.blushT = 3;
    const res = gainFriendship(npc, "gift", 4, 10);
    setDialogText(pickFrom(p.giftReact) + gainSuffix(res));
    emote(npc.x, npc.y - 62 * npc.d.scale, "🌸", { size: 20 });
    emote(npc.x, npc.y - 50 * npc.d.scale, "💗", { size: 16 });
    AudioFX.play("flower");
    updateHud();
    renderActions(npc);
  }

  function actFollow(npc) {
    if (S.followerSeed === npc.seed) {
      npc.state = "idle";
      npc.idleT = 1;
      npc.homeX = npc.x;
      npc.homeY = npc.y;
      setDialogText(pickFrom(WAIT_LINES));
    } else {
      S.followerSeed = npc.seed;
      setDialogText(pickFrom(FOLLOW_LINES));
      emote(npc.x, npc.y - 60 * npc.d.scale, "💕", { size: 20 });
    }
    AudioFX.play("blip");
    renderActions(npc);
  }

  function actSeduce(npc) {
    // Dialog schließen und ins Herzgespräch wechseln
    closeDialog();
    if (typeof startSeduction === "function") startSeduction(npc);
  }

  function renderActions(npc) {
    dialogActions.innerHTML = "";
    const mk = (label, fn, opts = {}) => {
      const b = document.createElement("button");
      b.className = "dialog-btn" + (opts.bye ? " bye" : "") + (opts.intimate ? " intimate" : "");
      b.textContent = label;
      b.disabled = !!opts.disabled;
      b.addEventListener("click", () => fn(npc));
      dialogActions.appendChild(b);
    };
    mk("💬 Reden", actTalk);
    mk("😄 Witz erzählen", actJoke);
    mk("🌹 Kompliment", actCompliment);
    mk("💃 Tanzen", actDance);
    mk(`🌸 Blume schenken (${Save.data.flowers})`, actGift, { disabled: Save.data.flowers <= 0 });
    if (hearts(npc.seed) >= 5) {
      mk(S.followerSeed === npc.seed ? "🛑 Warte hier" : "🚶‍♀️ Begleite mich", actFollow);
      // Beste Freundin freigeschaltet — Herzgespräch
      mk("💕 Herzgespräch …", actSeduce, { intimate: true });
    }
    mk("👋 Tschüss", () => closeDialog(), { bye: true });
  }
  return { interact, openDialog, closeDialog, setDialogText, renderHearts, renderActions, actTalk, actJoke, actCompliment, actDance, actGift, actFollow };
})();
