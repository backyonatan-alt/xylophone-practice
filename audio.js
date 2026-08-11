/* Note preview audio — the app is a GUIDE for a real xylophone, not an instrument.
   Sound exists for two things only: single-note preview when a legend bar is tapped
   (mono — a new tap fades the previous note), and auto-play so a parent can hear
   the melody. Tones are synthesized (no sample files → instant, offline-safe).
   iOS Safari: the AudioContext is created/resumed on the first user gesture. */
(function () {
  'use strict';

  // C5..C6 major scale, matching bars 1-8 of the physical toy.
  var FREQ = [523.25, 587.33, 659.25, 698.46, 783.99, 880.0, 987.77, 1046.5];

  var ctx = null;
  var buffers = null;
  var previewGain = null; // gain of the last preview note, faded on retrigger

  function ensureCtx() {
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    if (!ctx) {
      ctx = new AC();
      buffers = FREQ.map(renderTone);
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  // Bright mallet-ish tone: fundamental + inharmonic strike partials, fast decay.
  function renderTone(f) {
    var sr = ctx.sampleRate;
    var dur = 0.9;
    var n = Math.ceil(sr * dur);
    var buf = ctx.createBuffer(1, n, sr);
    var d = buf.getChannelData(0);
    for (var i = 0; i < n; i++) {
      var t = i / sr;
      d[i] = Math.sin(2 * Math.PI * f * t) * Math.exp(-t * 5) * 0.55 +
             Math.sin(2 * Math.PI * f * 3.03 * t) * Math.exp(-t * 22) * 0.22 +
             Math.sin(2 * Math.PI * f * 6.17 * t) * Math.exp(-t * 40) * 0.08;
    }
    return buf;
  }

  function playBuffer(i) {
    if (!ensureCtx() || !buffers[i]) return null;
    var src = ctx.createBufferSource();
    var g = ctx.createGain();
    src.buffer = buffers[i];
    src.connect(g);
    g.connect(ctx.destination);
    src.start();
    return g;
  }

  window.XyloAudio = {
    // Call on any early gesture so the context is unlocked before it's needed.
    prime: function () { try { ensureCtx(); } catch (e) { /* no audio — app still works */ } },

    // Legend bar tap: one note at a time; retrigger fades the previous note out.
    preview: function (i) {
      try {
        if (previewGain && ctx) {
          previewGain.gain.setTargetAtTime(0, ctx.currentTime, 0.02);
        }
        previewGain = playBuffer(i);
      } catch (e) { /* ignore */ }
    },

    // Auto-play melody note: decay tails may overlap naturally.
    note: function (i) {
      try { playBuffer(i); } catch (e) { /* ignore */ }
    }
  };

  // Unlock ASAP on the first real gesture (iOS requires this to happen in-gesture).
  var unlock = function () {
    window.XyloAudio.prime();
    document.removeEventListener('pointerdown', unlock, true);
    document.removeEventListener('touchstart', unlock, true);
  };
  document.addEventListener('pointerdown', unlock, true);
  document.addEventListener('touchstart', unlock, true);
})();
