import BlurFade from "@/components/magicui/blur-fade";
import { Badge } from "@/components/ui/badge";
import { DATA } from "@/data/resume";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default function PublicationsSection({
  baseDelay = 0,
}: {
  baseDelay?: number;
}) {
  return (
    <div className="flex flex-col gap-6">
      {DATA.publications.map((pub, id) => {
        const body = (
          <div className="flex flex-col gap-1 flex-1 min-w-0">
            <div className="font-semibold leading-snug text-sm sm:text-base">
              {pub.title}
              {pub.href && (
                <ArrowUpRight
                  className="ml-1 inline-block h-3.5 w-3.5 text-muted-foreground opacity-0 -translate-x-2 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0"
                  aria-hidden
                />
              )}
            </div>
            <div className="font-sans text-xs sm:text-sm text-muted-foreground">
              {pub.authors}
            </div>
            <div className="font-sans text-xs sm:text-sm text-muted-foreground italic">
              {pub.venue}
            </div>
            {pub.badges.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1">
                {pub.badges.map((badge) => (
                  <Badge key={badge} variant="secondary" className="text-[10px]">
                    {badge}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        );

        return (
          <BlurFade key={pub.title} delay={baseDelay + id * 0.05}>
            <div className="flex items-start gap-x-3">
              <span className="text-xs font-mono tabular-nums text-muted-foreground mt-1 flex-none">
                {pub.year}
              </span>
              {pub.href ? (
                <Link
                  href={pub.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex-1 min-w-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
                >
                  {body}
                </Link>
              ) : (
                body
              )}
            </div>
          </BlurFade>
        );
      })}
    </div>
  );
}
