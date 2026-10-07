import { describe, it, expect } from 'vitest';
import { featured } from '../src/data/projects';
import { HUES, MARKS, FALLBACK_VISUAL, type Hue } from '../src/data/marks';

/** WCAG relative luminance contrast ratio between two #rrggbb colours. */
function contrast(a: string, b: string): number {
  const lum = (hex: string) => {
    const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((c) =>
      c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4,
    );
    return 0.2126 * r! + 0.7152 * g! + 0.0722 * b!;
  };
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi! + 0.05) / (lo! + 0.05);
}

const NAME_TEXT = { light: '#13263a', dark: '#e3ecf4' } as const;

describe('featured project visuals', () => {
  it('every featured repo has a known mark, a known hue and a tagline', () => {
    for (const f of featured) {
      expect(Object.keys(MARKS), f.repo).toContain(f.visual.mark);
      expect(Object.keys(HUES), f.repo).toContain(f.visual.hue);
      expect(f.visual.tagline.trim(), f.repo).not.toBe('');
    }
  });

  it('gives each featured repo its own hue and its own mark', () => {
    expect(new Set(featured.map((f) => f.visual.hue)).size).toBe(featured.length);
    expect(new Set(featured.map((f) => f.visual.mark)).size).toBe(featured.length);
  });

  it('falls back to a neutral visual for auto-discovered repos', () => {
    expect(FALLBACK_VISUAL.mark).toBe('repo');
    expect(FALLBACK_VISUAL.hue).toBe('slate');
  });
});

describe('hue contrast (WCAG AA, 4.5:1)', () => {
  for (const hue of Object.keys(HUES) as Hue[]) {
    for (const theme of ['light', 'dark'] as const) {
      const { ink, tint } = HUES[hue][theme];
      it(`${hue}/${theme}: project name on the strip tint`, () => {
        expect(contrast(NAME_TEXT[theme], tint)).toBeGreaterThanOrEqual(4.5);
      });
      it(`${hue}/${theme}: language pill (hue on tint)`, () => {
        expect(contrast(ink, tint)).toBeGreaterThanOrEqual(4.5);
      });
    }
  }
});
