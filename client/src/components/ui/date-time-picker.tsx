'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { TimePicker } from './time-picker';

interface DateTimePickerProps {
  value?: string;
  onChange?: (value: string | undefined) => void;
  disabled?: boolean;
  placeholder?: string;
  showSeconds?: boolean;
  className?: string;
  buttonClassName?: string;
  popoverClassName?: string;
  format?: string;
  disablePastDates?: boolean;
  disableFutureDates?: boolean;
  minDate?: Date;
  maxDate?: Date;
}

const DateTimePicker = React.forwardRef<HTMLButtonElement, DateTimePickerProps>(
  (
    {
      value,
      onChange,
      disabled = false,
      placeholder = 'Pick a date and time',
      showSeconds = true,
      className,
      buttonClassName,
      popoverClassName,
      format: dateFormat = showSeconds ? 'PPP HH:mm:ss' : 'PPP HH:mm',
      disablePastDates = false,
      disableFutureDates = false,
      minDate,
      maxDate,
    },
    ref,
  ) => {
    const [open, setOpen] = React.useState(false);

    // Convert ISO string to Date object
    const selectedDate = React.useMemo(() => {
      if (!value) return undefined;
      try {
        const date = new Date(value);
        return isNaN(date.getTime()) ? undefined : date;
      } catch {
        return undefined;
      }
    }, [value]);

    // Handle date selection from calendar
    const handleDateSelect = (newDate: Date | undefined) => {
      if (!newDate) {
        onChange?.(undefined);
        return;
      }

      // If we have an existing date, preserve the time
      if (selectedDate) {
        const updatedDate = new Date(newDate);
        updatedDate.setHours(
          selectedDate.getHours(),
          selectedDate.getMinutes(),
          selectedDate.getSeconds(),
          selectedDate.getMilliseconds(),
        );
        onChange?.(updatedDate.toISOString());
      } else {
        // New date, set time to current time or 00:00:00
        const now = new Date();
        newDate.setHours(now.getHours(), now.getMinutes(), now.getSeconds(), 0);
        onChange?.(newDate.toISOString());
      }
    };

    // Handle time change
    const handleTimeChange = (timeISO: string | undefined) => {
      if (!timeISO) {
        onChange?.(undefined);
        return;
      }

      // If we have a selected date, combine it with the new time
      if (selectedDate) {
        const timeDate = new Date(timeISO);
        const combinedDate = new Date(selectedDate);
        combinedDate.setHours(
          timeDate.getHours(),
          timeDate.getMinutes(),
          timeDate.getSeconds(),
          timeDate.getMilliseconds(),
        );
        onChange?.(combinedDate.toISOString());
      } else {
        // No date selected, use today's date with the selected time
        const timeDate = new Date(timeISO);
        const today = new Date();
        today.setHours(
          timeDate.getHours(),
          timeDate.getMinutes(),
          timeDate.getSeconds(),
          timeDate.getMilliseconds(),
        );
        onChange?.(today.toISOString());
      }
    };

    // Date validation
    const isDateDisabled = React.useCallback(
      (date: Date) => {
        if (
          disablePastDates &&
          date < new Date(new Date().setHours(0, 0, 0, 0))
        ) {
          return true;
        }
        if (
          disableFutureDates &&
          date > new Date(new Date().setHours(23, 59, 59, 999))
        ) {
          return true;
        }
        if (minDate && date < minDate) {
          return true;
        }
        if (maxDate && date > maxDate) {
          return true;
        }
        return false;
      },
      [disablePastDates, disableFutureDates, minDate, maxDate],
    );

    return (
      <div className={cn('grid gap-2', className)}>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              ref={ref}
              variant="outline"
              className={cn(
                'w-[280px] justify-start text-left font-normal',
                !selectedDate && 'text-muted-foreground',
                buttonClassName,
              )}
              disabled={disabled}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selectedDate ? (
                format(selectedDate, dateFormat)
              ) : (
                <span>{placeholder}</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className={cn('w-auto p-0', popoverClassName)}
            align="start"
          >
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              disabled={isDateDisabled}
              initialFocus
            />
            <div className="p-3 border-t border-border">
              <TimePicker
                time={value}
                setTime={handleTimeChange}
                showSeconds={showSeconds}
                disabled={disabled}
              />
            </div>
          </PopoverContent>
        </Popover>
      </div>
    );
  },
);

DateTimePicker.displayName = 'DateTimePicker';

// Utility functions for working with ISO strings
export const getCurrentDateTimeISO = (): string => {
  return new Date().toISOString();
};

export const parseDateTimeFromISO = (
  isoString: string,
): {
  date: Date;
  hours: number;
  minutes: number;
  seconds: number;
} | null => {
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return null;

    return {
      date,
      hours: date.getHours(),
      minutes: date.getMinutes(),
      seconds: date.getSeconds(),
    };
  } catch {
    return null;
  }
};

export const createDateTimeISO = (
  year: number,
  month: number,
  day: number,
  hours: number = 0,
  minutes: number = 0,
  seconds: number = 0,
): string => {
  const date = new Date(year, month - 1, day, hours, minutes, seconds);
  return date.toISOString();
};

export const formatDateTimeISO = (
  isoString: string,
  formatStr: string = 'PPP HH:mm:ss',
): string => {
  try {
    const date = new Date(isoString);
    return format(date, formatStr);
  } catch {
    return '';
  }
};

export { DateTimePicker };
