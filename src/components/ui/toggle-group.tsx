// import * as React from 'react' // Unused
import { cn } from '@/lib/utils'

export interface ToggleGroupProps {
  value: string
  onValueChange: (value: string) => void
  options: { value: string; label: string }[]
  className?: string
  disabled?: boolean
}

export function ToggleGroup({ value, onValueChange, options, className, disabled }: ToggleGroupProps) {
  return (
    <div className={cn('inline-flex rounded-md border border-input bg-background p-1', className)}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => !disabled && onValueChange(option.value)}
          disabled={disabled}
          className={cn(
            'inline-flex items-center justify-center rounded-sm px-3 py-1.5 text-sm font-medium transition-all',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            'disabled:pointer-events-none disabled:opacity-50',
            value === option.value
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground'
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}

