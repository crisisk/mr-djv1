import type { Metadata } from "next";
import type { ReactNode } from "react";

import ConsentGTM from "../components/ConsentGTM";
import HydrationGuard from "../src/components/HydrationGuard";
import StructuredData from "./(marketing)/structured-data";
import { inter, playfair } from "./fonts";

export const metadata: Metadata = {
  metadataBase: new URL("https://mr-dj.sevensa.nl"),
  title: {
    default: "Mister DJ | DJ en showproductie voor events in Nederland",
    template: "%s | Mister DJ",
  },
  description:
    "Mister DJ levert premium DJ's, live-acts en showproductie voor bruiloften, bedrijfsfeesten en events in Nederland.",
  openGraph: {
    type: "website",
    locale: "nl_NL",
    siteName: "Mister DJ",
    url: "https://mr-dj.sevensa.nl",
    title: "Mister DJ | DJ en showproductie voor events in Nederland",
    description:
      "Full-service DJ en entertainmentteam voor bruiloften, bedrijfsfeesten en evenementen in Nederland.",
    images: [
      {
        url: "/images/logo.webp",
        alt: "Mister DJ logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mister DJ | DJ en showproductie voor events in Nederland",
    description:
      "Premium DJ's, live-acts en showproductie voor bruiloften, bedrijfsfeesten en evenementen door heel Nederland.",
    images: ["/images/logo.webp"],
  },
};

const gtmId = process.env.NEXT_PUBLIC_GTM_ID;
const hydrationMode = process.env.NODE_ENV === "production" ? "warn" : "debug";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="nl" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        <StructuredData />
      </head>
      <body className="min-h-screen bg-neutral-light text-neutral-dark antialiased">
        <HydrationGuard mode={hydrationMode}>
          {children}
          {gtmId ? <ConsentGTM gtmId={gtmId} /> : null}
        </HydrationGuard>
      </body>
    </html>
  );
}
