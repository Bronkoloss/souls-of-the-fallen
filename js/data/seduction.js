"use strict";

/* ------------------------------------------------------------------
   Herzgespräch — verzweigter, fortlaufender Verführungs-Dialog.

   EXPANDED: 15 Beats (M0), + M1 explizit-romantisch, + M2 fetisch-
   spezifisch, + M3 intensiv. Jeder Beat mit allen 7 Persönlichkeiten.

   Spannungskurve über 15 Beats:
     Beat 0-3   — Einstieg, warm, spielerisch
     Beat 4-6   — Nähe aufbauen, erste Berührungen
     Beat 7-9   — Verlangen wird explizit, Spannung steil
     Beat 10-11 — Verletzlicher Moment, Echtheit
     Beat 12-13 — Höhepunkt, atemlos
     Beat 14    — Einladung ins Haus (Finale)

   M1 (Entkleiden + Erfüllung): explizite Beschreibungen von Körper,
   Berührungen und Vereinigung. Romantisch-sinnlicher Ton.
   M2 (Fetisch): fetisch-spezifische Dialogpfade.
   M3 (Intensiv): härteste Varianten.
------------------------------------------------------------------ */

const Seduction = (() => {

  const flavor = (map, d) => {
    if (typeof map === "function") return map(d);
    if (typeof map === "string") return map;
    return (d && map[d.personality]) || map.default || "";
  };

  const pickFrom = (arr) => arr[(Math.random() * arr.length) | 0];

  // ============= M0 — Erweiterte Beats (15, atmosphärisch-andeutend) =============
  const BEATS = [

    // 0 — Einstieg: warm, schon leicht aufgeladen
    {
      line: {
        default: "Du bist gekommen. Den ganzen Tag habe ich gehofft, dass du es tust … und jetzt, wo du hier stehst, weiß ich plötzlich nicht, wohin mit meinen Händen.",
        froehlich: "Da bist du ja! Ich hab den ganzen Tag auf diesen Moment gewartet — und jetzt bin ich aufgeregt wie ein kleines Kind. Komm, setz dich zu mir!",
        schuechtern: "Oh … du bist wirklich da. Ich … ich habe geübt, was ich sagen will, und jetzt ist alles weg. Mein Herz macht gerade ziemlichen Lärm.",
        frech: "Sieh an. Du traust dich also doch. Ich hatte schon gewettet, du würdest kneifen — schön, dass ich verliere. Diesmal.",
        vertraeumt: "Ich habe von genau diesem Moment geträumt. Du, das warme Licht, und dieses Kribbeln, das mir sagt: jetzt passiert etwas.",
        energisch: "ENDLICH! Ich dachte schon, du kommst nie! Setz dich, ich hab uns was zu trinken besorgt. Keine Ausreden!",
        weise: "Ah, da bist du. Ich habe den Tee warmgehalten. Und das Gespräch im Geiste schon begonnen. Komm, setz dich.",
        chaotisch: "DU! Perfekt! Ich hab keine Ahnung, was ich sagen wollte, aber ich wollte UNBEDINGT, dass du da bist!",
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
        froehlich: "Sie hopst aufgeregt näher. „Okay, ich geb's zu: Ich bin EXTREM froh, dass du hier bist. So froh, dass ich kurz davor bin zu platzen!“",
        schuechtern: "Sie wagt sich näher, ihre Finger spielen nervös mit einer Haarsträhne. „Ich … ich bin sonst nie so. Aber bei dir will ich mutig sein.“",
        frech: "„Weißt du, was dein Problem ist?“ Sie grinst und kommt näher. „Du siehst aus, als würdest du dich gerade enorm zusammenreißen. Tu's nicht.“",
        vertraeumt: "Sie gleitet näher, als würde der Wind sie tragen. „Der Abend riecht nach Jasmin und … nach Möglichkeit. Nach uns.“",
        energisch: "„Okay, ich sag's einfach“, platzt sie heraus und steht plötzlich dicht vor dir. „Mein Puls geht gerade wie nach einem Sprint. Und du bist schuld.“",
        weise: "„Setz dich näher“, sagt sie mit ihrer tiefen Stimme und rückt selbst ein Stück. „Die besten Gespräche führt man von Herz zu Herz.“",
        chaotisch: "Sie stolpert fast über deine Füße und landet näher als geplant. „Das war Absicht!“, behauptet sie. „Absolut kalkuliert. Okay, war's nicht.“",
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

    // 2 — Erste Komplimente, langsam tiefer graben
    {
      line: {
        default: "„Du siehst mich an, als würdest du etwas in mir sehen, das ich selbst nicht sehe“, murmelt sie und lehnt sich kaum merklich vor. „Was siehst du da?“",
        froehlich: "„Okay, ernste Frage: Was gefällt dir am meisten an mir? Außer meiner offensichtlich atemberaubenden Persönlichkeit!“, grinst sie breit.",
        schuechtern: "Sie ringt kurz mit sich, dann fragt sie leise: „Warum … warum bist du eigentlich zu mir gekommen? Von allen, die hier sind?“",
        frech: "„Mal ehrlich“, sie stupst dich an, „was findest du eigentlich an mir? Und sag jetzt nichts Langweiliges wie 'deine Augen'.“",
        vertraeumt: "„Manchmal frage ich mich“, haucht sie, „ob du mich genauso siehst wie die anderen. Oder … ob du mehr siehst.“",
        energisch: "„Okay, Stopp!“, sie hält eine Hand hoch. „Bevor das hier weitergeht: Was ist das Erste, was dir an mir aufgefallen ist? Ich will's genau wissen!“",
        weise: "„Sag mir eins“, bittet sie mit einem milden Lächeln, „was bewegt dich, immer wieder hierher zu kommen? Zu mir?“",
        chaotisch: "„Schnelle Frage — nein, warte, langsame Frage: Wenn du mich in drei Worten beschreiben müsstest, welche wären es? Aber die WAHREN drei!“",
      },
      choices: [
        { text: "„Du hast etwas, das ich bei niemand sonst gefunden habe. Und ich suche schon lange.“", tone: "push", heat: +15,
          reply: "Etwas in ihrem Gesicht wird weich. Sie schluckt. „Das … das ist das Schönste, was mir jemand gesagt hat. Seit sehr langer Zeit.“" },
        { text: "„Dein Lachen. Es ist das Erste, was mir aufgefallen ist — und das Letzte, was ich je vergessen will.“", tone: "tease", heat: +10,
          reply: "Und da ist es — genau dieses Lachen. Hell, warm und nur für dich. „Du machst mich ganz verlegen“, gesteht sie glücklich." },
        { text: "„Ich sehe jemanden, der zu selten gesagt bekommt, wie besonders er ist.“", tone: "push", heat: +11,
          reply: "Sie verstummt kurz. Als sie wieder spricht, ist ihre Stimme ein kleines bisschen zittrig. „Du hast ja keine Ahnung, wie recht du hast.“" },
      ],
    },

    // 3 — Bewusste Entspannung: Lachen, Leichtigkeit
    {
      line: {
        default: "Sie lacht plötzlich, hell und ehrlich, und der Moment wird ganz leicht. „Schau uns an. Wie zwei Verschwörer. Setz dich erst mal zu mir.“",
        froehlich: "„HA! Weißt du was? Mit dir zu reden ist wie ein Sonnenbad für die Seele! Komm, rück näher, die Bank ist breit genug für uns beide!“",
        schuechtern: "Ein leises Kichern entwischt ihr, und sie hält erschrocken die Hand vor den Mund. „Entschuldige … ich bin nur … du machst mich irgendwie … froh.“",
        frech: "„Mann, du bist ja noch nervöser als ich“, kichert sie und boxt dich sanft gegen die Schulter. „Atme. Wir haben Zeit. Die ganze Ewigkeit, genau genommen.“",
        vertraeumt: "Ein verträumtes Lächeln breitet sich aus. „Weißt du, was das Schönste an der Ewigkeit ist? Dass kein Moment zu kurz ist für das, was wir fühlen.“",
        energisch: "„OKAY, genug ernst!“, lacht sie und klatscht in die Hände. „Jetzt wird's locker! Setz dich, ich erzähl dir was Lustiges!“",
        weise: "„Hm. Du hast die Gabe, mich zum Lachen zu bringen“, schmunzelt sie. „Das schaffen nur wenige. Setz dich, junger Freund.“",
        chaotisch: "Sie stolpert beim Näherkommen fast über die eigenen Füße und prustet los. „SIEHST du das? Sogar die Schwerkraft flirtet heute mit mir. Komm, setz dich!“",
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

    // 4 — Tieferes Kennenlernen, kleine Geheimnisse
    {
      line: {
        default: "„Darf ich dir ein Geheimnis verraten?“, flüstert sie. „Ich war noch nie so aufgeregt wegen jemandem. Und ich war mal ZOMBIE.“",
        froehlich: "„Okay, Geheimnis-Zeit!“, sie beugt sich verschwörerisch vor. „Ich hab noch NIE jemandem gesagt, was ich wirklich will. Aber dir … dir würde ich's sagen.“",
        schuechtern: "Sie zögert, dann nimmt sie all ihren Mut zusammen. „Ich … ich hab mir vorgestellt, wie das hier läuft. Seit Tagen. Und es ist … besser.“",
        frech: "„Okay, ich sag dir was, das ich noch nie jemandem gesagt hab.“ Sie grinst schief. „Du machst mich tatsächlich nervös. Und ich bin NIE nervös.“",
        vertraeumt: "„In meinen Träumen“, haucht sie, „bist du mir schon so oft begegnet, dass ich manchmal nicht weiß, ob ich gerade wach bin oder nicht.“",
        energisch: "„Weißt du, was das Verrückte ist?“, sie trommelt mit den Fingern auf ihrem Knie. „Normalerweise red ich ohne Punkt und Komma. Bei dir … überleg ich jedes Wort.“",
        weise: "„Ich habe viel erlebt“, sagt sie leise, „und wenig bereut. Aber dich nicht näher kennenzulernen — das wäre ein Fehler gewesen.“",
        chaotisch: "„PSST!“, zischt sie und schaut sich theatralisch um. „Höchst geheime Information: Ich find dich wirklich, wirklich toll. Aber sag's keinem!“",
      },
      choices: [
        { text: "„Du bist auch das Aufregendste, das mir seit langem passiert ist.“", tone: "push", heat: +14,
          reply: "Sie strahlt, und in diesem Strahlen liegt etwas, das tiefer geht als Freude — Erleichterung, Vertrauen, der Anfang von etwas Großem." },
        { text: "Sanft ihre Hand nehmen und nicht mehr loslassen.", tone: "push", heat: +16,
          reply: "Eure Finger verschränken sich wie von selbst. Ihre Hand ist warm, zittert ein bisschen, und krallt sich dann fest. „Okay. Jetzt will ich das nie wieder anders.“" },
        { text: "„Erzähl mir mehr. Ich will wirklich alles über dich wissen.“", tone: "tease", heat: +8,
          reply: "Sie sieht dich überrascht an — dann beginnt sie zu erzählen. Von früher, von Träumen, von Dingen, die sie nie laut gesagt hat." },
      ],
    },

    // 5 — Langsam werden die Blicke intensiver
    {
      line: {
        default: "Ihr Blick bleibt an deinem hängen, länger als zuvor. Irgendwas hat sich verändert — die Luft ist wärmer, die Stille voller. „Du weißt schon, was du mit mir machst, oder?“",
        froehlich: "„Achtung!“, warnt sie mit einem breiten Grinsen. „Gefährliche Zone! Wenn du mich weiter so ansiehst, kriegst du hier nie wieder eine normale Unterhaltung mit mir!“",
        schuechtern: "Ihre Wangen glühen, aber sie wendet den Blick nicht ab. „Ich weiß nicht, was mit mir passiert“, flüstert sie. „Aber ich will, dass es weitergeht.“",
        frech: "„Okay, du gewinnst“, murmelt sie und hält deinem Blick stand. „Normalerweise bin ICH diejenige, die andere verlegen macht. Respekt.“",
        vertraeumt: "„Deine Augen“, haucht sie, „sind wie ein See, in dem ich mich verlieren will. Und ich will gar nicht gefunden werden.“",
        energisch: "Sie hält deinem Blick stand, die Kiefer angespannt. „Du. Ich. Später.“ Mehr sagt sie nicht — mehr muss sie nicht sagen.",
        weise: "Langsam, ganz langsam neigt sie den Kopf. „Du hast etwas an dir, das mich aus der Reserve lockt. Das ist selten. Und kostbar.“",
        chaotisch: "„ALARM!“, flüstert sie dramatisch. „Alarmstufe: Schmetterlinge im Bauch! Ich wiederhole: Schmetterlinge!“ Sie grinst, aber ihr Puls ist echt.",
      },
      choices: [
        { text: "Den Blick erwidern und langsam näher rücken.", tone: "push", heat: +17,
          reply: "Die Zentimeter zwischen euch schrumpfen. Sie atmet schneller, ihre Lippen öffnen sich leicht. Keiner spricht — keiner muss." },
        { text: "„Ich weiß genau, was ich mit dir mache. Und ich weiß, dass du es genießt.“", tone: "push", heat: +15,
          reply: "Ein Schauer läuft über ihre Arme. „Ja“, haucht sie. „Ja, das tu ich. Und ich will mehr davon.“" },
        { text: "Den Moment auskosten, einfach die Spannung genießen.", tone: "tease", heat: +6,
          reply: "Du lehnst dich zurück, siehst sie an, und dein Blick sagt alles. Sie zappelt — auf die allerbeste Art." },
      ],
    },

    // 6 — Erste zaghafte Berührungen jenseits der Hände
    {
      line: {
        default: "Ihre Fingerspitzen finden deinen Unterarm — wie zufällig, aber gar nicht zufällig. „Deine Haut ist warm“, murmelt sie. „Ich wollte das schon den ganzen Abend tun.“",
        froehlich: "„Weißt du was? Ich hab beschlossen, mutig zu sein!“, verkündet sie und legt eine Hand auf deinen Arm. Ihr Puls rast, aber sie grinst. „Gar nicht so schwer!“",
        schuechtern: "Mit der Tapferkeit einer Löwin legt sie ihre Hand auf deine. Sie zittert, aber sie zieht nicht zurück. „So … so fühlt sich das also an.“",
        frech: "„Ich hoffe, du hast nichts dagegen“, sagt sie und fährt mit einem Finger langsam über deinen Unterarm. Ihr Grinsen ist herausfordernd — ihre Augen verraten, wie sehr sie das mitnimmt.",
        vertraeumt: "„Darf ich?“, fragt sie und legt ihre Handfläche auf deinen Handrücken. „Deine Haut ist wie … wie warmer Samt. Ich will nicht mehr aufhören.“",
        energisch: "Ohne Vorwarnung nimmt sie deine Hand und drückt sie. „So. Jetzt ist es raus. Ich will dich anfassen. Deal with it.“",
        weise: "„Gestatten?“, fragt sie leise und legt ihre Fingerspitzen auf dein Handgelenk. „Dein Puls … spricht Bände.“",
        chaotisch: "„OH! Deine Hand ist ja total weich!“, ruft sie und greift danach, bevor sie sich bremsen kann. „Äh. Das war vielleicht ein bisschen direkt. Egal. Bereue nichts!“",
      },
      choices: [
        { text: "Deine Hand umdrehen und ihre Finger einfangen.", tone: "push", heat: +18,
          reply: "Eure Finger verschränken sich. Du spürst ihren Puls an den Fingerspitzen. „Das …“, flüstert sie. „Das ist noch besser, als ich's mir vorgestellt hab.“" },
        { text: "Ihren Unterarm entlang streichen, langsam und bewusst.", tone: "push", heat: +16,
          reply: "Sie schließt die Augen. Unter deiner Berührung stellt sich ihre Haut auf. „Oh Gott“, haucht sie. „Mach das nochmal.“" },
        { text: "Ihre Hand an deine Wange führen.", tone: "pull", heat: +8,
          reply: "Ihre kühlen Finger an deiner warmen Wange. Sie hält den Atem an. „Du … du machst das alles so einfach“, flüstert sie dankbar." },
      ],
    },

    // 7 — Stärker aufbauen: Begehren wird deutlich
    {
      line: {
        default: "Ihre Stimme wird leiser, fast ein Flüstern. „Weißt du, was ich seit Tagen denke, wenn ich dich sehe? Dinge, die ich besser nicht laut sage. Noch nicht.“",
        froehlich: "„Okay, ich muss was gestehen!“, sie wird plötzlich ungewöhnlich ernst — fast. „Ich hab nachts von dir geträumt. Und es war … also sagen wir: kein Kindergeburtstag.“",
        schuechtern: "Sie wird rot bis zu den Ohren, sagt es aber trotzdem. „Ich … ich denke nachts an dich. Und nicht nur ans Händchenhalten. Jetzt ist es raus.“",
        frech: "Sie beugt sich vor, ihr Mund ganz nah an deinem Ohr. „Ich hab da ein paar äußerst unanständige Gedanken über dich. Willst du raten, oder soll ich dir helfen?“",
        vertraeumt: "„In meinen Träumen“, haucht sie, „sind wir uns schon viel näher gekommen, als es sich gehört. Und jeden Morgen vermisse ich, was nie passiert ist.“",
        energisch: "„Okay. Letzte Chance, das Gespräch zu wechseln“, warnt sie mit einem Funkeln in den Augen. „Danach … wird's persönlich. Sehr persönlich.“",
        weise: "„Die Gedanken, die ich in deiner Gegenwart habe“, raunt sie, „sind alles andere als weise. Aber ich bereue keins davon.“",
        chaotisch: "„WARNUNG!“, ruft sie und hält einen Finger hoch. „Was ich jetzt sage, könnte deine Sicht auf mich … naja, erheblich verändern. Zum Guten. Oder Verruchten. Beides!“",
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

    // 8 — Die Spannung kocht, erste explizite Worte
    {
      line: {
        default: "Sie rückt noch näher, ihr Knie an deinem, ihr Atem warm an deinem Hals. „Ich will, dass du mich anfasst. Ich hab zu lange gewartet, um das nicht zu sagen.“",
        froehlich: "„Okay, SCHLUSS mit brav!“, sie packt deine Hände. „Ich bin normalerweise nicht so, aber ich will dich spüren. Richtig. Kein 'vielleicht' und 'später'. JETZT.“",
        schuechtern: "Sie zittert am ganzen Körper, aber ihre Stimme ist klar. „Ich hab noch nie sowas gesagt, aber … fass mich an. Bitte. Ich halt es nicht mehr aus.“",
        frech: "„Rate mal, was ich will“, murmelt sie dicht an deinem Ohr. „Kleiner Tipp: Es hat nichts mit Reden zu tun. Und alles mit deinen Händen.“",
        vertraeumt: "„Träume sind schön“, haucht sie und führt deine Hand an ihre Taille, „aber das hier ist besser. So viel besser. Lass mich nicht warten.“",
        energisch: "Sie packt dein Hemd und zieht dich zu sich. „Ich hab den ganzen Abend darüber nachgedacht, wie sich deine Hände auf meiner Haut anfühlen. Zeig's mir.“",
        weise: "„Ich bin alt genug, um zu wissen, was ich will“, sagt sie mit tiefer, fester Stimme. „Und ich will dich. Hier. Jetzt. Keine Umschweife mehr.“",
        chaotisch: "„OKAY, ich sag's!“, platzt sie heraus. „Ich will, dass du mich anfasst! Überall! Nein, nicht überall-überall, aber — doch, überall-überall!“",
      },
      choices: [
        { text: "Die Hand an ihre Hüfte legen und sie an dich ziehen.", tone: "push", heat: +20,
          reply: "Deine Hand an ihrer Hüfte, fest und sicher. Sie schnappt nach Luft, dann schmiegt sie sich an dich, als gäbe es keinen Ort im ganzen Jenseits, an dem sie lieber wäre." },
        { text: "Mit den Fingerspitzen ihren Nacken entlang fahren.", tone: "push", heat: +17,
          reply: "Du zeichnest die Linie ihres Nackens nach, vom Haaransatz bis zur Schulter. Sie erschauert unter deiner Berührung. „Mehr“, verlangt sie leise. „Viel mehr.“" },
        { text: "„Ich will dich auch. Aber ich will mir Zeit lassen mit dir.“", tone: "tease", heat: +5,
          reply: "Sie stöhnt auf — halb genervt, halb elektrisiert. „Du … Folterknecht. Aber okay. Wenn's danach umso besser wird …“" },
      ],
    },

    // 9 — Küsse und Berührungen werden konkret
    {
      line: {
        default: "Ihre Lippen sind jetzt ganz nah, dein eigener Atem stockt. „Küss mich“, flüstert sie. „Ich hab zu lange davon geträumt, wie das schmeckt.“",
        froehlich: "Sie strahlt dich an, dann wird ihr Blick weich und tief. „Ich will, dass du mich küsst“, sagt sie. Kein Scherz, kein Lachen — nur purer Wunsch.",
        schuechtern: "„Ich … ich will dich küssen“, haucht sie und schließt die Augen. „Es ist okay, wenn du nicht —“ Sie kommt nicht weiter, weil sie zu sehr hofft, dass du es tust.",
        frech: "„Letzte Warnung“, grinst sie, aber ihre Stimme zittert. „Wenn du mich jetzt nicht küsst, mach ich's. Und ich bin deutlich weniger sanft als du.“",
        vertraeumt: "„Ein Kuss“, haucht sie, „ist wie der erste Tropfen Regen nach einer Dürre. Ich will den Regen. Ich will den Sturm. Küss mich.“",
        energisch: "Sie sieht dich herausfordernd an, aber ihre Hände zittern. „Trau dich“, flüstert sie. „Küss mich. Oder muss ich den ersten Schritt machen?“",
        weise: "„Manche Dinge“, murmelt sie und kommt näher, „sollte man nicht länger zerdenken.“ Und dann ist sie so nah, dass es kein Zurück mehr gibt.",
        chaotisch: "„OKAY OKAY OKAY!“, sie hüpft auf der Stelle. „Ich versuch's cool zu sagen, aber ich kann nicht: KÜSS MICH! BITTE! JETZT!“",
      },
      choices: [
        { text: "Sie küssen — endlich, tief und lange.", tone: "push", heat: +22,
          reply: "Der erste Kuss ist zart, der zweite tiefer, und beim dritten schmeckt du, wie sehr sie das will. Ihre Finger krallen sich in dein Haar, und für diesen Moment existiert nichts anderes mehr." },
        { text: "Knapp vor ihren Lippen innehalten, die Spannung ins Unerträgliche treiben.", tone: "tease", heat: +7,
          reply: "Du verharrst Millimeter vor ihren Lippen. Ihr Atem geht stoßweise. „Du … gemeiner …“, wimmert sie. Und dann hält sie es nicht mehr aus und überbrückt die letzte Distanz selbst." },
        { text: "„Jetzt.“ Mehr sagst du nicht — und küsst sie.", tone: "push", heat: +18,
          reply: "Ein Wort, dann Stille, die von Lippen gefüllt wird. Alles, was zurückgehalten wurde, bricht sich Bahn." },
      ],
    },

    // 10 — Nach dem ersten Kuss, die Welt hat sich verändert
    {
      line: {
        default: "Ihr löst euch voneinander, atemlos, Stirn an Stirn. „Wow“, haucht sie. „Das … das war noch besser, als ich's mir in tausend Träumen ausgemalt hab.“",
        froehlich: "„WOW!“, keucht sie und hält sich an dir fest. „Okay. Okay. Kurze Pause. Mein Kreislauf muss sich neu sortieren. Das war … WOW!“",
        schuechtern: "Sie öffnet langsam die Augen, ihre Wangen brennen, aber ihr Lächeln ist so breit wie noch nie. „Ich … ich hab's wirklich getan. Mit dir. Wow.“",
        frech: "Sie lehnt sich zurück, atemlos grinsend. „Na also. War doch gar nicht so schwer. Okay, war's. Aber ich beschwer mich nicht.“",
        vertraeumt: "„Das war …“, sie sucht nach Worten und findet keine. Stattdessen lehnt sie ihre Stirn an deine und schweigt. Und dieses Schweigen sagt mehr als jedes Gedicht.",
        energisch: "„OKAY!“, japst sie. „Das war intensiv. Gib mir drei Sekunden. Eins. Zwei — ach, vergiss es.“ Und zieht dich wieder an sich.",
        weise: "„Hm“, macht sie mit geschlossenen Augen, ein seliges Lächeln auf den Lippen. „Vielleicht sollte ich öfter unweise Entscheidungen treffen.“",
        chaotisch: "„AAAAAAAAH!“, macht sie — aber glücklich. „DAS war ein Kuss! Ich meine, ich hab schonmal geküsst, aber DAS?! Neues Level!“",
      },
      choices: [
        { text: "Noch nicht loslassen. Sie einfach festhalten und den Moment atmen.", tone: "pull", heat: +3,
          reply: "Ihr bleibt einfach so — eng umschlungen, Stirn an Stirn, Herz an Herz. Nichts muss gesagt werden. Nichts kann diesen Moment verbessern." },
        { text: "„Das war erst der Anfang. Willst du mehr?“", tone: "push", heat: +14,
          reply: "Ihre Augen weiten sich, dann werden sie dunkel vor Verlangen. „Mehr als alles andere“, flüstert sie. „Zeig mir alles.“" },
        { text: "Sie wieder küssen — diesmal langsamer, tiefer, bewusster.", tone: "push", heat: +16,
          reply: "Der zweite Kuss ist anders als der erste. Keine Hast, keine Zurückhaltung — nur zwei Menschen, die genau wissen, was sie wollen." },
      ],
    },

    // 11 — Verletzlicher Moment: kurz ernst, ehrlich
    {
      line: {
        default: "Plötzlich wird ihr Blick weich. „Darf ich ehrlich sein? Ich hab Angst, das hier zu wollen — weil ich es so sehr will. So etwas hatte ich lange nicht mehr.“",
        froehlich: "Ihr Lächeln wird ein bisschen traurig. „Weißt du … die meiste Zeit bin ich fröhlich. Aber manchmal, nachts, bin ich einsam. Bei dir bin ich's nicht.“",
        schuechtern: "„Ich vertraue sonst niemandem so schnell“, sagt sie leise und sieht dich an. „Aber bei dir fühlt sich mutig sein nicht gefährlich an. Sondern richtig.“",
        frech: "Für einen Moment fällt das freche Grinsen ab. „Okay, ganz ehrlich, ohne Show: Du bist der Erste seit Ewigkeiten, bei dem ich mich nicht verstecken will.“",
        vertraeumt: "„Ich hab Angst, dass das hier ein Traum ist“, flüstert sie, „und dass ich aufwache und du weg bist. Versprich mir, dass du echt bist.“",
        energisch: "„Ich bin nicht gut in sowas“, murmelt sie und sieht plötzlich klein aus. „Aber … du bedeutest mir was. Richtig was. Und das macht mir Angst.“",
        weise: "Sie wird still. „Ich habe viele kommen und gehen sehen. Bei dir will ich, dass du bleibst. Das sage ich nicht leichtfertig.“",
        chaotisch: "„Okay, ernster Moment!“, sagt sie und wird tatsächlich still. „Ich bin nicht nur Chaos. Ich hab auch Angst. Und Hoffnung. Und … ja. Dich.“",
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

    // 12 — Die Spannung explodiert fast, Hände werden kühner
    {
      line: {
        default: "Ihre Hände sind jetzt überall — an deinem Nacken, deiner Brust, deinem Rücken. „Ich will dich“, keucht sie. „So sehr, dass ich kaum noch denken kann. Sag mir, dass du es auch willst.“",
        froehlich: "„Okay, ich bin nicht mehr lustig“, atmet sie schwer. „Ich bin … ich bin einfach nur noch … voller Verlangen. Nach dir. Nur nach dir.“",
        schuechtern: "„Meine Hände“, flüstert sie und lässt sie über deine Brust gleiten, „tun Dinge, die mein Kopf sich nie getraut hätte. Und ich will nicht, dass sie aufhören.“",
        frech: "„Ich hoffe, du bist bereit“, raunt sie, während ihre Finger mit deinen Hemdknöpfen spielen. „Weil ich gerade jede Zurückhaltung verliere. Und zwar mit Ansage.“",
        vertraeumt: "„Fühlst du das?“, haucht sie und legt deine Hand auf ihr Herz. „Das klopft für dich. Nur für dich. Und es will mehr. Viel mehr.“",
        energisch: "„Okay, endgültig: Ich will dich. Komplett. Ganz. Und ich will's jetzt wissen — willst du mich auch so sehr wie ich dich?“",
        weise: "„Ich hab Jahrzehnte darauf gewartet, das zu fühlen“, raunt sie und zieht dich enger. „Jetzt, wo es da ist, will ich es mit jeder Zelle auskosten.“",
        chaotisch: "„MEIN VERSTAND SETZT AUS!“, verkündet sie. „Wiederhole: Verstand ausgefallen. Betrieb läuft im Lust-Modus. Ich hoffe, das ist okay für dich!“",
      },
      choices: [
        { text: "„Ich will dich. Mehr als irgendetwas. Komm mit mir.“", tone: "push", heat: +20,
          reply: "Deine Worte treffen sie wie ein körperlicher Schlag. Sie greift nach deiner Hand und steht auf. Kein Zögern. Kein Zweifel. Nur dieser eine Satz: „Endlich.“" },
        { text: "Sie an dich ziehen und wortlos alles sagen, was Worte nicht können.", tone: "push", heat: +18,
          reply: "Eure Körper pressen sich aneinander, und durch den Stoff spürst du ihren Herzschlag, wild und schnell. „Okay“, keucht sie. „Okay. Lass uns gehen.“" },
        { text: "Ihr noch einen letzten, elektrisierenden Kuss geben.", tone: "tease", heat: +8,
          reply: "Der Kuss schmeckt nach Versprechen. Als ihr euch löst, ist ihre Stimme rau: „Das war deine letzte Chance, mich aufzuhalten. Jetzt gibt's kein Zurück mehr.“" },
      ],
    },

    // 13 — Vorfreude auf das, was gleich passiert
    {
      line: {
        default: "„Gleich“, flüstert sie, „sind wir ganz allein. Und ich werde dir Dinge antun, von denen du heute Nacht noch träumen wirst.“ Ihre Stimme zittert vor Erwartung.",
        froehlich: "„Ich kann's kaum erwarten!“, ruft sie und zieht an deiner Hand. „Los, bevor ich hier draußen über dich herfalle! Das wäre dem Dorf vielleicht ein bisschen zu viel Action!“",
        schuechtern: "„Drinnen“, flüstert sie, „bin ich vielleicht wieder schüchtern. Aber ich will trotzdem alles. Alles mit dir. Versprochen.“",
        frech: "„Lass mich raten“, grinst sie, „du denkst, du weißt, was gleich passiert. Aber ich hab Pläne, von denen du nichts ahnst. Gute Pläne. Sehr gute.“",
        vertraeumt: "„Das wird wie im Traum“, haucht sie und hakt sich bei dir ein, „nur dass wir beide wach sind. Und dass wir nicht aufwachen werden. Nicht, bevor die Sonne aufgeht.“",
        energisch: "„Beweg dich!“, drängt sie lachend. „Wenn wir nicht in dreißig Sekunden durch diese Tür sind, kriegt das ganze Dorf 'ne Show!“",
        weise: "„Komm“, sagt sie mit ihrer tiefen Stimme und reicht dir die Hand. „Lass mich dir zeigen, dass Weisheit und Leidenschaft sich nicht ausschließen.“",
        chaotisch: "„OKAY, PLANÄNDERUNG!“, ruft sie und zieht dich Richtung Tür. „Alles, was ich vorhatte, ist überflüssig! Ich will einfach nur noch DICH! SOFORT!“",
      },
      choices: [
        { text: "💕 Gemeinsam ins Haus gehen.", tone: "push", heat: +10, enter: true,
          reply: "" },
      ],
    },
  ];

  // ============= M1 — Entkleiden (5 Beats, explizit romantisch) =============
  const BEATS_ENTKLEIDEN = [
    // E1 — Die Tür fällt ins Schloss, der private Raum
    {
      line: {
        default: "Die Tür fällt hinter euch ins Schloss, und mit ihr fällt alle Zurückhaltung ab. Im warmen Licht der Kerzen steht sie vor dir, atemlos, mit einem Blick, der dich auszieht, bevor ihre Hände es tun.",
        froehlich: "Kaum ist die Tür zu, dreht sie sich zu dir um und strahlt dich an. „Endlich allein!“, jubelt sie leise. „Ich dachte schon, wir schaffen's nie!“",
        schuechtern: "Drinnen, im schützenden Dämmerlicht, wird sie still. Aber ihre Hände, die jetzt deine suchen, sind sicher und fest. „Hier kann ich sein, wie ich wirklich bin“, flüstert sie.",
        frech: "Sie lehnt sich mit dem Rücken gegen die Tür und zieht dich am Kragen zu sich. „So. Jetzt bist du in meiner Welt. Und hier gelten meine Regeln.“",
        vertraeumt: "Der Raum ist in goldenes Kerzenlicht getaucht. „Es ist noch schöner, als ich geträumt habe“, haucht sie und sieht dich an, als wärst du das Zentrum des Universums.",
        energisch: "„ENDLICH!“, ruft sie und kickt sich die Schuhe von den Füßen. „Ich dachte, ich explodiere, wenn wir da draußen noch länger nur Händchen halten!“",
        weise: "Sie schließt leise die Tür und lehnt sich einen Moment dagegen. „So viele Jahre“, murmelt sie, „und jetzt … bist du hier. Mit mir.“",
        chaotisch: "„GESCHAFFT!“, jubelt sie und klatscht. „Tür zu. Welt draußen. Wir drinnen. Und jetzt … keine Ahnung, was jetzt, aber ich bin dabei!“",
      },
      choices: [
        { text: "Sie in die Arme nehmen und den ersten Kuss im privaten Raum genießen.", tone: "push", heat: +16,
          reply: "Der Kuss ist tiefer, freier, ohne die Zurückhaltung von draußen. Ihre Hände fahren durch dein Haar, über deinen Rücken, und ihr beide wisst: Jetzt beginnt es wirklich." },
        { text: "Sie einfach ansehen, jeden Zentimeter ihres Gesichts im Kerzenlicht studieren.", tone: "tease", heat: +7,
          reply: "Sie wird ganz still unter deinem Blick. „Du siehst mich an, als wäre ich das Kostbarste, was du je gesehen hast“, flüstert sie. „Genau so fühlt es sich an.“" },
        { text: "Ihr langsam die Jacke von den Schultern streifen.", tone: "push", heat: +14,
          reply: "Deine Finger gleiten unter den Stoff, der von ihren Schultern fällt. Sie erschauert, ihre Haut stellt sich auf. „Noch ein Kleidungsstück?“, fragst du. Sie nickt nur." },
      ],
    },
    // E2 — Die ersten Kleidungsstücke fallen
    {
      line: {
        default: "Deine Hände finden den Saum ihres Oberteils. Sie hebt die Arme, und der Stoff gleitet über ihren Kopf. Darunter kommt zarte Haut zum Vorschein, die im Kerzenlicht golden schimmert.",
        froehlich: "„Hier, lass mich helfen!“, sie zieht sich das Oberteil selbst über den Kopf und wirft es in eine Ecke. „So! Gleich viel besser! Du bist dran!“",
        schuechtern: "Sie zögert einen Herzschlag lang, dann hebt sie entschlossen die Arme. „Ich … ich will, dass du mich siehst“, flüstert sie, während der Stoff fällt. „Alles von mir.“",
        frech: "„Worauf wartest du?“, grinst sie und öffnet langsam einen Knopf nach dem anderen. „Ich mach's auch selbst. Aber wo bleibt da der Spaß?“",
        vertraeumt: "„Zieh mich aus“, haucht sie, „als würdest du ein Geschenk auspacken. Langsam. Genüsslich. Ich will jeden Moment davon spüren.“",
        energisch: "„OKAY, genug Stoff zwischen uns!“, sie greift nach deinem Hemd. „Entweder du ziehst das jetzt aus, oder ich mach's. Und ich bin nicht sanft!“",
        weise: "Sie nimmt deine Hände und führt sie an ihre Knöpfe. „Hilf mir“, sagt sie leise. „Manche Dinge sollte man zu zweit tun.“",
        chaotisch: "„WETTRENNEN!“, ruft sie. „Wer zuerst nackt ist, gewinnt!“ Und schon reißt sie sich das Oberteil über den Kopf, bevor du reagieren kannst.",
      },
      choices: [
        { text: "Langsam die letzte Schicht von ihren Schultern streifen und die freigelegte Haut küssen.", tone: "push", heat: +18,
          reply: "Deine Lippen finden ihre Schulter, wandern zum Schlüsselbein, erkunden jeden Zentimeter, der neu freigelegt ist. Sie stöhnt leise auf, ihre Finger krallen sich in deine Arme." },
        { text: "Einen Schritt zurücktreten und sie im Kerzenlicht bewundern.", tone: "tease", heat: +6,
          reply: "Sie steht vor dir, das Haar zerzaust, die Wangen gerötet, und dein Blick wandert über jeden Zentimeter ihrer Silhouette. „Findest du … gefällt dir, was du siehst?“, fragt sie unsicher-stolz." },
        { text: "Dein eigenes Hemd öffnen, damit ihr gleich seid.", tone: "push", heat: +12,
          reply: "Ihre Augen weiten sich, als dein Hemd fällt. Sie legt eine flache Hand auf deine Brust, direkt über deinem Herzen. „Dein Herz rast“, sagt sie. „Meins auch.“" },
      ],
    },
    // E3 — Haut an Haut, der erste volle Kontakt
    {
      line: {
        default: "Jetzt nur noch Haut, die auf Haut trifft. Ihr steht voreinander, und die Wärme ihrer Körper strahlt zu dir herüber. Sie zittert — nicht vor Kälte, sondern vor Erwartung.",
        froehlich: "Sie presst sich an dich, Arme um deinen Nacken. „OH!“, ruft sie. „Das ist … DEUTLICH besser ohne Kleidung! Warum haben wir das nicht schon früher gemacht?!“",
        schuechtern: "Ganz langsam, fast ehrfürchtig, legt sie ihre Hände auf deine nackte Brust. „So fühlt sich das also an“, flüstert sie. „Haut. Deine Haut. Auf meiner.“",
        frech: "„Na endlich“, murmelt sie und zieht dich an sich. „Kein Stoff mehr zwischen uns. Genau so stelle ich mir das vor. Außer … noch näher.“",
        vertraeumt: "Sie schmiegt sich an dich, als würde sie in dich hineinsinken wollen. „Zwei Körper“, haucht sie, „und es fühlt sich an wie einer. Wie kann das sein?“",
        energisch: "„JA!“, stöhnt sie und reibt sich an dir. „GENAU DAS! Haut! Wärme! DICH! Keine halben Sachen mehr!“",
        weise: "Sie legt ihre Hände auf deine Schultern und sieht dich an. „Spürst du das?“, fragt sie leise. „Unter deinen Händen … lebendige Wärme. Das ist das größte Geschenk.“",
        chaotisch: "„OH OH OH!“, macht sie und wedelt mit den Händen. „Hautkontakt! Maximaler Hautkontakt! Mein Gehirn schmilzt! Im guten Sinne!“",
      },
      choices: [
        { text: "Sie hochheben und zur Schlafstätte tragen.", tone: "push", heat: +20,
          reply: "Sie schlingt die Beine um deine Hüften, ihre Arme um deinen Nacken, und ihre Lippen finden deine. „Ich hab so lange darauf gewartet“, flüstert sie zwischen Küssen." },
        { text: "Langsam mit den Händen ihren Rücken entlang fahren, jeden Wirbel einzeln.", tone: "push", heat: +16,
          reply: "Deine Fingerspitzen wandern über ihre Wirbelsäule wie über ein Instrument. Bei jedem Wirbel stöhnt sie leiser oder lauter. „Du spielst mich“, keucht sie. „Und ich will mehr davon.“" },
        { text: "Einfach stehenbleiben, Haut an Haut, und den Moment atmen.", tone: "tease", heat: +4,
          reply: "Kein Wort, keine Bewegung — nur zwei Menschen, die einander spüren. Ihr Atem synchronisiert sich, eure Herzen schlagen im selben Takt. „Das …“, flüstert sie, „ist genauso intensiv wie alles andere.“" },
      ],
    },
    // E4 — Die Entdeckungsreise beginnt
    {
      line: {
        default: "Sie liegt vor dir, und du willst jeden Zentimeter ihres Körpers kennenlernen. Deine Lippen wandern über ihr Schlüsselbein, tiefer hinab, und jeder Kuss entlockt ihr einen neuen, süßeren Laut.",
        froehlich: "„OH!“, sie zuckt glücklich unter deinen Lippen. „Da! Genau da! Woher wusstest du, dass ich da so empfindlich bin?! Mach das nochmal! Und nochmal!“",
        schuechtern: "Sie krallt sich ins Laken, die Augen geschlossen, aber der Mund lächelnd. „Das … das hab ich noch nie …“, sie kommt nicht weiter, weil deine Lippen sie schon wieder unterbrechen.",
        frech: "„Nicht schlecht“, keucht sie und grinst dabei. „Aber ich wette, du findest nicht alle meine … OH! Okay, den hast du gefunden!“",
        vertraeumt: "„Deine Lippen“, haucht sie, „wie Schmetterlingsflügel auf meiner Haut. Nur wärmer. Und viel, viel aufregender.“",
        energisch: "„JA! DA! NICHT AUFHÖREN!“, kommandiert sie und drückt deinen Kopf fester an sich. „Wer aufhört, verliert! Und ich WILL, dass du gewinnst!“",
        weise: "„Langsam“, murmelt sie, während deine Lippen tiefer wandern. „Jeder Kuss eine kleine Ewigkeit. Lass uns nichts überstürzen, was wir für immer genießen können.“",
        chaotisch: "„AAAAAH!“, macht sie. „Deine Zunge! Die macht Sachen! Wie macht die das?! Ist das ein Spezial-Trick?! Wo hast du DAS gelernt?!“",
      },
      choices: [
        { text: "Tiefer hinab wandern und ihre intimsten Stellen mit den Lippen erkunden.", tone: "push", heat: +22,
          reply: "Deine Lippen finden den weichsten Teil ihres Körpers. Sie schreit auf — ein erstickter, glücklicher Laut — und ihre Hände krallen sich in dein Haar. „Oh Gott … ja … genau da!“" },
        { text: "Langsam mit der Zunge über ihre Brust gleiten und ihre Reaktion genießen.", tone: "push", heat: +17,
          reply: "Sie wölbt sich dir entgegen, ihre Brustwarzen hart unter deiner Zunge. „Du … bist … unglaublich“, stöhnt sie, und jedes Wort kommt abgehackt zwischen keuchenden Atemzügen." },
        { text: "Zurück zu ihrem Mund und sie küssen, während deine Hände weiter erkunden.", tone: "tease", heat: +8,
          reply: "Du küsst sie tief, während deine Finger tiefer gleiten und sie zucken lassen. Sie schmeckt nach Verlangen, nach Ungeduld, nach ‚mehr‘." },
      ],
    },
    // E5 — Der letzte Schritt vor der Vereinigung
    {
      line: {
        default: "Ihr seid beide atemlos, verschwitzt, die Spannung kaum noch auszuhalten. „Jetzt“, flüstert sie und zieht dich über sich. „Ich will dich spüren. Ganz. In mir. Jetzt.“",
        froehlich: "„Okay letzter Check!“, keucht sie. „Bist du bereit? Ich bin bereit! Bist du sicher? Ich bin SICHER! Dann … KOMM HER!“",
        schuechtern: "„Ich … ich will dich in mir spüren“, flüstert sie und wird dabei knallrot. „Ich hab's gesagt. Und ich meine es. Bitte. Jetzt.“",
        frech: "„Genug Vorspiel“, raunt sie und zieht dich an sich. „Ich will dich. In mir. Und ich will, dass du mich spürst, wie ich dich spüren will.“",
        vertraeumt: "„Das ist der Moment“, haucht sie, „aus dem Träume gemacht sind. Nur dass wir ihn wirklich erleben. Mach ihn unvergesslich.“",
        energisch: "„JETZT!“, befiehlt sie und spreizt die Beine. „Keine Ausreden! Keine Verzögerung! Ich will dich IN MIR! LOS!“",
        weise: "„Komm“, sagt sie und öffnet sich dir. „Lass uns eins werden. Im ältesten und schönsten Sinne des Wortes.“",
        chaotisch: "„OKAY FINALE!“, ruft sie. „Ziel: Vereinigung! Status: BEREIT! Countdown: KEINER! EINFACH JETZT!“",
      },
      choices: [
        { text: "Langsam in sie eindringen und jeden Millimeter genießen.", tone: "push", heat: +24, enter: true,
          reply: "" },
        { text: "Ihr zuflüstern, wie sehr du sie willst, während du in sie eindringst.", tone: "push", heat: +24, enter: true,
          reply: "" },
        { text: "Einen letzten, tiefen Kuss, dann die Vereinigung.", tone: "push", heat: +24, enter: true,
          reply: "" },
      ],
    },
  ];

  // ============= M1 — Erfüllung (6 Beats, explizit) =============
  const BEATS_ERFUELLUNG = [
    // F1 — Die Vereinigung
    {
      line: {
        default: "Du dringst langsam in sie ein, und ihre Hitze umschließt dich. Sie stöhnt auf, tief und kehlig, ihre Nägel graben sich in deinen Rücken. „Ja … genau so … tiefer …“",
        froehlich: "„OH! OH WOW! JA!“, ruft sie und umklammert dich. „Das ist … das ist NOCH BESSER als ich dachte! Und ich hab VIEL gedacht! Tiefer! Ja!“",
        schuechtern: "„Oh … OH!“, sie presst die Augen zusammen, ihr Mund ein stummes O. Dann öffnet sie die Augen und sieht dich an. „Du … du füllst mich so aus. Es ist … perfekt.“",
        frech: "„Endlich“, keucht sie und packt deinen Hintern. „Ich dachte schon, du traust dich nie. Tiefer, du Feigling. Ich beiße nicht.“ Sie grinst. „Oder vielleicht doch.“",
        vertraeumt: "„Das … das ist wie nach Hause kommen“, haucht sie und bewegt sich mit dir. „Jede Bewegung … ein Gedicht. Und du bist der Dichter.“",
        energisch: "„HÄRTER!“, verlangt sie und schlägt dir auf die Schulter. „Das war 'sanft' — ich will's RICHTIG! Zeig mir, was du kannst!“",
        weise: "„Ah …“, seufzt sie und schließt die Augen. „So fühlt sich Vollkommenheit an. Beweg dich, junger Freund. Lass uns einen Rhythmus finden, der älter ist als die Zeit.“",
        chaotisch: "„WOW WOW WOW!“, schreit sie. „Das ist ANDERS als alles, was ich kenne! Beweg dich! Nein, ICH beweg mich! Nein, BEIDE! JA! SO!“",
      },
      choices: [
        { text: "Tiefer und fester stoßen, den Rhythmus aufnehmen.", tone: "push", heat: +22,
          reply: "Du findest den Rhythmus, der sie lauter stöhnen lässt. Jeder Stoß treibt euch beide höher, die Welt schrumpft auf diesen einen, pulsierenden Punkt zusammen." },
        { text: "Langsam und tief — jeden Stoß auskosten.", tone: "push", heat: +16,
          reply: "Nicht schnell, sondern tief. Jeder Stoß ein Ereignis, bei dem sie die Augen schließt und den Atem anhält. Dann stöhnt sie langgezogen und öffnet sie wieder." },
        { text: "Innehalten und ihr ins Ohr flüstern, wie eng und heiß sie sich anfühlt.", tone: "tease", heat: +8,
          reply: "Du hältst inne, tief in ihr, und flüsterst ihr zu, wie unglaublich sie sich anfühlt. Sie jammert leise. „Sag mehr. Und dann … beweg dich wieder. Bitte.“" },
      ],
    },
    // F2 — Der Rausch nimmt Fahrt auf
    {
      line: {
        default: "Der Rhythmus wird schneller, härter. Eure Körper klatschen aneinander, der Raum füllt sich mit ihren kehligen Schreien. Sie ist ganz bei dir, ganz in diesem Moment, und ihre Hände krallen sich in dein Haar.",
        froehlich: "„SCHNELLER!“, ruft sie und lacht atemlos. „Das ist wie Achterbahn! Nur besser! Viel besser! Ich will nie wieder aussteigen!“",
        schuechtern: "Sie vergräbt ihr Gesicht an deinem Hals, aber ihre Hüften bewegen sich mit dir im Takt. „Ich … ich kann nicht mehr leise sein“, stöhnt sie. „Es ist zu gut.“",
        frech: "„Na also!“, keucht sie und bewegt sich dir entgegen. „Geht doch! Ich wusste, du hast es drauf. Jetzt zeig mir, was du WIRKLICH kannst!“",
        vertraeumt: "„Die Welt verschwimmt“, haucht sie, „alles ist nur noch du und ich und diese unglaubliche Reibung. Lass mich nie wieder los.“",
        energisch: "Sie schwingt sich auf dich und übernimmt die Führung. „SO!“, keucht sie und reitet dich in ihrem eigenen Tempo. „Jetzt bin ICH dran! Halt dich fest!“",
        weise: "„Höher“, murmelt sie, ihre Stimme rau vor Lust. „Bring uns höher. Ich will den Gipfel spüren, der am Horizont wartet.“",
        chaotisch: "„AAAARGH!“, schreit sie auf. „Das ist SO GUT, dass es FAST WEHTUT! Im GUTEN Sinne! Mehr davon! VIEL MEHR!“",
      },
      choices: [
        { text: "Sie auf den Rücken drehen und härter stoßen.", tone: "push", heat: +22,
          reply: "Du drehst sie um und nimmst sie von Neuem, diesmal härter, tiefer, fordernder. Sie schreit auf — und presst sich dir umso fester entgegen. „Ja! Genau so! Lass mich alles spüren!“" },
        { text: "Das Tempo variieren — schnell, dann wieder langsam.", tone: "tease", heat: +10,
          reply: "Schnelle Stöße, dann wieder quälend langsam. Sie wimmert bei jedem Tempowechsel. „Du spielst mit mir“, keucht sie. „Und ich LIEBE es.“" },
        { text: "Sie festhalten, ihr tief in die Augen sehen und den Takt halten.", tone: "push", heat: +16,
          reply: "Dein Blick hält ihren gefangen, während deine Hüften den Takt diktieren. Kein Wort, nur Blicke und Bewegungen. Sie kommt dir entgegen, hypnotisiert von dieser wortlosen Verbindung." },
      ],
    },
    // F3 — Kurz vor dem Höhepunkt
    {
      line: {
        default: "Sie zittert, ihre Atmung wird stoßweise, ihre Stimme überschlägt sich. „Ich … ich bin gleich … oh Gott … ich komme …!“ Ihre Worte lösen sich in unartikulierten Lauten auf.",
        froehlich: "„DA! DA! DA!“, schreit sie und umklammert dich. „Genau da bleib! NICHT BEWEGEN! Doch, BEWEGUNG! JA! ICH KOMME!“",
        schuechtern: "„Ich … ich glaube …“, sie kann den Satz nicht beenden. Stattdessen stöhnt sie auf, langgezogen und tief, während ihr ganzer Körper zu beben beginnt.",
        frech: "„Fuck … ich bin so nah …“, keucht sie. „Mach weiter, du … AAAH!“ Ihr letzter, triumphierender Schrei verrät, dass du alles richtig gemacht hast.",
        vertraeumt: "„Ich fliege“, haucht sie, „ich fliege gleich … fang mich auf … bitte fang mich auf …“ Ihre Stimme bricht, und sie schwebt davon, in deinen Armen.",
        energisch: "„JETZT! ICH KOMME JETZT!“, brüllt sie und haut mit der flachen Hand aufs Bett. „KOMM MIT MIR! ZUSAMMEN! JETZT!“",
        weise: "„Ah …“, macht sie, und es ist der tiefste, erfüllteste Ton, den du je gehört hast. „Da ist es. Lass los. Lass alles los, mein Lieber. Ich halte dich.“",
        chaotisch: "„AAAAAHHHHHH!“, das ist kein Wort mehr, sondern reine, ungefilterte Ekstase. Sie klammert sich an dir fest, als würde sie sonst davonfliegen.",
      },
      choices: [
        { text: "Sie über die Kante bringen und ihren Höhepunkt mit jedem Stoß verlängern.", tone: "push", heat: +24, fade: true,
          reply: "" },
        { text: "Dich mit ihr fallen lassen, gemeinsam den Gipfel erreichen.", tone: "push", heat: +24, fade: true,
          reply: "" },
      ],
    },
  ];

  // ============= M2 — Fetisch-Beats (pro Fetisch, Persönlichkeitsvarianten) =============

  // Jeder Fetisch hat einen "Vorspiel"-Block, der im Gespräch den Fetisch einführt,
  // und einen "Erfüllungs"-Block, der die eigentliche fetisch-spezifische Szene darstellt.

  const BEATS_M2 = {

    // ── exhibition: Gesehen werden ──
    exhibition: {
      intro: {
        default: "Sie zieht dich zum Fenster. Draußen liegt das Dorf im Mondschein, und für einen Moment denkst du: Was, wenn jemand aufsieht? Und dann realisierst du — genau das will sie. „Sollen sie ruhig sehen“, flüstert sie.",
        froehlich: "„Komm ans Fenster!“, zieht sie dich aufgeregt. „Keine Angst, ich hab nachgeschaut — die meisten schlafen. Und die, die nicht schlafen …“, sie grinst schelmisch, „haben Glück!“",
        frech: "Sie stellt sich vor das große Fenster, das Mondlicht zeichnet ihre Silhouette nach. „Weißt du, was mich wirklich anmacht?“, raunt sie und zieht den Vorhang ganz auf. „Dass uns jemand zusieht.“",
        chaotisch: "„WILDE IDEE!“, ruft sie und deutet aufs Fenster. „Was, wenn wir … da? Jetzt? Die ganze Wand ist aus Glas! Jeder könnte — JA, GENAU DAS IST DER PUNKT!“",
      },
      scene: [
        // Beat 1
        {
          line: {
            default: "Sie lehnt sich mit dem Rücken gegen die Fensterscheibe, das kalte Glas an ihrer heißen Haut. Im Mondlicht siehst du jeden Zentimeter ihres Körpers — und sie weiß es. „Schau mich an“, befiehlt sie leise.",
            froehlich: "„Okay, okay, okay!“, sie zappelt aufgeregt. „Du bleibst hier. Und ich …“, sie geht zum Fenster, „… stehe hier. Und du siehst MIR zu. Nur mir. Und vielleicht noch drei schlaflosen Nachbarn!“",
            frech: "Sie presst sich gegen das Fenster, ihr Atem beschlägt das Glas. „Schau genau hin“, raunt sie. „Und hoff, dass die Alte von gegenüber heute Nacht besonders schlecht schläft.“",
            chaotisch: "„POSITION!“, kommandiert sie und stellt sich in Pose am Fenster. „Du: Zuschauer. Ich: Star. Das Dorf: unfreiwilliges Publikum. ACTION!“",
          },
          choices: [
            { text: "Dich in den Sessel setzen und ihr zusehen, wie sie sich am Fenster präsentiert.", tone: "push", heat: +18,
              reply: "Du lehnst dich zurück und siehst zu, wie sie sich im Mondlicht räkelt. Jede Bewegung ist für dich — und für jeden, der aufsieht. Das Wissen darum macht euch beide atemlos." },
            { text: "Zu ihr ans Fenster treten und sie von hinten nehmen, während draußen die Welt zusieht.", tone: "push", heat: +22,
              reply: "Das Glas ist kalt an ihren Brüsten, dein Körper warm an ihrem Rücken. Du dringst in sie ein, während das ganze Dorf unter euch liegt. Ihr unterdrückter Schrei beschlägt die Scheibe." },
            { text: "„Dreh dich um. Ich will, dass du siehst, wer zusieht — während ich dich nehme.“", tone: "push", heat: +20,
              reply: "Sie dreht sich um, das Glas im Rücken, und du hebst sie hoch. Ihre Beine schlingen sich um dich. In der Ferne flackert ein Licht auf. Sie grinst. „Jemand ist wach.“" },
          ],
        },
        // Beat 2
        {
          line: {
            default: "Du kannst nicht widerstehen — du trittst hinter sie, presst dich an ihren Rücken. Das Fenster ist eure Bühne, das Dorf euer Publikum. Oder auch nicht — das ist ja der Reiz. Das Nicht-Wissen.",
            froehlich: "„Oh! Da kommt jemand!“, flüstert sie aufgeregt und deutet auf eine Laterne in der Ferne. „Schnell! Tu so, als würden wir nur reden!“, sie kichert. „Oder tu's nicht. Tu lieber … DAS!“",
            frech: "Sie winkt aus dem Fenster. „Falls da draußen jemand ist: Ihr verpasst 'ne gute Show!“, raunt sie und drückt sich an dich. „Und jetzt kümmer dich um deinen Star.“",
            chaotisch: "„OH MEIN GOTT, DA BEWEGT SICH WAS!“, zischt sie. „PSST! SEI LEISE!“, sie selbst kann das Kichern kaum unterdrücken. „Wir werden erwischt! HOFFENTLICH!“",
          },
          choices: [
            { text: "Sie von hinten nehmen, während sie sich am Fensterrahmen festhält.", tone: "push", heat: +22,
              reply: "Jeder Stoß lässt das alte Fenster leise klirren. Sie presst die Stirn ans kühle Glas, und ihre heißen Atemwolken bilden einen beschlagenen Hof. Von draußen muss es aussehen wie ein Schattenspiel — oder auch nicht. Ihr könnt es nicht wissen. Und genau das bringt sie um den Verstand." },
          ],
        },
      ],
    },

    // ── praise_worship: Lob & Verehrung ──
    praise_worship: {
      intro: {
        default: "„Leg dich hin“, flüstert sie. „Ich will dich ansehen. Wirklich ansehen. Jeden Zentimeter. Und dir sagen, was ich sehe — jedes Detail, das sonst niemand beachtet.“",
        schuechtern: "„Ich … ich hab mir das so oft vorgestellt“, gesteht sie. „Dich einfach nur anzuschauen. Und dir zu sagen, wie wunderschön du bist. Darf ich?“",
        vertraeumt: "„Leg dich zu mir“, haucht sie. „Ich will dir Dinge sagen, die ich noch nie jemandem gesagt habe. Worte, die auf meiner Zunge warten wie Tau auf Blütenblättern.“",
        weise: "„Komm“, sagt sie und breitet eine Decke vor dem Kamin aus. „Heute Nacht bist du mein Kunstwerk. Und ich werde dich betrachten, bis mir die Worte ausgehen. Sie werden mir nicht ausgehen.“",
      },
      scene: [
        {
          line: {
            default: "Sie kniet neben dir und lässt ihre Fingerspitzen einen Millimeter über deiner Haut schweben, ohne sie zu berühren. „Deine Schultern“, beginnt sie, „stark wie Fels. Dein Hals — die Linie, die ich immer ansehen muss, wenn du sprichst. Und deine Brust …“, ihre Stimme stockt.",
            schuechtern: "Zaghaft legt sie ihre Hand auf deine Brust. „Dein Herz“, flüstert sie, „schlägt so schnell. Für mich? Ich … ich kann kaum glauben, dass das echt ist. Dass du echt bist. Und dass ich das hier tun darf.“",
            vertraeumt: "„Deine Haut im Feuerschein“, haucht sie verzückt. „Wie flüssiges Gold. Und diese kleine Narbe da — erzähl mir die Geschichte. Ich will alles wissen. Jede Einzelheit deines Körpers ist eine Welt für sich.“",
            weise: "„Du hast Narben“, sagt sie und fährt eine davon mit dem Daumen nach. „Jede ist ein Kapitel. Ich würde sie alle lesen, wenn du mich ließt. Und danach … schreibe ich neue mit dir.“",
          },
          choices: [
            { text: "Ihr erlauben, jeden Zentimeter zu erkunden und zu kommentieren.", tone: "push", heat: +16,
              reply: "Sie beginnt eine Litanei der Bewunderung, die deinen ganzen Körper umfasst. Jeder Name, den sie dir gibt, jedes Adjektiv, das sie wählt, lässt dich größer, schöner, begehrter fühlen." },
            { text: "Ihre Hand nehmen und sie auf eine Stelle führen, die sie übersehen hat.", tone: "tease", heat: +10,
              reply: "Du führst ihre Hand tiefer. Sie stockt, ihre Wangen färben sich tiefrot. „Oh … da … da hab ich mich noch nicht getraut hinzusehen. Aber jetzt …“, ihre Finger schließen sich um dich." },
          ],
        },
        {
          line: {
            default: "Ihre Lippen folgen jetzt ihren Worten. Sie küsst deine Schultern, dein Brustbein, die weiche Haut unter deinen Rippen. Und mit jedem Kuss ein einziges Wort: „Wunderschön.“",
            schuechtern: "„Jede Pore, jedes Haar, jede winzige Unebenheit“, flüstert sie und küsst die Stellen, die sie beschreibt. „Alles an dir ist … ein Geschenk. Und ich bin die Beschenkte.“",
            vertraeumt: "Sie legt ihre Lippen auf dein Herz. „Hier“, haucht sie, „wo alles beginnt. Dein Puls an meinen Lippen. Weißt du, wie kostbar das ist? Ich werde diesen Moment nie vergessen.“",
            weise: "„Ich bin alt genug, um zu wissen, dass Schönheit vergänglich ist“, murmelt sie und küsst deinen Bauchnabel. „Deshalb genieße ich dich umso mehr. In vollen, durstigen Zügen.“",
          },
          choices: [
            { text: "Ihren Kopf nehmen und sie dahin führen, wo du am meisten verehrt werden willst.", tone: "push", heat: +20,
              reply: "Sie versteht ohne Worte. Ihre Lippen öffnen sich, und ihre Zunge beginnt zu verehren, was ihr entgegenkommt. Jede Bewegung eine Anbetung, jeder Laut ein Gebet." },
            { text: "Sie umdrehen und ihr zeigen, dass auch sie anbetungswürdig ist.", tone: "push", heat: +18,
              reply: "Jetzt bist du an der Reihe. Deine Lippen auf ihrer Haut, deine Worte in ihrem Ohr. Sie weint fast — vor Glück, vor Überwältigung, vor dem Gefühl, endlich gesehen zu werden." },
          ],
        },
      ],
    },

    // ── bonding_soft: Sanfte Fesseln ──
    bondage_soft: {
      intro: {
        default: "Sie holt ein langes, cremefarbenes Seidentuch hervor und lässt es durch ihre Finger gleiten. „Vertraust du mir?“, fragt sie. „Oder … soll ich dir vertrauen?“ Ihre Augen funkeln im Kerzenlicht.",
        frech: "„Überraschung!“, sie schwenkt zwei Seidentücher. „Keine Angst, ich hab's geübt. An mir selbst. War … interessant. Aber jetzt will ich's mit dir probieren. Oder an dir. Entscheide!“",
        energisch: "„Okay, ich hab was mitgebracht!“, sie hält dir die Handgelenke hin. „Entweder du fesselst mich, oder ich fessel dich. Ich bin für beides zu haben. Aber wir müssen uns JETZT entscheiden!“",
        chaotisch: "„Rate mal, was ich heute gebastelt habe!“, zieht sie kunstvoll verknotete Tücher aus der Tasche. „Fesseln! Also … ästhetische Fesseln! Für … na, du weißt schon.“",
      },
      scene: [
        {
          line: {
            default: "Du nimmst ihre Handgelenke und bindest sie mit dem Seidentuch an den Bettpfosten — nicht fest, sondern liebevoll. Sie könnte sich jederzeit befreien. Und genau deshalb bleibt sie.",
            frech: "„Fester“, befiehlt sie, als du die Knoten knüpfst. „Ich will's spüren. Nicht so zaghaft — ich bin kein rohes Ei. Na also. Jetzt … bin ich dein.“",
            energisch: "Sie hält dir die zusammengelegten Handgelenke hin. „Mach schon. Ich vertrau dir. Und wenn's mir nicht gefällt, sag ich's. Versprochen. Jetzt FESSEL MICH!“",
            chaotisch: "„Oh! Oh es passiert!“, ruft sie, während du den ersten Knoten knüpfst. „Ich bin gefesselt! Fast! Okay, ich könnte das Ding mit einem Ruck lösen, aber das ist nicht der Punkt!“",
          },
          choices: [
            { text: "Sie sanft fesseln und dann langsam jeden Zentimeter ihres hilflosen Körpers erkunden.", tone: "push", heat: +20,
              reply: "Gefesselt, ausgeliefert und doch voller Vertrauen liegt sie vor dir. Deine Hände und Lippen haben freie Bahn, und sie kann nichts tun außer fühlen. Jede Berührung ist doppelt so intensiv, weil sie nicht ausweichen kann. Und sie will es nicht." },
            { text: "Dich selbst fesseln lassen — ihr die Kontrolle schenken.", tone: "push", heat: +18,
              reply: "Die Rollen sind vertauscht. Du liegst da, die Hände über dem Kopf fixiert, während sie über dir kniet und dich mit einem Lächeln mustert, das alles verspricht. Dann beugt sie sich hinab." },
          ],
        },
        {
          line: {
            default: "Sie testet die Fesseln, spürt den sanften Widerstand des Stoffs, und atmet tief aus. „Jetzt gehöre ich dir“, flüstert sie. „Und du kannst mit mir machen, was du willst.“",
            frech: "Sie zappelt — nur zum Spaß. Die Tücher halten. „Oh“, macht sie mit gespielter Überraschung. „Ich kann mich ja gar nicht wehren. Was auch immer du jetzt vorhast … ich bin völlig schutzlos.“ Ihre Augen sagen das Gegenteil.",
            energisch: "„Okay, ich geb's zu“, keucht sie, „das ist … intensiv. Aber gut intensiv! Sehr gut! Ich kann mich nicht bewegen und mein Herz rast und … mach weiter!“",
            chaotisch: "„WOW!“, ruft sie und zappelt. „Das fühlt sich total anders an als erwartet! Besser! Viel besser! Okay, wo warst du? Du warst dabei, irgendwas unglaublich Heißes zu tun!“",
          },
          choices: [
            { text: "Sie mit Küssen bedecken, bis sie nicht mehr stillhalten kann.", tone: "push", heat: +22,
              reply: "Gefesselt und jedem Kuss ausgeliefert windet sie sich unter dir. Jedes Mal, wenn sie zuckt, spannt sich die Seide um ihre Handgelenke — eine Erinnerung an ihr Vertrauen und deine Verantwortung." },
          ],
        },
      ],
    },

    // ── brat: Trotzkopf ──
    brat: {
      intro: {
        default: "„Ach ja?“, sie stemmt die Hände in die Hüften. „Du denkst also, du bestimmst hier? Dann überzeug mich doch.“ Ihr Grinsen ist frech, aber ihre Augen sind dunkel vor Erwartung.",
        frech: "Sie tippt dir mit dem Finger auf die Brust. „Ich sag dir, wie's läuft: Du willst was von mir? Dann hol's dir. Aber ich warne dich — ich bin nicht leicht zu haben. Und genau das liebst du, oder?“",
        chaotisch: "„OKAY, STOPP!“, sie stellt sich breitbeinig vor dich. „Ich hab entschieden: Du musst mich JAGEN. Also … nicht wirklich jagen, aber so metaphorisch. Wobei … doch, jag mich!“",
        energisch: "„Regeländerung!“, verkündet sie und kreuzt die Arme. „Du willst mich? Dann musst du mich überzeugen. Mit Worten. Mit Taten. Mit … na, du weißt schon. Mal sehen, ob du's draufhast!“",
      },
      scene: [
        {
          line: {
            default: "Sie weicht tänzelnd zurück, die Arme verschränkt, das Kinn herausfordernd erhoben. „Na los, großer Held. Zeig mir, was du kannst. Oder hast du Angst, dass ich zu viel für dich bin?“",
            frech: "„Ich bin nicht wie die anderen“, erklärt sie und zählt an den Fingern ab. „Erstens: Ich mach nicht, was man mir sagt. Zweitens: Ich widerspreche grundsätzlich. Drittens: Ich will, dass du mich trotzdem willst. Also?“",
            chaotisch: "„Du musst mich einfangen!“, ruft sie und rennt einmal ums Sofa. „Okay, das war albern. Aber der Punkt ist: DU musst MICH überzeugen. Ich geb nicht einfach so nach!“",
            energisch: "Sie stellt sich in Positur wie eine Boxerin. „Komm schon. Überzeug mich. Zeig mir, warum ich mich für DICH entscheiden sollte. Beeindruck mich!“",
          },
          choices: [
            { text: "Sie packen und über die Schulter werfen.", tone: "push", heat: +20,
              reply: "Du hebst sie mit einem Ruck hoch. Sie quietscht überrascht auf, trommelt mit den Fäusten auf deinen Rücken — und grinst dabei breit. „OKAY! Okay! Du hast gewonnen! Fürs Erste!“" },
            { text: "Sie mit Worten zermürben — ihr genau sagen, was du mit ihr vorhast.", tone: "push", heat: +16,
              reply: "Du beschreibst in ruhiger Stimme, was du tun wirst. Jedes Detail. Jede Berührung. Nach drei Sätzen ist ihr freches Grinsen verschwunden. Nach fünf ist sie still. Nach sieben flüstert sie: „Okay … du hast mich.“" },
          ],
        },
        {
          line: {
            default: "Sie hat aufgehört zu kämpfen, aber ihr Blick ist immer noch herausfordernd. „Na gut, du hast gewonnen. Für jetzt. Aber beim nächsten Mal …“, sie kommt nicht weiter, weil du sie küsst.",
            frech: "„Ich nehm's zurück“, murmelt sie gegen deine Lippen. „Du überzeugst mich. Total. Vollständig. Und jetzt … hör auf zu reden und zeig mir, was ein 'großer Held' sonst noch kann.“",
            chaotisch: "„Okay, okay, ICH ERGEBE MICH!“, ruft sie und hält theatralisch die Hände hoch. „Du hast den Trotzkopf gezähmt! Vorübergehend! Jetzt belohn mich für meine Niederlage!“",
            energisch: "„Na schön“, lenkt sie ein, immer noch grinsend, aber weicher. „Du hast dich bewiesen. Jetzt darfst du ernten, was du gesät hast. Und ich verspreche … die Ernte ist groß.“",
          },
          choices: [
            { text: "Die Belohnung einfordern, die sie dir schuldet.", tone: "push", heat: +22,
              reply: "Sie gibt nach — und wie sie nachgibt. All der Trotz, all die Provokation kanalisiert sich jetzt in pure Hingabe. Sie will, dass du sie nimmst. Und du nimmst sie." },
          ],
        },
      ],
    },

    // ── rough_passionate: Wild & Leidenschaftlich ──
    rough_passionate: {
      intro: {
        default: "Sie packt dich am Kragen und zieht dich zu sich. „Schluss mit den Nettigkeiten. Ich hab den ganzen Abend gewartet. Ich will dich. Hier. Jetzt. Gegen die Wand. Keine Fragen.“",
        energisch: "„OKAY, ENDGÜLTIG!“, brüllt sie fast. „Genug geredet! Genug Händchen gehalten! Du. Ich. JETZT! Und ich meine nicht in zehn Minuten, sondern in ZEHN SEKUNDEN!“",
        frech: "Sie schubst dich gegen die Wand und stellt sich dicht vor dich. „Rate mal, was passiert, wenn du dich jetzt nicht wehrst“, raunt sie. „Nichts. Weil du es genauso willst wie ich.“",
        chaotisch: "„AAAAH ICH HALT'S NICHT MEHR AUS!“, schreit sie und reißt sich den Pullover über den Kopf. „Kein Vorspiel! Kein Gerede! WAND! DU! ICH! SOFORT!“",
      },
      scene: [
        {
          line: {
            default: "Du drückst sie an die nächste Wand. Der Aufprall ist hart, aber sie stöhnt auf vor Lust. Ihre Beine schlingen sich um dich, ihre Zähne graben sich in deine Unterlippe. Es ist roh, animalisch, perfekt.",
            energisch: "Sie springt an dir hoch und umklammert dich mit aller Kraft. „JA! Endlich! Halt mich fest und lass nie wieder los! Härter! Ich will's spüren! ICH WILL DICH SPÜREN!“",
            frech: "Mit dem Rücken an der Wand, die Beine um deine Hüften geschlungen, reißt sie an deinem Hemd. „Das Ding ist im Weg“, knurrt sie. „Entweder du machst es aus, oder ich zerreiß es.“",
            chaotisch: "„HIER! JETZT! WAND!“, kommandiert sie, während sie gleichzeitig versucht, deine Hose zu öffnen. „Warum hab ich drei linke Hände?! Egal! MACH EINFACH!“",
          },
          choices: [
            { text: "Sie gegen die Wand pressen und ohne weitere Vorbereitung in sie eindringen.", tone: "push", heat: +24,
              reply: "Sie stöhnt auf, laut und ungehemmt, als du sie nimmst. Der Rhythmus ist hart und fordernd, die Wand bebt bei jedem Stoß. Sie kratzt deinen Rücken und will mehr, immer mehr." },
          ],
        },
        {
          line: {
            default: "Später, atemlos, am Boden liegend. Die Kleidung ist zerfetzt oder verschwunden. Ihre Brust hebt und senkt sich schnell. „Das“, keucht sie. „Genau das. Warum reden wir überhaupt jemals?“",
            energisch: "Sie liegt ausgebreitet auf dem Teppich und grinst zur Decke. „BESTE. ENTSCHEIDUNG. EVER.“, keucht sie. „Gib mir dreißig Sekunden. Dann Runde zwei.“",
            frech: "„Okay“, japst sie und wischt sich Schweiß von der Stirn. „Okay. Respekt. Das war … beeindruckend. Du beeindruckst mich. Jetzt … lass mich kurz atmen, dann bin ich wieder bereit.“",
            chaotisch: "„WOW!“, macht sie und starrt an die Decke. „Das war … ich hab keine Worte! ICH! Keine Worte! Das will was heißen!“",
          },
          choices: [
            { text: "Dich erschöpft neben sie legen und sie an dich ziehen.", tone: "pull", heat: -8,
              reply: "Ihr liegt da, verschwitzt und glücklich. Die Welt draußen existiert nicht mehr. Nur ihr beide, atemlos, perfekt." },
          ],
        },
      ],
    },

    // ── edging: Hinhalten ──
    edging: {
      intro: {
        default: "„Heute Nacht“, sagt sie leise, „machen wir etwas anders. Ich will, dass du mich berührst — aber nicht zu Ende. Immer wieder nah dran. Und dann stopp.“ Ihre Finger zittern bei dem Gedanken.",
        energisch: "„Neue Challenge!“, verkündet sie. „Wir dürfen NICHT kommen. Also … noch nicht. Erst wenn ich's sage. Und ich werde es NICHT sagen. Bis wir beide FAST VERRÜCKT WERDEN!“",
        frech: "„Ich hab da eine Idee, die du gleichzeitig lieben und hassen wirst“, grinst sie. „Ich fass dich an. Und kurz bevor du kommst, hör ich auf. Und wieder. Und wieder. Bis du bettelst.“",
        weise: "„Die höchste Lust ist die, die man hinauszögert“, zitiert sie und streicht mit einer Feder über deine Brust. „Heute Nacht üben wir Geduld. Und morgen früh werden wir wissen, warum.“",
      },
      scene: [
        {
          line: {
            default: "Sie streichelt dich — so nah am Ziel, dass deine Hüften zucken. Und dann hört sie auf. Lässt dich zittern, betteln. „Noch nicht“, flüstert sie. Und ihre Hand beginnt von vorn.",
            energisch: "„Warte!“, ruft sie und zieht die Hand weg. Du stöhnst frustriert auf. „Noch nicht!“, lacht sie. „Oh Gott, dein Gesicht! Okay, okay … weiter. Aber LANGSAM diesmal!“",
            frech: "„Nah dran?“, fragt sie süßlich und hält inne. „Wie nah? So nah?“ Ihre Fingerspitzen berühren dich kaum. „Oder so nah?“ Etwas fester. Dann — nichts. „Sag bitte.“",
            weise: "„Spürst du, wie die Spannung wächst?“, murmelt sie und unterbricht die Bewegung. „Jedes Mal, wenn ich aufhöre, wird das Verlangen größer. Bis es den ganzen Raum ausfüllt. Bis du nichts mehr spürst außer mir.“",
          },
          choices: [
            { text: "Betteln. Wirklich, ehrlich betteln.", tone: "push", heat: +18,
              reply: "Du gibst auf. Die Worte sprudeln aus dir — 'bitte', 'ich kann nicht mehr', 'erlöse mich'. Sie lächelt, ihre Augen feucht vor Lust. „Weil du so brav gefragt hast …“, flüstert sie." },
            { text: "Die Kontrolle an dich reißen und sie stattdessen quälen.", tone: "push", heat: +22,
              reply: "Du packst ihre Hände und drehst den Spieß um. Jetzt ist SIE diejenige, die zittert. „Warte!“, keucht sie. „Das war nicht der Deal!“ Aber ihr Lächeln verrät sie." },
          ],
        },
      ],
    },

    // ── sensory_play: Sinnenspiel ──
    sensory_play: {
      intro: {
        default: "„Schließ die Augen“, flüstert sie. „Vertrau mir. Ich werde dich berühren — aber nicht mit den Händen. Jedenfalls nicht nur. Rate, was du spürst.“",
        froehlich: "„OKAY, Überraschung!“, sie hält ein Seidentuch, eine Feder und einen Eiswürfel hoch. „Eins davon benutze ich zuerst. Rate welches! Nein, rate nicht — ERLEBE!“",
        schuechtern: "„Ich … ich hab was zum Ausprobieren mitgebracht“, flüstert sie und holt zarte Federn hervor. „Wenn's dir nicht gefällt, sag's. Aber ich glaube … es wird dir gefallen.“",
        weise: "„Die Dunkelheit macht die anderen Sinne wacher“, erklärt sie und bindet dir das Tuch um die Augen. „Du wirst Dinge fühlen, die du noch nie gefühlt hast. Versprochen.“",
      },
      scene: [
        {
          line: {
            default: "Die Dunkelheit hinter dem Seidentuch macht dich hellhörig. Jedes Rascheln, jeder Atemzug von ihr ist ein Ereignis. Dann — eine Feder. Sie wandert über deinen Hals, deine Brust, tiefer.",
            froehlich: "„KALT!“, warnt sie und legt einen Eiswürfel an deine Brust. Du zuckst. Dann — warm. Ihre Lippen auf derselben Stelle. „Heiß-kalt-heiß! Magst du's? Ich LIEBE es!“",
            schuechtern: "Ganz vorsichtig zieht sie die Feder über deinen Bauch. „Kitzelt's?“, flüstert sie. „Soll ich aufhören? Oder … weitermachen?“ Die Feder wandert tiefer. Du hörst ihr leises, glückliches Kichern.",
            weise: "Erst Wärme — warmes Öl, das sie auf deine Brust träufelt. Dann Kälte — ein Eiswürfel, der dem gleichen Pfad folgt. „Feuer und Eis“, murmelt sie. „Beides willkommen. Beides intensiv.“",
          },
          choices: [
            { text: "Dich der Erfahrung völlig hingeben und jeden Reiz einzeln auskosten.", tone: "push", heat: +16,
              reply: "Ohne Sehsinn wird jede Berührung zu einem Universum. Du spürst die Textur der Feder, die Kälte des Eises, die Wärme ihrer Zunge — und jedes einzelne Gefühl ist tausendmal intensiver als sonst." },
            { text: "Das Tuch abnehmen und sie überraschen, indem du die Rollen tauschst.", tone: "push", heat: +18,
              reply: "Jetzt ist sie an der Reihe, nichts zu sehen und alles zu fühlen. Das überraschte Quieken, als der Eiswürfel ihre Wirbelsäule hinabwandert, ist Musik in deinen Ohren." },
          ],
        },
      ],
    },

    // ── roleplay_power: Machtspiel ──
    roleplay_power: {
      intro: {
        default: "„Heute Abend“, sagt sie mit strenger Stimme, „bin ich nicht, wer du denkst. Sondern deine Chefin. Und du willst was von mir. Also: Wie weit würdest du gehen, um mich zufriedenzustellen?“",
        frech: "„Neue Rollen!“, erklärt sie und setzt sich kerzengerade hin. „Ich: die strenge, aber gerechte Herrscherin. Du: mein ergebener Diener. Deine Aufgabe: gehorchen. Deine Belohnung: ich.“",
        weise: "„Setz dich“, befiehlt sie, und es ist keine Bitte. „Du hast um eine Audienz gebeten. Du willst etwas von mir. Was bist du bereit, dafür zu tun?“ Ihr Blick ist undurchdringlich.",
        energisch: "„SO!“, sie setzt sich auf den Sessel wie auf einen Thron. „Ab jetzt bin ich die Königin. Und du bist … mein Ritter. Mein GANZ gehorsamer Ritter. Jedes 'Eure Majestät' wird belohnt!“",
      },
      scene: [
        {
          line: {
            default: "Sie thront auf dem Sessel wie auf einem Thron, die Beine übereinandergeschlagen. „Komm näher“, befiehlt sie. „Knie dich hin. Zeig mir, dass du weißt, wer hier das Sagen hat.“",
            frech: "„Erster Befehl“, sagt sie und zeigt auf den Boden vor ihr. „Knie. Zweiter Befehl“, sie grinst, „massiere meine Füße. Dritter Befehl … entscheide ich, wenn du die ersten zwei gut machst.“",
            weise: "„Ich habe Macht über dich“, stellt sie fest und mustert dich. „Und du gibst sie mir freiwillig. Das ist die süßeste Art der Unterwerfung. Zeig mir, dass du es ernst meinst.“",
            energisch: "„Knie!“, befiehlt sie und zeigt dramatisch auf den Boden. „Ich hab immer davon geträumt, das zu sagen! Okay, ernsthaft: Knie hin. Ich will sehen, dass du mich respektierst — und begehrst.“",
          },
          choices: [
            { text: "Vor ihr knien und gehorsam ihren ersten Befehl erwarten.", tone: "push", heat: +18,
              reply: "Du sinkst auf die Knie. Sie atmet scharf ein — ein leises, ungläubiges Geräusch, das verrät, wie sehr sie das erregt. „Gut“, flüstert sie. „Sehr gut. Jetzt …“" },
            { text: "Ihre Autorität spielerisch herausfordern — nur um zu sehen, was passiert.", tone: "tease", heat: +10,
              reply: "„Was, wenn ich nicht knie?“, fragst du leise. Ihre Augen funkeln. „Dann werde ich dich lehren, warum das ein Fehler war.“ Und ihre Stimme lässt keinen Zweifel, dass du diese Lektion genießen wirst." },
          ],
        },
      ],
    },

    // ── roleplay_naughty: Verruchte Rolle ──
    roleplay_naughty: {
      intro: {
        default: "„Lass uns spielen“, schlägt sie vor und zupft an ihrem Haar. „Wir kennen uns nicht. Wir haben uns gerade in einer Bar getroffen. Und du hast genau einen Abend, um mich zu überzeugen.“",
        froehlich: "„NEUES SPIEL!“, ruft sie. „Ich bin Lola, die geheimnisvolle Fremde. Du bist … du! Aber eine Version von dir, die EXTREM charmant ist. Action!“",
        frech: "„Okay, Rollenspiel“, grinst sie und lehnt sich lässig an die Wand. „Ich bin eine Fremde, die du in einer schummrigen Bar triffst. Dein Ziel: krieg mich rum. Dein Budget: dein Charme.“",
        chaotisch: "„Szenenwechsel!“, verkündet sie und ändert ihre Körperhaltung komplett. „Ich bin jetzt 'Mystery Lady'. Du bist 'Dude an der Bar'. Wir haben uns noch NIE gesehen. LOS!“",
      },
      scene: [
        {
          line: {
            default: "„Hi“, sagt sie mit einer völlig neuen Stimme — tiefer, rauchiger. „Ich hab dich von drüben gesehen. Du siehst aus wie jemand, der eine interessante Geschichte zu erzählen hat. Setz dich zu mir.“",
            froehlich: "„Na, Süßer?“, sie zwinkert übertrieben. „So allein hier? Ich bin Lola. Und du bist … lass mich raten … jemand, der auf Abenteuer steht?“",
            frech: "„Whiskey. Pur“, bestellt sie bei imaginären Barkeeper. Dann dreht sie sich zu dir. „Und du? Was trinkt ein mysteriöser Typ wie du an einem Abend wie diesem?“",
            chaotisch: "„Hi!“, sie tut so, als würde sie stolpern und sich an dir festhalten. „Oh! Entschuldigung! Total peinlich! Aber … du riechst gut. Darf ich mich kurz bei dir abstützen?“",
          },
          choices: [
            { text: "Mitspielen und die Fremde mit Charme und Witz verführen.", tone: "push", heat: +16,
              reply: "Ihr improvisiert ein ganzes Gespräch, das nur so knistert vor Spannung. Zwei Fremde, die sich näher kommen — und gleichzeitig zwei Menschen, die sich längst kennen und diesen Tanz nur zum Vergnügen aufführen." },
            { text: "Die vierte Wand durchbrechen und sie überraschend küssen.", tone: "push", heat: +20,
              reply: "Mitten im Rollenspiel küsst du sie einfach. Sie ist überrascht, lacht und fällt aus der Rolle. „He! Das steht nicht im Skript!“, protestiert sie — und küsst dich zurück." },
          ],
        },
      ],
    },

    // ── roleplay_mentor: Lehrstunde ──
    roleplay_mentor: {
      intro: {
        default: "„Komm, setz dich neben mich“, sagt sie und klopft auf den Platz. „Ich werde dir heute etwas beibringen. Über Berührung. Über Hingabe. Über uns.“",
        weise: "„In all den Jahren“, beginnt sie, „habe ich viel gelernt. Heute Nacht gebe ich etwas davon weiter. An dich. Hör zu, lerne — und dann zeig mir, was du verstanden hast.“",
        schuechtern: "„Ich … ich hab was vorbereitet“, gesteht sie und holt eine Rolle mit gezeichneten Diagrammen hervor. „Das sind … na ja … Dinge, die ich dir zeigen möchte. Wenn du willst.“",
        vertraeumt: "„Stell dir vor, ich bin deine Lehrerin“, haucht sie. „In der Kunst der Zärtlichkeit. Jede Berührung eine Lektion. Jede Lektion ein Schritt näher zu dir.“",
      },
      scene: [
        {
          line: {
            default: "„Lektion eins“, sagt sie und nimmt deine Hand. „Die Handfläche. Hier sitzen tausende Nervenenden. Wenn du jemanden berührst — berühre ihn mit Absicht. Nicht flüchtig. Sondern präsent.“ Ihre Finger drücken sanft.",
            weise: "„Schließ die Augen“, instruiert sie. „Jetzt — wo spürst du mich?“ Ihre Finger berühren deine Wange. „Hier? Oder … hier?“ Sie wechselt zum Hals. „Lerne, Berührungen zu empfangen, bevor du sie gibst.“",
            schuechtern: "„Also … ähm … Lektion eins!“, sie räuspert sich. „Die … die empfindlichsten Stellen sind nicht immer die offensichtlichen.“ Sie berührt dein Handgelenk. „Zum Beispiel hier. Der Puls. Spürst du ihn?“",
            vertraeumt: "„Die erste Lektion“, haucht sie, „ist die schwierigste: Langsamkeit. Nicht Eile. Jede Berührung ein Satz in einem langen, langen Gedicht.“",
          },
          choices: [
            { text: "Aufmerksam zuhören und die Lektion verinnerlichen.", tone: "pull", heat: +6,
              reply: "Du lernst. Und je mehr du lernst, desto mehr willst du anwenden. Ihre pädagogische Strenge schmilzt langsam — darunter brennt Verlangen." },
            { text: "Die Schüler-Rolle ablegen und ihr zeigen, dass du auch etwas beibringen kannst.", tone: "push", heat: +16,
              reply: "Du nimmst ihre Hand und führst sie an eine Stelle, die nicht im Lehrplan stand. Sie stockt. „Oh …“, macht sie. „Das … stand da nicht. Aber es ist eine ausgezeichnete Ergänzung.“" },
          ],
        },
      ],
    },
  };

  // ============= M3 — Intensiv (pro ausgewähltem Fetisch) =============
  const BEATS_M3 = {

    // M3-Varianten für bondage (intensiver)
    bondage_soft_M3: {
      scene: [{
        line: {
          default: "Die Seidentücher sind jetzt straffer. Sie kann sich kaum noch bewegen — und ihr beschleunigter Atem verrät, wie sehr sie das erregt. „Fester“, flüstert sie. „Zeig mir, dass ich dir ausgeliefert bin. Zeig mir, wie sehr du mich willst, wenn ich nichts tun kann außer dich zu empfangen.“",
          frech: "„Okay“, keucht sie, die Handgelenke jetzt wirklich fixiert. „Das ist … mehr. Aber ich will mehr. Zeig mir, was du mit mir machst, wenn ich völlig hilflos bin. Ich vertrau dir.“",
          energisch: "„JA! Genau SO!“, ruft sie und zappelt gegen die Fesseln. „Ich kann NICHTS tun! Du hast alle Macht! Und ich … ich will sehen, was du damit machst!“",
          chaotisch: "„WOW! Okay! Das ist … ANDERS!“, sie ruckelt an den Fesseln. „Ich bin WIRKLICH gefesselt! Nicht so 'n bisschen' sondern RICHTIG! Und ehrlich gesagt … macht mich das extrem an!“",
        },
        choices: [
          { text: "Die volle Kontrolle übernehmen und sie in völliger Hingabe nehmen.", tone: "push", heat: +24, fade: true, reply: "" },
          { text: "Jeden Zentimeter ihres gefesselten Körpers mit intensiven Berührungen erkunden.", tone: "push", heat: +24, fade: true, reply: "" },
        ],
      }],
    },

    // M3-Varianten für rough (intensiver)
    rough_passionate_M3: {
      scene: [{
        line: {
          default: "Es gibt keine Zärtlichkeit mehr, nur noch rohes, ungefiltertes Verlangen. Du presst sie gegen die Wand, deine Hand an ihrer Kehle, gerade fest genug, dass sie die Kontrolle spürt. Ihre Augen leuchten. „Ja“, keucht sie. „So will ich dich. Halt mich fest. Lass mich spüren, dass ich dir gehöre.“",
          energisch: "„HÄRTER!“, schreit sie und schlägt mit der flachen Hand gegen die Wand. „Ich hab gesagt HÄRTER! Ich will's SPÜREN! Ich will morgen früh JEDEN Muskel spüren und bei JEDEM lächeln!“",
          frech: "Sie packt deine Hand und führt sie an ihren Hals. „Trau dich“, fordert sie. „Zeig mir, dass du keine Angst hast. Zeig mir, dass du mich willst — kompromisslos, ungefiltert, ganz.“",
          chaotisch: "„VERGISS ALLE REGELN!“, brüllt sie. „Vergiss 'sanft'! Vergiss 'vorsichtig'! Ich will den STURM! Ich will, dass wir danach beide wissen: DAS war Leidenschaft!“",
        },
        choices: [
          { text: "Sie mit ungezügelter Intensität nehmen, jede Grenze ausloten, die sie dir anbietet.", tone: "push", heat: +24, fade: true, reply: "" },
        ],
      }],
    },

    // M3-Varianten für edging (intensiver)
    edging_M3: {
      scene: [{
        line: {
          default: "Es ist Folter. Süße, perfekte Folter. Zum fünften Mal ziehst du deine Hand zurück, und sie schluchzt fast vor Frustration und Lust. „Bitte“, wimmert sie. „Ich kann nicht mehr. Ich tu ALLES. Nur … bitte. Erlöse mich.“",
          energisch: "„OKAY OKAY ICH GEB AUF!“, schreit sie und Tränen der Frustration in den Augen. „DU HAST GEWONNEN! Jetzt LASS MICH KOMMEN! BITTE! ICH MACH AUCH ALLES WAS DU WILLST NUR LASS MICH KOMMEN!“",
          frech: "Sie ist am Ende. Die coole Fassade komplett zerbrochen. „Ich bettel“, flüstert sie. „Ich, die nie bettelt. Ich bettel dich an. Bitte. Lass mich kommen. Ich … ich kann nicht mehr.“",
          weise: "„Du hast mich gebrochen“, gesteht sie mit zitternder Stimme. „Die Weise, die immer die Kontrolle behält. Gebrochen von Verlangen. Und ich bereue nichts.“",
        },
        choices: [
          { text: "Endlich Erbarmen zeigen und sie über die Kante bringen.", tone: "push", heat: +24, fade: true, reply: "" },
          { text: "Noch einmal zurückziehen und ihr Flüstern genießen, bevor du sie erlöst.", tone: "tease", heat: +6, fade: true, reply: "" },
        ],
      }],
    },

    // M3-Varianten für primal (intensiver)
    primal_M3: {
      scene: [{
        line: {
          default: "Ihr seid keine Menschen mehr, sondern zwei Geschöpfe, die einander jagen. Sie knurrt, du antwortest, und was dann passiert, ist nicht gedacht, nicht geplant — nur gefühlt. Haut. Zähne. Krallen. Du nimmst sie, und sie nimmt dich, und danach liegt ihr keuchend auf dem Boden, unfähig zu sprechen, unfähig, etwas anderes zu spüren als reine, tiefe Befriedigung.",
          energisch: "„JAGD!“, flüstert sie mit wilden Augen. „Ich bin die Jägerin. Du die Beute. Oder umgekehrt. Oder BEIDES! Los, lauf — damit ich dich fangen kann!“",
          chaotisch: "„AAAAAH!“, sie knurrt und macht sich auf alle Viere. „Ich bin ein WOLF! Ein sexy Wolf! Und du bist … auch ein Wolf! Zwei Wölfe! Keine Regeln! Nur INSTINKT!“",
          frech: "„Keine Worte mehr“, knurrt sie und schubst dich aufs Bett. „Kein Denken. Nur Instinkt. Nur was unsere Körper wollen. Und glaub mir — sie wollen VIEL.“",
        },
        choices: [
          { text: "Dem Instinkt völlig nachgeben und im Rausch der Sinne versinken.", tone: "push", heat: +24, fade: true, reply: "" },
        ],
      }],
    },
  };

  // ============= Afterglow — erweiterte Varianten =============
  const AFTERGLOW = {
    default: "Später. Das Feuer ist zu Glut heruntergebrannt. Ihr liegt eng beieinander, ihr Kopf an deiner Brust, ihr Finger zeichnet faule Kreise auf deine Haut. „Das“, flüstert sie verschlafen und glücklich, „war jede Sekunde des Wartens wert.“",
    froehlich: "Später, als die Kerzen heruntergebrannt sind, liegt sie quer über dir und kichert. „Weißt du was? Das war der beste Abend MEINES LEBENS. Und ich hab wortwörtlich die Ewigkeit als Vergleich!“",
    schuechtern: "Später, im sanften Glutschein, ist von ihrer Schüchternheit nichts mehr übrig — nur ein zufriedenes, verträumtes Lächeln. „Ich war so nervös“, gesteht sie leise. „Und jetzt will ich nie wieder woanders sein als hier.“",
    frech: "Später, atemlos und grinsend, liegt sie halb auf dir. „Okay, zugegeben“, schnurrt sie, „du bist deutlich besser, als deine Witze vermuten lassen.“ Sie küsst dich auf die Schulter. „Viel besser.“",
    vertraeumt: "Später treibt ihr beide in jener warmen Stille zwischen Wachen und Träumen. „Wenn das ein Traum ist“, murmelt sie an deinem Hals, „dann will ich nie wieder aufwachen.“",
    energisch: "Später, beide völlig erschöpft und glücklich, grinst sie zur Decke. „Okay. Das war's. Morgen gleiche Zeit. Keine Ausreden. Ich bin dann mal im Regenerationsmodus. Weck mich mit Küssen.“",
    weise: "Später, in der Stille nach dem Sturm, streicht sie dir übers Haar. „Manche Nächte vergisst man nie. Diese hier … wird eine der ersten Erinnerungen sein, die mir im hohen Alter noch einfällt.“",
    chaotisch: "Später, während sie versucht, ihre Socken wiederzufinden (einer hängt an der Türklinke), lacht sie immer noch. „Okay, das war PERFEKT! Zehn von zehn! Würde ich wieder tun! Und werde ich! Bald!“",
  };

  const beatCount = BEATS.length;

  return {
    BEATS, beatCount,
    BEATS_ENTKLEIDEN, BEATS_ERFUELLUNG,
    BEATS_M2, BEATS_M3,
    AFTERGLOW,
    flavor,
  };
})();
