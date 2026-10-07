import { HUES, MARKS, type Hue, type MarkName, type Theme } from '../data/marks';

export interface BannerInput {
  name: string;
  tagline: string;
  language: string | null;
  mark: MarkName;
  hue: Hue;
  theme: Theme;
}

const W = 1280;
const H = 320;
const NAME_TEXT: Record<Theme, string> = { light: '#13263a', dark: '#e3ecf4' };
const TAGLINE_TEXT: Record<Theme, string> = { light: '#3f5568', dark: '#a9bccd' };

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Background texture tied to the mark, matching the site's card strips. */
function texture(mark: MarkName, ink: string): string {
  switch (mark) {
    case 'graph':
      return `<defs><pattern id="t" width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="12" cy="12" r="2.5" fill="${ink}" fill-opacity=".2"/></pattern></defs><rect width="${W}" height="${H}" fill="url(#t)"/>`;
    case 'cone': {
      const rings = Array.from({ length: 46 }, (_, i) => `<circle cx="0" cy="${H / 2}" r="${36 + i * 30}"/>`).join('');
      return `<g fill="none" stroke="${ink}" stroke-opacity=".16" stroke-width="2.5">${rings}</g>`;
    }
    case 'bars':
      return `<defs><pattern id="t" width="28" height="28" patternUnits="userSpaceOnUse"><rect width="12" height="28" fill="${ink}" fill-opacity=".12"/></pattern></defs><rect width="${W}" height="${H}" fill="url(#t)"/>`;
    case 'trie':
      return `<defs><pattern id="t" width="32" height="32" patternUnits="userSpaceOnUse"><path d="M0 32 16 16 32 32Z" fill="${ink}" fill-opacity=".1"/></pattern></defs><rect width="${W}" height="${H}" fill="url(#t)"/>`;
    case 'nucleus':
      return `<defs><pattern id="t" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M-5 5 5-5M0 20 20 0M15 25 25 15" stroke="${ink}" stroke-opacity=".14" stroke-width="2.5"/></pattern></defs><rect width="${W}" height="${H}" fill="url(#t)"/>`;
    case 'repo':
      return '';
  }
}

/** A standalone README banner: tint + texture, language pill, serif name, tagline, big cropped mark. */
export function bannerSvg({ name, tagline, language, mark, hue, theme }: BannerInput): string {
  const { ink, tint } = HUES[hue][theme];
  const pillWidth = language ? Math.round(language.length * 11 + 32) : 0;
  const pill = language
    ? `<g class="lang"><rect x="80" y="84" width="${pillWidth}" height="34" rx="17" fill="${tint}" stroke="${ink}" stroke-width="2"/>` +
      `<text x="${80 + pillWidth / 2}" y="107" text-anchor="middle" font-family="ui-monospace,Consolas,'SF Mono',Menlo,monospace" font-size="18" fill="${ink}">${esc(language)}</text></g>`
    : '';
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(`${name}: ${tagline}`)}">`,
    `<rect width="${W}" height="${H}" fill="${tint}"/>`,
    texture(mark, ink),
    `<svg x="930" y="-70" width="420" height="420" viewBox="0 0 40 40" fill="none" stroke="${ink}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" color="${ink}" opacity=".32">${MARKS[mark]}</svg>`,
    pill,
    `<text x="78" y="${language ? 192 : 170}" font-family="Georgia,'Times New Roman',serif" font-size="76" fill="${NAME_TEXT[theme]}">${esc(name)}</text>`,
    `<text x="82" y="${language ? 240 : 218}" font-family="Georgia,'Times New Roman',serif" font-style="italic" font-size="30" fill="${TAGLINE_TEXT[theme]}">${esc(tagline)}</text>`,
    `<text x="82" y="290" font-family="ui-monospace,Consolas,'SF Mono',Menlo,monospace" font-size="18" fill="${ink}">tomas-samek.github.io</text>`,
    '</svg>',
  ].join('\n');
}

/** A small rounded tile with the project mark, for inline use in READMEs (e.g. the profile README list). */
export function markTileSvg({ mark, hue, theme }: { mark: MarkName; hue: Hue; theme: Theme }): string {
  const { ink, tint } = HUES[hue][theme];
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" role="img" aria-hidden="true">`,
    `<rect width="48" height="48" rx="11" fill="${tint}" stroke="${ink}" stroke-opacity=".35"/>`,
    `<svg x="5" y="5" width="38" height="38" viewBox="0 0 40 40" fill="none" stroke="${ink}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" color="${ink}">${MARKS[mark]}</svg>`,
    '</svg>',
  ].join('\n');
}
