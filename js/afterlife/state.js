"use strict";

/* Laufzeit-Zustand der Jenseits-Welt — wird von allen Afterlife-Modulen geteilt. */

const AfterlifeState = {
  inited: false,
  trees: [],
  stones: [],
  decoGrass: [],
  decoFlowers: [],
  flowers: [],
  butterflies: [],
  emotes: [],
  fireSparks: [],
  npcs: [],
  playerA: null,
  cam: { x: 0, y: 0 },
  time: 0,
  introT: 0,
  introText: "",
  dialogOpen: false,
  activeNpc: null,
  followerSeed: null,
  prompt: null,
};
