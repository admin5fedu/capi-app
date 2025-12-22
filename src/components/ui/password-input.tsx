import * as React from 'react'
import { Input, InputProps } from './input'
import { cn } from '@/lib/utils'
import { Eye, EyeOff } from 'lucide-react'
import { Button } from './button'

export interface PasswordInputProps extends Omit<InputProps, 'type'> {
  value?: string
  onChange?: (value: string) => void
  showStrengthIndicator?: boolean
}

interface PasswordStrength {
  score: number // 0-4
  label: string
  color: string
}

const calculatePasswordStrength = (password: string): PasswordStrength => {
  if (!password) {
    return { score: 0, label: '', color: '' }
  }

  let score = 0
  let checks = {
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  }

  if (checks.length) score++
  if (checks.lowercase) score++
  if (checks.uppercase) score++
  if (checks.number) score++
  if (checks.special) score++

  // Normalize to 0-4 scale
  const normalizedScore = Math.min(4, Math.floor(score / 1.25))

  const strengthLevels: PasswordStrength[] = [
    { score: 0, label: 'Rất yếu', color: 'bg-red-500' },
    { score: 1, label: 'Yếu', color: 'bg-orange-500' },
    { score: 2, label: 'Trung bình', color: 'bg-yellow-500' },
    { score: 3, label: 'Mạnh', color: 'bg-green-500' },
    { score: 4, label: 'Rất mạnh', color: 'bg-green-600' },
  ]

  return strengthLevels[normalizedScore] || strengthLevels[0]
}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, value = '', onChange, showStrengthIndicator = true, onBlur, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState<boolean>(false)
    const strength = React.useMemo(() => calculatePasswordStrength(value), [value])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e.target.value)
    }

    return (
      <div className="w-full">
        <div className="relative">
          <Input
            {...props}
            ref={ref}
            type={showPassword ? 'text' : 'password'}
            value={value}
            onChange={handleChange}
            onBlur={onBlur}
            className={cn(className, 'pr-10')}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full w-10 rounded-l-none"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
        </div>

        {showStrengthIndicator && value && (
          <div className="mt-2 space-y-1">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-muted-foreground">Độ mạnh mật khẩu:</span>
              <span className={cn(
                'font-medium',
                strength.score <= 1 && 'text-red-500',
                strength.score === 2 && 'text-yellow-500',
                strength.score >= 3 && 'text-green-500'
              )}>
                {strength.label}
              </span>
            </div>
            <div className="flex gap-1">
              {[0, 1, 2, 3, 4].map((level) => (
                <div
                  key={level}
                  className={cn(
                    'h-1 flex-1 rounded-full transition-colors',
                    level <= strength.score 
                      ? strength.color 
                      : 'bg-muted'
                  )}
                />
              ))}
            </div>
            {strength.score < 3 && (
              <div className="text-xs text-muted-foreground mt-2">
                <p className="font-medium mb-1">Gợi ý:</p>
                <ul className="list-disc list-inside space-y-0.5">
                  {value.length < 8 && <li>Ít nhất 8 ký tự</li>}
                  {!/[a-z]/.test(value) && <li>Thêm chữ thường</li>}
                  {!/[A-Z]/.test(value) && <li>Thêm chữ hoa</li>}
                  {!/\d/.test(value) && <li>Thêm số</li>}
                  {!/[!@#$%^&*(),.?":{}|<>]/.test(value) && <li>Thêm ký tự đặc biệt</li>}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    )
  }
)
PasswordInput.displayName = 'PasswordInput'

export { PasswordInput }

