import type { ReactNode } from "react";

import ConsentGTM from "../components/ConsentGTM";
import HydrationGuard from "../src/components/HydrationGuard";
import StructuredData from "./(marketing)/structured-data";
import { inter, playfair } from "./fonts";

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
