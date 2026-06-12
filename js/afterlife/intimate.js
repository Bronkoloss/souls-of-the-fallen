"use strict";

/* ------------------------------------------------------------------
   Intimate — das "Herzgespräch" und die private Innenraum-Szene.

   Ablauf:
     1. startSeduction(npc)  — öffnet den Herzgespräch-Modus (DOM-Panel)
        Spieler wählt aus 2–3 fortführenden Antworten. Eine Spannungs-
        anzeige (tension) steigt und fällt bewusst (Push & Pull).
     2. Am Finale-Beat führt die Wahl "ins Haus" zur Szene HOUSE:
        weicher Fade, prozedural gezeichneter Innenraum (Kaminlicht,
        Kerzen), und das Gespräch geht knisternd-andeutend weiter.
     3. Schluss: sanftes Fade-to-Black, Abspann/Belohnung
        (Bonus-Herzen, Erinnerung), zurück ins Jenseits.

   Bewusst andeutend & atmosphärisch — Spannung durch Stimmung,
   nicht durch Explizites.
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

  // ---------- Engine-Zustand ----------
  let st = null;

  function active() { return !!st; }
  function inHouseScene() { return !!st && st.scene === "house"; }

  // ---------- Start (Außen / Herzgespräch) ----------
  function start(npc) {
    st = {
      npc,
      scene: "outdoor",      // outdoor | house
      beats: Seduction.BEATS,
      idx: 0,
      tension: 12,
      peak: 12,
      fade: 0,               // 0..1 Überblendung
      fadeDir: 0,            // -1 rein, +1 raus
      pendingScene: null,
      afterglow: false,
      done: false,
      houseT: 0,             // Zeit im Innenraum (für Lichtflackern)
    };
    renderBeat(st.beats[0], { firstLine: true });
    showPanel();
    AudioFX.play("heart");
  }

  // ---------- Spieler wählt eine Antwort ----------
  function choose(choice) {
    if (!st) return;

    // Spannung anpassen (sanft, mit Decken/Boden)
    st.tension = Math.max(4, Math.min(100, st.tension + (choice.heat || 0)));
    st.peak = Math.max(st.peak, st.tension);

    if (choice.tone === "pull") AudioFX.play("blip");
    else if (choice.tone === "tease") AudioFX.play("talk");
    else AudioFX.play("heart");

    // Übergang ins Haus?
    if (choice.enter) {
      st.npc.blushT = 5;
      beginHouseTransition();
      return;
    }
    // Fade-to-Black im Haus?
    if (choice.fade) {
      beginAfterglowFade();
      return;
    }

    // Reaktion zeigen, dann zum nächsten Beat
    const d = st.npc.d;
    const reply = choice.reply ? Seduction.flavor(choice.reply, d) : "";
    advanceBeat(reply);
  }

  function advanceBeat(replyText) {
    const beats = st.beats;
    const nextIdx = st.idx + 1;

    if (nextIdx >= beats.length) {
      // Sicherheitsnetz: am Ende angekommen
      renderReplyThen(replyText, () => {
        if (st.scene === "outdoor") beginHouseTransition();
        else beginAfterglowFade();
      });
      return;
    }
    st.idx = nextIdx;
    st._lastReply = replyText || "";
    renderBeat(beats[nextIdx]);   // zeigt Reaktion + neue Zeile + Auswahl
  }

  // ---------- Übergang nach drinnen ----------
  function beginHouseTransition() {
    hidePanel();
    st.fadeDir = 1;          // ausblenden (zu schwarz)
    st.fade = 0;
    st.pendingScene = "house";
    AudioFX.play("portal");
  }

  // ---------- Übergang in den Abspann ----------
  function beginAfterglowFade() {
    hidePanel();
    st.fadeDir = 1;
    st.fade = 0;
    st.pendingScene = "afterglow";
    AudioFX.play("portal");
  }

  // ---------- Update (Fades + Innenraum-Zeit) ----------
  function update(dt) {
    if (!st) return;
    st.houseT += dt;

    if (st.fadeDir !== 0) {
      st.fade += dt * st.fadeDir * 1.4;
      if (st.fade >= 1) {
        st.fade = 1;
        st.fadeDir = 0;
        onFadedOut();
      } else if (st.fade <= 0) {
        st.fade = 0;
        st.fadeDir = 0;
      }
    }
  }

  function onFadedOut() {
    if (st.pendingScene === "house") {
      // Im Schwarz: Szene wechseln, dann wieder aufblenden
      st.scene = "house";
      st.idx = 0;
      st.beats = HOUSE_BEATS;
      st.pendingScene = null;
      st.fadeDir = -1;        // wieder einblenden
      if (typeof enterHouseScene === "function") enterHouseScene(); // App-State -> HOUSE
      renderBeat(HOUSE_BEATS[0], { firstLine: true });
      showPanel();
    } else if (st.pendingScene === "afterglow") {
      // Abspann anzeigen (bleibt schwarz mit Text)
      st.afterglow = true;
      st.pendingScene = null;
      grantReward();
      showAfterglow();
    }
  }

  // Fade-Overlay für die Außen-Szene (Jenseits) während des Übergangs
  function drawFadeOverlay() {
    if (st && st.fade > 0) {
      ctx.fillStyle = `rgba(0,0,0,${st.fade})`;
      ctx.fillRect(0, 0, W, H);
    }
  }

  // ---------- Belohnung ----------
  function grantReward() {
    const npc = st.npc;
    // Erinnerung speichern + Bonus-Freundschaft
    if (!Save.data.intimate) Save.data.intimate = {};
    Save.data.intimate[npc.seed] = (Save.data.intimate[npc.seed] || 0) + 1;
    Save.data.friendship[npc.seed] = Math.min(30, (Save.data.friendship[npc.seed] || 0) + 3);
    Save.write();
  }

  // ---------- DOM ----------
  function showPanel() { intimatePanel.classList.remove("hidden"); }
  function hidePanel() { intimatePanel.classList.add("hidden"); }

  function tensionLabel(v) {
    if (v < 25) return "ein zartes Knistern";
    if (v < 45) return "spürbare Spannung";
    if (v < 65) return "heiße Erwartung";
    if (v < 85) return "kaum auszuhalten";
    return "atemlos";
  }

  function renderBeat(beat, opts = {}) {
    const d = st.npc.d;
    const lineHtml = `<span class="seduce-line">${Seduction.flavor(beat.line, d)}</span>`;
    if (opts.firstLine) {
      intimateText.innerHTML = lineHtml;
    } else {
      // an die zuvor gezeigte Reaktion anhängen
      intimateText.innerHTML = (st._lastReply ? `<span class="seduce-reply">${st._lastReply}</span><br/>` : "") + lineHtml;
    }
    renderTension();
    renderChoices(beat);
  }

  function renderReply(text) {
    st._lastReply = text || "";
  }

  function renderReplyThen(text, cb) {
    st._lastReply = text || "";
    intimateText.innerHTML = `<span class="seduce-reply">${st._lastReply}</span>`;
    renderTension();
    intimateChoices.innerHTML = "";
    setTimeout(cb, 700);
  }

  function renderTension() {
    const v = st.tension;
    intimateMeterFill.style.width = Math.min(100, v) + "%";
    intimateMeterLabel.textContent = tensionLabel(v);
  }

  function renderChoices(beat) {
    intimateChoices.innerHTML = "";
    for (const ch of beat.choices) {
      const b = document.createElement("button");
      b.className = "seduce-btn" + (ch.tone === "pull" ? " pull" : ch.tone === "tease" ? " tease" : "");
      b.innerHTML = ch.text;
      b.addEventListener("click", () => choose(ch));
      intimateChoices.appendChild(b);
    }
    // Notausstieg
    const bye = document.createElement("button");
    bye.className = "seduce-btn bye";
    bye.textContent = "… vielleicht ein andermal";
    bye.addEventListener("click", () => abort());
    intimateChoices.appendChild(bye);
  }

  function showAfterglow() {
    const d = st.npc.d;
    intimateAfterglow.innerHTML =
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
    const npc = st.npc;
    cleanup();
    if (typeof exitHouseScene === "function") exitHouseScene();
    // kleines Herz an der NPC
    if (npc) AfterlifeEmotes.emote(npc.x, npc.y - 60 * npc.d.scale, "💖", { size: 26 });
  }

  function cleanup() {
    hidePanel();
    intimateAfterglow.classList.add("hidden");
    intimateAfterglow.innerHTML = "";
    st = null;
  }

  // ---------- Innenraum zeichnen (prozedural) ----------
  function drawHouseScene() {
    const t = st ? st.houseT : 0;
    // Hintergrund: warmer Innenraum
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, "#3a2418");
    g.addColorStop(0.55, "#56331f");
    g.addColorStop(1, "#2a1810");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    const cx = W / 2, floorY = H * 0.72;

    // Boden
    ctx.fillStyle = "#3d2415";
    ctx.fillRect(0, floorY, W, H - floorY);
    // Dielen
    ctx.strokeStyle = "rgba(0,0,0,0.18)";
    ctx.lineWidth = 2;
    for (let i = 0; i < 14; i++) {
      const x = (i / 14) * W;
      ctx.beginPath(); ctx.moveTo(x, floorY); ctx.lineTo(x, H); ctx.stroke();
    }

    // Teppich
    ctx.fillStyle = "#7a2f44";
    ctx.beginPath();
    ctx.ellipse(cx, floorY + 70, 280, 70, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#9a3d57";
    ctx.beginPath();
    ctx.ellipse(cx, floorY + 70, 220, 52, 0, 0, Math.PI * 2);
    ctx.fill();

    // Kamin rechts
    const fx = W * 0.80, fy = floorY - 150;
    ctx.fillStyle = "#5a4636";
    ctx.fillRect(fx - 70, fy, 140, 200);
    ctx.fillStyle = "#2c2018";
    ctx.fillRect(fx - 48, fy + 40, 96, 130);
    // Feuer (flackernd)
    const flick = 0.8 + Math.sin(t * 9) * 0.12 + Math.sin(t * 21) * 0.06;
    const fire = ctx.createRadialGradient(fx, fy + 140, 4, fx, fy + 120, 70 * flick);
    fire.addColorStop(0, "rgba(255,240,160,0.95)");
    fire.addColorStop(0.4, "rgba(255,150,40,0.85)");
    fire.addColorStop(1, "rgba(180,40,20,0)");
    ctx.fillStyle = fire;
    ctx.beginPath();
    ctx.ellipse(fx, fy + 128, 40 * flick, 56 * flick, 0, 0, Math.PI * 2);
    ctx.fill();

    // Fenster links mit Nachthimmel + Mond
    const wx = W * 0.16, wy = floorY - 200;
    ctx.fillStyle = "#3a5a78";
    ctx.fillRect(wx - 60, wy, 120, 150);
    ctx.fillStyle = "#22304a";
    ctx.fillRect(wx - 52, wy + 8, 104, 134);
    ctx.fillStyle = "#f3ecd0";
    ctx.beginPath(); ctx.arc(wx + 18, wy + 42, 16, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#22304a";
    ctx.beginPath(); ctx.arc(wx + 26, wy + 36, 13, 0, Math.PI * 2); ctx.fill();
    // Sterne
    ctx.fillStyle = "rgba(255,255,235,0.85)";
    for (let i = 0; i < 9; i++) {
      const sx = wx - 44 + (i * 53.7 % 88);
      const sy = wy + 14 + (i * 31.3 % 64);
      ctx.beginPath(); ctx.arc(sx, sy, 1.1, 0, Math.PI * 2); ctx.fill();
    }
    // Fensterkreuz
    ctx.strokeStyle = "#5a4636"; ctx.lineWidth = 4;
    ctx.strokeRect(wx - 60, wy, 120, 150);
    ctx.beginPath(); ctx.moveTo(wx, wy); ctx.lineTo(wx, wy + 150);
    ctx.moveTo(wx - 60, wy + 75); ctx.lineTo(wx + 60, wy + 75); ctx.stroke();

    // Bett / Sofa in der Mitte
    const bx = cx, by = floorY - 8;
    ctx.fillStyle = "#46324a";
    ctx.beginPath();
    ctx.roundRect(bx - 150, by - 56, 300, 78, 14);
    ctx.fill();
    ctx.fillStyle = "#5e4466";
    ctx.beginPath();
    ctx.roundRect(bx - 150, by - 56, 300, 26, 12);
    ctx.fill();
    // Kissen
    ctx.fillStyle = "#e7c7d6";
    ctx.beginPath(); ctx.roundRect(bx - 132, by - 50, 70, 30, 10); ctx.fill();
    ctx.beginPath(); ctx.roundRect(bx + 64, by - 50, 70, 30, 10); ctx.fill();

    // Kerzen (flackernd) auf einem kleinen Tisch links vom Bett
    drawCandle(bx - 200, floorY - 36, t, 0);
    drawCandle(bx - 188, floorY - 30, t, 1.7);
    drawCandle(bx + 196, floorY - 34, t, 0.9);

    // Schwebende Herzchen / Funken
    for (let i = 0; i < 16; i++) {
      const tt = t * 0.5 + i * 1.4;
      const x = (i * 151.7 + Math.sin(tt) * 40) % W;
      const y = H - ((tt * 26 + i * 60) % (H * 0.9));
      const a = 0.10 + 0.10 * Math.sin(tt * 2);
      ctx.globalAlpha = Math.max(0, a);
      ctx.fillStyle = i % 3 === 0 ? "#ff9bb5" : "#ffdca0";
      ctx.font = (i % 3 === 0 ? "16px" : "12px") + " serif";
      ctx.fillText(i % 3 === 0 ? "♥" : "✦", x, y);
      ctx.globalAlpha = 1;
    }

    // Zwei Silhouetten auf dem Bett (andeutend, eng beieinander)
    const sit = !st || !st.afterglow;
    drawCouple(bx, by - 30, t, st && st.afterglow);

    // Warme Vignette / Kaminschein über allem
    const warm = ctx.createRadialGradient(fx, fy + 120, 40, cx, H * 0.5, Math.max(W, H) * 0.8);
    warm.addColorStop(0, "rgba(255,180,90,0.14)");
    warm.addColorStop(1, "rgba(20,8,4,0.55)");
    ctx.fillStyle = warm;
    ctx.fillRect(0, 0, W, H);

    // Fade-Overlay
    if (st && st.fade > 0) {
      ctx.fillStyle = `rgba(0,0,0,${st.fade})`;
      ctx.fillRect(0, 0, W, H);
    }
  }

  function drawCandle(x, y, t, phase) {
    ctx.fillStyle = "#e9dcc0";
    ctx.fillRect(x - 3, y, 6, 18);
    const fl = 0.8 + Math.sin(t * 11 + phase) * 0.2;
    const g = ctx.createRadialGradient(x, y - 2, 0.5, x, y - 4, 10 * fl);
    g.addColorStop(0, "rgba(255,245,200,0.95)");
    g.addColorStop(0.5, "rgba(255,170,60,0.8)");
    g.addColorStop(1, "rgba(255,120,30,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.ellipse(x, y - 4, 5 * fl, 9 * fl, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // Zwei eng beieinander sitzende/liegende Silhouetten — rein andeutend
  function drawCouple(x, y, t, afterglow) {
    const breathe = Math.sin(t * 1.6) * 1.5;
    ctx.save();
    ctx.translate(x, y + (afterglow ? 14 : 0));
    if (afterglow) {
      // liegend, aneinandergeschmiegt
      ctx.fillStyle = "rgba(30,18,26,0.92)";
      ctx.beginPath();
      ctx.ellipse(-30, 6 + breathe * 0.3, 60, 22, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(28, 2 + breathe * 0.3, 56, 20, 0, 0, Math.PI * 2);
      ctx.fill();
      // Köpfe
      ctx.fillStyle = "rgba(40,24,34,0.95)";
      ctx.beginPath(); ctx.arc(-74, -2, 13, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(74, -6, 13, 0, Math.PI * 2); ctx.fill();
      // Decke
      ctx.fillStyle = "rgba(120,60,90,0.55)";
      ctx.beginPath(); ctx.roundRect(-95, 8, 190, 22, 10); ctx.fill();
    } else {
      // sitzend, einander zugewandt
      ctx.fillStyle = "rgba(30,18,26,0.9)";
      // Körper 1
      ctx.beginPath(); ctx.roundRect(-46, -36 + breathe, 40, 60, 16); ctx.fill();
      ctx.beginPath(); ctx.arc(-26, -44 + breathe, 15, 0, Math.PI * 2); ctx.fill();
      // Körper 2
      ctx.fillStyle = "rgba(44,26,38,0.92)";
      ctx.beginPath(); ctx.roundRect(8, -34 - breathe, 40, 58, 16); ctx.fill();
      ctx.beginPath(); ctx.arc(28, -42 - breathe, 15, 0, Math.PI * 2); ctx.fill();
      // angedeutete Berührung: ein Glühen dazwischen
      const g = ctx.createRadialGradient(0, -30, 1, 0, -30, 26);
      g.addColorStop(0, "rgba(255,150,180,0.4)");
      g.addColorStop(1, "rgba(255,150,180,0)");
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(0, -30, 26, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
  }

  return {
    start, update, choose, abort, finish,
    active, inHouseScene, drawHouseScene, drawFadeOverlay,
    HOUSE_BEATS,
  };
})();
