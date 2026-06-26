import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "StockTool",
    template: "%s | StockTool",
  },
  description: "Markdown-based stock analysis notes and market research blog.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>
        <header className="site-header">
          <Link className="site-logo" href="/">
            StockTool
          </Link>
          <nav className="site-nav" aria-label="Main navigation">
            <Link href="/posts">文章</Link>
          </nav>
        </header>
        <main>{children}</main>
        <footer className="site-footer">
          <p>StockTool 内容仅用于个人研究记录，不构成投资建议。</p>
        </footer>
      </body>
    </html>
  );
}
