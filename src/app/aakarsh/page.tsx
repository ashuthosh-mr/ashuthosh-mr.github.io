/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import Link from "next/link";
import { Cormorant_Garamond } from "next/font/google";
import "./farewell.css";

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-serif-invite",
  display: "swap",
});

const PLAYLIST_URL = "https://open.spotify.com/playlist/64bn3jD3frgvRMOoKd4ZTP";

const TITLE = "Gute Reise, Aakarsh";
const DESCRIPTION =
  "A send-off to Germany, from one research buddy to another.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  robots: { index: false, follow: false, nocache: true },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "website",
    images: [],
  },
  twitter: {
    card: "summary",
    title: TITLE,
    description: DESCRIPTION,
    images: [],
  },
};

/** A cheerful side-on airliner in Lufthansa colours. */
function Plane() {
  return (
    <svg
      className="fw-plane"
      width="84"
      height="38"
      viewBox="0 0 84 38"
      role="img"
      aria-label="An aeroplane taking off"
    >
      {/* vapour puffs */}
      <circle cx="6" cy="22" r="3" fill="rgba(255,255,255,0.8)" />
      <circle cx="13" cy="24" r="2.2" fill="rgba(255,255,255,0.6)" />
      {/* fuselage */}
      <path
        d="M14 20 C 30 14, 50 12, 70 13 C 76 13.2, 80 15, 80 17 C 80 19, 76 20.6, 70 21 C 52 22.2, 30 23, 14 22 Z"
        fill="#ffffff"
        stroke="#05164d"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      {/* tail fin, Lufthansa navy */}
      <path d="M68 13 L 82 3 L 83 6 L 74 15 Z" fill="#05164d" />
      {/* yellow accent on the tail */}
      <circle cx="77.5" cy="8" r="2.1" fill="#f9ba00" />
      {/* wing */}
      <path
        d="M40 19 L 54 30 L 60 29 L 50 19 Z"
        fill="#dbe4f2"
        stroke="#05164d"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      {/* windows */}
      <g fill="#9fb4d8">
        <circle cx="34" cy="17.4" r="1.1" />
        <circle cx="40" cy="17" r="1.1" />
        <circle cx="46" cy="16.8" r="1.1" />
        <circle cx="52" cy="16.8" r="1.1" />
      </g>
      {/* nose cockpit */}
      <path
        d="M72 15.5 C 76 15.5, 79 16.3, 79 17.2 C 79 18, 76 18.6, 72 18.6 Z"
        fill="#9fb4d8"
      />
    </svg>
  );
}

export default function AakarshPage() {
  return (
    <div className={serif.variable}>
      <div className="fw">
        <div className="fw-sky" aria-hidden />
        <div className="fw-sun" aria-hidden />

        <div className="fw-shell">
          <div className="fw-card">
            <div className="fw-head">
              <span className="fw-eyebrow">Boarding now</span>
              <span className="fw-ref">LH · BLR → DE</span>
            </div>

            <div className="fw-plane-stage" aria-hidden>
              <svg
                className="fw-trail"
                preserveAspectRatio="none"
                viewBox="0 0 1200 2"
              >
                <line x1="0" y1="1" x2="1200" y2="1" />
              </svg>
              <Plane />
            </div>

            <h1 className="fw-title">Gute Reise, Aakarsh ✈️</h1>
            <p className="fw-sub">
              Off to <strong>Germany</strong> for your studies. New country, new
              lab, new everything — you&apos;ve earned every bit of it.
            </p>

            <div className="fw-photo">
              <img
                src="/aakarsh/memory.jpg"
                alt="Aakarsh and Ashuthosh on the beach at sunset"
                width={1800}
                height={1350}
              />
              <p className="fw-caption">
                Research buddies. One beach, one sunset, many deadlines
                survived.
              </p>
            </div>

            <section className="fw-note">
              <h2 className="fw-section-label">A note before you fly</h2>
              <p>
                From lab benches and late nights to a whole new continent — it
                has been a genuine joy being your research buddy. The work was
                better for having you next to it, and so were the days.
              </p>
              <p className="soft">
                Go build something brilliant over there. Eat well, stay curious,
                and don&apos;t let the winters win. All the very best, always.
                🖤
              </p>
            </section>

            <div className="fw-german">
              <p className="fw-german-de">
                Wir sehen uns auf der anderen Seite.
              </p>
              <p className="fw-german-en">
                &ldquo;See you on the other side.&rdquo; — from the guy who
                learned German, immersion and all, long before you ever picked
                the country 🙈🇩🇪
              </p>
            </div>

            <section className="fw-cta">
              <p className="fw-cta-note">
                Something for the flight — a playlist for the long way over.
              </p>
              <a
                className="fw-button"
                href={PLAYLIST_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                Play the travel playlist →
              </a>
            </section>

            <div className="fw-pass">
              <div className="fw-pass-col">
                <span className="fw-pass-k">Passenger</span>
                <span className="fw-pass-v">AAKARSH</span>
              </div>
              <div className="fw-pass-col">
                <span className="fw-pass-k">Route</span>
                <span className="fw-pass-v">BLR → FRA</span>
              </div>
              <div className="fw-pass-col">
                <span className="fw-pass-k">Seat</span>
                <span className="fw-pass-v">1A · Window</span>
              </div>
              <div className="fw-pass-col">
                <span className="fw-pass-k">Status</span>
                <span className="fw-pass-v">BOARDING</span>
              </div>
            </div>
          </div>

          <p className="fw-signoff">
            <Link href="/">ashuthosh.de</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
