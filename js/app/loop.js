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
    AfterlifeIntimate.ambient(dt);

    // Sanfter Kino-Zoom während des Herzgesprächs
    const z = AfterlifeIntimate.zoom();
    const zoomed = z > 1.001;
    if (zoomed) {
      ctx.save();
      ctx.translate(W / 2, H / 2);
      ctx.scale(z, z);
      ctx.translate(-W / 2, -H / 2);
    }
    Afterlife.draw();
    if (zoomed) ctx.restore();

    if (AfterlifeIntimate.active()) AfterlifeIntimate.update(dt);
    AfterlifeIntimate.drawCinematics();
  } else if (state === STATE.HOUSE) {
    AfterlifeIntimate.update(dt);
    AfterlifeIntimate.drawStageScene();
  } else if (state === STATE.TRANSITION) {
    Survival.draw();
  } else {
    drawMenuBackdrop(dt);
  }

  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
