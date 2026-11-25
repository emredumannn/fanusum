/* Fanusum — yumuşak ses efektleri (dosya yok, Web Audio ile üretilir) */
'use strict';
const Sfx = (() => {
  let ac = null, enabled = true;
  const ctx = () => {
    if (!enabled) return null;
    try {
      if (!ac) { const A = window.AudioContext || window.webkitAudioContext; if (!A) return null; ac = new A(); }
      if (ac.state === 'suspended') ac.resume();
      return ac;
    } catch (e) { return null; }
  };
  // tek bir yumuşak ton
  function tone(f0, f1, dur, type = 'sine', vol = 0.18, delay = 0) {
    const a = ctx(); if (!a) return;
    const t = a.currentTime + delay, o = a.createOscillator(), g = a.createGain();
    o.type = type; o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(Math.max(30, f1), t + dur);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.012); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(a.destination); o.start(t); o.stop(t + dur + 0.05);
  }
  // filtrelenmiş hışırtı (su sesi)
  function noise(dur, freq, vol = 0.12, delay = 0) {
    const a = ctx(); if (!a) return;
    const t = a.currentTime + delay, len = Math.floor(a.sampleRate * dur), buf = a.createBuffer(1, len, a.sampleRate), d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2);
    const src = a.createBufferSource(), f = a.createBiquadFilter(), g = a.createGain();
    src.buffer = buf; f.type = 'bandpass'; f.frequency.value = freq; f.Q.value = 0.8; g.gain.value = vol;
    src.connect(f).connect(g).connect(a.destination); src.start(t);
  }
  return {
    set on(v) { enabled = !!v; }, get on() { return enabled; },
    unlock() { ctx(); },
    plop() { [0, 0.09, 0.2, 0.28].forEach(d => tone(900 + Math.random() * 300, 260, 0.12, 'sine', 0.12, d)); },
    gulp() { tone(320, 140, 0.09, 'sine', 0.14); },
    bloop(p = 1) { tone(420 * p, 820 * p, 0.14, 'sine', 0.16); },
    tap() { tone(700, 500, 0.08, 'sine', 0.07); },
    pop() { tone(1400, 2600, 0.06, 'triangle', 0.14); noise(0.06, 3000, 0.08); },
    nope() { tone(330, 250, 0.12, 'triangle', 0.12); tone(250, 190, 0.16, 'triangle', 0.12, 0.13); },
    splash() { noise(0.6, 900, 0.16); noise(0.4, 2200, 0.06, 0.1); },
    chime() { [784, 988, 1175, 1568].forEach((f, i) => tone(f, f, 0.5, 'sine', 0.09, i * 0.09)); }
  };
})();
