# tomas-samek.github.io

Source for **https://tomas-samek.github.io/**: landing page, project hub, and writing.

A static [Astro](https://astro.build/) site. No client-side JavaScript, no UI framework. The project
hub is built from the GitHub API at build time, and a nightly rebuild keeps it current without commits.

## Run it locally

Needs Node `>=22.12`, preferably the latest 24.x (see [Known issues](#known-issues)).

```bash
npm ci
npm run dev                                   # http://localhost:4321, drafts visible
GITHUB_TOKEN=$(gh auth token) npm run build   # → dist/
npm run preview                               # serve dist/
```

`GITHUB_TOKEN` is optional, but without it the build uses the anonymous GitHub API limit (60 requests/hour)
and fails with "rate limited; set GITHUB_TOKEN" once that's used up.

| Script | What it does |
|---|---|
| `npm run check` | Type-checks `.astro` and `.ts` files (`astro check`) |
| `npm test` | Vitest unit tests for the repo filter/merge/group logic and post helpers |
| `npm run build` | Static build into `dist/` |
| `npm run links` | Crawls `dist/` and fails on any broken internal link (external links are skipped) |

CI runs all four, in that order, on every push and pull request.

## Write a post

Add `src/content/posts/<slug>.md`. The file name becomes the URL: `/writing/<slug>/`.

```markdown
---
title: "Your post title"
date: 2026-10-06
summary: "One or two sentences. Used in lists, RSS, the meta description and the social preview."
draft: true            # optional; drafts show only under `npm run dev`, never in production or RSS
crosspost: "https://www.linkedin.com/pulse/..."   # optional; renders "Also on LinkedIn"
---

Markdown body.
```

- Images go in `public/writing/<slug>/` and are referenced as `/writing/<slug>/<file>`.
- The **Writing** nav link, the home page's Writing section and the RSS link appear only once at least
  one non-draft post exists.
- Every page links to itself with `<link rel="canonical">`, so the site copy is the original when a post
  is cross-posted.
- `src/content/posts/draft-example.md` is a permanent draft that shows the format. Leave it as a draft.

## Projects

Edit `src/data/projects.ts`:

- **`featured`**: repos shown on the home page and at the top of `/projects/`, **in array order**, each with
  a hand-written `blurb`, an optional `keyResult` line, and a `visual` (`mark`, `hue`, banner `tagline`; see
  [Project marks and banners](#project-marks-and-banners)). The build **fails** if a featured repo is missing,
  renamed, archived, forked or made private, and the error names it. Fix the config rather than letting
  a project silently drop off the landing page.
- **`exclude`**: repos that are never shown (the profile README repo and this repo).
- **`groups`**: topic → section title for every other public repo. The first topic in config order wins;
  repos with no matching topic go under "Other". New public repos appear on `/projects/` after the next build.

Live data (description, language, stars, homepage, topics) comes from GitHub. A featured entry can set
`language` when GitHub reports none or the wrong one (tdm-demo holds only its WebAssembly build). Star counts
below 10 are not shown. A repo homepage pointing at
this site's root is hidden, so cards don't show a "site →" link back to the portfolio itself. Only absolute
`http(s)` homepages are shown.

### Project marks and banners

Each featured project has a mark (a small line drawing) and a hue, defined once in `src/data/marks.ts`:

| Repo | Mark | Hue |
|---|---|---|
| tiko-di | `graph`: a hub wired to its dependencies | teal |
| causal-cone-engine | `cone`: wavefronts reaching a receptor plane | amber |
| llm-framework-benchmark | `bars`: a full bar that passes, an empty one that fails | violet |
| trie-memory | `trie`: a trie with one dashed "Unknown" node | rose |
| tdm-demo | `nucleus`: a core with connectors reaching out to its bonds | emerald |

Cards show the mark large and faded in a tinted, textured header strip. Auto-discovered repos get the
neutral `repo` mark on `slate`. Every hue meets WCAG AA contrast in both themes (`test/marks.test.ts`);
featured projects must use distinct marks and hues.

The build also writes a README banner per featured project and theme (`src/lib/banner.ts`), served at
`https://tomas-samek.github.io/banners/<light|dark>/<repo>.svg`. Each project README embeds them with:

```html
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://tomas-samek.github.io/banners/dark/<repo>.svg">
  <img alt="<repo>: <tagline>" src="https://tomas-samek.github.io/banners/light/<repo>.svg" width="100%">
</picture>
```

So a change to a mark, hue or tagline reaches the READMEs on the next deploy, with no commits in those repos.

Small 48×48 mark tiles are served the same way at `https://tomas-samek.github.io/marks/<light|dark>/<repo>.svg`
(`markTileSvg`). The profile README (`tomas-samek/tomas-samek`) uses them as list icons.

## Deploy

`.github/workflows/deploy.yml` builds and deploys to GitHub Pages (Settings → Pages → Source:
**GitHub Actions**). It runs on:

- push to `main`: check, test, build, link check, deploy;
- nightly at 03:00 UTC, to pick up new repos and star counts;
- manual runs (`gh workflow run deploy.yml`), which deploy only when run on `main`;
- pull requests and manual runs on other branches: build and checks only, no deploy.

If the GitHub API or any check fails, nothing is deployed and the previous version stays live.

GitHub disables scheduled workflows after 60 days without repository activity. The `keepalive` job
re-enables the workflow on every scheduled or manual run to reset that timer. If you ever get GitHub's
"scheduled workflow disabled" email, re-enable it under Actions and run it once manually.

## Share image

`public/og.png` (1200×630) is the Open Graph / LinkedIn preview image for every page. Its source is
`scripts/og-card.html`. After editing that file, regenerate the PNG with headless Chrome:

```bash
chrome --headless=new --hide-scrollbars --window-size=1200,630 \
  --screenshot="$PWD/public/og.png" "file://$PWD/scripts/og-card.html"
```

(On Windows use the full path to `chrome.exe` and Windows-style paths, e.g. via `cygpath`.)

## Layout

```
src/
  content/posts/        posts (Markdown content collection; schema in src/content.config.ts)
  data/projects.ts      featured / exclude / groups
  lib/github.ts         GitHub API fetch + pure filter/merge/group functions (unit-tested)
  lib/load-projects.ts  one API round-trip per build, shared by all pages
  lib/posts.ts          draft filtering, date formatting (unit-tested)
  layouts/              Base (site shell, meta tags), Post (serif reading layout)
  components/           ProjectCard, PostList
  pages/                /, /projects/, /writing/, /writing/<slug>/, /about/, /rss.xml, 404
  styles/               tokens.css (shared with tiko-di's site), global.css
test/                   Vitest suites + a real-shaped GitHub API fixture
scripts/og-card.html    source of public/og.png
docs/superpowers/       original design spec and implementation plan
```

## Known issues

- **Node 24.11.1 on Windows** exits with code 127 (libuv `UV_HANDLE_CLOSING` assertion) after any build that
  fetches from the network, even though the build itself completes. Node 24.21.0 doesn't, so upgrade
  (`nvm install 24.21.0`). CI is unaffected.
