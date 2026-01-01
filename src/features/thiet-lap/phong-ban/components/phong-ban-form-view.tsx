import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { usePhongBanById, useCreatePhongBan, useUpdatePhongBan } from '../hooks/use-phong-ban'
import type { PhongBanInsert, PhongBanUpdate } from '@/types/phong-ban'
import { GenericFormView, FormFieldGroup } from '@/shared/components/generic/generic-form-view'

// Schema validation
const phongBanSchema = z.object({
  ma_phong_ban: z.preprocess(
    (val) => val === '' ? null : val,
    z.string().max(50, 'Mã phòng ban quá dài').nullable().optional()
  ),
  ten_phong_ban: z.string().min(1, 'Tên phòng ban là bắt buộc').max(255, 'Tên phòng ban quá dài'),
  mo_ta: z.preprocess(
    (val) => val === '' ? null : val,
    z.string().max(1000, 'Mô tả quá dài').nullable().optional()
  ),
})

type PhongBanFormData = z.infer<typeof phongBanSchema>

interface PhongBanFormViewProps {
  editId?: string | null
  onComplete: () => void
  onCancel: () => void
  mode?: 'modal' | 'page'
}

/**
 * PhongBanFormView component - Sử dụng GenericFormViewWrapper
 */
export function PhongBanFormView({
  editId,
  onComplete,
  onCancel,
}: PhongBanFormViewProps) {
  const { data: chiTiet, isLoading: dangTaiChiTiet } = usePhongBanById(editId || null)
  const taoMoi = useCreatePhongBan()
  const capNhat = useUpdatePhongBan()

  const form = useForm<PhongBanFormData>({
    resolver: zodResolver(phongBanSchema),
    defaultValues: {
      ma_phong_ban: null,
      ten_phong_ban: '',
      mo_ta: null,
    },
  })

  const {
    formState: { isSubmitting },
    reset,
  } = form

  // Load dữ liệu khi chỉnh sửa
  useEffect(() => {
    if (chiTiet && editId && chiTiet.id?.toString() === editId.toString()) {
      reset({
        ma_phong_ban: chiTiet.ma_phong_ban || null,
        ten_phong_ban: chiTiet.ten_phong_ban || '',
        mo_ta: chiTiet.mo_ta || null,
      }, { keepDefaultValues: false })
    }
  }, [chiTiet, editId, reset])

  const onSubmit = async (data: PhongBanFormData) => {
    try {
      const formData: PhongBanInsert | PhongBanUpdate = {
        ma_phong_ban: data.ma_phong_ban || null,
        ten_phong_ban: data.ten_phong_ban,
        mo_ta: data.mo_ta || null,
      }

      if (editId) {
        await capNhat.mutateAsync({ id: editId, data: formData as PhongBanUpdate })
      } else {
        await taoMoi.mutateAsync(formData as PhongBanInsert)
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

  const title = editId ? 'Chỉnh sửa phòng ban' : 'Thêm phòng ban mới'
  const isLoading = isSubmitting || taoMoi.isPending || capNhat.isPending

  // Định nghĩa các nhóm fields
  const fieldGroups: FormFieldGroup<PhongBanFormData>[] = [
    {
      title: 'Thông tin cơ bản',
      fields: [
        {
          key: 'ma_phong_ban',
          label: 'Mã phòng ban',
          type: 'text',
          placeholder: 'Nhập mã phòng ban (tùy chọn)',
          required: false,
        },
        {
          key: 'ten_phong_ban',
          label: 'Tên phòng ban',
          type: 'text',
          placeholder: 'Nhập tên phòng ban',
          required: true,
        },
        {
          key: 'mo_ta',
          label: 'Mô tả',
          type: 'textarea',
          placeholder: 'Nhập mô tả (tùy chọn)',
          span: 3,
        },
      ],
    },
  ]

  return (
    <div className="bg-card border rounded-lg overflow-hidden flex-1 flex flex-col min-h-0">
      <GenericFormView<PhongBanFormData>
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

