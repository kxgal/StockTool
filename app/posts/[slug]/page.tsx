import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { formatPostDate } from "@/lib/format-date";
import { getAllPosts, getPostBySlug } from "@/lib/posts";

type PostPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return getAllPosts().map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: "文章不存在",
    };
  }

  return {
    title: post.title,
    description: post.summary,
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="article-shell">
      <header className="article-header">
        <div className="post-meta">
          <time dateTime={post.date}>{formatPostDate(post.date)}</time>
          <span>{post.tags.join(" / ")}</span>
        </div>
        <h1>{post.title}</h1>
        <p>{post.summary}</p>
      </header>
      <div
        className="markdown-body"
        dangerouslySetInnerHTML={{ __html: post.html }}
      />
    </article>
  );
}
