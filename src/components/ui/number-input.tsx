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
    const [localValue, setLocalValue] = React.useState<string>('')
    const [isFocused, setIsFocused] = React.useState<boolean>(false)
    const inputRef = React.useRef<HTMLInputElement>(null)

    // Sync localValue với prop value (chỉ khi không đang focus)
    React.useEffect(() => {
      if (!isFocused) {
        if (value === undefined || value === null || value === '') {
          setLocalValue('')
        } else {
          const numValue = typeof value === 'string' ? parseNumber(value) : value
          setLocalValue(formatNumber(numValue))
        }
      }
    }, [value, isFocused])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let inputValue = e.target.value

      // 1. Chỉ cho phép số và dấu chấm thập phân (nếu allowDecimals)
      if (allowDecimals) {
        inputValue = inputValue.replace(/[^0-9.]/g, '')
        // Chỉ cho phép một dấu chấm thập phân
        const parts = inputValue.split('.')
        if (parts.length > 2) {
          inputValue = parts[0] + '.' + parts.slice(1).join('')
        }
      } else {
        inputValue = inputValue.replace(/[^0-9]/g, '')
      }

      // 2. Cập nhật localValue ngay lập tức (không format dấu chấm hàng nghìn để tránh nhảy cursor)
      setLocalValue(inputValue)

      // 3. Parse và trả về giá trị số cho parent qua onChange
      if (inputValue === '' || inputValue === '.') {
        // Không gọi onChange khi empty để tránh validation error
        // Form sẽ validate khi submit
        return
      }

      const numValue = allowDecimals ? parseFloat(inputValue) : parseNumber(inputValue)
      
      if (!isNaN(numValue)) {
        // Validate min/max (chỉ cảnh báo, không force value khi đang gõ)
        if (min !== undefined && numValue < min) {
          // Không block input, chỉ validate khi submit
        }
        if (max !== undefined && numValue > max) {
          // Không block input, chỉ validate khi submit
        }
        onChange?.(numValue)
      }
    }

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true)
      // Khi focus, hiển thị raw value (không có dấu phân cách hàng nghìn) để dễ chỉnh sửa
      if (localValue) {
        const rawValue = localValue.replace(/\./g, '')
        setLocalValue(rawValue)
      }
      props.onFocus?.(e)
    }

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false)
      
      // 4. Chỉ format đẹp (1.000.000) khi người dùng đã rời khỏi ô input
      if (localValue && localValue !== '' && localValue !== '.') {
        const numValue = allowDecimals 
          ? parseFloat(localValue.replace(/\./g, '')) 
          : parseNumber(localValue.replace(/\./g, ''))
        
        if (!isNaN(numValue)) {
          // Validate min/max khi blur
          let finalValue = numValue
          if (min !== undefined && numValue < min) {
            finalValue = min
            onChange?.(min)
          } else if (max !== undefined && numValue > max) {
            finalValue = max
            onChange?.(max)
          } else {
            // Gọi onChange với giá trị hợp lệ để đảm bảo form state được update
            onChange?.(finalValue)
          }
          setLocalValue(formatNumber(finalValue))
        } else {
          setLocalValue('')
          // Không gọi onChange khi invalid để form có thể validate
        }
      } else {
        setLocalValue('')
        // Không gọi onChange khi empty để form có thể validate
      }
      
      onBlur?.(e)
    }

    return (
      <Input
        {...props}
        ref={ref || inputRef}
        type="text"
        inputMode="numeric"
        value={localValue}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={cn(className)}
      />
    )
  }
)
NumberInput.displayName = 'NumberInput'

export { NumberInput }
