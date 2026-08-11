# Handoff: Xylophone Practice Guide

## Overview
A mobile-first visual practice guide that helps a beginner adult learn simple children's songs on a physical 8-note toy xylophone (C major, one octave). The app makes **no sound** and is **not a playable instrument** — it shows, in color notation, which bars to hit on the real xylophone. Fully Hebrew/RTL with mixed RTL/LTR for bilingual songs. Static, no backend, no accounts.

## About the Design Files
`Xylophone Practice.dc.html` in this bundle is a **design reference created in HTML** — a working prototype showing the intended look and behavior, not production code to copy directly. The task is to **recreate this design in the target codebase's existing environment** (React, Vue, native, etc.) using its established patterns — or, if no codebase exists yet, choose an appropriate stack (a small static React/Preact/vanilla app is a natural fit: no backend, no routing needs beyond two screens).

## Fidelity
**High-fidelity.** Colors, typography, spacing, and interactions are final intent. Recreate pixel-perfectly.

## The physical instrument (must match exactly)
8 bars, low→high. `bar` index 1–8 is the canonical reference used everywhere:

| # | Note | Label shown | Color (bg) | Text on color |
|---|------|-------------|------------|---------------|
| 1 | C low | דו | `#D94A45` | `#fff` |
| 2 | D | רה | `#EF8A3C` | `#fff` |
| 3 | E | מי | `#F3C64B` | `#6b4e00` |
| 4 | F | פה | `#AED262` | `#3d5012` |
| 5 | G | סול | `#2E7D3C` | `#fff` |
| 6 | A | לה | `#82CBEC` | `#123a52` |
| 7 | B | סי | `#2C4A8F` | `#fff` |
| 8 | C high | דו׳ (Hebrew geresh U+05F3, NOT ascii apostrophe — ascii flips in LTR contexts) | `#8B5FB0` | `#fff` |

The two greens and two blues were tuned for at-a-glance distinguishability — do not substitute.

## Screens / Views

### 1. Song library (home)
- **Purpose**: pick a song.
- **Layout**: single column, app column is `max-width: 540px` centered on desktop, bg `#faf7f1` on page bg `#efe9df`, full height (`100dvh`), column flex; header block then scrollable card list.
- **Header** (padding 28/22/18): decorative mini-xylophone — 8 bars LTR (matching the physical toy, low/long on the LEFT), width 34px, heights 65px→30px descending (`30 + (7-i)*5`), radius 6, label bottom-centered 13px/700; below it H1 "קסילופון בצבעים" 28px/900, subtitle "מדריך נגינה חזותי לשירי ילדים · בלי תווים, רק צבעים" 15px `#7d7466`.
- **Song card** (white, border `1px #e8e1d5`, radius 16, padding 16/18, gap 10, hover: border `#c9bfae` + shadow `0 4px 14px rgba(60,45,20,.08)`, active: scale .985):
  - Row 1: title 19px/700 (right, RTL) + difficulty chip (12.5px/700, pill): קל = bg `#e6f0df` fg `#3E7A48`; בינוני = bg `#fbeed8` fg `#a86a1f`.
  - Row 2: preview of first 8 note colors (14×22px, radius 4, LTR row, gap 4) + meta "N צלילים · שפה" 13px `#8d8375`.
- **Footer note** 13px `#a2988a`: "האפליקציה לא משמיעה צלילים — היא מראה על אילו מקשים להקיש בקסילופון האמיתי."

### 2. Song view — mode "תווים" (notebook / read mode)
- **Purpose**: a clean chart to read/memorize a line from. **No highlight, no playback controls, no bottom bar.** Also the printable view.
- **Top bar**: back button (42×42 white bordered, "→" glyph — points right because RTL back), song title 19px/900 + meta "קל · N צלילים" 12.5px, "מהתחלה" button hidden-irrelevant here (present in prototype; keep it only for auto mode if you prefer).
- **Mode toggle**: segmented control, container bg `#efe9dd` radius 12 padding 4; active segment bg `#2b2620` fg `#fff`, inactive fg `#6d6456`; labels "תווים" / "ניגון אוטומטי".
- **Reference strip** (persistent in both modes): 8 bars LTR, equal flex widths, heights 43.5px→26px descending (`26 + (7-i)*2.5`), radius 5, label 11px/700 bottom-centered, under it a `1px #eee7da` divider.
- **Notation area** (scrollable, padding 20/16/30, phrase gap 26):
  - One flex-wrap row per phrase; `dir` per song: `rtl` for Hebrew/bilingual, `ltr` for English-only. Gap 9 horizontal / 18 row-gap.
  - **Note block**: wrapper column (gap 5) of colored block + syllable(s).
    - Block: width 58px (duration 1) / **98px (duration 2 = long note)**, height 52px, radius 11, note label centered 18px/700, resting shadow `0 1px 3px rgba(60,45,20,.18)`.
    - Repeated notes are separate blocks with the 9px gap — never merged.
    - Syllable under block: 16px, `dir=rtl`, centered. Bilingual songs add a second line: English 11.5px `#8d8375` `dir=ltr`.
- **Print**: hide chrome (toggle, buttons, bottom bar), let notation flow (`overflow: visible; height: auto`), white bg.

### 3. Song view — mode "ניגון אוטומטי" (auto follow-along)
Same notation layout plus:
- **Current-note highlight**: block gets shadow `0 0 0 3px #fff, 0 0 0 6px #2b2620, 0 10px 22px rgba(0,0,0,.22)`, `transform: scale(1.1)` (transition .18s), syllable weight 900. Already-played notes fade to opacity .4. The matching bar in the reference strip gets ring `0 0 0 3px #2b2620`.
- **Auto-advance**: after pressing נגן, the highlight advances on a timer: `ms = (60000 / bpm) * duration` (long notes hold ×2). At the end: playing stops, bottom bar becomes "סוף השיר — כל הכבוד!" + "עוד פעם" (restarts from note 1).
- **Auto-scroll**: keep the current note ~35% from the top of the scroll area, smooth scrolling. (Do not use `scrollIntoView` if the host page forbids it; compute `scrollTo` from offsets.)
- **Tap-to-jump**: tapping any note block sets the current position there.
- **Bottom bar** (white, top border `#eee7da`, padding respects `env(safe-area-inset-bottom)`):
  - Play/pause button, 64px tall, radius 14, 18px/900: "נגן" (dark `#2b2620`/white) → while playing "השהה" (white, border `#e0d8c9`) → after pause "המשך".
  - Center: current note chip 46×46 radius 12 in the bar's color + current syllable 17px/900 + progress "N מתוך M" 12px `#8d8375`.
  - Tempo: range slider (`dir=ltr`, 30–120 step 5, default 60, accent `#2b2620`), caption "קצב: N לדקה" 11.5px.
- **Keyboard** (desktop): Space/Enter toggles play, only in auto mode.

## Interactions & Behavior
- Library card click → song view, read mode, position reset to 0.
- Switching to read mode stops playback; switching to auto resets position to 0.
- Back (→) returns to library and stops playback.
- "מהתחלה" resets position to 0 (keeps playing state).
- Changing tempo mid-play reschedules the current timer.
- All timers must be cleaned up on unmount/navigation.
- Hit targets ≥ 42px; primary controls 64px (used sitting on the floor).

## State Management
- `screen: 'list' | 'song'`, `songId`, `mode: 'read' | 'auto'`, `idx` (flat note index, `total` = finished), `playing: boolean`, `bpm: number` (default 60).
- No persistence required in v1; no data fetching — songs ship as static JSON.

## Song data format
One JSON object per song (adding songs must stay trivial):
```json
{
  "id": "yonatan",
  "title": "יונתן הקטן",
  "difficulty": "easy",          // easy | medium
  "lyricsLang": "he",            // he | en | both
  "phrases": [                    // one phrase = one notation line
    { "notes": [ { "bar": 5, "syllable": "יוֹ", "duration": 1 } ] }
  ]
}
```
- `bar`: 1–8 per the instrument table. `duration`: 1 normal, 2 long (wider block + double hold in auto mode).
- Bilingual songs: `"syllable": {"he": "נִצ", "en": "Twin"}` with `"lyricsLang": "both"`.
- Launch songs (full data embedded in the prototype's logic — extract from `Xylophone Practice.dc.html`): יונתן הקטן, Twinkle Twinkle Little Star (bilingual), Mary Had a Little Lamb (English), עוגה עוגה, הנה מה טוב. **Note:** the עוגה עוגה and הנה מה טוב melodies are plausible arrangements and should be verified against how the family sings them before ship.

## Design Tokens
- **Font**: Rubik (Google Fonts), weights 400/500/700/900; supports Hebrew + Latin.
- **Colors**: page bg `#efe9df`; app bg `#faf7f1`; ink `#2b2620`; secondary text `#8d8375`, `#7d7466`; muted `#a2988a`; borders `#e8e1d5`, `#e0d8c9`, `#eee7da`; segmented-control track `#efe9dd`; hover fill `#f3eee4`; plus the 8 bar colors above. Links: `#3B5FA0`, hover `#2c4a80`.
- **Radii**: cards 16, blocks 11, buttons 12–14, chips 99 (pill).
- **Spacing**: screen padding 16–22; phrase gap 26; note gap 9/18; card gap 12.
- **Type scale**: 28/900 (H1), 19/700–900 (titles), 16–18 (notation), 13–15 (meta), 11–12.5 (captions).

## Configurable options (prototype "tweaks" → make these settings/props)
- `blockScale` 0.75–1.5 (scales notation block size).
- `colorOnly` boolean (hide note-name labels inside blocks — color-only reading).
- `bilingualDisplay`: `both | he | en` for bilingual songs.

## Assets
None — no images or icon fonts. Everything is CSS + the Rubik webfont.

## Files
- `Xylophone Practice.dc.html` — the full working prototype (markup template + a `Component` logic class containing all song data, colors, and the auto-advance timer logic).

---

## Implementation (built from this handoff)
Static vanilla-JS app, no build step, no dependencies beyond the Rubik webfont:
- `index.html` — shell (loads Rubik, styles, scripts).
- `styles.css` — all design tokens, screens, highlight states, print styles.
- `songs.js` — song data (`window.SONGS`), one object per song per the format above.
- `app.js` — state, both screens, auto-advance timer, auto-scroll, keyboard, config.

**Run**: serve the folder with any static server, e.g. `python3 -m http.server 8642`, then open `http://localhost:8642`. (Opening `index.html` directly via `file://` also works.)

**Config options** (URL params): `?scale=1.25` (blockScale 0.75–1.5), `?colorOnly=1`, `?lyrics=he|en|both` (bilingualDisplay).

## Build & deploy (Phase 1: shareability)

The site is static, deployed by pushing to `main` (GitHub Pages, domain `ksilofon.com`).

Everything derived from song data is generated by `build.js`:

- `node build.js` — regenerates `index.html`, `song/<slug>/index.html` (pre-rendered OG/meta tags per song — WhatsApp/Facebook crawlers don't run JS), `404.html`, `robots.txt`, `sitemap.xml`.
- `node build.js --images` — also renders `og/*.png` (1200×630 per-song link previews) and the favicon set from `favicon.svg`. Needs Google Chrome installed (headless rendering).

**When adding a song:** add the object to `songs.js` with a `slug` (lowercase Latin transliteration, permanent — never change a published slug), run `node build.js --images`, commit the generated files, push.

Analytics: cookieless Umami Cloud (`analytics.js` wrapper + script tag in generated pages). Events carry only song slug, mode, and tempo — never add identifiers or user data (child-directed site). The site works fully if the script is blocked.

## Phase 2 (UX polish & kid-proofing)

**Product framing:** the app is a guide for a real physical xylophone — never an instrument. Audio exists only as single-note legend previews (tap a bar) and audible auto-play (parents hear the melody). Tones are synthesized in `audio.js` (no sample files; AudioContext unlocks on first gesture for iOS).

- Phrases carry `lyricLine` in `songs.js` (string, or `{he,en}`), rendered as headings; `phrases-review.md` is the owner's sing-through checklist.
- PWA: `manifest.webmanifest` + `sw.js` are generated by `build.js`; the site works fully offline after first visit. Umami is never cached.
- All 8 bar colors pass WCAG AA for their label text — if you change a color, re-measure contrast and re-run `node build.js --images` (OG images share the palette).
