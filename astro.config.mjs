// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://syedalihussain.dev',
  output: 'static',
  // The CSP in public/_headers only allows same-origin styles, so never inline them.
  build: { inlineStylesheets: 'never' },
});
