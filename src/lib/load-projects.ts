import { exclude, featured, groups } from '../data/projects';
import {
  fetchRepos,
  filterRepos,
  groupRest,
  mergeFeatured,
  type FeaturedProject,
  type ProjectGroup,
} from './github';

export interface LoadedProjects {
  featured: FeaturedProject[];
  groups: ProjectGroup[];
}

let cache: Promise<LoadedProjects> | undefined;

/** One API round-trip per build, shared by every page that needs project data. A failure is not cached. */
export function loadProjects(): Promise<LoadedProjects> {
  cache ??= (async () => {
    const repos = filterRepos(await fetchRepos('tomas-samek', process.env.GITHUB_TOKEN), exclude);
    return {
      featured: mergeFeatured(repos, featured),
      groups: groupRest(
        repos,
        featured.map((f) => f.repo),
        groups,
      ),
    };
  })().catch((err: unknown) => {
    cache = undefined;
    throw err;
  });
  return cache;
}
