
import React, { useState, useEffect, forwardRef } from 'react';
import { cn } from '../../lib/utils';

export interface NumberInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  label?: string;
  error?: string;
  required?: boolean;
  value?: number | string | null;
  onChange?: (value: number | null) => void;
}

const formatNumber = (value: number | string | null | undefined): string => {
  if (value === null || value === undefined || value === '') return '';
  const num = Number(String(value).replace(/[^0-9]/g, ''));
  if (isNaN(num)) return '';
  return new Intl.NumberFormat('vi-VN').format(num);
};

const unformatNumber = (value: string): number | null => {
  if (value === '') return null;
  const num = parseInt(value.replace(/[^0-9]/g, ''), 10);
  return isNaN(num) ? null : num;
};

const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  ({ className, label, error, required, value, onChange, ...props }, ref) => {
    const [displayValue, setDisplayValue] = useState(formatNumber(value));

    useEffect(() => {
      setDisplayValue(formatNumber(value));
    }, [value]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const formatted = formatNumber(event.target.value);
      setDisplayValue(formatted);
      if (onChange) {
        onChange(unformatNumber(event.target.value));
      }
    };
    
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className="text-sm font-semibold text-slate-700 ml-0.5">
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </label>
        )}
        <input
          type="text"
          inputMode="decimal"
          className={cn(
            "flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50 transition-all",
            error && "border-destructive focus-visible:ring-destructive/20 focus-visible:border-destructive",
            className
          )}
          ref={ref}
          value={displayValue}
          onChange={handleChange}
          {...props}
        />
        {error && (
          <p className="text-[11px] font-medium text-destructive ml-0.5 animate-in fade-in slide-in-from-top-1">
            {error}
          </p>
        )}
      </div>
    );
  }
);
NumberInput.displayName = "NumberInput";

export default NumberInput;
