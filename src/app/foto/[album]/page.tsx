import BlurFade from "@/components/magicui/blur-fade";
import PhotoLightbox from "@/components/photo-lightbox";
import { albumMeta, albums, getAlbum } from "@/lib/photos";
import { withBasePath } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

const BLUR_FADE_DELAY = 0.04;

/**
 * `output: export` rejects a dynamic route whose params list is empty, so keep a
 * placeholder slug alive while `photos/` has no albums. It disappears on its own
 * once a real album folder exists.
 */
const EMPTY_ALBUM_SLUG = "__empty";

export function generateStaticParams() {
  if (albums.length === 0) return [{ album: EMPTY_ALBUM_SLUG }];
  return albums.map((album) => ({ album: album.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ album: string }>;
}): Promise<Metadata> {
  const { album: slug } = await params;
  const album = getAlbum(slug);
  if (!album) return {};

  const description =
    album.summary ?? [albumMeta(album), `${album.photos.length} frames`].filter(Boolean).join(" · ");
  const image = withBasePath(album.cover.full);

  return {
    title: album.title,
    description,
    openGraph: {
      title: album.title,
      description,
      type: "article",
      images: [{ url: image, alt: album.title }],
    },
    twitter: { card: "summary_large_image", title: album.title, description, images: [image] },
  };
}

export default async function AlbumPage({
  params,
}: {
  params: Promise<{ album: string }>;
}) {
  const { album: slug } = await params;
  const album = getAlbum(slug);
  if (!album) notFound();

  const meta = albumMeta(album);

  return (
    <main className="min-h-dvh flex flex-col gap-8">
      <BlurFade delay={BLUR_FADE_DELAY}>
        <div className="flex min-h-0 flex-col gap-y-3">
          <Link
            href="/foto"
            className="group inline-flex w-fit items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded"
          >
            <ChevronLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" />
            Photography
          </Link>
          <h1 className="text-3xl font-semibold tracking-tighter sm:text-4xl">
            {album.title}
          </h1>
          <p className="text-sm text-muted-foreground">
            {meta && <span>{meta}</span>}
            {meta && <span className="mx-2 text-muted-foreground/40">·</span>}
            <span>{album.photos.length} frames</span>
          </p>
          {album.summary && (
            <p className="text-muted-foreground">{album.summary}</p>
          )}
        </div>
      </BlurFade>

      <PhotoLightbox photos={album.photos} albumTitle={album.title} />
    </main>
  );
}
