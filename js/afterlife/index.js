"use strict";

/* Öffentliche API — fasst alle Jenseits-Untermodule zusammen. */

const Afterlife = {
  enter: (...a) => AfterlifeEnter.enter(...a),
  update: (...a) => AfterlifeUpdate.update(...a),
  draw: (...a) => AfterlifeRenderScene.draw(...a),
  interact: (...a) => AfterlifeDialog.interact(...a),
  closeDialog: (...a) => AfterlifeDialog.closeDialog(...a),
  get dialogOpen() { return AfterlifeState.dialogOpen; },
  onPortal: null,
};
