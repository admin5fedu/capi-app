import * as React from 'react'
import { Input, InputProps } from './input'
import { cn } from '@/lib/utils'
import { formatNumber, parseNumber } from '@/lib/input-utils'

export interface NumberInputProps extends Omit<InputProps, 'type' | 'value' | 'onChange'> {
  value?: number | string
  onChange?: (value: number) => void
  allowDecimals?: boolean
  min?: number
  max?: number
}

const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
  ({ className, value, onChange, allowDecimals = false, min, max, onBlur, ...props }, ref) => {
    const [displayValue, setDisplayValue] = React.useState<string>('')
    const inputRef = React.useRef<HTMLInputElement>(null)

    // Sync display value với prop value
    React.useEffect(() => {
      if (value === undefined || value === null || value === '') {
        setDisplayValue('')
      } else {
        const numValue = typeof value === 'string' ? parseNumber(value) : value
        setDisplayValue(formatNumber(numValue))
      }
    }, [value])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let inputValue = e.target.value

      // Xóa tất cả ký tự không phải số và dấu chấm
      if (allowDecimals) {
        inputValue = inputValue.replace(/[^\d.]/g, '')
        // Chỉ cho phép một dấu chấm thập phân
        const parts = inputValue.split('.')
        if (parts.length > 2) {
          inputValue = parts[0] + '.' + parts.slice(1).join('')
        }
      } else {
        inputValue = inputValue.replace(/[^\d]/g, '')
      }

      // Parse và validate
      const numValue = allowDecimals ? parseFloat(inputValue) : parseNumber(inputValue)
      
      if (!isNaN(numValue)) {
        // Validate min/max
        let finalValue = numValue
        if (min !== undefined && numValue < min) finalValue = min
        if (max !== undefined && numValue > max) finalValue = max

        // Format để hiển thị
        setDisplayValue(formatNumber(finalValue))
        
        // Call onChange với giá trị số
        onChange?.(finalValue)
      } else if (inputValue === '') {
        setDisplayValue('')
        onChange?.(0)
      }
    }

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      // Format lại khi blur
      if (displayValue) {
        const numValue = allowDecimals 
          ? parseFloat(displayValue.replace(/\./g, '')) 
          : parseNumber(displayValue)
        if (!isNaN(numValue)) {
          setDisplayValue(formatNumber(numValue))
        }
      }
      onBlur?.(e)
    }

    return (
      <Input
        {...props}
        ref={ref || inputRef}
        type="text"
        inputMode="numeric"
        value={displayValue}
        onChange={handleChange}
        onBlur={handleBlur}
        className={cn(className)}
      />
    )
  }
)
NumberInput.displayName = 'NumberInput'

export { NumberInput }

