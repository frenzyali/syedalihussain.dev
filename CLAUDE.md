# syedalihussain.dev

Single-page portfolio for Syed Ali Hussain (DevOps Engineer). Readers: European university admissions officers (Master's applications) and remote DevOps hiring managers. It must read as a real engineer's site, not a template.

## Hard rules

- Astro, static output only (`output: 'static'`). No React, Vue, Tailwind or other frameworks.
- Ask before adding any npm dependency. The runtime one is `astro`; the only dev dependency is `simple-icons` (CC0), used at build time for tool icons (`src/data/icons.ts`), so no icon code ships to the browser. UI icons are inline SVGs in `src/components/Icon.astro`. The sitemap is hand-written in `public/sitemap.xml`.
- Plain scoped CSS with the custom properties in `src/styles/global.css`. One accent colour (blue, `--accent`). Green (`--ok`) marks a good status (the availability pill, "Completed" diploma, result ticks); amber (`--pending`) marks "In progress" certifications. Project CI pills are neutral. No red for metrics.
- No AI-template look: no purple/blue gradients, glassmorphism, emoji in headings, "Hi, I'm… 👋", hero blobs, fake testimonials or skill-percentage bars.
- No filler copy. Every sentence states a concrete fact, number or tool. Never invent metrics, employers, dates or links; ask the owner if a fact is missing. Project descriptions only state what the repo README shows.
- Lighthouse 100 in all four categories, mobile and desktop. No layout shift.
- Fonts: one self-hosted variable face, Geist (Latin subset, weights 100–900, ~29KB) in `public/fonts/`, preloaded with `font-display: optional`. No mono face; tool names in sentences are set slightly heavier (`.tool`). Keep fonts under 60KB.
- Light and dark mode follow `prefers-color-scheme`, with a manual toggle stored in localStorage. Every storage access is wrapped in try/catch.
- Responsive down to 360px. Semantic HTML, keyboard navigable, visible focus states, alt text.
- No analytics, cookies or trackers.
- Conventional commit messages. No `Co-Authored-By` or any Claude/AI attribution in commits, code comments, README or site footer.

## CSP constraints

`public/_headers` sets a CSP that only allows same-origin scripts and styles. Because of that:

- No inline `<script>` (except `type="application/ld+json"`), no `style="..."` attributes, no `define:vars`.
- Client JS lives in `public/theme.js` (sync, in `<head>`), `public/motion.js` (`defer`, keep it under 2KB) and `public/carousel.js` (`defer`, keep it under 1.5KB), loaded with `<script is:inline src=...>`.
- `build.inlineStylesheets` is `'never'` in `astro.config.mjs`. Don't change it.
- Dynamic sizes use SVG attributes or classes, not inline styles. `astro:assets` `<Picture>` is fine (it writes no inline style unless `layout` is set; don't set it).

## Design system: bento

- A bento grid of rounded cards (`.card`: 1px `--line` border, `--radius` 18px, `--surface` fill) on a warm off-white page (light) or a near-black page (dark). Both themes are designed, not inverted; tokens live in `global.css`. No background patterns, corner marks or section numbers.
- Hero: one full-width intro tile (round 96/72px headshot avatar left of or above the name, status pill, name, role, summary, focus line, CV + Contact, then location and GitHub/LinkedIn/email), a wide "Currently" tile, and three result tiles. No avatar if there is no headshot; never a placeholder image.
- Sections (`sections` in `src/data/site.ts` drives the headings; `nav: true` puts one in the sticky top bar): About, Experience (one card with a vertical timeline), What colleagues say (recommendations carousel), Projects (card grid; the whole card links to the repo), Education & Certifications (diploma card with the 88% stat, HSSC row, certification cards), Skills (icon grid, full grouped list behind a toggle), Contact (closing tile).
- Top bar: the name as plain semibold text (links to the top), the `nav: true` links inline from 52rem, below that the same links in a `<details>` "Menu", and the theme toggle.
- Recommendations (`src/data/recommendations.ts`) are verbatim LinkedIn recommendations: never edit the wording, only typos the owner approves. Initials avatars, never LinkedIn photos. The carousel is a CSS scroll-snap track (works without JS); `carousel.js` adds prev/next, dots and Left/Right keys. No autoplay.
- "Show more" toggles are `<details class="more">` with `.when-closed` / `.when-open` labels. No JS.
- Logos: only official files the owner adds to `public/img/logos/<name>.svg`; until then `OrgBadge` shows neutral initials. The headshot goes in `src/assets/img/ali.{jpg,webp}` (not `public/`, so `astro:assets` can make AVIF/WebP); until then the intro shows no avatar. Never use stock or generated images.
- Pills (`.pill`) carry status and dates; chips (`.chips`) carry tool names. Uppercase `.eyebrow` labels name a tile's value.
- Motion animates transform and opacity only (no layout properties, no CLS), and all of it is off under `prefers-reduced-motion`. Rules live in the Motion block at the end of `global.css`.
  - Scroll reveals: `motion.js` adds `.motion` to `<html>` and `.is-in` once to each `[data-reveal]` element; tiles fade and rise 14px, staggered by `data-step`. `[data-count]` numbers count up from 0 to the final text already in the HTML. Without JS nothing is hidden. The intro tile (LCP) never animates.
  - Hover: `.lift` cards rise 3px onto a soft shadow; buttons rise 1px and press.

## Layout of the code

- `src/data/site.ts`: name, links, summary and the section list, shared by the head tags, top bar and sections.
- `src/data/experience.ts`: jobs and results. Tool names in `points` are wrapped in backticks and rendered by `Rich.astro`. The build fails if results aren't reductions (0 <= after < before).
- `src/data/projects.ts`, `recommendations.ts`, `education.ts` (diploma, HSSC, certifications; also feeds the JSON-LD credential), `skills.ts` (icon grid and groups), `icons.ts` (the simple-icons picks; tools without one get a text badge).
- `src/layouts/Base.astro`: `<head>` (meta, Open Graph, Twitter card, JSON-LD with `alumniOf` and `hasCredential`, font preload), top bar and footer.
- `src/components/`: one component per section (Hero, About … Contact), plus Header (sticky top bar, `<details>` menu on phones), `Section` (heading), `Icon` (UI SVGs), `TechIcon` (simple-icons or text badge), `OrgBadge` (logo or initials) and `Rich` (backticks to `.tool`).
- `src/pages/`: `index.astro` (the single page) and `404.astro` (served by Workers for unknown paths; `noindex`).
- `wrangler.jsonc`: deploys `dist/` as Cloudflare Workers static assets. Wrangler is run with `npx`, not installed. The www → apex redirect is a Cloudflare Redirect Rule, because `_redirects` can't match hostnames.
- `public/`: `_headers`, `robots.txt`, `sitemap.xml`, `favicon.svg`, `theme.js`, `motion.js`, `carousel.js`, fonts, `img/logos/` and `cv/Syed-Ali-Hussain-CV.pdf` (linked from the hero and Contact).

## Development

Node 22 through nvm (`. ~/.nvm/nvm.sh` if `node` isn't on PATH).

Start the dev server in the background:

```
astro dev --background
```

Manage it with `astro dev stop`, `astro dev status` and `astro dev logs`.

Before committing, run `npm run build` and fix every warning.

## Before every push: screenshot every section

A CSS edit once deleted shared rules and broke three sections on the live site, because only the edited sections were checked. So before every push:

1. `npm run build`, then serve it: `npx astro preview --port 4322`.
2. `CHROME=/path/to/chrome node scripts/screenshots.mjs http://localhost:4322 shots`. It writes every section (hero, about, experience, recommendations, projects, education, skills, contact; "Show more" panels closed) at 360px and 1280px, light and dark, into `shots/` (gitignored), and prints sideways overflow and CLS per page.
3. Run Lighthouse (mobile and desktop) against the preview: `CHROME_PATH=/path/to/chrome npx lighthouse http://localhost:4322/ [--preset=desktop]`. All four categories must be 100.
4. Look at all of them, not only the sections you changed, and compare with the previous screenshots. Overflow must be `false` and CLS about 0.
5. Review `git diff --stat` and the removed lines (`git diff | grep '^-'`), especially after deleting a block of CSS by range.

Only push when every section matches.

Astro docs: https://docs.astro.build

## Gotchas

- Astro's HTML compression drops the whitespace at a line break between text and an inline element. Keep a sentence that mixes text with `<span>`s on one source line (or use `{' '}`), or words run together ("andSNS"). Prefer backtick strings rendered by `Rich.astro`.
- `npx astro check` prompts to install `@astrojs/check`, which would be a new dependency. Don't run it without asking.
