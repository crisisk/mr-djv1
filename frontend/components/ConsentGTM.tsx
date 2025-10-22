"use client";

import { useEffect, useState } from "react";

type ConsentGTMProps = {
  gtmId: string;
};

export default function ConsentGTM({ gtmId }: ConsentGTMProps) {
  const [consented, setConsented] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem("consent:analytics");
      setConsented(stored === "true");
    } catch (error) {
      console.warn("[ConsentGTM] Unable to read consent flag", error);
    }
  }, []);

  useEffect(() => {
    if (!consented) {
      return;
    }

    const existingScript = document.querySelector(
      `script[data-gtm-id="${gtmId}"]`
    );

    if (existingScript) {
      return;
    }

    const script = document.createElement("script");
    script.dataset.gtmId = gtmId;
    script.innerHTML = `
      (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});
      var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;
      j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','${gtmId}');
    `;

    document.head.appendChild(script);

    return () => {
      script.remove();
    };
  }, [consented, gtmId]);

  return null;
}
