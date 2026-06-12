"use strict";

/* Persönlichkeiten der Geretteten.
   Tiers: 0 = Fremde, 1 = Freundin, 2 = Beste Freundin */
const PERSONALITIES = {
  froehlich: {
    label: "fröhlich",
    emoji: "☀️",
    greet: [
      ["Oh, hallo! Ein neues Gesicht! Also … das Gesicht, das mich gerettet hat!", "Hi! Ist es hier nicht HERRLICH? Es ist immer herrlich!"],
      ["Da bist du ja wieder! Ich habe schon Ausschau gehalten!", "Hallo du! Die Sonne scheint, du bist da — perfekter Tag!"],
      ["Mein Lieblingsmensch ist da! Der Tag kann nichts mehr falsch machen!", "DA bist du! Ich hab den Schmetterlingen schon von dir erzählt!"],
    ],
    talk: [
      [
        "Weißt du, dass die Sonne hier nie untergeht? Ich habe es drei Tage lang geprüft. Sehr gründlich. Mit Nickerchen.",
        "Ich habe heute zweiundzwanzig Schmetterlinge gezählt. ZWEIUNDZWANZIG!",
        "Als Zombie konnte ich nicht lächeln. Ich hole gerade alles nach, falls du dich wunderst.",
        "Das Gras hier kitzelt an den Füßen. Ich bin seit Stunden barfuß unterwegs!",
      ],
      [
        "Ich habe dir einen Stein mitgebracht! Er sieht aus wie ein Herz. Okay, eher wie eine Kartoffel. Aber mit Liebe!",
        "Die Mädels am See sagen, ich rede zu viel. Ich sage: Ich rede genau richtig viel!",
        "Wenn du mal traurig bist, komm zu mir. Ich kenne 14 Arten von Umarmungen.",
        "Ich übe gerade Pfeifen mit Grashalmen. Beschwer dich nicht, wenn es quietscht!",
      ],
      [
        "Weißt du was? Mit dir ist sogar das Paradies noch ein bisschen schöner. Und das ist wissenschaftlich kaum möglich!",
        "Ich habe beschlossen: Du bekommst lebenslanges Umarmungs-Abo. Es gibt kein Kündigungsrecht!",
        "Manchmal denke ich an den Tag, an dem du mich befreit hast. Bester Tag ever. Direkt nach heute.",
      ],
    ],
    jokeReact: ["HAHAHA! Der ist GUT! Den erzähle ich heute Abend allen weiter!", "Pfff—hahaha! Ich kann nicht mehr!", "Okay, der war flach. Aber ich lache trotzdem, schau!"],
    complimentReact: ["Awww! Hör auf! Nein warte — mach weiter!", "*strahlt wie die Jenseits-Sonne* Dankeschön!!", "Das schreibe ich mir auf einen Stein und behalte ihn für immer!"],
    danceReact: ["Tanzen?! IMMER! Los, die Hügel gucken schon zu!", "Juhu! Aber ich warne dich: Ich tanze wie ein glücklicher Flummi!"],
    giftReact: ["Eine Blume?! Für MICH?! Das ist offiziell der beste Tag im Jenseits!", "Ich werde sie gießen! Ähm … kann man gepflückte Blumen gießen? Egal! DANKE!"],
  },

  schuechtern: {
    label: "schüchtern",
    emoji: "🌸",
    greet: [
      ["Oh … h-hallo. Du bist das, oder? Der mich … na ja … danke.", "*winkt ganz vorsichtig* Hallo …"],
      ["Hallo … schön, dass du wieder da bist. Wirklich.", "Oh! Du bist es. *lächelt in den Boden*"],
      ["*strahlt* Du bist da! Ich … ich habe dir einen Platz am See freigehalten.", "Hallo du. Bei dir muss ich gar nicht mehr nervös sein. Fast."],
    ],
    talk: [
      [
        "Ich sitze gern dort am Wasser … es ist schön still. Nicht, dass du laut bist! Also … ähm.",
        "Die anderen sind alle so … viel. Aber nett! Alle sehr nett. Ich gucke meistens zu.",
        "Als Zombie musste ich nie Smalltalk machen. Das war … der einzige Vorteil.",
      ],
      [
        "Ich habe ein Geheimnis: Ich singe manchmal für die Enten. Sie … sie beschweren sich nie.",
        "Mit dir zu reden ist gar nicht so schwer. Das ist ein großes Kompliment, ehrlich.",
        "Ich habe dir Beeren gepflückt. Aber dann habe ich sie vor Nervosität selbst gegessen. Tut mir leid.",
      ],
      [
        "Weißt du … von allen hier bist du der Einzige, bei dem ich einfach ich sein kann.",
        "Ich habe den anderen von dir erzählt. Laut. Vor Publikum. Ich war so mutig wie noch nie!",
        "Wenn du da bist, fühlt sich das Jenseits an wie … nach Hause kommen.",
      ],
    ],
    jokeReact: ["*kichert leise hinter der Hand* … der war gut.", "Pff … hihi! N-nicht weitersagen, dass ich gelacht habe.", "*wird rot vor Lachen* Ich … okay, der war wirklich lustig."],
    complimentReact: ["*wird knallrot* I-ich … äh … die Blumen da drüben sind auch hübsch! Ich meine — danke!", "*versteckt das Gesicht* Du kannst sowas doch nicht einfach SAGEN …", "… das war das Schönste, das mir je jemand gesagt hat. Flüster ich jetzt einfach mal."],
    danceReact: ["T-tanzen? Vor LEUTEN? … okay. Aber nur, weil du es bist.", "*nimmt zaghaft deine Hand* Wenn ich stolpere, fangen wir einfach neu an, ja?"],
    giftReact: ["Für … für mich? *hält die Blume wie einen Schatz* Ich presse sie in mein Tagebuch.", "*flüstert* Das ist die schönste Blume der ganzen Wiese. Danke."],
  },

  frech: {
    label: "frech",
    emoji: "😏",
    greet: [
      ["Na, wen haben wir denn da? Den Helden persönlich. Kein Autogramm, danke.", "Ah, der Retter. Lass mich raten: Du willst, dass ich 'danke' sage. Süß."],
      ["Sieh an, du schon wieder. Langsam glaube ich, du magst mich.", "Na, Held? Heute schon jemanden gerettet oder machst du Pause?"],
      ["Da ist ja mein Lieblingsheld. Sag's keinem weiter, ruiniert meinen Ruf.", "Endlich! Hier ist es schrecklich langweilig, wenn du nicht da bist. Hab ich nie gesagt."],
    ],
    talk: [
      [
        "Das Paradies ist ganz okay. Drei Sterne. Der Service könnte schneller sein.",
        "Du hast mich erschossen, weißt du noch? Schwamm drüber — aber ich erwähne es einfach gern.",
        "Die da drüben sagt, ich sei 'schwierig'. Ich bin nicht schwierig. Ich bin limitiert verfügbar.",
      ],
      [
        "Okay, zugegeben: Die Aussicht hier ist erstklassig. Fast so gut wie meine Sprüche.",
        "Ich habe den Enten am See Namen gegeben. Die fetteste heißt jetzt wie du. Ehrensache.",
        "Wenn du das hier jemandem erzählst, leugne ich alles: Du bist ganz okay.",
      ],
      [
        "Na gut. GANZ offiziell, einmalig, ohne Zeugen: Danke, dass du mich gerettet hast. So. Nie wieder.",
        "Beste Freunde? Wir? … Ja, von mir aus. Aber ich such die Spitznamen aus.",
        "Du bist der einzige Mensch, dessen Witze ich freiwillig ein zweites Mal höre. Das ist quasi ein Adelstitel.",
      ],
    ],
    jokeReact: ["Ha! Okay. Der war … akzeptabel. Für deine Verhältnisse: brillant.", "*verdreht die Augen und grinst dabei* Furchtbar. Erzähl noch einen.", "Ich lache nicht. Das ist ein Husten. Ein sehr amüsierter Husten."],
    complimentReact: ["Ich weiß. Aber schön, dass du es auch endlich merkst.", "Charmeur. Bei mir wirkt sowas nicht. *dreht sich weg, um das Grinsen zu verstecken*", "Weiter. Ich meine — wie bitte? Na gut: weiter."],
    danceReact: ["Tanzen? Mit dir? … Na schön. Aber ich führe.", "Eine Runde. EINE. Okay, vielleicht zwei, wenn du nicht auf meine Füße trittst."],
    giftReact: ["Eine Blume. Wie originell. *steckt sie sich sofort ins Haar* Was? Sie passte zu mir.", "Bestechung? Funktioniert. Leider. Danke."],
  },

  vertraeumt: {
    label: "verträumt",
    emoji: "🌙",
    greet: [
      ["Hm? Oh … hallo. Ich habe gerade mit einer Wolke geredet. Sie lässt grüßen.", "Oh, du bist echt. Ich war mir kurz nicht sicher."],
      ["Ah, du bist zurück. Ich habe von dir geträumt. Du warst ein freundlicher Leuchtturm.", "Hallo … setz dich. Der Himmel macht heute wieder Kunst."],
      ["Da bist du. Mein Lieblingsmensch aus der wachen Welt.", "Ich habe den Sternen von dir erzählt. Sie blinzeln jetzt extra für dich."],
    ],
    talk: [
      [
        "Wenn man lange genug ins Gras schaut, sieht man, wie es wächst. Ich habe viel Zeit.",
        "Die Schmetterlinge hier kennen alle meinen Namen. Sie sprechen ihn nur sehr leise aus.",
        "Als Zombie habe ich viel geträumt. Hauptsächlich von Schnitzel. Komisch, oder?",
      ],
      [
        "Ich sammle Sonnenstrahlen. In Gedanken. Mein Lager ist schon ziemlich voll.",
        "Manchmal tanze ich mit meinem Schatten. Er führt. Er ist sehr höflich.",
        "Du hast ein warmes Leuchten um dich herum. Ungefähr honigfarben. Sehr selten.",
      ],
      [
        "Ich habe einen Stern nach dir benannt. Den hellen da. Er war einverstanden.",
        "Wenn du irgendwann mal wieder gehst, falte ich aus der Erinnerung ein Boot und segle hinterher.",
        "Von allen Träumen, die ich je hatte, bist du der, der geblieben ist.",
      ],
    ],
    jokeReact: ["*lacht drei Sekunden verzögert* … oh! OH! Jetzt verstehe ich ihn. Wunderbar!", "Hihi … den erzähle ich heute Nacht dem Mond.", "*kichert verträumt* Die Wolke da drüben fand ihn auch gut, sagt sie."],
    complimentReact: ["*lächelt, als wäre sie ganz woanders* … das hängt jetzt für immer in meinem Kopf. Gerahmt.", "Oh … danke. Ich glaube, die Blumen haben mitgehört. Sie sind jetzt eifersüchtig.", "Du sagst Dinge, die wie warme Sterne fallen. Schön."],
    danceReact: ["Tanzen … ja. Aber langsam, damit die Wolken mitkommen.", "*schwebt förmlich auf dich zu* Der Wind macht heute die Musik."],
    giftReact: ["Eine Blume … sie träumt noch ein bisschen. Ich passe auf sie auf.", "*hält die Blume ans Ohr* Sie singt. Danke dir."],
  },

  energisch: {
    label: "energisch",
    emoji: "⚡",
    greet: [
      ["DA bist du! Perfektes Timing — ich wollte gerade den Hügel da besteigen. Mitkommen!", "Hey! Keine Zeit zu verlieren, das Paradies erkundet sich nicht von selbst!"],
      ["Mein Trainingspartner ist da! Heute: Wettrennen zum See. Verliererin grüßt die Enten.", "Na endlich! Ich habe schon drei Runden ums Dorf gedreht. DREI!"],
      ["BESTE Nachricht des Tages: Du bist hier! Los, wir haben Pläne! Ich habe Pläne. Du kommst mit!", "Da ist ja meine Lieblings-Verstärkung! High Five! Sofort!"],
    ],
    talk: [
      [
        "Ich bin heute schon zum Wasserfall gerannt und zurück. Zweimal. Das Jenseits hat NULL Steigung, super!",
        "Als Zombie war ich SO langsam. Ich gleiche das jetzt aus. Für immer.",
        "Liegestütze? Ich mache 30! Okay, fünf. Aber mit GEFÜHL!",
      ],
      [
        "Ich trainiere die Mädels jetzt zweimal die Woche. Nennen es 'Seelen-Bootcamp'. Anmeldung bei mir!",
        "Wusstest du, dass man Hügel runterrollen kann? Ich bin quasi Profi. Das Gras war einverstanden.",
        "Du hältst dich gut für jemanden, der ständig von Zombies umzingelt ist. Respekt!",
      ],
      [
        "Du und ich, wir sind ein Team. Du rettest Seelen, ich bringe ihnen Kniebeugen bei. Arbeitsteilung!",
        "Ich habe eine Trophäe für dich geschnitzt. Aus einer Karotte. Iss sie nicht — okay, iss sie, ich mach neue.",
        "Für dich laufe ich sogar langsam. Das ist das größte Geschenk, das ich zu vergeben habe.",
      ],
    ],
    jokeReact: ["HA! *klatscht sich auf die Knie* Der hatte Power!", "Hahaha! Okay, der geht ins Trainingsprogramm. Lach-Muskeln zählen auch!", "*lacht so laut, dass Vögel auffliegen* GUTER WITZ!"],
    complimentReact: ["JA! Sag ich doch! Ähm, ich meine: danke! *grinst breit*", "Boom! Tagesmotivation gesichert! Du kannst was!", "Dafür gibt's eine Ehrenrunde um den See! Für DICH!"],
    danceReact: ["Tanzen ist Cardio! ICH BIN DABEI!", "Letzte Person auf der Tanzfläche gewinnt! LOS!"],
    giftReact: ["Eine Blume! Ich stecke sie an und renne damit eine Siegerrunde!", "Für mich? YES! Die kriegt einen Ehrenplatz. Den allerbesten!"],
  },

  weise: {
    label: "weise",
    emoji: "🦉",
    greet: [
      ["Ah, der Wanderer zwischen den Welten. Setz dich, der Augenblick hat Zeit.", "Sei gegrüßt. Ich habe dich erwartet — oder jemanden wie dich. Die Genauigkeit lässt hier nach."],
      ["Willkommen zurück. Der Weg zeigt sich dem, der ihn geht. Du gehst ihn oft, fällt mir auf.", "Ah, du. Die Brücke knarrte vorhin — sie kündigt gute Gäste an."],
      ["Mein junger Freund. Die Sonne steht günstig, das Gespräch wird gut.", "Da bist du. Ich habe Tee. Ich habe keine Tassen. Wir improvisieren."],
    ],
    talk: [
      [
        "Der Fluss fragt nie, wohin er fließt. Daran könnte sich so mancher ein Beispiel nehmen. Ich zum Beispiel.",
        "Ein Zombie zu sein lehrt Geduld. Hauptsächlich, weil man nirgendwo schnell hinkommt.",
        "Das Gras wächst nicht schneller, wenn man daran zieht. Ich habe es dennoch versucht. Aus Forschungsgründen.",
      ],
      [
        "Weißt du, was schwerer ist als ein Fels? Ein Groll. Deshalb sammle ich lieber Steine.",
        "Die Jüngeren fragen mich um Rat. Ich erzähle ihnen irgendwas mit Flüssen. Funktioniert immer.",
        "Du hörst gut zu. Das ist seltener als ein vierblättriges Kleeblatt — und nützlicher.",
      ],
      [
        "Ich habe vielen Seelen zugehört. Deine hat den geradesten Klang. Das vergisst man nicht.",
        "Eines Tages, wenn du alt bist, wirst du jemandem von diesem Land erzählen. Sag ihm: Die Weise hatte recht. Mit allem.",
        "Zwischen tausend Wegen hast du den hierher gefunden. Vielleicht war das kein Zufall. Vielleicht doch. Schön ist es trotzdem.",
      ],
    ],
    jokeReact: ["*nickt langsam* … haha. Hervorragend. Humor ist die kürzeste Brücke zwischen zwei Seelen.", "*schmunzelt in sich hinein* Den werde ich als Weisheit weiterverkaufen.", "Hm. Hm-hm. *lacht dann doch laut los* Verzeihung. Der war gut."],
    complimentReact: ["Schmeichelei ist Honig — aber selbst die Weise nascht gern. Danke.", "*lächelt milde* Ich werde so tun, als hätte ich das erwartet. Habe ich nicht.", "Deine Worte fallen auf fruchtbaren Boden. Da wächst jetzt Freude."],
    danceReact: ["Auch die Eule tanzt, wenn niemand hinsieht. Du darfst zusehen. Ausnahmsweise.", "Tanz ist Philosophie in Bewegung. Ich philosophiere führend, einverstanden?"],
    giftReact: ["Eine Blume welkt — die Geste nie. Ich danke dir, junger Freund.", "*betrachtet die Blume lange* Sie hat sieben Blütenblätter. Eine gute Zahl. Ich nehme sie."],
  },

  chaotisch: {
    label: "chaotisch",
    emoji: "🎲",
    greet: [
      ["HALLO! Warte — kenn ich dich? Ach, du bist der mit dem Lärm! Cool!", "Oh! Besuch! Ich habe nichts vorbereitet! Ich bereite NIE was vor! Perfekt!"],
      ["DU! Genau dich brauche ich! Halt mal kurz … ach, hab's schon fallen lassen. Egal! Hi!", "Da bist du ja! Ich wollte dir was erzählen. Es ist weg. Es kommt wieder. Bleib da!"],
      ["MEIN HELD! *stolpert über einen Grashalm* Geplant! Das war geplant!", "Du schon wieder! Beste Überraschung seit der Sache mit den Enten! Frag nicht."],
    ],
    talk: [
      [
        "Ich wollte heute Beeren sammeln. Jetzt habe ich drei Steine, einen Stock und eine Wespe als Feindin. Guter Tag!",
        "Als Zombie bin ich IMMER im Kreis gelaufen. Die anderen fanden's unheimlich. Ich fand's gemütlich.",
        "Weißt du, was komisch ist? Knie. Denk mal drüber nach. KNIE.",
      ],
      [
        "Ich habe versucht, den Enten Synchronschwimmen beizubringen. Eine kann's jetzt. Glaube ich. Vielleicht war's ein Fisch.",
        "Gestern habe ich ein Lied erfunden! Es hat keine Melodie und keinen Text, aber der Titel ist FANTASTISCH.",
        "Du bist einer der wenigen, die nicht weglaufen, wenn ich 'Ich hab eine Idee!' rufe. Das ehrt dich. Es sollte dich beunruhigen.",
      ],
      [
        "Okay, Geheimnis: Von allen Menschen, die ich kenne, bist du mein Lieblings-Chaos. Und ich kenne MICH!",
        "Wenn ich mal wieder auf einem Baum festsitze — und das WERDE ich — bist du der Erste, den ich rufe.",
        "Ich habe uns Freundschaftsarmbänder gemacht! Aus Gras. Sie sind schon kaputt. Die Geste zählt!",
      ],
    ],
    jokeReact: ["HAHAHA! *fällt theatralisch ins Gras* Bester Witz! Oder Top 3! Die Liste ändert sich stündlich!", "PFFFT—hahaha! Den merke ich mir! Ich vergesse ihn! Erzähl ihn nochmal!", "*lacht und verschluckt sich an Luft* Wie macht man das?! Egal! NOCHMAL!"],
    complimentReact: ["Für MICH?! Das Kompliment?! Ich rahme es! Womit rahmt man Worte?! EGAL, DANKE!", "*verbeugt sich und stolpert dabei* Dankeschön! Das war Absicht! Die Verbeugung, nicht das Stolpern!", "Ohhh! Sag das nochmal, ich war nicht bereit! Doch, war ich! DANKE!"],
    danceReact: ["TANZEN! Ich erfinde gerade einen neuen Stil! Er heißt 'kontrollierter Sturz'!", "JA! Aber Vorsicht: Meine Arme machen manchmal ihr eigenes Ding!"],
    giftReact: ["EINE BLUME! Ich nenne sie Brunhilde! Wir sind jetzt zu dritt!", "*nimmt die Blume feierlich entgegen und niest hinein* … sie ist PERFEKT."],
  },
};
