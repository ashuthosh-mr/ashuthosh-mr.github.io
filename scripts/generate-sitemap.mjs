#!/usr/bin/env node
/**
 * generate-sitemap.mjs
 * Run after `next build` to produce public/sitemap.xml
 * Usage: node scripts/generate-sitemap.mjs
 */

import { readdir, writeFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://shiwani42.github.io";

/** Resolve publishedAt from an MDX file's frontmatter */
async function getPostMeta(filePath) {
  const { readFile } = await import("fs/promises");
  const content = await readFile(filePath, "utf-8");
  const publishedAtMatch = content.match(/publishedAt:\s*"([^"]+)"/);
  const updatedAtMatch = content.match(/updatedAt:\s*"([^"]+)"/);
  return {
    publishedAt: publishedAtMatch ? publishedAtMatch[1] : null,
    updatedAt: updatedAtMatch ? updatedAtMatch[1] : null,
  };
}

async function generateSitemap() {
  const today = new Date().toISOString().split("T")[0];

  /** Static routes */
  const staticRoutes = [
    { url: "/", priority: "1.0", changefreq: "weekly", lastmod: today },
    { url: "/blog", priority: "0.8", changefreq: "daily", lastmod: today },
    { url: "/bookshelf", priority: "0.8", changefreq: "weekly", lastmod: today },
  ];

  /** Blog post routes (from content/*.mdx) */
  const contentDir = path.join(root, "content");
  let blogRoutes = [];
  try {
    const files = await readdir(contentDir);
    const mdxFiles = files.filter((f) => f.endsWith(".mdx"));

    blogRoutes = await Promise.all(
      mdxFiles.map(async (file) => {
        const slug = file.replace(/\.mdx$/, "");
        const filePath = path.join(contentDir, file);
        const { publishedAt, updatedAt } = await getPostMeta(filePath);
        return {
          url: `/blog/${slug}`,
          priority: "0.7",
          changefreq: "monthly",
          lastmod: updatedAt || publishedAt || today,
        };
      })
    );
  } catch {
    console.warn("No content directory found, skipping blog routes.");
  }

  /** Book note routes (from content/books/*.mdx) */
  const booksDir = path.join(root, "content", "books");
  let bookRoutes = [];
  try {
    const files = await readdir(booksDir);
    const mdxFiles = files.filter((f) => f.endsWith(".mdx"));
    bookRoutes = mdxFiles.map((file) => ({
      url: `/bookshelf/${file.replace(/\.mdx$/, "")}`,
      priority: "0.6",
      changefreq: "monthly",
      lastmod: today,
    }));
  } catch {
    console.warn("No books directory found, skipping book routes.");
  }

  const allRoutes = [...staticRoutes, ...blogRoutes, ...bookRoutes];

  const urlEntries = allRoutes
    .map(
      ({ url, priority, changefreq, lastmod }) => `  <url>
    <loc>${SITE_URL}${url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
    )
    .join("\n");

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${urlEntries}
</urlset>`;

  const outputPath = path.join(root, "public", "sitemap.xml");
  await writeFile(outputPath, sitemap, "utf-8");
  console.log(`sitemap.xml generated at ${outputPath}`);
  console.log(`   Routes: ${allRoutes.map((r) => r.url).join(", ")}`);
}

generateSitemap().catch((err) => {
  console.error("Failed to generate sitemap:", err);
  process.exit(1);
});
