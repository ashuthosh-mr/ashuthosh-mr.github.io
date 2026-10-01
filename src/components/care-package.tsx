"use client";

import {
  HugIllustration,
  Ornament,
  Petal,
  Sprig,
} from "@/components/date-florals";
import { useEffect, useRef, useState } from "react";

/**
 * A care package that could not be posted, because the recipient's address is
 * classified. Each item opens on a tap - a parcel is opened one thing at a
 * time, which is what makes it a parcel rather than a list.
 *
 * Deliberately has no gate and nothing to type: the reader is working late and
 * should not have to do anything to receive this.
 */

/**
 * Paste a Swiggy gift card here and the food item becomes real.
 *
 * `url` is preferred: a share link makes redeeming a single tap. `code` is the
 * fallback - it renders with a copy button and a link to Swiggy. Leave both
 * empty and the item keeps its notional wording, so the page is never shown
 * half-wired while a card is still being bought.
 *
 * It is a bearer token on a public URL - anyone with the link could spend it -
 * so send it when you mean to and keep the amount small.
 */
const GIFT_CARD = {
  url: "",
  code: "",
  redeemUrl: "https://www.swiggy.com/",
};

/**
 * Paste the Spotify playlist link here when it is ready. Until then the item
 * shows a gentle "coming soon" line instead of a button, so the page can be
 * sent before the playlist is finished.
 */
const PLAYLIST = {
  url: "https://open.spotify.com/playlist/7Gu8VefWadgnIlylWGS0WO",
};

const HAS_PLAYLIST = Boolean(PLAYLIST.url);

type Item = {
  id: string;
  icon: string;
  name: string;
  /** Shown once opened. `note` is set in italic serif, as a spoken aside. */
  body: string;
  note?: string;
  /** Rendered above the body - currently only the hug. */
  art?: "hug";
  /** Attaches a redeemable action to the item. */
  redeem?: "swiggy" | "spotify";
};

const ITEMS: Item[] = [
  {
    id: "food",
    icon: "🍲",
    name: "Comfort food & a Mont Blanc",
    body: "Something warm and good to eat, on me — order whatever you actually feel like, at whatever hour you finally stop working. And a Mont Blanc too, because it is the kind of small thing that fixes a long day: cold brew, vanilla cream, orange notes.",
    redeem: "swiggy",
  },
  {
    id: "blanket",
    icon: "🧣",
    name: "A blanket",
    body: "Weighted, excessively warm, and entirely fictional. Drape over self. Do not operate laptops while under.",
  },
  {
    id: "leave",
    icon: "😴",
    name: "Rest, approved",
    body: "Duration: until further notice. Approved by management without review. Conditions: sleep, and absolutely no replying to this.",
  },
  {
    id: "hug",
    icon: "🤗",
    name: "A hug",
    body: "Sent the only way it can be from here. Hold on to it until the real one is available again.",
    art: "hug",
  },
  {
    id: "playlist",
    icon: "🎧",
    name: "A playlist",
    body: "A few songs for the late nights at the desk, and the quiet drive home after. On shuffle, or not.",
    redeem: "spotify",
  },
  {
    id: "quiet",
    icon: "🤫",
    name: "Nothing at all",
    body: "No question to answer, no plan to make, nothing to arrange. The last item in the package is simply being left alone to rest.",
  },
];

/* ------------------------------------------------------------------ */
/*  Falling flowers                                                    */
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

function makeBurst(startId: number, count = 18): FlowerPetal[] {
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

export function CarePackage() {
  const [opened, setOpened] = useState<string[]>([]);
  const [flowers, setFlowers] = useState<FlowerPetal[]>([]);
  const nextId = useRef(0);

  // This page keeps a light palette while the rest of the site runs dark, so it
  // paints the document itself - otherwise iOS shows dark behind the overscroll.
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

  const toggle = (id: string) =>
    setOpened((current) =>
      current.includes(id)
        ? current.filter((entry) => entry !== id)
        : [...current, id],
    );

  const showerFlowers = () => {
    const startId = nextId.current;
    nextId.current += 24;
    const burst = makeBurst(startId);
    setFlowers((current) => [...current, ...burst]);
    const ids = new Set(burst.map((petal) => petal.id));
    // Clear this burst once it has fallen, leaving any later burst untouched.
    window.setTimeout(() => {
      setFlowers((current) => current.filter((petal) => !ids.has(petal.id)));
    }, 5600);
  };

  const allOpen = opened.length === ITEMS.length;

  return (
    <div className="inv">
      <div className="inv-wash" aria-hidden />
      <Sprig className="inv-bloom inv-bloom--tl" />
      <Sprig className="inv-bloom inv-bloom--br" />

      <div className="inv-shell">
        <div className="inv-card inv-enter">
          <div className="inv-head">
            <span className="inv-eyebrow">Care package</span>
            <span className="inv-ref">Ref · AMR/NR-01.10</span>
          </div>

          <div className="inv-ornament">
            <Ornament />
          </div>

          <h1 className="inv-title" style={{ textAlign: "center" }}>
            Delivery Attempted
          </h1>
          <p className="inv-lede" style={{ textAlign: "center" }}>
            A package for <strong>Nithya</strong>, who has been working far too
            hard lately and is hereby instructed to take better care of herself.
          </p>

          <div className="inv-dispatch">
            <div className="inv-dispatch-row">
              <span className="inv-dispatch-label">Recipient</span>
              <span className="inv-dispatch-value">Nithya</span>
            </div>
            <div className="inv-dispatch-row">
              <span className="inv-dispatch-label">Address</span>
              <span className="inv-dispatch-value">
                <strong>Classified</strong>
              </span>
            </div>
            <div className="inv-dispatch-row">
              <span className="inv-dispatch-label">Status</span>
              <span className="inv-dispatch-value">
                Undeliverable by post — rerouted digitally
              </span>
            </div>
          </div>

          <p className="inv-cal-note" style={{ marginTop: "1.25rem" }}>
            {ITEMS.length} items enclosed. Open them in any order, or none at
            all.
          </p>

          <div className="inv-parcel">
            {ITEMS.map((item) => {
              const isOpen = opened.includes(item.id);
              return (
                <div
                  key={item.id}
                  className="inv-parcel-item"
                  data-open={isOpen}
                >
                  <button
                    type="button"
                    className="inv-parcel-button"
                    aria-expanded={isOpen}
                    aria-controls={`parcel-${item.id}`}
                    onClick={() => toggle(item.id)}
                  >
                    <span className="inv-parcel-icon" aria-hidden>
                      {item.icon}
                    </span>
                    <span className="inv-parcel-name">{item.name}</span>
                    <span className="inv-parcel-state">
                      {isOpen ? "Opened" : "Open"}
                    </span>
                  </button>
                  <div className="inv-parcel-reveal" id={`parcel-${item.id}`}>
                    <div>
                      <div className="inv-parcel-body">
                        {item.art === "hug" && (
                          <div className="inv-hug">
                            <HugIllustration />
                          </div>
                        )}
                        {item.body}
                        {item.note && (
                          <>
                            <br />
                            <em>{item.note}</em>
                          </>
                        )}
                        {item.redeem === "swiggy" && <SwiggyRedeem />}
                        {item.redeem === "spotify" && <SpotifyRedeem />}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <p className="inv-parcel-progress" aria-live="polite">
            {opened.length} of {ITEMS.length} opened
          </p>

          {allOpen && (
            <div className="inv-allopen">
              <span className="inv-section-label">Package empty</span>
              <p>
                That is everything I could send without knowing where to send
                it. Take care of yourself, Nithya. 🌹
              </p>
            </div>
          )}

          <div className="inv-flowers-cta">
            <button
              type="button"
              className="inv-button inv-button--flowers"
              onClick={showerFlowers}
            >
              Flowers for you 🌸
            </button>
            <p className="inv-flowers-note">
              Press as often as the day requires.
            </p>
          </div>

          <div className="inv-foot">
            <p>
              Contents are regrettably notional. No reply is required; this
              package acknowledges itself. Physical delivery available on
              provision of an address, whenever you feel like sharing one.
            </p>
          </div>
        </div>

        <p className="inv-signoff">
          <a href="/date/">Minutes of 27.09</a>
        </p>
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

/**
 * The orange Swiggy button is always shown. Until a gift card is pasted it opens
 * Swiggy itself; set GIFT_CARD.url and it points there instead. A gift code, if
 * given, renders below with a copy control.
 */
function SwiggyRedeem() {
  const [copied, setCopied] = useState(false);
  const href = GIFT_CARD.url || GIFT_CARD.redeemUrl;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(GIFT_CARD.code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2400);
    } catch {
      // Clipboard can be blocked; the code is on screen to type either way.
    }
  };

  return (
    <div className="inv-parcel-action">
      <a
        className="inv-button inv-button--swiggy"
        href={href}
        target="_blank"
        rel="noopener noreferrer"
      >
        Order on Swiggy →
      </a>
      {GIFT_CARD.code && (
        <div>
          <span className="inv-parcel-code">
            {GIFT_CARD.code}
            <button
              type="button"
              onClick={copy}
              aria-label="Copy gift card code"
              style={{
                border: 0,
                background: "none",
                padding: 0,
                font: "inherit",
                color: "var(--rose)",
                cursor: "pointer",
              }}
            >
              {copied ? "copied ✓" : "copy"}
            </button>
          </span>
        </div>
      )}
    </div>
  );
}

/** Spotify playlist: a green button once the link exists, a note until then. */
function SpotifyRedeem() {
  if (!HAS_PLAYLIST) {
    return (
      <p className="inv-parcel-soon">
        <em>Still being put together — the link will land here soon. 🎧</em>
      </p>
    );
  }

  return (
    <div className="inv-parcel-action">
      <a
        className="inv-button inv-button--spotify"
        href={PLAYLIST.url}
        target="_blank"
        rel="noopener noreferrer"
      >
        Open in Spotify →
      </a>
    </div>
  );
}
