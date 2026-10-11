# syedalihussain.dev

Single-page portfolio for Syed Ali Hussain (DevOps Engineer). Readers: European university admissions officers (Master's applications) and remote DevOps hiring managers. It must read as a real engineer's site, not a template.

## Hard rules

- Astro, static output only (`output: 'static'`). No React, Vue, Tailwind or other frameworks.
- Ask before adding any npm dependency. The only one is `astro`. Icons are inline SVGs in `src/components/Icon.astro`. The sitemap is hand-written in `public/sitemap.xml`.
- Plain scoped CSS with the custom properties in `src/styles/global.css`. One accent colour.
- No AI-template look: no purple/blue gradients, glassmorphism, emoji in headings, "Hi, I'm… 👋", hero blobs, fake testimonials or skill-percentage bars.
- No filler copy. Every sentence states a concrete fact, number or tool. Never invent metrics, employers, dates or links; ask the owner if a fact is missing. Project descriptions only state what the repo README shows.
- Lighthouse 95+ in all four categories. No layout shift.
- Fonts: system sans for body, self-hosted IBM Plex Mono (Latin, 400 and 600, `public/fonts/`, about 30KB) for labels, metrics and tool names. Keep total web fonts under 60KB.
- Light and dark mode follow `prefers-color-scheme`, with a manual toggle stored in localStorage. Every storage access is wrapped in try/catch.
- Responsive down to 360px. Semantic HTML, keyboard navigable, visible focus states, alt text.
- No analytics, cookies or trackers.
- Conventional commit messages. No `Co-Authored-By` or any Claude/AI attribution in commits, code comments, README or site footer.

## CSP constraints

`public/_headers` sets a CSP that only allows same-origin scripts and styles. Because of that:

- No inline `<script>` (except `type="application/ld+json"`), no `style="..."` attributes, no `define:vars`.
- Client JS lives in `public/theme.js`, loaded with `<script is:inline src="/theme.js">`.
- `build.inlineStylesheets` is `'never'` in `astro.config.mjs`. Don't change it.
- Dynamic sizes (the metric bars) use SVG attributes, not inline styles.

## Layout of the code

- `src/data/site.ts`: name, links and summary, shared by the head tags, hero and contact.
- `src/layouts/Base.astro`: `<head>` (meta, Open Graph, Twitter card, JSON-LD), header and footer.
- `src/components/`: one component per page section.
- `public/`: `_headers`, `robots.txt`, `sitemap.xml`, `favicon.svg`, fonts, `cv/` (the owner adds the PDF).

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

- Astro's HTML compression drops the whitespace at a line break between text and an inline element. Keep a sentence that mixes text with `<span>`s on one source line (or use `{' '}`), or words run together ("andSNS").
