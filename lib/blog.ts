
/**
 * Post type used across the blog components.
 * - tags is an array of strings (e.g. ["news","crypto"])
 * - category is a single category string (e.g. "Market")
 * - featured_image holds a public URL to the uploaded image (if any)
 */
export type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  content: string;
  published: boolean;
  published_at?: string | null;
  author_id?: string | null;
  created_at?: string;
  updated_at?: string;
  tags?: string[] | null;
  category?: string | null;
  featured_image?: string | null;
};
