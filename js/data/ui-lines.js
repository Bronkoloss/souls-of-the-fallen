"use strict";

const PERSONALITY_KEYS = Object.keys(PERSONALITIES);

/* Reaktionen, wenn Aktionen zu schnell wiederholt werden. */
const COOLDOWN_LINES = [
  "Hihi, gönn mir kurz eine Verschnaufpause!",
  "Gleich nochmal? Lass uns das gleich wiederholen — gleich!",
  "Moment, ich bin noch beim letzten Mal!",
];

/* Sprüche der Begleiterin beim Folgen. */
const FOLLOW_LINES = [
  "Ich bleibe direkt hinter dir!",
  "Wohin gehen wir? Egal, ich komme mit!",
  "Führ den Weg an, ich passe auf dich auf!",
];

const WAIT_LINES = [
  "Okay, ich warte hier. Beeil dich!",
  "Gut, ich genieße solange die Aussicht.",
  "Ich bin hier, wenn du mich brauchst!",
];
