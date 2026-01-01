import { ReactNode } from 'react'
import { UseFormReturn, FieldValues, Path } from 'react-hook-form'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AutocompleteOption } from '@/components/ui/autocomplete-input'
import { cn } from '@/lib/utils'
import { useMobile } from './hooks/use-mobile'
import { useFormErrorHandling } from './hooks/use-form-error-handling'
import { FormHeader } from './components/form-header'
import { FormFooter } from './components/form-footer'
import { FormFieldWrapper } from './components/form-field-wrapper'
import { FormFieldRenderer } from './components/form-field-renderer'

export type FormFieldType = 'text' | 'email' | 'password' | 'number' | 'textarea' | 'select' | 'checkbox' | 'date' | 'url' | 'phone' | 'number-formatted' | 'date-picker' | 'autocomplete' | 'rich-text' | 'file-upload' | 'password-strength' | 'masked' | 'custom'

export interface FormFieldOption {
  value: string | number
  label: string
}

export interface FormField<TFormData extends FieldValues = FieldValues> {
  key: Path<TFormData>
  label: string
  type?: FormFieldType
  placeholder?: string
  required?: boolean
  span?: 1 | 2 | 3 // Số cột chiếm (mặc định 1, tối đa 3)
  options?: FormFieldOption[] // Cho select type
  disabled?: boolean
  render?: (form: UseFormReturn<TFormData>) => ReactNode // Custom render
  helperText?: string
  // Additional props for specific input types
  autocompleteOptions?: AutocompleteOption[] // For autocomplete type
  mask?: string // For masked input type
  accept?: string // For file-upload type
  maxSize?: number // For file-upload type (MB)
  allowDecimals?: boolean // For number-formatted type
  min?: number // For number-formatted type
  max?: number // For number-formatted type
}

export interface FormFieldGroup<TFormData extends FieldValues = FieldValues> {
  title: string
  fields: FormField<TFormData>[]
}

export interface GenericFormViewProps<TFormData extends FieldValues = FieldValues> {
  form: UseFormReturn<TFormData>
  title: string
  onBack?: () => void
  onSubmit: (data: TFormData) => void | Promise<void>
  onCancel?: () => void
  fields?: FormField<TFormData>[] // Flat fields (không nhóm)
  groups?: FormFieldGroup<TFormData>[] // Fields có nhóm
  isLoading?: boolean
  submitLabel?: string
  cancelLabel?: string
}

/**
 * GenericFormView - Component form generic với React Hook Form
 * - Header cố định khi cuộn
 * - Body scrollable
 * - Grid 3 cột
 * - Hỗ trợ chia nhóm fields
 * - Tích hợp với React Hook Form
 */
export function GenericFormView<TFormData extends FieldValues = FieldValues>({
  form,
  title,
  onBack,
  onSubmit,
  onCancel,
  fields = [],
  groups = [],
  isLoading = false,
  submitLabel = 'Lưu',
  cancelLabel = 'Hủy',
}: GenericFormViewProps<TFormData>) {
  const {
    handleSubmit,
    formState: { errors },
  } = form
  const isMobile = useMobile()
  const { firstErrorRef, firstFieldRef, createSubmitHandler } = useFormErrorHandling(form, isLoading)

  // Render field
  const renderField = (field: FormField<TFormData>, isFirstField = false) => {
    const span = field.span || 1
    const fieldError = errors[field.key]
    const hasError = !!fieldError

    // Mobile: horizontal layout (label và input cùng dòng)
    const isMobileLayout = isMobile && field.type !== 'checkbox' && field.type !== 'textarea'
    
    // Set ref cho field đầu tiên
    const fieldRef = isFirstField ? firstFieldRef : undefined

    // Custom render
    if (field.render) {
      return (
        <FormFieldWrapper
          key={String(field.key)}
          fieldKey={field.key}
          label={field.label}
          required={field.required}
          span={span}
          error={fieldError}
          helperText={field.helperText}
          isMobileLayout={isMobileLayout}
          isFirstField={isFirstField}
          firstErrorRef={firstErrorRef}
        >
          {field.render(form)}
        </FormFieldWrapper>
      )
    }

    // Standard field types
    return (
      <FormFieldWrapper
        key={String(field.key)}
        fieldKey={field.key}
        label={field.label}
        required={field.required}
        span={span}
        error={fieldError}
        helperText={field.helperText}
        isMobileLayout={isMobileLayout}
        isFirstField={isFirstField}
        firstErrorRef={firstErrorRef}
      >
        <FormFieldRenderer
          field={field}
          form={form}
          isLoading={isLoading}
          fieldRef={fieldRef}
          hasError={hasError}
        />
      </FormFieldWrapper>
    )
  }

  // Combine fields from groups if groups are provided
  const allFields = groups.length > 0 ? groups.flatMap((group) => group.fields) : fields
  
  // Get first field key for ref - tìm field đầu tiên không phải checkbox
  const firstFieldKey = allFields.find(f => f.type !== 'checkbox')?.key || allFields[0]?.key

  if (allFields.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4 min-h-[400px]">
        <div className="text-center space-y-2">
          <div className="text-4xl mb-4">📝</div>
          <div className="text-lg font-medium text-foreground">Không có trường dữ liệu để hiển thị</div>
          <div className="text-sm text-muted-foreground">
            Vui lòng thêm các trường vào form
          </div>
        </div>
        {onBack && (
          <Button onClick={onBack} variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Quay lại
          </Button>
        )}
      </div>
    )
  }

  const onSubmitWithErrorHandling = createSubmitHandler(onSubmit)

  return (
    <div className="flex flex-col h-full min-h-0 overflow-hidden">
      {/* Header - Fixed */}
      <FormHeader title={title} onBack={onBack} />

      {/* Body - Scrollable */}
      <form onSubmit={handleSubmit(onSubmitWithErrorHandling, (errors) => {
        const errorFields = Object.keys(errors);
        if (errorFields.length > 0) {
          alert("Vui lòng kiểm tra lại các trường: " + errorFields.join(", "));
        }
      })} className="flex flex-col flex-1 min-h-0 overflow-hidden">
        <div className="flex-1 min-h-0 overflow-y-auto px-4 sm:px-6 py-4 sm:py-6 scroll-smooth">
          <div className="space-y-8">
            {/* Render groups */}
            {groups.length > 0 ? (
              groups.map((group, groupIndex) => (
                <div key={groupIndex} className="space-y-4">
                  <h2 className="text-lg font-semibold text-primary border-b pb-2">
                    {group.title}
                  </h2>
                  <div className={cn(
                    'gap-6',
                    isMobile ? 'space-y-0' : 'grid grid-cols-3'
                  )}>
                    {group.fields.map((field) => 
                      renderField(field, field.key === firstFieldKey)
                    )}
                  </div>
                </div>
              ))
            ) : (
              /* Render flat fields */
              <div className={cn(
                'gap-6',
                isMobile ? 'space-y-0' : 'grid grid-cols-3'
              )}>
                {fields.map((field) => 
                  renderField(field, field.key === firstFieldKey)
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer - Fixed */}
        <FormFooter
          onCancel={onCancel}
          isLoading={isLoading}
          submitLabel={submitLabel}
          cancelLabel={cancelLabel}
        />
      </form>
    </div>
  )
}
