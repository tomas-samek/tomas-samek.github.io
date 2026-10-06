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
