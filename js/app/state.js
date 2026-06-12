"use strict";

/* Spielzustände und HUD-Sichtbarkeit. */

const STATE = {
  MENU: "menu",
  SURVIVAL: "survival",
  TRANSITION: "transition",
  AFTERLIFE: "afterlife",
};

let state = STATE.MENU;

function setHudVisibility() {
  hud.classList.toggle("hidden", state !== STATE.SURVIVAL);
  hudAfterlife.classList.toggle("hidden", state !== STATE.AFTERLIFE);
  controlsHint.classList.toggle("hidden", state !== STATE.AFTERLIFE);
  muteBtn.classList.toggle("hidden", state === STATE.MENU);
  canvas.style.cursor = state === STATE.SURVIVAL ? "none" : "default";
}
