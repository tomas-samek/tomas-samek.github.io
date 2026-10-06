# Portfolio Site + Profile README Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a GitHub Pages site at `https://tomas-samek.github.io/` with a landing page, a project hub generated from GitHub data, and a writing section. Cut the profile README down to a teaser that points to it.

**Architecture:** A new repo, `tomas-samek/tomas-samek.github.io`, holds a static Astro 7 site. At build time it fetches `GET /users/tomas-samek/repos`. Pure, unit-tested functions filter that data, merge it with a hand-written featured list, and group the rest. Posts are a Markdown content collection. A single GitHub Actions workflow checks, tests, builds, link-checks and deploys on every push, every night, and on manual runs. Pull requests build but don't deploy.

**Tech Stack:**
- Astro 7.3.6, `@astrojs/rss` 4.0.19, TypeScript 6.0.3
- `@astrojs/check` 0.9.10, Vitest 5.0.3, linkinator 8.1.0
- Node 24
- GitHub Actions + GitHub Pages

**Spec:** `docs/superpowers/specs/2026-10-06-portfolio-site-design.md`. Until Task 13 it lives in the `tomas-samek/tomas-samek` repo on branch `portfolio-site`; Task 13 moves it into the site repo.

## Global Constraints

- **Local paths:**
  - Profile repo main checkout: `W:/workspace/tomas-samek` (stays on branch `portfolio-site`, where this plan lives).
  - Profile repo `main` worktree: `W:/workspace/tomas-samek-main` (created in Task 1).
  - Site repo: `W:/workspace/tomas-samek.github.io`.
- **Pinned versions, exact, no `^`:**
  - `astro@7.3.6`, `@astrojs/rss@4.0.19`
  - `@astrojs/check@0.9.10`, `typescript@6.0.3` (`@astrojs/check` requires TS `^5 || ^6`; do **not** use TS 7)
  - `vitest@5.0.3`, `linkinator@8.1.0`, `@types/node@24.19.1`
  - Node `>=22.12.0`; CI uses Node 24.
- **Static output only:**
  - No client-side JavaScript.
  - No UI framework integration.
  - No external fonts, CDNs or analytics.
- **Astro config:**
  - `site: 'https://tomas-samek.github.io'`, `trailingSlash: 'always'`.
  - Every internal link ends in `/` (except `/rss.xml` and `/favicon.svg`).
- **Intro copy (verbatim from spec §2):**
  - Pitch: "I build whatever I find interesting, and push it until it can't go any faster."
  - Support line: "Right now: compile-time Java frameworks · GPU rendering in Rust · memory for AI agents · benchmarking how coding agents actually perform."
- **Oracle / "19 years" may appear only in:**
  - the home page background side note,
  - `/about`,
  - the README `<sub>` line.
- **Featured order:** `tiko-di`, `causal-cone-engine`, `llm-framework-benchmark`, `trie-memory`.
- **Visual direction:** Blueprint.
  - Colour tokens copied from `tiko-di/site/style.css` (light + dark through `prefers-color-scheme`).
  - Posts use a serif reading layout.
  - No horizontal scroll at 375px.
- **Commits:** every commit message ends with:
  ```
  Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
  ```
- **Outward-facing steps need explicit user confirmation at execution time:**
  - any `git push`;
  - `gh repo create`;
  - enabling Pages;
  - `gh repo edit`.

  Stop and ask before each one. Approval of the plan does not count.
- **Spec gap resolved here:** spec §6 Phase 3 sets the `homepage` of three repos, but doesn't say to what. This plan sets it to `https://tomas-samek.github.io/`. The project code treats a homepage pointing at the site root as self-referential and hides it, so cards don't show a circular "site →" link (Task 3).

## Review Focus

1. **A repo with a `null`, `""` or whitespace-only description or homepage** (`causal-cone-engine` has `homepage: null` today). The card shows no empty paragraph and no "site →" link to `""`. Pinned in Task 3 (`toProject` normalisation test).
2. **A featured repo that gets archived, forked or made private later.** It's treated as missing and the build fails, naming it. It is never silently dropped from the landing page. Pinned in Task 3 (archived-featured test).
3. **More than 100 public repos.** All pages are fetched, not just the first 100. Pinned in Task 4 (pagination test).
4. **A local build without `GITHUB_TOKEN` that hits the anonymous rate limit (HTTP 403/429).** The error tells you to set `GITHUB_TOKEN` instead of just showing "403". Pinned in Task 4.
5. **A repo whose topics match several groups, or a config name in different case** (`Tiko-DI` vs `tiko-di`). Grouping follows config order, not the order of the repo's topics, and name matching ignores case. Pinned in Task 3.

---

## Phase 1 — Profile README

### Task 1: Rewrite the profile README (no site link yet)

**Files:**
- Create worktree: `W:/workspace/tomas-samek-main` (branch `main` of `tomas-samek/tomas-samek`)
- Modify: `W:/workspace/tomas-samek-main/README.md` (full rewrite)
- Create: `W:/workspace/tomas-samek-main/.gitignore`

**Interfaces:**
- Consumes: nothing.
- Produces: README on `main`. Task 14 adds the site link to it.

The plan and spec live on branch `portfolio-site`, so the README work is done in a separate worktree on `main`. That keeps this plan readable in the main checkout.

- [ ] **Step 1: Create the worktree**

```bash
cd W:/workspace/tomas-samek
git fetch origin
git worktree add W:/workspace/tomas-samek-main main
cd W:/workspace/tomas-samek-main && git status --short && git log --oneline -1
```
Expected: a clean tree, HEAD at `14150cd profile: refresh tiko ...` (or later if `origin/main` moved; then run `git pull --ff-only`).

- [ ] **Step 2: Replace `README.md` with exactly this content**

```markdown
## Hi, I'm Tomáš 👋

I build whatever I find interesting, and push it until it can't go any faster.

### Now

- 🔧 **[tiko-di](https://github.com/tomas-samek/tiko-di)** — compile-time orchestrator for Java 21+.
  DI + event bus, no reflection, nothing wrapped. On Maven Central · [site](https://tomas-samek.github.io/tiko-di/)
- 🌌 **[causal-cone-engine](https://github.com/tomas-samek/causal-cone-engine)** — experimental GPU renderer
  in Rust + wgpu. No rays, no meshes, no lights: light is delivered, not gathered.
- 📊 **[llm-framework-benchmark](https://github.com/tomas-samek/llm-framework-benchmark)** — can AI coding
  agents build the same spec on different stacks? Spring Boot 4.0.6: 1 pass in 20 · Tiko 0.5.0: 15/15.
- 🧠 **[trie-memory](https://github.com/tomas-samek/trie-memory)** — experimental MCP memory server in Rust.
  Binds words across languages into one concept, append-only, built not to fabricate.

<sub>Background: 19 years of Java, 13 of them at Oracle on enterprise platform infrastructure. Based in Prague.
Side experiments live at [@jerry-samek](https://github.com/jerry-samek).</sub>

[LinkedIn](https://linkedin.com/in/tomassamek)
```

- [ ] **Step 3: Create `.gitignore`**

```gitignore
.superpowers/
```

- [ ] **Step 4: Verify the content rules**

```bash
cd W:/workspace/tomas-samek-main
grep -c "github.com/tomas-samek/" README.md          # expect 4 (one per featured repo)
grep -n "Oracle" README.md                            # expect exactly 1 line, starting with <sub>
grep -n "tomas-samek.github.io" README.md             # expect only the tiko-di /tiko-di/ link
grep -n "Coherence" README.md                         # expect no output (quote moved to /about)
```
Expected: matches the comments above. Then read the rendered preview (VS Code Markdown preview or `gh markdown-preview` if installed) and check that the four list items show as a bulleted list.

- [ ] **Step 5: Commit**

```bash
cd W:/workspace/tomas-samek-main
git add README.md .gitignore
git commit -m "profile: work-first README covering all public repos

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

- [ ] **Step 6: Push (ASK THE USER FIRST)**

After the user confirms:
```bash
cd W:/workspace/tomas-samek-main && git push origin main
```
Expected: `main -> main`. Check that `https://github.com/tomas-samek` shows the new README.

---

## Phase 2 — Site repo

### Task 2: Scaffold the Astro project

**Files (all under `W:/workspace/tomas-samek.github.io`):**
- Create: `package.json`, `package-lock.json` (generated), `astro.config.mjs`, `tsconfig.json`, `.gitignore`, `src/pages/index.astro` (temporary; replaced in Task 7)

**Interfaces:**
- Consumes: nothing.
- Produces:
  - npm scripts `dev`, `build`, `preview`, `check`, `test`, `links`;
  - `site` and `trailingSlash` config, which every later task relies on.

- [ ] **Step 1: Create the folder and `package.json`**

```bash
mkdir -p W:/workspace/tomas-samek.github.io && cd W:/workspace/tomas-samek.github.io && git init -b main
```

`package.json`:
```json
{
  "name": "tomas-samek.github.io",
  "type": "module",
  "private": true,
  "engines": { "node": ">=22.12.0" },
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "check": "astro check",
    "test": "vitest run",
    "links": "linkinator dist"
  }
}
```

- [ ] **Step 2: Install the pinned dependencies**

```bash
cd W:/workspace/tomas-samek.github.io
npm install -E astro@7.3.6 @astrojs/rss@4.0.19
npm install -E -D @astrojs/check@0.9.10 typescript@6.0.3 vitest@5.0.3 linkinator@8.1.0 @types/node@24.19.1
```
Expected: no peer-dependency errors. `package.json` now lists the exact versions without `^`.

- [ ] **Step 3: Create `astro.config.mjs`**

```js
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://tomas-samek.github.io',
  trailingSlash: 'always',
});
```

- [ ] **Step 4: Create `tsconfig.json`**

```json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist", "node_modules"]
}
```
Astro's base preset sets `verbatimModuleSyntax: true`, so type-only imports must use `import type` or an inline `type`. All code in this plan already does. It also sets `resolveJsonModule: true`. It doesn't set `types`, so `@types/node` (used for `process.env`) is picked up automatically.

- [ ] **Step 5: Create `.gitignore`**

```gitignore
node_modules/
dist/
.astro/
.env
.superpowers/
```

- [ ] **Step 6: Create a temporary `src/pages/index.astro`**

```astro
---
---
<html lang="en">
  <head><meta charset="utf-8" /><title>Tomáš Samek</title></head>
  <body><p>Site under construction.</p></body>
</html>
```

- [ ] **Step 7: Check and build**

```bash
cd W:/workspace/tomas-samek.github.io && npm run check && npm run build
```
Expected: `astro check` reports `0 errors`, and the build writes `dist/index.html`.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "chore: scaffold Astro 7 site

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 3: Pure GitHub repo transforms

**Files:**
- Create: `src/lib/github.ts`
- Test: `test/github.test.ts`, `test/fixtures/repos.json`

**Interfaces:**
- Consumes: nothing.
- Produces (exported from `src/lib/github.ts`):
  ```ts
  interface GhRepo { name: string; html_url: string; description: string | null; homepage: string | null;
    language: string | null; stargazers_count: number; topics?: string[]; pushed_at: string;
    fork: boolean; archived: boolean; private: boolean }
  interface Project { name: string; url: string; description: string | null; homepage: string | null;
    language: string | null; stars: number; topics: string[]; pushedAt: string }
  interface FeaturedConfig { repo: string; blurb: string; keyResult?: string }
  interface FeaturedProject extends Project { blurb: string; keyResult?: string }
  interface ProjectGroup { title: string; projects: Project[] }
  const SITE_ROOT = 'https://tomas-samek.github.io/'
  const OTHER_GROUP = 'Other'
  function toProject(r: GhRepo): Project
  function filterRepos(repos: readonly GhRepo[], exclude: readonly string[]): GhRepo[]
  function mergeFeatured(repos: readonly GhRepo[], featured: readonly FeaturedConfig[]): FeaturedProject[]  // throws Error naming missing repos
  function groupRest(repos: readonly GhRepo[], featuredNames: readonly string[], groups: Readonly<Record<string, string>>): ProjectGroup[]
  ```

- [ ] **Step 1: Write the fixture `test/fixtures/repos.json`**

This is real API data from 2026-10-06, trimmed to the fields the code uses:
```json
[
  { "name": "tiko-di", "html_url": "https://github.com/tomas-samek/tiko-di", "description": "Compile-time orchestrator for Java 21+ — direct access, compile-time safe, nothing wrapped.", "homepage": "https://tomas-samek.github.io/tiko-di/", "language": "Java", "stargazers_count": 3, "topics": ["annotation-processor", "compile-time", "dependency-injection", "java-21"], "pushed_at": "2026-10-05T18:55:40Z", "fork": false, "archived": false, "private": false },
  { "name": "causal-cone-engine", "html_url": "https://github.com/tomas-samek/causal-cone-engine", "description": "My pet project: an experimental GPU renderer where the observer swims through a persistent 3D diff field — no rays, no meshes, no lights. Written in Rust + wgpu.", "homepage": null, "language": "Rust", "stargazers_count": 0, "topics": ["gpu", "pet-project", "rust", "wgpu"], "pushed_at": "2026-09-22T05:30:15Z", "fork": false, "archived": false, "private": false },
  { "name": "llm-framework-benchmark", "html_url": "https://github.com/tomas-samek/llm-framework-benchmark", "description": "Can an AI coding agent build the same framework-neutral spec on different stacks? External-oracle-graded benchmark. First: Spring Boot vs Tiko DI.", "homepage": null, "language": "Java", "stargazers_count": 0, "topics": ["benchmark", "llm", "spring-boot", "tiko"], "pushed_at": "2026-08-15T14:08:07Z", "fork": false, "archived": false, "private": false },
  { "name": "tomas-samek", "html_url": "https://github.com/tomas-samek/tomas-samek", "description": "", "homepage": "", "language": null, "stargazers_count": 0, "topics": ["java", "rust"], "pushed_at": "2026-06-13T17:55:33Z", "fork": false, "archived": false, "private": false },
  { "name": "trie-memory", "html_url": "https://github.com/tomas-samek/trie-memory", "description": "Experimental MCP memory server pairing a delta-encoded recognition trie with a concept store.", "homepage": "", "language": "Rust", "stargazers_count": 0, "topics": ["mcp", "memory", "rust", "trie"], "pushed_at": "2026-04-24T16:45:53Z", "fork": false, "archived": false, "private": false }
]
```

- [ ] **Step 2: Write the failing tests in `test/github.test.ts`**

```ts
import { describe, it, expect } from 'vitest';
import fixture from './fixtures/repos.json';
import {
  filterRepos,
  groupRest,
  mergeFeatured,
  toProject,
  OTHER_GROUP,
  type GhRepo,
} from '../src/lib/github';

function repo(overrides: Partial<GhRepo> & { name: string }): GhRepo {
  return {
    html_url: `https://github.com/tomas-samek/${overrides.name}`,
    description: 'desc',
    homepage: null,
    language: 'Java',
    stargazers_count: 0,
    topics: [],
    pushed_at: '2026-01-01T00:00:00Z',
    fork: false,
    archived: false,
    private: false,
    ...overrides,
  };
}

describe('toProject', () => {
  it('maps API fields to project fields', () => {
    const p = toProject(
      repo({ name: 'x', homepage: 'https://x.dev/', stargazers_count: 3, topics: ['a'], pushed_at: '2026-05-01T00:00:00Z' }),
    );
    expect(p).toEqual({
      name: 'x',
      url: 'https://github.com/tomas-samek/x',
      description: 'desc',
      homepage: 'https://x.dev/',
      language: 'Java',
      stars: 3,
      topics: ['a'],
      pushedAt: '2026-05-01T00:00:00Z',
    });
  });

  it('normalises empty or whitespace description and homepage to null', () => {
    const p = toProject(repo({ name: 'x', description: '   ', homepage: '' }));
    expect(p.description).toBeNull();
    expect(p.homepage).toBeNull();
    expect(toProject(repo({ name: 'y', description: null, homepage: null })).homepage).toBeNull();
  });

  it('drops a homepage that points at this site root (self-referential)', () => {
    expect(toProject(repo({ name: 'x', homepage: 'https://tomas-samek.github.io/' })).homepage).toBeNull();
    expect(toProject(repo({ name: 'x', homepage: 'https://tomas-samek.github.io' })).homepage).toBeNull();
    expect(toProject(repo({ name: 'x', homepage: 'https://tomas-samek.github.io/tiko-di/' })).homepage).toBe(
      'https://tomas-samek.github.io/tiko-di/',
    );
  });

  it('treats missing topics as an empty list', () => {
    const { topics: _omit, ...noTopics } = repo({ name: 'x' });
    expect(toProject(noTopics as GhRepo).topics).toEqual([]);
  });
});

describe('filterRepos', () => {
  it('drops forks, archived, private and excluded repos (exclude is case-insensitive)', () => {
    const repos = [
      repo({ name: 'keep' }),
      repo({ name: 'forked', fork: true }),
      repo({ name: 'old', archived: true }),
      repo({ name: 'secret', private: true }),
      repo({ name: 'Tomas-Samek' }),
    ];
    expect(filterRepos(repos, ['tomas-samek']).map((r) => r.name)).toEqual(['keep']);
  });
});

describe('mergeFeatured', () => {
  const repos = [repo({ name: 'b', stargazers_count: 2 }), repo({ name: 'a' })];

  it('returns featured projects in config order with blurb and key result attached', () => {
    const out = mergeFeatured(repos, [
      { repo: 'a', blurb: 'A blurb', keyResult: 'A result' },
      { repo: 'b', blurb: 'B blurb' },
    ]);
    expect(out.map((p) => p.name)).toEqual(['a', 'b']);
    expect(out[0]).toMatchObject({ blurb: 'A blurb', keyResult: 'A result' });
    expect(out[1]).toMatchObject({ blurb: 'B blurb', stars: 2 });
    expect(out[1]?.keyResult).toBeUndefined();
  });

  it('matches config names case-insensitively', () => {
    expect(mergeFeatured(repos, [{ repo: 'A', blurb: 'x' }])[0]?.name).toBe('a');
  });

  it('throws naming every missing featured repo', () => {
    expect(() =>
      mergeFeatured(repos, [
        { repo: 'a', blurb: 'x' },
        { repo: 'gone', blurb: 'x' },
        { repo: 'also-gone', blurb: 'x' },
      ]),
    ).toThrow(/gone, also-gone/);
  });

  it('treats a featured repo that was archived as missing (fails, never silently drops)', () => {
    const filtered = filterRepos([repo({ name: 'a', archived: true }), repo({ name: 'b' })], []);
    expect(() => mergeFeatured(filtered, [{ repo: 'a', blurb: 'x' }])).toThrow(/\ba\b/);
  });
});

describe('groupRest', () => {
  const groups = { 'pet-project': 'Experiments', tool: 'Tools' };

  it('skips featured repos and buckets the rest by the first matching group in config order', () => {
    const repos = [
      repo({ name: 'feat', topics: ['tool'] }),
      repo({ name: 'both', topics: ['tool', 'pet-project'] }),
      repo({ name: 'tooly', topics: ['tool'] }),
      repo({ name: 'misc', topics: ['other'] }),
    ];
    const out = groupRest(repos, ['FEAT'], groups);
    expect(out.map((g) => g.title)).toEqual(['Experiments', 'Tools', OTHER_GROUP]);
    expect(out[0]?.projects.map((p) => p.name)).toEqual(['both']);
    expect(out[1]?.projects.map((p) => p.name)).toEqual(['tooly']);
    expect(out[2]?.projects.map((p) => p.name)).toEqual(['misc']);
  });

  it('omits empty groups and sorts each group by last push, newest first', () => {
    const repos = [
      repo({ name: 'older', pushed_at: '2026-01-01T00:00:00Z' }),
      repo({ name: 'newer', pushed_at: '2026-06-01T00:00:00Z' }),
    ];
    const out = groupRest(repos, [], groups);
    expect(out).toHaveLength(1);
    expect(out[0]?.title).toBe(OTHER_GROUP);
    expect(out[0]?.projects.map((p) => p.name)).toEqual(['newer', 'older']);
  });

  it('returns no groups when everything is featured', () => {
    expect(groupRest([repo({ name: 'a' })], ['a'], groups)).toEqual([]);
  });
});

describe('real-shaped fixture', () => {
  it('excludes the profile repo, merges the four featured repos in order, leaves nothing over', () => {
    const repos = filterRepos(fixture as GhRepo[], ['tomas-samek', 'tomas-samek.github.io']);
    const featured = ['tiko-di', 'causal-cone-engine', 'llm-framework-benchmark', 'trie-memory'];
    const merged = mergeFeatured(repos, featured.map((repo) => ({ repo, blurb: repo })));
    expect(merged.map((p) => p.name)).toEqual(featured);
    expect(merged.find((p) => p.name === 'trie-memory')?.homepage).toBeNull();
    expect(groupRest(repos, featured, { 'pet-project': 'Experiments' })).toEqual([]);
  });
});
```

- [ ] **Step 3: Run the tests and confirm they fail**

Run: `cd W:/workspace/tomas-samek.github.io && npx vitest run test/github.test.ts`
Expected: FAIL, because `../src/lib/github` can't be resolved.

- [ ] **Step 4: Implement `src/lib/github.ts`**

```ts
/** Shape of one entry from GET /users/{user}/repos (only the fields we use). */
export interface GhRepo {
  name: string;
  html_url: string;
  description: string | null;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  topics?: string[];
  pushed_at: string;
  fork: boolean;
  archived: boolean;
  private: boolean;
}

export interface Project {
  name: string;
  url: string;
  description: string | null;
  homepage: string | null;
  language: string | null;
  stars: number;
  topics: string[];
  pushedAt: string;
}

export interface FeaturedConfig {
  repo: string;
  blurb: string;
  keyResult?: string;
}

export interface FeaturedProject extends Project {
  blurb: string;
  keyResult?: string;
}

export interface ProjectGroup {
  title: string;
  projects: Project[];
}

/** A repo homepage pointing here would render as a circular "site →" link. */
export const SITE_ROOT = 'https://tomas-samek.github.io/';
export const OTHER_GROUP = 'Other';

const key = (name: string) => name.toLowerCase();
const blankToNull = (s: string | null) => (s && s.trim() ? s.trim() : null);

function normaliseHomepage(homepage: string | null): string | null {
  const h = blankToNull(homepage);
  if (h === null) return null;
  const withSlash = h.endsWith('/') ? h : `${h}/`;
  return withSlash === SITE_ROOT ? null : h;
}

export function toProject(r: GhRepo): Project {
  return {
    name: r.name,
    url: r.html_url,
    description: blankToNull(r.description),
    homepage: normaliseHomepage(r.homepage),
    language: r.language,
    stars: r.stargazers_count,
    topics: r.topics ?? [],
    pushedAt: r.pushed_at,
  };
}

export function filterRepos(repos: readonly GhRepo[], exclude: readonly string[]): GhRepo[] {
  const excluded = new Set(exclude.map(key));
  return repos.filter((r) => !r.fork && !r.archived && !r.private && !excluded.has(key(r.name)));
}

export function mergeFeatured(repos: readonly GhRepo[], featured: readonly FeaturedConfig[]): FeaturedProject[] {
  const byName = new Map(repos.map((r) => [key(r.name), r]));
  const missing = featured.filter((f) => !byName.has(key(f.repo))).map((f) => f.repo);
  if (missing.length > 0) {
    throw new Error(
      `Featured repo(s) not found among public, non-fork, non-archived repos: ${missing.join(', ')}. ` +
        'Renamed, archived or made private? Update src/data/projects.ts.',
    );
  }
  return featured.map((f) => ({
    ...toProject(byName.get(key(f.repo))!),
    blurb: f.blurb,
    keyResult: f.keyResult,
  }));
}

export function groupRest(
  repos: readonly GhRepo[],
  featuredNames: readonly string[],
  groups: Readonly<Record<string, string>>,
): ProjectGroup[] {
  const featured = new Set(featuredNames.map(key));
  const groupEntries = Object.entries(groups);
  const buckets = new Map<string, Project[]>();

  for (const r of repos) {
    if (featured.has(key(r.name))) continue;
    const topics = r.topics ?? [];
    const match = groupEntries.find(([topic]) => topics.includes(topic));
    const title = match ? match[1] : OTHER_GROUP;
    const bucket = buckets.get(title) ?? [];
    bucket.push(toProject(r));
    buckets.set(title, bucket);
  }

  const titleOrder = [...new Set(groupEntries.map(([, title]) => title)), OTHER_GROUP];
  return titleOrder
    .filter((title) => buckets.has(title))
    .map((title) => ({
      title,
      projects: buckets.get(title)!.sort((a, b) => b.pushedAt.localeCompare(a.pushedAt)),
    }));
}
```

- [ ] **Step 5: Run the tests and confirm they pass**

Run: `npx vitest run test/github.test.ts`
Expected: PASS, all tests green.

- [ ] **Step 6: Type-check**

Run: `npm run check`
Expected: `0 errors`. The JSON fixture import works because the Astro preset enables `resolveJsonModule`.

- [ ] **Step 7: Commit**

```bash
git add src/lib/github.ts test/
git commit -m "feat: pure GitHub repo filter/merge/group transforms

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 4: Fetching from the API, project config, and the build-time loader

**Files:**
- Modify: `src/lib/github.ts` (append `fetchRepos`)
- Create: `src/data/projects.ts`, `src/lib/load-projects.ts`
- Test: `test/fetch-repos.test.ts`

**Interfaces:**
- Consumes: `GhRepo`, `FeaturedConfig`, `FeaturedProject`, `ProjectGroup`, `filterRepos`, `mergeFeatured`, `groupRest` from Task 3.
- Produces:
  ```ts
  // src/lib/github.ts
  function fetchRepos(user: string, token?: string, fetchImpl?: typeof fetch): Promise<GhRepo[]>
  // src/data/projects.ts
  const featured: readonly FeaturedConfig[]; const exclude: readonly string[]; const groups: Readonly<Record<string, string>>
  // src/lib/load-projects.ts
  function loadProjects(): Promise<{ featured: FeaturedProject[]; groups: ProjectGroup[] }>  // memoised per build
  ```

- [ ] **Step 1: Write the failing tests in `test/fetch-repos.test.ts`**

```ts
import { describe, it, expect, vi } from 'vitest';
import { fetchRepos, type GhRepo } from '../src/lib/github';

const one = (name: string) => ({ name }) as GhRepo;
const page = (n: number, prefix: string) => Array.from({ length: n }, (_, i) => one(`${prefix}${i}`));
const ok = (body: unknown) => new Response(JSON.stringify(body), { status: 200 });

describe('fetchRepos', () => {
  it('requests owner repos, 100 per page, with auth header when a token is given', async () => {
    const fetchImpl = vi.fn<typeof fetch>(async () => ok([one('a')]));
    await fetchRepos('tomas-samek', 'tok', fetchImpl);
    const [url, init] = fetchImpl.mock.calls[0]!;
    expect(String(url)).toBe('https://api.github.com/users/tomas-samek/repos?type=owner&per_page=100&page=1');
    expect((init?.headers as Record<string, string>).Authorization).toBe('Bearer tok');
  });

  it('sends no Authorization header without a token', async () => {
    const fetchImpl = vi.fn<typeof fetch>(async () => ok([]));
    await fetchRepos('tomas-samek', undefined, fetchImpl);
    expect((fetchImpl.mock.calls[0]![1]?.headers as Record<string, string>).Authorization).toBeUndefined();
  });

  it('follows pages until one comes back with fewer than 100 repos', async () => {
    const fetchImpl = vi
      .fn<typeof fetch>()
      .mockResolvedValueOnce(ok(page(100, 'p1-')))
      .mockResolvedValueOnce(ok(page(100, 'p2-')))
      .mockResolvedValueOnce(ok(page(3, 'p3-')));
    const repos = await fetchRepos('tomas-samek', 'tok', fetchImpl);
    expect(repos).toHaveLength(203);
    expect(fetchImpl).toHaveBeenCalledTimes(3);
    expect(String(fetchImpl.mock.calls[2]![0])).toContain('&page=3');
  });

  it('throws with the HTTP status on a non-2xx response', async () => {
    const fetchImpl = vi.fn<typeof fetch>(async () => new Response('boom', { status: 502 }));
    await expect(fetchRepos('tomas-samek', 'tok', fetchImpl)).rejects.toThrow(/GitHub API 502/);
  });

  it('tells you to set GITHUB_TOKEN when rate-limited without a token', async () => {
    const fetchImpl = vi.fn<typeof fetch>(async () => new Response('', { status: 403 }));
    await expect(fetchRepos('tomas-samek', undefined, fetchImpl)).rejects.toThrow(/GITHUB_TOKEN/);
  });

  it('lets network errors propagate so the build fails', async () => {
    const fetchImpl = vi.fn<typeof fetch>(async () => {
      throw new TypeError('fetch failed');
    });
    await expect(fetchRepos('tomas-samek', 'tok', fetchImpl)).rejects.toThrow('fetch failed');
  });
});
```

- [ ] **Step 2: Run the tests and confirm they fail**

Run: `npx vitest run test/fetch-repos.test.ts`
Expected: FAIL, because `fetchRepos` is not exported.

- [ ] **Step 3: Add `fetchRepos` to the end of `src/lib/github.ts`**

```ts
const PER_PAGE = 100;

export async function fetchRepos(user: string, token?: string, fetchImpl: typeof fetch = fetch): Promise<GhRepo[]> {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': `${user}-site-build`,
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const all: GhRepo[] = [];
  for (let page = 1; ; page++) {
    const url = `https://api.github.com/users/${user}/repos?type=owner&per_page=${PER_PAGE}&page=${page}`;
    const res = await fetchImpl(url, { headers });
    if (!res.ok) {
      const rateLimited = res.status === 403 || res.status === 429;
      const hint = rateLimited ? (token ? ' (rate limited)' : ' (rate limited; set GITHUB_TOKEN)') : '';
      throw new Error(`GitHub API ${res.status} for ${url}${hint}`);
    }
    const batch = (await res.json()) as GhRepo[];
    all.push(...batch);
    if (batch.length < PER_PAGE) return all;
  }
}
```

- [ ] **Step 4: Run all tests and confirm they pass**

Run: `npm test`
Expected: PASS (Task 3 and Task 4 suites).

- [ ] **Step 5: Create `src/data/projects.ts`**

```ts
import type { FeaturedConfig } from '../lib/github';

/** Display order on the home and projects pages = array order. */
export const featured: readonly FeaturedConfig[] = [
  {
    repo: 'tiko-di',
    blurb:
      'A compile-time orchestrator for Java 21+. An annotation processor validates and generates all the wiring: no reflection, no classpath scanning. DI and an event bus ship in the core; HTTP, databases and caches plug in directly via @Produces.',
    keyResult: 'On Maven Central · Java 21–27',
  },
  {
    repo: 'causal-cone-engine',
    blurb:
      'An experimental GPU renderer in Rust + wgpu. Entities push light along a graph of connections, one hop per tick, and the screen is a receptor array those same pipes feed.',
    keyResult: 'No rays, no meshes, no lights: light is delivered, not gathered',
  },
  {
    repo: 'llm-framework-benchmark',
    blurb:
      'Can an AI coding agent build the same framework-neutral spec on different stacks? An external black-box oracle grades every run, so the only variable is the framework, and the agent.',
    keyResult: 'Spring Boot 4.0.6: 1 pass in 20 · Tiko 0.5.0: 15/15',
  },
  {
    repo: 'trie-memory',
    blurb:
      'An experimental MCP memory server in Rust: a delta-encoded recognition trie paired with a concept store, with explicit Answer / Partial / Unknown states instead of confident guesses.',
    keyResult: 'Binds words across languages into one concept, append-only, built not to fabricate',
  },
];

/** Never shown: the profile README repo and this site's repo. */
export const exclude: readonly string[] = ['tomas-samek', 'tomas-samek.github.io'];

/** Topic → section title for non-featured repos. First match in this order wins; unmatched → "Other". */
export const groups: Readonly<Record<string, string>> = {
  'pet-project': 'Experiments',
};
```

- [ ] **Step 6: Create `src/lib/load-projects.ts`**

```ts
import { exclude, featured, groups } from '../data/projects';
import {
  fetchRepos,
  filterRepos,
  groupRest,
  mergeFeatured,
  type FeaturedProject,
  type ProjectGroup,
} from './github';

export interface LoadedProjects {
  featured: FeaturedProject[];
  groups: ProjectGroup[];
}

let cache: Promise<LoadedProjects> | undefined;

/** One API round-trip per build, shared by every page that needs project data. */
export function loadProjects(): Promise<LoadedProjects> {
  cache ??= (async () => {
    const repos = filterRepos(await fetchRepos('tomas-samek', process.env.GITHUB_TOKEN), exclude);
    return {
      featured: mergeFeatured(repos, featured),
      groups: groupRest(
        repos,
        featured.map((f) => f.repo),
        groups,
      ),
    };
  })();
  return cache;
}
```

- [ ] **Step 7: Check against the live API with a throwaway page**

Temporarily replace the body of `src/pages/index.astro` with:
```astro
---
import { loadProjects } from '../lib/load-projects';
const { featured, groups } = await loadProjects();
---
<html lang="en"><head><meta charset="utf-8" /><title>Tomáš Samek</title></head>
<body><p>Site under construction.</p><!-- {featured.map((p) => p.name).join(',')} | {groups.length} --></body></html>
```
Run: `GITHUB_TOKEN=$(gh auth token) npm run build && grep -o "tiko-di,causal-cone-engine,llm-framework-benchmark,trie-memory | 0" dist/index.html`
Expected: one match. Then restore `src/pages/index.astro` to the Task 2 content (`git checkout -- src/pages/index.astro`).

- [ ] **Step 8: Type-check and commit**

```bash
npm run check && npm test
git add src/lib/github.ts src/lib/load-projects.ts src/data/projects.ts test/fetch-repos.test.ts
git commit -m "feat: paginated GitHub fetch, featured config, build-time project loader

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 5: Posts collection and visibility helper

**Files:**
- Create: `src/content.config.ts`, `src/lib/posts.ts`, `src/lib/get-posts.ts`, `src/content/posts/draft-example.md`
- Test: `test/posts.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces:
  ```ts
  // collection 'posts' with data { title: string; date: Date; summary: string; draft: boolean; crosspost?: string }
  // src/lib/posts.ts
  function visiblePosts<T extends { data: { date: Date; draft: boolean } }>(posts: readonly T[], includeDrafts: boolean): T[]  // newest first
  function formatDate(d: Date): string  // 'YYYY-MM-DD' (UTC)
  // src/lib/get-posts.ts
  function getPosts(): Promise<CollectionEntry<'posts'>[]>  // drafts only in `astro dev`
  ```

- [ ] **Step 1: Write the failing tests in `test/posts.test.ts`**

```ts
import { describe, it, expect } from 'vitest';
import { formatDate, visiblePosts } from '../src/lib/posts';

const post = (id: string, date: string, draft = false) => ({ id, data: { date: new Date(date), draft } });

describe('visiblePosts', () => {
  const posts = [post('old', '2026-01-01'), post('draft', '2026-09-01', true), post('new', '2026-08-01')];

  it('drops drafts and sorts newest first', () => {
    expect(visiblePosts(posts, false).map((p) => p.id)).toEqual(['new', 'old']);
  });

  it('keeps drafts when asked (dev server)', () => {
    expect(visiblePosts(posts, true).map((p) => p.id)).toEqual(['draft', 'new', 'old']);
  });

  it('does not mutate the input', () => {
    const before = posts.map((p) => p.id);
    visiblePosts(posts, false);
    expect(posts.map((p) => p.id)).toEqual(before);
  });
});

describe('formatDate', () => {
  it('formats as YYYY-MM-DD in UTC', () => {
    expect(formatDate(new Date('2026-08-05T23:30:00Z'))).toBe('2026-08-05');
  });
});
```

- [ ] **Step 2: Run the tests and confirm they fail**

Run: `npx vitest run test/posts.test.ts`
Expected: FAIL, because `../src/lib/posts` can't be resolved.

- [ ] **Step 3: Implement `src/lib/posts.ts`**

```ts
export interface DatedDraftable {
  data: { date: Date; draft: boolean };
}

export function visiblePosts<T extends DatedDraftable>(posts: readonly T[], includeDrafts: boolean): T[] {
  return posts
    .filter((p) => includeDrafts || !p.data.draft)
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export function formatDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}
```

- [ ] **Step 4: Run the tests and confirm they pass**

Run: `npx vitest run test/posts.test.ts`
Expected: PASS.

- [ ] **Step 5: Create `src/content.config.ts`**

```ts
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    summary: z.string(),
    draft: z.boolean().default(false),
    crosspost: z.url().optional(),
  }),
});

export const collections = { posts };
```

- [ ] **Step 6: Create `src/lib/get-posts.ts`**

```ts
import { getCollection, type CollectionEntry } from 'astro:content';
import { visiblePosts } from './posts';

/** Published posts, newest first. Drafts appear only under `astro dev`. */
export async function getPosts(): Promise<CollectionEntry<'posts'>[]> {
  return visiblePosts(await getCollection('posts'), import.meta.env.DEV);
}
```

- [ ] **Step 7: Create `src/content/posts/draft-example.md`**

This documents the post format and keeps the collection non-empty. Because it's a draft, it never ships.
```markdown
---
title: Draft example
date: 2026-10-06
summary: Shows the frontmatter every post needs. Drafts never reach production or RSS.
draft: true
# crosspost: https://www.linkedin.com/pulse/...   (optional: link to the LinkedIn copy)
---

Post body in Markdown. **Bold**, `code`, [links](https://example.com/), tables and fenced code blocks all work.
```

- [ ] **Step 8: Check that the schema rejects bad frontmatter**

Temporarily add `src/content/posts/bad.md` containing:
```markdown
---
title: Bad
summary: missing date
---
x
```
Run: `npm run build`
Expected: the build FAILS with a content-collection schema error that mentions `date`. Then delete the file: `rm src/content/posts/bad.md`.

- [ ] **Step 9: Type-check, test, build, commit**

```bash
npm run check && npm test && npm run build
git add src/content.config.ts src/lib/posts.ts src/lib/get-posts.ts src/content/posts/draft-example.md test/posts.test.ts
git commit -m "feat: posts content collection with draft filtering

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```
Expected: check reports 0 errors, tests pass, the build succeeds, and `dist/` has no `writing/draft-example/` (no writing pages exist yet).

---

### Task 6: Blueprint styles, base layout, favicon, 404

**Files:**
- Create: `src/styles/tokens.css`, `src/styles/global.css`, `src/layouts/Base.astro`, `public/favicon.svg`, `src/pages/404.astro`

**Interfaces:**
- Consumes: `getPosts()` from Task 5 (used to decide whether to show the Writing nav link and the RSS link).
- Produces:
  - `Base.astro` with props `{ title?: string; description?: string }` and a default slot.
  - CSS classes used by later tasks: `.wrap`, `.grid-bg`, `.label`, `.lede`, `.meta`, `.hero`, `.pitch`, `.support`, `.page-head`, `.project-grid`, `.project-card`, `.key-result`, `.post-list`, `.side-note`, `.post`, `.post-summary`, `.prose`, `.crosspost`, `.more`.

- [ ] **Step 1: Create `src/styles/tokens.css` (copied from `tiko-di/site/style.css`)**

```css
:root {
  color-scheme: light dark;
  --bg: #f5f8fb;
  --grid: #e3eaf1;
  --surface: #ffffff;
  --code-bg: #f5f8fb;
  --border: #dbe5ee;
  --text: #13263a;
  --text-2: #3f5568;
  --text-3: #5a7085;
  --accent: #0e7490;
  --accent-text: #ffffff;
  --error: #dc2626;
  --serif: Georgia, 'Times New Roman', serif;
  --sans: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
  --mono: ui-monospace, Consolas, 'SF Mono', Menlo, monospace;
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg: #0c1722;
    --grid: #162636;
    --surface: #0f1d2a;
    --code-bg: #0a141e;
    --border: #22384b;
    --text: #e3ecf4;
    --text-2: #a9bccd;
    --text-3: #8ea4b8;
    --accent: #22b8cf;
    --accent-text: #0c1722;
    --error: #f87171;
  }
}
```

- [ ] **Step 2: Create `src/styles/global.css`**

```css
*, *::before, *::after { box-sizing: border-box; }
html { -webkit-text-size-adjust: 100%; }
body { margin: 0; background: var(--bg); color: var(--text); font: 16px/1.6 var(--sans); }
a { color: var(--accent); }
img { max-width: 100%; height: auto; }

.wrap { max-width: 1040px; margin: 0 auto; padding: 0 16px; }

.grid-bg {
  background-color: var(--bg);
  background-image:
    linear-gradient(var(--grid) 1px, transparent 1px),
    linear-gradient(90deg, var(--grid) 1px, transparent 1px);
  background-size: 16px 16px;
}

/* Header & footer */
.site-header { display: flex; flex-wrap: wrap; gap: 8px 20px; justify-content: space-between; align-items: center; padding-block: 20px; font: 14px var(--mono); }
.brand { font-weight: 700; color: var(--accent); text-decoration: none; }
.site-nav { display: flex; gap: 20px; }
.site-nav a { color: var(--text-3); text-decoration: none; }
.site-nav a:hover, .site-nav a[aria-current='page'] { color: var(--accent); }
.site-footer { padding-block: 40px 56px; font-size: 14px; color: var(--text-3); }
.footer-links { display: flex; flex-wrap: wrap; gap: 8px 24px; padding: 0; margin: 0; list-style: none; }

/* Type */
h1 { font: 400 clamp(2rem, 5vw, 3.2rem)/1.12 var(--serif); margin: 0; }
h2 { font: 400 1.6rem/1.2 var(--serif); margin: 0 0 16px; }
h3 { font: 600 1.05rem/1.3 var(--sans); margin: 0; }
.label { font: 600 12px var(--mono); letter-spacing: .12em; text-transform: uppercase; color: var(--accent); margin: 0 0 8px; }
.lede { color: var(--text-2); max-width: 680px; margin: 12px 0 0; }
.meta { font: 12px var(--mono); color: var(--text-3); }
.more { font: 14px var(--mono); }
section { padding: 40px 0; }

/* Hero */
.hero { padding: 24px 0 48px; }
.pitch { font: italic 1.3rem/1.5 var(--serif); color: var(--text-2); margin: 16px 0 8px; max-width: 720px; }
.support { font-size: 15px; color: var(--text-3); margin: 0; max-width: 720px; }
.page-head { padding: 24px 0 8px; }

/* Projects */
.project-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 300px), 1fr)); gap: 20px; }
.project-card { display: flex; flex-direction: column; gap: 10px; background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 18px 20px; min-width: 0; }
.project-card header { display: flex; justify-content: space-between; align-items: baseline; gap: 12px; }
.project-card h3 a { color: var(--text); text-decoration: none; overflow-wrap: anywhere; }
.project-card h3 a:hover { color: var(--accent); }
.project-card p { margin: 0; color: var(--text-2); font-size: 15px; }
.key-result { font: 12px/1.5 var(--mono) !important; color: var(--text) !important; background: var(--code-bg); border-left: 3px solid var(--accent); padding: 6px 10px; }
.project-card .meta { display: flex; gap: 16px; margin-top: auto; }

/* Post list */
.post-list { list-style: none; padding: 0; margin: 0; display: grid; gap: 20px; }
.post-list a { font: 1.15rem/1.4 var(--serif); }
.post-list p { margin: 4px 0 0; color: var(--text-2); font-size: 15px; }

/* Side note */
.side-note { margin: 24px 0 0; padding: 14px 16px; border-left: 3px solid var(--border); color: var(--text-3); font-size: 14px; max-width: 680px; }

/* Post reading layout (serif) */
.post { max-width: 680px; margin: 0 auto; padding: 24px 0 40px; }
.post h1 { font-size: clamp(1.9rem, 4.5vw, 2.6rem); }
.post-summary { font: italic 1.15rem/1.5 var(--serif); color: var(--text-2); margin: 12px 0 32px; }
.prose { font: 1.125rem/1.75 var(--serif); overflow-wrap: anywhere; }
.prose h2 { font-size: 1.5rem; margin: 2em 0 .6em; }
.prose h3 { font: 600 1.15rem/1.3 var(--serif); margin: 1.6em 0 .5em; }
.prose code { font: .85em var(--mono); background: var(--code-bg); padding: .1em .3em; border-radius: 3px; }
.prose pre { background: var(--code-bg); border: 1px solid var(--border); border-radius: 6px; padding: 16px; overflow-x: auto; font: 13px/1.55 var(--mono); }
.prose pre code { background: none; padding: 0; font-size: inherit; }
.prose table { display: block; overflow-x: auto; border-collapse: collapse; font: 14px var(--sans); margin: 1.5em 0; }
.prose th, .prose td { padding: 6px 12px; border-bottom: 1px solid var(--border); text-align: left; }
.prose blockquote { margin: 1.5em 0; padding-left: 16px; border-left: 3px solid var(--accent); color: var(--text-2); font-style: italic; }
.crosspost { color: var(--text-3); font-size: 15px; margin-top: 40px; }

@media (max-width: 720px) {
  section { padding: 32px 0; }
  .site-nav { gap: 14px; }
}
```

- [ ] **Step 3: Create `src/layouts/Base.astro`**

```astro
---
import '../styles/tokens.css';
import '../styles/global.css';
import { getPosts } from '../lib/get-posts';

interface Props {
  title?: string;
  description?: string;
}

const {
  title,
  description = "Tomáš Samek — I build whatever I find interesting, and push it until it can't go any faster.",
} = Astro.props;
const fullTitle = title ? `${title} · Tomáš Samek` : 'Tomáš Samek';
const canonical = new URL(Astro.url.pathname, Astro.site);
const hasPosts = (await getPosts()).length > 0;
const path = Astro.url.pathname;
const nav = [
  { href: '/projects/', label: 'projects' },
  ...(hasPosts ? [{ href: '/writing/', label: 'writing' }] : []),
  { href: '/about/', label: 'about' },
];
---
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{fullTitle}</title>
    <meta name="description" content={description} />
    <link rel="canonical" href={canonical.href} />
    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
    {hasPosts && <link rel="alternate" type="application/rss+xml" title="Tomáš Samek — writing" href="/rss.xml" />}
  </head>
  <body class="grid-bg">
    <div class="wrap">
      <header class="site-header">
        <a class="brand" href="/">tomas-samek</a>
        <nav class="site-nav" aria-label="Main">
          {nav.map((n) => (
            <a href={n.href} aria-current={path.startsWith(n.href) ? 'page' : undefined}>/{n.label}</a>
          ))}
        </nav>
      </header>
      <main>
        <slot />
      </main>
      <footer class="site-footer">
        <ul class="footer-links">
          <li><a href="https://github.com/tomas-samek">GitHub</a></li>
          <li><a href="https://linkedin.com/in/tomassamek">LinkedIn</a></li>
          {hasPosts && <li><a href="/rss.xml">RSS</a></li>}
        </ul>
      </footer>
    </div>
  </body>
</html>
```

- [ ] **Step 4: Create `public/favicon.svg`**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="6" fill="#0e7490"/>
  <text x="16" y="21.5" text-anchor="middle" font-family="ui-monospace,Consolas,monospace" font-size="15" font-weight="700" fill="#ffffff">ts</text>
</svg>
```

- [ ] **Step 5: Create `src/pages/404.astro`**

```astro
---
import Base from '../layouts/Base.astro';
---
<Base title="Not found" description="This page does not exist.">
  <section class="page-head">
    <p class="label">404</p>
    <h1>Nothing here.</h1>
    <p class="lede">The page you were looking for doesn't exist, or moved. Try the <a href="/">home page</a> or the <a href="/projects/">projects</a>.</p>
  </section>
</Base>
```

- [ ] **Step 6: Build and inspect**

```bash
npm run check && npm run build
grep -c 'rel="canonical"' dist/404.html
grep -c '/writing/' dist/404.html
```
(`grep -c` exits 1 when it prints `0`; that's expected for the last command.)
Expected: `0 errors`; the build creates `dist/404.html`; the canonical count is `1`; the `/writing/` count is `0`, because the only post is a draft and the Writing link is hidden in production.

Note: `/projects/` and `/about/` don't exist until Tasks 8 and 10, so don't run `npm run links` yet.

- [ ] **Step 7: Commit**

```bash
git add src/styles src/layouts/Base.astro public/favicon.svg src/pages/404.astro
git commit -m "feat: Blueprint styles, base layout, favicon, 404

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 7: Home page

**Files:**
- Create: `src/components/ProjectCard.astro`, `src/components/PostList.astro`
- Modify: `src/pages/index.astro` (full replacement of the temporary page)

**Interfaces:**
- Consumes:
  - `loadProjects()` (Task 4), `getPosts()` and `formatDate()` (Task 5);
  - `Base.astro` and the CSS classes (Task 6);
  - types `Project` and `FeaturedProject` (Task 3).
- Produces:
  - `ProjectCard.astro`, props `{ project: Project | FeaturedProject }`;
  - `PostList.astro`, props `{ posts: CollectionEntry<'posts'>[] }`.

  Both are reused in Tasks 8 and 9.

- [ ] **Step 1: Create `src/components/ProjectCard.astro`**

```astro
---
import type { FeaturedProject, Project } from '../lib/github';

interface Props {
  project: Project | FeaturedProject;
}

const { project } = Astro.props;
const blurb = 'blurb' in project ? project.blurb : project.description;
const keyResult = 'keyResult' in project ? project.keyResult : undefined;
---
<article class="project-card">
  <header>
    <h3><a href={project.url}>{project.name}</a></h3>
    {project.language && <span class="meta">{project.language}</span>}
  </header>
  {blurb && <p>{blurb}</p>}
  {keyResult && <p class="key-result">{keyResult}</p>}
  {(project.stars > 0 || project.homepage) && (
    <p class="meta">
      {project.stars > 0 && <span>★ {project.stars}</span>}
      {project.homepage && <a href={project.homepage}>site →</a>}
    </p>
  )}
</article>
```

- [ ] **Step 2: Create `src/components/PostList.astro`**

```astro
---
import type { CollectionEntry } from 'astro:content';
import { formatDate } from '../lib/posts';

interface Props {
  posts: CollectionEntry<'posts'>[];
}

const { posts } = Astro.props;
---
<ul class="post-list">
  {posts.map((post) => (
    <li>
      <time class="meta" datetime={formatDate(post.data.date)}>{formatDate(post.data.date)}</time><br />
      <a href={`/writing/${post.id}/`}>{post.data.title}</a>
      <p>{post.data.summary}</p>
    </li>
  ))}
</ul>
```

- [ ] **Step 3: Replace `src/pages/index.astro`**

```astro
---
import Base from '../layouts/Base.astro';
import PostList from '../components/PostList.astro';
import ProjectCard from '../components/ProjectCard.astro';
import { getPosts } from '../lib/get-posts';
import { loadProjects } from '../lib/load-projects';

const { featured } = await loadProjects();
const latest = (await getPosts()).slice(0, 3);
---
<Base>
  <section class="hero">
    <h1>Tomáš Samek</h1>
    <p class="pitch">I build whatever I find interesting, and push it until it can't go any faster.</p>
    <p class="support">
      Right now: compile-time Java frameworks · GPU rendering in Rust · memory for AI agents · benchmarking how coding agents actually perform.
    </p>
  </section>

  <section>
    <p class="label">Projects</p>
    <div class="project-grid">
      {featured.map((p) => <ProjectCard project={p} />)}
    </div>
    <p class="more"><a href="/projects/">All projects →</a></p>
  </section>

  {latest.length > 0 && (
    <section>
      <p class="label">Writing</p>
      <PostList posts={latest} />
      <p class="more"><a href="/writing/">All writing →</a></p>
    </section>
  )}

  <aside class="side-note">
    Background: 19 years of Java, 13 at Oracle on enterprise platform infrastructure: real-time search, pluggable persistence, Jakarta EE. Based in Prague.
  </aside>
</Base>
```

- [ ] **Step 4: Build and check the order and copy**

```bash
GITHUB_TOKEN=$(gh auth token) npm run build
grep -o 'github.com/tomas-samek/[a-z-]*"' dist/index.html
grep -c "push it until it can't go any faster" dist/index.html
grep -c 'Oracle' dist/index.html
grep -c 'site →' dist/index.html
```
Expected:
- The repo URLs appear in exactly this order: `tiko-di`, `causal-cone-engine`, `llm-framework-benchmark`, `trie-memory`.
- The pitch count is `1`, and the `Oracle` count is `1` (side note only).
- The `site →` count is `1` (only tiko-di has a homepage today).
- No "Writing" section, because the only post is a draft.

- [ ] **Step 5: Look at it in the browser**

Run `npm run dev` and open `http://localhost:4321/`. Check:
- The grid-paper background and teal accent appear.
- The four cards and the side note appear below the projects.
- In `astro dev` the draft post shows under Writing; that's expected.

Stop the dev server.

- [ ] **Step 6: Commit**

```bash
npm run check
git add src/components src/pages/index.astro
git commit -m "feat: home page with featured projects, latest writing, background note

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 8: Projects page

**Files:**
- Create: `src/pages/projects.astro`

**Interfaces:**
- Consumes: `loadProjects()` (Task 4), `ProjectCard.astro` (Task 7), `Base.astro` (Task 6).
- Produces: route `/projects/`.

- [ ] **Step 1: Create `src/pages/projects.astro`**

```astro
---
import Base from '../layouts/Base.astro';
import ProjectCard from '../components/ProjectCard.astro';
import { loadProjects } from '../lib/load-projects';

const { featured, groups } = await loadProjects();
---
<Base title="Projects" description="Every public project by Tomáš Samek: featured work first, everything else picked up from GitHub automatically.">
  <section class="page-head">
    <p class="label">Projects</p>
    <h1>Things I've built</h1>
    <p class="lede">Every public repo on this account. Featured first; everything else is picked up from GitHub on every build, so new repos show up here on their own.</p>
  </section>

  <section>
    <h2>Featured</h2>
    <div class="project-grid">
      {featured.map((p) => <ProjectCard project={p} />)}
    </div>
  </section>

  {groups.map((g) => (
    <section>
      <h2>{g.title}</h2>
      <div class="project-grid">
        {g.projects.map((p) => <ProjectCard project={p} />)}
      </div>
    </section>
  ))}
</Base>
```

- [ ] **Step 2: Build and check**

```bash
GITHUB_TOKEN=$(gh auth token) npm run build
grep -c 'class="project-card"' dist/projects/index.html
grep -c '<h2>' dist/projects/index.html
```
Expected: `4` cards and `1` `<h2>` (only "Featured"; no other public repos exist today, so there are no extra groups).

- [ ] **Step 3: Commit**

```bash
npm run check
git add src/pages/projects.astro
git commit -m "feat: projects hub page

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 9: Writing section, post layout, RSS

**Files:**
- Create: `src/layouts/Post.astro`, `src/pages/writing/index.astro`, `src/pages/writing/[...slug].astro`, `src/pages/rss.xml.ts`

**Interfaces:**
- Consumes: `getPosts()` and `formatDate()` (Task 5), `PostList.astro` (Task 7), `Base.astro` (Task 6).
- Produces:
  - routes `/writing/`, `/writing/<id>/`, `/rss.xml`;
  - `Post.astro`, props `{ post: CollectionEntry<'posts'> }`, with a default slot for the rendered body.

- [ ] **Step 1: Create `src/layouts/Post.astro`**

```astro
---
import type { CollectionEntry } from 'astro:content';
import Base from './Base.astro';
import { formatDate } from '../lib/posts';

interface Props {
  post: CollectionEntry<'posts'>;
}

const { post } = Astro.props;
const date = formatDate(post.data.date);
---
<Base title={post.data.title} description={post.data.summary}>
  <article class="post">
    <p class="label"><time datetime={date}>{date}</time></p>
    <h1>{post.data.title}</h1>
    <p class="post-summary">{post.data.summary}</p>
    <div class="prose">
      <slot />
    </div>
    {post.data.crosspost && (
      <p class="crosspost">Also on <a href={post.data.crosspost}>LinkedIn</a>.</p>
    )}
    <p class="more"><a href="/writing/">← All writing</a></p>
  </article>
</Base>
```

- [ ] **Step 2: Create `src/pages/writing/[...slug].astro`**

```astro
---
import { render, type CollectionEntry } from 'astro:content';
import Post from '../../layouts/Post.astro';
import { getPosts } from '../../lib/get-posts';

export async function getStaticPaths() {
  const posts = await getPosts();
  return posts.map((post) => ({ params: { slug: post.id }, props: { post } }));
}

interface Props {
  post: CollectionEntry<'posts'>;
}

const { post } = Astro.props;
const { Content } = await render(post);
---
<Post post={post}>
  <Content />
</Post>
```

- [ ] **Step 3: Create `src/pages/writing/index.astro`**

```astro
---
import Base from '../../layouts/Base.astro';
import PostList from '../../components/PostList.astro';
import { getPosts } from '../../lib/get-posts';

const posts = await getPosts();
---
<Base title="Writing" description="Posts by Tomáš Samek on frameworks, performance, and how AI coding agents actually build software.">
  <section class="page-head">
    <p class="label">Writing</p>
    <h1>Writing</h1>
  </section>
  <section>
    {posts.length > 0 ? <PostList posts={posts} /> : <p class="lede">Nothing published yet.</p>}
  </section>
</Base>
```

- [ ] **Step 4: Create `src/pages/rss.xml.ts`**

```ts
import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getPosts } from '../lib/get-posts';

export async function GET(context: APIContext) {
  const posts = await getPosts();
  return rss({
    title: 'Tomáš Samek — writing',
    description: "I build whatever I find interesting, and push it until it can't go any faster.",
    site: context.site!,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.summary,
      link: `/writing/${post.id}/`,
    })),
  });
}
```

- [ ] **Step 5: Check a published post by temporarily un-drafting the example**

```bash
sed -i 's/^draft: true$/draft: false/' src/content/posts/draft-example.md
GITHUB_TOKEN=$(gh auth token) npm run build
grep -o 'rel="canonical" href="[^"]*"' dist/writing/draft-example/index.html
grep -c 'class="prose"' dist/writing/draft-example/index.html
grep -c '<link>https://tomas-samek.github.io/writing/draft-example/</link>' dist/rss.xml
grep -c 'href="/writing/"' dist/index.html
```
Expected:
- canonical is `href="https://tomas-samek.github.io/writing/draft-example/"`;
- prose count `1`, RSS link count `1`;
- the home page now links `/writing/` (nav and "All writing").

While the example is still un-drafted, run `npm run preview`, open `http://localhost:4321/writing/draft-example/`, and confirm the body is set in serif in a narrow (~680px) column. Stop the preview, then restore the draft flag:
```bash
git checkout -- src/content/posts/draft-example.md
grep -c '^draft: true$' src/content/posts/draft-example.md   # expect 1
```

- [ ] **Step 6: Check that a draft never ships**

```bash
GITHUB_TOKEN=$(gh auth token) npm run build
test ! -e dist/writing/draft-example && echo "draft not built"
grep -c '<item>' dist/rss.xml || true
```
Expected: `draft not built`, and the `<item>` count is `0`.

- [ ] **Step 7: Commit**

```bash
npm run check && npm test
git add src/layouts/Post.astro src/pages/writing src/pages/rss.xml.ts
git commit -m "feat: writing section with serif post layout, canonical URLs, RSS

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 10: About page, full link check, responsive and theme check

**Files:**
- Create: `src/pages/about.astro`, `linkinator.config.json`

**Interfaces:**
- Consumes: `Base.astro` (Task 6).
- Produces:
  - route `/about/`;
  - the `npm run links` configuration CI uses in Task 11.

- [ ] **Step 1: Create `src/pages/about.astro`**

```astro
---
import Base from '../layouts/Base.astro';
---
<Base title="About" description="About Tomáš Samek: independent builder, Java and Rust, based in Prague.">
  <article class="post">
    <p class="label">About</p>
    <h1>Tomáš Samek</h1>
    <p class="post-summary">I build whatever I find interesting, and push it until it can't go any faster.</p>
    <div class="prose">
      <p>
        Right now that means a compile-time orchestrator for Java (<a href="https://github.com/tomas-samek/tiko-di">tiko-di</a>),
        a GPU renderer that delivers light instead of tracing it (<a href="https://github.com/tomas-samek/causal-cone-engine">causal-cone-engine</a>),
        a benchmark of how well AI coding agents actually build software (<a href="https://github.com/tomas-samek/llm-framework-benchmark">llm-framework-benchmark</a>),
        and a memory server for AI agents that would rather say "I don't know" than guess (<a href="https://github.com/tomas-samek/trie-memory">trie-memory</a>).
      </p>
      <p>
        My strongest zone is the middle of the stack: real-time search and indexing, pluggable persistence,
        compile-time code generation, event-driven integration.
      </p>
      <blockquote>
        Coherence over orthodoxy: a system is valid if it is internally consistent, falsifiable, and explanatory,
        regardless of its alignment with current dogma.
      </blockquote>
      <h2>Background</h2>
      <p>
        19 years of Java, 13 of them at Oracle building enterprise platform infrastructure: real-time search,
        pluggable persistence, Jakarta EE. Based in Prague.
      </p>
      <h2>Elsewhere</h2>
      <p>
        <a href="https://github.com/tomas-samek">GitHub</a> · <a href="https://linkedin.com/in/tomassamek">LinkedIn</a>.
        Side experiments in physics, linguistics and AI tooling live at <a href="https://github.com/jerry-samek">@jerry-samek</a>.
      </p>
    </div>
  </article>
</Base>
```

- [ ] **Step 2: Create `linkinator.config.json`**

linkinator serves `dist/` on `127.0.0.1`. The skip pattern ignores external URLs but must let the local server through, so don't simplify it to `^https?://`. With that, linkinator scans 0 links and always passes.
```json
{
  "recurse": true,
  "skip": ["^https?://(?!localhost|127[.]0[.]0[.]1)"]
}
```

- [ ] **Step 3: Check that the link checker catches a broken internal link**

```bash
GITHUB_TOKEN=$(gh auth token) npm run build
echo '<a href="/does-not-exist/">x</a>' >> dist/index.html
npm run links; echo "exit=$?"
```
Expected: the output lists `[404]` for `/does-not-exist/`, and `exit=1`.

- [ ] **Step 4: Run the full pipeline on a clean build**

```bash
npm run check && npm test && GITHUB_TOKEN=$(gh auth token) npm run build && npm run links; echo "exit=$?"
```
Expected: `0 errors`, all tests pass, linkinator reports `Successfully scanned N links` with N > 5, and `exit=0`.

- [ ] **Step 5: Check phone width, both themes, all pages**

Run `npm run preview` and open `http://localhost:4321/`. In Chrome DevTools, turn on the device toolbar and set the width to **375px**. For each of `/`, `/projects/`, `/about/`, `/writing/` and `/404.html`:
- Run this in the console: `document.documentElement.scrollWidth <= window.innerWidth`. Expected: `true`.
- In DevTools, open Rendering → "Emulate CSS prefers-color-scheme" and switch between **light** and **dark**. Expected: dark background with light text in dark mode, the teal accent visible in both, and readable text everywhere.

Fix any CSS in `src/styles/global.css` that fails, then re-run Step 4.

- [ ] **Step 6: Commit**

```bash
git add src/pages/about.astro linkinator.config.json src/styles/global.css
git commit -m "feat: about page and internal link checking

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 11: CI/CD workflow, GitHub repo, Pages, first deploy

**Files:**
- Create: `.github/workflows/deploy.yml`

**Interfaces:**
- Consumes: npm scripts `check`, `test`, `build`, `links` (Tasks 2 and 10).
- Produces: a live site at `https://tomas-samek.github.io/`, and nightly rebuilds.

- [ ] **Step 1: Create `.github/workflows/deploy.yml`**

```yaml
# Builds and deploys https://tomas-samek.github.io/.
# Nightly run refreshes project data (stars, new repos) without a commit.
name: Build and deploy

on:
  push:
    branches: [ "main" ]
  pull_request:
  schedule:
    - cron: "0 3 * * *"
  workflow_dispatch:

permissions:
  contents: read

concurrency:
  group: pages-${{ github.ref }}
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7.0.1
      - uses: actions/setup-node@820762786026740c76f36085b0efc47a31fe5020 # v7.0.0
        with:
          node-version: 24
          cache: npm
      - run: npm ci
      - run: npm run check
      - run: npm test
      - run: npm run build
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      - run: npm run links
      - if: github.event_name != 'pull_request'
        uses: actions/upload-pages-artifact@fc324d3547104276b827a68afc52ff2a11cc49c9 # v5.0.0
        with:
          path: dist

  deploy:
    if: github.event_name != 'pull_request'
    needs: build
    runs-on: ubuntu-latest
    permissions:
      pages: write
      id-token: write
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@368f82528645a54fb793d4d04e342629a3f51346 # v5.0.1
```

- [ ] **Step 2: Commit**

```bash
git add .github/workflows/deploy.yml
git commit -m "ci: check, test, build, link-check and deploy to Pages (push, nightly, manual)

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

- [ ] **Step 3: Create the GitHub repo and enable Pages (ASK THE USER FIRST)**

After the user confirms creating a **public** repo `tomas-samek/tomas-samek.github.io`:
```bash
cd W:/workspace/tomas-samek.github.io
gh repo create tomas-samek/tomas-samek.github.io --public \
  --description "Personal site: projects, writing, and the longer story." \
  --homepage "https://tomas-samek.github.io/"
gh api -X POST repos/tomas-samek/tomas-samek.github.io/pages -f build_type=workflow
gh api repos/tomas-samek/tomas-samek.github.io/pages --jq '{build_type, html_url}'
```
Expected: the repo is created, and the Pages API returns `{"build_type":"workflow","html_url":"https://tomas-samek.github.io/"}`.

- [ ] **Step 4: Push and watch the first deploy (ASK THE USER FIRST)**

```bash
git remote add origin https://github.com/tomas-samek/tomas-samek.github.io.git
git push -u origin main
gh run watch --exit-status $(gh run list --workflow deploy.yml --limit 1 --json databaseId --jq '.[0].databaseId')
```
Expected: the `build` and `deploy` jobs are both green.

- [ ] **Step 5: Check the live site**

```bash
curl -s https://tomas-samek.github.io/ | grep -c "push it until it can't go any faster"
curl -s -o /dev/null -w "%{http_code}\n" https://tomas-samek.github.io/projects/
curl -s -o /dev/null -w "%{http_code}\n" https://tomas-samek.github.io/about/
curl -s -o /dev/null -w "%{http_code}\n" https://tomas-samek.github.io/tiko-di/
curl -s -o /dev/null -w "%{http_code}\n" https://tomas-samek.github.io/no-such-page/
```
Expected: `1`, `200`, `200`, `200` (the tiko-di site still works), and `404` (it serves the site's own 404 page).

- [ ] **Step 6: Check a manual rebuild works (the same path as the nightly run)**

```bash
gh workflow run deploy.yml
gh run list --workflow deploy.yml --event workflow_dispatch --limit 1 --json databaseId,createdAt
```
`gh workflow run` returns before the run is registered. Repeat the `gh run list` command until it shows a run created in the last minute, then run `gh run watch --exit-status <databaseId>`.
Expected: green. The nightly `schedule` trigger runs the same workflow from `main`.

---

### Task 12: First post: "Your AI coding agent has a blind spot"

**BLOCKED until the user provides the article text.** Ask for:
1. the full article text (paste);
2. the original LinkedIn publication date;
3. whether the LinkedIn images should be included. If yes, the user saves them into `public/writing/ai-coding-agent-blind-spot/`.

If the text is late, Phase 2 is already live with the Writing link hidden (Task 6 behaviour). Run Task 13 first and come back to this.

**Files:**
- Create: `src/content/posts/ai-coding-agent-blind-spot.md`

**Interfaces:**
- Consumes: the posts collection schema (Task 5) and the writing routes (Task 9).
- Produces: `/writing/ai-coding-agent-blind-spot/`, the first RSS item, and the Writing link appearing in the nav.

- [ ] **Step 1: Create the post**

Frontmatter (fill `date` with the LinkedIn publication date the user gives):
```markdown
---
title: "Your AI coding agent has a blind spot — and a bigger model doesn't fix it"
date: <YYYY-MM-DD from the user>
summary: "Twenty trials on Spring Boot 4.0.6, one pass. What version recency does to AI coding agents, and why a bigger model doesn't fix it."
crosspost: "https://www.linkedin.com/pulse/your-ai-coding-agent-has-blind-spot-bigger-model-doesnt-tom%25C3%25A1%25C5%25A1-samek-iwlyf"
---
```
Body: the user's text converted to Markdown. Keep the wording exactly as given. Turn headings into `##` / `###`, keep tables as Markdown tables, and turn inline links into `[text](url)`. Link the benchmark repo as `https://github.com/tomas-samek/llm-framework-benchmark`. Images go in as `![alt](/writing/ai-coding-agent-blind-spot/<file>)`.

- [ ] **Step 2: Build, link-check, and inspect**

```bash
npm run check && GITHUB_TOKEN=$(gh auth token) npm run build && npm run links
grep -o 'rel="canonical" href="[^"]*"' dist/writing/ai-coding-agent-blind-spot/index.html
grep -c '<item>' dist/rss.xml
grep -c 'href="/writing/"' dist/index.html
```
Expected:
- links pass;
- canonical is `https://tomas-samek.github.io/writing/ai-coding-agent-blind-spot/`;
- `1` RSS item;
- the home page has the Writing nav link, a Writing section, and an "All writing" link.

Then read it at 375px in `npm run preview`: serif body, and any tables scroll inside themselves without making the page scroll sideways.

- [ ] **Step 3: Commit and push (ASK THE USER FIRST before pushing)**

```bash
git add src/content/posts/ai-coding-agent-blind-spot.md
[ -d public/writing ] && git add public/writing
git commit -m "post: Your AI coding agent has a blind spot

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
git push
```
Expected: the deploy goes green, and `curl -s https://tomas-samek.github.io/rss.xml | grep -c '<item>'` prints `1`.

---

### Task 13: Move the spec and plan into the site repo

**Files:**
- Create: `W:/workspace/tomas-samek.github.io/docs/superpowers/specs/2026-10-06-portfolio-site-design.md`, `W:/workspace/tomas-samek.github.io/docs/superpowers/plans/2026-10-06-portfolio-site.md` (copies)

**Interfaces:**
- Consumes: the files on branch `portfolio-site` of the profile repo.
- Produces: the docs in the site repo. Task 14 deletes the `portfolio-site` branch.

- [ ] **Step 1: Copy, with all checkboxes ticked up to this point**

```bash
mkdir -p W:/workspace/tomas-samek.github.io/docs/superpowers/specs W:/workspace/tomas-samek.github.io/docs/superpowers/plans
cp W:/workspace/tomas-samek/docs/superpowers/specs/2026-10-06-portfolio-site-design.md W:/workspace/tomas-samek.github.io/docs/superpowers/specs/
cp W:/workspace/tomas-samek/docs/superpowers/plans/2026-10-06-portfolio-site.md W:/workspace/tomas-samek.github.io/docs/superpowers/plans/
diff -r W:/workspace/tomas-samek/docs/superpowers W:/workspace/tomas-samek.github.io/docs/superpowers && echo identical
```
Expected: `identical`.

- [ ] **Step 2: Check the link checker ignores `docs/`**

`docs/` is outside `dist/`, so it never ships. Run `npm run build && test ! -e dist/docs && echo ok`.
Expected: `ok`.

- [ ] **Step 3: Commit and push (ASK THE USER FIRST before pushing)**

```bash
cd W:/workspace/tomas-samek.github.io
git add docs/superpowers
git commit -m "docs: add design spec and implementation plan

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
git push
```

From here on, keep ticking checkboxes in the site repo's copy of the plan.

---

## Phase 3 — Wire it together

### Task 14: README site link, repo homepages, cleanup, acceptance check

**Files:**
- Modify: `W:/workspace/tomas-samek-main/README.md`

**Interfaces:**
- Consumes: the live site (Task 11) and the README from Task 1.
- Produces: the finished rollout.

- [ ] **Step 1: Add the site link to the README**

In `W:/workspace/tomas-samek-main/README.md`, directly after the line `I build whatever I find interesting, and push it until it can't go any faster.`, insert a blank line and then:
```markdown
**→ [tomas-samek.github.io](https://tomas-samek.github.io)** — projects, writing, and the longer story.
```
Replace the last line `[LinkedIn](https://linkedin.com/in/tomassamek)` with:
```markdown
[Site](https://tomas-samek.github.io) · [LinkedIn](https://linkedin.com/in/tomassamek)
```

- [ ] **Step 2: Commit and push the README (ASK THE USER FIRST)**

```bash
cd W:/workspace/tomas-samek-main
grep -c "https://tomas-samek.github.io)" README.md   # expect 2
git add README.md
git commit -m "profile: link to tomas-samek.github.io

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
git push origin main
```

- [ ] **Step 3: Set repo homepages (ASK THE USER FIRST)**

```bash
for r in tomas-samek causal-cone-engine llm-framework-benchmark trie-memory; do
  gh repo edit tomas-samek/$r --homepage "https://tomas-samek.github.io/"
done
gh repo list tomas-samek --visibility public --json name,homepageUrl --jq '.[] | "\(.name) \(.homepageUrl)"'
```
Expected: all four show `https://tomas-samek.github.io/`, and `tiko-di` still shows `https://tomas-samek.github.io/tiko-di/`.

- [ ] **Step 4: Rebuild and check there are no circular "site →" links**

```bash
cd W:/workspace/tomas-samek.github.io
gh workflow run deploy.yml
gh run list --workflow deploy.yml --event workflow_dispatch --limit 1 --json databaseId,createdAt
```
Repeat `gh run list` until it shows a run created in the last minute, run `gh run watch --exit-status <databaseId>`, and then:
```bash
curl -s https://tomas-samek.github.io/ | grep -c 'site →'
```
Expected: `1` (tiko-di only). The three new root homepages are dropped by `normaliseHomepage` (Task 3).

- [ ] **Step 5: Remove the profile-repo worktree and the `portfolio-site` branch**

The docs now live in the site repo (Task 13), so the branch isn't needed.
```bash
cd W:/workspace/tomas-samek
git worktree remove W:/workspace/tomas-samek-main
git switch main && git pull --ff-only
git branch -D portfolio-site
git status --short
```
Expected: the `portfolio-site` branch is gone. `git status` shows only the user's untracked `.idea/` (`.superpowers/` is now ignored).

- [ ] **Step 6: Acceptance check (spec §7)**

Check each item on the live site and record the result:
- [ ] `/` shows the intro, the 4 featured projects in order (`tiko-di`, `causal-cone-engine`, `llm-framework-benchmark`, `trie-memory`), and the latest posts.
- [ ] `/tiko-di/` returns 200.
- [ ] Auto-discovery: covered by the `groupRest` tests (Task 3) plus the nightly trigger (Task 11). Confirm by eye the next time a public repo is created; it should appear on `/projects/` after the next 03:00 UTC run.
- [ ] The blind-spot post renders in serif, its canonical URL is its own, and it appears in `/rss.xml` (if Task 12 is done).
- [ ] Light and dark themes are both fine; no horizontal scroll at 375px (repeat the Task 10 Step 5 checks on the live URL).
- [ ] CI fails on a missing featured repo (Task 3 test), invalid frontmatter (Task 5 Step 8), or a broken internal link (Task 10 Step 3).
- [ ] `grep -n Oracle README.md` on `main` returns only the `<sub>` line.

- [ ] **Step 7: Tell the user what's left for them**

Re-share the post on LinkedIn, linking to `https://tomas-samek.github.io/writing/ai-coding-agent-blind-spot/`. Optionally, point the write-up link in the `llm-framework-benchmark` README to the site copy; that's out of scope for this plan.
