
/**
 * Simple RSS generator for Vercel serverless (Node).
 * - Uses SUPABASE_URL and SUPABASE_ANON_KEY from environment (set in Vercel).
 * - Returns XML feed of published posts.
 *
 * Add to project root as /api/rss.js (Vercel will serve at /api/rss).
 */
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

async function fetchPosts() {
  const url = `${SUPABASE_URL}/rest/v1/posts?select=title,slug,excerpt,content,published_at&published=eq.true&order=published_at.desc`;
  const res = await fetch(url, {
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    }
  });
  if (!res.ok) throw new Error('Failed to fetch posts: ' + res.statusText);
  return await res.json();
}

function escapeXml(unsafe) {
  if (!unsafe) return '';
  return unsafe.replace(/[<>&'"]/g, function (c) {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case ''': return '&apos;';
      case '"': return '&quot;';
    }
  });
}

module.exports = async (req, res) => {
  try {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      res.status(500).send('Supabase env vars missing on server.');
      return;
    }
    const posts = await fetchPosts();
    const siteUrl = process.env.SITE_URL || 'https://your-site.com';
    const buildTime = new Date().toUTCString();

    const items = posts.map(p => {
      const link = `${siteUrl}/blog/${p.slug}`;
      const content = escapeXml(p.excerpt ?? p.content.slice(0, 200));
      return `
        <item>
          <title>${escapeXml(p.title)}</title>
          <link>${link}</link>
          <guid isPermaLink="true">${link}</guid>
          <pubDate>${new Date(p.published_at).toUTCString()}</pubDate>
          <description>${content}</description>
        </item>
      `;
    }).join('\n');

    const xml = `<?xml version="1.0" encoding="UTF-8" ?>
      <rss version="2.0">
        <channel>
          <title>YourSiteName - Blog</title>
          <link>${siteUrl}</link>
          <description>Latest posts</description>
          <lastBuildDate>${buildTime}</lastBuildDate>
          ${items}
        </channel>
      </rss>`;

    res.setHeader('Content-Type', 'application/rss+xml');
    res.status(200).send(xml);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error generating RSS');
  }
};
