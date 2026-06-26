import Link from "next/link";

export default function NotFound() {
  return (
    <div className="page-shell narrow">
      <div className="page-title">
        <p className="eyebrow">404</p>
        <h1>页面不存在</h1>
        <p>这篇文章可能不存在，或者仍然是草稿。</p>
      </div>
      <Link className="primary-link" href="/posts">
        返回文章列表
      </Link>
    </div>
  );
}
