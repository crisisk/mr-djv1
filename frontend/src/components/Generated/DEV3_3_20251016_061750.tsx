import React from 'react';
import './PricingPage.css';

const PricingPageA = () => {
  return (
    <div className="pricing-page">
      <h1>Pricing - Variant A</h1>
      <div className="pricing-plans">
        <div className="plan">
          <h2>Basic Plan</h2>
          <p>$99/month</p>
          <button onClick={() => trackEvent('basic-plan-click')}>Select Plan</button>
        </div>
        <div className="plan">
          <h2>Premium Plan</h2>
          <p>$199/month</p>
          <button onClick={() => trackEvent('premium-plan-click')}>Select Plan</button>
        </div>
      </div>
    </div>
  );
};

export default PricingPageA;
