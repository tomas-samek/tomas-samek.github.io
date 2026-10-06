import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getPosts } from '../lib/get-posts';

export async function GET(context: APIContext) {
  const posts = await getPosts();
  return rss({
    title: 'Tomáš Samek — writing',
    description: "I build whatever I find interesting, and push it until it can't go any faster.",
    site: context.site!,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.summary,
      link: `/writing/${post.id}/`,
    })),
  });
}
