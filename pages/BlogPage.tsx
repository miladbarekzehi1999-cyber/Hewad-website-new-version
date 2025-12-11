// src/pages/BlogPage.tsx
import React, { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { blogPosts, BlogPost } from "../data/blogPosts";
import BlogPagination from "../components/BlogPagination";

const PAGE_SIZE = 5;

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function BlogPage() {
  const navigate = useNavigate();
  const query = useQuery();
  const pageFromUrl = parseInt(query.get("page") || "1", 10);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // collect categories & tags
  const categories = useMemo(() => {
    const set = new Set<string>();
    blogPosts.forEach((p) => (p.categories || []).forEach((c) => set.add(c)));
    return Array.from(set);
  }, []);

  const tags = useMemo(() => {
    const set = new Set<string>();
    blogPosts.forEach((p) => (p.tags || []).forEach((t) => set.add(t)));
    return Array.from(set);
  }, []);

  // filtered posts
  const filtered = useMemo(() => {
    return blogPosts
      .slice() // copy
      .filter((p) => {
        if (selectedCategory && !(p.categories || []).includes(selectedCategory)) return false;
        if (selectedTag && !(p.tags || []).includes(selectedTag)) return false;
        return true;
      })
      .sort((a, b) => (a.date < b.date ? 1 : -1));
  }, [selectedCategory, selectedTag]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(Math.max(pageFromUrl || 1, 1), totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const pagePosts = filtered.slice(start, start + PAGE_SIZE);

  function setPage(p: number) {
    const params = new URLSearchParams();
    if (p > 1) params.set("page", String(p));
    if (selectedCategory) params.set("category", selectedCategory);
    if (selectedTag) params.set("tag", selectedTag);
    navigate({ pathname: "/blog", search: params.toString() });
  }

  // If URL contains category/tag preselected, sync them once
  React.useEffect(() => {
    const cat = query.get("category");
    const tag = query.get("tag");
    if (cat) setSelectedCategory(cat);
    if (tag) setSelectedTag(tag);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 text-white">
      <header className="mb-8">
        <h1 className="text-4xl font-extrabold">بلاگ</h1>
        <p className="mt-2 text-gray-300 max-w-2xl">
          آخرین نوشته‌ها، تحلیل‌ها و راهنماها — مرتب و ساده برای خواندن.
        </p>
      </header>

      <section className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => { setSelectedCategory(null); setSelectedTag(null); setPage(1); }}
            className={`px-3 py-1 rounded-md text-sm ${!selectedCategory && !selectedTag ? "bg-gray-700" : "bg-gray-800 hover:bg-gray-700"}`}
          >
            همه نوشته‌ها
          </button>

          {categories.map((c) => (
            <button
              key={c}
              onClick={() => { setSelectedCategory(c); setSelectedTag(null); setPage(1); }}
              className={`px-3 py-1 rounded-md text-sm ${selectedCategory === c ? "bg-gray-700" : "bg-gray-800 hover:bg-gray-700"}`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="flex gap-2 items-center">
          <span className="text-sm text-gray-400">فیلتر برچسب‌ها:</span>
          <div className="flex flex-wrap gap-2">
            {tags.map((t) => (
              <button
                key={t}
                onClick={() => { setSelectedTag(t); setSelectedCategory(null); setPage(1); }}
                className={`px-2 py-1 rounded-md text-xs ${selectedTag === t ? "bg-gray-700" : "bg-gray-800 hover:bg-gray-700"}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6">
        {pagePosts.length === 0 && (
          <div className="p-6 bg-gray-900 rounded-md text-gray-400">هیچ پستی یافت نشد.</div>
        )}

        {pagePosts.map((post) => (
          <article key={post.id} className="bg-gradient-to-b from-gray-900 to-gray-800 rounded-2xl overflow-hidden shadow-md">
            <Link to={`/blog/${post.id}`} className="block md:flex">
              {post.image && (
                <div className="md:w-1/3 h-48 md:h-auto">
                  {/* image container */}
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              )}

              <div className={`p-6 ${post.image ? "md:w-2/3" : "w-full"}`}>
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-2xl font-semibold">{post.title}</h2>
                  <time className="text-sm text-gray-400">{post.date}</time>
                </div>

                <p className="text-gray-300 mb-4">{post.excerpt}</p>

                <div className="flex gap-2 flex-wrap">
                  {(post.categories || []).map((c) => (
                    <span key={c} className="text-xs bg-gray-700 px-2 py-1 rounded">{c}</span>
                  ))}
                  {(post.tags || []).map((t) => (
                    <span key={t} className="text-xs bg-gray-800 px-2 py-1 rounded">{t}</span>
                  ))}
                </div>
              </div>
            </Link>
          </article>
        ))}
      </section>

      <footer className="mt-8">
        <BlogPagination currentPage={currentPage} totalPages={totalPages} onPageChange={setPage} />
      </footer>
    </div>
  );
}
