# Portfolio site + profile README refresh — design

- **Date:** 2026-10-06
- **Owner:** Tomáš Samek
- **Status:** Draft, awaiting review

## 1. Goal

Replace the GitHub profile README as the main public presence with a GitHub Pages site at
`https://tomas-samek.github.io/`. The site combines three things:

1. **Landing page:** who I am and what I build now.
2. **Project hub:** every public repo on `tomas-samek`, with hand-picked featured projects.
   Data comes from GitHub, so the hub does not go stale.
3. **Writing:** posts hosted on the site as the canonical source, cross-posted to LinkedIn.

The profile README becomes a short teaser that points to the site.

### Positioning

Independent builder: *"I build whatever I find interesting, and push it until it can't go any faster."*
Work comes first. The Oracle years and the 19 years of Java are background, shown as a side note,
never in the intro.

### Non-goals

- A custom domain. The site launches on `tomas-samek.github.io`; adding a domain later only needs
  a `CNAME` file and a DNS record.
- Showing repos from `@jerry-samek`. That account is linked from `/about` and the README only.
- Comments, analytics, a newsletter, search.
- Client-side JavaScript or a UI framework.
- Generating the README project list automatically.

## 2. Pages and content

| Route | Contents |
|---|---|
| `/` | Intro → featured projects with key results → 3 latest posts → background side note |
| `/projects` | Featured projects in full, then every other public repo, grouped by topic |
| `/writing` | Post list, newest first: title, date, summary |
| `/writing/<slug>` | A single post, in the serif reading layout |
| `/about` | Longer bio, the "Coherence over orthodoxy" quote, background, links |
| `/rss.xml` | RSS feed of non-draft posts |
| `/404` | Not-found page in the site style |

### Intro (home page)

> **Tomáš Samek**
> I build whatever I find interesting, and push it until it can't go any faster.
> Right now: compile-time Java frameworks · GPU rendering in Rust · memory for AI agents ·
> benchmarking how coding agents actually perform.

Background side note (a visually subdued aside, below the posts):

> Background: 19 years of Java, 13 at Oracle on enterprise platform infrastructure:
> real-time search, pluggable persistence, Jakarta EE. Based in Prague.

### Featured projects (launch order)

| # | Repo | Key result line |
|---|---|---|
| 1 | `tiko-di` | On Maven Central · Java 21–27 · [site](https://tomas-samek.github.io/tiko-di/) |
| 2 | `causal-cone-engine` | No rays, no meshes, no lights: light is delivered, not gathered |
| 3 | `llm-framework-benchmark` | Spring Boot 4.0.6: 1 pass in 20 · Tiko 0.5.0: 15/15 |
| 4 | `trie-memory` | Binds words across languages into one concept, append-only, built not to fabricate |

Display order is the order of the `featured` array in config.

### First post

*"Your AI coding agent has a blind spot — and a bigger model doesn't fix it"*, moved from LinkedIn.
Tomáš provides the article text. The site copy is canonical. The LinkedIn copy is linked from the
post's `crosspost` frontmatter field.

## 3. Visual design

Direction **B · Blueprint**, chosen from three mockups.

- Colours copied from `tiko-di/site/style.css` (light and dark, following `prefers-color-scheme`),
  so `/tiko-di/` looks like part of the same site.
- Grid-paper background, monospace labels for navigation and metadata, system sans for UI text.
- **Posts use a serif reading layout:** a narrower text column, Georgia / system serif body,
  more generous line height.
- Fully usable at phone width. No horizontal scrolling.

## 4. Architecture

**Repo:** `tomas-samek/tomas-samek.github.io` (public). The repo name is what puts the site at the
root URL.

**Stack:** Astro, the current stable major (pinned at implementation time), static output, TypeScript,
plain CSS. No UI framework integration.

```
src/
  content/posts/*.md      posts (content collection)
  content.config.ts       post schema
  data/projects.ts        featured / exclude / groups config
  lib/github.ts           fetch + pure transform functions
  layouts/Base.astro      Blueprint shell (nav, footer, theme tokens)
  layouts/Post.astro      serif reading layout
  pages/                  index, projects, writing/index, writing/[...slug], about, rss.xml.ts, 404
  styles/tokens.css       ported tiko-di colour tokens
test/
  github.test.ts          Vitest unit tests against fixtures
  fixtures/repos.json
.github/workflows/deploy.yml
```

### Post schema

| Field | Type | Required | Notes |
|---|---|---|---|
| `title` | string | yes | |
| `date` | date | yes | Published date |
| `summary` | string | yes | Used in lists, RSS, and meta description |
| `draft` | boolean | no, default `false` | Drafts are excluded from production builds and RSS |
| `crosspost` | URL | no | Link to the LinkedIn copy, shown as "Also on LinkedIn" |

Each post emits `<link rel="canonical">` pointing at its own site URL.

### Project config (`src/data/projects.ts`)

```ts
export const featured = [
  { repo: 'tiko-di', blurb: '…', keyResult: '…' },
  { repo: 'causal-cone-engine', blurb: '…', keyResult: '…' },
  { repo: 'llm-framework-benchmark', blurb: '…', keyResult: '…' },
  { repo: 'trie-memory', blurb: '…', keyResult: '…' },
];
export const exclude = ['tomas-samek', 'tomas-samek.github.io'];
export const groups: Record<string, string> = { 'pet-project': 'Experiments' }; // topic → section title
```

`blurb` is 1–2 sentences written in Phase 2 from each repo's README. `keyResult` uses the lines in
the §2 featured table.

### Data flow (build time)

1. `github.ts` calls `GET https://api.github.com/users/tomas-samek/repos?type=owner&per_page=100`,
   authenticated with `GITHUB_TOKEN` when it is set (local builds may run without it).
2. **Filter:** drop forks, archived repos, private repos, and `exclude` entries.
3. **Merge featured:** for each `featured` entry, attach live fields (description, language, stars,
   homepage, topics, `pushed_at`) to the configured blurb and key result.
4. **Group the rest:** every non-featured repo goes into the first group whose topic it carries.
   Otherwise it goes into "Other". Within a group, sort by `pushed_at`, newest first.

Steps 2–4 are pure functions taking the raw API JSON. They are tested without network access.

### Error handling

- **API call fails (network, non-2xx, rate limit):** the build fails with the HTTP status in the message.
  GitHub Pages keeps serving the last successful deployment, so a failure never publishes an empty hub.
- **A featured repo is missing from the response** (renamed or made private): the build fails and
  names the repo.
- **A post's frontmatter is invalid:** the content-collection schema fails the build.

### Deployment (`.github/workflows/deploy.yml`)

- **Triggers:**
  - `push` to `main`;
  - `schedule` nightly (03:00 UTC);
  - `workflow_dispatch`;
  - `pull_request` (build and checks only, no deploy).
- **Steps:**
  1. install;
  2. `astro check`;
  3. `vitest run`;
  4. `astro build`;
  5. link check on `dist/`;
  6. upload the Pages artifact;
  7. `actions/deploy-pages`.
- Pages source is set to **GitHub Actions** in the repo settings.

## 5. Profile README (`tomas-samek/tomas-samek`)

Rewritten as a short teaser:

- Greeting and the one-line positioning.
- Site link (added in Phase 3).
- "Now" list: the 4 featured repos in the same order as the site, one or two lines each.
- Background and the `@jerry-samek` pointer in `<sub>`.
- Footer links: Site · LinkedIn.

The quote moves to `/about`. The README list is maintained by hand.

## 6. Rollout

| Phase | Work | Blocked by |
|---|---|---|
| 1 | Rewrite the README (§5) **without** the site link. Add `.superpowers/` to `.gitignore`. Push. | — |
| 2 | Create the site repo, implement §2–§4, enable Pages (Actions source), deploy. Move this spec into the site repo and remove it from the profile repo. | Article text for the first post. If it is late, launch with the Writing nav hidden and add the post afterwards |
| 3 | Add the site link to the README. Set the `homepage` field on `tomas-samek/tomas-samek`, `causal-cone-engine`, `llm-framework-benchmark`, `trie-memory`. Tomáš re-shares the post on LinkedIn, linking back to the site. | Phase 2 live |

## 7. Acceptance criteria

- `https://tomas-samek.github.io/` serves the home page with the intro, the 4 featured projects
  in the order above, and the latest posts.
- `https://tomas-samek.github.io/tiko-di/` still works.
- A new public repo created on `tomas-samek` appears on `/projects` after the next nightly build,
  with no commit.
- The blind-spot post renders in the serif layout, has a canonical tag pointing at its own URL,
  and appears in `/rss.xml`.
- Light and dark themes both render correctly. No horizontal scrolling at 375px width.
- CI fails on a missing featured repo, invalid post frontmatter, or a broken internal link.
- The profile README contains no Oracle reference outside the `<sub>` background line.
