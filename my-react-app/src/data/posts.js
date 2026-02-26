// src/data/posts.js

const enModules = import.meta.glob("../content/posts/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
});

const viModules = import.meta.glob("../content/posts-vi/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
});

const images = import.meta.glob("../assets/blog/*", {
  eager: true,
  import: "default",
});

function resolveHero(heroFileName) {
  if (!heroFileName) return null;

  const clean = heroFileName.replace(/^["']|["']$/g, "").trim();
  const key = `../assets/blog/${clean}`;

  return images[key] || null;
}

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

function parseMarkdownFile(path, file) {
  const slug = path.split("/").pop().replace(".md", "").trim();
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

  return {
    slug,
    title: meta.title || slug,
    author: meta.author || "",
    date: meta.date || "",
    hero: meta.hero || "",
    body,
    excerpt: generateExcerpt(body),
  };
}

const viBySlug = Object.entries(viModules).reduce((acc, [path, file]) => {
  const parsed = parseMarkdownFile(path, file);
  acc[parsed.slug] = parsed;
  return acc;
}, {});

export const posts = Object.entries(enModules)
  .map(([path, file]) => {
    const en = parseMarkdownFile(path, file);
    const vi = viBySlug[en.slug];

    return {
      slug: en.slug,
      hero: resolveHero(en.hero || vi?.hero),
      en: {
        title: en.title,
        author: en.author,
        date: en.date,
        excerpt: en.excerpt,
        body: en.body,
      },
      vi: {
        title: vi?.title || en.title,
        author: vi?.author || en.author,
        date: vi?.date || en.date,
        excerpt: vi?.excerpt || en.excerpt,
        body: vi?.body || en.body,
      },
      sortDate: new Date(en.date),
    };
  })
  .sort((a, b) => b.sortDate - a.sortDate);
