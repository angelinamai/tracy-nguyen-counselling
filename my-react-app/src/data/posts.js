// src/data/posts.js

// 1) Load all markdown files as raw text
const modules = import.meta.glob("../content/posts/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
});

// 2) Load all images inside src/assets/blog
const images = import.meta.glob("../assets/blog/*", {
  eager: true,
  import: "default",
});

// helper: resolve hero image from frontmatter filename
function resolveHero(heroFileName) {
  if (!heroFileName) return null;

  const clean = heroFileName.replace(/^["']|["']$/g, "").trim();
  const key = `../assets/blog/${clean}`;

  return images[key] || null;
}

// helper: clean excerpt generator
function generateExcerpt(markdown, maxLength = 160) {
  if (!markdown) return "";

  let content = markdown;

  // Remove frontmatter
  content = content.replace(/^---[\s\S]*?---/, "");

  // Remove blockquotes
  content = content.replace(/^>\s?/gm, "");

  // Remove headings
  content = content.replace(/^#{1,6}\s+/gm, "");

  // Remove bold / italic
  content = content.replace(/(\*\*|__|\*|_)/g, "");

  // Remove inline code
  content = content.replace(/`{1,3}[^`]*`{1,3}/g, "");

  // Remove links but keep text
  content = content.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");

  // Remove images completely
  content = content.replace(/!\[[^\]]*\]\([^)]+\)/g, "");

  // Remove extra line breaks
  content = content.replace(/\n+/g, " ");

  // Collapse spaces
  content = content.replace(/\s+/g, " ").trim();

  if (content.length > maxLength) {
    return content.slice(0, maxLength).trim() + "…";
  }

  return content;
}

export const posts = Object.entries(modules)
  .map(([path, file]) => {
    const slug = path.split("/").pop().replace(".md", "");

    const match = file.match(/---([\s\S]*?)---/);

    let meta = {};
    let body = file;

    if (match) {
      const frontmatter = match[1];
      body = file.replace(match[0], "");

      frontmatter.split("\n").forEach((line) => {
        const trimmed = line.trim();
        if (!trimmed) return;

        const [key, ...rest] = trimmed.split(":");
        if (!key) return;

        meta[key.trim()] = rest.join(":").trim();
      });
    }

    const hero = resolveHero(meta.hero);

    return {
      slug,
      title: meta.title || slug,
      author: meta.author || "",
      date: meta.date || "",
      hero,
      excerpt: generateExcerpt(body),
      body,
    };
  })
  // ✅ SORT: newest first
  .sort((a, b) => new Date(b.date) - new Date(a.date));