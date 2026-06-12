"use strict";

/* Szenenwechsel, Input-Handler und UI-Events. */

let lastRunKills = 0;

function startSurvival() {
  AudioFX.unlock();
  Survival.reset();
  state = STATE.SURVIVAL;
  startScreen.classList.add("hidden");
  transitionScreen.classList.add("hidden");
  portalScreen.classList.add("hidden");
  setHudVisibility();
}

function goAfterlife(newSoulCount) {
  AudioFX.unlock();
  state = STATE.AFTERLIFE;
  startScreen.classList.add("hidden");
  transitionScreen.classList.add("hidden");
  portalScreen.classList.add("hidden");
  Afterlife.enter(newSoulCount);
  setHudVisibility();
}

Survival.onDeath = (kills, seeds, wave) => {
  lastRunKills = kills;
  Save.data.souls.push(...seeds);
  Save.data.totalFreed += kills;
  Save.data.bestWave = Math.max(Save.data.bestWave, wave);
  Save.write();

  state = STATE.TRANSITION;
  setHudVisibility();

  let msg;
  if (kills === 0) {
    msg = `Keine Seele konnte diesmal befreit werden.<br/>` +
      `Doch das Jenseits wartet — und das Portal führt zurück.`;
  } else {
    const w = kills === 1 ? "Seele wurde" : "Seelen wurden";
    msg = `<span class="count">${kills}</span> ${w} aus untoten Hüllen erlöst.<br/>` +
      `Sie erwachen jetzt im Jenseits — als die Menschen, die sie einmal waren. ` +
      `Geh zu ihnen.`;
  }
  if (Save.data.souls.length > kills) {
    msg += `<br/><small>Insgesamt leben dort nun ${Save.data.souls.length} Gerettete.</small>`;
  }
  transitionMessage.innerHTML = msg;
  transitionScreen.classList.remove("hidden");
};

Afterlife.onPortal = () => {
  portalScreen.classList.remove("hidden");
};

window.addEventListener("keydown", (e) => {
  const k = e.key.toLowerCase();
  keys[k] = true;
  if (state === STATE.AFTERLIFE && portalScreen.classList.contains("hidden")) {
    if (k === "e") Afterlife.interact();
    if (k === "escape") Afterlife.closeDialog();
  } else if (k === "escape" && !portalScreen.classList.contains("hidden")) {
    portalScreen.classList.add("hidden");
  }
});

startBtn.addEventListener("click", startSurvival);
enterAfterlifeBtn.addEventListener("click", () => goAfterlife(0));
toAfterlifeBtn.addEventListener("click", () => goAfterlife(lastRunKills));
portalYesBtn.addEventListener("click", startSurvival);
portalNoBtn.addEventListener("click", () => portalScreen.classList.add("hidden"));

resetSaveBtn.addEventListener("click", () => {
  if (confirm("Wirklich den gesamten Spielstand löschen? Alle geretteten Seelen und Freundschaften gehen verloren.")) {
    Save.reset();
    refreshMenu();
  }
});

muteBtn.addEventListener("click", () => {
  const on = AudioFX.toggle();
  muteBtn.textContent = on ? "🔊" : "🔇";
});
