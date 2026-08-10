/* eslint-disable @next/next/no-img-element */
import BlurFade from "@/components/magicui/blur-fade";
import { allBooks } from "content-collections";
import { withBasePath } from "@/lib/utils";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Bookshelf",
  description: "Books I have read, with notes and takeaways.",
  openGraph: {
    title: "Bookshelf",
    description: "Books I have read, with notes and takeaways.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bookshelf",
    description: "Books I have read, with notes and takeaways.",
  },
};

const BLUR_FADE_DELAY = 0.04;

function getSlug(book: (typeof allBooks)[number]) {
  return book._meta.path.replace(/\.mdx$/, "");
}

export default function BookshelfPage() {
  const books = [...allBooks].sort((a, b) => a.title.localeCompare(b.title));

  return (
    <main className="min-h-dvh flex flex-col gap-8">
      <BlurFade delay={BLUR_FADE_DELAY}>
        <div className="flex min-h-0 flex-col gap-y-2">
          <h1 className="text-3xl font-semibold tracking-tighter sm:text-4xl">
            Bookshelf
          </h1>
          <p className="text-muted-foreground">
            Books I have read and my reflections
          </p>
        </div>
      </BlurFade>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-5 sm:gap-6">
        {books.map((book, id) => {
          const slug = getSlug(book);
          return (
            <BlurFade key={slug} delay={BLUR_FADE_DELAY * 2 + id * 0.04}>
              <Link
                href={`/bookshelf/${slug}`}
                className="group flex flex-col gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-lg"
              >
                <div className="relative aspect-2/3 overflow-hidden rounded-lg border border-border bg-muted shadow-sm transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:shadow-md">
                  <img
                    src={withBasePath(book.cover)}
                    alt={`Cover of ${book.title}`}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="flex flex-col gap-0.5 min-w-0">
                  <h2 className="text-sm font-semibold leading-snug tracking-tight group-hover:text-foreground transition-colors line-clamp-2">
                    {book.title}
                  </h2>
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    {book.author}
                  </p>
                </div>
              </Link>
            </BlurFade>
          );
        })}
      </div>
    </main>
  );
}
