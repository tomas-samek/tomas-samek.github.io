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

  it('keeps only absolute http(s) homepages (scheme-less or javascript: become null)', () => {
    expect(toProject(repo({ name: 'x', homepage: 'example.com' })).homepage).toBeNull();
    expect(toProject(repo({ name: 'x', homepage: 'javascript:alert(1)' })).homepage).toBeNull();
    expect(toProject(repo({ name: 'x', homepage: 'http://x.dev' })).homepage).toBe('http://x.dev');
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

  it('carries the configured visual (mark, hue, tagline) through to the project', () => {
    const visual = { mark: 'graph', hue: 'teal', tagline: 't' } as const;
    expect(mergeFeatured(repos, [{ repo: 'a', blurb: 'x', visual }])[0]?.visual).toEqual(visual);
    expect(mergeFeatured(repos, [{ repo: 'a', blurb: 'x' }])[0]?.visual).toBeUndefined();
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

  it('matches config topic keys case-insensitively (GitHub topics are always lowercase)', () => {
    const out = groupRest([repo({ name: 'x', topics: ['pet-project'] })], [], { 'Pet-Project': 'Experiments' });
    expect(out.map((g) => g.title)).toEqual(['Experiments']);
  });

  it('renders a group configured with the title "Other" once, merged with unmatched repos', () => {
    const out = groupRest(
      [repo({ name: 'tagged', topics: ['misc'] }), repo({ name: 'untagged' })],
      [],
      { misc: OTHER_GROUP },
    );
    expect(out.map((g) => g.title)).toEqual([OTHER_GROUP]);
    expect(out[0]?.projects.map((p) => p.name).sort()).toEqual(['tagged', 'untagged']);
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
