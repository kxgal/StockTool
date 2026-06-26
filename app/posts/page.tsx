import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "文章",
  description: "StockTool published Markdown articles.",
};

const dateFormatter = new Intl.DateTimeFormat("zh-CN", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

function formatDate(date: string) {
  return dateFormatter.format(new Date(`${date}T00:00:00+08:00`));
}

export default function PostsPage() {
  const posts = getAllPosts();

  return (
    <div className="page-shell narrow">
      <div className="page-title">
        <p className="eyebrow">Articles</p>
        <h1>全部文章</h1>
      </div>
      <div className="post-list">
        {posts.map((post) => (
          <article className="post-row" key={post.slug}>
            <div className="post-meta">
              <time dateTime={post.date}>{formatDate(post.date)}</time>
              <span>{post.tags.join(" / ")}</span>
            </div>
            <h2>
              <Link href={`/posts/${post.slug}`}>{post.title}</Link>
            </h2>
            <p>{post.summary}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
