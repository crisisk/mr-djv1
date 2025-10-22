import { useCallback, useState } from "react";

export type BillingMode = "event" | "monthly";

const usePricingToggle = (initialMode: BillingMode = "event") => {
  const [billingMode, setBillingMode] = useState<BillingMode>(initialMode);

  const selectMonthly = useCallback(() => setBillingMode("monthly"), []);
  const selectEvent = useCallback(() => setBillingMode("event"), []);
  const toggleBillingMode = useCallback(
    () => setBillingMode((prev) => (prev === "event" ? "monthly" : "event")),
    [],
  );

  return {
    billingMode,
    isMonthly: billingMode === "monthly",
    isEvent: billingMode === "event",
    selectMonthly,
    selectEvent,
    toggleBillingMode,
  } as const;
};

export default usePricingToggle;
