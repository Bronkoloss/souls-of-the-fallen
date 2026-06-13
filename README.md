# Souls of the Fallen

Ein 2D-Zombie-Survival-Spiel mit einem versöhnlichen Twist: Die Zombies waren
einmal echte Menschen. Jede befreite Seele wird im **Jenseits** als der Mensch
wiedergeboren, der sie einst war — und dort geht es erst richtig los: Eine
ganze Welt wartet darauf, erkundet zu werden, voller geretteter Menschen, mit
denen man reden, lachen und tanzen kann.

## Spielablauf

1. **Survival-Phase (Diesseits)** — Du stehst in einem verlassenen Hof, in dem
   immer mehr Untote auftauchen. Verteidige dich, sammle Waffen und Medikits
   und befreie so viele Seelen wie möglich. Es gibt drei Zombie-Typen:
   Läufer (schnell), normale Untote und Brocken (langsam, aber zäh).
2. **Jenseits** — Sobald deine Lebensenergie aufgebraucht ist, steigt deine
   Seele auf. Im Jenseits erwachen alle befreiten Seelen als gerettete
   Menschen — jede mit einzigartigem Aussehen, Namen, Persönlichkeit und
   einem (oft sehr lustigen) Vorleben.
3. **Der Kreislauf** — Durch das Portal im Norden kehrst du ins Diesseits
   zurück und befreist weitere Seelen. Die Bevölkerung des Jenseits wächst
   mit jedem Durchlauf — der Spielstand wird automatisch gespeichert.

## Das Jenseits

Eine große, frei begehbare Welt mit:

- **Dorf** mit Häusern, Brunnen und Marktstand
- **Fluss** mit drei Brücken und einem **See** mit Steg
- **Festplatz** mit Tanzfläche, Lagerfeuer und Laternen
- **Blumenwiesen**, auf denen man Blumen zum Verschenken sammelt
- **Portal** zurück ins Diesseits
- Minimap, Schmetterlinge, plaudernde Bewohnerinnen und vieles mehr

### Interaktionen

Mit jeder Geretteten kann man (Taste `E` in ihrer Nähe):

| Aktion | Wirkung |
|--------|---------|
| 💬 Reden | Persönlichkeitsabhängige Gespräche, mit der Zeit erfährt man ihr Vorleben |
| 😄 Witz erzählen | Jede Persönlichkeit reagiert anders |
| 🌹 Kompliment | Bringt sie zum Erröten |
| 💃 Tanzen | Gemeinsame Tanzeinlage mit Musiknoten |
| 🌸 Blume schenken | Großer Freundschaftsbonus (Blumen vorher sammeln!) |
| 🚶‍♀️ Begleite mich | Beste Freundinnen (5 Herzen) folgen dir durch die Welt |
| 💕 Herzgespräch | Beste Freundinnen (5 Herzen): ein fortlaufender, verführerischer Dialog |

Freundschaft wird in **Herzen** (0–5) gemessen und dauerhaft gespeichert.
Mit steigender Freundschaft schalten sich neue, persönlichere Dialoge frei.

### 💕 Herzgespräch

Sobald eine Gerettete zur **besten Freundin** (5 Herzen) geworden ist, schaltet
sich das **Herzgespräch** frei — ein eigener Gesprächsmodus, der sich deutlich
vom normalen Dialog unterscheidet:

- Statt einzelner Aktionen wählt man aus **2–3 fortführenden Antworten**, die
  sich zu einem **zusammenhängenden, fortlaufenden Gespräch** verweben.
- Eine **Spannungsanzeige** ("ein zartes Knistern" → "atemlos") steigt mit jeder
  Antwort — und fällt bei neckischen oder zurückhaltenden Optionen bewusst kurz
  wieder ab. Dieses **Push & Pull** baut die Spannung Schritt für Schritt auf.
- Antworten sind in drei Tönen eingefärbt: **forsch** (treibt voran), **neckend**
  und **zurückhaltend** (löst die Spannung kurz, um sie danach umso mehr zu
  steigern).
- Jede der sieben Persönlichkeiten reagiert mit **eigenen Texten**.
- Am Höhepunkt geht man **gemeinsam in ihr Haus** — eine private, in warmes
  Kerzen- und Kaminlicht getauchte Innenraum-Szene, in der das Gespräch
  weitergeht und schließlich in einem sanften **Fade-to-Black** mündet.
- Belohnung: eine bleibende **Erinnerung** und ein Freundschaftsbonus.

Der Ton ist bewusst **andeutend und atmosphärisch** — Spannung entsteht durch
Stimmung, Worte und Andeutung, nicht durch explizite Darstellung.

#### Kino-Inszenierung

Das Herzgespräch läuft als eigener **Kino-Modus**: Letterbox-Balken fahren
ein, das HUD blendet aus, die Kamera zoomt sanft auf das Paar und zentriert
es, eine Vignette dunkelt die Welt ab. Um die beiden herum steigen
Glut-Funken und Herzchen auf. Das Panel zeigt **Porträt und Namen** der
Partnerin; Leuchtfarbe, Herzschlag-Puls und ein hörbarer **Herzschlag**
reagieren live auf die Spannung. Die Innenraum-Szene ist ein vollständig
prozedurales Interieur: Kamin mit animierten Flammen und Funken, Mondfenster
mit Lichtstrahl und Staubpartikeln, Lichterkette, Wein, Blumenvase — und
zwei Silhouetten, die mit steigender Spannung näher zusammenrücken.

#### Erweiterungs-Architektur (Stages & Hooks)

Das Herzgespräch ist als **Stage-Folge** aufgebaut (`funke` → `zuhause` →
Abspann) und gezielt erweiterbar — der ausführliche Leitfaden steht im
Kopfkommentar von `js/afterlife/intimate.js`:

- `AfterlifeIntimate.registerStage(stage)` fügt eigene Stages mit eigenen
  Beats und optional **eigenem Szenen-Renderer** ein
  (`AfterlifeIntimate.RenderHelpers` stellt alle Interieur-Ebenen bereit).
- Jede Stage trägt einen **Reifegrad** (`maturity`); aktiv ist nur, was
  `Save.data.maturity` (Standard `0`) erlaubt. Die mitgelieferten Inhalte
  bleiben bewusst auf Stufe 0 (andeutend).
- `AfterlifeIntimate.hooks` (`onStageEnter`, `onBeat`, `onChoice`,
  `onClimax`, `onFinish`, `drawOverlay`) erlauben Eingriffe ohne
  Engine-Änderungen.

### Persönlichkeiten

Jede Gerettete hat eine von sieben Persönlichkeiten mit eigenen Dialogen:
☀️ fröhlich · 🌸 schüchtern · 😏 frech · 🌙 verträumt · ⚡ energisch ·
🦉 weise · 🎲 chaotisch

## Steuerung

| Aktion | Tasten |
|--------|--------|
| Bewegen | `W` `A` `S` `D` / Pfeiltasten |
| Zielen / Schießen (Diesseits) | Maus / Linksklick halten |
| Rennen (Jenseits) | `Shift` |
| Interagieren (Jenseits) | `E` |
| Gespräch beenden | `Esc` |

## Starten

Keine Installation nötig — reines HTML5 + Canvas + JavaScript, ohne
Abhängigkeiten. Alle Grafiken werden prozedural gezeichnet, alle Sounds
per WebAudio synthetisiert.

```bash
# Python 3
python3 -m http.server 8000
# dann im Browser: http://localhost:8000
```

## Dateien

```
index.html          — Aufbau, HUD, Overlays, Script-Ladereihenfolge
style.css           — komplettes Styling der Oberfläche

js/
  core/             — Canvas, DOM, Input, Spielstand
  data/             — Namen, Persönlichkeiten, Dialoge, Witze
  audio.js          — synthetisierte Sound-Effekte (WebAudio)
  characters/       — prozedurales Charakter-Rendering
  survival/         — Survival-Phase: Wellen, Kampf, Pickups
  afterlife/        — Jenseits-Welt: Karte, NPCs, Dialoge, Minimap
  app/              — Zustandsmaschine, Menü, Events, Hauptschleife
  main.js           — Einstiegspunkt
```

### Modul-Übersicht

| Ordner | Inhalt |
|--------|--------|
| `core/` | `canvas.js`, `dom.js`, `input.js`, `save.js` |
| `data/` | `names.js`, `backstories.js`, `jokes.js`, `personalities.js`, `ui-lines.js`, `seduction.js` |
| `characters/` | Zeichen-Helfer, Paletten, Frau/Held/Zombie, Porträt |
| `survival/` | Zustand, Waffen, Rendering, Spiel-Logik |
| `afterlife/` | Config, Welt, Freundschaft, Dialog, Herzgespräch (`intimate.js`), Update, Rendering |
| `app/` | Spielzustände, Menü, Event-Handler, Game-Loop |

Der Ordner `save/` enthält eine unveränderte Kopie der ursprünglichen Monolith-Struktur.

## Hinweis zum Design

Die Geretteten im Jenseits sind aktuell bewusst **ausschließlich Frauen** —
das Design-System (Frisuren, Gesichter, Outfits) wird zunächst hier
verfeinert, bevor männliche Charaktere ergänzt werden.
