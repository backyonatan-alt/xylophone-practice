/* קסילופון בצבעים — visual practice guide for an 8-note toy xylophone.
   No sound, no backend. Two screens: song library + song view (read / auto modes). */
(function () {
  'use strict';

  // The physical instrument — bar index 1–8, low → high.
  // Colors pass WCAG AA (4.5:1) for the label text — measured, not eyeballed.
  const BARS = [
    { label: 'דו',  full: 'דו נמוך', color: '#C13732', fg: '#fff' },
    { label: 'רה',  full: 'רה',      color: '#EF8A3C', fg: '#4a2500' },
    { label: 'מי',  full: 'מי',      color: '#F3C64B', fg: '#6b4e00' },
    { label: 'פה',  full: 'פה',      color: '#AED262', fg: '#3d5012' },
    { label: 'סול', full: 'סול',     color: '#2E7D3C', fg: '#fff' },
    { label: 'לה',  full: 'לה',      color: '#82CBEC', fg: '#123a52' },
    { label: 'סי',  full: 'סי',      color: '#2C4A8F', fg: '#fff' },
    { label: 'דו׳', full: 'דו גבוה', color: '#8B5FB0', fg: '#fff' } // U+05F3 geresh, not ascii apostrophe
  ];

  const DIFF = {
    easy:   { t: 'קל',     bg: '#e6f0df', fg: '#3E7A48' },
    medium: { t: 'בינוני', bg: '#fbeed8', fg: '#a86a1f' }
  };
  const LANG = { he: 'עברית', en: 'English', both: 'עברית + English' };

  // Configurable options (settable via URL params: ?scale=1.2&colorOnly=1&lyrics=he)
  const params = new URLSearchParams(location.search);
  const CONFIG = {
    blockScale: Math.min(1.5, Math.max(0.75, parseFloat(params.get('scale')) || 1)),
    colorOnly: params.get('colorOnly') === '1' || params.get('colorOnly') === 'true',
    bilingualDisplay: ['both', 'he', 'en'].includes(params.get('lyrics')) ? params.get('lyrics') : 'both'
  };

  const state = { screen: 'list', songId: null, mode: 'read', idx: 0, playing: false, bpm: 60 };
  let timer = null;
  let noteEls = [];
  let scrollEl = null;

  /* ---------- Routing (History API) ---------- */

  const BASE_TITLE = 'קסילופון בצבעים';
  const HOME_TITLE = BASE_TITLE + ' — לנגן שירי ילדים בלי תווים';

  const slugFromPath = path => {
    const m = path.match(/^\/song\/([a-z0-9-]+)\/?$/);
    return m ? m[1] : null;
  };
  const songBySlug = slug => window.SONGS.find(s => s.slug === slug);

  // Carry the display config params (scale/colorOnly/lyrics) across navigations,
  // and expose mode as a shareable query param (?mode=auto; notes is the default).
  function buildQuery(mode) {
    const p = new URLSearchParams();
    ['scale', 'colorOnly', 'lyrics'].forEach(k => {
      const v = params.get(k);
      if (v !== null && v !== '') p.set(k, v);
    });
    if (mode === 'auto') p.set('mode', 'auto');
    const q = p.toString();
    return q ? '?' + q : '';
  }

  function navigate(url) {
    try { history.pushState({ app: true }, '', url); } catch (e) { /* file:// etc. */ }
  }

  function syncModeInUrl() {
    if (state.screen !== 'song') return;
    const song = currentSong();
    if (!song) return;
    const mode = state.mode === 'auto' ? 'auto' : 'notes';
    try {
      history.replaceState(history.state, '', '/song/' + song.slug + buildQuery(mode));
    } catch (e) { /* ignore */ }
  }

  window.track = window.track || function () {}; // app must work if analytics.js is blocked

  const app = document.getElementById('app');
  document.documentElement.style.setProperty('--bs', CONFIG.blockScale);

  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const currentSong = () => window.SONGS.find(s => s.id === state.songId);
  const flat = song => song.phrases.flatMap(p => p.notes);

  function syl(note) {
    if (typeof note.syllable === 'string') return { main: note.syllable, sub: null };
    if (CONFIG.bilingualDisplay === 'he') return { main: note.syllable.he, sub: null };
    if (CONFIG.bilingualDisplay === 'en') return { main: note.syllable.en, sub: null };
    return { main: note.syllable.he, sub: note.syllable.en };
  }

  function lyricOf(phrase) {
    const L = phrase.lyricLine;
    if (!L) return null;
    if (typeof L === 'string') return { main: L, sub: null };
    if (CONFIG.bilingualDisplay === 'he') return { main: L.he, sub: null };
    if (CONFIG.bilingualDisplay === 'en') return { main: L.en, sub: null };
    return { main: L.he, sub: L.en };
  }

  /* ---------- Library screen ---------- */

  function renderLibrary() {
    const miniBars = BARS.map((b, i) =>
      `<div class="mini-bar" style="height:${30 + (7 - i) * 5}px;background:${b.color};color:${b.fg}">${b.label}</div>`
    ).join('');

    const cards = window.SONGS.map(s => {
      const f = flat(s);
      const d = DIFF[s.difficulty];
      const preview = f.slice(0, 8).map(n => `<div style="background:${BARS[n.bar - 1].color}"></div>`).join('');
      return `<div class="card" role="button" tabindex="0" data-id="${s.id}">
        <div class="card-row">
          <div class="card-title">${esc(s.title)}</div>
          <div class="chip" style="background:${d.bg};color:${d.fg}">${d.t}</div>
        </div>
        <div class="card-row">
          <div class="preview" dir="ltr">${preview}</div>
          <div class="card-meta">${f.length} צלילים · ${LANG[s.lyricsLang]}</div>
        </div>
      </div>`;
    }).join('');

    app.innerHTML = `
      <div class="lib-header">
        <div class="mini-xylo" dir="ltr">${miniBars}</div>
        <h1 class="lib-title">קסילופון בצבעים</h1>
        <p class="lib-sub">מדריך נגינה חזותי לקסילופון אמיתי · בלי תווים, רק צבעים</p>
      </div>
      <div class="lib-list">
        ${cards}
      </div>`;

    document.title = HOME_TITLE;

    app.querySelectorAll('.card').forEach(card => {
      const open = () => openSong(card.dataset.id);
      card.addEventListener('click', open);
      card.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); }
      });
    });
  }

  // User tapped a card — push a history entry so Back returns to the list.
  function openSong(id) {
    const song = window.SONGS.find(s => s.id === id);
    if (!song) return;
    navigate('/song/' + song.slug + buildQuery('notes'));
    showSong(id, 'read', 'list');
  }

  function showSong(id, mode, source) {
    clearTimeout(timer);
    state.screen = 'song';
    state.songId = id;
    state.idx = 0;
    state.mode = mode === 'auto' ? 'auto' : 'read';
    state.playing = false;
    const song = currentSong();
    if (song) window.track('song_opened', { song: song.slug, source: source });
    renderSong();
  }

  /* ---------- Song screen ---------- */

  function renderSong() {
    const song = currentSong();
    if (!song) { renderLibrary(); return; }
    document.title = song.title + ' — ' + BASE_TITLE;
    const f = flat(song);
    const d = DIFF[song.difficulty];
    const songDir = song.lyricsLang === 'en' ? 'ltr' : 'rtl';

    // The legend: tapping a bar previews its note once so a parent can match
    // colors/sounds to the real toy. It is not an instrument.
    const refBars = BARS.map((b, i) =>
      `<div class="ref-bar" role="button" tabindex="0" aria-label="${b.full}" data-bar="${i + 1}" style="height:${26 + (7 - i) * 2.5}px;background:${b.color};color:${b.fg}">${b.label}</div>`
    ).join('');

    let fi = 0;
    const phrases = song.phrases.map(ph => {
      const notes = ph.notes.map(n => {
        const i = fi++;
        const b = BARS[n.bar - 1];
        const s = syl(n);
        return `<div class="note${n.duration > 1 ? ' long' : ''}" data-i="${i}">
          <div class="block" style="background:${b.color};color:${b.fg}">${CONFIG.colorOnly ? '' : b.label}</div>
          <div class="syl" dir="rtl">${esc(s.main)}</div>
          ${s.sub ? `<div class="syl2" dir="ltr">${esc(s.sub)}</div>` : ''}
        </div>`;
      }).join('');
      const lyr = lyricOf(ph);
      const heading = lyr
        ? `<div class="phrase-lyric" dir="${songDir}">${esc(lyr.main)}${lyr.sub ? `<span class="phrase-lyric-sub" dir="ltr">${esc(lyr.sub)}</span>` : ''}</div>`
        : '';
      return `<div class="phrase-block">${heading}<div class="phrase" dir="${songDir}">${notes}</div></div>`;
    }).join('');

    app.innerHTML = `
      <div class="topbar noprint">
        <button class="btn-back" id="btnBack" aria-label="חזרה לרשימת השירים">→</button>
        <div class="topbar-info" id="topbarInfo" role="button" tabindex="0" aria-label="חזרה לרשימת השירים">
          <div class="song-title">${esc(song.title)}</div>
          <div class="song-meta">${d.t} · ${f.length} צלילים</div>
        </div>
        <button class="btn-restart" id="btnRestart">מהתחלה</button>
        <button class="btn-full" id="btnFull" aria-label="מסך מלא">⛶</button>
      </div>
      <div class="toggle noprint">
        <button id="tabRead">תווים</button>
        <button id="tabAuto">ניגון אוטומטי</button>
      </div>
      <div class="guide-note noprint">הנגינה על הקסילופון האמיתי — המסך רק מראה מה לנגן</div>
      <div class="refstrip" dir="ltr">${refBars}</div>
      <div class="notation" id="notation">${phrases}</div>
      <div class="bottombar noprint hidden" id="bottombar">
        <div class="bb-row" id="bbPlay">
          <button class="btn-play" id="btnPlay">נגן</button>
          <div class="bb-mid">
            <div class="cur-chip" id="curChip"></div>
            <div class="cur-info">
              <div class="cur-syl" id="curSyl"></div>
              <div class="progress" id="progress"></div>
            </div>
          </div>
          <div class="tempo">
            <input type="range" dir="ltr" min="30" max="120" step="5" value="${state.bpm}" id="bpmSlider" aria-label="קצב הניגון">
            <div class="tempo-caption" id="bpmCaption"></div>
          </div>
        </div>
        <div class="bb-row hidden" id="bbFinished">
          <div class="fin-text">סוף השיר — כל הכבוד!</div>
          <button class="btn-again" id="btnAgain">עוד פעם</button>
        </div>
      </div>`;

    scrollEl = document.getElementById('notation');
    noteEls = Array.from(app.querySelectorAll('.note'));

    document.getElementById('btnBack').addEventListener('click', goHome);
    const info = document.getElementById('topbarInfo');
    info.addEventListener('click', goHome);
    info.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); goHome(); }
    });
    document.getElementById('btnRestart').addEventListener('click', restart);
    document.getElementById('tabRead').addEventListener('click', setRead);
    document.getElementById('tabAuto').addEventListener('click', setAuto);
    document.getElementById('btnPlay').addEventListener('click', togglePlay);
    document.getElementById('btnAgain').addEventListener('click', togglePlay);
    document.getElementById('bpmSlider').addEventListener('input', onBpm);
    document.getElementById('bpmSlider').addEventListener('change', () => {
      window.track('tempo_changed', { song: song.slug, tempo: state.bpm });
    });
    noteEls.forEach(el => el.addEventListener('click', () => jumpTo(+el.dataset.i)));

    app.querySelectorAll('.ref-bar').forEach(el => {
      const preview = () => window.XyloAudio && window.XyloAudio.preview(+el.dataset.bar - 1);
      el.addEventListener('click', preview);
      el.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); preview(); }
      });
    });

    const btnFull = document.getElementById('btnFull');
    if (!document.documentElement.requestFullscreen) {
      btnFull.classList.add('hidden'); // iPhone Safari has no Fullscreen API
    } else {
      btnFull.addEventListener('click', () => {
        if (document.fullscreenElement) {
          document.exitFullscreen();
        } else {
          document.documentElement.requestFullscreen().then(() => {
            window.track('fullscreen_entered', { song: song.slug });
          }).catch(() => { /* denied — ignore */ });
        }
      });
    }

    update();
  }

  function update() {
    if (state.screen !== 'song') return;
    const song = currentSong();
    const f = flat(song);
    const total = f.length;
    const idx = Math.min(state.idx, total);
    const finished = idx >= total;
    const auto = state.mode === 'auto';
    const cur = f[Math.min(idx, total - 1)];
    const curBar = BARS[cur.bar - 1];

    document.getElementById('tabRead').classList.toggle('active', !auto);
    document.getElementById('tabAuto').classList.toggle('active', auto);
    document.getElementById('tabRead').setAttribute('aria-pressed', String(!auto));
    document.getElementById('tabAuto').setAttribute('aria-pressed', String(auto));
    document.getElementById('btnRestart').classList.toggle('hidden', !auto);

    noteEls.forEach((el, i) => {
      el.classList.toggle('current', auto && !finished && i === idx);
      el.classList.toggle('done', auto && i < idx);
    });

    app.querySelectorAll('.ref-bar').forEach(el => {
      el.classList.toggle('ring', auto && !finished && +el.dataset.bar === cur.bar);
    });

    document.getElementById('bottombar').classList.toggle('hidden', !auto);
    document.getElementById('bbPlay').classList.toggle('hidden', finished);
    document.getElementById('bbFinished').classList.toggle('hidden', !finished);

    const btnPlay = document.getElementById('btnPlay');
    btnPlay.textContent = state.playing ? 'השהה' : (idx > 0 && !finished ? 'המשך' : 'נגן');
    btnPlay.classList.toggle('playing', state.playing);

    const chip = document.getElementById('curChip');
    chip.style.background = curBar.color;
    chip.style.color = curBar.fg;
    chip.textContent = curBar.label;

    const s = syl(cur);
    document.getElementById('curSyl').textContent = s.main + (s.sub ? ' · ' + s.sub : '');
    document.getElementById('progress').textContent = (Math.min(idx, total - 1) + 1) + ' מתוך ' + total;
    document.getElementById('bpmCaption').textContent = 'קצב: ' + state.bpm + ' לדקה';
    document.getElementById('bpmSlider').setAttribute('aria-valuetext', state.bpm + ' לדקה');
  }

  /* ---------- Playback ---------- */

  // Auto-play is audible so a parent can hear the melody before guiding the child.
  function soundCurrent(song) {
    const cur = flat(song)[state.idx];
    if (cur && window.XyloAudio) window.XyloAudio.note(cur.bar - 1);
  }

  function schedule() {
    clearTimeout(timer);
    const song = currentSong();
    if (!song || !state.playing) return;
    const f = flat(song);
    const cur = f[state.idx];
    if (!cur) { state.playing = false; update(); return; }
    const ms = (60000 / state.bpm) * (cur.duration || 1);
    timer = setTimeout(() => {
      const ni = state.idx + 1;
      if (ni >= f.length) {
        state.idx = f.length;
        state.playing = false;
        window.track('song_completed', { song: song.slug, mode: state.mode === 'auto' ? 'auto' : 'notes' });
        update();
      } else {
        state.idx = ni;
        soundCurrent(song);
        update();
        autoScroll();
        schedule();
      }
    }, ms);
  }

  function togglePlay() {
    const song = currentSong();
    if (!song) return;
    const total = flat(song).length;
    if (state.playing) {
      clearTimeout(timer);
      state.playing = false;
      update();
    } else {
      state.playing = true;
      if (state.idx >= total) state.idx = 0;
      if (state.mode === 'auto') window.track('play_pressed', { song: song.slug, tempo: state.bpm });
      soundCurrent(song);
      update();
      autoScroll();
      schedule();
    }
  }

  function jumpTo(i) {
    state.idx = i;
    if (state.playing) { soundCurrent(currentSong()); schedule(); }
    update();
    autoScroll();
  }

  function restart() {
    const song = currentSong();
    if (song) window.track('restart_pressed', { song: song.slug });
    state.idx = 0;
    update();
    autoScroll();
    if (state.playing) schedule();
  }

  function setRead() {
    clearTimeout(timer);
    state.playing = false;
    state.mode = 'read';
    const song = currentSong();
    if (song) window.track('mode_selected', { song: song.slug, mode: 'notes' });
    syncModeInUrl();
    update();
  }

  function setAuto() {
    state.mode = 'auto';
    state.idx = 0;
    const song = currentSong();
    if (song) window.track('mode_selected', { song: song.slug, mode: 'auto' });
    syncModeInUrl();
    update();
  }

  function goHome() {
    navigate('/' + buildQuery('notes'));
    showList();
  }

  function showList() {
    clearTimeout(timer);
    state.playing = false;
    state.screen = 'list';
    state.songId = null;
    noteEls = [];
    scrollEl = null;
    renderLibrary();
  }

  // Keep the current note ~35% from the top of the scroll area.
  // rAF-based scroll — native smooth scrollTo is unreliable in some embedded hosts.
  let scrollAnim = null;
  function smoothScrollTo(el, target) {
    cancelAnimationFrame(scrollAnim);
    const from = el.scrollTop;
    const dist = target - from;
    if (Math.abs(dist) < 1) return;
    const dur = 280;
    const t0 = performance.now();
    const ease = t => 1 - Math.pow(1 - t, 3);
    const step = now => {
      const p = Math.min(1, (now - t0) / dur);
      el.scrollTop = from + dist * ease(p);
      if (p < 1) scrollAnim = requestAnimationFrame(step);
    };
    scrollAnim = requestAnimationFrame(step);
  }

  function autoScroll() {
    if (state.mode !== 'auto') return;
    const el = noteEls[state.idx];
    if (!el || !scrollEl) return;
    const t = el.offsetTop - scrollEl.clientHeight * 0.35;
    smoothScrollTo(scrollEl, Math.max(0, t));
  }

  window.addEventListener('keydown', e => {
    if (state.screen !== 'song' || state.mode !== 'auto') return;
    if (e.key === ' ' || e.key === 'Enter') {
      if (e.target && (e.target.tagName === 'BUTTON' || e.target.tagName === 'INPUT')) return;
      e.preventDefault();
      togglePlay();
    }
  });

  function onBpm(e) {
    state.bpm = +e.target.value;
    update();
    if (state.playing) schedule(); // reschedule current timer at new tempo
  }

  /* ---------- Not found (client-side fallback; the server serves 404.html) ---------- */

  function renderNotFound() {
    state.screen = 'list';
    document.title = 'השיר לא נמצא — ' + BASE_TITLE;
    app.innerHTML = `
      <div class="lib-header">
        <h1 class="lib-title">אופס, השיר לא נמצא</h1>
        <p class="lib-sub">אולי הקישור השתנה — אבל כל השירים מחכים כאן:</p>
        <p><a href="/" id="nfHome">לרשימת השירים המלאה ←</a></p>
      </div>`;
    document.getElementById('nfHome').addEventListener('click', e => {
      e.preventDefault();
      goHome();
    });
  }

  /* ---------- Boot: derive screen from the URL ---------- */

  function route(isColdLoad) {
    const slug = slugFromPath(location.pathname);
    if (!slug) { showList(); return; }
    const song = songBySlug(slug);
    if (!song) { renderNotFound(); return; }
    const mode = new URLSearchParams(location.search).get('mode') === 'auto' ? 'auto' : 'read';
    showSong(song.id, mode, isColdLoad ? 'direct-link' : 'list');
  }

  window.addEventListener('popstate', () => route(false));

  // Kid-proofing: block iOS pinch zoom inside the app (double-tap zoom is
  // handled by touch-action in CSS).
  document.addEventListener('gesturestart', e => e.preventDefault());

  // PWA: offline shell + install tracking.
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').catch(() => { /* e.g. file:// */ });
    });
  }
  window.addEventListener('appinstalled', () => window.track('pwa_installed'));

  route(true);
})();
