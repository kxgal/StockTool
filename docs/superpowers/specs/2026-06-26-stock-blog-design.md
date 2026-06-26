# Stock Blog V1 Design

## Goal

Build a minimal stock-analysis blog that can be deployed quickly to Vercel. The first version prioritizes publishing Markdown articles with a clean public reading experience.

## Product Scope

The site is a public blog. Visitors can read published posts, browse the post list, and open individual article pages.

Administrator access is handled outside the website: anyone with write access to the GitHub repository can create or edit Markdown files and deploy changes through Vercel. The website itself has no login page, no admin dashboard, and no database.

## Architecture

- Framework: Next.js, optimized for Vercel deployment.
- Content source: Markdown files stored in `content/posts/*.md`.
- Rendering: build-time Markdown parsing and static generation where possible.
- Deployment: Vercel connected to the GitHub repository. A push to the deployment branch triggers a new deployment.

## Content Model

Each post is a Markdown file with frontmatter:

```md
---
title: "Post title"
date: "2026-06-26"
summary: "Short summary shown in lists."
tags: ["stock", "analysis"]
published: true
---

Post body in Markdown.
```

`published: false` marks a draft. Draft posts must not appear on public pages.

The filename becomes the post slug, for example `content/posts/market-notes.md` becomes `/posts/market-notes`.

## Pages

### Home: `/`

Shows the site name, a short description, a lightweight disclaimer, and the latest published posts.

### Post List: `/posts`

Shows all published posts sorted by date descending. Each item includes title, date, summary, and tags.

### Post Detail: `/posts/[slug]`

Renders one Markdown article with title, date, tags, and body content.

Missing or unpublished posts return a not-found page.

## Editing Workflow

1. Copy the sample Markdown post template.
2. Edit frontmatter and body content.
3. Set `published: true` when ready.
4. Commit and push to GitHub.
5. Vercel builds and publishes the updated site.

This workflow makes GitHub repository write permission the administrator boundary.

## Out Of Scope For V1

- Web-based admin editor.
- Username/password login.
- Database.
- Stock quote API integration.
- Real-time charts.
- Comments.
- Search.
- Newsletter or RSS.

## Error Handling

- Invalid frontmatter should fail the build with a clear error.
- Draft posts should be filtered out from all public routes.
- Unknown post slugs should render Next.js not-found behavior.

## Testing And Verification

- Verify Markdown parsing with at least one sample post.
- Verify drafts are not listed or routable.
- Run linting if configured by the scaffold.
- Run a production build before treating the site as ready.
- Verify the Vercel deployment path after connecting the GitHub repository.

