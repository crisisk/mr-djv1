import type { ReactNode } from "react";
import HydrationGuard from "../src/components/HydrationGuard";
import ConsentGTM from "../components/ConsentGTM";
import StructuredData from "./(marketing)/structured-data";

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;
  const hydrationMode = process.env.NODE_ENV === "production" ? "warn" : "debug";

  return (
    <html lang="nl">
      <head>
        <StructuredData />
      </head>
      <body>
        <HydrationGuard mode={hydrationMode}>
          <>
            {children}
            {gtmId ? <ConsentGTM gtmId={gtmId} /> : null}
          </>
        </HydrationGuard>
      </body>
    </html>
  );
}
