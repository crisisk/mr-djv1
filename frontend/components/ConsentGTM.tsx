"use client";

import { useEffect, useRef, useState } from "react";

type ConsentGTMProps = {
  gtmId: string;
};

const STORAGE_KEY = "consent:analytics";
const CONSENT_EVENT = "mr-dj:marketing-consent-change";
const SCRIPT_ID = "mr-dj-gtm-loader";

function readStoredConsent() {
  if (typeof window === "undefined") return false;

  try {
    return window.localStorage.getItem(STORAGE_KEY) === "true";
  } catch (error) {
    console.warn("Unable to read stored consent preference", error);
    return false;
  }
}

function writeStoredConsent(value: boolean) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(STORAGE_KEY, value ? "true" : "false");
  } catch (error) {
    console.warn("Unable to persist consent preference", error);
  }
}

function removeGtmArtifacts() {
  if (typeof document === "undefined") return;

  const script = document.getElementById(SCRIPT_ID);
  if (script?.parentNode) {
    script.parentNode.removeChild(script);
  }

  const iframe = document.getElementById("mr-dj-gtm-noscript");
  if (iframe?.parentNode) {
    iframe.parentNode.removeChild(iframe);
  }
}

export default function ConsentGTM({ gtmId }: ConsentGTMProps) {
  const [consented, setConsented] = useState(false);
  const hasBooted = useRef(false);

  useEffect(() => {
    if (!gtmId) {
      hasBooted.current = false;
      removeGtmArtifacts();
      return;
    }

    setConsented(readStoredConsent());

    if (typeof window === "undefined") return;

    const handler = (event: Event) => {
      if (!("detail" in event)) {
        return;
      }

      const granted = Boolean((event as CustomEvent).detail?.granted ?? (event as CustomEvent).detail);
      writeStoredConsent(granted);
      setConsented(granted);

      if (!granted) {
        hasBooted.current = false;
        removeGtmArtifacts();
      }
    };

    window.addEventListener(CONSENT_EVENT, handler as EventListener);

    return () => {
      window.removeEventListener(CONSENT_EVENT, handler as EventListener);
    };
  }, [gtmId]);

  useEffect(() => {
    if (!gtmId) {
      hasBooted.current = false;
      return;
    }

    if (!consented) {
      removeGtmArtifacts();
      return;
    }

    if (hasBooted.current || typeof document === "undefined") {
      return;
    }

    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.innerHTML = `
      (function(w,d,s,l,i){
        w[l]=w[l]||[];
        w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});
        var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),
          dl=l!='dataLayer'? '&l='+l : '';
        j.async=true;
        j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
        f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','${gtmId}');
    `;

    document.head?.appendChild(script);
    hasBooted.current = true;
  }, [consented, gtmId]);

  if (!consented) {
    return null;
  }

  return (
    <noscript>
      <iframe
        id="mr-dj-gtm-noscript"
        title="Google Tag Manager"
        src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
        height="0"
        width="0"
        style={{ display: "none", visibility: "hidden" }}
      />
    </noscript>
  );
}
