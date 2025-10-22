"use client";

import { useEffect, useState } from "react";

type ConsentGTMProps = {
  gtmId: string;
};

export default function ConsentGTM({ gtmId }: ConsentGTMProps) {
  const [consented, setConsented] = useState(false);

  useEffect(() => {
    if (!gtmId) return;

    const ok = localStorage.getItem("consent:analytics") === "true";
    setConsented(ok);
  }, [gtmId]);

  useEffect(() => {
    if (!consented || !gtmId) return;

    if (!hasConsent) return;

    const script = document.createElement("script");
    script.innerHTML = `
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});
        var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;
        j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','${gtmId}');
      `;
    document.head.appendChild(script);
  }, [consented, gtmId]);

    return consented ? (
      <noscript>
        <iframe
          title="Google Tag Manager"
          src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
          height="0"
          width="0"
          style={{ display: "none", visibility: "hidden" }}
        />
      </noscript>
    ) : null;
}
