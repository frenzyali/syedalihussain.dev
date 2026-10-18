# syedalihussain.dev

Single-page portfolio for Syed Ali Hussain (DevOps Engineer). Readers: hiring managers, recruiters and university admissions staff. It must read as a real engineer's site, not a template.

## Hard rules

- Astro, static output only (`output: 'static'`). No React, Vue, Tailwind or other frameworks.
- Ask before adding any npm dependency. The runtime one is `astro`; the only dev dependency is `simple-icons` (CC0), used at build time for tool icons (`src/data/icons.ts`), so no icon code ships to the browser. UI icons are inline SVGs in `src/components/Icon.astro`. The sitemap is hand-written in `public/sitemap.xml`.
- Plain scoped CSS with the custom properties in `src/styles/global.css`. One accent colour (blue, `--accent`). Green (`--ok`) marks a good status (the availability pill, "Completed" diploma, result ticks); amber (`--pending`) marks "In progress" certifications. Project CI pills are neutral. No red for metrics.
- No AI-template look: no purple/blue gradients, glassmorphism, emoji in headings, "Hi, I'm… 👋", hero blobs, fake testimonials or skill-percentage bars.
- No filler copy. Every sentence states a concrete fact, number or tool. Never invent metrics, employers, dates or links; ask the owner if a fact is missing. Project descriptions only state what the repo README shows.
- Lighthouse 100 in all four categories, mobile and desktop. No layout shift.
- Fonts: one self-hosted variable face, Geist (Latin subset, weights 100–900, ~29KB) in `public/fonts/`, preloaded with `font-display: optional`. No mono face; tool names in sentences are set slightly heavier (`.tool`). Keep fonts under 60KB.
- Dark is the default for every first-time visitor (the OS preference is ignored): `:root` holds the dark tokens and `[data-theme='light']` the light ones, so there is no flash even without JS. The toggle saves the choice in localStorage and `theme.js` applies it before first paint and keeps `<meta name="theme-color">` in sync. Every storage access is wrapped in try/catch.
- Responsive down to 360px. Semantic HTML, keyboard navigable, visible focus states, alt text.
- No analytics, cookies or trackers.
- Links: write every link as `<Link href=…>` (`src/components/Link.astro`), never a bare `<a>`. It opens links to other domains and PDFs (the CV) in a new tab with `target="_blank" rel="noopener noreferrer"`, and adds " (opens in new tab)" for screen readers (to the `aria-label` if there is one, otherwise as `.sr-only` text). In-page anchors (`#…`, `/#…`), same-site pages and `mailto:` links stay plain. It spreads the parent's attributes, so scoped styles still reach the `<a>`.
- Conventional commit messages. No `Co-Authored-By` or any Claude/AI attribution in commits, code comments, README or site footer.

## CSP constraints

`public/_headers` sets a CSP that only allows same-origin scripts and styles. Because of that:

- No inline `<script>` (except `type="application/ld+json"`), no `style="..."` attributes, no `define:vars`.
- Client JS lives in `public/theme.js` (sync, in `<head>`), `public/motion.js` (`defer`, keep it under 2KB), `public/carousel.js` (`defer`, under 2KB) and `public/bg.js` (`defer`, under 3KB), loaded with `<script is:inline src=...>`.
- `build.inlineStylesheets` is `'never'` in `astro.config.mjs`. Don't change it.
- Dynamic sizes use SVG attributes or classes, not inline styles. `astro:assets` `<Picture>` is fine (it writes no inline style unless `layout` is set; don't set it).

## Design system: bento

- A bento grid of rounded cards (`.card`: 1px `--line` border, `--radius` 18px, `--surface` fill) on a warm off-white page (light) or a near-black page (dark). Both themes are designed, not inverted; tokens live in `global.css`. No corner marks or section numbers. Behind everything sits one fixed `.bg` layer (z-index -1): a faint 64px CSS grid (`--grid-line`) and a canvas where `bg.js` moves a few accent "packets" along the grid lines (`--packet-alpha`; 11 on desktop, 5 on phones; 1× canvas, only last frame's dots cleared, 30fps cap, paused in hidden tabs, started after load). Under reduced motion only the static grid shows. Cards keep solid backgrounds, so text contrast is unchanged.
- Hero: one full-width intro tile (round 96/72px avatar left of or above the name, alt "Illustrated portrait of Syed Ali Hussain", status pill, name, role, summary, focus line, CV + Contact, then location and GitHub/LinkedIn/email), a wide "Currently" tile, and three result tiles. No avatar if there is no image; never a placeholder.
- Sections (`sections` in `src/data/site.ts` drives the headings; `nav: true` puts one in the sticky top bar): About, Experience (one card with a vertical timeline), What colleagues say (recommendations strip), Projects (card grid; the whole card links to the repo), Education & Certifications (diploma card with the 88% stat, HSSC row, certification cards), Skills (icon grid, full grouped list behind a toggle), Contact (closing tile).
- Top bar: the name as plain semibold text (links to the top), the `nav: true` links inline from 52rem, below that the same links in a `<details>` "Menu", and the theme toggle (a sun in dark mode, a moon in light mode: the icon shows the theme it switches to, with a short cross-fade).
- Recommendations (`src/data/recommendations.ts`) are verbatim LinkedIn recommendations: never edit the wording, only typos the owner approves. Initials avatars, never LinkedIn photos. They run as a slow CSS marquee (50s loop): the cards are rendered twice and the track moves by half; the copy is `aria-hidden` with its buttons out of the tab order. It pauses on hover, while a card has focus, and with the Pause button (`aria-pressed`, required by WCAG 2.2.2). Cards clamp to four lines; the whole card is a button that opens the full text in a `<dialog>` (focus returns to the card). Under reduced motion there is no loop: one set of cards scrolls sideways with prev/next. `carousel.js` wires the Pause button, the dialog and prev/next.
- "Show more" toggles are `<details class="more">` with `.when-closed` / `.when-open` labels. No JS.
- Logos: only official files the owner provides. Originals live in `assets-src/logos/` (not deployed); `python3 scripts/logos.py` (needs Pillow) trims them, removes their flat background and writes WebPs onto white in `public/img/logos/<name>.webp`: 88×88 for square logos, 112px high and up to 2.73:1 for wordmarks (`WIDE`: Al Nafi, EduQual) so their lettering stays at least 14px tall. Badges are 44px high (56px on the diploma card); wide ones keep their shape and, on phones, sit above the title. `OrgBadge` shows the logo on a white tile (`--logo-tile`, white in both themes) with the organisation name as alt text, or neutral initials if there is no file (BIEK, AWS, Linux Foundation for now). The site avatar is `src/assets/img/ali.jpg` (not `public/`, so `astro:assets` can make AVIF/WebP). It is a commissioned illustrated portrait (white background) by @s.portrait.s, credited in the footer with a link to the artist's Instagram; keep that credit. `.avatar img` in Hero.astro zooms it so the eyes sit on the circle's upper third and the face fills about 70%; re-measure those numbers (and the matching crop in `src/lib/og.ts`) if the image changes. The link preview (og.png) uses the same portrait and crop. `assets-src/img/ali-headshot.jpg` is an old AI-generated photo kept only as a backup: don't use it in the build. Never use stock or generated images.
- Pills (`.pill`) carry status and dates; chips (`.chips`) carry tool names. Uppercase `.eyebrow` labels name a tile's value.
- Motion animates transform and opacity only (no layout properties, no CLS), and all of it is off under `prefers-reduced-motion`. Rules live in the Motion block at the end of `global.css`.
  - Scroll reveals: `motion.js` adds `.motion` to `<html>` and `.is-in` once to each `[data-reveal]` element; tiles fade and rise 14px, staggered by `data-step`. `[data-count]` numbers count up from 0 to the final text already in the HTML. Without JS nothing is hidden. The intro tile (LCP) never animates.
  - Hover: `.lift` cards rise 3px onto a soft shadow; buttons rise 1px and press.
  - Continuous: the recommendations marquee and the background packets (see above), both off under reduced motion.

## Layout of the code

- `src/data/site.ts`: name, links, summary and the section list, shared by the head tags, top bar and sections.
- `src/data/experience.ts`: jobs and results. Tool names in `points` are wrapped in backticks and rendered by `Rich.astro`. The build fails if results aren't reductions (0 <= after < before).
- `src/data/projects.ts`, `recommendations.ts`, `education.ts` (diploma, HSSC, certifications; also feeds the JSON-LD credential), `skills.ts` (icon grid and groups), `icons.ts` (the simple-icons picks; tools without one get a text badge).
- `src/layouts/Base.astro`: `<head>` (meta, Open Graph, Twitter card, JSON-LD with `alumniOf` and `hasCredential`, font preload), top bar and footer.
- `src/lib/og.ts`: draws the link preview and hashes it (see `src/pages/`).
- `src/components/`: one component per section (Hero, About … Contact), plus Header (sticky top bar, `<details>` menu on phones), `Link` (every link; new tab for external and PDF), `Section` (heading), `Icon` (UI SVGs), `TechIcon` (simple-icons or text badge), `OrgBadge` (logo or initials) and `Rich` (backticks to `.tool`).
- `src/pages/`: `index.astro` (the single page), `404.astro` (served by Workers for unknown paths; `noindex`, no `og:image`) and `og.png.ts`, which serves the 1200×630 link preview. `src/lib/og.ts` draws it at build time with sharp (Astro's own image dependency; no new package), once per build. Base.astro links it as `/og.png?v=<first 8 hex of its SHA-256>` in `og:image` and `twitter:image`, so a changed image gets a new URL and link previews refetch it. Its portrait is the hero avatar (`src/assets/img/ali.jpg`), cropped like `.avatar img` in Hero.astro. Its text comes from the Geist TTFs in `assets-src/fonts/` through Pango, its colours from the light-theme tokens. Keep the portrait and name inside the centre 630×630 (WhatsApp's square crop) and all text inside 60px of the edges. `/og.png` is cached for a day in `_headers`, not immutable, because the file is served for any `?v=`.
- `wrangler.jsonc`: deploys `dist/` as Cloudflare Workers static assets. Wrangler is run with `npx`, not installed. The www → apex redirect is a Cloudflare Redirect Rule, because `_redirects` can't match hostnames.
- `public/`: `_headers`, `robots.txt`, `sitemap.xml`, `favicon.svg`, `theme.js`, `motion.js`, `carousel.js`, `bg.js`, fonts, `img/logos/` (generated, see Logos) and `cv/Syed-Ali-Hussain-CV.pdf` (linked from the hero and Contact).

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
