import { useEffect, useRef } from 'react'
import { FieldErrors, UseFormReturn } from 'react-hook-form'

/**
 * Hook quản lý error handling và scroll to error cho form
 */
export function useFormErrorHandling<TFormData extends Record<string, any>>(
  form: UseFormReturn<TFormData>,
  isLoading: boolean
) {
  const { formState: { errors } } = form
  const firstErrorRef = useRef<HTMLDivElement>(null)
  const firstFieldRef = useRef<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(null)

  // Auto focus vào field đầu tiên khi mở form
  useEffect(() => {
    if (firstFieldRef.current && !isLoading) {
      // Delay nhỏ để đảm bảo form đã render
      setTimeout(() => {
        firstFieldRef.current?.focus()
      }, 100)
    }
  }, [isLoading])

  // Scroll to first error khi có lỗi
  useEffect(() => {
    if (firstErrorRef.current && Object.keys(errors).length > 0) {
      firstErrorRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      })
      // Focus vào field có lỗi đầu tiên
      const firstErrorKey = Object.keys(errors)[0]
      const errorField = document.getElementById(String(firstErrorKey))
      if (errorField) {
        setTimeout(() => {
          errorField.focus()
        }, 300)
      }
    }
  }, [errors])

  // Enhanced submit handler với scroll to error
  const createSubmitHandler = (onSubmit: (data: TFormData) => void | Promise<void>) => {
    return async (data: TFormData) => {
      try {
        await onSubmit(data)
      } catch (error) {
        // Error đã được xử lý bởi form validation
        // Scroll to first error nếu có
        if (firstErrorRef.current) {
          firstErrorRef.current.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          })
        }
      }
    }
  }

  return {
    firstErrorRef,
    firstFieldRef,
    createSubmitHandler,
  }
}

