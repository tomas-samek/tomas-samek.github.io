export interface DatedDraftable {
  data: { date: Date; draft: boolean };
}

export function visiblePosts<T extends DatedDraftable>(posts: readonly T[], includeDrafts: boolean): T[] {
  return posts
    .filter((p) => includeDrafts || !p.data.draft)
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export function formatDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}
