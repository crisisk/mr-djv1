// App.tsx
import React from 'react';
import { BookingWizard } from './BookingWizard';

const App: React.FC = () => {
  return (
    <div className="app">
      <h1>Book a DJ</h1>
      <BookingWizard />
    </div>
  );
};

export default App;
