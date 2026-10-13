import { SITE_ROOT } from './github';

/** Site path of a featured project's own page. Cards and getStaticPaths both use this, so they can't drift. */
export const projectPath = (repo: string) => `/projects/${repo}/`;

/**
 * The project page already shows the banner and the name, so drop the README's leading
 * `<picture>` banner and its first `# Title` line.
 */
export function stripReadmeHeader(md: string): string {
  return md
    .replace(/^﻿/, '')
    .replace(/^\s*<picture>[\s\S]*?<\/picture>\s*/i, '')
    .replace(/^\s*#\s+[^\n]*\n/, '')
    .trimStart();
}

/**
 * READMEs point readers at this site ("More projects and writing: tomas-samek.github.io"). On the site itself
 * that line is a link back to where they already are, so drop any line that links to the site root.
 */
export function stripSiteLinks(md: string): string {
  const root = SITE_ROOT.replace(/\/$/, '').replace(/[.]/g, '\\.');
  return md.replace(new RegExp(`^[^\\n]*\\]\\(${root}/?\\)[^\\n]*\\n?`, 'gm'), '');
}

const hasScheme =(u: string) => /^[a-z][a-z0-9+.-]*:/i.test(u);

/**
 * README links are relative to the repo, not to this site. Point links (href) at the file on GitHub and
 * embeds (src, srcset) at the raw file. `HEAD` follows the default branch, whatever it's called.
 */
export function absolutiseReadmeUrls(html: string, owner: string, repo: string): string {
  const blob = `https://github.com/${owner}/${repo}/blob/HEAD/`;
  const raw = `https://raw.githubusercontent.com/${owner}/${repo}/HEAD/`;
  const resolve = (u: string, base: string) => {
    if (u === '' || u.startsWith('#') || u.startsWith('//') || hasScheme(u)) return u;
    // GitHub resolves a root-relative README link against the repo root, not the host.
    return new URL(u.replace(/^\/+/, ''), base).href;
  };
  return html.replace(/\s(href|src|srcset)="([^"]*)"/g, (_, attr: string, value: string) => {
    const next =
      attr === 'href'
        ? resolve(value, blob)
        : attr === 'src'
          ? resolve(value, raw)
          : value
              .split(',')
              .map((c) => c.trim().replace(/^\S+/, (u) => resolve(u, raw)))
              .join(', ');
    return ` ${attr}="${next}"`;
  });
}

/** Raw README markdown, or null when the repo has none. */
export async function fetchReadme(
  owner: string,
  repo: string,
  token?: string,
  fetchImpl: typeof fetch = fetch,
): Promise<string | null> {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github.raw',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': `${owner}-site-build`,
  };
  if (token) headers.Authorization = `Bearer ${token}`;
  const url = `https://api.github.com/repos/${owner}/${repo}/readme`;
  const res = await fetchImpl(url, { headers });
  if (res.status === 404) return null;
  if (!res.ok) {
    const rateLimited = res.status === 403 || res.status === 429;
    const hint = rateLimited ? (token ? ' (rate limited)' : ' (rate limited; set GITHUB_TOKEN)') : '';
    throw new Error(`GitHub API ${res.status} for ${url}${hint}`);
  }
  return res.text();
}
