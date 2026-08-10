/* eslint-disable @next/next/no-img-element */
import { allBooks } from "content-collections";
import { withBasePath } from "@/lib/utils";
import { DATA } from "@/data/resume";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXContent } from "@content-collections/mdx/react";
import { mdxComponents } from "@/mdx-components";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

function getSlug(book: (typeof allBooks)[number]) {
  return book._meta.path.replace(/\.mdx$/, "");
}

function getSortedBooks() {
  return [...allBooks].sort((a, b) => a.title.localeCompare(b.title));
}

export async function generateStaticParams() {
  return allBooks.map((book) => ({
    slug: getSlug(book),
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata | undefined> {
  const { slug } = await params;
  const book = allBooks.find((b) => getSlug(b) === slug);
  if (!book) return undefined;

  const description =
    book.summary || `Reading notes on ${book.title} by ${book.author}.`;

  return {
    title: book.title,
    description,
    openGraph: {
      title: book.title,
      description,
      type: "article",
      url: `${DATA.url}/bookshelf/${slug}`,
      images: [
        {
          url: `${DATA.url}${withBasePath(book.cover)}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: book.title,
      description,
      images: [`${DATA.url}${withBasePath(book.cover)}`],
    },
  };
}

export default async function BookNotesPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const sortedBooks = getSortedBooks();
  const currentIndex = sortedBooks.findIndex((b) => getSlug(b) === slug);
  const book = sortedBooks[currentIndex];

  if (!book) {
    notFound();
  }

  const previousBook = currentIndex > 0 ? sortedBooks[currentIndex - 1] : null;
  const nextBook =
    currentIndex < sortedBooks.length - 1 ? sortedBooks[currentIndex + 1] : null;

  const description =
    book.summary || `Reading notes on ${book.title} by ${book.author}.`;

  const jsonLdContent = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Book",
    name: book.title,
    author: {
      "@type": "Person",
      name: book.author,
    },
    image: `${DATA.url}${withBasePath(book.cover)}`,
    url: `${DATA.url}/bookshelf/${slug}`,
    description,
  }).replace(/</g, "\\u003c");

  return (
    <section id="book">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: jsonLdContent }}
      />

      <Link
        href="/bookshelf"
        className="text-sm text-muted-foreground hover:text-foreground transition-colors border border-border rounded-lg px-2 py-1 inline-flex items-center gap-1 mb-6 group"
        aria-label="Back to Bookshelf"
      >
        <ChevronLeft className="size-3 group-hover:-translate-x-px transition-transform" />
        Back to Bookshelf
      </Link>

      <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-start">
        <div className="w-36 sm:w-44 shrink-0 overflow-hidden rounded-lg border border-border shadow-sm bg-muted">
          <img
            src={withBasePath(book.cover)}
            alt={`Cover of ${book.title}`}
            className="w-full h-auto object-cover"
          />
        </div>
        <div className="flex flex-col gap-2 min-w-0">
          <h1 className="title font-semibold text-3xl md:text-4xl tracking-tighter leading-tight">
            {book.title}
          </h1>
          <p className="text-sm text-muted-foreground">{book.author}</p>
          {book.summary ? (
            <p className="text-sm text-muted-foreground leading-relaxed max-w-prose">
              {book.summary}
            </p>
          ) : null}
        </div>
      </div>

      <div className="my-8 flex w-full items-center">
        <div
          className="flex-1 h-px bg-border"
          style={{
            maskImage:
              "linear-gradient(90deg, transparent, black 8%, black 92%, transparent)",
            WebkitMaskImage:
              "linear-gradient(90deg, transparent, black 8%, black 92%, transparent)",
          }}
        />
      </div>

      <article className="prose max-w-full text-pretty font-sans leading-relaxed text-muted-foreground dark:prose-invert">
        <MDXContent code={book.mdx} components={mdxComponents} />
      </article>

      <nav className="mt-12 pt-8 max-w-2xl">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          {previousBook ? (
            <Link
              href={`/bookshelf/${getSlug(previousBook)}`}
              className="group flex-1 flex flex-col gap-1 p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors"
            >
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <ChevronLeft className="size-3" />
                Previous
              </span>
              <span className="text-sm font-medium group-hover:text-foreground transition-colors whitespace-normal wrap-break-word">
                {previousBook.title}
              </span>
            </Link>
          ) : (
            <div className="hidden sm:block flex-1" />
          )}

          {nextBook ? (
            <Link
              href={`/bookshelf/${getSlug(nextBook)}`}
              className="group flex-1 flex flex-col gap-1 p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors text-right"
            >
              <span className="flex items-center justify-end gap-1 text-xs text-muted-foreground">
                Next
                <ChevronRight className="size-3" />
              </span>
              <span className="text-sm font-medium group-hover:text-foreground transition-colors whitespace-normal wrap-break-word">
                {nextBook.title}
              </span>
            </Link>
          ) : (
            <div className="hidden sm:block flex-1" />
          )}
        </div>
      </nav>
    </section>
  );
}
