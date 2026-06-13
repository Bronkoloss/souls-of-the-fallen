"use strict";

/* ------------------------------------------------------------------
   Intimate — das "Herzgespräch" und die privaten Szenen (Kino-Modus).

   ABLAUF
     1. startSeduction(npc) öffnet den Kino-Modus: Letterbox-Balken,
        Vignette, Kamera-Zoom auf das Paar, HUD blendet aus.
     2. Das Gespräch läuft über STAGES (s.u.). Jede Antwort verändert
        die Spannung (Push & Pull). Beim Finale einer Stage geht es
        per weichem Fade in die nächste Stage (z.B. ins Haus).
     3. Nach der letzten Stage: Fade-to-Black, Abspann, Belohnung.

   ============================================================
   ERWEITERUNGS-ARCHITEKTUR (Grundlage für eigene Inhalte)
   ============================================================

   STAGES — die Szenenfolge des Herzgesprächs.
     Eine Stage ist ein Objekt:
       {
         id:       "zuhause",            // frei wählbar
         scene:    "world" | "interior", // world  = Jenseits-Karte bleibt sichtbar
                                          // interior = eigener Vollbild-Renderer (App-State HOUSE)
         beats:    () => [...],          // Beat-Array (Struktur wie Seduction.BEATS):
                                          //   { line, choices: [{ text, reply, heat, tone, fade }] }
                                          //   fade:true im letzten Beat => Übergang zur nächsten
                                          //   Stage bzw. zum Abspann
         maturity: 0,                     // Mindest-Reifegrad (s.u.) — Stage wird sonst übersprungen
         draw:     (ctx, st, R) => {},    // optional: eigener Szenen-Renderer für "interior".
                                          // R = Render-Helfer (R.drawCandle, R.roomBase, …)
       }
     Eigene Stages einfügen:
       AfterlifeIntimate.registerStage(stage)          // ans Ende (vor Abspann)
       AfterlifeIntimate.registerStage(stage, index)   // an Position index

   REIFEGRAD (maturity) — inhaltliche Eskalationsstufen.
     Save.data.maturity (Standard 0) bestimmt, welche Stages aktiv sind.
     Stufe 0 = andeutend/atmosphärisch (alles, was das Spiel mitliefert).
     Höhere Stufen sind bewusst NICHT enthalten — wer eigene, explizitere
     Stages ergänzen will, registriert sie mit maturity >= 1 und hebt
     Save.data.maturity an. So bleibt Standard-Inhalt unberührt.

   HOOKS — Eingriffspunkte ohne Engine-Änderung:
     AfterlifeIntimate.hooks.onStageEnter = (stage, st) => {}
     AfterlifeIntimate.hooks.onBeat       = (beat, st) => {}
     AfterlifeIntimate.hooks.onChoice     = (choice, st) => {}
     AfterlifeIntimate.hooks.onClimax     = (st) => {}      // direkt vor dem Abspann
     AfterlifeIntimate.hooks.onFinish     = (npc) => {}     // nach dem Abspann
     AfterlifeIntimate.hooks.drawOverlay  = (ctx, st) => {} // zeichnet über jede Interior-Szene

   st (der Laufzeit-Zustand) enthält u.a.: npc, stageIdx, tension (0–100),
   peak, sceneT (Sekunden in aktueller Szene), afterglow.

   Ton & Stil der mitgelieferten Inhalte: bewusst andeutend —
   Spannung durch Stimmung, Worte und Licht, nicht durch Explizites.
------------------------------------------------------------------ */

const AfterlifeIntimate = (() => {
  const S = AfterlifeState;
  const pickFrom = (arr) => arr[(Math.random() * arr.length) | 0];

  // ---------- Innenraum-Szene: knisternde Fortsetzung ----------
  // Beats für DRINNEN. Gleiche Struktur wie Seduction.BEATS.
  const HOUSE_BEATS = [
    {
      line: {
        default: "Die Tür fällt hinter euch ins Schloss. Drinnen ist es warm, der Kamin wirft tanzendes Licht an die Wände. Sie dreht sich zu dir um, und in ihrem Blick liegt alles, was draußen nur angedeutet war.",
        frech: "Kaum ist die Tür zu, drückt sie dich mit dem Rücken dagegen und stützt eine Hand neben deinem Kopf ab. „So“, raunt sie, das Kaminlicht in den Augen. „Jetzt gibt's kein Publikum mehr. Nur dich und mich.“",
        schuechtern: "Drinnen, im weichen Schein der Kerzen, wird sie auf einmal ganz still. Dann nimmt sie all ihren Mut zusammen, tritt dicht an dich heran und flüstert: „Ich hab das Licht extra warm gemacht. Für uns.“",
        vertraeumt: "Der Raum schwimmt in goldenem Licht, als hätte jemand den Sonnenuntergang eingefangen. Sie zieht dich in die Mitte, ihre Finger mit deinen verschränkt. „Hier“, haucht sie, „hier sind wir ganz allein mit der Zeit.“",
      },
      choices: [
        { text: "Sie an dich ziehen und den Kuss von draußen fortsetzen.", tone: "push", heat: +20,
          reply: "Der Kuss entzündet sich sofort wieder, heißer als zuvor. Ihre Hände finden deinen Nacken, deinen Rücken, ziehen dich näher, als ginge es nicht nah genug." },
        { text: "Ihr langsam die Strähnen aus dem Gesicht streichen und sie ansehen.", tone: "tease", heat: +10,
          reply: "Du nimmst dir Zeit, fährst mit dem Daumen über ihre Wange, ihren Kiefer. Sie zittert unter der Zärtlichkeit. „Wenn du das machst“, flüstert sie, „verliere ich völlig den Verstand.“" },
        { text: "„Warte. Lass mich diesen Anblick kurz festhalten.“", tone: "pull", heat: -6,
          reply: "Sie hält inne, leicht außer Atem, das Haar zerzaust vom Wind draußen. „Du machst mich nervös, wenn du mich so ansiehst“, gesteht sie — und kommt trotzdem näher." },
      ],
    },
    {
      line: {
        default: "Sie zieht dich zum Sofa vor dem Kamin, ohne den Blickkontakt zu lösen. Ihre Finger spielen mit dem Saum deines Kragens. „Ich hab so lange davon geträumt, dich endlich für mich zu haben“, murmelt sie an deinem Hals.",
        frech: "Sie schiebt dich rückwärts aufs Sofa und lässt sich neben dir nieder, ein Bein über deins geschlagen. „Beschwer dich nachher nicht, dass ich dich gewarnt hätte“, grinst sie und beißt sich auf die Unterlippe.",
        energisch: "„Ich hab keine Geduld mehr“, lacht sie atemlos und zieht dich mit sich aufs Sofa, ihr Herz schlägt so laut, dass du es fast hören kannst. „Den ganzen Tag hab ich an nichts anderes gedacht.“",
        weise: "Sie führt dich zum Sofa und lässt sich anmutig nieder, zieht dich neben sich. „Wir haben alle Zeit der Welt“, sagt sie mit rauchiger Stimme, „und trotzdem will ich keine Sekunde davon verschwenden.“",
      },
      choices: [
        { text: "Ihren Hals küssen und ihr Flüstern an deinem Ohr genießen.", tone: "push", heat: +22,
          reply: "Du folgst der Linie ihres Halses mit langsamen Küssen. Sie krallt die Finger in deine Schulter und gibt einen Laut von sich, der dir durch Mark und Bein geht. „Ja … genau so …“" },
        { text: "Ihr ins Ohr flüstern, wie sehr du sie willst.", tone: "push", heat: +18,
          reply: "Deine Worte lassen sie erschauern. Sie lehnt sich zurück, zieht dich mit, und ihr Atem geht schwer. „Mehr“, verlangt sie leise. „Sag mir mehr.“" },
        { text: "Kurz innehalten und ihr in die Augen sehen, bevor es weitergeht.", tone: "pull", heat: -8,
          reply: "Ihr verharrt einen Atemzug lang, Stirn an Stirn, beide brennend vor Erwartung. In dieser kleinen Pause liegt mehr Spannung als in jeder Berührung. Dann lächelt sie. „Okay. Genug gewartet.“" },
      ],
    },
    {
      line: {
        default: "Das Kaminlicht malt warme Schatten über ihre Haut. Sie zieht dich enger an sich, ihre Lippen wandern zu deinem Ohr. „Bleib heute Nacht“, flüstert sie atemlos. „Lass uns einfach … verschwinden.“",
        frech: "Sie lacht leise und dunkel, zieht dich über sich. „Letzte Chance umzukehren“, neckt sie — aber ihre Arme um deinen Rücken sagen etwas ganz anderes. „… die du natürlich nicht nutzt.“",
        schuechtern: "Sie ist mutiger geworden, ihre Hände wandern über deinen Rücken. „Ich will dir so nah sein wie nur möglich“, haucht sie, rot und strahlend zugleich. „Zeig mir, wie sich das anfühlt.“",
        vertraeumt: "Die ganze Welt ist auf diesen einen, warmen Raum geschrumpft. „Ich will in diesem Moment für immer bleiben“, flüstert sie an deinen Lippen, während ihre Finger sich in deinem Haar verlieren.",
      },
      choices: [
        { text: "„Ich gehe nirgendwohin. Die ganze Nacht gehört uns.“", tone: "push", heat: +24, fade: true,
          reply: "" },
        { text: "Sie ein letztes Mal langsam und tief küssen.", tone: "push", heat: +24, fade: true,
          reply: "" },
      ],
    },
  ];

  // ---------- Abspann-Zeilen (nach dem Fade) ----------
  const AFTERGLOW = {
    default: "Später. Das Feuer ist zu Glut heruntergebrannt. Ihr liegt eng beieinander, ihr Kopf an deiner Brust, ihr Finger zeichnet faule Kreise auf deine Haut. „Das“, flüstert sie verschlafen und glücklich, „war jede Sekunde des Wartens wert.“",
    frech: "Später, atemlos und grinsend, liegt sie halb auf dir. „Okay, zugegeben“, schnurrt sie, „du bist deutlich besser, als deine Witze vermuten lassen.“ Sie küsst dich auf die Schulter. „Viel besser.“",
    schuechtern: "Später, im sanften Glutschein, ist von ihrer Schüchternheit nichts mehr übrig — nur ein zufriedenes, verträumtes Lächeln. „Ich war so nervös“, gesteht sie leise. „Und jetzt will ich nie wieder woanders sein als hier.“",
    vertraeumt: "Später treibt ihr beide in jener warmen Stille zwischen Wachen und Träumen. „Wenn das ein Traum ist“, murmelt sie an deinem Hals, „dann will ich nie wieder aufwachen.“",
  };

  // ================= Stages =================
  const STAGES = [
    { id: "funke", scene: "world", maturity: 0, beats: () => Seduction.BEATS },
    { id: "zuhause", scene: "interior", maturity: 0, beats: () => HOUSE_BEATS, draw: null },
  ];

  const hooks = {
    onStageEnter: null,
    onBeat: null,
    onChoice: null,
    onClimax: null,
    onFinish: null,
    drawOverlay: null,
  };

  function maturityLevel() { return Save.data.maturity || 0; }

  function registerStage(stage, atIndex) {
    if (atIndex == null) STAGES.push(stage);
    else STAGES.splice(Math.max(0, Math.min(STAGES.length, atIndex)), 0, stage);
  }

  function resolveBeats(stage) {
    return typeof stage.beats === "function" ? stage.beats() : stage.beats;
  }

  // ================= Engine-Zustand =================
  let st = null;
  let cineT = 0; // 0..1 — weiches Ein-/Ausblenden der Kino-Elemente (Zoom etc.)

  function active() { return !!st; }
  function cinema() { return !!st || cineT > 0.02; }
  function inHouseScene() { return !!st && currentStage() && currentStage().scene === "interior"; }
  function currentStage() { return st ? st.stages[st.stageIdx] : null; }
  function npc() { return st ? st.npc : null; }

  // ---------- Start ----------
  function start(theNpc) {
    st = {
      npc: theNpc,
      stages: STAGES.filter((s) => (s.maturity || 0) <= maturityLevel()),
      stageIdx: 0,
      beats: null,
      idx: 0,
      tension: 12,
      peak: 12,
      fade: 0,                // 0..1 Überblendung
      fadeDir: 0,             // +1 ausblenden, -1 einblenden
      pending: null,          // "stage" | "afterglow"
      afterglow: false,
      sceneT: 0,              // Zeit in der aktuellen Szene
      crackleT: 0.4,          // Kamin-Ambience-Timer
      beatT: 0.5,             // Herzschlag-Sound-Timer
    };
    st.beats = resolveBeats(st.stages[0]);
    setCinema(true);
    renderHead();
    renderBeat(st.beats[0], { firstLine: true });
    showPanel();
    if (hooks.onStageEnter) hooks.onStageEnter(st.stages[0], st);
    AudioFX.play("heart");
  }

  // ---------- Spieler wählt eine Antwort ----------
  function choose(choice) {
    if (!st) return;

    st.tension = Math.max(4, Math.min(100, st.tension + (choice.heat || 0)));
    st.peak = Math.max(st.peak, st.tension);

    if (choice.tone === "pull") AudioFX.play("blip");
    else if (choice.tone === "tease") AudioFX.play("talk");
    else AudioFX.play("heart");

    if (hooks.onChoice) hooks.onChoice(choice, st);

    // enter (Alt-Format) und fade lösen beide den Stage-Übergang aus
    if (choice.enter || choice.fade) {
      st.npc.blushT = 5;
      beginAdvance();
      return;
    }

    const d = st.npc.d;
    const reply = choice.reply ? Seduction.flavor(choice.reply, d) : "";
    advanceBeat(reply);
  }

  function advanceBeat(replyText) {
    const nextIdx = st.idx + 1;
    if (nextIdx >= st.beats.length) {
      // Sicherheitsnetz: Beats erschöpft -> weiter zur nächsten Stage
      renderReplyThen(replyText, () => beginAdvance());
      return;
    }
    st.idx = nextIdx;
    st._lastReply = replyText || "";
    renderBeat(st.beats[nextIdx]);
  }

  // ---------- Stage-Übergang ----------
  function beginAdvance() {
    hidePanel();
    st.fadeDir = 1;
    st.fade = Math.max(0, st.fade);
    st.pending = st.stageIdx + 1 < st.stages.length ? "stage" : "afterglow";
    AudioFX.play("swell");
  }

  function onFadedOut() {
    if (st.pending === "stage") {
      st.stageIdx++;
      const stage = st.stages[st.stageIdx];
      st.beats = resolveBeats(stage);
      st.idx = 0;
      st.sceneT = 0;
      st.pending = null;
      st.fadeDir = -1;
      if (stage.scene === "interior") {
        if (typeof enterHouseScene === "function") enterHouseScene();
      } else {
        if (typeof exitHouseScene === "function") exitHouseScene();
      }
      if (hooks.onStageEnter) hooks.onStageEnter(stage, st);
      renderBeat(st.beats[0], { firstLine: true });
      showPanel();
    } else if (st.pending === "afterglow") {
      st.afterglow = true;
      st.pending = null;
      grantReward();
      if (hooks.onClimax) hooks.onClimax(st);
      showAfterglow();
    }
  }

  // ---------- Update (Fades, Ambience) ----------
  function update(dt) {
    if (!st) return;
    st.sceneT += dt;

    if (st.fadeDir !== 0) {
      st.fade += dt * st.fadeDir * 1.3;
      if (st.fade >= 1) {
        st.fade = 1;
        st.fadeDir = 0;
        onFadedOut();
      } else if (st.fade <= 0) {
        st.fade = 0;
        st.fadeDir = 0;
      }
    }

    // Kamin-Knistern in Innenräumen
    const stage = currentStage();
    if (stage && stage.scene === "interior" && !st.afterglow) {
      st.crackleT -= dt;
      if (st.crackleT <= 0) {
        st.crackleT = 0.22 + Math.random() * 0.55;
        AudioFX.play("crackle");
      }
    }

    // Hörbarer Herzschlag bei hoher Spannung
    if (!st.afterglow && st.tension >= 55) {
      st.beatT -= dt;
      if (st.beatT <= 0) {
        st.beatT = 1.55 - (st.tension / 100) * 0.85;
        AudioFX.play("heartbeat");
      }
    }
  }

  // Läuft JEDEN Frame (auch ohne aktives Gespräch): weicher Kino-Ausklang.
  function ambient(dt) {
    const target = st ? 1 : 0;
    cineT += (target - cineT) * Math.min(1, dt * 1.8);
    if (Math.abs(target - cineT) < 0.004) cineT = target;
    updateGlowVars();
  }

  function zoom() { return 1 + cineT * 0.15; }

  // Kamera-Fokus: Mittelpunkt zwischen Spielerin und NPC, leicht nach
  // unten versetzt, damit das Paar über dem Panel steht.
  function focusPoint() {
    if (!st || !st.npc) return null;
    return {
      x: (S.playerA.x + st.npc.x) / 2,
      y: (S.playerA.y + st.npc.y) / 2 + 78,
    };
  }

  // ---------- Spannungs-reaktive CSS-Variablen ----------
  function updateGlowVars() {
    const f = st ? st.tension / 100 : 0;
    // Farbverlauf: zartes Rosé -> tiefes, sattes Rot
    const r = Math.round(240 + f * 15);
    const g = Math.round(166 - f * 121);
    const b = Math.round(192 - f * 82);
    const a = 0.22 + f * 0.34;
    gameWrapper.style.setProperty("--glow", `rgba(${r},${g},${b},${a.toFixed(2)})`);
    gameWrapper.style.setProperty("--glow-soft", `rgba(${r},${g},${b},${(a * 0.45).toFixed(2)})`);
    gameWrapper.style.setProperty("--beat", `${(1.7 - f * 0.95).toFixed(2)}s`);
  }

  function setCinema(on) {
    gameWrapper.classList.toggle("cinema-on", on);
  }

  // ---------- Kino-Overlay über der Jenseits-Welt ----------
  function worldToScreen(wx, wy) {
    const z = zoom();
    return {
      x: (wx - S.cam.x - W / 2) * z + W / 2,
      y: (wy - S.cam.y - H / 2) * z + H / 2,
    };
  }

  function drawCinematics() {
    if (!cinema()) return;
    const t = S.time;

    if (st && st.npc && !st.afterglow) {
      const f = st.tension / 100;
      const mid = {
        x: (S.playerA.x + st.npc.x) / 2,
        y: (S.playerA.y + st.npc.y) / 2,
      };
      const p = worldToScreen(mid.x, mid.y);

      // Warmes Leuchten um das Paar — wächst und pulsiert mit der Spannung
      const pulse = 1 + Math.sin(t * (2 + f * 4)) * 0.06 * (0.3 + f);
      const radius = (130 + f * 70) * pulse * cineT;
      const glow = ctx.createRadialGradient(p.x, p.y - 24, 8, p.x, p.y - 24, radius);
      glow.addColorStop(0, `rgba(255,${Math.round(170 - f * 90)},${Math.round(170 - f * 60)},${(0.13 + f * 0.13) * cineT})`);
      glow.addColorStop(1, "rgba(255,120,140,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, W, H);

      // Aufsteigende Glut-Funken & Herzchen um das Paar
      for (let i = 0; i < 18; i++) {
        const cycle = (t * (0.16 + (i % 5) * 0.035) + i * 0.61) % 1;
        const wx = mid.x + Math.sin(i * 2.13 + t * 0.5) * (40 + (i % 4) * 16);
        const wy = mid.y + 14 - cycle * 150;
        const sp = worldToScreen(wx, wy);
        const a = Math.sin(cycle * Math.PI) * (0.22 + f * 0.3) * cineT;
        if (a <= 0.01) continue;
        ctx.globalAlpha = a;
        if (i % 4 === 0 && f > 0.35) {
          ctx.fillStyle = "#ff9bb5";
          ctx.font = "12px serif";
          ctx.fillText("♥", sp.x, sp.y);
        } else {
          ctx.fillStyle = i % 2 ? "#ffd9a0" : "#ffaf9b";
          ctx.beginPath();
          ctx.arc(sp.x, sp.y, 1.6 + (i % 3) * 0.6, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1;
      }

      // Herzschlag-Puls am Bildrand bei hoher Spannung
      if (f > 0.5) {
        const beatA = (f - 0.5) * 2 * (0.05 + 0.045 * Math.sin(t * (4 + f * 4)));
        const edge = ctx.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.34, W / 2, H / 2, Math.max(W, H) * 0.7);
        edge.addColorStop(0, "rgba(255,30,80,0)");
        edge.addColorStop(1, `rgba(200,10,60,${Math.max(0, beatA) * cineT})`);
        ctx.fillStyle = edge;
        ctx.fillRect(0, 0, W, H);
      }
    }

    // Fade-Überblendung
    if (st && st.fade > 0) {
      ctx.fillStyle = `rgba(0,0,0,${st.fade})`;
      ctx.fillRect(0, 0, W, H);
    }
  }

  // Alt-Name (Kompatibilität)
  const drawFadeOverlay = drawCinematics;

  // ---------- Belohnung ----------
  function grantReward() {
    const theNpc = st.npc;
    if (!Save.data.intimate) Save.data.intimate = {};
    Save.data.intimate[theNpc.seed] = (Save.data.intimate[theNpc.seed] || 0) + 1;
    Save.data.friendship[theNpc.seed] = Math.min(30, (Save.data.friendship[theNpc.seed] || 0) + 3);
    Save.write();
  }

  // ---------- DOM / Panel ----------
  function showPanel() { intimatePanel.classList.remove("hidden"); }
  function hidePanel() { intimatePanel.classList.add("hidden"); }

  function tensionLabel(v) {
    if (v < 25) return "ein zartes Knistern";
    if (v < 45) return "spürbare Spannung";
    if (v < 65) return "heiße Erwartung";
    if (v < 85) return "kaum auszuhalten";
    return "atemlos";
  }

  function renderHead() {
    const d = st.npc.d;
    Characters.drawPortrait(intimatePortrait, d, S.time);
    intimateName.textContent = d.name;
    const p = PERSONALITIES[d.personality];
    intimateMood.textContent = p ? `${p.emoji} ${p.label}` : "";
  }

  function renderBeat(beat, opts = {}) {
    const d = st.npc.d;
    const lineHtml = `<span class="seduce-line">${Seduction.flavor(beat.line, d)}</span>`;
    if (opts.firstLine) {
      intimateText.innerHTML = lineHtml;
    } else {
      intimateText.innerHTML =
        (st._lastReply ? `<span class="seduce-reply">${st._lastReply}</span>` : "") + lineHtml;
    }
    // Text-Einblendung neu anstoßen
    intimateText.classList.remove("reveal");
    void intimateText.offsetWidth;
    intimateText.classList.add("reveal");

    Characters.drawPortrait(intimatePortrait, d, S.time);
    renderTension();
    renderChoices(beat);
    if (hooks.onBeat) hooks.onBeat(beat, st);
  }

  function renderReplyThen(text, cb) {
    st._lastReply = text || "";
    intimateText.innerHTML = `<span class="seduce-reply">${st._lastReply}</span>`;
    intimateText.classList.remove("reveal");
    void intimateText.offsetWidth;
    intimateText.classList.add("reveal");
    renderTension();
    intimateChoices.innerHTML = "";
    setTimeout(cb, 700);
  }

  function renderTension() {
    const v = st.tension;
    intimateMeterFill.style.width = Math.min(100, v) + "%";
    intimateMeterLabel.textContent = tensionLabel(v);
    updateGlowVars();
  }

  function renderChoices(beat) {
    intimateChoices.innerHTML = "";
    beat.choices.forEach((ch, i) => {
      const b = document.createElement("button");
      b.className = "seduce-btn" + (ch.tone === "pull" ? " pull" : ch.tone === "tease" ? " tease" : "");
      b.innerHTML = ch.text;
      b.style.animationDelay = `${0.18 + i * 0.1}s`;
      b.addEventListener("click", () => choose(ch));
      intimateChoices.appendChild(b);
    });
    // Notausstieg
    const bye = document.createElement("button");
    bye.className = "seduce-btn bye";
    bye.textContent = "… vielleicht ein andermal";
    bye.style.animationDelay = `${0.18 + beat.choices.length * 0.1 + 0.1}s`;
    bye.addEventListener("click", () => abort());
    intimateChoices.appendChild(bye);
  }

  function showAfterglow() {
    const d = st.npc.d;
    let heartsHtml = "";
    for (let i = 0; i < 11; i++) {
      heartsHtml += `<span style="left:${(4 + i * 8.7).toFixed(1)}%;animation-delay:${(i * 0.83).toFixed(2)}s;font-size:${13 + (i % 3) * 5}px">♥</span>`;
    }
    intimateAfterglow.innerHTML =
      `<div class="afterglow-hearts">${heartsHtml}</div>` +
      `<p class="afterglow-text">${Seduction.flavor(AFTERGLOW, d)}</p>` +
      `<p class="afterglow-reward">💕 Eine Nacht, die ihr beide nie vergesst. <span>+3 ❤ &amp; eine Erinnerung fürs Leben.</span></p>` +
      `<button id="afterglow-close" class="seduce-btn">Den Morgen begrüßen ☀️</button>`;
    intimateAfterglow.classList.remove("hidden");
    document.getElementById("afterglow-close").addEventListener("click", () => finish());
    AudioFX.play("heart");
  }

  // ---------- Ende / Abbruch ----------
  function abort() {
    cleanup();
    if (typeof exitHouseScene === "function") exitHouseScene();
  }

  function finish() {
    const theNpc = st ? st.npc : null;
    cleanup();
    if (typeof exitHouseScene === "function") exitHouseScene();
    if (theNpc) {
      AfterlifeEmotes.emote(theNpc.x, theNpc.y - 60 * theNpc.d.scale, "💖", { size: 26 });
      if (hooks.onFinish) hooks.onFinish(theNpc);
    }
  }

  function cleanup() {
    hidePanel();
    intimateAfterglow.classList.add("hidden");
    intimateAfterglow.innerHTML = "";
    setCinema(false);
    st = null;
  }

  /* ==================================================================
     Interior-Renderer — "Ihr Zuhause"
     Vollständig prozedural: Kamin, Mondfenster, Lichterkette, Bett,
     Wein, Blumen — und ein Paar Silhouetten, die mit der Spannung
     näher zusammenrücken. Eigene Stages können diesen Look über die
     exportierten Helfer (RenderHelpers) wiederverwenden.
     ================================================================== */

  function drawStageScene() {
    const stage = currentStage();
    if (stage && typeof stage.draw === "function") {
      stage.draw(ctx, st, RenderHelpers);
    } else {
      drawDefaultInterior();
    }
    if (hooks.drawOverlay) hooks.drawOverlay(ctx, st);

    // Fade-Überblendung zuletzt
    if (st && st.fade > 0) {
      ctx.fillStyle = `rgba(0,0,0,${st.fade})`;
      ctx.fillRect(0, 0, W, H);
    }
  }

  function drawDefaultInterior() {
    const t = st ? st.sceneT : 0;
    const tn = st ? st.tension / 100 : 0.3;
    const afterglow = st ? st.afterglow : false;
    const floorY = H * 0.68;
    const flick = 0.82 + Math.sin(t * 8.7) * 0.1 + Math.sin(t * 19.3) * 0.05 + Math.sin(t * 3.1) * 0.03;

    drawRoomShell(t, floorY);
    drawMoonWindow(t, floorY);
    drawStringLights(t);
    drawShelfAndDecor(t, floorY);
    drawFireplace(t, floorY, flick);
    drawBedAndTable(t, floorY);
    drawCouple(W * 0.46, floorY - 26, t, tn, afterglow);
    drawLightingPass(t, floorY, flick, tn, afterglow);
    drawAirParticles(t, tn, afterglow);
  }

  // --- Raum: Wände, Boden, Teppich ---
  function drawRoomShell(t, floorY) {
    // Wand
    const wall = ctx.createLinearGradient(0, 0, 0, floorY);
    wall.addColorStop(0, "#1f0d15");
    wall.addColorStop(0.5, "#3c1f28");
    wall.addColorStop(1, "#2c151d");
    ctx.fillStyle = wall;
    ctx.fillRect(0, 0, W, floorY);

    // Zarte Tapeten-Streifen
    ctx.fillStyle = "rgba(255,205,220,0.025)";
    for (let x = 18; x < W; x += 58) ctx.fillRect(x, 0, 22, floorY - 44);

    // Holz-Lambris unten
    ctx.fillStyle = "#341d14";
    ctx.fillRect(0, floorY - 44, W, 44);
    ctx.fillStyle = "rgba(255,190,140,0.1)";
    ctx.fillRect(0, floorY - 44, W, 2);
    ctx.strokeStyle = "rgba(0,0,0,0.25)";
    ctx.lineWidth = 1.5;
    for (let x = 0; x < W; x += 64) {
      ctx.beginPath(); ctx.moveTo(x, floorY - 40); ctx.lineTo(x, floorY - 4); ctx.stroke();
    }

    // Boden
    const floor = ctx.createLinearGradient(0, floorY, 0, H);
    floor.addColorStop(0, "#48291a");
    floor.addColorStop(1, "#1d0c06");
    ctx.fillStyle = floor;
    ctx.fillRect(0, floorY, W, H - floorY);

    // Dielen
    ctx.strokeStyle = "rgba(0,0,0,0.2)";
    ctx.lineWidth = 1.6;
    for (let i = 0; i < 7; i++) {
      const y = floorY + 8 + i * ((H - floorY) / 6.4);
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }
    for (let i = 0; i < 16; i++) {
      const x = ((i * 1.62 + (i % 2) * 0.8) / 16) * W * 1.1;
      ctx.beginPath(); ctx.moveTo(x, floorY); ctx.lineTo(x - 30, H); ctx.stroke();
    }

    // Teppich
    const rx = W * 0.5, ry = floorY + (H - floorY) * 0.56;
    ctx.fillStyle = "#5e2438";
    ctx.beginPath(); ctx.ellipse(rx, ry, 300, 74, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#7c3450";
    ctx.beginPath(); ctx.ellipse(rx, ry, 246, 58, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = "rgba(255,205,180,0.16)";
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.ellipse(rx, ry, 272, 66, 0, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(rx, ry, 200, 46, 0, 0, Math.PI * 2); ctx.stroke();
  }

  // --- Fenster mit Mond, Sternen & Lichtstrahl ---
  function drawMoonWindow(t, floorY) {
    const wx = W * 0.155, wy = H * 0.16, ww = 150, wh = 198;

    // Rahmen
    ctx.fillStyle = "#4e3526";
    ctx.fillRect(wx - ww / 2 - 9, wy - 9, ww + 18, wh + 18);
    // Nachthimmel
    const sky = ctx.createLinearGradient(0, wy, 0, wy + wh);
    sky.addColorStop(0, "#0a1326");
    sky.addColorStop(1, "#1f3354");
    ctx.fillStyle = sky;
    ctx.fillRect(wx - ww / 2, wy, ww, wh);

    // Sterne (funkelnd)
    for (let i = 0; i < 12; i++) {
      const sxx = wx - ww / 2 + 12 + ((i * 47.3) % (ww - 24));
      const syy = wy + 10 + ((i * 33.7) % (wh - 60));
      const a = 0.4 + 0.45 * Math.sin(t * 1.4 + i * 2.1);
      ctx.fillStyle = `rgba(235,240,255,${Math.max(0.1, a)})`;
      ctx.beginPath(); ctx.arc(sxx, syy, i % 4 === 0 ? 1.5 : 1, 0, Math.PI * 2); ctx.fill();
    }

    // Mond mit Hof
    const mx = wx + 26, my = wy + 52;
    const halo = ctx.createRadialGradient(mx, my, 4, mx, my, 46);
    halo.addColorStop(0, "rgba(220,232,255,0.5)");
    halo.addColorStop(1, "rgba(220,232,255,0)");
    ctx.fillStyle = halo;
    ctx.beginPath(); ctx.arc(mx, my, 46, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#eef2dc";
    ctx.beginPath(); ctx.arc(mx, my, 17, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#101b33";
    ctx.beginPath(); ctx.arc(mx + 7, my - 5, 14, 0, Math.PI * 2); ctx.fill();

    // Ziehende Wolke
    const cx2 = wx - ww / 2 + ((t * 5) % (ww + 90)) - 45;
    ctx.fillStyle = "rgba(190,205,235,0.13)";
    ctx.beginPath();
    ctx.ellipse(cx2, wy + 96, 34, 9, 0, 0, Math.PI * 2);
    ctx.ellipse(cx2 + 22, wy + 90, 24, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    // Fensterkreuz
    ctx.strokeStyle = "#4e3526";
    ctx.lineWidth = 7;
    ctx.strokeRect(wx - ww / 2, wy, ww, wh);
    ctx.beginPath();
    ctx.moveTo(wx, wy); ctx.lineTo(wx, wy + wh);
    ctx.moveTo(wx - ww / 2, wy + wh / 2); ctx.lineTo(wx + ww / 2, wy + wh / 2);
    ctx.stroke();
    // Fensterbank
    ctx.fillStyle = "#5c4030";
    ctx.fillRect(wx - ww / 2 - 16, wy + wh + 9, ww + 32, 10);

    // Mondstrahl in den Raum
    const beam = ctx.createLinearGradient(wx, wy + wh * 0.4, wx + 120, floorY + 70);
    beam.addColorStop(0, "rgba(165,195,255,0.11)");
    beam.addColorStop(1, "rgba(165,195,255,0)");
    ctx.fillStyle = beam;
    ctx.beginPath();
    ctx.moveTo(wx - ww / 2 + 6, wy + 18);
    ctx.lineTo(wx + ww / 2 - 6, wy + 30);
    ctx.lineTo(wx + 215, floorY + 86);
    ctx.lineTo(wx - 40, floorY + 70);
    ctx.closePath();
    ctx.fill();

    // Staub im Mondlicht
    for (let i = 0; i < 14; i++) {
      const px = wx - 30 + ((i * 39.6) % 200) + Math.sin(t * 0.5 + i) * 9;
      const py = wy + 60 + ((t * 6.5 + i * 41) % (floorY - wy + 10));
      const a = 0.05 + 0.05 * Math.sin(t * 1.1 + i * 1.9);
      ctx.fillStyle = `rgba(200,215,255,${Math.max(0, a)})`;
      ctx.beginPath(); ctx.arc(px, py, 1.1, 0, Math.PI * 2); ctx.fill();
    }
  }

  // --- Lichterkette ---
  function drawStringLights(t) {
    const x0 = W * 0.30, y0 = H * 0.085;
    const x1 = W * 0.97, y1 = H * 0.12;
    const sag = 58;

    ctx.strokeStyle = "rgba(10,5,8,0.5)";
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.quadraticCurveTo((x0 + x1) / 2, y0 + sag + Math.sin(t * 0.6) * 3, x1, y1);
    ctx.stroke();

    for (let i = 0; i <= 9; i++) {
      const q = i / 9;
      const inv = 1 - q;
      // Punkt auf der Quadratic-Kurve
      const bx = inv * inv * x0 + 2 * inv * q * ((x0 + x1) / 2) + q * q * x1;
      const by = inv * inv * y0 + 2 * inv * q * (y0 + sag + Math.sin(t * 0.6) * 3) + q * q * y1;
      const sway = Math.sin(t * 0.9 + i * 1.3) * 2;
      const fl = 0.7 + 0.3 * Math.sin(t * 2.6 + i * 1.7);
      const hx = bx + sway, hy = by + 7;

      const glow = ctx.createRadialGradient(hx, hy, 0.5, hx, hy, 13 * fl);
      glow.addColorStop(0, `rgba(255,205,130,${0.4 * fl})`);
      glow.addColorStop(1, "rgba(255,205,130,0)");
      ctx.fillStyle = glow;
      ctx.beginPath(); ctx.arc(hx, hy, 13 * fl, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = `rgba(255,226,170,${0.75 + 0.25 * fl})`;
      ctx.beginPath(); ctx.arc(hx, hy, 2.6, 0, Math.PI * 2); ctx.fill();
    }
  }

  // --- Regal, Bücher, Bild ---
  function drawShelfAndDecor(t, floorY) {
    const sx = W * 0.30, sy = H * 0.30;
    // Brett
    ctx.fillStyle = "#54392a";
    ctx.fillRect(sx - 72, sy, 144, 9);
    ctx.fillStyle = "rgba(0,0,0,0.25)";
    ctx.fillRect(sx - 72, sy + 9, 144, 3);
    // Bücher
    const books = [
      ["#8a4a52", 26], ["#4a6a8a", 32], ["#a8845a", 22], ["#5a7a52", 29], ["#7a5a8a", 25],
    ];
    let bx = sx - 60;
    for (const [col, h] of books) {
      ctx.fillStyle = col;
      ctx.fillRect(bx, sy - h, 13, h);
      ctx.fillStyle = "rgba(255,255,255,0.12)";
      ctx.fillRect(bx, sy - h, 13, 3);
      bx += 16;
    }
    // Kleine Pflanze
    ctx.fillStyle = "#7a4434";
    ctx.fillRect(bx + 6, sy - 13, 14, 13);
    ctx.fillStyle = "#4f7a4a";
    ctx.beginPath();
    ctx.arc(bx + 13, sy - 18, 7, 0, Math.PI * 2);
    ctx.arc(bx + 8, sy - 14, 5, 0, Math.PI * 2);
    ctx.arc(bx + 18, sy - 14, 5, 0, Math.PI * 2);
    ctx.fill();

    // Gerahmtes Bild mit Herz (über dem Bett)
    const px = W * 0.55, py = H * 0.24;
    ctx.fillStyle = "#6a4a32";
    ctx.fillRect(px - 34, py - 26, 68, 52);
    ctx.fillStyle = "#2a1520";
    ctx.fillRect(px - 28, py - 20, 56, 40);
    ctx.fillStyle = "rgba(240,140,170,0.75)";
    ctx.font = "22px serif";
    ctx.textAlign = "center";
    ctx.fillText("♥", px, py + 8);
    ctx.textAlign = "left";
  }

  // --- Kamin mit lebendigem Feuer ---
  function drawFireplace(t, floorY, flick) {
    const fx = W * 0.84;
    const bodyW = 180, bodyH = 200;
    const fy = floorY - bodyH;

    // Schornstein-Säule
    ctx.fillStyle = "#34201a";
    ctx.fillRect(fx - 56, 0, 112, fy + 8);
    ctx.fillStyle = "rgba(0,0,0,0.2)";
    ctx.fillRect(fx - 56, 0, 8, fy + 8);

    // Korpus
    ctx.fillStyle = "#462c22";
    ctx.fillRect(fx - bodyW / 2, fy, bodyW, bodyH + 8);
    // Steinfugen
    ctx.strokeStyle = "rgba(0,0,0,0.22)";
    ctx.lineWidth = 1.5;
    for (let r = 0; r < 6; r++) {
      const yy = fy + 14 + r * 32;
      ctx.beginPath(); ctx.moveTo(fx - bodyW / 2, yy); ctx.lineTo(fx + bodyW / 2, yy); ctx.stroke();
      for (let s = 0; s < 4; s++) {
        const xx = fx - bodyW / 2 + 22 + s * 44 + (r % 2) * 20;
        ctx.beginPath(); ctx.moveTo(xx, yy); ctx.lineTo(xx, yy + 32); ctx.stroke();
      }
    }

    // Feuerraum (Bogen)
    const fbW = 104, fbH = 118, fbY = floorY - fbH + 6;
    ctx.fillStyle = "#140805";
    ctx.beginPath();
    ctx.moveTo(fx - fbW / 2, floorY + 6);
    ctx.lineTo(fx - fbW / 2, fbY + 28);
    ctx.arc(fx, fbY + 28, fbW / 2, Math.PI, 0);
    ctx.lineTo(fx + fbW / 2, floorY + 6);
    ctx.closePath();
    ctx.fill();

    // Holzscheite
    ctx.save();
    ctx.translate(fx, floorY - 12);
    ctx.fillStyle = "#3a2214";
    ctx.save(); ctx.rotate(0.22); ctx.beginPath(); ctx.roundRect(-34, -7, 68, 14, 7); ctx.fill(); ctx.restore();
    ctx.save(); ctx.rotate(-0.2); ctx.beginPath(); ctx.roundRect(-32, -5, 64, 13, 7); ctx.fill(); ctx.restore();
    ctx.restore();

    // Flammen (additiv, drei Ebenen)
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    const layers = [
      { w: 40, h: 86, col: "rgba(255,96,28,0.5)", sp: 6.6, ph: 0 },
      { w: 27, h: 64, col: "rgba(255,166,48,0.75)", sp: 8.3, ph: 1.4 },
      { w: 15, h: 40, col: "rgba(255,236,160,0.9)", sp: 10.1, ph: 2.6 },
    ];
    for (const L of layers) {
      const sway = Math.sin(t * L.sp + L.ph) * 5;
      const hh = L.h * (0.86 + 0.18 * Math.sin(t * L.sp * 0.7 + L.ph)) * flick;
      ctx.fillStyle = L.col;
      ctx.beginPath();
      ctx.moveTo(fx - L.w / 2, floorY - 12);
      ctx.bezierCurveTo(
        fx - L.w / 2, floorY - 12 - hh * 0.45,
        fx - L.w * 0.16 + sway, floorY - 12 - hh * 0.8,
        fx + sway, floorY - 12 - hh
      );
      ctx.bezierCurveTo(
        fx + L.w * 0.16 + sway, floorY - 12 - hh * 0.8,
        fx + L.w / 2, floorY - 12 - hh * 0.45,
        fx + L.w / 2, floorY - 12
      );
      ctx.closePath();
      ctx.fill();
    }
    // Funken aus dem Feuer
    for (let i = 0; i < 12; i++) {
      const cyc = (t * (0.5 + (i % 4) * 0.14) + i * 0.71) % 1;
      const sxx = fx + Math.sin(i * 2.4 + t * 1.8) * 16 * (1 - cyc);
      const syy = floorY - 18 - cyc * 140;
      const a = (1 - cyc) * 0.55;
      ctx.fillStyle = `rgba(255,${168 + (i % 3) * 25},80,${a})`;
      ctx.beginPath(); ctx.arc(sxx, syy, 1.4 + (1 - cyc), 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();

    // Glut-Schein im Feuerraum
    const ember = ctx.createRadialGradient(fx, floorY - 16, 4, fx, floorY - 22, 64 * flick);
    ember.addColorStop(0, "rgba(255,210,120,0.55)");
    ember.addColorStop(0.5, "rgba(255,120,40,0.3)");
    ember.addColorStop(1, "rgba(160,40,10,0)");
    ctx.fillStyle = ember;
    ctx.fillRect(fx - 70, floorY - 90, 140, 100);

    // Kaminsims mit Kerzen + Foto
    ctx.fillStyle = "#5c3c2c";
    ctx.fillRect(fx - bodyW / 2 - 14, fy - 12, bodyW + 28, 14);
    drawCandle(fx - 62, fy - 30, t, 0.4);
    drawCandle(fx - 48, fy - 26, t, 1.9);
    ctx.fillStyle = "#6a4a36";
    ctx.fillRect(fx + 30, fy - 52, 38, 40);
    ctx.fillStyle = "#241218";
    ctx.fillRect(fx + 34, fy - 48, 30, 32);
    ctx.fillStyle = "rgba(240,150,175,0.7)";
    ctx.font = "14px serif";
    ctx.textAlign = "center";
    ctx.fillText("♥", fx + 49, fy - 26);
    ctx.textAlign = "left";

    // Feuerschein auf dem Boden davor
    const fg = ctx.createRadialGradient(fx, floorY + 26, 8, fx, floorY + 26, 180);
    fg.addColorStop(0, `rgba(255,150,60,${0.14 * flick})`);
    fg.addColorStop(1, "rgba(255,150,60,0)");
    ctx.fillStyle = fg;
    ctx.beginPath(); ctx.ellipse(fx, floorY + 30, 190, 56, 0, 0, Math.PI * 2); ctx.fill();
  }

  // --- Bett, Nachttisch, Wein, Blumen ---
  function drawBedAndTable(t, floorY) {
    const bx = W * 0.46;

    // Kopfteil
    ctx.fillStyle = "#5a3247";
    ctx.beginPath(); ctx.roundRect(bx - 150, floorY - 130, 300, 86, 16); ctx.fill();
    ctx.fillStyle = "rgba(0,0,0,0.16)";
    for (let r = 0; r < 2; r++) {
      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.arc(bx - 112 + i * 56 + r * 28, floorY - 106 + r * 26, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Matratze + Laken
    ctx.fillStyle = "#74466a";
    ctx.beginPath(); ctx.roundRect(bx - 162, floorY - 56, 324, 64, 14); ctx.fill();
    ctx.fillStyle = "#c79ab4";
    ctx.beginPath(); ctx.roundRect(bx - 162, floorY - 56, 324, 18, [14, 14, 4, 4]); ctx.fill();

    // Kissen
    ctx.save();
    ctx.fillStyle = "#f0d7e2";
    ctx.translate(bx - 92, floorY - 58); ctx.rotate(-0.06);
    ctx.beginPath(); ctx.roundRect(-38, -14, 76, 30, 12); ctx.fill();
    ctx.restore();
    ctx.save();
    ctx.fillStyle = "#ecccdc";
    ctx.translate(bx + 86, floorY - 58); ctx.rotate(0.05);
    ctx.beginPath(); ctx.roundRect(-38, -14, 76, 30, 12); ctx.fill();
    ctx.restore();

    // Decke mit Falten
    ctx.fillStyle = "#8d3a58";
    ctx.beginPath(); ctx.roundRect(bx - 162, floorY - 26, 324, 36, [6, 6, 14, 14]); ctx.fill();
    ctx.strokeStyle = "rgba(0,0,0,0.14)";
    ctx.lineWidth = 2;
    for (let i = 0; i < 4; i++) {
      ctx.beginPath();
      ctx.moveTo(bx - 130 + i * 80, floorY - 24);
      ctx.quadraticCurveTo(bx - 118 + i * 80, floorY - 8, bx - 134 + i * 80, floorY + 8);
      ctx.stroke();
    }
    // Umgeschlagene Ecke
    ctx.fillStyle = "#a44e6c";
    ctx.beginPath();
    ctx.moveTo(bx + 162, floorY - 26);
    ctx.lineTo(bx + 122, floorY - 26);
    ctx.lineTo(bx + 162, floorY + 2);
    ctx.closePath();
    ctx.fill();

    // Nachttisch links
    const tx = bx - 232;
    ctx.fillStyle = "#4c3222";
    ctx.fillRect(tx - 7, floorY - 56, 14, 56);
    ctx.fillStyle = "#5c4030";
    ctx.beginPath(); ctx.ellipse(tx, floorY - 58, 46, 12, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "rgba(255,210,170,0.1)";
    ctx.beginPath(); ctx.ellipse(tx, floorY - 60, 46, 11, 0, 0, Math.PI * 2); ctx.fill();

    // Weinflasche + zwei Gläser
    ctx.fillStyle = "#1c3a26";
    ctx.fillRect(tx - 26, floorY - 102, 12, 42);
    ctx.fillRect(tx - 23, floorY - 116, 6, 16);
    for (const gx of [tx + 2, tx + 22]) {
      ctx.fillStyle = "rgba(225,235,245,0.2)";
      ctx.beginPath(); ctx.moveTo(gx - 7, floorY - 92); ctx.lineTo(gx + 7, floorY - 92); ctx.lineTo(gx + 2, floorY - 76); ctx.lineTo(gx - 2, floorY - 76); ctx.closePath(); ctx.fill();
      ctx.fillStyle = "rgba(190,50,80,0.75)";
      ctx.beginPath(); ctx.moveTo(gx - 5.4, floorY - 88); ctx.lineTo(gx + 5.4, floorY - 88); ctx.lineTo(gx + 2.4, floorY - 77); ctx.lineTo(gx - 2.4, floorY - 77); ctx.closePath(); ctx.fill();
      ctx.fillStyle = "rgba(225,235,245,0.3)";
      ctx.fillRect(gx - 1, floorY - 76, 2, 12);
      ctx.fillRect(gx - 5, floorY - 64, 10, 2);
    }

    // Vase mit Blumen (Erinnerung ans Blumen-Schenken)
    const vx = tx + 40;
    ctx.fillStyle = "rgba(160,200,230,0.4)";
    ctx.beginPath();
    ctx.moveTo(vx - 7, floorY - 88);
    ctx.quadraticCurveTo(vx - 10, floorY - 72, vx - 5, floorY - 62);
    ctx.lineTo(vx + 5, floorY - 62);
    ctx.quadraticCurveTo(vx + 10, floorY - 72, vx + 7, floorY - 88);
    ctx.closePath();
    ctx.fill();
    const petals = [[348, -10, -26], [20, 0, -32], [310, 9, -24]];
    for (const [hue, dx, dy] of petals) {
      ctx.strokeStyle = "#4f7a4a";
      ctx.lineWidth = 1.6;
      ctx.beginPath(); ctx.moveTo(vx, floorY - 86); ctx.quadraticCurveTo(vx + dx * 0.5, floorY - 96, vx + dx, floorY - 88 + dy + 14); ctx.stroke();
      const fxp = vx + dx, fyp = floorY - 88 + dy + 14;
      for (let p = 0; p < 5; p++) {
        const a = (p / 5) * Math.PI * 2;
        ctx.fillStyle = `hsl(${hue}, 70%, 72%)`;
        ctx.beginPath(); ctx.arc(fxp + Math.cos(a) * 4, fyp + Math.sin(a) * 4, 3, 0, Math.PI * 2); ctx.fill();
      }
      ctx.fillStyle = "#ffd96a";
      ctx.beginPath(); ctx.arc(fxp, fyp, 2.4, 0, Math.PI * 2); ctx.fill();
    }

    // Kerzen am Bett
    drawCandle(bx + 206, floorY - 38, t, 0.9);
    drawCandle(bx + 220, floorY - 32, t, 2.2);
  }

  // --- Das Paar: Silhouetten, die mit der Spannung zusammenrücken ---
  function drawCouple(x, y, t, tn, afterglow) {
    const breathe = Math.sin(t * 1.5) * 1.6;
    const breathe2 = Math.sin(t * 1.5 + 1.1) * 1.6;
    const hairCol = st && st.npc ? st.npc.d.hairColor : "#5a3a2a";

    ctx.save();
    ctx.translate(x, y + (afterglow ? 10 : 0));

    if (afterglow) {
      // Liegend, eng aneinandergeschmiegt, unter der Decke
      ctx.fillStyle = "rgba(26,14,22,0.94)";
      ctx.beginPath(); ctx.ellipse(-34, 2 + breathe * 0.4, 64, 22, 0.04, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(30, -2 + breathe2 * 0.4, 58, 20, -0.04, 0, Math.PI * 2); ctx.fill();
      // Köpfe
      ctx.fillStyle = "rgba(36,20,30,0.96)";
      ctx.beginPath(); ctx.arc(-82, -8, 13, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(72, -12, 13, 0, Math.PI * 2); ctx.fill();
      // Ihr Haar fließt übers Kissen
      ctx.globalAlpha = 0.55;
      ctx.fillStyle = hairCol;
      ctx.beginPath();
      ctx.ellipse(64, -16, 22, 9, -0.3, 0, Math.PI * 2);
      ctx.ellipse(86, -6, 14, 7, 0.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
      // Decke darüber
      ctx.fillStyle = "rgba(141,58,88,0.6)";
      ctx.beginPath(); ctx.roundRect(-100, 4, 200, 24, 12); ctx.fill();
    } else {
      // Sitzend — sie rücken mit steigender Spannung näher zusammen
      const closeness = 10 * tn;
      const lean = 0.1 + 0.12 * tn;

      // Körper links (Spielerin)
      ctx.save();
      ctx.translate(-30 + closeness * 0.6, 0);
      ctx.rotate(lean);
      ctx.fillStyle = "rgba(26,14,22,0.92)";
      ctx.beginPath(); ctx.roundRect(-19, -40 + breathe, 38, 62, 16); ctx.fill();
      ctx.beginPath(); ctx.arc(0, -50 + breathe, 14, 0, Math.PI * 2); ctx.fill();
      ctx.restore();

      // Körper rechts (sie) mit Haar-Andeutung
      ctx.save();
      ctx.translate(30 - closeness * 0.6, 0);
      ctx.rotate(-lean);
      ctx.fillStyle = "rgba(38,20,32,0.94)";
      ctx.beginPath(); ctx.roundRect(-19, -38 + breathe2, 38, 60, 16); ctx.fill();
      ctx.beginPath(); ctx.arc(0, -48 + breathe2, 14, 0, Math.PI * 2); ctx.fill();
      ctx.globalAlpha = 0.5;
      ctx.fillStyle = hairCol;
      ctx.beginPath();
      ctx.arc(0, -52 + breathe2, 15, Math.PI * 0.85, Math.PI * 2.18);
      ctx.quadraticCurveTo(17, -26 + breathe2, 12, -12 + breathe2);
      ctx.lineTo(15, -50 + breathe2);
      ctx.closePath();
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.restore();

      // Glühen zwischen ihnen — wächst mit der Spannung
      const ga = 0.2 + tn * 0.3;
      const gr = 20 + tn * 22;
      const g = ctx.createRadialGradient(0, -32, 1, 0, -32, gr);
      g.addColorStop(0, `rgba(255,150,180,${ga})`);
      g.addColorStop(1, "rgba(255,150,180,0)");
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(0, -32, gr, 0, Math.PI * 2); ctx.fill();

      // Kleine Herzen steigen bei hoher Spannung auf
      if (tn > 0.55) {
        for (let i = 0; i < 3; i++) {
          const cyc = (t * 0.35 + i * 0.37) % 1;
          const a = Math.sin(cyc * Math.PI) * (tn - 0.45);
          ctx.globalAlpha = Math.max(0, a);
          ctx.fillStyle = "#ff9bb5";
          ctx.font = `${10 + i * 3}px serif`;
          ctx.fillText("♥", Math.sin(i * 2.4 + t) * 18, -66 - cyc * 46);
          ctx.globalAlpha = 1;
        }
      }
    }
    ctx.restore();
  }

  // --- Licht-Komposition über allem ---
  function drawLightingPass(t, floorY, flick, tn, afterglow) {
    const fx = W * 0.84;

    // Feuerschein im ganzen Raum (flackernd)
    const warm = ctx.createRadialGradient(fx, floorY - 60, 60, W * 0.55, H * 0.5, Math.max(W, H) * 0.95);
    warm.addColorStop(0, `rgba(255,150,60,${(afterglow ? 0.06 : 0.13) * flick})`);
    warm.addColorStop(1, "rgba(30,10,8,0.32)");
    ctx.fillStyle = warm;
    ctx.fillRect(0, 0, W, H);

    // Kühles Gegenlicht vom Fenster
    const cool = ctx.createRadialGradient(W * 0.155, H * 0.3, 30, W * 0.155, H * 0.3, 420);
    cool.addColorStop(0, "rgba(150,180,255,0.06)");
    cool.addColorStop(1, "rgba(150,180,255,0)");
    ctx.fillStyle = cool;
    ctx.fillRect(0, 0, W, H);

    // Spannungs-Tönung + Herzschlag-Puls
    const beatDur = 1.7 - tn * 0.95;
    const pulse = Math.sin((t / beatDur) * Math.PI * 2) * 0.016 * tn;
    ctx.fillStyle = `rgba(255,60,110,${Math.max(0, tn * 0.05 + pulse)})`;
    ctx.fillRect(0, 0, W, H);

    // Vignette
    const vig = ctx.createRadialGradient(W / 2, H * 0.48, Math.min(W, H) * 0.3, W / 2, H * 0.52, Math.max(W, H) * 0.78);
    vig.addColorStop(0, "rgba(10,3,8,0)");
    vig.addColorStop(1, "rgba(8,2,6,0.62)");
    ctx.fillStyle = vig;
    ctx.fillRect(0, 0, W, H);
  }

  // --- Schwebende Glut & Herzchen im Raum ---
  function drawAirParticles(t, tn, afterglow) {
    const count = afterglow ? 10 : 16;
    for (let i = 0; i < count; i++) {
      const tt = t * 0.4 + i * 1.37;
      const x = (i * 167.1 + Math.sin(tt) * 46) % W;
      const y = H - ((tt * 22 + i * 64) % (H * 0.92));
      const a = 0.08 + 0.08 * Math.sin(tt * 2);
      ctx.globalAlpha = Math.max(0, a);
      if (i % 3 === 0) {
        ctx.fillStyle = "#ff9bb5";
        ctx.font = "15px serif";
        ctx.fillText("♥", x, y);
      } else {
        ctx.fillStyle = "#ffdca0";
        ctx.beginPath(); ctx.arc(x, y, 1.6, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1;
    }
  }

  function drawCandle(x, y, t, phase) {
    ctx.fillStyle = "#e9dcc0";
    ctx.fillRect(x - 3, y, 6, 18);
    ctx.fillStyle = "rgba(0,0,0,0.12)";
    ctx.fillRect(x + 1, y, 2, 18);
    const fl = 0.8 + Math.sin(t * 11 + phase) * 0.2;
    const g = ctx.createRadialGradient(x, y - 2, 0.5, x, y - 4, 12 * fl);
    g.addColorStop(0, "rgba(255,245,200,0.95)");
    g.addColorStop(0.5, "rgba(255,170,60,0.8)");
    g.addColorStop(1, "rgba(255,120,30,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.ellipse(x, y - 4 + Math.sin(t * 13 + phase) * 0.6, 5 * fl, 9 * fl, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // Render-Helfer für eigene Stage-Renderer (NSFW-Grundlage):
  // eigene draw(ctx, st, R)-Funktionen können damit den Look des
  // Standard-Innenraums übernehmen oder einzelne Ebenen austauschen.
  const RenderHelpers = {
    drawRoomShell, drawMoonWindow, drawStringLights, drawShelfAndDecor,
    drawFireplace, drawBedAndTable, drawCouple, drawLightingPass,
    drawAirParticles, drawCandle,
  };

  // Alt-Name (Kompatibilität): die Standard-Innenraum-Szene
  const drawHouseScene = drawStageScene;

  return {
    // Lebenszyklus
    start, update, ambient, choose, abort, finish,
    // Abfragen
    active, cinema, inHouseScene, npc, zoom, focusPoint,
    // Rendering
    drawCinematics, drawStageScene, drawHouseScene, drawFadeOverlay,
    // Erweiterung (NSFW-Grundlage)
    registerStage, hooks, RenderHelpers,
    HOUSE_BEATS,
  };
})();
