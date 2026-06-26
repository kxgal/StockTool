import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { getAllPosts, getPostBySlug } from "./posts";

const createdDirs: string[] = [];

function createPostsDir(files: Record<string, string>) {
  const postsDir = mkdtempSync(join(tmpdir(), "stock-posts-"));
  createdDirs.push(postsDir);
  mkdirSync(postsDir, { recursive: true });

  for (const [filename, content] of Object.entries(files)) {
    writeFileSync(join(postsDir, filename), content);
  }

  return postsDir;
}

afterEach(() => {
  for (const dir of createdDirs.splice(0)) {
    rmSync(dir, { recursive: true, force: true });
  }
});

describe("post content API", () => {
  it("returns published posts sorted by date descending", () => {
    const postsDir = createPostsDir({
      "older.md": `---
title: "Older"
date: "2026-01-01"
summary: "Older summary."
tags: ["market"]
published: true
---

Older body.
`,
      "newer.md": `---
title: "Newer"
date: "2026-06-26"
summary: "Newer summary."
tags: ["stock", "notes"]
published: true
---

Newer body.
`,
      "draft.md": `---
title: "Draft"
date: "2026-06-27"
summary: "Draft summary."
tags: ["draft"]
published: false
---

Draft body.
`,
    });

    const posts = getAllPosts(postsDir);

    expect(posts.map((post) => post.slug)).toEqual(["newer", "older"]);
    expect(posts[0]).toMatchObject({
      title: "Newer",
      summary: "Newer summary.",
      tags: ["stock", "notes"],
      published: true,
    });
  });

  it("renders a published post by slug and rejects draft slugs", async () => {
    const postsDir = createPostsDir({
      "live.md": `---
title: "Live"
date: "2026-06-26"
summary: "Live summary."
tags: ["analysis"]
published: true
---

## Signal

Markdown body.
`,
      "draft.md": `---
title: "Draft"
date: "2026-06-27"
summary: "Draft summary."
tags: ["draft"]
published: false
---

Draft body.
`,
    });

    const live = await getPostBySlug("live", postsDir);
    const draft = await getPostBySlug("draft", postsDir);
    const missing = await getPostBySlug("missing", postsDir);

    expect(live?.slug).toBe("live");
    expect(live?.html).toContain("<h2>Signal</h2>");
    expect(live?.html).toContain("<p>Markdown body.</p>");
    expect(draft).toBeNull();
    expect(missing).toBeNull();
  });

  it("throws a clear error when frontmatter is invalid", () => {
    const postsDir = createPostsDir({
      "broken.md": `---
title: ""
date: "June 26"
summary: "Broken summary."
tags: "stock"
published: true
---

Broken body.
`,
    });

    expect(() => getAllPosts(postsDir)).toThrow(
      /Invalid post frontmatter in .*broken\.md/
    );
  });
});
