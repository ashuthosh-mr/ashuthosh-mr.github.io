"use client";

import { FlickeringGrid } from "@/components/magicui/flickering-grid";
import Navbar from "@/components/navbar";
import Oneko from "@/components/oneko";
import { usePathname } from "next/navigation";

/**
 * Routes that opt out of the portfolio shell - no dock, no cat, no centred
 * reading column - because they are self-contained pages with their own
 * design. They render edge to edge instead.
 */
const BARE_ROUTES = ["/date"];

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "";
  // trailingSlash is on, so match both "/date" and "/date/".
  const bare = BARE_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  if (bare) return <>{children}</>;

  return (
    <>
      <div className="absolute inset-0 top-0 left-0 right-0 h-[100px] overflow-hidden z-0">
        <FlickeringGrid
          className="h-full w-full"
          squareSize={2}
          gridGap={2}
          style={{
            maskImage: "linear-gradient(to bottom, black, transparent)",
            WebkitMaskImage: "linear-gradient(to bottom, black, transparent)",
          }}
        />
      </div>
      <div className="relative z-10 max-w-2xl mx-auto py-12 pb-24 sm:py-24 px-6">
        {children}
      </div>
      <Navbar />
      <Oneko />
    </>
  );
}
