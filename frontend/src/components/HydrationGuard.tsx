"use client";
import React, { useEffect, useState } from "react";

type Mode = "debug" | "warn" | "patch";

type HydrationGuardProps = {
  children: React.ReactNode;
  mode?: Mode;
};

export default function HydrationGuard({ children, mode = "debug" }: HydrationGuardProps) {
  useEffect(() => {
    const onError = (event: ErrorEvent) => {
      const m = (event?.message || "").toLowerCase();
      if (m.includes("hydration")) {
        const msg = `[HydrationGuard] ${event.message}`;
        if (mode === "debug") console.error(msg);
        else if (mode === "warn") console.warn(msg);
      }
    };
    window.addEventListener("error", onError);
    return () => window.removeEventListener("error", onError);
  }, [mode]);

  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    if (mode === "patch") setTimeout(() => setNonce((n) => n + 1), 0);
  }, [mode]);

  return <React.Fragment key={nonce}>{children}</React.Fragment>;
}
