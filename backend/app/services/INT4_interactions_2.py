// App.tsx
import React, { useState } from 'react';
import { DatePicker } from './DatePicker';

const App: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  
  // Example blocked dates (next 3 days)
  const blockedDates = [
    new Date(),
    new Date(Date.now() + 24 * 60 * 60 * 1000),
    new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
  ];

  return (
    <div>
      <h1>DJ Booking Calendar</h1>
      <DatePicker
        selectedDate={selectedDate}
        blockedDates={blockedDates}
        onChange={setSelectedDate}
        minDate={new Date()} // Can't select dates in the past
        maxDate={new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)} // Can't select dates more than 90 days in the future
      />
      
      {selectedDate && (
        <p>Selected date: {selectedDate.toLocaleDateString()}</p>
      )}
    </div>
  );
};

export default App;
