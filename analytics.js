/* Cookieless analytics wrapper (Umami Cloud). The app must work fully when the
   script is blocked — every call is a guarded no-op if window.umami is absent.
   Events fired before the deferred script loads are queued briefly, then dropped.
   Privacy rule (child-directed site): events carry ONLY song slug, mode, tempo.
   Never add identifiers, free text, or any user data to props. */
(function () {
  'use strict';
  var queue = [];
  var tries = 0;
  var timer = null;

  function ready() { return window.umami && typeof window.umami.track === 'function'; }

  function flush() {
    var q = queue;
    queue = [];
    q.forEach(function (e) {
      try { window.umami.track(e.name, e.props); } catch (err) { /* ignore */ }
    });
  }

  window.track = function (name, props) {
    try {
      if (ready()) { window.umami.track(name, props); return; }
      queue.push({ name: name, props: props });
      if (!timer) {
        timer = setInterval(function () {
          if (ready()) { flush(); clearInterval(timer); timer = null; }
          else if (++tries > 20) { queue = []; clearInterval(timer); timer = null; } // give up after ~10s
        }, 500);
      }
    } catch (e) { /* analytics must never break the app */ }
  };
})();
