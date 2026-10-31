"use client";

import { Ornament, Petal, Sprig } from "@/components/date-florals";
import {
  DATE_EVENT,
  SECOND_DATE_EVENT,
  SECOND_DATE_VENUE_URL,
  buildIcs,
  googleCalendarUrl,
  type CalendarEvent,
} from "@/lib/calendar";
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

const FIRST_GOOGLE_URL = googleCalendarUrl(DATE_EVENT);
const SECOND_GOOGLE_URL = googleCalendarUrl(SECOND_DATE_EVENT);

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
  // Which .ics was just downloaded, so only that button says "Downloaded".
  const [downloaded, setDownloaded] = useState<string | null>(null);
  const [minutesOpen, setMinutesOpen] = useState(false);
  const [archiveOpen, setArchiveOpen] = useState(false);
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

  const downloadIcs = (event: CalendarEvent, filename: string) => {
    const blob = new Blob([buildIcs(event)], {
      type: "text/calendar;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    setDownloaded(event.uid);
    window.setTimeout(() => setDownloaded(null), 2600);
  };

  return (
    <div className="inv">
      <div className="inv-wash" aria-hidden />
      <Sprig className="inv-bloom inv-bloom--tl" />
      <Sprig className="inv-bloom inv-bloom--br" />

      <div className="inv-shell">
        {stage === "invitation" ? (
          <>
            <StatusBanner />
            <SecondInvitation
              headingRef={headingRef}
              onDownload={() =>
                downloadIcs(SECOND_DATE_EVENT, "second-date-with-the-pro.ics")
              }
              downloaded={downloaded === SECOND_DATE_EVENT.uid}
            />
            <ArchiveSection
              id="inv-archive-minutes"
              label="Archived: Minutes of Our First Date 📝"
              index={2}
              open={minutesOpen}
              onToggle={() => setMinutesOpen((o) => !o)}
            >
              <MeetingMinutes />
            </ArchiveSection>
            <ArchiveSection
              id="inv-archive-panel"
              label="Archived: Original Meeting Invitation 🌹"
              index={3}
              open={archiveOpen}
              onToggle={() => setArchiveOpen((o) => !o)}
            >
              <OriginalInvitation
                onDownload={() =>
                  downloadIcs(DATE_EVENT, "lunch-with-ashuthosh.ics")
                }
                downloaded={downloaded === DATE_EVENT.uid}
              />
            </ArchiveSection>
          </>
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

/* ------------------------------------------------------------------ */
/*  Gate                                                               */
/* ------------------------------------------------------------------ */

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

/* ------------------------------------------------------------------ */
/*  Status banner                                                      */
/* ------------------------------------------------------------------ */

function StatusBanner() {
  return (
    <div className="inv-status">
      <span className="inv-status-badge">
        <span className="inv-status-check" aria-hidden>
          ✓
        </span>
        Follow-up meeting requested
      </span>
      <p className="inv-status-sub">
        As per the action items of the previous meeting.
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Second invitation                                                  */
/* ------------------------------------------------------------------ */

function SecondInvitation({
  headingRef,
  onDownload,
  downloaded,
}: {
  headingRef: React.RefObject<HTMLHeadingElement | null>;
  onDownload: () => void;
  downloaded: boolean;
}) {
  return (
    <div
      className="inv-card inv-stagger"
      style={{ "--i": 1 } as React.CSSProperties}
    >
      <div className="inv-head">
        <span className="inv-eyebrow">Confidential</span>
        <span className="inv-ref">Ref · AMR/NR-01.11</span>
      </div>

      <div className="inv-ornament">
        <Ornament />
      </div>

      <div>
        <h1
          className="inv-title"
          ref={headingRef}
          tabIndex={-1}
          style={{ textAlign: "center" }}
        >
          Second Date With the Pro 😼
        </h1>
        <p className="inv-lede" style={{ textAlign: "center" }}>
          Dear <strong>Nithya</strong>, following the successful conclusion of
          our first meeting, a follow-up session is officially requested.
        </p>
      </div>

      <div className="inv-slot">
        <div className="inv-slot-times">
          <span>8:00 PM</span>
          <span>10:00 PM</span>
        </div>
        <div className="inv-slot-bar">
          <span className="inv-slot-fill" />
        </div>
        <p className="inv-slot-note">
          Two hours this time. Extensions will be looked upon favourably.
        </p>
      </div>

      <dl className="inv-details">
        <div className="inv-detail">
          <dt>Date</dt>
          <dd>Sunday, November 1, 2026</dd>
        </div>
        <div className="inv-detail">
          <dt>Time</dt>
          <dd>8:00 PM IST onwards</dd>
        </div>
        <div className="inv-detail inv-detail--wide">
          <dt>Venue</dt>
          <dd>
            <a
              className="inv-venue-link"
              href={SECOND_DATE_VENUE_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              DIHA Café, JP Nagar, Bengaluru
            </a>
          </dd>
        </div>
        <div className="inv-detail">
          <dt>Attendees</dt>
          <dd>Ashuthosh &amp; Nithya</dd>
        </div>
        <div className="inv-detail">
          <dt>Occasion</dt>
          <dd>Our second date</dd>
        </div>
      </dl>

      <section className="inv-block">
        <h2 className="inv-section-label">Meeting agenda</h2>
        <ol className="inv-agenda">
          <li>Review the action items from our first meeting.</li>
          <li>
            Engineer to demonstrate improved in-person conversational
            throughput. Results not guaranteed.
          </li>
          <li>
            Dinner, dessert and a search for this venue&apos;s answer to the
            Mont Blanc.
          </li>
          <li>Continue investigating claims of being a pro. Still unverified.</li>
        </ol>
      </section>

      <section className="inv-block">
        <h2 className="inv-section-label">Carried forward from last time</h2>
        <ul className="inv-actions">
          <li className="inv-action-item">
            <span className="inv-action-check" aria-hidden>
              <span className="inv-action-box" />
            </span>
            <span>
              Engineer to improve in-person conversational throughput.{" "}
              <span className="inv-progress">In progress</span>
            </span>
          </li>
          <li className="inv-action-item">
            <span className="inv-action-check" aria-hidden>
              <span className="inv-action-box inv-action-box--done">✓</span>
            </span>
            <span>
              Nithya to recover from her cold and get some proper sleep.{" "}
              <span className="inv-progress inv-progress--done">
                Hopefully done
              </span>
            </span>
          </li>
          <li className="inv-action-item">
            <span className="inv-action-check" aria-hidden>
              <span className="inv-action-box" />
            </span>
            <span>
              Settle whether quesadillas are just Malabar parotta abroad.{" "}
              <span className="inv-progress">Research ongoing</span>
            </span>
          </li>
        </ul>
      </section>

      <section className="inv-block">
        <h2 className="inv-section-label">Dress code</h2>
        <div className="inv-chips">
          <span className="inv-chip">Your call</span>
          <span className="inv-chip">Still your call</span>
        </div>
        <p className="inv-lede" style={{ margin: 0 }}>
          The engineer will try not to get distracted. No promises. 🙈
        </p>
      </section>

      <section className="inv-note">
        <h2 className="inv-section-label" style={{ margin: 0 }}>
          Risk assessment
        </h2>
        <p>
          Last time&apos;s root cause, excessive cuteness, is expected to
          happen again. The engineer has been warned and is attending anyway. 🌹
        </p>
      </section>

      <section className="inv-cal">
        <p className="inv-cal-note">Blocking your calendar again, as agreed.</p>
        <a
          className="inv-button inv-button--link"
          href={SECOND_GOOGLE_URL}
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
        <a
          className="inv-button inv-button--ghost inv-button--link"
          href={SECOND_DATE_VENUE_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          Open in Google Maps
        </a>
      </section>

      <div className="inv-foot">
        <p>
          This invitation is non-transferable. Talking more than last time is
          allowed, encouraged and honestly overdue.
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Meeting minutes                                                    */
/* ------------------------------------------------------------------ */

function MeetingMinutes() {
  return (
    <div className="inv-minutes">
      {/* Header card */}
      <div
        className="inv-card inv-stagger"
        style={{ "--i": 0 } as React.CSSProperties}
      >
        <div className="inv-minutes-header">
          <span className="inv-minutes-confidential">
            🔒 Confidential — Meeting Minutes
          </span>

          <div className="inv-ornament" style={{ margin: "1rem 0 0.5rem" }}>
            <Ornament />
          </div>

          <h2
            className="inv-title"
            style={{ textAlign: "center", marginTop: "0.5rem" }}
          >
            Minutes of Our First Date 🌹
          </h2>
        </div>

        <div className="inv-minutes-meta">
          <span>
            <strong>Date:</strong> Sunday, September 27, 2026
          </span>
          <span>
            <strong>Venue:</strong> Dual Room, Indiranagar, Bengaluru
          </span>
          <span>
            <strong>Attendees:</strong> Ashuthosh &amp; Nithya
          </span>
          <span>
            <strong>Meeting commenced:</strong> 12:45 PM IST
          </span>
          <span className="inv-minutes-status">
            <strong>Status:</strong>
            <span className="inv-minutes-status-dot" aria-hidden />
            Successfully concluded
          </span>
        </div>
      </div>

      {/* Executive summary */}
      <div
        className="inv-card inv-stagger"
        style={{ "--i": 1 } as React.CSSProperties}
      >
        <h2 className="inv-section-label">Executive summary</h2>
        <div className="inv-summary">
          <p>A highly anticipated meeting was successfully conducted.</p>
          <p>
            The engineer, previously known for excessive texting, experienced an
            unexpected reduction in verbal output.
          </p>
          <p>
            Preliminary investigation suggests that the attendee being
            exceptionally cute was the primary contributing factor. 🙈
          </p>
        </div>
      </div>

      {/* Culinary findings */}
      <div
        className="inv-card inv-stagger"
        style={{ "--i": 2 } as React.CSSProperties}
      >
        <h2 className="inv-section-label">Culinary findings</h2>

        <div className="inv-culinary-item">
          <p className="inv-culinary-name">
            1. Mushroom Quesadillas
          </p>
          <p className="inv-culinary-verdict">
            According to Nithya, suspiciously similar to Malabar parotta. The
            engineer has neither confirmed nor denied these allegations.
          </p>
        </div>

        <div className="inv-culinary-item">
          <p className="inv-culinary-name">
            2. Potato-Based Noodles
          </p>
          <p className="inv-culinary-verdict">
            Overall assessment: Okay. A respectable supporting character in
            today&apos;s culinary proceedings.
          </p>
        </div>

        <div className="inv-culinary-item">
          <p className="inv-culinary-name">
            3. Mont Blanc
          </p>
          <p className="inv-culinary-verdict">
            Cold brew, vanilla cream and orange notes. Nithya&apos;s favourite
            discovery of the afternoon.
          </p>
          <p className="inv-culinary-verdict">
            <em>Officially granted a special mention in the minutes.</em>
          </p>
          <div className="inv-drink-highlight">
            ☕ Special mention — Nithya&apos;s pick of the day
          </div>
        </div>
      </div>

      {/* Technical incident report */}
      <div
        className="inv-card inv-stagger"
        style={{ "--i": 3 } as React.CSSProperties}
      >
        <h2 className="inv-section-label">Technical incident report</h2>
        <div className="inv-incident">
          <div className="inv-incident-grid">
            <div className="inv-incident-row">
              <span className="inv-incident-label">Status</span>
              <span className="inv-incident-value">
                <span className="inv-incident-badge">
                  <span className="inv-incident-badge-dot" aria-hidden />
                  Unexpected system behaviour
                </span>
              </span>
            </div>
            <div className="inv-incident-row">
              <span className="inv-incident-label">Incident</span>
              <span className="inv-incident-value">
                Engineer significantly quieter than his texting history
                suggested.
              </span>
            </div>
            <div className="inv-incident-row">
              <span className="inv-incident-label">Root cause</span>
              <span className="inv-incident-value">
                Excessive cuteness detected.
              </span>
            </div>
            <div className="inv-incident-row">
              <span className="inv-incident-label">Impact</span>
              <span className="inv-incident-value">
                Temporary overheating and reduced conversational throughput.
              </span>
            </div>
            <div className="inv-incident-row">
              <span className="inv-incident-label">Resolution</span>
              <span className="inv-incident-value">
                Further investigation pending. Engineer currently recovering
                from unexpected cuteness exposure. 🙈
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Action items */}
      <div
        className="inv-card inv-stagger"
        style={{ "--i": 4 } as React.CSSProperties}
      >
        <h2 className="inv-section-label">Action items</h2>
        <ul className="inv-actions">
          <li className="inv-action-item">
            <span className="inv-action-check" aria-hidden>
              <span className="inv-action-box" />
            </span>
            <span>
              Engineer to improve in-person conversational throughput.
            </span>
          </li>
          <li className="inv-action-item">
            <span className="inv-action-check" aria-hidden>
              <span className="inv-action-box" />
            </span>
            <span>
              Nithya to recover from her cold and get some proper sleep.
            </span>
          </li>
          <li className="inv-action-item">
            <span className="inv-action-check" aria-hidden>
              <span className="inv-action-box" />
            </span>
            <span>
              Both parties to remember that mushroom quesadillas are apparently
              Malabar parotta&apos;s international cousins.
            </span>
          </li>
        </ul>
      </div>

      {/* Personal note */}
      <div
        className="inv-personal inv-stagger"
        style={{ "--i": 5 } as React.CSSProperties}
      >
        <h2 className="inv-section-label" style={{ margin: 0 }}>
          Personal note from the engineer
        </h2>
        <p className="inv-personal-quote">
          &ldquo;You looked so cute today.
        </p>
        <p className="inv-personal-closing">
          I know I was quieter than I am over text, but I genuinely had a lovely
          time with you. Thank you for making time to meet me even though you
          weren&apos;t feeling your best.
        </p>
        <p className="inv-personal-closing">
          I&apos;d love to see you again sometime. Until then, please get some
          proper rest. 🌹&rdquo;
        </p>
        <span className="inv-personal-heart" aria-hidden>
          ❤️
        </span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Archive section (original invitation)                              */
/* ------------------------------------------------------------------ */

function ArchiveSection({
  id,
  label,
  index,
  open,
  onToggle,
  children,
}: {
  id: string;
  label: string;
  index: number;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div
      className="inv-archive inv-stagger"
      style={{ "--i": index } as React.CSSProperties}
    >
      <button
        className="inv-archive-toggle"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={id}
      >
        {label}
        <span className="inv-archive-chevron" aria-hidden>
          ▼
        </span>
      </button>
      <div
        id={id}
        className="inv-archive-body"
        data-open={open}
        role="region"
        aria-label={label}
        // Collapsed content stays out of the tab order and screen readers.
        inert={!open}
      >
        <div className="inv-archive-inner">{children}</div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Original invitation (preserved)                                    */
/* ------------------------------------------------------------------ */

function OriginalInvitation({
  onDownload,
  downloaded,
}: {
  onDownload: () => void;
  downloaded: boolean;
}) {
  return (
    <div className="inv-card">
      <div className="inv-head">
        <span className="inv-eyebrow">Confidential</span>
        <span className="inv-ref">Ref · AMR/NR-27.09</span>
      </div>

      <div className="inv-ornament">
        <Ornament />
      </div>

      <div>
        <h2
          className="inv-title"
          style={{ textAlign: "center" }}
        >
          A Date With a Pro 😼
        </h2>
        <p className="inv-lede" style={{ textAlign: "center" }}>
          Dear <strong>Nithya</strong>, your presence is officially requested.
        </p>
      </div>

      <div className="inv-slot">
        <div className="inv-slot-times">
          <span>12:00 PM</span>
          <span>1:30 PM</span>
        </div>
        <div className="inv-slot-bar">
          <span className="inv-slot-fill" />
        </div>
        <p className="inv-slot-note">A 90-minute slot, as negotiated</p>
      </div>

      <dl className="inv-details">
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

      <section className="inv-block">
        <h2 className="inv-section-label">Meeting agenda</h2>
        <ol className="inv-agenda">
          <li>Investigate claims of being a pro.</li>
          <li>Lunch, laughter and questionable corporate humour.</li>
          <li>Absolutely no PowerPoint presentations.</li>
        </ol>
      </section>

      <section className="inv-block">
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

      <section className="inv-note">
        <h2 className="inv-section-label" style={{ margin: 0 }}>
          Special note
        </h2>
        <p>Turns out, surprising you goes without saying. 🙈</p>
      </section>

      <section className="inv-cal">
        <p className="inv-cal-note">
          You did say I should block your calendar.
        </p>
        <a
          className="inv-button inv-button--link"
          href={FIRST_GOOGLE_URL}
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

      <div className="inv-foot">
        <p>
          This invitation is non-transferable and, regrettably, includes no
          slide deck. Punctuality appreciated; over-running is permitted.
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Petals                                                             */
/* ------------------------------------------------------------------ */

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
