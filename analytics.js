/* Cookieless analytics wrapper (Plausible). The app must work fully when the
   script is blocked — every call is a guarded no-op if window.plausible is absent.
   Privacy rule (child-directed site): events carry ONLY song slug, mode, tempo.
   Never add identifiers, free text, or any user data to props. */
(function () {
  'use strict';
  window.track = function (name, props) {
    try {
      if (typeof window.plausible === 'function') {
        window.plausible(name, props ? { props: props } : undefined);
      }
    } catch (e) { /* analytics must never break the app */ }
  };
})();
