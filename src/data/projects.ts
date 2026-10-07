import type { FeaturedConfig } from '../lib/github';
import type { Visual } from './marks';

/** Display order on the home and projects pages = array order. Each needs its own mark and hue (see marks.ts). */
export const featured: readonly (FeaturedConfig & { visual: Visual })[] = [
  {
    repo: 'tiko-di',
    blurb:
      'A compile-time orchestrator for Java 21+. An annotation processor validates and generates all the wiring: no reflection, no classpath scanning. DI and an event bus ship in the core; HTTP, databases and caches plug in directly via @Produces.',
    keyResult: 'On Maven Central · Java 21–27',
    visual: { mark: 'graph', hue: 'teal', tagline: 'Compile-time orchestrator for Java 21+' },
  },
  {
    repo: 'causal-cone-engine',
    blurb:
      'An experimental GPU renderer in Rust + wgpu. Entities push light along a graph of connections, one hop per tick, and the screen is a receptor array those same pipes feed.',
    keyResult: 'No rays, no meshes, no lights: light is delivered, not gathered',
    visual: { mark: 'cone', hue: 'amber', tagline: 'Light is delivered, not gathered' },
  },
  {
    repo: 'llm-framework-benchmark',
    blurb:
      'Can an AI coding agent build the same framework-neutral spec on different stacks? An external black-box oracle grades every run, so the only variable is the framework, and the agent.',
    keyResult: 'Spring Boot 3.3.5 passes; 4.0.6 fails 19 of 20 one-shot runs · with a test loop, 12/12 recover',
    visual: { mark: 'bars', hue: 'violet', tagline: 'Same spec, different stacks, graded by an external oracle' },
  },
  {
    repo: 'trie-memory',
    blurb:
      'An experimental MCP memory server in Rust: a delta-encoded recognition trie paired with a concept store, with explicit Answer / Partial / Unknown states instead of confident guesses.',
    keyResult: 'Binds words across languages into one concept, append-only, built not to fabricate',
    visual: { mark: 'trie', hue: 'rose', tagline: 'Memory for AI agents, built not to fabricate' },
  },
  {
    repo: 'tdm-demo',
    language: 'Rust',
    blurb:
      "A toy physics visualization I built for my kids' school project, running in the browser. Atoms and nuclei are networks of elastic connectors that soak up noise tick by tick, stretch, radiate what they can't hold, and snap. Uranium decays on its own.",
    keyResult: 'Rust → WebAssembly · integer-only, no floats · not real physics',
    visual: { mark: 'nucleus', hue: 'emerald', tagline: 'A toy atom, running in your browser' },
  },
];

/** Never shown: the profile README repo and this site's repo. */
export const exclude: readonly string[] = ['tomas-samek', 'tomas-samek.github.io'];

/** Topic → section title for non-featured repos. First match in this order wins; unmatched → "Other". */
export const groups: Readonly<Record<string, string>> = {
  'pet-project': 'Experiments',
};
