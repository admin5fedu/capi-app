import * as React from 'react'
import { Input, InputProps } from './input'
import { cn } from '@/lib/utils'
import { formatPhone, validateVietnamesePhone } from '@/lib/input-utils'

export interface PhoneInputProps extends Omit<InputProps, 'type' | 'onChange'> {
  value?: string
  onChange?: (value: string) => void
  validateOnBlur?: boolean
}

const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ className, value = '', onChange, validateOnBlur = true, onBlur, ...props }, ref) => {
    const [displayValue, setDisplayValue] = React.useState<string>(value)
    const [isValid, setIsValid] = React.useState<boolean>(true)

    React.useEffect(() => {
      setDisplayValue(value)
    }, [value])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let inputValue = e.target.value

      // Chỉ cho phép số và khoảng trắng
      inputValue = inputValue.replace(/[^\d\s]/g, '')

      setDisplayValue(inputValue)
      onChange?.(inputValue)
      
      // Clear validation error khi đang nhập
      if (!isValid) {
        setIsValid(true)
      }
    }

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      if (validateOnBlur && displayValue) {
        const valid = validateVietnamesePhone(displayValue)
        setIsValid(valid)
        if (valid) {
          // Format khi blur nếu hợp lệ
          const formatted = formatPhone(displayValue)
          setDisplayValue(formatted)
          onChange?.(formatted)
        }
      }
      onBlur?.(e)
    }

    return (
      <div className="relative">
        <Input
          {...props}
          ref={ref}
          type="tel"
          inputMode="tel"
          value={displayValue}
          onChange={handleChange}
          onBlur={handleBlur}
          className={cn(
            className,
            !isValid && 'border-destructive focus-visible:ring-destructive'
          )}
        />
        {!isValid && (
          <p className="text-xs text-destructive mt-1">
            Số điện thoại không hợp lệ. Ví dụ: 0912345678
          </p>
        )}
      </div>
    )
  }
)
PhoneInput.displayName = 'PhoneInput'

export { PhoneInput }

