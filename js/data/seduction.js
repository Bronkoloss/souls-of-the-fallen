"use strict";

/* ------------------------------------------------------------------
   Herzgespräch — verzweigter, fortlaufender Verführungs-Dialog.

   Aufbau als "Beats" (Gesprächsstufen). Jeder Beat hat:
     line   : was sie sagt (String ODER {byPersonality} ODER Funktion(d))
     choices: 2–3 Antworten des Spielers. Jede Antwort:
        text   : Button-Beschriftung
        reply  : ihre direkte Reaktion
        heat   : Veränderung der Spannung (+ steigt, - kurze Entspannung)
        tone   : "push" | "pull" | "tease"  (nur für Stil/Sound)

   Die Spannungskurve ist bewusst als Wechselspiel angelegt:
   aufbauen → necken/kurz lösen → stärker aufbauen → verletzlicher Moment
   → Höhepunkt der Spannung → gemeinsam ins Haus.

   Bewusst andeutend & knisternd gehalten — Atmosphäre statt Explizitem.
------------------------------------------------------------------ */

const Seduction = (() => {

  // Hilfsfunktion: Persönlichkeits-Variante wählen, sonst Default
  const flavor = (map, d) => {
    if (typeof map === "function") return map(d);
    if (typeof map === "string") return map;
    return map[d.personality] || map.default;
  };

  // ---------- Die Gesprächs-Beats (Spine) ----------
  // Index = Stufe. Der letzte Beat ist die Einladung ins Haus.
  const BEATS = [

    // 0 — Einstieg: warm, schon leicht aufgeladen
    {
      line: {
        default: "Du bist gekommen. Den ganzen Tag habe ich gehofft, dass du es tust … und jetzt, wo du hier stehst, weiß ich plötzlich nicht, wohin mit meinen Händen.",
        frech: "Sieh an. Du traust dich also doch. Ich hatte schon gewettet, du würdest kneifen — schön, dass ich verliere. Diesmal.",
        schuechtern: "Oh … du bist wirklich da. Ich … ich habe geübt, was ich sagen will, und jetzt ist alles weg. Mein Herz macht gerade ziemlichen Lärm.",
        vertraeumt: "Ich habe von genau diesem Moment geträumt. Du, das warme Licht, und dieses Kribbeln, das mir sagt: jetzt passiert etwas.",
      },
      choices: [
        { text: "„Dann lass uns rausfinden, wohin dieser Abend uns trägt.“", tone: "push", heat: +14,
          reply: "Ihr Blick wird ein bisschen dunkler, ihr Lächeln langsamer. „Mutig. Das mag ich.“" },
        { text: "„Ich konnte an nichts anderes denken als an dich.“", tone: "push", heat: +12,
          reply: "Sie tritt einen halben Schritt näher. „Sag das nochmal. Langsamer.“" },
        { text: "„Erstmal nur dich ansehen. Du bist atemberaubend.“", tone: "tease", heat: +8,
          reply: "Sie senkt kurz den Blick, dann hebt sie ihn wieder — direkt in deinen. „Dann sieh ruhig. Ich laufe nicht weg.“" },
      ],
    },

    // 1 — Aufbauen: Nähe, Spiel mit Worten
    {
      line: {
        default: "Sie kommt näher, bis nur noch eine Handbreit zwischen euch liegt. „Spürst du das auch? Diese Luft zwischen uns … sie ist auf einmal ganz schwer.“",
        frech: "„Weißt du, was dein Problem ist?“ Sie grinst und kommt näher. „Du siehst aus, als würdest du dich gerade enorm zusammenreißen. Tu's nicht.“",
        schuechtern: "Sie wagt sich näher, ihre Finger spielen nervös mit einer Haarsträhne. „Ich … ich bin sonst nie so. Aber bei dir will ich mutig sein.“",
        energisch: "„Okay, ich sag's einfach“, platzt sie heraus und steht plötzlich dicht vor dir. „Mein Puls geht gerade wie nach einem Sprint. Und du bist schuld.“",
      },
      choices: [
        { text: "Ihr eine Haarsträhne aus dem Gesicht streichen.", tone: "push", heat: +16,
          reply: "Deine Fingerspitzen streifen ihre Wange. Sie hält den Atem an und lehnt sich kaum merklich in die Berührung. „Oh …“" },
        { text: "„Ich spüre es. Ich versuche nur, mich zu benehmen.“", tone: "push", heat: +13,
          reply: "„Benehmen“, wiederholt sie leise und lacht. „Wie schade wäre das.“" },
        { text: "Einen Schritt zurück — und sie mit einem Blick festhalten.", tone: "pull", heat: -6,
          reply: "Sie hebt überrascht eine Braue, dann lächelt sie wissend. Der kleine Abstand macht alles nur lauter. „Ach so spielst du also.“" },
      ],
    },

    // 2 — Bewusste Entspannung: Lachen, Leichtigkeit (Spannung kurz runter)
    {
      line: {
        default: "Sie lacht plötzlich, hell und ehrlich, und der Moment wird ganz leicht. „Schau uns an. Wie zwei Verschwörer. Setz dich erst mal zu mir.“",
        frech: "„Mann, du bist ja noch nervöser als ich“, kichert sie und boxt dich sanft gegen die Schulter. „Atme. Wir haben Zeit. Die ganze Ewigkeit, genau genommen.“",
        chaotisch: "Sie stolpert beim Näherkommen fast über die eigenen Füße und prustet los. „SIEHST du das? Sogar die Schwerkraft flirtet heute mit mir. Komm, setz dich.“",
        weise: "„Die schönsten Feuer brennen langsam“, sagt sie mit einem Schmunzeln und reicht dir die Hand. „Komm. Eile verdirbt den Wein.“",
      },
      choices: [
        { text: "Dich neben sie setzen, Schulter an Schulter.", tone: "pull", heat: -4,
          reply: "Eure Schultern berühren sich. Sie seufzt zufrieden — und lässt ihre Hand wie zufällig neben deiner liegen, die kleinen Finger fast verschränkt." },
        { text: "„Die ganze Ewigkeit, sagst du? Dann fangen wir besser jetzt an.“", tone: "push", heat: +9,
          reply: "Ihr Lachen verebbt zu einem Lächeln, das es in sich hat. „Da ist er wieder. Der Mut, den ich mag.“" },
        { text: "Mit ihr zusammen lachen und sie einfach ansehen.", tone: "tease", heat: +3,
          reply: "Für einen Moment sagt keiner etwas. Ihr seht euch nur an, und das Schweigen ist lauter als jedes Wort." },
      ],
    },

    // 3 — Stärker aufbauen: Begehren wird deutlich
    {
      line: {
        default: "Ihre Stimme wird leiser, fast ein Flüstern. „Weißt du, was ich seit Tagen denke, wenn ich dich sehe? Dinge, die ich besser nicht laut sage. Noch nicht.“",
        frech: "Sie beugt sich vor, ihr Mund ganz nah an deinem Ohr. „Ich hab da ein paar äußerst unanständige Gedanken über dich. Willst du raten, oder soll ich dir helfen?“",
        schuechtern: "Sie wird rot bis zu den Ohren, sagt es aber trotzdem. „Ich … ich denke nachts an dich. Und nicht nur ans Händchenhalten. Jetzt ist es raus.“",
        vertraeumt: "„In meinen Träumen“, haucht sie, „sind wir uns schon viel näher gekommen, als es sich gehört. Und jeden Morgen vermisse ich, was nie passiert ist.“",
      },
      choices: [
        { text: "„Sag es mir. Jedes einzelne Wort.“", tone: "push", heat: +18,
          reply: "Sie schließt für einen Moment die Augen, dann flüstert sie dir etwas zu, das deine Haut heiß werden lässt. Du hörst, wie ihr Atem schneller geht." },
        { text: "Ihre Hand nehmen und langsam darüber streichen.", tone: "push", heat: +15,
          reply: "Du zeichnest mit dem Daumen kleine Kreise auf ihren Handrücken. Ein Schauer läuft sichtbar über ihre Arme. „Das ist … unfair“, flüstert sie." },
        { text: "„Erst die Spannung genießen. Sag's mir gleich — nicht jetzt.“", tone: "pull", heat: -8,
          reply: "Sie stöhnt halb frustriert, halb begeistert auf. „Du machst mich wahnsinnig. Auf die allerbeste Art.“ Die Luft knistert nur umso mehr." },
      ],
    },

    // 4 — Verletzlicher Moment: kurz ernst, ehrlich (Spannung dippt, vertieft sich)
    {
      line: {
        default: "Plötzlich wird ihr Blick weich. „Darf ich ehrlich sein? Ich hab Angst, das hier zu wollen — weil ich es so sehr will. So etwas hatte ich lange nicht mehr.“",
        frech: "Für einen Moment fällt das freche Grinsen ab. „Okay, ganz ehrlich, ohne Show: Du bist der Erste seit Ewigkeiten, bei dem ich mich nicht verstecken will.“",
        schuechtern: "„Ich vertraue sonst niemandem so schnell“, sagt sie leise und sieht dich an. „Aber bei dir fühlt sich mutig sein nicht gefährlich an. Sondern richtig.“",
        weise: "Sie wird still. „Ich habe viele kommen und gehen sehen. Bei dir will ich, dass du bleibst. Das sage ich nicht leichtfertig.“",
      },
      choices: [
        { text: "„Ich gehe nirgendwohin. Ich bin genau da, wo ich sein will.“", tone: "push", heat: +10,
          reply: "Etwas in ihr entspannt sich und spannt sich zugleich neu an. Sie lehnt ihre Stirn an deine. „Dann lass uns nicht länger so tun, als wäre das hier nichts.“" },
        { text: "Sanft ihre Wange in die Hand nehmen.", tone: "push", heat: +12,
          reply: "Sie schmiegt sich in deine Handfläche und schließt die Augen. Als sie sie wieder öffnet, ist da kein Zögern mehr — nur noch Verlangen." },
        { text: "„Wir müssen nichts überstürzen. Ich bin hier.“", tone: "pull", heat: -5,
          reply: "Sie lächelt dankbar — und gerade weil du nicht drängst, rückt sie von selbst näher, bis ihr Knie an deinem liegt. „Genau deshalb will ich dich.“" },
      ],
    },

    // 5 — Höhepunkt der Spannung: heiß, dicht, atemlos
    {
      line: {
        default: "Jetzt ist da kein Abstand mehr. Ihre Lippen sind nur noch Millimeter von deinen entfernt, ihr Atem warm auf deiner Haut. „Ich kann nicht mehr nur reden“, flüstert sie.",
        frech: "Sie packt deinen Kragen und zieht dich zu sich, bis ihr euch fast berührt. „Schluss mit dem Vorspiel aus Worten“, raunt sie. „Ich will mehr. Jetzt.“",
        schuechtern: "Mutiger als je zuvor legt sie ihre Hand auf deine Brust, genau über deinem Herzschlag. „Es klopft so schnell wie meins“, flüstert sie. „Ich will nah bei dir sein. Ganz nah.“",
        energisch: "„Okay, ich halt's nicht mehr aus“, atmet sie und ist mit einem Mal ganz dicht an dir, ihre Stirn an deiner, beide außer Atem, obwohl ihr nur dasitzt.",
      },
      choices: [
        { text: "Sie küssen — endlich.", tone: "push", heat: +22,
          reply: "Der Kuss ist erst zart, dann alles andere als das. Sie zieht dich näher, ihre Finger in deinem Haar, und die Welt um euch herum verschwindet vollständig." },
        { text: "Knapp vor ihren Lippen innehalten und sie zappeln lassen.", tone: "tease", heat: +6,
          reply: "Du hältst inne, so nah, dass eure Lippen sich fast berühren. Sie wimmert leise vor Ungeduld. „Du … gemeiner …“ — und dann hält sie es nicht mehr aus." },
        { text: "„Nicht hier. Komm mit mir.“", tone: "push", heat: +16,
          reply: "Ihre Augen leuchten auf. „Ich dachte schon, du fragst nie.“ Sie greift nach deiner Hand und steht auf." },
      ],
    },

    // 6 — Einladung ins Haus (Schluss-Beat, schaltet Übergang frei)
    {
      finale: true,
      line: {
        default: "Sie steht auf, ohne deine Hand loszulassen, und sieht zur warm erleuchteten Tür ihres Hauses. „Drinnen ist es ruhig. Und wir sind ganz für uns.“ Sie zieht dich sanft mit sich.",
        frech: "„Mein Haus. Mein Bett. Meine Regeln“, grinst sie und geht rückwärts Richtung Tür, ohne deinen Blick loszulassen. „Na los, Held. Trau dich.“",
        schuechtern: "„Ich … ich würde dir gern etwas zeigen“, flüstert sie und führt dich zur Tür, die Wangen knallrot, das Lächeln strahlend. „Drinnen. Nur wir zwei.“",
        vertraeumt: "Sie zieht dich Richtung Tür, in den warmen Lichtschein. „Komm“, haucht sie. „Lass uns den Traum endlich wahr werden lassen.“",
      },
      choices: [
        { text: "💕 Gemeinsam ins Haus gehen.", tone: "push", heat: +10, enter: true,
          reply: "" },
      ],
    },
  ];

  const beatCount = BEATS.length;

  function getBeat(i) { return BEATS[Math.max(0, Math.min(beatCount - 1, i))]; }

  return { BEATS, beatCount, getBeat, flavor };
})();
