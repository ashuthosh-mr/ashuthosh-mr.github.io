/* eslint-disable @next/next/no-img-element */
"use client";

import BlurFade from "@/components/magicui/blur-fade";
import type { Photo } from "@/lib/photos";
import { withBasePath } from "@/lib/utils";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";

const BLUR_FADE_DELAY = 0.04;

export default function PhotoLightbox({
  photos,
  albumTitle,
}: {
  photos: Photo[];
  albumTitle: string;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const isOpen = openIndex !== null;

  useEffect(() => setMounted(true), []);

  const close = useCallback(() => setOpenIndex(null), []);
  const step = useCallback(
    (delta: number) =>
      setOpenIndex((current) =>
        current === null
          ? current
          : (current + delta + photos.length) % photos.length,
      ),
    [photos.length],
  );

  // Keyboard control, and freeze the page behind the overlay while it is open.
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "ArrowRight") step(1);
      if (event.key === "ArrowLeft") step(-1);
    };

    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, close, step]);

  const active = openIndex === null ? null : photos[openIndex];

  return (
    <>
      <div className="columns-1 sm:columns-2 gap-4 sm:gap-5 [column-fill:balance]">
        {photos.map((photo, id) => (
          <BlurFade
            key={photo.name}
            delay={BLUR_FADE_DELAY * 2 + Math.min(id, 8) * 0.04}
            inView
            className="mb-4 sm:mb-5 break-inside-avoid"
          >
            <button
              type="button"
              onClick={() => setOpenIndex(id)}
              aria-label={`Open photo ${id + 1} of ${photos.length}`}
              className="group block w-full overflow-hidden rounded-lg border border-border bg-muted shadow-sm transition-shadow duration-200 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 cursor-zoom-in"
            >
              <img
                src={withBasePath(photo.thumb)}
                alt={`${albumTitle} — frame ${id + 1}`}
                width={photo.width}
                height={photo.height}
                loading={id < 4 ? "eager" : "lazy"}
                className="w-full h-auto transition-transform duration-500 group-hover:scale-[1.02]"
                style={{
                  aspectRatio: `${photo.width} / ${photo.height}`,
                  backgroundImage: `url(${photo.blurDataURL})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
            </button>
          </BlurFade>
        ))}
      </div>

      {/* The layout wraps page content in a `z-10` container, which traps any
          nested `fixed` element in that stacking context - the nav dock would
          then paint over the overlay. Portal to <body> to escape it. */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {active && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                role="dialog"
                aria-modal="true"
                aria-label={`${albumTitle} — frame ${(openIndex ?? 0) + 1} of ${photos.length}`}
                className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-md p-4 sm:p-8"
                onClick={close}
              >
                <button
                  type="button"
                  onClick={close}
                  aria-label="Close"
                  className="absolute top-4 right-4 z-10 rounded-full border border-border bg-card/80 p-2 text-muted-foreground backdrop-blur transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <X className="size-5" />
                </button>

                {photos.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        step(-1);
                      }}
                      aria-label="Previous photo"
                      className="absolute left-2 sm:left-4 z-10 rounded-full border border-border bg-card/80 p-2 text-muted-foreground backdrop-blur transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <ChevronLeft className="size-5" />
                    </button>
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        step(1);
                      }}
                      aria-label="Next photo"
                      className="absolute right-2 sm:right-4 z-10 rounded-full border border-border bg-card/80 p-2 text-muted-foreground backdrop-blur transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <ChevronRight className="size-5" />
                    </button>
                  </>
                )}

                <motion.img
                  key={active.name}
                  initial={{ opacity: 0, scale: 0.99 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                  src={withBasePath(active.full)}
                  alt={`${albumTitle} — frame ${(openIndex ?? 0) + 1}`}
                  className="max-h-full max-w-full rounded-lg object-contain shadow-2xl"
                  onClick={(event) => event.stopPropagation()}
                />

                <p className="pointer-events-none absolute top-4 left-4 rounded-full border border-border bg-card/80 px-3 py-1.5 text-xs font-mono tabular-nums text-muted-foreground backdrop-blur">
                  {(openIndex ?? 0) + 1} / {photos.length}
                </p>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}
