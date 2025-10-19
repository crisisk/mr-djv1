// DatePicker.tsx
import React, { useState, useCallback, useMemo } from 'react';
import { DatePickerProps, CalendarDay } from './types';

export const DatePicker: React.FC<DatePickerProps> = ({
  selectedDate,
  blockedDates,
  onChange,
  minDate,
  maxDate,
  className = '',
}) => {
  // State for current month/year being displayed
  const [currentDate, setCurrentDate] = useState(selectedDate || new Date());

  // Convert blocked dates to timestamp for easier comparison
  const blockedTimestamps = useMemo(
    () => blockedDates.map((date) => date.setHours(0, 0, 0, 0)),
    [blockedDates]
  );

  // Generate calendar days for current month
  const getDaysInMonth = useCallback((): CalendarDay[] => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days: CalendarDay[] = [];

    // Add previous month's days
    for (let i = firstDay.getDay(); i > 0; i--) {
      const date = new Date(year, month, 1 - i);
      days.push({
        date,
        isCurrentMonth: false,
        isBlocked: isDateBlocked(date),
        isSelected: isDateSelected(date),
        isToday: isToday(date),
      });
    }

    // Add current month's days
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const date = new Date(year, month, i);
      days.push({
        date,
        isCurrentMonth: true,
        isBlocked: isDateBlocked(date),
        isSelected: isDateSelected(date),
        isToday: isToday(date),
      });
    }

    // Add next month's days to complete the calendar
    const remainingDays = 42 - days.length; // 6 rows * 7 days
    for (let i = 1; i <= remainingDays; i++) {
      const date = new Date(year, month + 1, i);
      days.push({
        date,
        isCurrentMonth: false,
        isBlocked: isDateBlocked(date),
        isSelected: isDateSelected(date),
        isToday: isToday(date),
      });
    }

    return days;
  }, [currentDate, blockedTimestamps, selectedDate]);

  // Helper functions
  const isDateBlocked = (date: Date): boolean => {
    const timestamp = date.setHours(0, 0, 0, 0);
    return (
      blockedTimestamps.includes(timestamp) ||
      (minDate && date < minDate) ||
      (maxDate && date > maxDate)
    );
  };

  const isDateSelected = (date: Date): boolean => {
    return selectedDate?.setHours(0, 0, 0, 0) === date.setHours(0, 0, 0, 0);
  };

  const isToday = (date: Date): boolean => {
    const today = new Date();
    return (
      date.setHours(0, 0, 0, 0) === today.setHours(0, 0, 0, 0)
    );
  };

  // Navigation handlers
  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  // Date selection handler
  const handleDateClick = (day: CalendarDay) => {
    if (!day.isBlocked) {
      onChange(day.date);
    }
  };

  const days = getDaysInMonth();
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className={`date-picker ${className}`}>
      <div className="date-picker-header">
        <button onClick={handlePrevMonth}>&lt;</button>
        <span>
          {currentDate.toLocaleString('default', {
            month: 'long',
            year: 'numeric',
          })}
        </span>
        <button onClick={handleNextMonth}>&gt;</button>
      </div>
      
      <div className="date-picker-weekdays">
        {weekDays.map((day) => (
          <div key={day} className="weekday">
            {day}
          </div>
        ))}
      </div>

      <div className="date-picker-days">
        {days.map((day, index) => (
          <div
            key={index}
            className={`
              day
              ${day.isCurrentMonth ? 'current-month' : 'other-month'}
              ${day.isBlocked ? 'blocked' : ''}
              ${day.isSelected ? 'selected' : ''}
              ${day.isToday ? 'today' : ''}
            `}
            onClick={() => handleDateClick(day)}
          >
            {day.date.getDate()}
          </div>
        ))}
      </div>
    </div>
  );
};
