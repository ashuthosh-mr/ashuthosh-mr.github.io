"use client";

/**
 * oneko - the cat that chases your cursor.
 *
 * A React port of oneko.js by adryd (https://github.com/adryd325/oneko.js),
 * itself a web port of Naoshi Watanabe's 1990s "Neko" desktop pet. The sprite
 * sheet (public/oneko.gif) is an 8x4 grid of 32px frames taken from that
 * project; its MIT licence is kept at public/licenses/oneko-LICENSE.txt.
 *
 * Behaviour matches the original: the cat runs toward the pointer, shows an
 * "alert" frame when it wakes, and falls into idle animations (sleeping,
 * grooming, scratching whichever wall it is next to) once it catches up.
 *
 * Sits out entirely when the visitor prefers reduced motion or has no fine
 * pointer to chase, so it never becomes a distraction or dead weight on touch.
 */

import { useEffect } from "react";
import { withBasePath } from "@/lib/utils";

/** Frame coordinates in sprite-sheet cells; multiplied by 32 for background-position. */
const SPRITE_SETS: Record<string, [number, number][]> = {
  idle: [[-3, -3]],
  alert: [[-7, -3]],
  scratchSelf: [
    [-5, 0],
    [-6, 0],
    [-7, 0],
  ],
  scratchWallN: [
    [0, 0],
    [0, -1],
  ],
  scratchWallS: [
    [-7, -1],
    [-6, -2],
  ],
  scratchWallE: [
    [-2, -2],
    [-2, -3],
  ],
  scratchWallW: [
    [-4, 0],
    [-4, -1],
  ],
  tired: [[-3, -2]],
  sleeping: [
    [-2, 0],
    [-2, -1],
  ],
  N: [
    [-1, -2],
    [-1, -3],
  ],
  NE: [
    [0, -2],
    [0, -3],
  ],
  E: [
    [-3, 0],
    [-3, -1],
  ],
  SE: [
    [-5, -1],
    [-5, -2],
  ],
  S: [
    [-6, -3],
    [-7, -2],
  ],
  SW: [
    [-5, -3],
    [-6, -1],
  ],
  W: [
    [-4, -2],
    [-4, -3],
  ],
  NW: [
    [-1, 0],
    [-1, -1],
  ],
};

const SPEED = 10;
const FRAME_MS = 100; // original runs on a 10fps interval
const SIZE = 32;

export default function Oneko() {
  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
    if (reducedMotion || !hasFinePointer) return;

    const neko = document.createElement("div");
    neko.id = "oneko";
    neko.setAttribute("aria-hidden", "true");
    Object.assign(neko.style, {
      width: `${SIZE}px`,
      height: `${SIZE}px`,
      position: "fixed",
      pointerEvents: "none",
      imageRendering: "pixelated",
      left: "16px",
      top: "16px",
      zIndex: "40",
      backgroundImage: `url(${withBasePath("/oneko.gif")})`,
    });
    document.body.appendChild(neko);

    let nekoX = 32;
    let nekoY = 32;
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    let frameCount = 0;
    let idleTime = 0;
    let idleAnimation: string | null = null;
    let idleAnimationFrame = 0;

    const onMouseMove = (event: MouseEvent) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
    };
    document.addEventListener("mousemove", onMouseMove, { passive: true });

    function setSprite(name: string, frame: number) {
      const set = SPRITE_SETS[name];
      if (!set) return;
      const sprite = set[frame % set.length];
      neko.style.backgroundPosition = `${sprite[0] * SIZE}px ${
        sprite[1] * SIZE
      }px`;
    }

    function resetIdleAnimation() {
      idleAnimation = null;
      idleAnimationFrame = 0;
    }

    function idle() {
      idleTime += 1;

      // Occasionally settle into a longer animation, picking a wall to
      // scratch only when actually next to one.
      if (
        idleTime > 10 &&
        Math.floor(Math.random() * 200) === 0 &&
        idleAnimation == null
      ) {
        const available = ["sleeping", "scratchSelf"];
        if (nekoX < 32) available.push("scratchWallW");
        if (nekoY < 32) available.push("scratchWallN");
        if (nekoX > window.innerWidth - 32) available.push("scratchWallE");
        if (nekoY > window.innerHeight - 32) available.push("scratchWallS");
        idleAnimation = available[Math.floor(Math.random() * available.length)];
      }

      switch (idleAnimation) {
        case "sleeping":
          if (idleAnimationFrame < 8) {
            setSprite("tired", 0);
            break;
          }
          setSprite("sleeping", Math.floor(idleAnimationFrame / 4));
          if (idleAnimationFrame > 192) resetIdleAnimation();
          break;
        case "scratchWallN":
        case "scratchWallS":
        case "scratchWallE":
        case "scratchWallW":
        case "scratchSelf":
          setSprite(idleAnimation, idleAnimationFrame);
          if (idleAnimationFrame > 9) resetIdleAnimation();
          break;
        default:
          setSprite("idle", 0);
          return;
      }
      idleAnimationFrame += 1;
    }

    function step() {
      frameCount += 1;
      const diffX = nekoX - mouseX;
      const diffY = nekoY - mouseY;
      const distance = Math.sqrt(diffX ** 2 + diffY ** 2);

      // Close enough - stop and loaf about.
      if (distance < SPEED || distance < 48) {
        idle();
        return;
      }

      resetIdleAnimation();

      // Perk up for a beat before giving chase.
      if (idleTime > 1) {
        setSprite("alert", 0);
        idleTime = Math.min(idleTime, 7);
        idleTime -= 1;
        return;
      }

      let direction = "";
      if (diffY / distance > 0.5) direction += "N";
      if (diffY / distance < -0.5) direction += "S";
      if (diffX / distance > 0.5) direction += "W";
      if (diffX / distance < -0.5) direction += "E";
      setSprite(direction, frameCount);

      nekoX -= (diffX / distance) * SPEED;
      nekoY -= (diffY / distance) * SPEED;
      nekoX = Math.min(Math.max(16, nekoX), window.innerWidth - 16);
      nekoY = Math.min(Math.max(16, nekoY), window.innerHeight - 16);

      neko.style.left = `${nekoX - 16}px`;
      neko.style.top = `${nekoY - 16}px`;
    }

    // rAF rather than setInterval so the cat pauses with the tab and never
    // queues up a backlog of frames while hidden.
    let rafId = 0;
    let last = 0;
    const loop = (time: number) => {
      if (!last || time - last >= FRAME_MS) {
        last = time;
        step();
      }
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener("mousemove", onMouseMove);
      neko.remove();
    };
  }, []);

  return null;
}
