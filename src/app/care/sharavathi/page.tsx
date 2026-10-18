import { SharavathiHappyPlace } from "@/components/sharavathi-happy-place";
import type { Metadata } from "next";
import { Cormorant_Garamond } from "next/font/google";
import "../../date/invitation.css";
import "../care.css";
import "./happy.css";

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-serif-invite",
  display: "swap",
});

const TITLE = "A Little Happy Place";
const DESCRIPTION = "A tiny corner of happiness, made just for you.";

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

export default function SharavathiPage() {
  return (
    <div className={serif.variable}>
      <SharavathiHappyPlace />
    </div>
  );
}
