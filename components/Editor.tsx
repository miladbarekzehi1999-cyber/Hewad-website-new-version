
/**
 * Editor component with:
 * - title, excerpt, content markdown
 * - tags (comma-separated)
 * - category
 * - featured image upload to Supabase Storage (bucket: post-images)
 *
 * Notes:
 * - Make sure you created a public bucket named "post-images" in Supabase Storage (or adjust bucket name below).
 */
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { makeSlug } from "@/lib/slugify";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function Editor({ user, onSaved }: { user: unknown /* consider replacing with explicit type */, onSaved?: () => void }) {
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("# Hello world");
  const [tagsText, setTagsText] = useState("");
  const [category, setCategory] = useState("");
  const [publishing, setPublishing] = useState(false);
  const [published, setPublished] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [featuredImageUrl, setFeaturedImageUrl] = useState<string | null>(null);

  async function handleImage(file: File | null) {
    if (!file) return;
    setUploadingImage(true);
    try {
      const slug = makeSlug(title || String(Date.now()));
      const filename = encodeURIComponent(file.name);
      const path = `${slug}/${Date.now()}_${filename}`;
      const { data, error } = await supabase.storage.from("post-images").upload(path, file, { cacheControl: "3600", upsert: false });
      if (error) throw error;
      // Make public URL (if bucket public) - otherwise you need signed URLs
      const { publicURL, error: urlErr } = supabase.storage.from("post-images").getPublicUrl(data.path);
      if (urlErr) throw urlErr;
      setFeaturedImageUrl(publicURL);
      alert("Image uploaded");
    } catch (err: unknown /* consider replacing with explicit type */) {
      console.error(err);
      alert("Upload failed: " + (err?.message ?? JSON.stringify(err)));
    } finally {
      setUploadingImage(false);
    }
  }

  async function save() {
    if (!user) return alert("You must be signed in.");
    if (!title) return alert("Please enter a title.");

    setPublishing(true);
    const slug = makeSlug(title);
    const tags = tagsText.split(",").map(t => t.trim()).filter(Boolean);

    const payload: unknown /* consider replacing with explicit type */ = {
      title,
      slug,
      excerpt,
      content,
      published,
      published_at: published ? new Date().toISOString() : null,
      author_id: user.id,
      tags,
      category: category || null,
      featured_image: featuredImageUrl || null,
    };

    const { data, error } = await supabase
      .from("posts")
      .upsert(payload, { onConflict: "slug" })
      .select()
      .single();

    setPublishing(false);
    if (error) {
      console.error(error);
      alert("Save failed: " + error.message);
    } else {
      alert("Saved");
      onSaved?.();
    }
  }

  return (
    <div className="space-y-4">
      <input placeholder="Title" className="w-full p-2 border rounded" value={title} onChange={e => setTitle(e.target.value)} />
      <input placeholder="Short excerpt (optional)" className="w-full p-2 border rounded" value={excerpt} onChange={e => setExcerpt(e.target.value)} />

      <div className="grid gap-3 lg:grid-cols-3">
        <input placeholder="Category (optional)" className="p-2 border rounded" value={category} onChange={e => setCategory(e.target.value)} />
        <input placeholder="Tags (comma-separated)" className="p-2 border rounded" value={tagsText} onChange={e => setTagsText(e.target.value)} />
        <label className="p-2 border rounded text-sm flex items-center gap-2">
          <input type="file" accept="image/*" onChange={e => handleImage(e.target.files?.[0] ?? null)} />
          {uploadingImage ? "Uploading…" : "Upload featured image"}
        </label>
      </div>

      {featuredImageUrl && <img src={featuredImageUrl} alt="featured" className="w-full h-48 object-cover rounded" />}

      <div className="flex items-center gap-3">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} /> Publish now
        </label>
        <button onClick={save} disabled={publishing} className="btn">{publishing ? "Saving…" : "Save post"}</button>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <textarea value={content} onChange={(e) => setContent(e.target.value)} className="p-3 border rounded h-96 w-full" />
        <div className="p-3 border rounded h-96 overflow-auto bg-gray-50">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
