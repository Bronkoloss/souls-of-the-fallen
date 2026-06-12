"use strict";

const CharacterDraw = (() => {

  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function shade(hex, f) {
    const n = parseInt(hex.slice(1), 16);
    const r = Math.max(0, Math.min(255, ((n >> 16) & 255) * f)) | 0;
    const g = Math.max(0, Math.min(255, ((n >> 8) & 255) * f)) | 0;
    const b = Math.max(0, Math.min(255, (n & 255) * f)) | 0;
    return `rgb(${r},${g},${b})`;
  }

  function capsule(c, x1, y1, x2, y2, w, color) {
    c.strokeStyle = color;
    c.lineWidth = w;
    c.lineCap = "round";
    c.beginPath();
    c.moveTo(x1, y1);
    c.lineTo(x2, y2);
    c.stroke();
  }

  function rrect(c, x, y, w, h, r) {
    c.beginPath();
    c.moveTo(x + r, y);
    c.arcTo(x + w, y, x + w, y + h, r);
    c.arcTo(x + w, y + h, x, y + h, r);
    c.arcTo(x, y + h, x, y, r);
    c.arcTo(x, y, x + w, y, r);
    c.closePath();
  }

  function circle(c, x, y, r, color) {
    c.fillStyle = color;
    c.beginPath();
    c.arc(x, y, r, 0, Math.PI * 2);
    c.fill();
  }

  function shadow(c, rx) {
    c.fillStyle = "rgba(30,40,25,0.22)";
    c.beginPath();
    c.ellipse(0, 1.5, rx, rx * 0.32, 0, 0, Math.PI * 2);
    c.fill();
  }

  const HIP = -13, SHOULDER = -32, HEAD = -39.5, HEAD_R = 10.5;

  return { mulberry32, shade, capsule, rrect, circle, shadow, HIP, SHOULDER, HEAD, HEAD_R };
})();
