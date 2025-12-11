import { useParams, Link } from "react-router-dom";
import { blogPosts } from "./src/data/blogPosts";

export default function BlogPost() {
  const { id } = useParams();
  const post = blogPosts.find((p) => p.id.toString() === id);

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center p-6">
        <div>
          <h1 className="text-3xl font-bold mb-4">پست پیدا نشد</h1>
          <Link to="/blog" className="text-blue-500 underline">
            بازگشت به وبلاگ
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 pb-16 px-5">
      <div className="max-w-3xl mx-auto">

        {/* Back Button */}
        <Link
          to="/blog"
          className="inline-block mb-6 text-blue-600 dark:text-blue-400 hover:underline"
        >
          ← بازگشت
        </Link>

        {/* Title */}
        <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-3 leading-tight">
          {post.title}
        </h1>

        {/* Date */}
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-10">
          {new Date(post.date).toLocaleDateString("fa-IR")}
        </p>

        {/* Content */}
        <article
          className="prose prose-lg dark:prose-invert max-w-none leading-9 prose-headings:font-bold prose-p:text-gray-800 dark:prose-p:text-gray-200"
        >
          {post.content?.split("\n").map((para, idx) => (
            <p key={idx}>{para}</p>
          ))}
        </article>
      </div>
    </div>
  );
}
