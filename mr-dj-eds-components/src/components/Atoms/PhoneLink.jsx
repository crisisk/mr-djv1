import React from 'react';
import { trackPhoneClick, getUserVariant } from '../../utils/trackConversion';

/**
 * PhoneLink Component
 *
 * A reusable component for phone links that automatically tracks clicks.
 * Use this instead of regular <a href="tel:"> links to ensure GA4 tracking.
 *
 * Props:
 * @param {string} phoneNumber - The phone number to call (e.g., "+31408422594")
 * @param {string} displayText - The text to display (e.g., "040-8422594")
 * @param {string} location - Where this link appears (e.g., "contact_page", "faq_page")
 * @param {string} className - Optional CSS classes
 * @param {React.ReactNode} children - Optional children to render instead of displayText
 */
const PhoneLink = ({
  phoneNumber = '+31408422594',
  displayText = '+31 (0) 40 842 2594',
  location = 'page',
  className = '',
  children
}) => {
  const handleClick = () => {
    const variant = getUserVariant();
    trackPhoneClick(variant, location);
  };

  return (
    <a
      href={`tel:${phoneNumber}`}
      onClick={handleClick}
      className={className}
    >
      {children || displayText}
    </a>
  );
};

export default PhoneLink;
