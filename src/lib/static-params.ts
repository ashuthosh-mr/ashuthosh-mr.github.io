/**
 * Next's `output: export` refuses to build a dynamic route whose
 * `generateStaticParams()` returns an empty array:
 *
 *   Page "/blog/[slug]" is missing "generateStaticParams()" so it cannot be
 *   used with "output: export" config.
 *
 * The blog and bookshelf collections ship empty, so emit a single placeholder
 * slug that renders the 404 page. The moment a real `.mdx` document is added
 * the placeholder disappears on its own and the real slugs take over - no code
 * change needed to start publishing.
 */
export const EMPTY_COLLECTION_SLUG = "__empty";

export function slugParams(slugs: string[]): { slug: string }[] {
  if (slugs.length === 0) {
    return [{ slug: EMPTY_COLLECTION_SLUG }];
  }
  return slugs.map((slug) => ({ slug }));
}
