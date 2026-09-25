"use client";

import { Ornament, Petal, Sprig } from "@/components/date-florals";
import { DATE_EVENT, buildIcs, googleCalendarUrl } from "@/lib/calendar";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

/**
 * The name is compared in memory and never stored, transmitted or put in the
 * URL - this is a doorway, not authentication. Punctuation and spacing are
 * forgiven, and a surname is fine, so "Nithya!", " nithya " and "Nithya R" all
 * open it.
 */
function isTheRightPerson(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z]/g, "")
    .startsWith("nithya");
}

const GOOGLE_URL = googleCalendarUrl(DATE_EVENT);

type FallingPetal = {
  id: number;
  left: string;
  size: number;
  delay: string;
  duration: string;
  drift: string;
  spin: string;
};

/**
 * Called from the unlock handler rather than during render or in an effect:
 * randomness is a side effect, and an event is the honest place for it.
 */
function makePetals(): FallingPetal[] {
  return Array.from({ length: 14 }, (_, index) => ({
    id: index,
    left: `${Math.random() * 96}%`,
    size: 9 + Math.random() * 9,
    delay: `${Math.random() * 1.1}s`,
    duration: `${3 + Math.random() * 2}s`,
    drift: `${(Math.random() - 0.5) * 9}rem`,
    spin: `${180 + Math.random() * 420}deg`,
  }));
}

type Stage = "gate" | "leaving" | "invitation";

export function DateInvitation() {
  const [stage, setStage] = useState<Stage>("gate");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [shake, setShake] = useState(0);
  const [petals, setPetals] = useState<FallingPetal[]>([]);
  const [downloaded, setDownloaded] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);

  // The page sits on a light palette while the rest of the site is dark, so
  // paint the document itself - otherwise iOS shows dark behind the rubber-band
  // overscroll at the top and bottom of the page.
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

  const unlock = useCallback(() => {
    setError("");
    setStage("leaving");
    const motionOk = !window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches;
    window.setTimeout(
      () => {
        setStage("invitation");
        if (motionOk) {
          setPetals(makePetals());
          window.setTimeout(() => setPetals([]), 5200);
        }
        // Send focus into the revealed content rather than leaving it on a
        // button that no longer exists.
        window.setTimeout(() => headingRef.current?.focus(), 80);
      },
      motionOk ? 380 : 0,
    );
  }, []);

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const entered = name.trim();

    if (!entered) {
      setError("A name would help. 🙂");
      setShake((n) => n + 1);
      return;
    }
    if (!isTheRightPerson(entered)) {
      setError("Sorry, this invitation is reserved for someone special. 😼");
      setShake((n) => n + 1);
      return;
    }
    unlock();
  };

  const downloadIcs = () => {
    const blob = new Blob([buildIcs(DATE_EVENT)], {
      type: "text/calendar;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "lunch-with-ashuthosh.ics";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    setDownloaded(true);
    window.setTimeout(() => setDownloaded(false), 2600);
  };

  return (
    <div className="inv">
      <div className="inv-wash" aria-hidden />
      <Sprig className="inv-bloom inv-bloom--tl" />
      <Sprig className="inv-bloom inv-bloom--br" />

      <div className="inv-shell">
        {stage === "invitation" ? (
          <Invitation
            headingRef={headingRef}
            onDownload={downloadIcs}
            downloaded={downloaded}
          />
        ) : (
          <Gate
            stage={stage}
            name={name}
            error={error}
            shake={shake}
            onChange={setName}
            onSubmit={onSubmit}
          />
        )}
        <p className="inv-signoff">
          <Link href="/">ashuthosh.de</Link>
        </p>
      </div>

      {petals.length > 0 && <Petals petals={petals} />}
    </div>
  );
}

function Gate({
  stage,
  name,
  error,
  shake,
  onChange,
  onSubmit,
}: {
  stage: Stage;
  name: string;
  error: string;
  shake: number;
  onChange: (value: string) => void;
  onSubmit: (event: React.FormEvent) => void;
}) {
  return (
    <div
      className={`inv-card inv-gate inv-enter${stage === "leaving" ? " inv-leaving" : ""}`}
    >
      <div className="inv-gate-flourish">
        <Ornament />
      </div>

      <p className="inv-eyebrow" style={{ marginTop: "1.125rem" }}>
        Private · By invitation
      </p>
      <h1 className="inv-title inv-title--gate">Confidential Invitation</h1>
      <p className="inv-lede">
        An important calendar event awaits. Please verify your identity.
      </p>

      {/* key on `shake` restarts the animation on every failed attempt */}
      <form className="inv-form" onSubmit={onSubmit} key={shake} noValidate>
        <label
          className="inv-eyebrow"
          htmlFor="inv-name"
          style={{ textAlign: "center" }}
        >
          <span
            style={{
              position: "absolute",
              width: 1,
              height: 1,
              overflow: "hidden",
              clip: "rect(0 0 0 0)",
              whiteSpace: "nowrap",
            }}
          >
            Your name
          </span>
        </label>
        <input
          id="inv-name"
          className={`inv-input${shake ? " inv-shake" : ""}`}
          type="text"
          value={name}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Enter your name…"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="words"
          spellCheck={false}
          enterKeyHint="go"
          aria-describedby="inv-error"
          aria-label="Your name"
        />
        <button className="inv-button" type="submit">
          Unlock invitation <span aria-hidden>→</span>
        </button>
      </form>

      <p className="inv-error" id="inv-error" role="alert">
        {error}
      </p>

      <p className="inv-fineprint">
        Nothing you type is saved or sent anywhere. It stays in this browser
        tab.
      </p>
    </div>
  );
}

function Invitation({
  headingRef,
  onDownload,
  downloaded,
}: {
  headingRef: React.RefObject<HTMLHeadingElement | null>;
  onDownload: () => void;
  downloaded: boolean;
}) {
  return (
    <div className="inv-card inv-enter">
      <div
        className="inv-head inv-stagger"
        style={{ "--i": 0 } as React.CSSProperties}
      >
        <span className="inv-eyebrow">Confidential</span>
        <span className="inv-ref">Ref · AMR/NR-27.09</span>
      </div>

      <div
        className="inv-ornament inv-stagger"
        style={{ "--i": 1 } as React.CSSProperties}
      >
        <Ornament />
      </div>

      <div className="inv-stagger" style={{ "--i": 2 } as React.CSSProperties}>
        <h1
          className="inv-title"
          ref={headingRef}
          tabIndex={-1}
          style={{ textAlign: "center" }}
        >
          A Date With a Pro 😼
        </h1>
        <p className="inv-lede" style={{ textAlign: "center" }}>
          Dear <strong>Nithya</strong>, your presence is officially requested.
        </p>
      </div>

      <div
        className="inv-slot inv-stagger"
        style={{ "--i": 3 } as React.CSSProperties}
      >
        <div className="inv-slot-times">
          <span>12:00 PM</span>
          <span>1:30 PM</span>
        </div>
        <div className="inv-slot-bar">
          <span className="inv-slot-fill" />
        </div>
        <p className="inv-slot-note">A 90-minute slot, as negotiated</p>
      </div>

      <dl
        className="inv-details inv-stagger"
        style={{ "--i": 4 } as React.CSSProperties}
      >
        <div className="inv-detail">
          <dt>Date</dt>
          <dd>Sunday, September 27, 2026</dd>
        </div>
        <div className="inv-detail">
          <dt>Time</dt>
          <dd>12:00 PM – 1:30 PM IST</dd>
        </div>
        <div className="inv-detail inv-detail--wide">
          <dt>Venue</dt>
          <dd>Dual Room, Indiranagar, Bengaluru</dd>
        </div>
        <div className="inv-detail">
          <dt>Attendees</dt>
          <dd>Ashuthosh &amp; Nithya</dd>
        </div>
        <div className="inv-detail">
          <dt>Occasion</dt>
          <dd>Our first lunch date</dd>
        </div>
      </dl>

      <section
        className="inv-block inv-stagger"
        style={{ "--i": 5 } as React.CSSProperties}
      >
        <h2 className="inv-section-label">Meeting agenda</h2>
        <ol className="inv-agenda">
          <li>Investigate claims of being a pro.</li>
          <li>Lunch, laughter and questionable corporate humour.</li>
          <li>Absolutely no PowerPoint presentations.</li>
        </ol>
      </section>

      <section
        className="inv-block inv-stagger"
        style={{ "--i": 6 } as React.CSSProperties}
      >
        <h2 className="inv-section-label">Dress code</h2>
        <div className="inv-chips">
          <span className="inv-chip">Dhoti</span>
          <span className="inv-chip">Suit</span>
          <span className="inv-chip">Casuals</span>
        </div>
        <p className="inv-lede" style={{ margin: 0 }}>
          Your call, apparently. 😂
        </p>
      </section>

      <section
        className="inv-note inv-stagger"
        style={{ "--i": 7 } as React.CSSProperties}
      >
        <h2 className="inv-section-label" style={{ margin: 0 }}>
          Special note
        </h2>
        <p>Turns out, surprising you goes without saying. 🙈</p>
      </section>

      <section
        className="inv-cal inv-stagger"
        style={{ "--i": 8 } as React.CSSProperties}
      >
        <p className="inv-cal-note">
          You did say I should block your calendar.
        </p>
        <a
          className="inv-button inv-button--link"
          href={GOOGLE_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          Add to Google Calendar
        </a>
        <button
          className="inv-button inv-button--ghost"
          type="button"
          onClick={onDownload}
        >
          {downloaded ? "Downloaded ✓" : "Apple / Outlook (.ics)"}
        </button>
      </section>

      <div
        className="inv-foot inv-stagger"
        style={{ "--i": 9 } as React.CSSProperties}
      >
        <p>
          This invitation is non-transferable and, regrettably, includes no
          slide deck. Punctuality appreciated; over-running is permitted.
        </p>
      </div>
    </div>
  );
}

function Petals({ petals }: { petals: FallingPetal[] }) {
  return (
    <div className="inv-petals" aria-hidden>
      {petals.map((petal) => (
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
  );
}
