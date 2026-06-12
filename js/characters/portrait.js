"use strict";

const CharacterPortrait = (() => {
  const { circle, HEAD_R } = CharacterDraw;
  const { drawWomanHead } = CharacterWoman;

  function drawPortrait(canvas, d, time = 0) {
    const c = canvas.getContext("2d");
    c.clearRect(0, 0, canvas.width, canvas.height);
    c.save();
    c.translate(canvas.width / 2, canvas.height / 2 + 8);
    c.scale(3.6, 3.6);
    if (d.hairStyle !== "pixie") {
      c.fillStyle = d.hairColor;
      c.beginPath();
      c.arc(0, 1, HEAD_R * 1.28, 0, Math.PI * 2);
      c.fill();
    }
    drawWomanHead(c, d, { time, lookX: 0 });
    c.restore();
  }

  return { drawPortrait };
})();
