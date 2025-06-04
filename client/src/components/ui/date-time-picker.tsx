'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { CalendarIcon } from 'lucide-react';

export interface DateTimePickerProps {
  /**
   * The selected date and time value
   */
  value?: Date;
  /**
   * Callback function called when the date/time changes
   */
  onValueChange?: (date: Date | undefined) => void;
  /**
   * Placeholder text when no date is selected
   */
  placeholder?: string;
  /**
   * Date format string for display
   */
  format?: string;
  /**
   * Whether the picker is disabled
   */
  disabled?: boolean;
  /**
   * Additional CSS classes for the trigger button
   */
  className?: string;
  /**
   * Time selection granularity in minutes (5, 10, 15, 30)
   */
  minuteStep?: 5 | 10 | 15 | 30;
  /**
   * Whether to use 12-hour or 24-hour format
   */
  use24Hour?: boolean;
  /**
   * Minimum selectable date
   */
  minDate?: Date;
  /**
   * Maximum selectable date
   */
  maxDate?: Date;
  /**
   * Whether to show seconds
   */
  showSeconds?: boolean;
}

export const DateTimePicker = React.forwardRef<
  HTMLButtonElement,
  DateTimePickerProps
>(
  (
    {
      value,
      onValueChange,
      placeholder = 'Pick a date and time',
      format: formatStr = 'MM/dd/yyyy hh:mm aa',
      disabled = false,
      className,
      minuteStep = 5,
      use24Hour = false,
      minDate,
      maxDate,
      showSeconds = false,
      ...props
    },
    ref,
  ) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
      value,
    );

    // Sync internal state with external value
    React.useEffect(() => {
      setSelectedDate(value);
    }, [value]);

    const hours = React.useMemo(() => {
      if (use24Hour) {
        return Array.from({ length: 24 }, (_, i) => i);
      }
      return Array.from({ length: 12 }, (_, i) => i + 1);
    }, [use24Hour]);

    const minutes = React.useMemo(() => {
      return Array.from({ length: 60 / minuteStep }, (_, i) => i * minuteStep);
    }, [minuteStep]);

    const seconds = React.useMemo(() => {
      return Array.from({ length: 60 }, (_, i) => i);
    }, []);

    const handleDateSelect = (date: Date | undefined) => {
      if (!date) return;

      let newDate: Date;
      if (selectedDate) {
        // Preserve time when changing date
        newDate = new Date(date);
        newDate.setHours(selectedDate.getHours());
        newDate.setMinutes(selectedDate.getMinutes());
        newDate.setSeconds(selectedDate.getSeconds());
      } else {
        // Set default time to current time
        newDate = new Date(date);
        const now = new Date();
        newDate.setHours(now.getHours());
        newDate.setMinutes(
          Math.floor(now.getMinutes() / minuteStep) * minuteStep,
        );
        newDate.setSeconds(showSeconds ? now.getSeconds() : 0);
      }

      setSelectedDate(newDate);
      onValueChange?.(newDate);
    };

    const handleTimeChange = (
      type: 'hour' | 'minute' | 'second' | 'ampm',
      value: string | number,
    ) => {
      if (!selectedDate) return;

      const newDate = new Date(selectedDate);

      switch (type) {
        case 'hour':
          if (use24Hour) {
            newDate.setHours(Number(value));
          } else {
            const hour = Number(value);
            const currentHours = newDate.getHours();
            const isPM = currentHours >= 12;
            newDate.setHours(
              isPM ? (hour === 12 ? 12 : hour + 12) : hour === 12 ? 0 : hour,
            );
          }
          break;
        case 'minute':
          newDate.setMinutes(Number(value));
          break;
        case 'second':
          newDate.setSeconds(Number(value));
          break;
        case 'ampm':
          const currentHours = newDate.getHours();
          if (value === 'PM' && currentHours < 12) {
            newDate.setHours(currentHours + 12);
          } else if (value === 'AM' && currentHours >= 12) {
            newDate.setHours(currentHours - 12);
          }
          break;
      }

      setSelectedDate(newDate);
      onValueChange?.(newDate);
    };

    const formatDisplayValue = () => {
      if (!selectedDate) return placeholder;

      try {
        return format(selectedDate, formatStr);
      } catch {
        return format(selectedDate, 'MM/dd/yyyy hh:mm aa');
      }
    };

    const getDisplayHour = (hour: number) => {
      if (use24Hour) {
        return hour.toString().padStart(2, '0');
      }
      return hour.toString();
    };

    const isHourSelected = (hour: number) => {
      if (!selectedDate) return false;
      if (use24Hour) {
        return selectedDate.getHours() === hour;
      }
      const selectedHour = selectedDate.getHours();
      const display12Hour =
        selectedHour === 0
          ? 12
          : selectedHour > 12
            ? selectedHour - 12
            : selectedHour;
      return display12Hour === hour;
    };

    return (
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            variant="outline"
            className={cn(
              'w-full justify-start text-left font-normal',
              !selectedDate && 'text-muted-foreground',
              className,
            )}
            disabled={disabled}
            {...props}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {formatDisplayValue()}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="flex">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              disabled={(date) => {
                if (minDate && date < minDate) return true;
                if (maxDate && date > maxDate) return true;
                return false;
              }}
              initialFocus
            />
            <div className="flex flex-col divide-y border-l">
              {/* Hours */}
              <ScrollArea className="h-[200px]">
                <div className="flex flex-col p-2 min-w-[60px]">
                  <div className="text-center text-sm font-medium p-2">
                    Hour
                  </div>
                  {hours.map((hour) => (
                    <Button
                      key={hour}
                      size="sm"
                      variant={isHourSelected(hour) ? 'default' : 'ghost'}
                      className="h-8 font-mono"
                      onClick={() => handleTimeChange('hour', hour)}
                    >
                      {getDisplayHour(hour)}
                    </Button>
                  ))}
                </div>
              </ScrollArea>

              {/* Minutes */}
              <ScrollArea className="h-[200px]">
                <div className="flex flex-col p-2 min-w-[60px]">
                  <div className="text-center text-sm font-medium p-2">Min</div>
                  {minutes.map((minute) => (
                    <Button
                      key={minute}
                      size="sm"
                      variant={
                        selectedDate && selectedDate.getMinutes() === minute
                          ? 'default'
                          : 'ghost'
                      }
                      className="h-8 font-mono"
                      onClick={() => handleTimeChange('minute', minute)}
                    >
                      {minute.toString().padStart(2, '0')}
                    </Button>
                  ))}
                </div>
              </ScrollArea>

              {/* Seconds */}
              {showSeconds && (
                <ScrollArea className="h-[200px]">
                  <div className="flex flex-col p-2 min-w-[60px]">
                    <div className="text-center text-sm font-medium p-2">
                      Sec
                    </div>
                    {seconds.map((second) => (
                      <Button
                        key={second}
                        size="sm"
                        variant={
                          selectedDate && selectedDate.getSeconds() === second
                            ? 'default'
                            : 'ghost'
                        }
                        className="h-8 font-mono"
                        onClick={() => handleTimeChange('second', second)}
                      >
                        {second.toString().padStart(2, '0')}
                      </Button>
                    ))}
                  </div>
                </ScrollArea>
              )}

              {/* AM/PM */}
              {!use24Hour && (
                <div className="flex flex-col p-2 min-w-[60px]">
                  <div className="text-center text-sm font-medium p-2">
                    Period
                  </div>
                  {['AM', 'PM'].map((period) => (
                    <Button
                      key={period}
                      size="sm"
                      variant={
                        selectedDate &&
                        ((period === 'AM' && selectedDate.getHours() < 12) ||
                          (period === 'PM' && selectedDate.getHours() >= 12))
                          ? 'default'
                          : 'ghost'
                      }
                      className="h-8"
                      onClick={() => handleTimeChange('ampm', period)}
                    >
                      {period}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    );
  },
);

DateTimePicker.displayName = 'DateTimePicker';

// Usage examples:
export const DateTimePickerDemo = () => {
  const [date, setDate] = React.useState<Date>();
  const [date24, setDate24] = React.useState<Date>();

  return (
    <div className="space-y-4 p-4">
      <div>
        <label className="text-sm font-medium">12-hour format:</label>
        <DateTimePicker
          value={date}
          onValueChange={setDate}
          placeholder="Select date and time"
        />
      </div>

      <div>
        <label className="text-sm font-medium">24-hour format:</label>
        <DateTimePicker
          value={date24}
          onValueChange={setDate24}
          placeholder="Select date and time"
          use24Hour
          format="MM/dd/yyyy HH:mm"
          minuteStep={15}
        />
      </div>
    </div>
  );
};
