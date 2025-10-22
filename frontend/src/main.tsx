import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import HydrationGuard from "./components/HydrationGuard";
import { registerSW } from "virtual:pwa-register";

registerSW({ immediate: true });

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HydrationGuard mode={import.meta.env.PROD ? "warn" : "debug"}>
      <App />
    </HydrationGuard>
  </StrictMode>,
);
