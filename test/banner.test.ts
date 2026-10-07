import { describe, it, expect } from 'vitest';
import { bannerSvg, markTileSvg } from '../src/lib/banner';
import { HUES, MARKS } from '../src/data/marks';

const base = { name: 'tiko-di', tagline: 'Compile-time orchestrator for Java 21+', language: 'Java', mark: 'graph', hue: 'teal' } as const;

describe('bannerSvg', () => {
  it('is a standalone 1280×320 SVG document', () => {
    const svg = bannerSvg({ ...base, theme: 'light' });
    expect(svg.startsWith('<svg ')).toBe(true);
    expect(svg).toContain('xmlns="http://www.w3.org/2000/svg"');
    expect(svg).toContain('width="1280"');
    expect(svg).toContain('height="320"');
    expect(svg.trimEnd().endsWith('</svg>')).toBe(true);
  });

  it('contains the name, tagline, language and site URL', () => {
    const svg = bannerSvg({ ...base, theme: 'light' });
    for (const text of ['tiko-di', 'Compile-time orchestrator for Java 21+', 'Java', 'tomas-samek.github.io']) {
      expect(svg).toContain(`>${text}<`);
    }
  });

  it('uses the theme tint as background', () => {
    expect(bannerSvg({ ...base, theme: 'light' })).toContain(`fill="${HUES.teal.light.tint}"`);
    expect(bannerSvg({ ...base, theme: 'dark' })).toContain(`fill="${HUES.teal.dark.tint}"`);
  });

  it('escapes XML special characters in text', () => {
    const svg = bannerSvg({ ...base, tagline: 'Fast & <safe> "DI"', theme: 'light' });
    expect(svg).toContain('Fast &amp; &lt;safe&gt; &quot;DI&quot;');
    expect(svg).not.toContain('<safe>');
  });

  it('omits the language pill when the language is unknown', () => {
    const svg = bannerSvg({ ...base, language: null, theme: 'light' });
    expect(svg).not.toContain('class="lang"');
    expect(bannerSvg({ ...base, theme: 'light' })).toContain('class="lang"');
  });
});

describe('markTileSvg', () => {
  it('is a standalone 48×48 rounded tile in the theme tint with the mark in the hue ink', () => {
    const svg = markTileSvg({ mark: 'cone', hue: 'amber', theme: 'light' });
    expect(svg.startsWith('<svg ')).toBe(true);
    expect(svg).toContain('xmlns="http://www.w3.org/2000/svg"');
    expect(svg).toContain('width="48"');
    expect(svg).toContain('height="48"');
    expect(svg).toContain(`fill="${HUES.amber.light.tint}"`);
    expect(svg).toContain(`stroke="${HUES.amber.light.ink}"`);
    expect(svg).toContain(MARKS.cone);
  });

  it('switches colours for the dark theme', () => {
    const svg = markTileSvg({ mark: 'cone', hue: 'amber', theme: 'dark' });
    expect(svg).toContain(`fill="${HUES.amber.dark.tint}"`);
    expect(svg).toContain(`stroke="${HUES.amber.dark.ink}"`);
  });
});
