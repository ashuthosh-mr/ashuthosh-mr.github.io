/**
 * Turns `photos/<album>/*.jpg` into everything the /foto routes need.
 *
 * Drop images into a folder under `photos/` and that folder becomes an album.
 * Nothing else is required: the album title is derived from the folder name and
 * the photo order follows filename order (natural sort, so 2.jpg precedes 10.jpg).
 *
 * Optionally add `photos/<album>/album.json` to override any of:
 *   { "title", "location", "date", "summary", "cover", "order" }
 *
 * For each photo three derivatives land in `public/foto/<album>/`:
 *   <name>-thumb.webp  grid tile        (900px long edge)
 *   <name>-full.webp   lightbox / hero  (2000px long edge)
 *   plus a tiny inline base64 blur used as the loading placeholder.
 *
 * The manifest is written to `src/data/photos.generated.json`.
 */
import { createHash } from "node:crypto";
import { mkdir, readdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.join(import.meta.dirname, "..");
const SRC_DIR = path.join(ROOT, "photos");
const OUT_DIR = path.join(ROOT, "public", "foto");
const MANIFEST = path.join(ROOT, "src", "data", "photos.generated.json");
const CACHE = path.join(ROOT, ".photo-cache.json");

const IMAGE_RE = /\.(jpe?g|png|webp|tiff?)$/i;
const THUMB_WIDTH = 900;
const FULL_WIDTH = 2000;

const naturalSort = new Intl.Collator("en", { numeric: true, sensitivity: "base" });

/** "bhootha-kola" -> "Bhootha Kola" */
function titleFromSlug(slug) {
  return slug
    .split(/[-_]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

async function readJsonIfPresent(file, fallback) {
  try {
    return JSON.parse(await readFile(file, "utf8"));
  } catch {
    return fallback;
  }
}

async function listAlbumDirs() {
  let entries;
  try {
    entries = await readdir(SRC_DIR, { withFileTypes: true });
  } catch {
    console.warn(`[photos] no ${path.relative(ROOT, SRC_DIR)}/ directory - skipping`);
    return [];
  }
  return entries
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith("."))
    .map((entry) => entry.name)
    .sort(naturalSort.compare);
}

/**
 * Derivatives are expensive, so skip any whose source is unchanged. The cache
 * key covers the encoder settings too, so bumping THUMB_WIDTH et al. correctly
 * invalidates every entry.
 */
function cacheKey(stats) {
  return createHash("sha1")
    .update(`${stats.size}:${stats.mtimeMs}:${THUMB_WIDTH}:${FULL_WIDTH}`)
    .digest("hex");
}

async function processPhoto({ album, file, outDir, cache, nextCache }) {
  const srcPath = path.join(SRC_DIR, album, file);
  const name = path.basename(file, path.extname(file));
  const stats = await stat(srcPath);
  const key = cacheKey(stats);
  const cached = cache[`${album}/${file}`];

  if (cached?.key === key) {
    nextCache[`${album}/${file}`] = cached;
    return cached.photo;
  }

  const image = sharp(srcPath, { failOn: "none" }).rotate();
  const { width = 0, height = 0 } = await image.metadata();

  const [, , blur] = await Promise.all([
    image
      .clone()
      .resize({ width: THUMB_WIDTH, height: THUMB_WIDTH, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 78 })
      .toFile(path.join(outDir, `${name}-thumb.webp`)),
    image
      .clone()
      .resize({ width: FULL_WIDTH, height: FULL_WIDTH, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(path.join(outDir, `${name}-full.webp`)),
    image.clone().resize(16, 16, { fit: "inside" }).webp({ quality: 30 }).toBuffer(),
  ]);

  const photo = {
    name,
    thumb: `/foto/${album}/${name}-thumb.webp`,
    full: `/foto/${album}/${name}-full.webp`,
    width,
    height,
    blurDataURL: `data:image/webp;base64,${blur.toString("base64")}`,
  };

  nextCache[`${album}/${file}`] = { key, photo };
  return photo;
}

async function buildAlbum(album, cache, nextCache) {
  const dir = path.join(SRC_DIR, album);
  const outDir = path.join(OUT_DIR, album);
  await mkdir(outDir, { recursive: true });

  const meta = await readJsonIfPresent(path.join(dir, "album.json"), {});
  const files = (await readdir(dir))
    .filter((file) => IMAGE_RE.test(file))
    .sort(naturalSort.compare);

  if (files.length === 0) {
    console.warn(`[photos] ${album}: no images, skipped`);
    return null;
  }

  const photos = [];
  for (const file of files) {
    photos.push(await processPhoto({ album, file, outDir, cache, nextCache }));
  }

  const cover = photos.find((photo) => photo.name === meta.cover) ?? photos[0];

  return {
    slug: album,
    title: meta.title ?? titleFromSlug(album),
    location: meta.location ?? null,
    date: meta.date ?? null,
    summary: meta.summary ?? null,
    order: typeof meta.order === "number" ? meta.order : null,
    cover,
    photos,
  };
}

async function main() {
  const albumDirs = await listAlbumDirs();
  const cache = await readJsonIfPresent(CACHE, {});
  const nextCache = {};

  const albums = [];
  for (const album of albumDirs) {
    const built = await buildAlbum(album, cache, nextCache);
    if (built) albums.push(built);
  }

  // Explicit `order` wins; the rest fall back to newest date first, then title.
  albums.sort((a, b) => {
    if (a.order !== null || b.order !== null) {
      return (a.order ?? Number.MAX_SAFE_INTEGER) - (b.order ?? Number.MAX_SAFE_INTEGER);
    }
    if (a.date && b.date && a.date !== b.date) return a.date < b.date ? 1 : -1;
    if (a.date && !b.date) return -1;
    if (!a.date && b.date) return 1;
    return naturalSort.compare(a.title, b.title);
  });

  await mkdir(path.dirname(MANIFEST), { recursive: true });
  await writeFile(MANIFEST, `${JSON.stringify(albums, null, 2)}\n`);
  await writeFile(CACHE, `${JSON.stringify(nextCache, null, 2)}\n`);

  const total = albums.reduce((sum, album) => sum + album.photos.length, 0);
  console.log(`[photos] ${albums.length} album(s), ${total} photo(s)`);
}

await main();
