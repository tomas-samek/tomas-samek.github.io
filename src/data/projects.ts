import type { FeaturedConfig } from '../lib/github';

/** Display order on the home and projects pages = array order. */
export const featured: readonly FeaturedConfig[] = [
  {
    repo: 'tiko-di',
    blurb:
      'A compile-time orchestrator for Java 21+. An annotation processor validates and generates all the wiring: no reflection, no classpath scanning. DI and an event bus ship in the core; HTTP, databases and caches plug in directly via @Produces.',
    keyResult: 'On Maven Central · Java 21–27',
  },
  {
    repo: 'causal-cone-engine',
    blurb:
      'An experimental GPU renderer in Rust + wgpu. Entities push light along a graph of connections, one hop per tick, and the screen is a receptor array those same pipes feed.',
    keyResult: 'No rays, no meshes, no lights: light is delivered, not gathered',
  },
  {
    repo: 'llm-framework-benchmark',
    blurb:
      'Can an AI coding agent build the same framework-neutral spec on different stacks? An external black-box oracle grades every run, so the only variable is the framework, and the agent.',
    keyResult: 'Spring Boot 4.0.6: 1 pass in 20 · Tiko 0.5.0: 15/15',
  },
  {
    repo: 'trie-memory',
    blurb:
      'An experimental MCP memory server in Rust: a delta-encoded recognition trie paired with a concept store, with explicit Answer / Partial / Unknown states instead of confident guesses.',
    keyResult: 'Binds words across languages into one concept, append-only, built not to fabricate',
  },
];

/** Never shown: the profile README repo and this site's repo. */
export const exclude: readonly string[] = ['tomas-samek', 'tomas-samek.github.io'];

/** Topic → section title for non-featured repos. First match in this order wins; unmatched → "Other". */
export const groups: Readonly<Record<string, string>> = {
  'pet-project': 'Experiments',
};
