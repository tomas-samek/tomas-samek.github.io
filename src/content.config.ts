import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { featured } from './data/projects';
import { absolutiseReadmeUrls, fetchReadme, stripReadmeHeader, stripSiteLinks } from './lib/readme';

const OWNER = 'tomas-samek';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    summary: z.string(),
    draft: z.boolean().default(false),
    crosspost: z.url().optional(),
  }),
});

/** Each featured repo's README, rendered at build time for its /projects/<repo>/ page. Id = repo name. */
const readmes = defineCollection({
  loader: {
    name: 'github-readmes',
    async load({ store, renderMarkdown, logger }) {
      store.clear();
      for (const { repo } of featured) {
        const md = await fetchReadme(OWNER, repo, process.env.GITHUB_TOKEN);
        if (md === null) {
          logger.warn(`${repo} has no README; its project page shows the summary only.`);
          continue;
        }
        const rendered = await renderMarkdown(stripSiteLinks(stripReadmeHeader(md)));
        store.set({ id: repo, data: {}, rendered: { ...rendered, html: absolutiseReadmeUrls(rendered.html, OWNER, repo) } });
      }
    },
  },
  schema: z.object({}),
});

export const collections = { posts, readmes };
