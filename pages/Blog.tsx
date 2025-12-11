import { Link } from "react-router-dom";
import { blogPosts } from "./src/data/blogPosts";

export default function Blog() {
  const posts = [...blogPosts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="text-center mb-14">
          <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-4">
            وبلاگ
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            تازه‌ترین نوشته‌ها، آموزش‌ها و مطالبی که برای شما آماده کرده‌ایم.
          </p>
        </div>

        {/* Blog Cards */}
        <div className="grid gap-6">
          {posts.map((post) => (
            <Link
              key={post.id}
              to={`/blog/${post.id}`}
              className="block p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200/60 dark:border-gray-700/60 hover:-translate-y-1"
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {post.title}
              </h2>

              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                {new Date(post.date).toLocaleDateString("fa-IR")}
              </p>

              {post.excerpt && (
                <p className="text-gray-700 dark:text-gray-300 leading-7">
                  {post.excerpt}
                </p>
              )}
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}
