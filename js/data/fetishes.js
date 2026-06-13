"use strict";

/* ------------------------------------------------------------------
   Fetisch-System — gender-neutral designed.

   Jede gerettete Person bekommt prozedural einen Fetisch zugewiesen.
   Der Fetisch bestimmt, welche Dialog-Pfade im Herzgespräch ab
   Maturity 1+ verfügbar sind.

   Aufbau:
     FETISHES         — Katalog aller Fetische mit Metadaten
     FETISH_PERSONALITY — Mapping: welche Persönlichkeit mag welche Fetische
     FETISH_INTROS     — Erste Enthüllung des Fetischs im Gespräch
------------------------------------------------------------------ */

const FETISHES = {

  // ── Maturity 0 ─────────────────────────────────────────────
  romantic: {
    id: "romantic",
    label: "Romantisch",
    emoji: "🕯️",
    maturity: 0,
    playerRole: "Liebhaber:in",
    npcRole: "Geliebte:r",
    description: "Kerzenlicht, langsame Berührungen, tiefe Blicke — pure Hingabe.",
    personalities: ["schuechtern", "vertraeumt", "weise"],
    tags: ["soft", "emotional", "slow"],
  },

  // ── Maturity 1 ─────────────────────────────────────────────
  exhibition: {
    id: "exhibition",
    label: "Gesehen werden",
    emoji: "👁️",
    maturity: 1,
    playerRole: "Zuschauer:in",
    npcRole: "Mittelpunkt",
    description: "Der Kitzel, beobachtet zu werden — am Fenster, im Freien, überall wo Entdeckung droht.",
    personalities: ["froehlich", "frech", "chaotisch"],
    tags: ["public", "risk", "visual"],
  },

  praise_worship: {
    id: "praise_worship",
    label: "Lob & Verehrung",
    emoji: "🙏",
    maturity: 1,
    playerRole: "Verehrer:in",
    npcRole: "Angebetete:r",
    description: "Jeder Zentimeter Haut wird gewürdigt. Jeder Laut ist ein Gebet.",
    personalities: ["schuechtern", "vertraeumt", "weise"],
    tags: ["devotion", "body", "verbal"],
  },

  sensory_play: {
    id: "sensory_play",
    label: "Sinnenspiel",
    emoji: "🕶️",
    maturity: 1,
    playerRole: "Verführer:in",
    npcRole: "Genießer:in",
    description: "Verbundene Augen, Federn, Eiswürfel, warmes Öl — jeder Nerv wird einzeln geweckt.",
    personalities: ["froehlich", "schuechtern", "weise"],
    tags: ["blindfold", "temperature", "touch"],
  },

  brat: {
    id: "brat",
    label: "Trotzkopf",
    emoji: "😈",
    maturity: 1,
    playerRole: "Bändiger:in",
    npcRole: "Herausforder:in",
    description: "Freche Sprüche, provozierende Blicke — und das süße Spiel, wer zuerst nachgibt.",
    personalities: ["frech", "chaotisch", "energisch"],
    tags: ["defiance", "power_play", "verbal"],
  },

  rough_passionate: {
    id: "rough_passionate",
    label: "Wild & Leidenschaftlich",
    emoji: "🔥",
    maturity: 1,
    playerRole: "Sturm",
    npcRole: "Feuer",
    description: "Gegen die Wand, Kleidung zerreißen, keuchend und atemlos.",
    personalities: ["energisch", "frech", "chaotisch"],
    tags: ["intense", "physical", "urgent"],
  },

  roleplay_power: {
    id: "roleplay_power",
    label: "Machtspiel",
    emoji: "👑",
    maturity: 1,
    playerRole: "Untergebene:r",
    npcRole: "Herrscher:in",
    description: "Befehle, Gehorsam, strenge Blicke — und süße Belohnungen.",
    personalities: ["frech", "weise", "energisch"],
    tags: ["dominance", "commands", "discipline"],
  },

  roleplay_naughty: {
    id: "roleplay_naughty",
    label: "Verruchte Rolle",
    emoji: "🎭",
    maturity: 1,
    playerRole: "Gegenüber",
    npcRole: "Darsteller:in",
    description: "Fremde, die sich in einer Bar begegnen. Oder Nachbar:innen mit Geheimnissen. Jedes Mal eine neue Geschichte.",
    personalities: ["froehlich", "frech", "chaotisch"],
    tags: ["strangers", "scenario", "creative"],
  },

  roleplay_mentor: {
    id: "roleplay_mentor",
    label: "Lehrstunde",
    emoji: "📖",
    maturity: 1,
    playerRole: "Schüler:in",
    npcRole: "Lehrer:in",
    description: "Erfahrene Hände führen. Geduldige Stimme erklärt. Jede Lektion eine Offenbarung.",
    personalities: ["weise", "schuechtern", "vertraeumt"],
    tags: ["teaching", "guidance", "experience"],
  },

  // ── Maturity 2 ─────────────────────────────────────────────
  bondage_soft: {
    id: "bondage_soft",
    label: "Sanfte Fesseln",
    emoji: "🪢",
    maturity: 2,
    playerRole: "Fesselnde:r",
    npcRole: "Hingebungsvoll",
    description: "Seidentücher um Handgelenke, Ausgeliefertsein als Geschenk, Kontrolle abgeben und darin Freiheit finden.",
    personalities: ["frech", "energisch", "chaotisch"],
    tags: ["restraint", "trust", "surrender"],
  },

  edging: {
    id: "edging",
    label: "Hinhalten",
    emoji: "⏳",
    maturity: 2,
    playerRole: "Kontrolleur:in",
    npcRole: "Wartende:r",
    description: "Immer wieder kurz davor — und dann zurück. Die Spannung wird zur reinsten Qual und größten Lust zugleich.",
    personalities: ["energisch", "frech", "weise"],
    tags: ["control", "buildup", "patience"],
  },

  primal: {
    id: "primal",
    label: "Animalisch",
    emoji: "🐺",
    maturity: 2,
    playerRole: "Jäger:in",
    npcRole: "Beute",
    description: "Jagen und erjagt werden. Instinkt übernimmt. Knurren, kratzen, fordern.",
    personalities: ["energisch", "chaotisch", "frech"],
    tags: ["hunt", "instinct", "feral"],
  },
};

// Welche Fetische eine Persönlichkeit haben kann (2-3 Optionen)
const FETISH_PERSONALITY = {
  froehlich:    ["exhibition", "roleplay_naughty", "sensory_play"],
  schuechtern:  ["praise_worship", "sensory_play", "romantic"],
  frech:        ["bondage_soft", "brat", "roleplay_power"],
  vertraeumt:   ["romantic", "sensory_play", "praise_worship"],
  energisch:    ["rough_passionate", "edging", "bondage_soft"],
  weise:        ["roleplay_mentor", "praise_worship", "sensory_play"],
  chaotisch:    ["brat", "exhibition", "roleplay_naughty"],
};

// Erste Enthüllung des Fetischs — pro Persönlichkeit formuliert.
// Wird im zweiten Teil des Herzgesprächs eingeblendet, wenn die Spannung
// hoch genug ist und Maturity 1+ erreicht wurde.
const FETISH_INTROS = {
  exhibition: {
    froehlich: "„Weißt du, was ich am aufregendsten finde?“, flüstert sie und wirft einen Blick zum erleuchteten Fenster. „Dass uns vielleicht jemand sieht. Und ich will, dass sie es sehen.“",
    frech: "Sie geht langsam zum Fenster, lehnt sich gegen den Rahmen und zieht dich am Kragen mit. „Ich hoffe, du hast nichts dagegen, Publikum zu haben“, raunt sie. „Ich hab's nämlich gern.“",
    chaotisch: "„Okay, wilde Idee!“, platzt sie heraus und deutet auf den Balkon. „Was, wenn wir … da draußen? Jetzt gleich? Oder ist das zu verrückt? Sag nicht, dass es zu verrückt ist!“",
  },
  praise_worship: {
    schuechtern: "Sie wird ganz still und sieht dich an, als wärst du das Kostbarste im ganzen Jenseits. „Darf ich … darf ich dich einfach nur ansehen? Jeden Zentimeter? Und dir sagen, was ich sehe?“",
    vertraeumt: "„Manchmal“, haucht sie, „träume ich davon, dich mit Worten zu berühren. Jede Stelle zu beschreiben, bis du sie spürst, ohne dass ich mich bewege.“",
    weise: "„Komm her“, sagt sie mit ihrer tiefen, rauchigen Stimme. „Lass mich dir zeigen, was ich sehe, wenn ich dich ansehe. Es ist … atemberaubend.“",
  },
  sensory_play: {
    froehlich: "„Ich hab eine Überraschung!“, verkündet sie und hält ein Seidentuch hoch. „Vertraust du mir? Dann mach die Augen zu. Ich verspreche, du wirst jeden Moment davon spüren.“",
    schuechtern: "„Ich … ich hab etwas mitgebracht“, flüstert sie und holt eine weiche Feder aus ihrer Tasche. „Darf ich? Nur ganz leicht. Über deine Haut.“",
    weise: "„Schließ die Augen“, murmelt sie. „Die Dunkelheit schärft die Sinne. Du wirst Dinge fühlen, die du noch nie gespürt hast.“",
  },
  brat: {
    frech: "„Ach ja?“, grinst sie und stemmt die Hände in die Hüften. „Du denkst also, du bestimmst hier den Ablauf? Dann überzeug mich doch.“",
    chaotisch: "„Warte, warte!“, sie springt auf und stellt sich mit verschränkten Armen vor dich. „Bevor das hier weitergeht: Ich habe Bedingungen. Drei Stück. Und du wirst keine davon mögen!“",
    energisch: "„Okay, Stopp.“ Sie hält eine Hand hoch, die andere an deiner Brust. „Ich hab heute das Kommando. Wenn du brav bist, kriegst du eine Belohnung. Wenn nicht …“, sie grinst, „auch.“",
  },
  rough_passionate: {
    energisch: "„Ich hab's satt, brav zu sitzen“, keucht sie und reißt dich hoch. „Ich will, dass es knallt. Dass wir danach zittern. Bist du bereit dafür?“",
    frech: "„Schluss mit den Nettigkeiten“, raunt sie, ihre Fingernägel graben sich in deine Schulter. „Ich hoffe, das hier ist stabil.“ Sie deutet auf die Wand hinter dir.",
    chaotisch: "„OKAY!“, ruft sie und reißt sich den Pullover über den Kopf. „Genug geredet! Ich will Action! Wand? Tisch? Bett? Mir egal, Hauptsache JETZT!“",
  },
  roleplay_power: {
    frech: "„Weißt du was? Heute spielen wir ein Spiel.“ Sie setzt sich mit gekreuzten Beinen aufs Sofa und mustert dich von oben bis unten. „Ich bin deine Chefin. Und du … willst wohl eine Gehaltserhöhung?“",
    weise: "„Setz dich“, sagt sie, und es ist keine Bitte. „Heute Abend bin ich nicht die Weise vom See. Sondern deine Lehrerin. Lektion eins: Gehorchen.“",
    energisch: "„Okay, neue Regel“, sie tippt dir auf die Brust. „Du machst, was ich sage. Ohne Fragen. Ohne Zögern. Und danach … wirst du mir danken.“",
  },
  roleplay_naughty: {
    froehlich: "„Lass uns so tun, als würden wir uns nicht kennen!“, schlägt sie vor und zupft an ihrem Haar. „Hi, ich bin die Neue. Und du siehst aus wie jemand, der genau weiß, was er will.“",
    frech: "„Neues Spiel“, grinst sie und lehnt sich lässig gegen die Tür. „Ich bin eine Fremde. Du hast mich gerade in einer Bar getroffen. Und jetzt … überzeug mich, mitzukommen.“",
    chaotisch: "„Okay okay okay!“, sie hopst aufgeregt. „Du bist der geheimnisvolle Neue im Dorf. Und ich bin … die Dorfschönheit mit dunklen Geheimnissen. Action!“",
  },
  roleplay_mentor: {
    weise: "„Komm, setz dich zu mir.“ Sie klopft auf den Platz neben sich. „Ich werde dir etwas beibringen, das in keinem Buch steht. Die Kunst der Berührung.“",
    schuechtern: "„Ähm … ich hab was vorbereitet“, gesteht sie und holt eine Rolle mit gezeichneten Diagrammen hervor. „Das klingt jetzt komisch, aber … ich glaube, ich könnte dir was zeigen. Über … uns.“",
    vertraeumt: "„Ich hab so viel gelernt in all den Jahren“, haucht sie und nimmt deine Hand. „Lass mich deine Lehrerin sein. Nur für heute Nacht.“",
  },
  bondage_soft: {
    frech: "„Hast du schon mal die Kontrolle abgegeben?“, fragt sie und lässt ein Seidentuch durch ihre Finger gleiten. „Keine Angst. Ich halte dich. Oder … du hältst mich?“",
    energisch: "„Okay, ich geb's zu: Ich hab' Seidentücher mitgebracht.“ Sie hält sie hoch. „Das hat nichts mit 'gefesselt werden' zu tun. Okay, doch. Genau das hat's.“",
    chaotisch: "„Rate mal, was ich heute Morgen gebastelt habe!“, sie zieht kunstvoll verknotete Tücher aus ihrer Tasche. „Keine Sorge, ich hab's geübt. An einem Stuhl. Der Stuhl hat's überlebt!“",
  },
  edging: {
    energisch: "„Weißt du, was mich wahnsinnig macht?“, sie beißt sich auf die Lippe. „Fast haben. Immer wieder fast. Und dann …“, sie schüttelt sich. „Gott, ich will, dass du mich quälst.“",
    frech: "„Heute Abend“, raunt sie, „darfst du mich nicht anfassen. Noch nicht. Erst wenn ich es sage. Und ich werde es nicht sagen. Bis du …“, sie stockt. „… fast verrückt wirst.“",
    weise: "„Geduld ist die höchste Tugend“, zitiert sie mit einem schiefen Lächeln. „Und zugleich die grausamste. Heute Nacht üben wir beides.“",
  },
  primal: {
    energisch: "Sie stellt sich breitbeinig hin, die Augen funkeln im Kaminlicht. „Ich hab heute keinen Bock auf sanft. Keine Kerzen, keine Gedichte. Ich will dich jagen. Und du mich. Wer zuerst aufgibt, verliert.“",
    chaotisch: "„GRRRR!“, sie knurrt und macht eine Prankenbewegung mit den Händen. „Ich bin heute Nacht ein wildes Tier. Und du … bist meine Beute. Renn!“",
    frech: "Sie schiebt die Unterlippe vor, ihr Blick wird dunkel. „Ich will nicht reden. Ich will nicht denken. Ich will einfach … fühlen. Ur-instinktiv. Verstehst du, was ich meine?“",
  },
  romantic: {
    schuechtern: "„Alles hier ist so schön“, flüstert sie mit glänzenden Augen. „Die Kerzen. Der Kamin. Du. Können wir … einfach ganz langsam machen? Jede Sekunde auskosten?“",
    vertraeumt: "„Ich hab von diesem Abend geträumt“, haucht sie. „Keine Eile. Keine Show. Nur du und ich, und die ganze Nacht vor uns.“",
    weise: "„Setz dich zu mir ans Feuer“, sagt sie und gießt Wein ein. „Wir haben nichts zu beweisen. Nur zu genießen.“",
  },
};
