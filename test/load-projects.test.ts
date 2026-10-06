import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { GhRepo } from '../src/lib/github';

const fetchRepos = vi.fn<(user: string, token?: string) => Promise<GhRepo[]>>();
vi.mock('../src/lib/github', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../src/lib/github')>()),
  fetchRepos: (user: string, token?: string) => fetchRepos(user, token),
}));

const featuredRepo = (name: string): GhRepo => ({
  name,
  html_url: `https://github.com/tomas-samek/${name}`,
  description: 'd',
  homepage: null,
  language: 'Java',
  stargazers_count: 0,
  topics: [],
  pushed_at: '2026-01-01T00:00:00Z',
  fork: false,
  archived: false,
  private: false,
});
const allFeatured = ['tiko-di', 'causal-cone-engine', 'llm-framework-benchmark', 'trie-memory'].map(featuredRepo);

describe('loadProjects', () => {
  beforeEach(() => {
    vi.resetModules();
    fetchRepos.mockReset();
  });

  it('fetches once and shares the result across calls', async () => {
    fetchRepos.mockResolvedValue(allFeatured);
    const { loadProjects } = await import('../src/lib/load-projects');
    const [a, b] = await Promise.all([loadProjects(), loadProjects()]);
    expect(a).toBe(b);
    expect(fetchRepos).toHaveBeenCalledTimes(1);
  });

  it('does not keep a failed fetch: the next call retries (astro dev stays usable after a blip)', async () => {
    fetchRepos.mockRejectedValueOnce(new Error('GitHub API 403')).mockResolvedValueOnce(allFeatured);
    const { loadProjects } = await import('../src/lib/load-projects');
    await expect(loadProjects()).rejects.toThrow('GitHub API 403');
    const second = await loadProjects();
    expect(second.featured.map((p) => p.name)).toEqual(allFeatured.map((r) => r.name));
    expect(fetchRepos).toHaveBeenCalledTimes(2);
  });
});
