import { describe, it, expect } from 'vitest';
import { absolutiseReadmeUrls, fetchReadme, projectPath, stripReadmeHeader, stripSiteLinks } from '../src/lib/readme';

describe('projectPath', () => {
  it('is /projects/<repo>/ with the trailing slash the site config requires', () => {
    expect(projectPath('tiko-di')).toBe('/projects/tiko-di/');
  });
});

describe('stripReadmeHeader', () => {
  it('drops the leading banner picture and the title', () => {
    const md = [
      '<picture>',
      '  <source media="(prefers-color-scheme: dark)" srcset="https://tomas-samek.github.io/banners/dark/x.svg">',
      '  <img alt="x" src="https://tomas-samek.github.io/banners/light/x.svg" width="100%">',
      '</picture>',
      '',
      '# Tiko DI',
      '',
      '> Intro',
      '',
      '## Usage',
    ].join('\n');
    expect(stripReadmeHeader(md)).toBe('> Intro\n\n## Usage');
  });

  it('drops a title with no banner, and a BOM', () => {
    expect(stripReadmeHeader('﻿# Name\n\nBody')).toBe('Body');
  });

  it('keeps a README that starts with prose', () => {
    expect(stripReadmeHeader('Body\n\n# Later heading\n')).toBe('Body\n\n# Later heading\n');
  });

  it('keeps a picture that is not at the top', () => {
    const md = 'Body\n\n<picture><img src="a.png"></picture>\n';
    expect(stripReadmeHeader(md)).toBe(md);
  });
});

describe('stripSiteLinks', () => {
  it('drops the line linking back to the site root, with or without the slash', () => {
    const md = 'Intro\n\n🌐 **More projects and writing:** [tomas-samek.github.io](https://tomas-samek.github.io/)\n\n## Usage\n';
    expect(stripSiteLinks(md)).toBe('Intro\n\n\n## Usage\n');
    expect(stripSiteLinks('a\n[site](https://tomas-samek.github.io)\nb')).toBe('a\nb');
  });

  it('keeps links deeper into the site', () => {
    const md = '**Play it here: [demo](https://tomas-samek.github.io/tdm-demo/)**\n';
    expect(stripSiteLinks(md)).toBe(md);
  });
});

describe('absolutiseReadmeUrls', () => {
  const fix = (html: string) => absolutiseReadmeUrls(html, 'tomas-samek', 'tiko-di');
  const blob = 'https://github.com/tomas-samek/tiko-di/blob/HEAD/';
  const raw = 'https://raw.githubusercontent.com/tomas-samek/tiko-di/HEAD/';

  it('points relative links at the file on GitHub', () => {
    expect(fix('<a href="./docs/roadmap.md">r</a>')).toBe(`<a href="${blob}docs/roadmap.md">r</a>`);
    expect(fix('<a href="LICENSE">l</a>')).toBe(`<a href="${blob}LICENSE">l</a>`);
    expect(fix('<a href="results/RESULTS.md#stage-2">s</a>')).toBe(`<a href="${blob}results/RESULTS.md#stage-2">s</a>`);
  });

  it('resolves root-relative links against the repo root, as GitHub does', () => {
    expect(fix('<a href="/docs/a.md">a</a>')).toBe(`<a href="${blob}docs/a.md">a</a>`);
  });

  it('points relative images at the raw file', () => {
    expect(fix('<img src="docs/shot.png" alt="">')).toBe(`<img src="${raw}docs/shot.png" alt="">`);
    expect(fix('<source srcset="a.png 1x, b.png 2x">')).toBe(`<source srcset="${raw}a.png 1x, ${raw}b.png 2x">`);
  });

  it('leaves absolute URLs, in-page anchors and mailto alone', () => {
    const html =
      '<a href="https://central.sonatype.com/x">m</a><a href="#usage">u</a><a href="mailto:a@b.c">e</a>' +
      '<img src="https://img.shields.io/badge/x.svg"><img src="//cdn.example/x.png">';
    expect(fix(html)).toBe(html);
  });
});

describe('fetchReadme', () => {
  const respond = (status: number, body = '') => (async () => new Response(body, { status })) as typeof fetch;

  it('returns the raw markdown', async () => {
    expect(await fetchReadme('o', 'r', undefined, respond(200, '# Hi'))).toBe('# Hi');
  });

  it('returns null when the repo has no README', async () => {
    expect(await fetchReadme('o', 'r', undefined, respond(404))).toBeNull();
  });

  it('fails the build on other errors, with a rate-limit hint', async () => {
    await expect(fetchReadme('o', 'r', undefined, respond(403))).rejects.toThrow(/rate limited; set GITHUB_TOKEN/);
    await expect(fetchReadme('o', 'r', 'token', respond(500))).rejects.toThrow(/GitHub API 500/);
  });
});
