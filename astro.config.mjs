import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://tomas-samek.github.io',
  trailingSlash: 'always',
  markdown: {
    // Light by default; global.css switches code blocks to the dark theme under prefers-color-scheme: dark.
    shikiConfig: { themes: { light: 'github-light', dark: 'github-dark' } },
  },
});
