import { ReactNode, RefObject } from 'react'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { FieldErrors, Path } from 'react-hook-form'
import { translateZodError } from '@/lib/zod-error-translator'

interface FormFieldWrapperProps<TFormData extends Record<string, any>> {
  fieldKey: Path<TFormData>
  label: string
  required?: boolean
  span?: 1 | 2 | 3
  error?: FieldErrors<TFormData>[Path<TFormData>]
  helperText?: string
  isMobileLayout?: boolean
  isFirstField?: boolean
  firstErrorRef?: RefObject<HTMLDivElement>
  children: ReactNode
}

export function FormFieldWrapper<TFormData extends Record<string, any>>({
  fieldKey,
  label,
  required,
  span = 1,
  error,
  helperText,
  isMobileLayout = false,
  isFirstField = false,
  firstErrorRef,
  children,
}: FormFieldWrapperProps<TFormData>) {
  const hasError = !!error

  if (isMobileLayout) {
    return (
      <div
        className={cn(
          'py-2 border-b last:border-b-0',
          span === 1 && 'col-span-1',
          span === 2 && 'col-span-2',
          span === 3 && 'col-span-3'
        )}
      >
        <div className="flex items-start gap-2">
          <Label htmlFor={String(fieldKey)} className="text-sm font-medium text-muted-foreground flex-shrink-0 min-w-[100px]">
            {label}
            {required && <span className="text-destructive ml-1">*</span>}:
          </Label>
          <div className="flex-1">{children}</div>
        </div>
        {hasError && (
          <div ref={isFirstField && hasError ? firstErrorRef : undefined}>
            <p className="text-xs text-destructive mt-1 ml-[108px] font-medium">
              {translateZodError(error?.message as string)}
            </p>
          </div>
        )}
        {helperText && !hasError && (
          <p className="text-xs text-muted-foreground mt-1 ml-[108px]">{helperText}</p>
        )}
      </div>
    )
  }

  return (
    <div
      className={cn(
        'space-y-1',
        span === 1 && 'col-span-1',
        span === 2 && 'col-span-2',
        span === 3 && 'col-span-3'
      )}
    >
      <Label htmlFor={String(fieldKey)} id={`${String(fieldKey)}-label`}>
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      <div>{children}</div>
      {hasError && (
        <div ref={isFirstField && hasError ? firstErrorRef : undefined}>
          <p className="text-sm text-destructive font-medium mt-1">
            {translateZodError(error?.message as string)}
          </p>
        </div>
      )}
      {helperText && !hasError && (
        <p className="text-sm text-muted-foreground mt-1">{helperText}</p>
      )}
    </div>
  )
}

