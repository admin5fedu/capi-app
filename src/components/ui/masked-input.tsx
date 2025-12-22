import * as React from 'react'
import { Input, InputProps } from './input'
import { cn } from '@/lib/utils'
import { applyMask, removeMask } from '@/lib/input-utils'

export interface MaskedInputProps extends Omit<InputProps, 'type' | 'value' | 'onChange'> {
  mask: string // Pattern với # là số, * là chữ, ví dụ: "###-###-####"
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
}

const MaskedInput = React.forwardRef<HTMLInputElement, MaskedInputProps>(
  ({ className, mask, value = '', onChange, placeholder, onBlur, ...props }, ref) => {
    const [displayValue, setDisplayValue] = React.useState<string>('')

    React.useEffect(() => {
      if (value) {
        const masked = applyMask(value, mask)
        setDisplayValue(masked)
      } else {
        setDisplayValue('')
      }
    }, [value, mask])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let inputValue = e.target.value

      // Xóa mask cũ
      const unmasked = removeMask(inputValue)
      
      // Apply mask mới
      const masked = applyMask(unmasked, mask)
      
      setDisplayValue(masked)
      
      // Return unmasked value for onChange
      onChange?.(unmasked)
    }

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      // Ensure mask is applied on blur
      if (displayValue) {
        const unmasked = removeMask(displayValue)
        const masked = applyMask(unmasked, mask)
        setDisplayValue(masked)
      }
      onBlur?.(e)
    }

    // Generate placeholder from mask
    const maskPlaceholder = React.useMemo(() => {
      if (placeholder) return placeholder
      return mask.replace(/#/g, '0').replace(/\*/g, 'A')
    }, [mask, placeholder])

    return (
      <Input
        {...props}
        ref={ref}
        type="text"
        value={displayValue}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={maskPlaceholder}
        className={cn(className)}
      />
    )
  }
)
MaskedInput.displayName = 'MaskedInput'

export { MaskedInput }

