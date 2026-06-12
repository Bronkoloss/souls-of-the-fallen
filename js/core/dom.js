"use strict";

/* DOM-Referenzen — zentral gesammelt, damit Module keine IDs duplizieren. */

const hud = document.getElementById("hud");
const hudKills = document.getElementById("hud-kills");
const hudWave = document.getElementById("hud-wave");
const hudWeapon = document.getElementById("hud-weapon");
const healthFill = document.getElementById("health-fill");
const hudAfterlife = document.getElementById("hud-afterlife");
const hudSouls = document.getElementById("hud-souls");
const hudFlowers = document.getElementById("hud-flowers");
const hudFriends = document.getElementById("hud-friends");
const controlsHint = document.getElementById("controls-hint");
const muteBtn = document.getElementById("mute-btn");

const startScreen = document.getElementById("start-screen");
const startBtn = document.getElementById("start-btn");
const enterAfterlifeBtn = document.getElementById("enter-afterlife-btn");
const saveInfo = document.getElementById("save-info");
const resetSaveBtn = document.getElementById("reset-save-btn");

const transitionScreen = document.getElementById("transition-screen");
const transitionMessage = document.getElementById("transition-message");
const toAfterlifeBtn = document.getElementById("to-afterlife-btn");

const portalScreen = document.getElementById("portal-screen");
const portalYesBtn = document.getElementById("portal-yes-btn");
const portalNoBtn = document.getElementById("portal-no-btn");

const dialogPanel = document.getElementById("dialog-panel");
const dialogPortrait = document.getElementById("dialog-portrait");
const dialogName = document.getElementById("dialog-name");
const dialogPersonality = document.getElementById("dialog-personality");
const dialogHearts = document.getElementById("dialog-hearts");
const dialogText = document.getElementById("dialog-text");
const dialogActions = document.getElementById("dialog-actions");
