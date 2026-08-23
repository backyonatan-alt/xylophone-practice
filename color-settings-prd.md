# PRD — Xylophone Color Settings ("הקסילופון שלכם נראה אחרת?")

**Status:** Draft for design handoff · **Owner:** Yonatan · **Date:** 2026-08-23
**Feature branch:** `claude/xylophone-color-options-pvqy2z`

## 1. Problem

The app's entire notation language is color: a note block is "the pink bar", not "F". Today the palette is hardcoded to one specific toy (rainbow, red on the low/long bar). Toy xylophones on the market vary widely — same rainbow reversed (red on the short/high bar), pastel/metal glockenspiel palettes, and jumbled color orders. For a family whose toy doesn't match, the app is actively misleading: it tells the child to hit the wrong bar.

This is the last blocker before public launch.

## 2. Goals

- A parent with any common 8-note toy can make the app's colors match their instrument in under a minute.
- The child's experience is unchanged — setup is a one-time parent task; colors then apply everywhere, forever (persisted).
- Zero regression for the default case: families with the "classic" rainbow toy never need to touch settings.

### Non-goals (v1)

- **Different bar counts** (5-bar, 12-bar toys). Songs reference bars 1–8; supporting other counts changes the song data model. The settings screen states clearly: "מתאים לקסילופון עם 8 צלילים".
- Changing pitches/notes, tuning, or sound.
- Per-song color overrides.
- Regenerating OG link-preview images per palette (they stay in the default palette — they're marketing assets, not notation).

## 3. Users & insight

- **Parent (setup):** thinks "the pink one", not "#F06BA8". Will match by *looking at the toy*, so choices must be visual (pictures of xylophones, color swatches) — never color names alone, never a free color wheel.
- **Child (daily use):** must never land in settings accidentally; must never end up with a broken palette (e.g., two identical bars) without the parent being warned.

Key market insight (from shopping-results survey): most non-matching toys are the **same rainbow reversed**. A single "flip" action likely covers ~half of all mismatches.

## 4. Solution overview — three tiers, cheapest first

One new **settings screen** ("התאמת צבעים") reachable from the library screen. Three ways to match, ordered by effort:

1. **Flip direction** — one toggle: "האדום אצלכם על הצליל הגבוה?" Reverses the current palette order.
2. **Presets** — 3–5 common palettes rendered as **mini xylophone illustrations** (no names needed). Parent taps the one that looks like their toy.
3. **Custom** — tap each of the 8 bars on a large editable xylophone, pick a color from a **fixed swatch palette** (~12 colors). No free color picker.

## 5. Functional requirements

### FR1 — Entry points: first-visit setup + persistent header button
- **First visit (one-time):** before the library is first shown, a setup screen asks "האם הקסילופון שלכם נראה כך?" over an illustration of the default palette, with two choices: confirm ("כן, זה שלנו" → library, default saved) or "לא — נתאים את הצבעים" (→ the settings screen). The answer is persisted; the screen never appears again. This guarantees every family states their instrument up front — no discovery problem.
- **Afterwards:** a persistent icon button (sliders icon) pinned to the library header, always visible regardless of how many songs are in the list (a link below the list would scroll out of view). Opens the same settings screen for manual changes at any time.
- Not shown inside the song view (kid territory).

### FR2 — Flip toggle
- Single control that reverses the order of whatever palette is active (default, preset, or custom).
- Live preview on the screen's main xylophone illustration.

### FR3 — Presets
- Rendered as tappable mini-xylophones (reuse the existing `mini-bar` visual language).
- v1 set (final palettes to be verified against best-selling toys during design):
  1. **Classic rainbow** — current default (red low → purple high).
  2. **Reversed rainbow** — same, red on high (equivalent to default + flip; still shown as its own card because parents match by picture).
  3. **Metal glockenspiel** — the common blue-tray toy (red, orange, yellow, green, light blue, dark blue, pink, white — verify).
  4. **Wood pastel** — Hape-style pastel palette (verify).
- Selecting a preset updates the main illustration immediately; nothing is saved until confirm (see FR6).

### FR4 — Custom colors
- **Manual is not a separate mode and never starts from scratch:** it always edits the currently active palette — the chosen preset, or the default. A parent picks the closest preset first, then fixes the one or two bars that differ. Flip, preset choice, and manual edits compose into a single palette state.
- Large xylophone (8 bars, low→high, LTR like everywhere in the app). Tap a bar → swatch sheet opens → tap a swatch → bar updates.
- **Fixed swatch palette (~12), each with a pre-measured WCAG-AA label text color (`fg`).** Proposed starting set (contrast to be re-measured at implementation):

  | Swatch | bg | fg |
  |---|---|---|
  | אדום | `#C13732` | `#fff` |
  | כתום | `#EF8A3C` | `#4a2500` |
  | צהוב | `#F3C64B` | `#6b4e00` |
  | ירוק בהיר | `#AED262` | `#3d5012` |
  | ירוק כהה | `#2E7D3C` | `#fff` |
  | תכלת | `#82CBEC` | `#123a52` |
  | כחול | `#2C4A8F` | `#fff` |
  | סגול | `#8B5FB0` | `#fff` |
  | ורוד | `#F06BA8` | `#5c1030` |
  | לבן | `#F5F2EC` + border | `#2b2620` |
  | שחור | `#3A342E` | `#fff` |
  | עץ | `#C89A63` | `#40280a` |

- **Preset colors stay reachable:** when the active palette contains colors outside the 12 base swatches (e.g., the pastel preset), those colors appear as additional swatches in the sheet — so a parent who tweaks one bar after choosing a preset can always pick the preset's colors back. Every preset color therefore also needs a pre-measured `fg`.
- **Duplicate warning:** if two or more bars share a color, show a non-blocking warning ("שני צלילים באותו צבע — קשה להבחין ביניהם") — allowed but discouraged (some real toys do repeat colors).
- White swatch renders with a visible border everywhere (blocks, strips, previews).

### FR5 — Application scope
The chosen palette drives every colored element currently fed by the `BARS` array (`app.js`): song note blocks, reference strip, header mini-xylophone, song-card color previews, current-note chip in the auto-play bottom bar, legend preview bars, and print output. Single source of truth stays `BARS`; it becomes derived from settings at startup.

### FR6 — Confirm, persist, reset
- Explicit confirm ("שמירה") applies + persists; leaving without confirm discards.
- Persistence: `localStorage` (survives sessions, per device). URL param (e.g., `?colors=<preset-id>` or compact custom encoding) overrides localStorage for that visit — keeps links shareable and consistent with the existing `?scale/colorOnly/lyrics` config-param pattern.
- "חזרה לצבעים המקוריים" reset action, always visible on the settings screen (the temporary swatch sheet may cover it while open).

### FR7 — Analytics
- Events (cookieless, no user data, consistent with existing policy): settings opened, preset chosen (preset id), custom saved (no color values needed — or values only as anonymous palette string), flip used, reset used.

## 6. UX principles for design

- **Match by eye, not by name.** Every choice is a picture of a xylophone or a color chip.
- **One-minute task.** The happy path (preset tap → save) is 2 taps.
- **Live preview.** One large xylophone illustration at the top of the settings screen always shows the current selection; ideally also a 2–3 note song-block snippet so the parent sees "what my child will see".
- **Parent tone, existing design language.** Same tokens (Rubik, `#faf7f1` card surfaces, radius 16, ink `#2b2620`); RTL; hit targets ≥ 42px.
- **Fail-safe.** No state can make the app unusable: reset is always one tap away; defaults are never lost.

## 7. Accessibility

- Every swatch ships with a measured ≥ 4.5:1 `fg` for the note label (same standard as today's palette, per README).
- `colorOnly` mode makes color the *only* signal — correctness of the custom palette matters most there; the duplicate warning is required, not nice-to-have.
- Swatches get `aria-label` with the Hebrew color name; bars announce "צליל N — צבע X".

## 8. Edge cases

- Both localStorage and URL param present → URL wins for that visit, does not overwrite storage.
- Corrupt/legacy stored value → silently fall back to default.
- Print/PDF uses the active palette.
- OG images and favicon remain default-palette (build-time assets).

## 9. Success criteria

- Launch-blocking bug class ("app shows wrong colors for my toy") has a self-service fix.
- ≥ 90% of settings sessions end in a saved palette in under 60s (analytics: opened → saved timing).
- No drop in existing funnel (library → song → auto-play) for default-palette users.

## 10. Open questions (for design)

1. ~~Entry point / first-run discovery~~ — **resolved:** one-time first-visit setup screen + persistent header icon button (see FR1).
2. Are presets and flip separate sections, or is flip just a control on the preview illustration?
3. Swatch sheet: bottom sheet vs. inline popover under the tapped bar?
4. Final preset palettes — verify against the actual best-selling toys in IL market.
5. Should saving offer "שיתוף" (copy a link with `?colors=` for the other parent's phone)?

## 11. Milestones

1. **Design** (Claude Design canvas): settings screen, swatch sheet, entry point, empty/warning states.
2. **Implementation**: settings screen + `BARS` derivation + persistence + analytics.
3. **QA**: contrast re-measurement of all swatches, RTL/print/PWA-offline checks, duplicate-color flow.
4. Ship with launch.
