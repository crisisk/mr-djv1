// EventTypeContext.js
import React, { createContext, useState, useContext } from 'react';

const EventTypeContext = createContext();

export const EventTypeProvider = ({ children }) => {
  const [eventType, setEventType] = useState(null); // null, 'wedding', or 'corporate'
  
  return (
    <EventTypeContext.Provider value={{ eventType, setEventType }}>
      {children}
    </EventTypeContext.Provider>
  );
};

export const useEventType = () => {
  const context = useContext(EventTypeContext);
  if (!context) {
    throw new Error('useEventType must be used within an EventTypeProvider');
  }
  return context;
};