import { describe, it, expect } from 'vitest';
import { formatDate, visiblePosts } from '../src/lib/posts';

const post = (id: string, date: string, draft = false) => ({ id, data: { date: new Date(date), draft } });

describe('visiblePosts', () => {
  const posts = [post('old', '2026-01-01'), post('draft', '2026-09-01', true), post('new', '2026-08-01')];

  it('drops drafts and sorts newest first', () => {
    expect(visiblePosts(posts, false).map((p) => p.id)).toEqual(['new', 'old']);
  });

  it('keeps drafts when asked (dev server)', () => {
    expect(visiblePosts(posts, true).map((p) => p.id)).toEqual(['draft', 'new', 'old']);
  });

  it('does not mutate the input', () => {
    const before = posts.map((p) => p.id);
    visiblePosts(posts, false);
    expect(posts.map((p) => p.id)).toEqual(before);
  });
});

describe('formatDate', () => {
  it('formats as YYYY-MM-DD in UTC', () => {
    expect(formatDate(new Date('2026-08-05T23:30:00Z'))).toBe('2026-08-05');
  });
});
