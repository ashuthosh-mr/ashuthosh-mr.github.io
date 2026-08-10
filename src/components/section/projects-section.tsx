"use client";

import BlurFade from "@/components/magicui/blur-fade";
import { ProjectCard } from "@/components/project-card";
import { DATA } from "@/data/resume";
import { useMemo, useState } from "react";

const BLUR_FADE_DELAY = 0.04;
const INITIAL_VISIBLE_PROJECTS = 2;

export default function ProjectsSection() {
  const [showAll, setShowAll] = useState(false);
  const visibleProjects = useMemo(
    () =>
      showAll
        ? DATA.projects
        : DATA.projects.slice(0, INITIAL_VISIBLE_PROJECTS),
    [showAll]
  );
  const hasMoreProjects = DATA.projects.length > INITIAL_VISIBLE_PROJECTS;

  return (
    <section id="projects">
      <div className="flex min-h-0 flex-col gap-y-8">
        <div className="flex flex-col gap-y-4 items-center justify-center">
          <div className="flex items-center w-full">
            <div className="flex-1 h-px bg-linear-to-r from-transparent from-5% via-border via-95% to-transparent" />
            <div className="border bg-primary z-10 rounded-xl px-4 py-1">
              <span className="text-background text-sm font-medium">My Projects</span>
            </div>
            <div className="flex-1 h-px bg-linear-to-l from-transparent from-5% via-border via-95% to-transparent" />
          </div>
          <div className="flex flex-col gap-y-3 items-center justify-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Check out my latest work</h2>
            <p className="text-muted-foreground md:text-lg/relaxed lg:text-base/relaxed xl:text-lg/relaxed text-balance text-center">
              I build at the intersection of physics, hardware, and code. Here are some things I have built, broken, and learned from.
            </p>
          </div>
        </div>
        <div className="relative max-w-[800px] mx-auto w-full">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 auto-rows-fr">
            {visibleProjects.map((project, id) => (
              <BlurFade
                key={project.title}
                delay={BLUR_FADE_DELAY * 12 + id * 0.05}
                className="h-full"
              >
                <ProjectCard
                  href={project.href}
                  key={project.title}
                  title={project.title}
                  description={project.description}
                  dates={project.dates}
                  tags={project.technologies}
                  image={project.image}
                  video={project.video}
                  links={project.links}
                />
              </BlurFade>
            ))}
          </div>

          {hasMoreProjects && !showAll && (
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 rounded-b-2xl bg-linear-to-t from-background via-background/85 to-transparent flex items-end justify-center pb-3">
              <button
                type="button"
                onClick={() => setShowAll(true)}
                className="pointer-events-auto inline-flex h-7 w-full items-center justify-center rounded-lg border-x border-b border-t-0 border-zinc-400/40 bg-linear-to-r from-zinc-200/35 via-zinc-300/40 to-zinc-200/35 px-5 text-xs font-medium text-muted-foreground backdrop-blur-sm transition-colors hover:text-foreground hover:border-zinc-500/50 dark:from-zinc-700/30 dark:via-zinc-600/35 dark:to-zinc-700/30"
                aria-label="Expand projects"
              >
                <span className="flex flex-col items-center gap-1">
                  <span className="h-1 w-9 rounded-full bg-border/90" />
                  <span className="h-1 w-6 rounded-full bg-border/60" />
                </span>
              </button>
            </div>
          )}
        </div>

        {hasMoreProjects && showAll && (
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => setShowAll(false)}
              className="inline-flex h-7 w-full max-w-[800px] items-center justify-center rounded-lg border-x border-b border-t-0 border-zinc-400/40 bg-linear-to-r from-zinc-200/35 via-zinc-300/40 to-zinc-200/35 px-5 text-xs font-medium text-muted-foreground backdrop-blur-sm transition-colors hover:text-foreground hover:border-zinc-500/50 dark:from-zinc-700/30 dark:via-zinc-600/35 dark:to-zinc-700/30"
              aria-label="Collapse projects"
            >
              <span className="h-1 w-9 rounded-full bg-border/90" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
