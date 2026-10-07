/**
 * Project marks and colours, shared by the site cards (ProjectMark.astro) and the
 * README banners (src/lib/banner.ts → /banners/<theme>/<repo>.svg).
 */

export type MarkName = 'graph' | 'cone' | 'bars' | 'trie' | 'nucleus' | 'repo';
export type Hue = 'teal' | 'amber' | 'violet' | 'rose' | 'emerald' | 'slate';
export type Theme = 'light' | 'dark';

export interface Visual {
  mark: MarkName;
  hue: Hue;
  /** One line for the README banner. */
  tagline: string;
}

/** Inner SVG markup for a 40×40 viewBox, drawn with stroke="currentColor", fill="none". */
export const MARKS: Record<MarkName, string> = {
  // Dependency graph: a hub wired to its dependencies.
  graph:
    '<path d="M20 20 9 10M20 20 9 30M20 20 31 11M20 20 31 29"/>' +
    '<circle cx="20" cy="20" r="5" fill="currentColor"/>' +
    '<circle cx="9" cy="10" r="3.5"/><circle cx="9" cy="30" r="3.5"/>' +
    '<circle cx="31" cy="11" r="3.5"/><circle cx="31" cy="29" r="3.5"/>',
  // Light cone: wavefronts travelling from a source to a receptor plane.
  cone:
    '<path d="M6 20 34 7M6 20 34 33"/>' +
    '<path d="M15 16a10 10 0 0 1 0 8"/><path d="M23 12.5a17 17 0 0 1 0 15"/>' +
    '<path d="M34 7v26" stroke-dasharray="2 3.2"/>' +
    '<circle cx="6" cy="20" r="2.6" fill="currentColor"/>',
  // Benchmark: a full bar that passes, an empty one that fails.
  bars:
    '<path d="M5 34h30"/>' +
    '<rect x="8.5" y="15" width="8" height="19" rx="1.5"/>' +
    '<rect x="23.5" y="30.5" width="8" height="3.5" rx="1"/>' +
    '<path d="M9 9l3 3 5-6"/><path d="M24.5 19.5l6 6M30.5 19.5l-6 6"/>',
  // Trie: branching memory with one honest "Unknown" (dashed) node.
  trie:
    '<circle cx="20" cy="7" r="3.2" fill="currentColor"/>' +
    '<path d="M20 10.2v4.3M20 14.5 10 21M20 14.5V21M20 14.5 30 21"/>' +
    '<circle cx="10" cy="24" r="3.2"/><circle cx="20" cy="24" r="3.2"/>' +
    '<circle cx="30" cy="24" r="3.2" stroke-dasharray="2.2 2"/>' +
    '<path d="M10 27.2v4.3"/><circle cx="10" cy="34.5" r="2.8"/>' +
    '<path d="M20 27.2v4.3"/><circle cx="20" cy="34.5" r="2.8" fill="currentColor"/>',
  // Nucleus: a core with connectors reaching out to its bonds, like tdm-engine's 2D view.
  nucleus:
    '<path d="M26 20h7M24.2 24.2l5 5M20 26v7M15.8 24.2l-5 5M14 20H7M15.8 15.8l-5-5M20 14V7M24.2 15.8l5-5"/>' +
    '<circle cx="20" cy="20" r="6" fill="currentColor"/>' +
    '<circle cx="36" cy="20" r="2.4"/><circle cx="31.3" cy="31.3" r="2.4"/><circle cx="20" cy="36" r="2.4"/><circle cx="8.7" cy="31.3" r="2.4"/>' +
    '<circle cx="4" cy="20" r="2.4"/><circle cx="8.7" cy="8.7" r="2.4"/><circle cx="20" cy="4" r="2.4"/><circle cx="31.3" cy="8.7" r="2.4"/>',
  // Generic repo (auto-discovered projects): a branch and merge.
  repo:
    '<circle cx="12" cy="9" r="3.5"/><circle cx="12" cy="31" r="3.5"/><circle cx="28" cy="15" r="3.5"/>' +
    '<path d="M12 12.5v15M28 18.5c0 6.5-16 3.5-16 9"/>',
};

/** ink: mark, pill and accent colour; tint: strip/banner background. Both themes meet WCAG AA (see test/marks.test.ts). */
export const HUES: Record<Hue, Record<Theme, { ink: string; tint: string }>> = {
  teal: { light: { ink: '#0e7490', tint: '#ecfeff' }, dark: { ink: '#22b8cf', tint: '#082f3a' } },
  amber: { light: { ink: '#b45309', tint: '#fffbeb' }, dark: { ink: '#f59e0b', tint: '#2f1a06' } },
  violet: { light: { ink: '#6d28d9', tint: '#f5f3ff' }, dark: { ink: '#a78bfa', tint: '#1e1440' } },
  rose: { light: { ink: '#be123c', tint: '#fff1f2' }, dark: { ink: '#fb7185', tint: '#33101a' } },
  emerald: { light: { ink: '#047857', tint: '#ecfdf5' }, dark: { ink: '#34d399', tint: '#062e22' } },
  slate: { light: { ink: '#475569', tint: '#f1f5f9' }, dark: { ink: '#94a3b8', tint: '#1e293b' } },
};

export const FALLBACK_VISUAL: Omit<Visual, 'tagline'> = { mark: 'repo', hue: 'slate' };
