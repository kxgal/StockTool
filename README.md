# StockTool

StockTool is a minimal Markdown blog for publishing stock-analysis notes and market research posts.

## Local Development

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Writing Posts

Posts live in `content/posts/*.md`.

Create a new post by copying `content/post-template.md` into `content/posts/` and renaming it with a lowercase slug:

```bash
cp content/post-template.md content/posts/my-market-note.md
```

Each post uses frontmatter:

```md
---
title: "Post title"
date: "2026-06-26"
summary: "Short summary shown in lists."
tags: ["stock", "analysis"]
published: true
---
```

Set `published: false` while drafting. Draft posts do not appear on public pages and cannot be opened through `/posts/[slug]`.

## Administrator Boundary

The website has no login page or admin dashboard. Administrator access is GitHub repository write access: anyone who can push Markdown changes can publish updates.

## Verification

Run tests:

```bash
npm run test
```

Run linting:

```bash
npm run lint
```

Run a production build:

```bash
npm run build
```

## Deploying To Vercel

1. Push this repository to GitHub.
2. Open Vercel and import `kxgal/StockTool`.
3. Keep the framework preset as Next.js.
4. Use the default build command `next build`.
5. Deploy the project.

After the project is connected, every push to the deployment branch triggers a new Vercel deployment.

## Disclaimer

Content on this site is personal research only and is not investment advice.
