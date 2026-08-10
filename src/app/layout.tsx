import Navbar from "@/components/navbar";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DATA } from "@/data/resume";
import { cn, withBasePath } from "@/lib/utils";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { FlickeringGrid } from "@/components/magicui/flickering-grid";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || DATA.url;

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-mono",
});

const ogImagePath = withBasePath("/og.png");

const personJsonLd = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Person",
  name: DATA.name,
  url: siteUrl,
  image: `${siteUrl}${withBasePath(DATA.avatarUrl)}`,
  sameAs: [
    DATA.contact.social.GitHub.url,
    DATA.contact.social.LinkedIn.url,
    DATA.contact.social.X.url,
  ],
  jobTitle: "Co-Founder",
  worksFor: {
    "@type": "Organization",
    name: "Heisenbug",
    url: "https://www.heisenbug.ai/",
  },
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "Indian Institute of Technology, Bombay",
    url: "https://www.iitb.ac.in/",
  },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Mumbai",
    addressRegion: "Maharashtra",
    addressCountry: "IN",
  },
  knowsAbout: [
    "Agentic AI",
    "Privacy Engineering",
    "Integrated Photonics",
    "DPDP Compliance",
    "Python",
    "TypeScript",
    "Embedded Systems",
    "Semiconductor Devices",
    "Cybersecurity",
  ],
}).replace(/</g, "\\u003c");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: DATA.name,
    template: `%s | ${DATA.name}`,
  },
  description: DATA.description,
  keywords: [
    "Shiwani Mishra",
    "Shiwani Mishra IIT Bombay",
    "Heisenbug",
    "EPFL LPQM",
    "Kippenberg Lab",
    "agentic AI",
    "privacy engineering",
    "DPDP compliance",
    "integrated photonics",
    "silicon nitride microresonators",
    "dependency aging advisor",
    "SBOM",
    "electrical engineering IIT Bombay",
    "software engineer Mumbai",
    "co-founder India",
  ],
  authors: [{ name: DATA.name, url: siteUrl }],
  creator: DATA.name,
  publisher: DATA.name,
  alternates: {
    canonical: siteUrl,
  },
  manifest: "/manifest.json",
  openGraph: {
    title: `${DATA.name}`,
    description: DATA.description,
    url: siteUrl,
    siteName: `${DATA.name}`,
    locale: "en_US",
    type: "website",
    images: [
      {
        url: ogImagePath,
        width: 1200,
        height: 630,
        alt: DATA.name,
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  twitter: {
    title: `${DATA.name}`,
    card: "summary_large_image",
    creator: "@ishiwanimishra",
    site: "@ishiwanimishra",
    images: [ogImagePath],
  },
  verification: {
    google: "",
    yandex: "",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: personJsonLd }}
        />
      </head>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased relative",
          geist.variable,
          geistMono.variable
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="light">
          <TooltipProvider delayDuration={0}>
            <div className="absolute inset-0 top-0 left-0 right-0 h-[100px] overflow-hidden z-0">
              <FlickeringGrid
                className="h-full w-full"
                squareSize={2}
                gridGap={2}
                style={{
                  maskImage: "linear-gradient(to bottom, black, transparent)",
                  WebkitMaskImage: "linear-gradient(to bottom, black, transparent)",
                }}
              />
            </div>
            <div className="relative z-10 max-w-2xl mx-auto py-12 pb-24 sm:py-24 px-6">
              {children}
            </div>
            <Navbar />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
