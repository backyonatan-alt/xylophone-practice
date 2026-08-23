/* קסילופון בצבעים — visual practice guide for an 8-note toy xylophone.
   No sound, no backend. Two screens: song library + song view (read / auto modes). */
(function () {
  'use strict';

  // The physical instrument — bar index 1–8, low → high. Labels are fixed;
  // colors are a palette the parent can match to their own toy (see Colors below).
  const BAR_META = [
    { label: 'דו',  full: 'דו נמוך' },
    { label: 'רה',  full: 'רה' },
    { label: 'מי',  full: 'מי' },
    { label: 'פה',  full: 'פה' },
    { label: 'סול', full: 'סול' },
    { label: 'לה',  full: 'לה' },
    { label: 'סי',  full: 'סי' },
    { label: 'דו׳', full: 'דו גבוה' } // U+05F3 geresh, not ascii apostrophe
  ];

  /* ---------- Colors: palettes, presets, swatches ---------- */

  // Every color the UI can assign to a bar has a measured WCAG-AA (4.5:1)
  // label color. If you add a color anywhere here, measure its fg too.
  const COLOR_FG = {
    '#C13732': '#fff',    '#EF8A3C': '#4a2500', '#F3C64B': '#6b4e00', '#AED262': '#3d5012',
    '#2E7D3C': '#fff',    '#82CBEC': '#123a52', '#2C4A8F': '#fff',    '#8B5FB0': '#fff',
    '#F06BA8': '#5c1030', '#F5F2EC': '#2b2620', '#3A342E': '#fff',    '#C89A63': '#40280a',
    '#E58C8A': '#4d1615', '#F2B279': '#4a2500', '#F5D98B': '#5c4a00', '#BFD9A0': '#324618',
    '#8FC9B8': '#123a2e', '#9FC4E8': '#12304f', '#8E9FD4': '#131f45', '#C4A3D4': '#301b40'
  };
  const COLOR_NAME = {
    '#C13732': 'אדום',      '#EF8A3C': 'כתום',       '#F3C64B': 'צהוב',       '#AED262': 'ירוק בהיר',
    '#2E7D3C': 'ירוק כהה',  '#82CBEC': 'תכלת',       '#2C4A8F': 'כחול',       '#8B5FB0': 'סגול',
    '#F06BA8': 'ורוד',      '#F5F2EC': 'לבן',        '#3A342E': 'שחור',       '#C89A63': 'עץ',
    '#E58C8A': 'ורוד פסטל', '#F2B279': 'אפרסק',      '#F5D98B': 'חמאה',       '#BFD9A0': 'ירוק פסטל',
    '#8FC9B8': 'מנטה',      '#9FC4E8': 'תכלת פסטל',  '#8E9FD4': 'כחול פסטל',  '#C4A3D4': 'לילך'
  };
  const DEFAULT_COLORS = ['#C13732', '#EF8A3C', '#F3C64B', '#AED262', '#2E7D3C', '#82CBEC', '#2C4A8F', '#8B5FB0'];
  // The 12 base swatches offered in the manual picker (active-palette colors are appended).
  const SWATCHES = ['#C13732', '#EF8A3C', '#F3C64B', '#AED262', '#2E7D3C', '#82CBEC', '#2C4A8F', '#8B5FB0',
                    '#F06BA8', '#F5F2EC', '#3A342E', '#C89A63'];
  const PRESETS = [
    { id: 'classic',  name: 'קשת — קלאסי', colors: DEFAULT_COLORS },
    { id: 'reversed', name: 'קשת הפוכה',   colors: DEFAULT_COLORS.slice().reverse() },
    { id: 'metal',    name: 'מתכת',        colors: ['#C13732', '#EF8A3C', '#F3C64B', '#2E7D3C', '#82CBEC', '#2C4A8F', '#F06BA8', '#F5F2EC'] },
    { id: 'pastel',   name: 'פסטל מעץ',    colors: ['#E58C8A', '#F2B279', '#F5D98B', '#BFD9A0', '#8FC9B8', '#9FC4E8', '#8E9FD4', '#C4A3D4'] }
  ];

  const luminance = hex => {
    const c = hex.slice(1);
    const [r, g, b] = [0, 2, 4].map(i => parseInt(c.slice(i, i + 2), 16) / 255)
      .map(v => v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4));
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const contrast = (a, b) => {
    const [l1, l2] = [luminance(a), luminance(b)].sort((x, y) => y - x);
    return (l1 + 0.05) / (l2 + 0.05);
  };
  // Unknown hex (legacy stored value): pick whichever of white/ink reads better.
  const fgFor = hex => COLOR_FG[hex] ||
    (contrast(hex, '#ffffff') >= contrast(hex, '#2b2620') ? '#fff' : '#2b2620');
  const isLightColor = hex => luminance(hex) > 0.75; // near-white bars need a border

  // BARS is the single source of truth the whole app renders from.
  const BARS = [];
  function applyPalette(colors) {
    BAR_META.forEach((m, i) => {
      BARS[i] = { label: m.label, full: m.full, color: colors[i], fg: fgFor(colors[i]) };
    });
  }

  const isHex = s => typeof s === 'string' && /^#[0-9a-fA-F]{6}$/.test(s);
  const COLOR_KEY = 'xyloColors';
  function loadStoredColors() {
    try {
      const d = JSON.parse(localStorage.getItem(COLOR_KEY));
      if (d && Array.isArray(d.colors) && d.colors.length === 8 && d.colors.every(isHex)) return d.colors;
    } catch (e) { /* corrupt/blocked storage — fall back to default */ }
    return null;
  }
  function saveStoredColors(colors) {
    try { localStorage.setItem(COLOR_KEY, JSON.stringify({ v: 1, colors: colors })); } catch (e) { /* ignore */ }
  }
  const presetIdFor = colors => {
    const p = PRESETS.find(p => p.colors.every((c, i) => c === colors[i]));
    return p ? p.id : null;
  };
  // ?colors= accepts a preset id, or x-RRGGBB-…-RRGGBB (8 colors). URL wins for
  // the visit but is never persisted — a shared link must not overwrite a setup.
  function colorsFromParam(v) {
    if (!v) return null;
    const p = PRESETS.find(p => p.id === v);
    if (p) return p.colors;
    if (v.slice(0, 2) === 'x-') {
      const cs = v.slice(2).split('-').map(h => '#' + h);
      if (cs.length === 8 && cs.every(isHex)) return cs;
    }
    return null;
  }

  const DIFF = {
    easy:   { t: 'קל',     bg: '#e6f0df', fg: '#3E7A48' },
    medium: { t: 'בינוני', bg: '#fbeed8', fg: '#a86a1f' }
  };
  const LANG = { he: 'עברית', en: 'English', both: 'עברית + English' };

  // Configurable options (settable via URL params: ?scale=1.2&colorOnly=1&lyrics=he&colors=reversed)
  const params = new URLSearchParams(location.search);
  const CONFIG = {
    blockScale: Math.min(1.5, Math.max(0.75, parseFloat(params.get('scale')) || 1)),
    colorOnly: params.get('colorOnly') === '1' || params.get('colorOnly') === 'true',
    bilingualDisplay: ['both', 'he', 'en'].includes(params.get('lyrics')) ? params.get('lyrics') : 'both'
  };

  // Resolve the palette: URL param (for this visit) → saved setup → default.
  const urlColors = colorsFromParam(params.get('colors'));
  applyPalette(urlColors || loadStoredColors() || DEFAULT_COLORS);
  // First-visit setup is done once a palette was saved; a ?colors link also skips it.
  const setupDone = () => !!urlColors || !!loadStoredColors();

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
    ['scale', 'colorOnly', 'lyrics', 'colors'].forEach(k => {
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
        <div class="lib-title-row">
          <h1 class="lib-title">קסילופון בצבעים</h1>
          <button class="btn-icon" id="btnColors" aria-label="התאמת צבעים">${SLIDERS_SVG}</button>
        </div>
        <p class="lib-sub">מדריך נגינה חזותי לקסילופון אמיתי · בלי תווים, רק צבעים</p>
      </div>
      <div class="lib-list">
        ${cards}
      </div>`;

    document.title = HOME_TITLE;

    document.getElementById('btnColors').addEventListener('click', openSettings);

    app.querySelectorAll('.card').forEach(card => {
      const open = () => openSong(card.dataset.id);
      card.addEventListener('click', open);
      card.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); }
      });
    });
  }

  /* ---------- Color setup & settings screens ---------- */

  const SLIDERS_SVG = '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line></svg>';

  // A flexible-width xylophone row: 8 bars, low→high LTR, descending heights.
  function xyloBars(colors, base, step, withLabels, cls) {
    return colors.map((c, i) => {
      const light = isLightColor(c) ? ' light' : '';
      return `<div class="bar${light}${cls ? ' ' + cls : ''}" data-bar="${i + 1}" style="height:${base + (7 - i) * step}px;background:${c};color:${fgFor(c)}">${withLabels ? BAR_META[i].label : ''}</div>`;
    }).join('');
  }

  // First visit: the parent states their instrument once, then it sticks.
  function renderSetup() {
    document.title = HOME_TITLE;
    app.innerHTML = `
      <div class="setup">
        <div class="setup-head">
          <div class="setup-title">רגע לפני שמתחילים</div>
          <div class="setup-sub">האם הקסילופון שלכם נראה כך?</div>
        </div>
        <div class="panel">
          <div class="xylo" dir="ltr">${xyloBars(DEFAULT_COLORS, 66, 6, true)}</div>
        </div>
        <div class="setup-actions">
          <button class="btn-primary" id="setupYes">כן, זה שלנו</button>
          <button class="btn-secondary" id="setupNo">לא — נתאים את הצבעים</button>
          <div class="setup-note">אפשר לשנות בכל רגע מתוך מסך השירים</div>
        </div>
      </div>`;
    document.getElementById('setupYes').addEventListener('click', () => {
      saveStoredColors(DEFAULT_COLORS);
      applyPalette(DEFAULT_COLORS);
      window.track('setup_choice', { choice: 'default' });
      renderLibrary();
    });
    document.getElementById('setupNo').addEventListener('click', () => {
      window.track('setup_choice', { choice: 'customize' });
      openSettings();
    });
  }

  // Settings edit state — local until שמירה; leaving discards.
  let edit = null;

  function openSettings() {
    navigate(location.pathname + location.search); // extra entry so browser-Back leaves settings
    clearTimeout(timer);
    state.playing = false;
    state.screen = 'settings';
    edit = { colors: BARS.map(b => b.color), sheetBar: null, flipped: false };
    window.track('colors_opened');
    renderSettings();
  }

  const dupIndices = colors => colors.map((c, i) => colors.indexOf(c) !== i || colors.lastIndexOf(c) !== i ? i : -1).filter(i => i >= 0);

  function renderSettings() {
    const presetCards = PRESETS.map(p => {
      const active = p.colors.every((c, i) => c === edit.colors[i]);
      const bars = p.colors.map((c, i) =>
        `<div class="pbar${isLightColor(c) ? ' light' : ''}" style="height:${21 + (7 - i) * 3}px;background:${c}"></div>`
      ).join('');
      return `<div class="preset${active ? ' active' : ''}" role="button" tabindex="0" data-preset="${p.id}" aria-pressed="${active}">
        <div class="preset-check" aria-hidden="true"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"></path></svg></div>
        <div class="preset-bars" dir="ltr">${bars}</div>
        <div class="preset-name">${p.name}</div>
      </div>`;
    }).join('');

    // Snippet: opening of יונתן הקטן (bars 5,3,3) in the edited palette.
    const snippet = [[5, 'יוֹ'], [3, 'נָ'], [3, 'תָן']].map(([bar, s]) => {
      const c = edit.colors[bar - 1];
      return `<div class="snip">
        <div class="snip-block${isLightColor(c) ? ' light' : ''}" style="background:${c};color:${fgFor(c)}">${BAR_META[bar - 1].label}</div>
        <div class="snip-syl">${s}</div>
      </div>`;
    }).join('');

    const dups = dupIndices(edit.colors);
    const barCls = i => (dups.includes(i) ? 'dup' : '') + (edit.sheetBar === i ? ' sel' : '');
    const editBars = edit.colors.map((c, i) =>
      `<div class="bar edit ${barCls(i)}${isLightColor(c) ? ' light' : ''}" role="button" tabindex="0" data-bar="${i + 1}" aria-label="צליל ${BAR_META[i].full} — צבע ${COLOR_NAME[c] || c}" style="height:${54 + (7 - i) * 4}px;background:${c};color:${fgFor(c)}">${BAR_META[i].label}</div>`
    ).join('');

    // Sheet: 12 base swatches + any active-palette colors outside them (presets stay reachable).
    const sheetColors = SWATCHES.concat(edit.colors.filter(c => SWATCHES.indexOf(c) < 0)
      .filter((c, i, a) => a.indexOf(c) === i));
    const curColor = edit.sheetBar !== null ? edit.colors[edit.sheetBar] : null;
    const swatches = sheetColors.map(c =>
      `<div class="swatch-wrap"><div class="swatch${c === curColor ? ' on' : ''}${isLightColor(c) ? ' light' : ''}" role="button" tabindex="0" data-color="${c}" aria-label="${COLOR_NAME[c] || c}" style="background:${c}"></div><div class="swatch-name">${COLOR_NAME[c] || ''}</div></div>`
    ).join('');
    const sheetOpen = edit.sheetBar !== null;
    const sheetTitleChip = sheetOpen
      ? `<div class="sheet-chip" style="background:${curColor};color:${fgFor(curColor)}">${BAR_META[edit.sheetBar].label}</div>` : '';
    const ORDINALS = ['הראשון', 'השני', 'השלישי', 'הרביעי', 'החמישי', 'השישי', 'השביעי', 'השמיני'];

    app.innerHTML = `
      <div class="topbar">
        <button class="btn-back" id="btnBack" aria-label="חזרה בלי לשמור">→</button>
        <div class="topbar-info">
          <div class="song-title">התאמת צבעים</div>
          <div class="song-meta">מתאים לקסילופון עם 8 צלילים</div>
        </div>
      </div>
      <div class="settings" id="settingsScroll">
        <div class="panel preview-panel">
          <div class="panel-label">כך ייראה הקסילופון באפליקציה</div>
          <div class="xylo" dir="ltr">${xyloBars(edit.colors, 61, 5, true)}</div>
          <div class="snip-row"><div class="snip-caption">וכך בשיר:</div><div class="snips" dir="rtl">${snippet}</div></div>
        </div>
        <div class="panel flip-row" id="flipRow" role="switch" tabindex="0" aria-checked="${edit.flipped}" aria-label="להפוך את הכיוון">
          <div>
            <div class="row-title">להפוך את הכיוון</div>
            <div class="row-sub">האדום אצלכם בצד של הצלילים הגבוהים?</div>
          </div>
          <div class="switch${edit.flipped ? ' on' : ''}"><div class="knob"></div></div>
        </div>
        <div>
          <div class="sect-title">איזה קסילופון יש לכם?</div>
          <div class="sect-sub">בחרו את זה שנראה כמו שלכם</div>
        </div>
        <div class="preset-grid">${presetCards}</div>
        <div class="panel">
          <div class="row-title">התאמה ידנית</div>
          <div class="row-sub">מתחילים מהצבעים שבחרתם — הקישו על צליל כדי לשנות רק אותו</div>
          <div class="xylo edit-xylo" dir="ltr">${editBars}</div>
        </div>
        <div class="warn${dups.length ? '' : ' hidden'}" role="alert">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
          <div>
            <div class="warn-title">שני צלילים באותו צבע — יהיה קשה להבחין ביניהם</div>
            <div class="warn-sub">אם זה באמת הקסילופון שלכם, אפשר לשמור בכל זאת.</div>
          </div>
        </div>
      </div>
      <div class="savebar">
        <button class="btn-primary" id="btnSave">שמירת הצבעים</button>
        <button class="link-reset" id="btnReset">חזרה לצבעים המקוריים</button>
      </div>
      <div class="scrim${sheetOpen ? '' : ' hidden'}" id="scrim"></div>
      <div class="sheet${sheetOpen ? '' : ' hidden'}" id="sheet" role="dialog" aria-label="בחירת צבע">
        <div class="sheet-handle"></div>
        <div class="sheet-head">
          ${sheetTitleChip}
          <div>
            <div class="row-title">איזה צבע לצליל הזה?</div>
            <div class="row-sub">${sheetOpen ? 'הצליל ' + ORDINALS[edit.sheetBar] + ' משמאל בקסילופון שלכם' : ''}</div>
          </div>
        </div>
        <div class="swatch-grid">${swatches}</div>
      </div>`;

    document.title = 'התאמת צבעים — ' + BASE_TITLE;

    const rerender = () => {
      const sc = document.getElementById('settingsScroll');
      const st = sc ? sc.scrollTop : 0;
      renderSettings();
      const sc2 = document.getElementById('settingsScroll');
      if (sc2) sc2.scrollTop = st;
    };

    document.getElementById('btnBack').addEventListener('click', goHome);
    const flip = () => {
      edit.colors.reverse();
      edit.flipped = !edit.flipped;
      window.track('colors_flipped');
      rerender();
    };
    const flipRow = document.getElementById('flipRow');
    flipRow.addEventListener('click', flip);
    flipRow.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); flip(); }
    });
    app.querySelectorAll('.preset').forEach(el => {
      const pick = () => {
        const p = PRESETS.find(p => p.id === el.dataset.preset);
        edit.colors = p.colors.slice();
        edit.flipped = false;
        rerender();
      };
      el.addEventListener('click', pick);
      el.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(); }
      });
    });
    app.querySelectorAll('.bar.edit').forEach(el => {
      const open = () => { edit.sheetBar = +el.dataset.bar - 1; rerender(); };
      el.addEventListener('click', open);
      el.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); }
      });
    });
    const closeSheet = () => { edit.sheetBar = null; rerender(); };
    document.getElementById('scrim').addEventListener('click', closeSheet);
    app.querySelectorAll('.swatch').forEach(el => {
      const pick = () => {
        if (edit.sheetBar !== null) edit.colors[edit.sheetBar] = el.dataset.color;
        closeSheet();
      };
      el.addEventListener('click', pick);
      el.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(); }
      });
    });
    document.getElementById('btnSave').addEventListener('click', () => {
      saveStoredColors(edit.colors);
      applyPalette(edit.colors);
      window.track('colors_saved', { palette: presetIdFor(edit.colors) || 'custom', flipped: edit.flipped });
      goHome();
    });
    document.getElementById('btnReset').addEventListener('click', () => {
      edit.colors = DEFAULT_COLORS.slice();
      edit.flipped = false;
      edit.sheetBar = null;
      window.track('colors_reset');
      rerender();
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
      <div class="notation" id="notation">
        <div class="seq-head">
          <div class="guide-note noprint">הנגינה על הקסילופון האמיתי — המסך רק מראה מה לנגן</div>
          <div class="refstrip" dir="ltr">${refBars}</div>
        </div>
        ${phrases}
      </div>
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
    if (!setupDone()) { renderSetup(); return; } // first visit: state the instrument once
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
