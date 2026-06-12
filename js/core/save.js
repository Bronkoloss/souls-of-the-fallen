"use strict";

/* Persistenz — localStorage-Spielstand. */

const Save = {
  data: { souls: [], friendship: {}, flowers: 0, totalFreed: 0, bestWave: 1 },

  load() {
    try {
      const raw = localStorage.getItem("souls_of_the_fallen");
      if (raw) {
        const parsed = JSON.parse(raw);
        this.data = Object.assign(this.data, parsed);
        if (!this.data.friendship) this.data.friendship = {};
        if (!Array.isArray(this.data.souls)) this.data.souls = [];
      }
    } catch (e) { /* beschädigter Spielstand — Standardwerte verwenden */ }
  },

  write() {
    try {
      localStorage.setItem("souls_of_the_fallen", JSON.stringify(this.data));
    } catch (e) { /* Speicher voll/blockiert — Spiel läuft trotzdem weiter */ }
  },

  reset() {
    this.data = { souls: [], friendship: {}, flowers: 0, totalFreed: 0, bestWave: 1 };
    this.write();
  },
};

Save.load();
