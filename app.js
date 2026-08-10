/* קסילופון בצבעים — visual practice guide for an 8-note toy xylophone.
   No sound, no backend. Two screens: song library + song view (read / auto modes). */
(function () {
  'use strict';

  // The physical instrument — bar index 1–8, low → high.
  const BARS = [
    { label: 'דו',  full: 'דו נמוך', color: '#D94A45', fg: '#fff' },
    { label: 'רה',  full: 'רה',      color: '#EF8A3C', fg: '#fff' },
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
        <p class="lib-sub">מדריך נגינה חזותי לשירי ילדים · בלי תווים, רק צבעים</p>
      </div>
      <div class="lib-list">
        ${cards}
      </div>`;

    app.querySelectorAll('.card').forEach(card => {
      const open = () => openSong(card.dataset.id);
      card.addEventListener('click', open);
      card.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); }
      });
    });
  }

  function openSong(id) {
    clearTimeout(timer);
    state.screen = 'song';
    state.songId = id;
    state.idx = 0;
    state.mode = 'read';
    state.playing = false;
    renderSong();
  }

  /* ---------- Song screen ---------- */

  function renderSong() {
    const song = currentSong();
    if (!song) { renderLibrary(); return; }
    const f = flat(song);
    const d = DIFF[song.difficulty];
    const songDir = song.lyricsLang === 'en' ? 'ltr' : 'rtl';

    const refBars = BARS.map((b, i) =>
      `<div class="ref-bar" data-bar="${i + 1}" style="height:${26 + (7 - i) * 2.5}px;background:${b.color};color:${b.fg}">${b.label}</div>`
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
      return `<div class="phrase" dir="${songDir}">${notes}</div>`;
    }).join('');

    app.innerHTML = `
      <div class="topbar noprint">
        <button class="btn-back" id="btnBack" aria-label="חזרה לרשימת השירים">→</button>
        <div class="topbar-info">
          <div class="song-title">${esc(song.title)}</div>
          <div class="song-meta">${d.t} · ${f.length} צלילים</div>
        </div>
        <button class="btn-restart" id="btnRestart">מהתחלה</button>
      </div>
      <div class="toggle noprint">
        <button id="tabRead">תווים</button>
        <button id="tabAuto">ניגון אוטומטי</button>
      </div>
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
            <input type="range" dir="ltr" min="30" max="120" step="5" value="${state.bpm}" id="bpmSlider">
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
    document.getElementById('btnRestart').addEventListener('click', restart);
    document.getElementById('tabRead').addEventListener('click', setRead);
    document.getElementById('tabAuto').addEventListener('click', setAuto);
    document.getElementById('btnPlay').addEventListener('click', togglePlay);
    document.getElementById('btnAgain').addEventListener('click', togglePlay);
    document.getElementById('bpmSlider').addEventListener('input', onBpm);
    noteEls.forEach(el => el.addEventListener('click', () => jumpTo(+el.dataset.i)));

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
  }

  /* ---------- Playback ---------- */

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
        update();
      } else {
        state.idx = ni;
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
      update();
      autoScroll();
      schedule();
    }
  }

  function jumpTo(i) {
    state.idx = i;
    update();
    autoScroll();
    if (state.playing) schedule();
  }

  function restart() {
    state.idx = 0;
    update();
    autoScroll();
    if (state.playing) schedule();
  }

  function setRead() {
    clearTimeout(timer);
    state.playing = false;
    state.mode = 'read';
    update();
  }

  function setAuto() {
    state.mode = 'auto';
    state.idx = 0;
    update();
  }

  function goHome() {
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

  renderLibrary();
})();
