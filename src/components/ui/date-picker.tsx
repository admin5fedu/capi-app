import * as React from 'react'
import { Input, InputProps } from './input'
import { cn } from '@/lib/utils'
import { formatDateVN, parseDateVN, validateDateVN } from '@/lib/input-utils'
import { Calendar } from 'lucide-react'
import { Button } from './button'

export interface DatePickerProps extends Omit<InputProps, 'type' | 'value' | 'onChange'> {
  value?: Date | string | null
  onChange?: (value: Date | null) => void
  format?: string
  showCalendarButton?: boolean
}

const DatePicker = React.forwardRef<HTMLInputElement, DatePickerProps>(
  ({ className, value, onChange, format = 'DD/MM/YYYY', showCalendarButton = true, onBlur, ...props }, ref) => {
    const [displayValue, setDisplayValue] = React.useState<string>('')
    const [isValid, setIsValid] = React.useState<boolean>(true)
    const [showPicker, setShowPicker] = React.useState<boolean>(false)
    const inputRef = React.useRef<HTMLInputElement>(null)
    const containerRef = React.useRef<HTMLDivElement>(null)

    // Sync display value với prop value
    React.useEffect(() => {
      if (value === null || value === undefined || value === '') {
        setDisplayValue('')
      } else {
        const dateStr = formatDateVN(value)
        setDisplayValue(dateStr)
      }
    }, [value])

    // Close picker when clicking outside
    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
          setShowPicker(false)
        }
      }

      if (showPicker) {
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
      }
    }, [showPicker])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let inputValue = e.target.value

      // Chỉ cho phép số và dấu /
      inputValue = inputValue.replace(/[^\d/]/g, '')

      // Tự động thêm dấu /
      let formatted = inputValue
      if (inputValue.length >= 2 && inputValue[2] !== '/') {
        formatted = inputValue.slice(0, 2) + '/' + inputValue.slice(2)
      }
      if (formatted.length >= 5 && formatted[5] !== '/') {
        formatted = formatted.slice(0, 5) + '/' + formatted.slice(5)
      }
      // Giới hạn độ dài
      if (formatted.length > 10) {
        formatted = formatted.slice(0, 10)
      }

      setDisplayValue(formatted)
      
      // Validate và update
      if (formatted.length === 10) {
        const date = parseDateVN(formatted)
        if (date) {
          setIsValid(true)
          onChange?.(date)
        } else {
          setIsValid(false)
        }
      } else {
        setIsValid(true)
        onChange?.(null)
      }
    }

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      if (displayValue) {
        const valid = validateDateVN(displayValue)
        setIsValid(valid)
        if (!valid) {
          setDisplayValue('')
          onChange?.(null)
        }
      }
      onBlur?.(e)
    }

    const handleCalendarClick = () => {
      setShowPicker(!showPicker)
    }

    const handleDateSelect = (day: number, month: number, year: number) => {
      const date = new Date(year, month, day)
      setDisplayValue(formatDateVN(date))
      setIsValid(true)
      onChange?.(date)
      setShowPicker(false)
    }

    const getCurrentMonthYear = () => {
      const date = displayValue ? parseDateVN(displayValue) : new Date()
      const current = date || new Date()
      return { month: current.getMonth(), year: current.getFullYear() }
    }

    const renderCalendar = () => {
      const { month, year } = getCurrentMonthYear()
      const firstDay = new Date(year, month, 1)
      const lastDay = new Date(year, month + 1, 0)
      const daysInMonth = lastDay.getDate()
      const startingDayOfWeek = firstDay.getDay()

      const days = []
      const weekDays = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']

      // Header
      days.push(
        <div key="header" className="grid grid-cols-7 gap-1 mb-2">
          {weekDays.map((day) => (
            <div key={day} className="text-center text-xs font-medium text-muted-foreground py-1">
              {day}
            </div>
          ))}
        </div>
      )

      // Days
      const dayCells = []
      // Empty cells for days before month starts
      for (let i = 0; i < startingDayOfWeek; i++) {
        dayCells.push(<div key={`empty-${i}`} className="h-8" />)
      }

      // Days of month
      for (let day = 1; day <= daysInMonth; day++) {
        const isSelected = displayValue && parseDateVN(displayValue)?.getDate() === day && 
                          parseDateVN(displayValue)?.getMonth() === month &&
                          parseDateVN(displayValue)?.getFullYear() === year
        const isToday = new Date().getDate() === day && 
                       new Date().getMonth() === month && 
                       new Date().getFullYear() === year

        dayCells.push(
          <button
            key={day}
            type="button"
            onClick={() => handleDateSelect(day, month, year)}
            className={cn(
              'h-8 w-8 rounded-md text-sm transition-colors',
              'hover:bg-accent hover:text-accent-foreground',
              isSelected && 'bg-primary text-primary-foreground',
              isToday && !isSelected && 'bg-accent font-semibold'
            )}
          >
            {day}
          </button>
        )
      }

      days.push(
        <div key="days" className="grid grid-cols-7 gap-1">
          {dayCells}
        </div>
      )

      return days
    }

    return (
      <div ref={containerRef} className="relative">
        <div className="relative">
          <Input
            {...props}
            ref={ref || inputRef}
            type="text"
            inputMode="numeric"
            value={displayValue}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="DD/MM/YYYY"
            className={cn(
              className,
              !isValid && 'border-destructive focus-visible:ring-destructive',
              showCalendarButton && 'pr-10'
            )}
          />
          {showCalendarButton && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full w-10 rounded-l-none"
              onClick={handleCalendarClick}
            >
              <Calendar className="h-4 w-4" />
            </Button>
          )}
        </div>
        {showPicker && (
          <div className="absolute z-50 mt-1 bg-popover border rounded-md shadow-lg p-3 w-64">
            {renderCalendar()}
            <div className="flex justify-between items-center mt-2 pt-2 border-t">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  const today = new Date()
                  handleDateSelect(today.getDate(), today.getMonth(), today.getFullYear())
                }}
              >
                Hôm nay
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowPicker(false)}
              >
                Đóng
              </Button>
            </div>
          </div>
        )}
        {!isValid && displayValue && (
          <p className="text-xs text-destructive mt-1">
            Ngày không hợp lệ. Vui lòng nhập theo định dạng DD/MM/YYYY
          </p>
        )}
      </div>
    )
  }
)
DatePicker.displayName = 'DatePicker'

export { DatePicker }

