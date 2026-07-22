# CLAUDE.md

Context for Claude Code working in this repository.

## What this is

The personal portfolio site of **Tejas Alagiri Kannan** — MS Computer
Engineering student at UIUC, research with the Data Mining Group (Prof. Jiawei
Han) and Project ATLAS/Moonshot (Prof. ChengXiang Zhai).

**Static site. No framework, no build step, no bundler.** Plain HTML, CSS, and
vanilla JS. Deployed from this repo to GitHub Pages at `ttkgas.github.io`.

**Read `DESIGN.md` before making any visual change.** It documents the design
system and the reasoning behind it. The concept is "The Annotated Build" — an
editorial engineering journal whose figures are interactive.

## Structure

```
/
├── index.html              homepage — the only page with the 3D map
├── projects/               11 project pages
│   ├── chemistry-extraction.html   ← fully written (quality bar)
│   ├── chia-seeds.html             ← fully written (quality bar)
│   ├── multi-agent-harness.html
│   ├── wyag.html
│   ├── observing-ai-agent.html
│   ├── conversational-translator.html
│   ├── stm32-automated-artist.html
│   ├── fpga-jetpack-joyride.html
│   ├── wireless-keyboard.html
│   ├── flower-classifier.html
│   └── ai-teaching-tool.html
├── work/                   6 experience pages
│   ├── atlas-timan.html
│   ├── dmg-research.html
│   ├── braunability.html
│   ├── ncsa.html
│   ├── acies-global.html
│   └── teaching.html
├── DESIGN.md               design system — read before visual changes
├── CLAUDE.md               this file
└── index-darkgrid.html     ALTERNATE unused concept — not live, do not merge
```

All internal links are **relative**. Detail pages link back with `../index.html`.

## First task (recommended refactor)

The CSS (~350 lines) is currently **duplicated inline in all 18 HTML files** —
an artifact of how the site was generated. This makes any style change an
18-file edit.

**Recommended:** extract to `assets/site.css` and link it from every page;
extract the shared JS (reveal-on-scroll) to `assets/site.js`. Keep the
page-specific figure scripts (terminal, chart, stages, map) inline or in
separate files under `assets/`.

Do this **as a pure refactor** — the rendered output must be pixel-identical
before and after. Verify by diffing screenshots or by confirming the CSS text is
byte-identical across all 18 files before extracting (it is).

## Common tasks

**Add a project:** copy the closest existing page in `projects/`, update the
`phead`, `intro`, sections, and `annot` margin column. Then add it to (1) the
`.bench`-style index if reinstated, (2) the 3D map on `index.html` — find the
correct `.plane` for its year and add a `.node` card — and (3) the prev/next
`pagenav` links on its neighbors.

**Add an experience:** same, in `work/`.

**Add a map card:** inside the right `<div class="plane" data-year="…">`:
```html
<a class="node node--proj" href="projects/SLUG.html" data-kind="proj">
  <span class="node__kind">Project</span>
  <span class="node__title">Title</span>
  <span class="node__sub">One line</span>
  <span class="node__meta">2026</span>
</a>
```
Use `node--work` / `data-kind="work"` and `<span class="node__kind">Work</span>`
for experience cards. If a year exceeds ~6 cards, increase `.map__stage` height
rather than shrinking cards.

**Fill a placeholder:** replace the whole
`<div class="ph"><span class="cue">…</span></div>` block with real prose.
The dashed placeholder styling is intentional and visible by design.

## Guardrails

- **Never commit an API key or secret.** This is a public static site; anything
  in the repo is public. No server-side code is possible here.
- **Don't add a build step, framework, or npm dependency** without being asked.
  The no-build constraint is deliberate.
- **Don't invent metrics.** Every number on this site is real and traceable to
  source documents. If a number isn't known, omit the slot.
- **Don't remove the "Flat view" toggle** on the 3D map — it's the
  accessibility fallback and auto-engages under `prefers-reduced-motion`.
- **Don't publish the phone number.** Email / GitHub / LinkedIn only.
- **Don't merge `index-darkgrid.html` into the live design.** It's a parked
  alternate concept in a different visual language.
- Preserve `:focus-visible` outlines and reduced-motion handling on anything new.

## Verifying before push

No test suite. Before committing:
1. Open `index.html` in a browser — check the 3D map travels between years,
   filters dim correctly, flat view toggles, and the WYAG terminal accepts
   commands.
2. Click through to at least one project and one work page; confirm back links
   and prev/next work.
3. Check one page at ~380px width for mobile layout.
4. Confirm no broken internal links:
   ```bash
   grep -rho 'href="[^"#]*\.html"' . | sort -u
   ```

## Deploy

Pushing to the default branch of `ttkgas.github.io` publishes automatically via
GitHub Pages (Settings → Pages → Deploy from branch → root). Live within ~1
minute at `https://ttkgas.github.io`. No CI required.
