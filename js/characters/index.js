"use strict";

/* Öffentliche API — fasst alle Charakter-Untermodule zusammen. */

const Characters = {
  makeWoman: (...a) => CharacterWoman.makeWoman(...a),
  drawWoman: (...a) => CharacterWoman.drawWoman(...a),
  drawWomanHead: (...a) => CharacterWoman.drawWomanHead(...a),
  drawHero: (...a) => CharacterHero.drawHero(...a),
  drawZombie: (...a) => CharacterZombie.drawZombie(...a),
  drawPortrait: (...a) => CharacterPortrait.drawPortrait(...a),
  heroMuzzle: (...a) => CharacterHero.heroMuzzle(...a),
  mulberry32: (...a) => CharacterDraw.mulberry32(...a),
  shade: (...a) => CharacterDraw.shade(...a),
};
