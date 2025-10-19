// types.ts
export interface DatePickerProps {
  selectedDate: Date | null;
  blockedDates: Date[];
  onChange: (date: Date) => void;
  minDate?: Date;
  maxDate?: Date;
  className?: string;
}

export interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isBlocked: boolean;
  isSelected: boolean;
  isToday: boolean;
}
