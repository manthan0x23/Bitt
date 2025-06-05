'use client';

import * as React from 'react';
import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';

// Time Picker Input Component
interface TimePickerInputProps {
  picker: 'hours' | 'minutes' | 'seconds';
  time?: string;
  setTime?: (time: string | undefined) => void;
  disabled?: boolean;
  onLeftFocus?: () => void;
  onRightFocus?: () => void;
  className?: string;
}

const TimePickerInput = React.forwardRef<
  HTMLInputElement,
  TimePickerInputProps
>(
  (
    { picker, time, setTime, disabled, onLeftFocus, onRightFocus, className },
    ref,
  ) => {
    const [flag, setFlag] = React.useState(false);
    const [prevIntKey, setPrevIntKey] = React.useState<string>('0');

    const timeValue = React.useMemo(() => {
      if (!time) return '00';

      try {
        const date = new Date(time);
        if (isNaN(date.getTime())) return '00';

        switch (picker) {
          case 'hours':
            return date.getHours().toString().padStart(2, '0');
          case 'minutes':
            return date.getMinutes().toString().padStart(2, '0');
          case 'seconds':
            return date.getSeconds().toString().padStart(2, '0');
          default:
            return '00';
        }
      } catch {
        return '00';
      }
    }, [time, picker]);

    const calculateNewTime = React.useCallback(
      (value: string) => {
        if (!time && !value) return undefined;

        const currentDate = time ? new Date(time) : new Date();

        // If invalid date, create new one with current time
        if (isNaN(currentDate.getTime())) {
          const now = new Date();
          currentDate.setTime(now.getTime());
        }

        const numericValue = parseInt(value) || 0;

        switch (picker) {
          case 'hours':
            currentDate.setHours(Math.min(23, Math.max(0, numericValue)));
            break;
          case 'minutes':
            currentDate.setMinutes(Math.min(59, Math.max(0, numericValue)));
            break;
          case 'seconds':
            currentDate.setSeconds(Math.min(59, Math.max(0, numericValue)));
            break;
        }

        return currentDate.toISOString();
      },
      [time, picker],
    );

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Tab') return;
      e.preventDefault();

      if (e.key === 'ArrowRight') onRightFocus?.();
      if (e.key === 'ArrowLeft') onLeftFocus?.();

      if (['ArrowUp', 'ArrowDown'].includes(e.key)) {
        const step = e.key === 'ArrowUp' ? 1 : -1;
        const currentValue = parseInt(timeValue) || 0;
        const maxValue = picker === 'hours' ? 23 : 59;
        const newValue = Math.min(maxValue, Math.max(0, currentValue + step));
        const newTime = calculateNewTime(newValue.toString().padStart(2, '0'));
        setTime?.(newTime);
        return;
      }

      if (e.key >= '0' && e.key <= '9') {
        const newValue = flag ? prevIntKey + e.key : e.key;
        const maxValue = picker === 'hours' ? 23 : 59;

        if (parseInt(newValue) > maxValue) {
          const newTime = calculateNewTime(e.key.padStart(2, '0'));
          setTime?.(newTime);
          setPrevIntKey(e.key);
        } else {
          const newTime = calculateNewTime(newValue.padStart(2, '0'));
          setTime?.(newTime);
          setPrevIntKey(newValue);
        }

        setFlag(!flag);
      }
    };

    return (
      <input
        ref={ref}
        className={cn(
          'flex h-10 w-[48px] rounded-md border border-input bg-background px-3 py-2 text-sm text-center ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        value={timeValue}
        onChange={() => {}} // Controlled by keydown
        onKeyDown={handleKeyDown}
        disabled={disabled}
        inputMode="numeric"
      />
    );
  },
);

TimePickerInput.displayName = 'TimePickerInput';

// Main Time Picker Component
interface TimePickerProps {
  time?: string;
  setTime?: (time: string | undefined) => void;
  disabled?: boolean;
  showSeconds?: boolean;
  placeholder?: string;
  className?: string;
}

const TimePicker = React.forwardRef<HTMLDivElement, TimePickerProps>(
  ({ time, setTime, disabled = false, showSeconds = true, className }, ref) => {
    const minuteRef = React.useRef<HTMLInputElement>(null);
    const hourRef = React.useRef<HTMLInputElement>(null);
    const secondRef = React.useRef<HTMLInputElement>(null);

    return (
      <div ref={ref} className={cn('flex items-end gap-2', className)}>
        <div className="grid gap-1 text-center">
          <Label htmlFor="hours" className="text-xs">
            Hours
          </Label>
          <TimePickerInput
            picker="hours"
            time={time}
            setTime={setTime}
            ref={hourRef}
            onRightFocus={() => minuteRef.current?.focus()}
            disabled={disabled}
          />
        </div>
        <div className="grid gap-1 text-center">
          <Label htmlFor="minutes" className="text-xs">
            Minutes
          </Label>
          <TimePickerInput
            picker="minutes"
            time={time}
            setTime={setTime}
            ref={minuteRef}
            onLeftFocus={() => hourRef.current?.focus()}
            onRightFocus={() =>
              showSeconds ? secondRef.current?.focus() : undefined
            }
            disabled={disabled}
          />
        </div>
        {showSeconds && (
          <div className="grid gap-1 text-center">
            <Label htmlFor="seconds" className="text-xs">
              Seconds
            </Label>
            <TimePickerInput
              picker="seconds"
              time={time}
              setTime={setTime}
              ref={secondRef}
              onLeftFocus={() => minuteRef.current?.focus()}
              disabled={disabled}
            />
          </div>
        )}
        <div className="flex h-10 items-center">
          <Clock className="ml-2 h-4 w-4" />
        </div>
      </div>
    );
  },
);

TimePicker.displayName = 'TimePicker';

// Utility function to get current time as ISO string
export const getCurrentTimeISO = (): string => {
  return new Date().toISOString();
};

// Utility function to parse time from ISO string
export const parseTimeFromISO = (
  isoString: string,
): { hours: number; minutes: number; seconds: number } | null => {
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return null;

    return {
      hours: date.getHours(),
      minutes: date.getMinutes(),
      seconds: date.getSeconds(),
    };
  } catch {
    return null;
  }
};

// Utility function to create ISO string from time components
export const createTimeISO = (
  hours: number,
  minutes: number,
  seconds: number = 0,
): string => {
  const date = new Date();
  date.setHours(hours, minutes, seconds, 0);
  return date.toISOString();
};

export { TimePicker, TimePickerInput };
