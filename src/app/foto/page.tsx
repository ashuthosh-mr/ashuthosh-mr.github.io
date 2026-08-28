/* eslint-disable @next/next/no-img-element */
import BlurFade from "@/components/magicui/blur-fade";
import PhotoLightbox from "@/components/photo-lightbox";
import { albumMeta, albums, frames, featuredMode, singles } from "@/lib/photos";
import { withBasePath } from "@/lib/utils";
import type { Metadata } from "next";
import Link from "next/link";

const DESCRIPTION = "Photographs from Bengaluru and elsewhere.";

export const metadata: Metadata = {
  title: "Photography",
  description: DESCRIPTION,
  openGraph: { title: "Photography", description: DESCRIPTION },
  twitter: {
    card: "summary_large_image",
    title: "Photography",
    description: DESCRIPTION,
  },
};

const BLUR_FADE_DELAY = 0.04;

export default function FotoPage() {
  const photoCount =
    albums.reduce((sum, album) => sum + album.photos.length, 0) +
    singles.length;

  return (
    <main className="min-h-dvh flex flex-col gap-12">
      <div className="flex flex-col gap-8">
        <BlurFade delay={BLUR_FADE_DELAY} className="photo-breakout">
          <div className="flex min-h-0 flex-col gap-y-2">
            <h1 className="text-3xl font-semibold tracking-tighter sm:text-4xl">
              Photography
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              {DESCRIPTION}
              {photoCount > 0 && (
                <span className="text-muted-foreground/70">
                  {" "}
                  {albums.length} {albums.length === 1 ? "album" : "albums"},{" "}
                  {photoCount} frames.
                </span>
              )}
            </p>
          </div>
        </BlurFade>

        {frames.length > 0 && (
          <div className="photo-breakout">
            <PhotoLightbox
              photos={frames}
              albumTitle="Photography"
              columns="columns-2 lg:columns-3"
            />
          </div>
        )}
      </div>

      {albums.length === 0 ? (
        <BlurFade delay={BLUR_FADE_DELAY * 2}>
          <div className="flex flex-col items-center justify-center py-12 px-4 border border-border rounded-xl">
            <p className="text-muted-foreground text-center">
              No albums yet. Check back soon!
            </p>
          </div>
        </BlurFade>
      ) : (
        <section className="flex flex-col gap-6">
          <BlurFade delay={BLUR_FADE_DELAY} inView className="photo-breakout">
            <div className="flex flex-col gap-1">
              <h2 className="text-xl font-semibold tracking-tight">Albums</h2>
              <p className="text-sm text-muted-foreground">
                {featuredMode === "curated"
                  ? "The frames above, and the rest of each series."
                  : "Every series, newest first."}
              </p>
            </div>
          </BlurFade>

          <div className="photo-breakout columns-1 sm:columns-2 gap-5 sm:gap-6 [column-fill:balance]">
            {albums.map((album, id) => {
              const meta = albumMeta(album);
              return (
                <BlurFade
                  key={album.slug}
                  delay={BLUR_FADE_DELAY * 2 + id * 0.04}
                  inView
                  className="mb-5 sm:mb-6 break-inside-avoid"
                >
                  <Link
                    href={`/foto/${album.slug}`}
                    className="group flex flex-col gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <div className="overflow-hidden rounded-lg border border-border bg-muted shadow-sm transition-shadow duration-200 group-hover:shadow-md">
                      <img
                        src={withBasePath(album.cover.thumb)}
                        alt={`${album.title} album cover`}
                        width={album.cover.width}
                        height={album.cover.height}
                        loading="lazy"
                        className="w-full h-auto transition-transform duration-500 group-hover:scale-[1.02]"
                        style={{
                          aspectRatio: `${album.cover.width} / ${album.cover.height}`,
                          backgroundImage: `url(${album.cover.blurDataURL})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }}
                      />
                    </div>
                    <div className="flex flex-col gap-0.5 min-w-0">
                      <h3 className="text-sm font-semibold leading-snug tracking-tight transition-colors group-hover:text-foreground">
                        {album.title}
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {[meta, `${album.photos.length} frames`]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                    </div>
                  </Link>
                </BlurFade>
              );
            })}
          </div>
        </section>
      )}
    </main>
  );
}
