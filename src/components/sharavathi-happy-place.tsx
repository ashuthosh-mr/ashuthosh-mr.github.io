"use client";

import { Ornament, Petal, Sprig } from "@/components/date-florals";
import { useCallback, useEffect, useRef, useState } from "react";

/**
 * "A Little Happy Place for Sharavathi" at /care/sharavathi.
 *
 * A small digital gift, not a declaration: a cat you can pet (it purrs), an
 * endless supply of flowers, a spot for a playlist, and a light-hearted chess
 * invitation. Her name is used naturally in a few places - enough to feel
 * handmade, not in every line.
 *
 * Shares the /care palette and card so the two read as one hand. Nothing is
 * stored or sent; there is no gate, because this is meant to be received, not
 * unlocked.
 */

/**
 * Paste the Spotify playlist link here once it is ready. Until then the music
 * corner shows a gentle "coming soon" line instead of a button, so the page can
 * be sent before the playlist is finished. Never autoplays either way.
 */
const PLAYLIST = {
  url: "https://open.spotify.com/playlist/4bBPZofM7orCJyFBvIiL6k",
};

const HAS_PLAYLIST = Boolean(PLAYLIST.url);

/** Messages shown when she pets the cat. Merged from both cat-message lists. */
const CAT_MESSAGES = [
  "Sharavathi, have you taken a tiny break yet? 😼",
  "Psst, Sharavathi. One task at a time!",
  "Your friendly neighbourhood cat believes in you. 🐾",
  "Official permission to pause for 60 seconds granted.",
  "Meow means take care of yourself. 🌷",
  "Sharavathi deserves a little happiness today.",
  "I'm just a cat, but I'm rooting for you!",
  "Prrrrr… a little happiness for you, Sharavathi 🐾",
  "You deserve a tiny break, you know? 🌷",
  "Head scratches, please. 🐱",
  "Prrrrr… everything can wait for a minute.",
];

/** Messages shown after each tap of the flower button. */
const FLOWER_MESSAGES = [
  "One little flower for you, Sharavathi. 🌼",
  "Another one! Because why stop at one? 🌷",
  "An unlimited supply of tiny happy things.",
  "A little bloom for your busy Sunday. 🌸",
  "The flower shop is open all day!",
  "No delivery fee. No flower limit. Just flowers. 😂",
];

/** Pick a random entry that isn't the one just shown, so repeats feel fresh. */
function pickNext(list: string[], current: string) {
  if (list.length < 2) return list[0];
  let next = current;
  while (next === current) {
    next = list[Math.floor(Math.random() * list.length)];
  }
  return next;
}

/* ------------------------------------------------------------------ */
/*  Falling flowers (full-screen shower, from the flower button)       */
/* ------------------------------------------------------------------ */

type FlowerPetal = {
  id: number;
  left: string;
  size: number;
  delay: string;
  duration: string;
  drift: string;
  spin: string;
};

function makeBurst(startId: number, count = 20): FlowerPetal[] {
  return Array.from({ length: count }, (_, index) => ({
    id: startId + index,
    left: `${Math.random() * 96}%`,
    size: 10 + Math.random() * 12,
    delay: `${Math.random() * 0.5}s`,
    duration: `${3 + Math.random() * 2.2}s`,
    drift: `${(Math.random() - 0.5) * 11}rem`,
    spin: `${180 + Math.random() * 460}deg`,
  }));
}

/* ------------------------------------------------------------------ */
/*  Little floats that rise off the cat when she pets it               */
/* ------------------------------------------------------------------ */

type Float = {
  id: number;
  glyph: string;
  left: number;
  size: number;
  drift: string;
  duration: string;
};

const FLOAT_GLYPHS = ["🌸", "🌼", "💛", "🌷", "✨"];

function makeFloats(startId: number, count = 6): Float[] {
  return Array.from({ length: count }, (_, index) => ({
    id: startId + index,
    glyph: FLOAT_GLYPHS[Math.floor(Math.random() * FLOAT_GLYPHS.length)],
    left: 18 + Math.random() * 64,
    size: 14 + Math.random() * 12,
    drift: `${(Math.random() - 0.5) * 5}rem`,
    duration: `${1.3 + Math.random() * 0.7}s`,
  }));
}

/* ------------------------------------------------------------------ */
/*  Soft synthesised purr (no audio asset, graceful if unavailable)    */
/* ------------------------------------------------------------------ */

function usePurr(muted: boolean) {
  const ctxRef = useRef<AudioContext | null>(null);

  const purr = useCallback(() => {
    if (muted) return;
    try {
      const AC =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (!AC) return;
      let ctx = ctxRef.current;
      if (!ctx) {
        ctx = new AC();
        ctxRef.current = ctx;
      }
      // Browsers hold the context suspended until a user gesture - this is one.
      if (ctx.state === "suspended") void ctx.resume();

      const now = ctx.currentTime;
      const dur = 1.1;

      // A short buffer of soft brown-ish noise is the body of the purr.
      const length = Math.floor(ctx.sampleRate * dur);
      const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let last = 0;
      for (let i = 0; i < length; i++) {
        const white = Math.random() * 2 - 1;
        last = (last + 0.02 * white) / 1.02;
        data[i] = last * 3.2;
      }
      const src = ctx.createBufferSource();
      src.buffer = buffer;

      const lp = ctx.createBiquadFilter();
      lp.type = "lowpass";
      lp.frequency.value = 440;
      lp.Q.value = 0.6;

      // A ~26 Hz tremolo gives the rolling "prrrr" texture.
      const lfo = ctx.createOscillator();
      lfo.type = "sine";
      lfo.frequency.value = 26;
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 0.12;

      const amp = ctx.createGain();
      amp.gain.setValueAtTime(0, now);
      amp.gain.linearRampToValueAtTime(0.16, now + 0.12);
      amp.gain.setValueAtTime(0.16, now + dur - 0.25);
      amp.gain.linearRampToValueAtTime(0, now + dur);

      lfo.connect(lfoGain);
      lfoGain.connect(amp.gain);
      src.connect(lp);
      lp.connect(amp);
      amp.connect(ctx.destination);

      src.start(now);
      src.stop(now + dur);
      lfo.start(now);
      lfo.stop(now + dur);
    } catch {
      // No audio is fine - the rest of the interaction still works.
    }
  }, [muted]);

  return purr;
}

/* ------------------------------------------------------------------ */
/*  The cat                                                            */
/* ------------------------------------------------------------------ */

/** A cute cat holding a little bouquet. Eyes close happily when `happy`. */
function CatArt() {
  return (
    <svg
      className="hp-cat-svg"
      viewBox="0 0 200 210"
      role="img"
      aria-label="A cat holding a bouquet of flowers"
    >
      {/* tail */}
      <path
        className="hp-cat-tail"
        d="M150 150 C 182 148, 190 118, 172 104 C 162 96, 150 102, 150 116"
        fill="#f6e2c8"
        stroke="#9b8477"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* body */}
      <path
        d="M62 206 C 52 150, 70 128, 100 128 C 130 128, 148 150, 138 206 Z"
        fill="#f6e2c8"
        stroke="#9b8477"
        strokeWidth="2"
      />
      {/* belly patch */}
      <path
        d="M100 140 C 116 140, 124 164, 120 200 L 80 200 C 76 164, 84 140, 100 140 Z"
        fill="#fffaf2"
        opacity="0.85"
      />
      {/* ears */}
      <path
        d="M58 58 L 50 20 L 86 42 Z"
        fill="#f6e2c8"
        stroke="#9b8477"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M142 58 L 150 20 L 114 42 Z"
        fill="#f6e2c8"
        stroke="#9b8477"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M60 50 L 56 30 L 76 42 Z" fill="#f2c6c0" />
      <path d="M140 50 L 144 30 L 124 42 Z" fill="#f2c6c0" />
      {/* head */}
      <circle
        cx="100"
        cy="82"
        r="46"
        fill="#f6e2c8"
        stroke="#9b8477"
        strokeWidth="2"
      />
      {/* cheeks / blush */}
      <ellipse
        className="hp-cat-blush"
        cx="68"
        cy="94"
        rx="9"
        ry="6"
        fill="#f2b2ab"
      />
      <ellipse
        className="hp-cat-blush"
        cx="132"
        cy="94"
        rx="9"
        ry="6"
        fill="#f2b2ab"
      />
      {/* eyes - open */}
      <g className="hp-eyes hp-eyes-open">
        <circle cx="82" cy="78" r="6" fill="#4a3b36" />
        <circle cx="118" cy="78" r="6" fill="#4a3b36" />
        <circle cx="84" cy="76" r="2" fill="#fff" />
        <circle cx="120" cy="76" r="2" fill="#fff" />
      </g>
      {/* eyes - happy/closed */}
      <g
        className="hp-eyes hp-eyes-happy"
        fill="none"
        stroke="#4a3b36"
        strokeWidth="2.6"
        strokeLinecap="round"
      >
        <path d="M74 80 Q 82 72 90 80" />
        <path d="M110 80 Q 118 72 126 80" />
      </g>
      {/* nose + mouth */}
      <path d="M96 90 L 104 90 L 100 95 Z" fill="#d98b8b" />
      <path
        d="M100 95 C 100 100 94 102 90 99 M100 95 C 100 100 106 102 110 99"
        fill="none"
        stroke="#9b8477"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      {/* whiskers */}
      <g stroke="#c9b7a7" strokeWidth="1.6" strokeLinecap="round">
        <path d="M60 86 L 40 82" />
        <path d="M60 92 L 41 94" />
        <path d="M140 86 L 160 82" />
        <path d="M140 92 L 159 94" />
      </g>
      {/* paws */}
      <ellipse
        cx="74"
        cy="178"
        rx="15"
        ry="12"
        fill="#fffaf2"
        stroke="#9b8477"
        strokeWidth="2"
      />
      <ellipse
        cx="126"
        cy="178"
        rx="15"
        ry="12"
        fill="#fffaf2"
        stroke="#9b8477"
        strokeWidth="2"
      />
      {/* bouquet - stems + wrap held between the paws */}
      <g strokeLinecap="round">
        <path
          d="M100 176 L 92 150"
          stroke="#6c9a5f"
          strokeWidth="2.4"
          fill="none"
        />
        <path
          d="M100 176 L 100 146"
          stroke="#6c9a5f"
          strokeWidth="2.4"
          fill="none"
        />
        <path
          d="M100 176 L 108 150"
          stroke="#6c9a5f"
          strokeWidth="2.4"
          fill="none"
        />
        <path
          d="M90 176 L 110 176 L 104 192 L 96 192 Z"
          fill="#f3e3cf"
          stroke="#c9a978"
          strokeWidth="1.6"
        />
      </g>
      {/* bouquet blooms */}
      <g>
        <circle cx="92" cy="146" r="8" fill="#c98b90" />
        <circle cx="92" cy="146" r="3" fill="#a0525a" />
        <circle cx="100" cy="140" r="9" fill="#e6a3a8" />
        <circle cx="100" cy="140" r="3.2" fill="#a0525a" />
        <circle cx="108" cy="146" r="8" fill="#d9b36a" />
        <circle cx="108" cy="146" r="3" fill="#a9802f" />
      </g>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export function SharavathiHappyPlace() {
  const [flowers, setFlowers] = useState<FlowerPetal[]>([]);
  const [flowerMsg, setFlowerMsg] = useState(FLOWER_MESSAGES[0]);
  const [floats, setFloats] = useState<Float[]>([]);
  const [happy, setHappy] = useState(false);
  const [pets, setPets] = useState(0);
  const [bubble, setBubble] = useState("");
  const [muted, setMuted] = useState(false);
  const [challengeOn, setChallengeOn] = useState(false);

  const flowerId = useRef(0);
  const floatId = useRef(0);
  const happyTimer = useRef<number | null>(null);
  const bubbleTimer = useRef<number | null>(null);
  const lastCatMsg = useRef("");

  const purr = usePurr(muted);

  // Keep this page in its light palette even though the site runs dark - without
  // this iOS paints dark behind the overscroll.
  useEffect(() => {
    const { body, documentElement } = document;
    const previous = {
      body: body.style.backgroundColor,
      root: documentElement.style.backgroundColor,
    };
    body.style.backgroundColor = "#fdf8f3";
    documentElement.style.backgroundColor = "#fdf8f3";
    return () => {
      body.style.backgroundColor = previous.body;
      documentElement.style.backgroundColor = previous.root;
    };
  }, []);

  useEffect(
    () => () => {
      if (happyTimer.current) window.clearTimeout(happyTimer.current);
      if (bubbleTimer.current) window.clearTimeout(bubbleTimer.current);
    },
    [],
  );

  // Sound is on by default but never plays until she taps the cat, so nothing
  // ever autoplays. This just flips the control.
  const toggleMute = () => setMuted((m) => !m);

  const showerFlowers = () => {
    const startId = flowerId.current;
    flowerId.current += 24;
    const burst = makeBurst(startId);
    setFlowers((current) => [...current, ...burst]);
    setFlowerMsg((current) => pickNext(FLOWER_MESSAGES, current));
    const ids = new Set(burst.map((petal) => petal.id));
    window.setTimeout(() => {
      setFlowers((current) => current.filter((petal) => !ids.has(petal.id)));
    }, 5600);
  };

  const petCat = () => {
    // visual: wiggle + happy eyes
    setPets((n) => n + 1);
    setHappy(true);
    if (happyTimer.current) window.clearTimeout(happyTimer.current);
    happyTimer.current = window.setTimeout(() => setHappy(false), 1700);

    // sound
    purr();

    // little rising hearts/flowers
    const startId = floatId.current;
    floatId.current += 8;
    const burst = makeFloats(startId);
    setFloats((current) => [...current, ...burst]);
    const ids = new Set(burst.map((f) => f.id));
    window.setTimeout(() => {
      setFloats((current) => current.filter((f) => !ids.has(f.id)));
    }, 2200);

    // occasional speech bubble (not every tap, so it stays playful)
    if (Math.random() < 0.6) {
      const next = pickNext(CAT_MESSAGES, lastCatMsg.current);
      lastCatMsg.current = next;
      setBubble(next);
      if (bubbleTimer.current) window.clearTimeout(bubbleTimer.current);
      bubbleTimer.current = window.setTimeout(() => setBubble(""), 3400);
    }
  };

  return (
    <div className="inv hp">
      <div className="inv-wash" aria-hidden />
      <Sprig className="inv-bloom inv-bloom--tl" />
      <Sprig className="inv-bloom inv-bloom--br" />

      <button
        type="button"
        className="hp-mute"
        onClick={toggleMute}
        aria-pressed={muted}
        aria-label={muted ? "Unmute the cat" : "Mute the cat"}
        title={muted ? "Sound off" : "Sound on"}
      >
        {muted ? "🔇" : "🔊"}
      </button>

      <div className="inv-shell">
        <div className="inv-card inv-enter hp-card">
          {/* ---------- hero ---------- */}
          <div className="hp-hero">
            <span className="inv-eyebrow">A little happy place</span>
            <h1 className="inv-title hp-title">
              A Little Happy Place for Sharavathi <span aria-hidden>🌷</span>
            </h1>
            <p className="hp-subtitle">
              A tiny corner of happiness, made just for you.
            </p>

            {/* cat, directly beneath the heading */}
            <div className="hp-cat-stage">
              <div
                className={`hp-bubble${bubble ? " is-shown" : ""}`}
                aria-live="polite"
              >
                {bubble}
              </div>
              <button
                type="button"
                className="hp-cat-button"
                onClick={petCat}
                aria-label="Pet the cat"
              >
                <div
                  key={pets}
                  className="hp-cat-wiggle"
                  data-happy={happy}
                  data-petting={pets > 0}
                >
                  <CatArt />
                </div>
              </button>
              <div className="hp-cat-floats" aria-hidden>
                {floats.map((f) => (
                  <span
                    key={f.id}
                    className="hp-float"
                    style={
                      {
                        left: `${f.left}%`,
                        fontSize: `${f.size}px`,
                        "--drift": f.drift,
                        "--dur": f.duration,
                      } as React.CSSProperties
                    }
                  >
                    {f.glyph}
                  </span>
                ))}
              </div>
            </div>
            <p className="hp-cat-hint">Psst — give the cat a little pet. 🐾</p>

            <p className="hp-lede">
              Hey Sharavathi! Even busy Sundays deserve a little sunshine.{" "}
              <span aria-hidden>☀️</span>
            </p>
          </div>

          <div className="hp-divider">
            <Ornament />
          </div>

          {/* ---------- unlimited flowers ---------- */}
          <section className="hp-section hp-flowers">
            <button
              type="button"
              className="inv-button inv-button--flowers hp-flower-button"
              onClick={showerFlowers}
            >
              Flowers for Sharavathi 🌷
            </button>
            <p className="hp-flower-msg" aria-live="polite">
              {flowerMsg}
            </p>
            <p className="inv-flowers-note">
              Tap as many times as you like — the flower shop never closes.
            </p>
          </section>

          <div className="hp-divider">
            <Ornament />
          </div>

          {/* ---------- music corner ---------- */}
          <section className="hp-section">
            <h2 className="hp-section-title">
              A little music for you, Sharavathi
            </h2>
            <p className="hp-section-text">
              A few songs for a slow afternoon. Nothing plays until you press
              it.
            </p>
            {HAS_PLAYLIST ? (
              <div className="hp-action">
                <a
                  className="inv-button inv-button--spotify"
                  href={PLAYLIST.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open the playlist 🎧
                </a>
              </div>
            ) : (
              <p className="inv-parcel-soon">
                <em>
                  Still being put together — the playlist will land here soon.
                  🎧
                </em>
              </p>
            )}
          </section>

          <div className="hp-divider">
            <Ornament />
          </div>

          {/* ---------- chess ---------- */}
          <section className="hp-section">
            <h2 className="hp-section-title">
              Sharavathi, fancy a tiny challenge? <span aria-hidden>♟️</span>
            </h2>
            <p className="hp-section-text">Fancy a game of chess sometime?</p>
            {!challengeOn ? (
              <div className="hp-action">
                <button
                  type="button"
                  className="inv-button hp-chess-button"
                  onClick={() => setChallengeOn(true)}
                >
                  Challenge accepted?
                </button>
              </div>
            ) : (
              <p className="hp-chess-reply inv-enter">
                Excellent. I shall prepare my very questionable opening
                strategy. <span aria-hidden>😼</span>
              </p>
            )}
          </section>

          {/* ---------- footer ---------- */}
          <div className="hp-foot">
            <p>
              Made with a little thought, just for you, Sharavathi.{" "}
              <span aria-hidden>☀️🌷</span>
            </p>
          </div>
        </div>
      </div>

      {flowers.length > 0 && (
        <div className="inv-petals inv-shower" aria-hidden>
          {flowers.map((petal) => (
            <span
              key={petal.id}
              className="inv-petal"
              style={
                {
                  left: petal.left,
                  "--delay": petal.delay,
                  "--dur": petal.duration,
                  "--drift": petal.drift,
                  "--spin": petal.spin,
                } as React.CSSProperties
              }
            >
              <Petal size={petal.size} />
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
