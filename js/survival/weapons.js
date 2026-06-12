"use strict";

/* Waffen-Konfiguration für die Survival-Phase. */

const SURVIVAL_WEAPONS = {
  pistol:  { name: "Pistole",      cd: 0.16, spread: 0.05, pellets: 1, speed: 720, ammo: Infinity, sound: "shot" },
  mg:      { name: "MG",           cd: 0.07, spread: 0.10, pellets: 1, speed: 800, ammo: 90,       sound: "shot" },
  shotgun: { name: "Schrotflinte", cd: 0.55, spread: 0.26, pellets: 6, speed: 620, ammo: 16,       sound: "shotgun" },
};
