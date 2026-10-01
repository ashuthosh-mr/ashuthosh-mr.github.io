"use client";

import { HugIllustration, Ornament, Sprig } from "@/components/date-florals";
import { useEffect, useState } from "react";

/**
 * A care package that could not be posted, because the recipient's address is
 * classified. Each item opens on a tap - a parcel is opened one thing at a
 * time, which is what makes it a parcel rather than a list.
 *
 * Deliberately has no gate and nothing to type: the reader is ill and working
 * late, and should not have to do anything to receive this.
 */

/**
 * Paste the gift card here and the soup becomes real.
 *
 * `url` is preferred: most providers issue a share link, which makes redeeming
 * a single tap. `code` is the fallback - it renders alongside a copy button and
 * a link to the provider. Leave both empty and the item keeps its original
 * wording, so the page never shows a broken button.
 *
 * Note it is a bearer token on a public URL: anyone with this link could spend
 * it, so send it when you mean to and keep the amount small.
 */
const GIFT_CARD = {
  url: "",
  code: "",
  provider: "Swiggy",
  redeemUrl: "https://www.swiggy.com/",
};

const HAS_GIFT = Boolean(GIFT_CARD.url || GIFT_CARD.code);

type Item = {
  id: string;
  icon: string;
  name: string;
  /** Shown once opened. `note` is set in italic serif, as a spoken aside. */
  body: string;
  note?: string;
  /** Rendered above the body - currently only the hug. */
  art?: "hug";
  /** Turns the item into something redeemable. */
  redeemable?: boolean;
};

const ITEMS: Item[] = [
  {
    id: "soup",
    icon: "🍲",
    name: "One bowl of soup",
    body: HAS_GIFT
      ? "This one is real. Dinner is on me tonight - order whatever you actually feel like eating, at whatever hour you finally stop working."
      : "Imaginary, and therefore calorie-free. The real version is available on request, at an address of your choosing, with no questions asked about where that is.",
    redeemable: true,
  },
  {
    id: "montblanc",
    icon: "☕",
    name: "One Mont Blanc",
    body: "Cold brew, vanilla cream, orange notes. Officially your pick of the day on 27.09, and formally reserved in your name until you are well enough to collect it.",
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
    name: "Medical leave, approved",
    body: "Duration: until further notice. Approved by management without review. Conditions: sleep, and absolutely no replying to this.",
  },
  {
    id: "hugs",
    icon: "🤗",
    name: "A hug",
    body: "Sent the only way it can be from here. Hold on to it until the real one is available again.",
    note: "You gave me two on Sunday. They were the best part of the day.",
    art: "hug",
  },
  {
    id: "quiet",
    icon: "🤫",
    name: "Nothing at all",
    body: "No question to answer, no plan to make, nothing to arrange. The last item in the package is simply being left alone to rest.",
  },
];

export function CarePackage() {
  const [opened, setOpened] = useState<string[]>([]);

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
            A package for <strong>Nithya</strong>, who has been unwell for over
            a week and is still at her desk at 11pm.
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
            Six items enclosed. Open them in any order, or none at all.
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
                        {item.redeemable && HAS_GIFT && <Redeem />}
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
                it. Get well, Nithya. 🌹
              </p>
            </div>
          )}

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
    </div>
  );
}

/** The live half of the soup: a link if we have one, otherwise a copyable code. */
function Redeem() {
  const [copied, setCopied] = useState(false);

  if (GIFT_CARD.url) {
    return (
      <div className="inv-parcel-action">
        <a
          className="inv-button inv-button--link"
          href={GIFT_CARD.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          Claim dinner →
        </a>
      </div>
    );
  }

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
        className="inv-button inv-button--link"
        href={GIFT_CARD.redeemUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        Open {GIFT_CARD.provider} →
      </a>
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
    </div>
  );
}
