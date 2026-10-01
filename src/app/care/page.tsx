import { CarePackage } from "@/components/care-package";
import type { Metadata } from "next";
import { Cormorant_Garamond } from "next/font/google";
import "../date/invitation.css";
import "./care.css";

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-serif-invite",
  display: "swap",
});

const TITLE = "A Care Package";
const DESCRIPTION = "Undeliverable by post. Rerouted digitally.";

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

export default function CarePage() {
  return (
    <div className={serif.variable}>
      <CarePackage />
    </div>
  );
}
