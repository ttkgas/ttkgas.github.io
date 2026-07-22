# DESIGN.md — The Annotated Build

Design system and rationale for Tejas Alagiri Kannan's portfolio site.
**Read this before changing anything visual.** It exists so the design intent
survives future edits.

---

## 1. The concept

**"The Annotated Build"** — the site reads like a refined engineering journal.
Work is presented as *entries*, with a monospace margin column carrying the real
annotations (stack, role, dates, status) the way a marked-up technical edition
would.

The one memorable idea: **an engineering journal whose figures are alive.**
Where a normal portfolio would show a screenshot, this one embeds a dark inset
panel you can actually operate — a runnable terminal, a hoverable results chart,
a clickable pipeline. That tension (refined editorial surface, interactive guts)
is what makes it not look templated.

**Two competing goals, and how they're resolved:**
- Recruiters skim in 20 seconds → the 3D map up top gives instant scope.
- Engineers evaluate closely → project pages carry real depth and real numbers.

There is an alternative concept parked at `index-darkgrid.html` ("Instrument
Panel" — clean dark grid, cursor-lit PCB background). It is **not part of the
live site.** Keep it or delete it, but don't merge the two styles.

---

## 2. Typography

Three families, each with one job. Do not add a fourth.

| Family | Role | Where |
|---|---|---|
| **Fraunces** (`--display`) | Display serif with character | Masthead, section headings, entry titles, card titles, big numbers |
| **Newsreader** (`--serif`) | Reading serif | All body prose, descriptions, lead paragraphs |
| **IBM Plex Mono** (`--mono`) | Technical annotation | Margin annotations, labels, tags, metrics captions, terminal, all figure UI |

**The rule that carries the personality:** anything that is *data about the
work* (stack, dates, status, filenames, hashes) is monospace. Anything that is
*the work being described* is serif. This split is the whole voice — keep it.

**Scale.** Base is `15px` (deliberately reduced by 4pt from an earlier 19px
pass). Headings use `clamp()` for fluid sizing. If you change the base size,
rescale everything proportionally — a mismatch between the homepage and the
detail pages reads as broken.

---

## 3. Color

Cool "drafting paper" neutrals with a single deep petrol accent, plus dark
figure panels. Deliberately **not** the cream-and-terracotta palette that has
become the default look for "editorial," and deliberately **not** near-black +
acid green for the dark panels.

```
--paper      #EEF0EB   page background
--paper-2    #E6E8E1   subtle fills (tags, placeholder blocks)
--ink        #15171B   primary text
--ink-soft   #3B3E43   secondary prose
--margin     #7F8279   annotations, captions
--rule       #D4D6CD   hairlines and borders
--accent     #0F4A52   petrol — links, active states, work items
--accent-2   #15616B   completed status
--status     #B08646   amber — in-progress status, project items, reference bars
--panel      #14171B   dark figure plates
--term       #86B9B0   terminal/figure highlight
```

**Accent discipline:** petrol is for interaction and work items; amber is for
project items and in-flight status. Two accents, no more. If something needs to
stand out, it gets space, not a new color.

---

## 4. Layout

- `.sheet` — the container, `max-width: 1180px`, fluid horizontal padding.
- `.section` — vertical rhythm unit, hairline-separated, numbered `§ 01`…
- `.entry__grid` — the signature two-column split: prose at `max-width: 68ch`
  on the left, a `226px` monospace annotation column on the right. Collapses to
  one column under 880px.
- Spacing was deliberately tightened ~35% from an earlier pass. It should feel
  dense-but-breathing. **Don't re-inflate it.**

---

## 5. Interactive figures

Four interactions exist. Each earns its place by showing something prose can't.
**Don't add decorative interactivity** — this is the line that keeps the site
from feeling like a toy.

### 5.1 The 3D chronological map (`§ 01 The Record`, homepage)
The centerpiece. All work and projects on **year planes receding in Z** —
2026 front, then 2025, 2024, 2023 behind it at `620px` depth intervals.

- CSS `perspective: 1500px` + `transform-style: preserve-3d`; the scene applies
  `rotateX() rotateY() translateZ(active * 620px)`.
- Plane states: `active` / `near` (dimmed, slight blur) / `far` (more so) /
  `behind` (hidden). Only the active plane is clickable.
- Controls: drag to swing the camera, hover for parallax, ↑/↓ buttons, arrow
  keys, year pills.
- Filters: All / Work / Projects — greys out non-matching cards rather than
  removing them, so the spatial layout never jumps.
- **Flat view toggle** — collapses to a plain list. This is a required
  accessibility escape hatch, and it auto-engages under
  `prefers-reduced-motion`. **Never remove it.**
- Stage is `400px` tall and comfortably fits ~6 cards per year. If a year grows
  past that, raise the stage height rather than shrinking the cards.

### 5.2 WYAG terminal (homepage + `projects/wyag.html`)
A simulated `wyag` session. Hash a file, then `cat-file` the same SHA — the
round trip *is* the content-addressing lesson. The blob hash used
(`ce013625…`) is the real Git SHA for `"hello\n"`; keep it accurate.

### 5.3 ChEMU results chart (`projects/chemistry-extraction.html`)
Tabbed NER / Event-Extraction bar chart. Hovering a bar explains what that
experiment established. Amber bars mark the supervised leaderboard ceiling.
**Every number came from the official scorers — do not invent or round them.**

### 5.4 Pipeline stage explorer (`projects/chia-seeds.html`)
Eight clickable stages (capture → chunk → transcribe → stitch → suppress →
correct → enhance → chat), each revealing what happens inside.

---

## 6. Content model

**Projects** (`projects/*.html`) and **Experience** (`work/*.html`) share one
page template:

```
pnav        back link + name
phead       eyebrow (kicker · date) → H1 → one-line summary
metrics     optional 4-up stat strip (only where real numbers exist)
intro       1–2 paragraphs
figure      optional interactive plate
sections    H3 + prose/bullets
repo card   "View the repository"
annot       margin column: type, role, when, stack, status
pagenav     prev / next
```

### Placeholder convention
Unwritten sections use `<div class="ph"><span class="cue">…</span></div>`,
which renders a dashed-border block with an uppercase PLACEHOLDER label and an
italic writing prompt. **This is intentional and visible** — it's a to-do list
for Tejas, not a rendering bug. Replace them with real prose over time; delete
the wrapper when you do.

Sections currently placeholdered: *The problem*, *How it works*, *What I'd
change* on most projects; *Context* and *What I took away* on every experience
page. The two fully-written projects (`chemistry-extraction`, `chia-seeds`) are
the quality bar to write toward.

---

## 7. Hard rules

1. **No frameworks, no build step, no bundler.** Plain HTML/CSS/JS. The site
   must remain deployable by pushing static files.
2. **No external runtime dependencies** except Google Fonts.
3. **Everything client-side.** GitHub Pages serves static files only — no
   server code, and therefore **never put an API key in this repo.**
4. **No localStorage/sessionStorage** patterns copied from elsewhere; nothing
   here needs persistence.
5. **Respect `prefers-reduced-motion`** — it's already wired to disable all
   transitions and flatten the 3D map. Any new animation must honor it.
6. **Keyboard and focus states** — `:focus-visible` outlines are defined
   globally. Don't strip them.
7. **Don't add a fourth typeface or a third accent color.**
8. **Don't publish the phone number.** Email, GitHub, and LinkedIn only — this
   was a deliberate choice.
9. **Accuracy over polish.** Every metric on this site is real. Never invent a
   number to fill a slot; leave the slot out instead.

---

## 8. Known state / open items

- **CSS is currently inlined in all 18 pages** (a generator artifact). See
  `CLAUDE.md` §"First task" — extracting it to `assets/site.css` is the
  recommended first refactor.
- **Repo links** on most project pages point at the GitHub profile, not
  specific repos. Real URLs should replace them as repos go public.
- **Résumé PDF** link in the footer is a `#` placeholder.
- MS is listed as **Computer Engineering** per the current resume.
