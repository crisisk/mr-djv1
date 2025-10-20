import React from 'react';
import useTPWWidget from '../../hooks/useTPWWidget.js';

const BookingWidget = ({ widgetType = 'booking', className = '' }) => {
  const { containerRef, containerId, isLoaded, error } = useTPWWidget(widgetType);

  if (error) {
    return (
      <div
        className={`rounded-xl border border-red-200 bg-red-50 p-6 text-red-700 shadow-sm ${className}`}
        role="alert"
      >
        <h3 className="mb-2 text-lg font-semibold">Widget niet beschikbaar</h3>
        <p className="text-sm">
          {error} Controleer de TPW API configuratie of neem direct contact met ons op via
          {' '}<a href="tel:+31408422594" className="font-semibold underline">+31 (0) 40 8422594</a>.
        </p>
      </div>
    );
  }

  return (
    <div className={className}>
      <div
        id={containerId}
        ref={containerRef}
        className="flex min-h-[480px] w-full items-center justify-center rounded-2xl bg-white shadow-lg"
        aria-busy={!isLoaded}
      >
        {!isLoaded && <span className="text-sm text-gray-500">Widget laden...</span>}
      </div>
    </div>
  );
};

export default BookingWidget;
