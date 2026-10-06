import { getCollection, type CollectionEntry } from 'astro:content';
import { visiblePosts } from './posts';

/** Published posts, newest first. Drafts appear only under `astro dev`. */
export async function getPosts(): Promise<CollectionEntry<'posts'>[]> {
  return visiblePosts(await getCollection('posts'), import.meta.env.DEV);
}
