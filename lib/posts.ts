import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

export const POSTS_DIR = path.join(process.cwd(), "content", "posts");

export type PostMatter = {
  title: string;
  date: string;
  summary: string;
  tags: string[];
  published: boolean;
};

export type PostSummary = PostMatter & {
  slug: string;
};

export type Post = PostSummary & {
  content: string;
  html: string;
};

type RawPost = PostSummary & {
  content: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function validateMatter(data: unknown, filePath: string): PostMatter {
  const errors: string[] = [];

  if (!isRecord(data)) {
    throw new Error(
      `Invalid post frontmatter in ${filePath}: frontmatter must be an object`
    );
  }

  const { title, date, summary, tags, published } = data;

  if (typeof title !== "string" || title.trim().length === 0) {
    errors.push("title must be a non-empty string");
  }

  if (typeof date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    errors.push("date must use YYYY-MM-DD format");
  }

  if (typeof summary !== "string" || summary.trim().length === 0) {
    errors.push("summary must be a non-empty string");
  }

  if (!Array.isArray(tags) || !tags.every((tag) => typeof tag === "string")) {
    errors.push("tags must be an array of strings");
  }

  if (typeof published !== "boolean") {
    errors.push("published must be a boolean");
  }

  if (errors.length > 0) {
    throw new Error(
      `Invalid post frontmatter in ${filePath}: ${errors.join("; ")}`
    );
  }

  const validTitle = title as string;
  const validDate = date as string;
  const validSummary = summary as string;
  const validTags = tags as string[];
  const validPublished = published as boolean;

  return {
    title: validTitle.trim(),
    date: validDate,
    summary: validSummary.trim(),
    tags: validTags,
    published: validPublished,
  };
}

function slugFromFilename(filename: string) {
  return filename.replace(/\.md$/, "");
}

function readMarkdownFiles(postsDirectory: string) {
  if (!existsSync(postsDirectory)) {
    return [];
  }

  return readdirSync(postsDirectory)
    .filter((filename) => filename.endsWith(".md"))
    .sort();
}

function readPostFile(filename: string, postsDirectory: string): RawPost {
  const filePath = path.join(postsDirectory, filename);
  const raw = readFileSync(filePath, "utf8");
  const parsed = matter(raw);
  const frontmatter = validateMatter(parsed.data, filePath);

  return {
    slug: slugFromFilename(filename),
    content: parsed.content.trim(),
    ...frontmatter,
  };
}

export function getAllPosts(postsDirectory = POSTS_DIR): PostSummary[] {
  return readMarkdownFiles(postsDirectory)
    .map((filename) => readPostFile(filename, postsDirectory))
    .filter((post) => post.published)
    .map((post) => ({
      slug: post.slug,
      title: post.title,
      date: post.date,
      summary: post.summary,
      tags: post.tags,
      published: post.published,
    }))
    .sort((left, right) => right.date.localeCompare(left.date));
}

export async function getPostBySlug(
  slug: string,
  postsDirectory = POSTS_DIR
): Promise<Post | null> {
  if (!/^[a-z0-9-]+$/.test(slug)) {
    return null;
  }

  const filename = `${slug}.md`;
  const filePath = path.join(postsDirectory, filename);

  if (!existsSync(filePath)) {
    return null;
  }

  const post = readPostFile(filename, postsDirectory);

  if (!post.published) {
    return null;
  }

  const processed = await remark().use(html).process(post.content);

  return {
    ...post,
    html: processed.toString(),
  };
}
