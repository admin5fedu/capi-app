import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTyGiaById, useCreateTyGia, useUpdateTyGia } from '../hooks/use-ty-gia'
import type { TyGiaInsert, TyGiaUpdate } from '@/types/ty-gia'
import { GenericFormView } from '@/shared/components/generic/generic-form-view'
import type { FormFieldGroup } from '@/shared/components/generic/generic-form-view'
// import { useAuthStore } from '@/store/auth-store' // Unused

// Schema validation
const tyGiaSchema = z.object({
  ty_gia: z.preprocess(
    (val) => {
      if (val === '' || val === null || val === undefined) return undefined
      const num = typeof val === 'string' ? parseFloat(val) : Number(val)
      return isNaN(num) ? undefined : num
    },
    z.number({ required_error: 'Tỷ giá là bắt buộc', invalid_type_error: 'Tỷ giá phải là số' })
      .min(0.0001, 'Tỷ giá phải lớn hơn 0')
      .max(1000000, 'Tỷ giá quá lớn')
  ),
})

type TyGiaFormData = z.infer<typeof tyGiaSchema>

interface TyGiaFormViewProps {
  editId?: number | null
  onComplete: () => void
  onCancel: () => void
  mode?: 'modal' | 'page'
}

/**
 * TyGiaFormView component - Sử dụng GenericFormViewWrapper
 */
export function TyGiaFormView({
  editId,
  onComplete,
  onCancel,
}: TyGiaFormViewProps) {
  const { data: chiTiet, isLoading: dangTaiChiTiet } = useTyGiaById(editId || null)
  const taoMoi = useCreateTyGia()
  const capNhat = useUpdateTyGia()
  // const { nguoiDung } = useAuthStore() // Unused

  const form = useForm<TyGiaFormData>({
    resolver: zodResolver(tyGiaSchema),
    defaultValues: {
      ty_gia: undefined as any, // Không set default 0 để tránh validation error
    },
  })

  const {
    formState: { isSubmitting },
    reset,
  } = form

  // Load dữ liệu khi chỉnh sửa
  useEffect(() => {
    if (chiTiet) {
      reset({
        ty_gia: chiTiet.ty_gia || 0,
      })
    }
  }, [chiTiet, reset])

  const onSubmit = async (data: TyGiaFormData) => {
    try {
      const formData: TyGiaInsert | TyGiaUpdate = {
        ty_gia: data.ty_gia,
      }

      if (editId) {
        await capNhat.mutateAsync({ id: editId, data: formData as TyGiaUpdate })
      } else {
        await taoMoi.mutateAsync(formData as TyGiaInsert)
      }

      onComplete()
    } catch (error) {
      console.error('Error:', error)
    }
  }

  if (editId && dangTaiChiTiet) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">Đang tải dữ liệu...</div>
      </div>
    )
  }

  const title = editId ? 'Chỉnh sửa tỷ giá' : 'Thêm tỷ giá mới'
  const isLoading = isSubmitting || taoMoi.isPending || capNhat.isPending

  // Định nghĩa các nhóm fields
  const fieldGroups: FormFieldGroup<TyGiaFormData>[] = [
    {
      title: 'Thông tin tỷ giá',
      fields: [
        {
          key: 'ty_gia',
          label: 'Tỷ giá',
          type: 'number-formatted',
          placeholder: 'Nhập tỷ giá (ví dụ: 24000)',
          required: true,
          allowDecimals: true,
          min: 0.0001,
          span: 3,
        },
      ],
    },
  ]

  return (
    <div className="bg-card border rounded-lg overflow-hidden flex-1 flex flex-col min-h-0">
      <GenericFormView<TyGiaFormData>
        form={form}
        title={title}
        onSubmit={onSubmit}
        onCancel={onCancel}
        onBack={onCancel}
        groups={fieldGroups}
        isLoading={isLoading}
        submitLabel="Lưu"
        cancelLabel="Hủy"
      />
    </div>
  )
}

