# syedalihussain.dev

Source for [syedalihussain.dev](https://syedalihussain.dev), the portfolio of Syed Ali Hussain, DevOps Engineer.

A single static page built with [Astro](https://astro.build). It has no client framework, analytics, cookies or third-party requests. Fonts, icons and scripts are all served from the site itself.

## Develop

Requires Node 22.12 or later.

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # writes the static site to dist/
npm run preview  # serves dist/ locally
```

## Project layout

```text
public/
  _headers          Cloudflare Pages security and cache headers
  cv/               Syed-Ali-Hussain-CV.pdf goes here
  fonts/            IBM Plex Sans Condensed 600 and IBM Plex Mono 400/600, Latin subsets (SIL OFL, see OFL.txt)
  theme.js          light/dark toggle, stored in localStorage
  robots.txt, sitemap.xml, favicon.svg
src/
  data/             site.ts (name, links, sections), experience.ts (jobs and results)
  layouts/Base.astro
  components/       one component per section
  styles/global.css design tokens and base styles
```

## Deploy (Cloudflare Pages)

The site deploys from the GitHub repo `frenzyali/syedalihussain.dev`.

| Setting | Value |
| --- | --- |
| Framework preset | Astro |
| Production branch | `main` |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Environment variable | `NODE_VERSION` = `22` |

Steps:

1. In the Cloudflare dashboard, go to **Workers & Pages → Create → Pages → Connect to Git** and pick `frenzyali/syedalihussain.dev`.
2. Enter the settings above and deploy.
3. Under **Custom domains**, add `syedalihussain.dev`.

`public/_headers` is copied to `dist/` and applied by Cloudflare Pages. It sets a same-origin-only Content Security Policy, HSTS, `X-Content-Type-Options`, `Referrer-Policy` and `Permissions-Policy`.

## TODO

- Add a 1200×630 Open Graph image, then add `og:image` and switch the Twitter card to `summary_large_image`.

## Licence

The IBM Plex font files are licensed under the SIL Open Font License 1.1 (`public/fonts/OFL.txt`).
