import type { ReactNode } from "react";

import ConsentGTM from "../components/ConsentGTM";
import HydrationGuard from "../src/components/HydrationGuard";
import StructuredData from "./(marketing)/structured-data";

const gtmId = process.env.NEXT_PUBLIC_GTM_ID;
const hydrationMode = process.env.NODE_ENV === "production" ? "warn" : "debug";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="nl">
      <head>
        <StructuredData />
      </head>
      <body>
        <HydrationGuard mode={hydrationMode}>
          {children}
          {gtmId ? <ConsentGTM gtmId={gtmId} /> : null}
        </HydrationGuard>
      </body>
    </html>
  );
}
