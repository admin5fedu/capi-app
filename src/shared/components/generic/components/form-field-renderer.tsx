import { RefObject } from 'react'
import { UseFormReturn, Path, FieldValues, PathValue } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { NumberInput } from '@/components/ui/number-input'
import { PhoneInput } from '@/components/ui/phone-input'
import { EmailInput } from '@/components/ui/email-input'
import { DatePicker } from '@/components/ui/date-picker'
import { AutocompleteInput } from '@/components/ui/autocomplete-input'
import { RichTextEditor } from '@/components/ui/rich-text-editor'
import { FileUpload } from '@/components/ui/file-upload'
import { PasswordInput } from '@/components/ui/password-input'
import { MaskedInput } from '@/components/ui/masked-input'
import { cn } from '@/lib/utils'
import type { FormField } from '../generic-form-view'

interface FormFieldRendererProps<TFormData extends FieldValues> {
  field: FormField<TFormData>
  form: UseFormReturn<TFormData>
  isLoading: boolean
  fieldRef?: RefObject<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  hasError: boolean
}

export function FormFieldRenderer<TFormData extends FieldValues>({
  field,
  form,
  isLoading,
  fieldRef,
  hasError,
}: FormFieldRendererProps<TFormData>) {
  const { register, watch, setValue } = form

  // Custom render
  if (field.render) {
    return <>{field.render(form)}</>
  }

  // Standard field types
  if (field.type === 'textarea') {
    return (
      <Textarea
        id={String(field.key)}
        {...register(field.key)}
        ref={fieldRef as any}
        placeholder={field.placeholder}
        disabled={field.disabled || isLoading}
        rows={4}
        className={cn(
          hasError && 'border-destructive focus-visible:ring-destructive'
        )}
      />
    )
  }

  if (field.type === 'select' && field.options) {
    return (
      <select
        id={String(field.key)}
        {...register(field.key)}
        ref={fieldRef as any}
        disabled={field.disabled || isLoading}
        className={cn(
          'flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background',
          'file:border-0 file:bg-transparent file:text-sm file:font-medium',
          'placeholder:text-muted-foreground',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-50',
          hasError && 'border-destructive focus-visible:ring-destructive'
        )}
      >
        <option value="">Chọn {field.label.toLowerCase()}</option>
        {field.options.map((option) => (
          <option key={String(option.value)} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    )
  }

  if (field.type === 'checkbox') {
    return (
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id={String(field.key)}
          {...register(field.key)}
          disabled={field.disabled || isLoading}
          className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
        />
        <Label htmlFor={String(field.key)} className="font-normal cursor-pointer">
          {field.label}
          {field.required && <span className="text-destructive ml-1">*</span>}
        </Label>
      </div>
    )
  }

  if (field.type === 'phone') {
    return (
      <PhoneInput
        id={String(field.key)}
        {...register(field.key)}
        ref={fieldRef as any}
        value={watch(field.key) as string}
        onChange={(value) => setValue(field.key, value as any)}
        placeholder={field.placeholder}
        disabled={field.disabled || isLoading}
        className={cn(
          'h-11',
          hasError && 'border-destructive focus-visible:ring-destructive'
        )}
      />
    )
  }

  if (field.type === 'number-formatted') {
    return (
      <NumberInput
        id={String(field.key)}
        {...register(field.key)}
        ref={fieldRef as any}
        value={watch(field.key) as number}
        onChange={(value) => setValue(field.key, value as any)}
        placeholder={field.placeholder}
        disabled={field.disabled || isLoading}
        allowDecimals={field.allowDecimals}
        min={field.min}
        max={field.max}
        className={cn(
          'h-11',
          hasError && 'border-destructive focus-visible:ring-destructive'
        )}
      />
    )
  }

  if (field.type === 'email') {
    return (
      <EmailInput
        id={String(field.key)}
        {...register(field.key)}
        ref={fieldRef as any}
        value={watch(field.key) as string}
        onChange={(value) => setValue(field.key, value as any)}
        placeholder={field.placeholder}
        disabled={field.disabled || isLoading}
        className={cn(
          'h-11',
          hasError && 'border-destructive focus-visible:ring-destructive'
        )}
      />
    )
  }

  if (field.type === 'date-picker') {
    return (
      <DatePicker
        id={String(field.key)}
        {...register(field.key)}
        ref={fieldRef as any}
        value={watch(field.key) as Date | string | null}
        onChange={(value) => setValue(field.key, value as any)}
        placeholder={field.placeholder}
        disabled={field.disabled || isLoading}
        className={cn(
          'h-11',
          hasError && 'border-destructive focus-visible:ring-destructive'
        )}
      />
    )
  }

  if (field.type === 'autocomplete' && field.autocompleteOptions) {
    return (
      <AutocompleteInput
        id={String(field.key)}
        {...register(field.key)}
        ref={fieldRef as any}
        options={field.autocompleteOptions}
        value={watch(field.key) as string | number}
        onChange={(value) => setValue(field.key, value as any)}
        placeholder={field.placeholder}
        disabled={field.disabled || isLoading}
        className={cn(
          'h-11',
          hasError && 'border-destructive focus-visible:ring-destructive'
        )}
      />
    )
  }

  if (field.type === 'rich-text') {
    return (
      <RichTextEditor
        value={watch(field.key) as string}
        onChange={(value) => setValue(field.key, value as any)}
        placeholder={field.placeholder}
        disabled={field.disabled || isLoading}
        className={cn(
          hasError && 'border-destructive'
        )}
      />
    )
  }

  if (field.type === 'file-upload') {
    return (
      <FileUpload
        value={watch(field.key) as File | string | null}
        onChange={(file) => setValue(field.key, file as any)}
        accept={field.accept}
        maxSize={field.maxSize}
        disabled={field.disabled || isLoading}
        label={field.label}
        helperText={field.helperText}
      />
    )
  }

  if (field.type === 'password-strength') {
    return (
      <PasswordInput
        id={String(field.key)}
        {...register(field.key)}
        ref={fieldRef as any}
        value={watch(field.key) as string}
        onChange={(value) => setValue(field.key, value as any)}
        placeholder={field.placeholder}
        disabled={field.disabled || isLoading}
        showStrengthIndicator={true}
        className={cn(
          'h-11',
          hasError && 'border-destructive focus-visible:ring-destructive'
        )}
      />
    )
  }

  if (field.type === 'masked' && field.mask) {
    return (
      <MaskedInput
        id={String(field.key)}
        {...register(field.key)}
        ref={fieldRef as any}
        mask={field.mask}
        value={watch(field.key) as string}
        onChange={(value) => setValue(field.key, value as any)}
        placeholder={field.placeholder}
        disabled={field.disabled || isLoading}
        className={cn(
          'h-11',
          hasError && 'border-destructive focus-visible:ring-destructive'
        )}
      />
    )
  }

  // Default: text input
  return (
    <Input
      id={String(field.key)}
      type={field.type || 'text'}
      {...register(field.key)}
      ref={fieldRef as any}
      placeholder={field.placeholder}
      disabled={field.disabled || isLoading}
      className={cn(
        'h-11',
        hasError && 'border-destructive focus-visible:ring-destructive'
      )}
    />
  )
}


