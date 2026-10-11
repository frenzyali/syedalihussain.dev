# syedalihussain.dev

Single-page portfolio for Syed Ali Hussain (DevOps Engineer). Readers: European university admissions officers (Master's applications) and remote DevOps hiring managers. It must read as a real engineer's site, not a template.

## Hard rules

- Astro, static output only (`output: 'static'`). No React, Vue, Tailwind or other frameworks.
- Ask before adding any npm dependency. The only one is `astro`. Icons are inline SVGs in `src/components/Icon.astro`. The sitemap is hand-written in `public/sitemap.xml`.
- Plain scoped CSS with the custom properties in `src/styles/global.css`. One accent colour (drafting blue). Green (`--ok`) marks a good status ("improved" results, "tested in CI" projects); amber (`--pending`) marks "not yet applied". No red for metrics.
- No AI-template look: no purple/blue gradients, glassmorphism, emoji in headings, "Hi, I'm… 👋", hero blobs, fake testimonials or skill-percentage bars.
- No filler copy. Every sentence states a concrete fact, number or tool. Never invent metrics, employers, dates or links; ask the owner if a fact is missing. Project descriptions only state what the repo README shows.
- Lighthouse 95+ in all four categories. No layout shift.
- Fonts: system sans for body; self-hosted IBM Plex Sans Condensed 600 for display (name, headings, big readings) and IBM Plex Mono 400/600 for labels, metrics and tool names. All Latin subsets in `public/fonts/`, about 50KB total. Keep the total under 90KB.
- Light and dark mode follow `prefers-color-scheme`, with a manual toggle stored in localStorage. Every storage access is wrapped in try/catch.
- Responsive down to 360px. Semantic HTML, keyboard navigable, visible focus states, alt text.
- No analytics, cookies or trackers.
- Conventional commit messages. No `Co-Authored-By` or any Claude/AI attribution in commits, code comments, README or site footer.

## CSP constraints

`public/_headers` sets a CSP that only allows same-origin scripts and styles. Because of that:

- No inline `<script>` (except `type="application/ld+json"`), no `style="..."` attributes, no `define:vars`.
- Client JS lives in `public/theme.js` (sync, in `<head>`) and `public/motion.js` (`defer`, keep it under 2KB), loaded with `<script is:inline src=...>`.
- `build.inlineStylesheets` is `'never'` in `astro.config.mjs`. Don't change it.
- Dynamic sizes (the metric bars) use SVG attributes, not inline styles.

## Design system: infra blueprint

- Light theme is drafting paper with blue ink; dark is a cyanotype blueprint. Both are designed, not inverted. Tokens live in `global.css`.
- Graph-paper body background drawn with hard-stop `linear-gradient` lines (not decorative gradients).
- Sections are numbered 01–06 (`sections` in `src/data/site.ts` drives the nav and the headings), each with a connector line.
- Results render as monitoring panels: status dot, reading, before/after bars to scale, axis ticks.
- Motion animates transform and opacity only (no layout properties, no CLS), and all of it is off under `prefers-reduced-motion`. Rules live in the Motion block at the end of `global.css`.
  - Hero, CSS only on load: frame corners and title-block rows settle in, under 600ms in total. The name (the LCP element) never animates.
  - Scroll reveals: `motion.js` adds `.motion` to `<html>` and `.is-in` once to each `[data-reveal]` element (sections, results panels). Section connectors and rails draw in; results bars grow once; readings count down from `data-from` to the final text already in the HTML; the "improved" dot pulses once. Without JS nothing is hidden.
  - Hover: buttons lift and press, project cards shift 1px with an accent edge, `.u` links draw their underline left to right.

## Layout of the code

- `src/data/site.ts`: name, links, summary and the section list, shared by the head tags, nav and sections.
- `src/data/experience.ts`: jobs and results. Tool names in `points` are wrapped in backticks and rendered by `Rich.astro`. The build fails if results aren't reductions (0 <= after < before).
- `src/layouts/Base.astro`: `<head>` (meta, Open Graph, Twitter card, JSON-LD, font preloads), header and footer.
- `src/components/`: one component per section (Hero, About … Contact), plus Header, `Section` (numbered heading), `Icon` (inline SVGs) and `Rich` (backticks to mono).
- `public/`: `_headers`, `robots.txt`, `sitemap.xml`, `favicon.svg`, `theme.js`, `motion.js`, fonts and `cv/Syed-Ali-Hussain-CV.pdf` (linked from the hero).

## Development

Node 22 through nvm (`. ~/.nvm/nvm.sh` if `node` isn't on PATH).

Start the dev server in the background:

```
astro dev --background
```

Manage it with `astro dev stop`, `astro dev status` and `astro dev logs`.

Before committing, run `npm run build` and fix every warning.

Astro docs: https://docs.astro.build

## Gotchas

- Astro's HTML compression drops the whitespace at a line break between text and an inline element. Keep a sentence that mixes text with `<span>`s on one source line (or use `{' '}`), or words run together ("andSNS"). Prefer backtick strings rendered by `Rich.astro`.
- `npx astro check` prompts to install `@astrojs/check`, which would be a new dependency. Don't run it without asking.
