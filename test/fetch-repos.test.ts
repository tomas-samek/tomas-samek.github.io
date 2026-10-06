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
