import type { ReactNode } from "react";

import ConsentGTM from "../components/ConsentGTM";
import HydrationGuard from "../src/components/HydrationGuard";

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;
  const mode = process.env.NODE_ENV === "production" ? "warn" : "debug";

  return (
    <html lang="nl">
      <body>
        <HydrationGuard mode={mode}>
          {gtmId ? <ConsentGTM gtmId={gtmId} /> : null}
          {children}
        </HydrationGuard>
      </body>
    </html>
  );
}
