import Image from "next/image";
import Link from "next/link";
import { getAllPosts } from "@/lib/posts";

const dateFormatter = new Intl.DateTimeFormat("zh-CN", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

function formatDate(date: string) {
  return dateFormatter.format(new Date(`${date}T00:00:00+08:00`));
}

export default function Home() {
  const latestPosts = getAllPosts().slice(0, 5);

  return (
    <div className="page-shell">
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Markdown Stock Notes</p>
          <h1>StockTool</h1>
          <p className="hero-lede">
            一个快速发布股票研究、市场观察和个人复盘的 Markdown 博客。
          </p>
          <div className="hero-actions">
            <Link className="primary-link" href="/posts">
              查看文章
            </Link>
          </div>
        </div>
        <div className="hero-visual" aria-hidden="true">
          <Image
            src="/market-notes.png"
            alt=""
            width={1200}
            height={720}
            priority
          />
        </div>
      </section>

      <section className="disclaimer" aria-label="免责声明">
        <strong>免责声明：</strong>
        本站内容仅为个人研究记录，不构成任何投资建议。市场有风险，决策需自行验证。
      </section>

      <section className="section-block">
        <div className="section-heading">
          <h2>最新文章</h2>
          <Link href="/posts">全部文章</Link>
        </div>
        <div className="post-grid">
          {latestPosts.map((post) => (
            <article className="post-card" key={post.slug}>
              <div className="post-meta">
                <time dateTime={post.date}>{formatDate(post.date)}</time>
                <span>{post.tags.join(" / ")}</span>
              </div>
              <h3>
                <Link href={`/posts/${post.slug}`}>{post.title}</Link>
              </h3>
              <p>{post.summary}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
