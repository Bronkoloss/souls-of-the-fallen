"use strict";

/* Waffen-Konfiguration für die Survival-Phase. */

const SURVIVAL_WEAPONS = {
  pistol:  { name: "Pistole",       cd: 0.16,  spread: 0.05, pellets: 1, speed: 720, ammo: Infinity, sound: "shot" },
  mg:      { name: "MG",            cd: 0.07,  spread: 0.10, pellets: 1, speed: 800, ammo: 90,       sound: "shot" },
  shotgun: { name: "Schrotflinte",  cd: 0.55,  spread: 0.26, pellets: 6, speed: 620, ammo: 16,       sound: "shotgun" },
  flamer:  { name: "Flammenwerfer", cd: 0.04,  spread: 0.20, pellets: 1, speed: 340, ammo: 240,      sound: "flame",
             flame: true },   // kurze Reichweite, setzt Untote in Brand (Schaden über Zeit)
  railgun: { name: "Blitzlanze",    cd: 0.85,  spread: 0,    pellets: 1, speed: 0,   ammo: 12,       sound: "rail",
             beam: true, dmg: 8 }, // Hitscan-Strahl, durchschlägt alle Gegner in einer Linie
};
