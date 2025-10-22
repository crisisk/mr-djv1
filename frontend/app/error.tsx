"use client";
import { useEffect } from "react";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="nl">
      <body className="p-8">
        <h1>Er ging iets mis</h1>
        <p>Probeer het opnieuw of ga terug naar de homepage.</p>
        <button onClick={reset} className="btn btn-primary mt-4">Opnieuw proberen</button>
      </body>
    </html>
  );
}
