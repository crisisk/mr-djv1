import { useCallback, useState } from 'react';

const DEFAULT_BILLING_MODE = 'event';

const usePricingToggle = (initialMode = DEFAULT_BILLING_MODE) => {
  const [billingMode, setBillingMode] = useState(initialMode);

  const selectMonthly = useCallback(() => setBillingMode('monthly'), []);
  const selectEvent = useCallback(() => setBillingMode('event'), []);
  const toggleBillingMode = useCallback(
    () => setBillingMode((prev) => (prev === 'event' ? 'monthly' : 'event')),
    []
  );

  return {
    billingMode,
    isMonthly: billingMode === 'monthly',
    isEvent: billingMode === 'event',
    selectMonthly,
    selectEvent,
    toggleBillingMode,
  };
};

export default usePricingToggle;
