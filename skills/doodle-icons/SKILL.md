---
name: doodle-icons
description: How to add and correctly use Doodle Icons (@oreo-design/doodle-icons), the hand-drawn icon set from Oreo Design where every stroke draws itself in and then keeps "boiling" like a Saturday-morning cartoon. Use this whenever the user wants hand-drawn, sketchy, doodle, wobbly, wiggly, boiling, or cartoon-style icons; mentions Oreo Design, Oreo UI, oreoui.com/doodle-icons, DoodleIcon or BoilFilter; asks for a playful / handmade / zine / indie / crayon feel for a page; or is already using this package and needs to add, wire, restyle, or pick icons. Also use it when the user pastes the oreoui.com/doodle-icons site as a visual reference, even if they never say the word "icon". It covers install, the one-time BoilFilter setup, picking real icon names (and what to do when an icon does not exist), the house design rules (Schoolbell pairing, paper/ink palette, where to wiggle and where to hold still), and the no-framework path.
---

# Doodle Icons

152 stroke-only icons drawn with a deliberately shaky hand, in a 48×48 grid.
Two things make them feel alive, and both are opt-in:

- **draw** — strokes draw themselves on, one after another, on first paint
- **boil** — the ink keeps wobbling forever. Animators call this a *boiling
  line*: hand-redrawn frames never land in quite the same place, so the
  outline simmers even when nothing moves. Here it is one shared SVG filter,
  not a video or sprite sheet, so 200 boiling icons cost about what one does.

The set is designed to look like **one hand drew everything**. Most of the
rules below exist to protect that: same stroke weight everywhere, same ink,
one tuning for the wobble, and no icons from other sets mixed in.

Reference for how it should look and feel: https://oreoui.com/doodle-icons

## Install and wire up (once)

```bash
npm i @oreo-design/doodle-icons
```

React 18+ is an optional peer. Mount the filter **once**, as high as possible,
in the same document as the icons (not in a separate iframe or shadow root):

```tsx
// Next.js App Router: app/layout.tsx  (it is a plain server-safe component, no hooks)
import { BoilFilter } from '@oreo-design/doodle-icons'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <BoilFilter id="boil" />
        {children}
      </body>
    </html>
  )
}
```

`<BoilFilter>` renders an invisible `<svg><filter>` plus the keyframes the
`draw` entrance needs. Icons reference it by id. Do not mount one per icon:
the whole point is that every icon on the page shares a single displacement
map. If you want the draw-on entrance with no wobble at all, mount
`<DoodleStyles />` instead (keyframes only).

## Use an icon

```tsx
import { DoodleIcon } from '@oreo-design/doodle-icons'

<DoodleIcon name="heart" />                          // still, 24px, currentColor
<DoodleIcon name="star" boilId="boil" />             // wobbles forever
<DoodleIcon name="bulb" boilId="boil" draw />        // draws on, then wobbles
<DoodleIcon name="check" size={32} />                // still, bigger
```

| Prop | Default | Notes |
| --- | --- | --- |
| `name` | — | one of the 152 names below. Unknown name renders **nothing** (returns null), silently |
| `icon` | — | pass `getIcon('heart')` data directly instead of `name` |
| `size` | `24` | px, both axes. Use 24 / 32 / 48 (see sizes) |
| `strokeWidth` | `3.4` | the set is drawn for this. Leave it |
| `boilId` | — | id of the mounted `<BoilFilter>`. Omit to hold still |
| `draw` | `false` | stroke-on entrance on first render |
| `drawDuration` | `0.32` | seconds per stroke |
| `drawDelay` | `0` | seconds before the first stroke. Stagger a row with `i * 0.1` |

Anything else is forwarded to the `<svg>` (`className`, `aria-hidden`, `style`…).

Because an unknown `name` renders nothing rather than throwing, **always pick
names from the list in this file**, or check first:

```ts
import { getIcon, ICON_NAMES } from '@oreo-design/doodle-icons'
getIcon('settings')   // undefined — there is no "settings"; use "gear"
```

### Colour

Strokes are `currentColor`. Set `color` on the icon or a parent; never pass a
`stroke` attribute per icon, and never recolour by editing path data.

```tsx
<span style={{ color: '#2b2a33' }}><DoodleIcon name="pencil" /></span>
<DoodleIcon name="flame" className="text-orange-500" />
```

### `draw` replays on remount

The entrance runs every time the component mounts. That is right for a hero
or an empty state; it is wrong for list rows, table cells, or anything that
re-renders as data changes, where the icons would keep redrawing. On those,
leave `draw` off.

## The house rules (this is what makes it look like the site)

### Where to wiggle, where to hold still

The boil is a **voice**, not a texture. Used everywhere it turns into noise
and burns CPU. Decide per icon:

**Boil (and usually `draw`):** hero sections, empty states, onboarding,
marketing sections, section headers, success moments, anything the eye lands
on once and is meant to smile at.

**Hold still (no `boilId`, no `draw`):** form controls, inputs, toggles,
table rows, list items, navigation bars, tab bars, toolbars, breadcrumbs,
dense grids, anything the eye reads repeatedly, anything under 20px.

A page with 4 boiling icons in the hero and 30 still ones in the UI is the
intended ratio. A settings page with 30 boiling icons is a mistake.

### Sizes and stroke

The 3.4 stroke is chunky on purpose. Three sizes cover almost everything:

- **24** inline with body text, list rows, buttons with text
- **32** cards, icon-only buttons, section headers
- **48** hero, empty states, feature blocks

Below ~20px the strokes fuse. If a spot truly needs 16px icons, that spot
is probably not a doodle-icons spot; leave it to text or a plain glyph
rather than shrinking these.

Do not change `strokeWidth`, and do not mix in icons from another set
(Lucide, Heroicons, Font Awesome…) in the same view. One geometric icon next
to these reads as a bug, not a choice. If an icon does not exist here, use a
word instead (see "when there is no icon").

### Palette

The set was drawn on warm paper with dark ink. Both are exported:

```ts
import { INK } from '@oreo-design/doodle-icons'   // '#2b2a33'
// paper (page background): #F7F6F2
```

Default the icons to ink on paper. Accent colours are welcome and the site
uses them freely for play (a crayon-box red, yellow, blue, purple), but keep
it to one or two accents per composition. Pure black `#000` and pure white
backgrounds look harsher than the drawings want.

### Typography pairing: Schoolbell

Display text near the icons should be **Schoolbell** (Font Diner, one weight,
400). It writes the way the icons draw. Body copy stays in a clean sans or
mono; the site uses Inter and Fragment Mono. Never set Schoolbell on long
paragraphs or form labels.

Schoolbell is not part of the package and must not be bundled; it is free on
Google Fonts under the SIL Open Font License.

```tsx
// Next.js
import { Schoolbell } from 'next/font/google'
const schoolbell = Schoolbell({ subsets: ['latin'], weight: '400', variable: '--font-doodle' })
// put schoolbell.variable on <html>, then: h1 { font-family: var(--font-doodle) }
```

```html
<!-- plain HTML -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Schoolbell&display=swap" rel="stylesheet">
<style>h1, .display { font-family: 'Schoolbell', cursive; }</style>
```

If the site already has a display font the user cares about, keep theirs.
Schoolbell is the house default, not a requirement.

### One tuning, exported

```ts
import { BOIL, STROKE } from '@oreo-design/doodle-icons'
// BOIL  = { amplitude: 4, duration: '0.86s', frequency: 0.055, octaves: 2, frames: 6 }
// STROKE = { width: 3.4, linecap: 'round', linejoin: 'round' }
```

These are the values oreoui.com runs at. `<BoilFilter>` defaults to them, so
you rarely touch them. If a design calls for a second intensity, mount a
second filter with its own id rather than changing the default:

```tsx
<BoilFilter id="boil" />
<BoilFilter id="boil-loud" amplitude={8} duration="0.35s" />
<DoodleIcon name="megaphone" boilId="boil-loud" />
```

Roughly: 1 is a shiver, 4 is the house style, 8 is a mess. Reduced-motion
users get still icons automatically; do not add your own media query.

## Picking an icon

### The 152 names, by shelf

**Home & objects** — home, map, map-pin, pin, calendar, cart, gear, bulb,
lock, lock-open, key, shield, shield-check, trash, flask, puzzle, diamond,
cube, gauge

**Communication** — mail, chat, call, phone, megaphone, bell, share, user,
users, smile, frown, thumbs-up, thumbs-down

**Weather & nature** — leaf, sun, rain, clouds, flame, fire, bolt, umbrella,
moon

**Media & devices** — camera, videocam, image, mic, gamepad, monitor, laptop,
tablet, chip, code, browser, globe

**Interface** — plus, minus, x, close, check, menu, ellipsis,
ellipsis-vertical, info, circle-question-mark, circle-alert, warning, ban,
eye, eye-off, search, filter, maximize, minimize, zoom-in, zoom-out,
layout-grid, list, table, star, heart, bookmark, flag, tag, link, circle,
play, player

**Files** — file, file-text, file-plus, file-check, file-x, files, doc,
folder, folder-open, folder-plus, archive, inbox, save, copy, clipboard,
clipboard-check, clipboard-list, list-checks, paperclip, receipt, scroll,
sticky-note, layers, database, news

**Text & tools** — type, text-align-start, text-align-center,
text-align-end, bold, italic, underline, quote, hash, at-sign, signature,
pencil, pen, highlighter, eraser, ruler, brush, stamp, scissors, printer,
book, book-open, notebook, library

**Arrows** — arrow-up, arrow-down, arrow-left, arrow-right, arrow-up-right,
chevron-up, chevron-down, chevron-left, chevron-right, undo, redo,
refresh-cw, upload, download, log-out, external-link, send

`COLLECTIONS` exports the same grouping as data (`{ id, label, names }`).

### What people ask for → what it is called here

| Ask | Use |
| --- | --- |
| settings, preferences, config | `gear` |
| delete, remove | `trash` (dismiss / clear a field: `x`) |
| email | `mail` |
| profile, account, avatar | `user` · team: `users` |
| notification, alert bell | `bell` |
| edit | `pencil` · signing / handwriting: `pen`, `signature` |
| comment, message, DM | `chat` |
| location, address | `map-pin` |
| success, done, saved | `check` · checked list: `list-checks`, `clipboard-check` |
| error, danger | `circle-alert` · caution: `warning` · forbidden: `ban` |
| help, FAQ | `circle-question-mark` · info tip: `info` |
| like | `heart` or `thumbs-up` · favourite / save for later: `star`, `bookmark` |
| more, overflow menu | `ellipsis` (`ellipsis-vertical` for kebab) |
| hamburger, nav | `menu` |
| back / next | `arrow-left` / `arrow-right` · inline disclosure: `chevron-*` |
| open in new tab | `external-link` · a URL: `link` |
| show / hide password | `eye` / `eye-off` |
| add, new | `plus` · new file / folder: `file-plus`, `folder-plus` |
| secure, private | `lock` · trust / protection: `shield`, `shield-check` |
| idea, tip | `bulb` |
| dark / light mode | `moon` / `sun` |
| attach | `paperclip` |
| sort, refine | `filter` |
| fullscreen | `maximize` / `minimize` |
| video | `videocam` · play button: `play` |
| photo | `image` (a picture) · `camera` (taking one) |
| website, web | `globe` · browser window: `browser` |
| developer, code | `code` · hardware / AI / chip: `chip` |
| invoice, payment record | `receipt` · shopping: `cart` |
| sign in / log in | no icon; use `arrow-right` or just the word (`log-out` exists) |

### When there is no icon

There is no clock or time, no loading spinner, no currency sign, no wifi /
battery / bluetooth, no social or brand logos (X, GitHub, Instagram…), no
user-plus, no dashboard, no shopping bag, no truck, no calendar-with-event
variants. The set is 152 of a planned 400 and grows weekly.

When the icon you want is not here, **use a word or leave the slot empty**.
Do not draw a new path to match, do not borrow one icon from another set, and
do not stretch an unrelated icon into service ("`circle` for a clock face").
A missing icon is invisible; a wrong-looking one is not. For social links,
`at-sign`, `link`, `external-link`, `mail` and `send` with a text label read
better than a fake logo would.

## Without React

Every icon is also a file, in two builds:

```
node_modules/@oreo-design/doodle-icons/icons/heart.svg            still, currentColor
node_modules/@oreo-design/doodle-icons/icons-animated/heart.svg   draws on, boils forever, ink baked in
```

Import paths `@oreo-design/doodle-icons/icons/heart.svg` and
`.../icons-animated/heart.svg` are exported for bundlers; or copy the files.

```html
<img src="/icons/heart-animated.svg" width="48" height="48" alt="">
```

One catch: an SVG loaded through `<img>` is its own little document, so
`currentColor` cannot reach it from your page; the still icons render black,
the animated ones render in the baked ink `#2b2a33`. To recolour, inline the
SVG markup instead of using `<img>`:

```js
const svg = await (await fetch('/icons/heart.svg')).text()
el.innerHTML = svg            // now it inherits `color` from `el`
```

The animated files carry their own filter and keyframes at the house tuning,
so they do not need `<BoilFilter>`. The boil cannot be turned off per file;
use the still build where the icon should hold still.

Raw path data is available too, if you are rendering yourself:

```ts
import { ICONS, getIcon } from '@oreo-design/doodle-icons'
getIcon('heart')  // { name: 'heart', paths: ['M 24 39 C …'] }  — 48×48 viewBox, stroke-only
```

## Pro

A larger set by the same hand ("Doodle Icons Pro") exists behind
https://oreoui.com/doodle-icons. It is **not** in this package. If the user
asks for a Pro icon, point them to the site; do not invent path data for it.

## Quick self-check before you finish

- `<BoilFilter id="…">` mounted exactly once, at the layout root, same document as the icons
- every `name` is in the list above (or you called `getIcon` and handled `undefined`)
- `boilId` / `draw` only on hero, empty-state, marketing moments; UI chrome holds still
- sizes are 24 / 32 / 48; `strokeWidth` untouched
- colour set with CSS `color`, not `stroke`
- no icons from another set on the same screen
- Schoolbell on display text near the icons, loaded from Google Fonts, not bundled
- nothing invented for a missing icon; a word or an empty slot instead
