/* eslint-disable @next/next/no-img-element */
"use client";

import { DATA } from "@/data/resume";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ChevronDown } from "lucide-react";
import { withBasePath } from "@/lib/utils";

export default function VolunteeringSection() {
  return (
    <Accordion type="single" collapsible className="w-full grid gap-6">
      {DATA.volunteering.map((role) => (
        <AccordionItem
          key={role.title}
          value={role.title}
          className="w-full border-b-0 grid gap-2"
        >
          <AccordionTrigger className="hover:no-underline p-0 cursor-pointer transition-colors rounded-none group [&>svg]:hidden">
            <div className="flex items-center gap-x-3 justify-between w-full text-left">
              <div className="flex items-center gap-x-3 flex-1 min-w-0">
                {role.image ? (
                  <img
                    src={withBasePath(role.image)}
                    alt={role.title}
                    className="size-8 md:size-10 p-1 border rounded-full shadow ring-2 ring-border overflow-hidden object-contain flex-none"
                  />
                ) : (
                  <div className="size-8 md:size-10 p-1 border rounded-full shadow ring-2 ring-border bg-muted flex-none" />
                )}
                <div className="flex-1 min-w-0 gap-0.5 flex flex-col">
                  <div className="font-semibold leading-none">{role.title}</div>
                  {role.location && (
                    <div className="font-sans text-sm text-muted-foreground">
                      {role.location}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs tabular-nums text-muted-foreground text-right flex-none">
                <span>{role.dates}</span>
                <ChevronDown className="h-3.5 w-3.5 shrink-0 -translate-y-0.5 text-muted-foreground/80 -rotate-90 transition-transform duration-200 group-data-[state=open]:rotate-0" />
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="p-0 ml-13 text-xs sm:text-sm text-muted-foreground whitespace-pre-line">
            {role.description}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
