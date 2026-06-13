"use strict";

/* =====================================================================
   Kleine WebAudio-Engine — alle Sounds werden synthetisiert,
   es werden keine Audiodateien benötigt.
   ===================================================================== */

const AudioFX = (() => {
  let ac = null;
  let master = null;
  let enabled = true;

  function ensure() {
    if (!ac) {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return false;
      ac = new Ctx();
      master = ac.createGain();
      master.gain.value = 0.35;
      master.connect(ac.destination);
    }
    if (ac.state === "suspended") ac.resume();
    return true;
  }

  function tone(freq, dur, type = "sine", vol = 1, slideTo = null, delay = 0) {
    const t0 = ac.currentTime + delay;
    const osc = ac.createOscillator();
    const g = ac.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t0 + dur);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(vol, t0 + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(g).connect(master);
    osc.start(t0);
    osc.stop(t0 + dur + 0.05);
  }

  function noise(dur, vol = 1, freq = 800) {
    const t0 = ac.currentTime;
    const len = Math.max(1, Math.floor(ac.sampleRate * dur));
    const buf = ac.createBuffer(1, len, ac.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
    const src = ac.createBufferSource();
    src.buffer = buf;
    const filter = ac.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = freq;
    const g = ac.createGain();
    g.gain.setValueAtTime(vol, t0);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    src.connect(filter).connect(g).connect(master);
    src.start(t0);
  }

  const SOUNDS = {
    shot()    { noise(0.09, 0.5, 2400); tone(220, 0.07, "square", 0.18, 90); },
    shotgun() { noise(0.18, 0.8, 1600); tone(140, 0.14, "square", 0.25, 60); },
    hit()     { noise(0.06, 0.3, 900); },
    hurt()    { tone(180, 0.18, "sawtooth", 0.3, 90); },
    soul()    { tone(660, 0.25, "sine", 0.25); tone(880, 0.3, "sine", 0.22, null, 0.09); tone(1320, 0.4, "sine", 0.16, null, 0.18); },
    pickup()  { tone(520, 0.08, "triangle", 0.3); tone(780, 0.12, "triangle", 0.3, null, 0.07); },
    blip()    { tone(440, 0.05, "triangle", 0.2); },
    talk()    { tone(330 + Math.random() * 120, 0.06, "triangle", 0.18); },
    heart()   { tone(587, 0.12, "sine", 0.25); tone(880, 0.2, "sine", 0.22, null, 0.1); },
    laugh()   { tone(523, 0.07, "triangle", 0.22); tone(659, 0.07, "triangle", 0.22, null, 0.08); tone(784, 0.1, "triangle", 0.22, null, 0.16); },
    dance()   { [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.12, "triangle", 0.2, null, i * 0.12)); },
    flower()  { tone(740, 0.09, "sine", 0.22); tone(988, 0.14, "sine", 0.2, null, 0.08); },
    portal()  { tone(220, 0.5, "sine", 0.25, 440); tone(330, 0.5, "sine", 0.2, 660, 0.1); },
    wave()    { tone(392, 0.3, "triangle", 0.22, 523); },
    // Herzgespräch-Atmosphäre
    heartbeat() { tone(58, 0.1, "sine", 0.4, 42); tone(52, 0.14, "sine", 0.34, 38, 0.17); },
    crackle()  { noise(0.05, 0.045, 420 + Math.random() * 500); },
    swell()    { tone(262, 0.7, "sine", 0.16, 330); tone(330, 0.8, "sine", 0.14, 415, 0.08); tone(523, 0.9, "sine", 0.1, 659, 0.16); },
    // Erweiterter Kampfmodus
    flame()   { noise(0.07, 0.1, 520 + Math.random() * 300); },
    rail()    { tone(1400, 0.16, "sawtooth", 0.22, 180); noise(0.1, 0.3, 3200); },
    boom()    { noise(0.4, 0.9, 700); tone(70, 0.35, "square", 0.3, 36); },
    stomp()   { noise(0.22, 0.6, 280); tone(48, 0.3, "sine", 0.45, 30); },
    roar()    { tone(110, 0.5, "sawtooth", 0.3, 60); noise(0.4, 0.35, 500); },
    spit()    { tone(300, 0.1, "triangle", 0.2, 140); noise(0.08, 0.12, 1200); },
    bolt()    { tone(880, 0.09, "sine", 0.18, 1320); tone(1100, 0.12, "sine", 0.12, 1760, 0.05); },
    bloodmoon() { tone(98, 0.8, "sawtooth", 0.18, 65); tone(147, 0.9, "sine", 0.14, 98, 0.15); },
  };

  return {
    play(name) {
      if (!enabled) return;
      if (!ensure()) return;
      const fn = SOUNDS[name];
      if (fn) fn();
    },
    toggle() {
      enabled = !enabled;
      if (enabled) ensure();
      return enabled;
    },
    get enabled() { return enabled; },
    unlock() { ensure(); },
  };
})();
