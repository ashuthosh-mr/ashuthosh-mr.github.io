"use client";

import { Button } from "@/components/ui/button";
import { AMBIENCES, AmbienceMixer, type AmbienceId } from "@/lib/ambience";
import { cn } from "@/lib/utils";
import {
  AudioLines,
  Bell,
  Bug,
  Clock,
  CloudRain,
  Disc3,
  Droplet,
  Fan,
  Flame,
  Leaf,
  Music2,
  Square,
  Volume2,
  Waves,
  Wind,
  X,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

const ICONS: Record<string, LucideIcon> = {
  AudioLines,
  Bell,
  Bug,
  Clock,
  CloudRain,
  Disc3,
  Droplet,
  Fan,
  Flame,
  Leaf,
  Waves,
  Wind,
  Zap,
};

const STORE_KEY = "ambience:v1";
const DEFAULT_LAYER_VOLUME = 0.6;

type Stored = {
  master: number;
  volumes: Partial<Record<AmbienceId, number>>;
};

/** localStorage is unavailable in private modes and can throw outright. */
function readStored(): Stored {
  try {
    const raw = window.localStorage.getItem(STORE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Stored;
      if (typeof parsed?.master === "number") return parsed;
    }
  } catch {
    // Fall through to defaults.
  }
  return { master: 0.7, volumes: {} };
}

function writeStored(value: Stored) {
  try {
    window.localStorage.setItem(STORE_KEY, JSON.stringify(value));
  } catch {
    // Nothing to do - the mix just will not be remembered.
  }
}

export function AmbienceToggle({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [active, setActive] = useState<AmbienceId[]>([]);
  const [volumes, setVolumes] = useState<Partial<Record<AmbienceId, number>>>(
    {},
  );
  const [master, setMaster] = useState(0.7);
  const mixer = useRef<AmbienceMixer | null>(null);
  const panel = useRef<HTMLDivElement>(null);

  // Levels are restored, but nothing is ever started automatically: sound has
  // to be asked for, every visit.
  useEffect(() => {
    setMounted(true);
    const stored = readStored();
    setMaster(stored.master);
    setVolumes(stored.volumes);
    mixer.current = new AmbienceMixer();
    mixer.current.setMasterVolume(stored.master);
    return () => {
      mixer.current?.dispose();
      mixer.current = null;
    };
  }, []);

  useEffect(() => {
    if (mounted) writeStored({ master, volumes });
  }, [mounted, master, volumes]);

  // Escape closes, and a click outside the panel does too - but not a click on
  // the dock button itself, which has its own toggle.
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (panel.current && !panel.current.contains(target)) {
        if (
          !(
            target instanceof Element &&
            target.closest("[data-ambience-trigger]")
          )
        ) {
          setOpen(false);
        }
      }
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("pointerdown", onPointerDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  const volumeOf = useCallback(
    (id: AmbienceId) => volumes[id] ?? DEFAULT_LAYER_VOLUME,
    [volumes],
  );

  const toggleSound = (id: AmbienceId) => {
    const engine = mixer.current;
    if (!engine) return;
    if (active.includes(id)) {
      engine.disable(id);
      setActive((current) => current.filter((entry) => entry !== id));
    } else {
      void engine.enable(id, volumeOf(id));
      setActive((current) => [...current, id]);
    }
  };

  const changeVolume = (id: AmbienceId, next: number) => {
    setVolumes((current) => ({ ...current, [id]: next }));
    mixer.current?.setLayerVolume(id, next);
  };

  const changeMaster = (next: number) => {
    setMaster(next);
    mixer.current?.setMasterVolume(next);
  };

  const stopAll = () => {
    mixer.current?.stopAll();
    setActive([]);
  };

  const playing = active.length > 0;
  const tiles = useMemo(() => AMBIENCES, []);

  return (
    <>
      <Button
        type="button"
        variant="link"
        size="icon"
        data-ambience-trigger
        className={cn(className)}
        aria-label={
          playing ? `Ambient sound, ${active.length} playing` : "Ambient sound"
        }
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        <Music2 className={cn("h-full w-full", playing && "text-foreground")} />
        {playing && (
          <span
            aria-hidden
            className="absolute top-1 right-1 size-1.5 rounded-full bg-foreground"
          />
        )}
      </Button>

      {/* Portalled out of the dock: DockIcon scales on hover, and a transform
          would become the containing block for this fixed panel. */}
      {mounted &&
        open &&
        createPortal(
          <div
            ref={panel}
            role="dialog"
            aria-label="Ambient sound"
            className="fixed bottom-24 left-1/2 z-40 w-[min(34rem,calc(100vw-1.5rem))] -translate-x-1/2 rounded-2xl border border-border bg-card/95 p-4 shadow-2xl backdrop-blur-xl"
          >
            <div className="mb-3 flex items-center gap-3">
              <h2 className="text-sm font-semibold tracking-tight">
                Ambient sound
              </h2>
              <div className="ml-auto flex items-center gap-2">
                <Volume2 className="size-3.5 shrink-0 text-muted-foreground" />
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={master}
                  aria-label="Master volume"
                  onChange={(event) => changeMaster(Number(event.target.value))}
                  className="h-1 w-20 cursor-pointer accent-foreground"
                />
                <button
                  type="button"
                  onClick={stopAll}
                  disabled={!playing}
                  aria-label="Stop all sounds"
                  className="rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40 disabled:hover:text-muted-foreground"
                >
                  <Square className="size-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close"
                  className="rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground"
                >
                  <X className="size-4" />
                </button>
              </div>
            </div>

            <div className="grid max-h-[min(24rem,55vh)] grid-cols-2 gap-2 overflow-y-auto sm:grid-cols-3">
              {tiles.map((sound) => {
                const Icon = ICONS[sound.icon] ?? AudioLines;
                const on = active.includes(sound.id);
                return (
                  <div
                    key={sound.id}
                    className={cn(
                      "rounded-xl border p-2.5 transition-colors",
                      on
                        ? "border-foreground/30 bg-muted"
                        : "border-border bg-background hover:bg-muted/60",
                    )}
                  >
                    <button
                      type="button"
                      onClick={() => toggleSound(sound.id)}
                      aria-pressed={on}
                      className="flex w-full items-center gap-2 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                    >
                      <Icon
                        className={cn(
                          "size-4 shrink-0",
                          on ? "text-foreground" : "text-muted-foreground",
                        )}
                      />
                      <span
                        className={cn(
                          "truncate text-xs font-medium",
                          on ? "text-foreground" : "text-muted-foreground",
                        )}
                      >
                        {sound.label}
                      </span>
                      {on && (
                        <span
                          aria-hidden
                          className="ml-auto size-1.5 shrink-0 rounded-full bg-foreground"
                        />
                      )}
                    </button>
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.01}
                      value={volumeOf(sound.id)}
                      aria-label={`${sound.label} volume`}
                      onChange={(event) =>
                        changeVolume(sound.id, Number(event.target.value))
                      }
                      className="mt-2 h-1 w-full cursor-pointer accent-foreground disabled:opacity-40"
                      disabled={!on}
                    />
                  </div>
                );
              })}
            </div>

            <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">
              Every sound is generated live in your browser, so it never repeats
              and nothing is downloaded. Mix as many as you like.
            </p>
          </div>,
          document.body,
        )}
    </>
  );
}
