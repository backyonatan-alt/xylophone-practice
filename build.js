#!/usr/bin/env node
/* Build script — generates everything derived from song data:
     node build.js            → index.html, song/<slug>/index.html, 404.html, robots.txt, sitemap.xml
     node build.js --images   → also renders og/*.png + favicon PNGs/ICO (needs Chrome; run when songs change)
   WhatsApp/Facebook crawlers don't run JS, so every route is a real HTML file
   with its meta tags baked in. Re-run (and commit the output) whenever songs.js changes. */
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { execFileSync } = require('child_process');

const ROOT = __dirname;
const ORIGIN = 'https://ksilofon.com';
const SITE_NAME = 'קסילופון בצבעים';
const HOME_TITLE = SITE_NAME + ' — לנגן שירי ילדים בלי תווים';
const HOME_DESC = 'מדריך נגינה חזותי לשירי ילדים על קסילופון צבעוני. בלי תווים, רק צבעים. חינם, לגילאי 2־6.';
const DIFF_TEXT = { easy: 'קל', medium: 'בינוני' };

// Bar colors — keep in sync with BARS in app.js.
const BAR_COLORS = ['#D94A45', '#EF8A3C', '#F3C64B', '#AED262', '#2E7D3C', '#82CBEC', '#2C4A8F', '#8B5FB0'];
const BAR_LABELS = ['דו', 'רה', 'מי', 'פה', 'סול', 'לה', 'סי', 'דו׳'];
const BAR_FG = ['#fff', '#fff', '#6b4e00', '#3d5012', '#fff', '#123a52', '#fff', '#fff'];

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

// Cache-buster appended to same-origin asset URLs. GitHub Pages caches files for
// 10 min; without this, a fresh HTML page can load a stale cached app.js/analytics.js.
const V = (() => {
  const h = require('crypto').createHash('sha1');
  for (const f of ['app.js', 'analytics.js', 'songs.js', 'styles.css']) {
    h.update(fs.readFileSync(path.join(ROOT, f)));
  }
  return h.digest('hex').slice(0, 10);
})();

function loadSongs() {
  const sandbox = { window: {} };
  vm.runInNewContext(fs.readFileSync(path.join(ROOT, 'songs.js'), 'utf8'), sandbox);
  return sandbox.window.SONGS;
}

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const flat = song => song.phrases.flatMap(p => p.notes);

function page({ title, desc, ogTitle, ogImage, url, bodyExtra }) {
  return `<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${url}">
<meta property="og:type" content="website">
<meta property="og:locale" content="he_IL">
<meta property="og:site_name" content="${esc(SITE_NAME)}">
<meta property="og:url" content="${url}">
<meta property="og:title" content="${esc(ogTitle)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:image" content="${ogImage}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${esc(ogTitle)}">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/favicon.ico" sizes="32x32">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;700;900&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/styles.css?v=${V}">
<script defer src="https://cloud.umami.is/script.js" data-website-id="f05879d7-dfee-4c75-a791-f31bd9cb8741" data-domains="ksilofon.com"></script>
</head>
<body>
<div class="app" id="app" dir="rtl"></div>
${bodyExtra || ''}<script src="/songs.js?v=${V}"></script>
<script src="/analytics.js?v=${V}"></script>
<script src="/app.js?v=${V}"></script>
</body>
</html>
`;
}

function songMeta(song) {
  const n = flat(song).length;
  return {
    title: `${song.title} — ${SITE_NAME}`,
    ogTitle: `איך לנגן "${song.title}" בקסילופון — לפי צבעים`,
    desc: `${song.title} · ${DIFF_TEXT[song.difficulty]} · ${n} צלילים. מדריך צבעים חינמי לנגינה עם הילדים.`,
    url: `${ORIGIN}/song/${song.slug}/`,
    ogImage: `${ORIGIN}/og/${song.slug}.png`,
    bodyExtra: `<noscript><h1>${esc(song.title)}</h1><p>${esc('מדריך נגינה לפי צבעים — האפליקציה דורשת JavaScript.')}</p></noscript>\n`
  };
}

function notFoundPage() {
  return `<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>השיר לא נמצא — ${SITE_NAME}</title>
<meta name="robots" content="noindex">
<link rel="icon" href="/favicon.ico" sizes="32x32">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link href="https://fonts.googleapis.com/css2?family=Rubik:wght@400;700;900&display=swap" rel="stylesheet">
<script defer src="https://cloud.umami.is/script.js" data-website-id="f05879d7-dfee-4c75-a791-f31bd9cb8741" data-domains="ksilofon.com"></script>
<style>
  body { margin:0; background:#efe9df; font-family:'Rubik',system-ui,sans-serif; color:#2b2620;
         min-height:100vh; display:flex; align-items:center; justify-content:center; text-align:center; }
  .box { background:#faf7f1; border-radius:24px; padding:48px 36px; margin:20px; max-width:420px;
         box-shadow:0 0 40px rgba(60,45,20,.12); }
  .bars { display:flex; gap:6px; justify-content:center; align-items:flex-end; margin-bottom:24px; direction:ltr; }
  .bars div { width:26px; border-radius:6px; }
  h1 { font-size:26px; font-weight:900; margin:0 0 10px; }
  p { color:#7d7466; font-size:16px; margin:0 0 24px; }
  a { display:inline-block; background:#2b2620; color:#fff; text-decoration:none; font-weight:700;
      font-size:17px; border-radius:14px; padding:16px 28px; }
</style>
</head>
<body>
<div class="box">
  <div class="bars">${BAR_COLORS.map((c, i) => `<div style="background:${c};height:${58 - i * 4}px"></div>`).join('')}</div>
  <h1>אופס, השיר לא נמצא</h1>
  <p>אולי הקישור השתנה — אבל כל השירים מחכים במקום אחד</p>
  <a href="/">לכל השירים ←</a>
</div>
</body>
</html>
`;
}

/* ---------- OG image + favicon rendering (headless Chrome) ---------- */

function ogTemplate({ title, subtitle, notes, isHome }) {
  const blocks = notes.map(n => {
    const b = n.bar - 1;
    return `<div class="blk" style="background:${BAR_COLORS[b]};color:${BAR_FG[b]}">${BAR_LABELS[b]}</div>`;
  }).join('');
  const xylo = BAR_COLORS.map((c, i) =>
    `<div class="bar" style="background:${c};height:${150 - i * 12}px"></div>`).join('');
  return `<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
<meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Rubik:wght@400;700;900&display=swap" rel="stylesheet">
<style>
  * { box-sizing:border-box; margin:0; }
  body { width:1200px; height:630px; overflow:hidden; background:#efe9df;
         font-family:'Rubik','Arial Hebrew',sans-serif; color:#2b2620; }
  .card { position:absolute; inset:36px; background:#faf7f1; border-radius:36px;
          box-shadow:0 10px 60px rgba(60,45,20,.15); padding:56px 64px;
          display:flex; flex-direction:column; justify-content:space-between; }
  .top { display:flex; justify-content:space-between; align-items:flex-start; gap:40px; }
  .title { font-size:${isHome ? 76 : 64}px; font-weight:900; letter-spacing:-1px; line-height:1.12; max-width:760px; }
  .sub { font-size:33px; color:#7d7466; margin-top:18px; font-weight:400; }
  .xylo { display:flex; gap:9px; align-items:flex-end; direction:ltr; flex:none; padding-top:6px; }
  .bar { width:44px; border-radius:9px; }
  .seq { display:flex; gap:14px; direction:rtl; }
  .blk { width:104px; height:96px; border-radius:20px; display:flex; align-items:center; justify-content:center;
         font-size:34px; font-weight:700; box-shadow:0 3px 8px rgba(60,45,20,.2); flex:none; }
  .foot { display:flex; justify-content:space-between; align-items:flex-end; }
  .brand { font-size:29px; font-weight:700; color:#8d8375; }
</style>
</head>
<body>
<div class="card">
  <div class="top">
    <div><div class="title">${esc(title)}</div><div class="sub">${esc(subtitle)}</div></div>
    <div class="xylo">${xylo}</div>
  </div>
  <div class="seq">${blocks}</div>
  <div class="foot"><div class="brand">ksilofon.com · ${esc(SITE_NAME)}</div></div>
</div>
</body>
</html>`;
}

function renderPng(html, outPath, { width, height, transparent }) {
  const tmp = path.join(require('os').tmpdir(), 'ksilofon-og-' + Date.now() + '-' + Math.random().toString(36).slice(2) + '.html');
  fs.writeFileSync(tmp, html);
  try {
    execFileSync(CHROME, [
      '--headless=new', '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=1',
      '--default-background-color=' + (transparent ? '00000000' : 'FFFFFFFF'),
      '--virtual-time-budget=10000',
      `--window-size=${width},${height}`,
      `--screenshot=${outPath}`,
      'file://' + tmp
    ], { stdio: 'pipe' });
  } finally {
    fs.unlinkSync(tmp);
  }
}

// Minimal ICO container wrapping a 32×32 PNG (valid since Windows Vista / all browsers).
function pngToIco(pngPath, icoPath) {
  const png = fs.readFileSync(pngPath);
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); header.writeUInt16LE(1, 2); header.writeUInt16LE(1, 4);
  const entry = Buffer.alloc(16);
  entry[0] = 32; entry[1] = 32; entry[2] = 0; entry[3] = 0;
  entry.writeUInt16LE(1, 4); entry.writeUInt16LE(32, 6);
  entry.writeUInt32LE(png.length, 8); entry.writeUInt32LE(22, 12);
  fs.writeFileSync(icoPath, Buffer.concat([header, entry, png]));
}

function buildImages(songs) {
  const ogDir = path.join(ROOT, 'og');
  fs.mkdirSync(ogDir, { recursive: true });

  renderPng(ogTemplate({
    title: SITE_NAME,
    subtitle: 'לנגן שירי ילדים בלי תווים — רק צבעים · חינם, לגילאי 2־6',
    notes: [{ bar: 1 }, { bar: 3 }, { bar: 5 }, { bar: 8 }, { bar: 6 }, { bar: 4 }, { bar: 2 }, { bar: 5 }],
    isHome: true
  }), path.join(ogDir, 'home.png'), { width: 1200, height: 630 });
  console.log('og/home.png');

  for (const song of songs) {
    const n = flat(song).length;
    renderPng(ogTemplate({
      title: song.title,
      subtitle: `איך לנגן לפי צבעים · ${DIFF_TEXT[song.difficulty]} · ${n} צלילים`,
      notes: flat(song).slice(0, 9),
      isHome: false
    }), path.join(ogDir, `${song.slug}.png`), { width: 1200, height: 630 });
    console.log(`og/${song.slug}.png`);
  }

  // Favicons from favicon.svg
  const svg = fs.readFileSync(path.join(ROOT, 'favicon.svg'), 'utf8');
  const png512 = path.join(ROOT, 'favicon-512.tmp.png');
  renderPng(`<!DOCTYPE html><html><head><style>*{margin:0}body{width:512px;height:512px}svg{display:block;width:512px;height:512px}</style></head><body>${svg}</body></html>`,
    png512, { width: 512, height: 512, transparent: true });
  execFileSync('sips', ['-z', '32', '32', png512, '--out', path.join(ROOT, 'favicon-32.png')], { stdio: 'pipe' });
  // apple-touch-icon gets an opaque background (iOS flattens transparency to black)
  const pngTouch = path.join(ROOT, 'apple-touch-icon.tmp.png');
  renderPng(`<!DOCTYPE html><html><head><style>*{margin:0}body{width:512px;height:512px;background:#faf7f1}svg{display:block;width:512px;height:512px}</style></head><body>${svg}</body></html>`,
    pngTouch, { width: 512, height: 512 });
  execFileSync('sips', ['-z', '180', '180', pngTouch, '--out', path.join(ROOT, 'apple-touch-icon.png')], { stdio: 'pipe' });
  pngToIco(path.join(ROOT, 'favicon-32.png'), path.join(ROOT, 'favicon.ico'));
  fs.unlinkSync(png512);
  fs.unlinkSync(pngTouch);
  console.log('favicon-32.png, apple-touch-icon.png, favicon.ico');
}

/* ---------- Main ---------- */

const songs = loadSongs();

fs.writeFileSync(path.join(ROOT, 'index.html'), page({
  title: HOME_TITLE,
  desc: HOME_DESC,
  ogTitle: HOME_TITLE,
  url: ORIGIN + '/',
  ogImage: ORIGIN + '/og/home.png'
}));

for (const song of songs) {
  if (!song.slug) throw new Error('song missing slug: ' + song.id);
  const dir = path.join(ROOT, 'song', song.slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), page(songMeta(song)));
}

fs.writeFileSync(path.join(ROOT, '404.html'), notFoundPage());

fs.writeFileSync(path.join(ROOT, 'robots.txt'),
  `User-agent: *\nAllow: /\n\nSitemap: ${ORIGIN}/sitemap.xml\n`);

const today = new Date().toISOString().slice(0, 10);
const urls = [ORIGIN + '/', ...songs.map(s => `${ORIGIN}/song/${s.slug}/`)];
fs.writeFileSync(path.join(ROOT, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  urls.map(u => `  <url><loc>${u}</loc><lastmod>${today}</lastmod></url>`).join('\n') +
  `\n</urlset>\n`);

console.log(`index.html, 404.html, robots.txt, sitemap.xml, ${songs.length} song pages`);

if (process.argv.includes('--images')) buildImages(songs);
