import * as React from 'react'
import { Input, InputProps } from './input'
import { cn } from '@/lib/utils'

export interface EmailInputProps extends Omit<InputProps, 'type' | 'onChange'> {
  value?: string
  onChange?: (value: string) => void
  validateOnBlur?: boolean
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const EmailInput = React.forwardRef<HTMLInputElement, EmailInputProps>(
  ({ className, value = '', onChange, validateOnBlur = true, onBlur, ...props }, ref) => {
    const [isValid, setIsValid] = React.useState<boolean>(true)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value
      onChange?.(inputValue)
      
      // Clear validation error khi đang nhập
      if (!isValid) {
        setIsValid(true)
      }
    }

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      if (validateOnBlur && value) {
        const valid = EMAIL_REGEX.test(value)
        setIsValid(valid)
      }
      onBlur?.(e)
    }

    return (
      <div className="relative">
        <Input
          {...props}
          ref={ref}
          type="email"
          inputMode="email"
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          className={cn(
            className,
            !isValid && 'border-destructive focus-visible:ring-destructive'
          )}
        />
        {!isValid && (
          <p className="text-xs text-destructive mt-1">
            Email không hợp lệ. Ví dụ: example@domain.com
          </p>
        )}
      </div>
    )
  }
)
EmailInput.displayName = 'EmailInput'

export { EmailInput }

