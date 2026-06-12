"use strict";

/* Hauptschleife — ruft Update und Draw der aktiven Szene auf. */

let last = performance.now();

function loop(now) {
  let dt = (now - last) / 1000;
  last = now;
  if (dt > 0.05) dt = 0.05;

  if (state === STATE.SURVIVAL) {
    Survival.update(dt);
    if (state === STATE.SURVIVAL || state === STATE.TRANSITION) Survival.draw();
  } else if (state === STATE.AFTERLIFE) {
    Afterlife.update(dt);
    Afterlife.draw();
  } else if (state === STATE.TRANSITION) {
    Survival.draw();
  } else {
    drawMenuBackdrop(dt);
  }

  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
