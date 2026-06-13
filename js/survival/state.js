"use strict";

const SurvivalState = {
  player: null,
  bullets: null,
  zombies: null,
  souls: null,
  particles: null,
  pickups: null,
  stains: null,
  // Neue Kampf-Elemente
  acids: null,        // Säure-Geschosse der Speierinnen
  barrels: null,      // explosive Fässer
  beams: null,        // Blitzlanze-Strahlen (visuell)
  shocks: null,       // Schockwellen-Ringe (Koloss-Stampfer, Explosionen)
  soulBolts: null,    // Geschosse der Seelenwacht
  guardians: null,    // Schutzgeister (beste Freundinnen aus dem Jenseits)
  kills: null,
  wave: null,
  spawnTimer: null,
  spawnInterval: null,
  fireCooldown: null,
  elapsed: null,
  pickupTimer: null,
  barrelTimer: null,
  shake: null,
  hurtFlash: null,
  waveBannerT: null,
  bossBannerT: null,
  moonBannerT: null,
  guardianBannerT: null,
  bloodMoon: null,    // aktive Blutmond-Welle?
  lastBossWave: null, // letzte Welle, in der ein Koloss erschien
  freedSeeds: null,
  decor: null,
};
