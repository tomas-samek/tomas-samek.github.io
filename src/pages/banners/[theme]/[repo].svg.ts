import type { APIContext } from 'astro';
import type { Theme, Visual } from '../../../data/marks';
import { bannerSvg } from '../../../lib/banner';
import type { FeaturedProject } from '../../../lib/github';
import { loadProjects } from '../../../lib/load-projects';

type Props = { project: FeaturedProject & { visual: Visual }; theme: Theme };

/** README banners: /banners/<light|dark>/<repo>.svg for every featured project. */
export async function getStaticPaths() {
  const { featured } = await loadProjects();
  return featured.flatMap((project) =>
    (['light', 'dark'] as const).map((theme) => ({ params: { theme, repo: project.name }, props: { project, theme } })),
  );
}

export function GET({ props }: APIContext<Props>) {
  const { project, theme } = props;
  const svg = bannerSvg({ name: project.name, language: project.language, theme, ...project.visual });
  return new Response(svg, { headers: { 'Content-Type': 'image/svg+xml; charset=utf-8' } });
}
