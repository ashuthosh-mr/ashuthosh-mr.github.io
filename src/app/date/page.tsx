import { DateInvitation } from "@/components/date-invitation";
import type { Metadata } from "next";
import { Cormorant_Garamond } from "next/font/google";
import "./invitation.css";

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-serif-invite",
  display: "swap",
});

const TITLE = "Confidential Invitation";
const DESCRIPTION = "An important calendar event awaits.";

export const metadata: Metadata = {
  // Escapes the site-wide "%s | Ashuthosh M. R." template - this page should
  // not announce itself as part of the portfolio.
  title: { absolute: TITLE },
  description: DESCRIPTION,
  // A private invitation has no business in a search index.
  robots: { index: false, follow: false, nocache: true },
  alternates: { canonical: undefined },
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

export default function DatePage() {
  return (
    <div className={serif.variable}>
      <DateInvitation />
    </div>
  );
}
