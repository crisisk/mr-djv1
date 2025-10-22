"use client";

import { useEffect } from "react";

type ConsentGTMProps = {
  gtmId: string;
};

export default function ConsentGTM({ gtmId }: ConsentGTMProps) {
  useEffect(() => {
    if (!gtmId) return;

    const consented = localStorage.getItem("consent:analytics") === "true";
    if (!consented) return;

    const existing = document.querySelector<HTMLScriptElement>(
      `script[data-gtm-id="${gtmId}"]`
    );
    if (existing) return;

    const script = document.createElement("script");
    script.type = "text/javascript";
    script.async = true;
    script.dataset.gtmId = gtmId;
    script.innerHTML = `
      (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});
      var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;
      j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','${gtmId}');
    `;
    document.head.appendChild(script);
  }, [gtmId]);

  return null;
}
