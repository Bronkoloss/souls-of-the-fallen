"use strict";

/* Tastatur- und Maus-Eingabe. Event-Handler werden in app/handlers.js registriert. */

const keys = {};
const mouse = { x: W / 2, y: H / 2, down: false };

window.addEventListener("keyup", (e) => {
  keys[e.key.toLowerCase()] = false;
});

window.addEventListener("blur", () => {
  for (const k in keys) keys[k] = false;
  mouse.down = false;
});

canvas.addEventListener("mousemove", (e) => {
  const r = canvas.getBoundingClientRect();
  mouse.x = e.clientX - r.left;
  mouse.y = e.clientY - r.top;
});

canvas.addEventListener("mousedown", (e) => {
  if (e.button === 0) mouse.down = true;
});

window.addEventListener("mouseup", (e) => {
  if (e.button === 0) mouse.down = false;
});

window.addEventListener("contextmenu", (e) => e.preventDefault());
