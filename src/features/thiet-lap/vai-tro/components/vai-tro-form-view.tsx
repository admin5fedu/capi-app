import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useVaiTroById, useCreateVaiTro, useUpdateVaiTro } from '../hooks/use-vai-tro'
import type { VaiTroInsert, VaiTroUpdate } from '@/types/vai-tro'
import { GenericFormView, FormFieldGroup } from '@/shared/components/generic/generic-form-view'

// Schema validation
const vaiTroSchema = z.object({
  ten_vai_tro: z.string().min(1, 'Tên vai trò là bắt buộc').max(255, 'Tên vai trò quá dài'),
  mo_ta: z.preprocess(
    (val) => val === '' ? null : val,
    z.string().max(1000, 'Mô tả quá dài').nullable().optional()
  ),
})

type VaiTroFormData = z.infer<typeof vaiTroSchema>

interface VaiTroFormViewProps {
  editId?: string | null
  onComplete: () => void
  onCancel: () => void
  mode?: 'modal' | 'page'
}

/**
 * VaiTroFormView component - Sử dụng GenericFormViewWrapper
 */
export function VaiTroFormView({
  editId,
  onComplete,
  onCancel,
}: VaiTroFormViewProps) {
  const { data: chiTiet, isLoading: dangTaiChiTiet } = useVaiTroById(editId || null)
  const taoMoi = useCreateVaiTro()
  const capNhat = useUpdateVaiTro()

  const form = useForm<VaiTroFormData>({
    resolver: zodResolver(vaiTroSchema),
    defaultValues: {
      ten_vai_tro: '',
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
        ten_vai_tro: chiTiet.ten_vai_tro || chiTiet.ten || '',
        mo_ta: chiTiet.mo_ta || null,
      }, { keepDefaultValues: false })
    }
  }, [chiTiet, editId, reset])

  const onSubmit = async (data: VaiTroFormData) => {
    try {
      const formData: VaiTroInsert | VaiTroUpdate = {
        ten_vai_tro: data.ten_vai_tro,
        mo_ta: data.mo_ta || null,
      }

      if (editId) {
        await capNhat.mutateAsync({ id: editId, data: formData as VaiTroUpdate })
      } else {
        await taoMoi.mutateAsync(formData as VaiTroInsert)
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

  const title = editId ? 'Chỉnh sửa vai trò' : 'Thêm vai trò mới'
  const isLoading = isSubmitting || taoMoi.isPending || capNhat.isPending

  // Định nghĩa các nhóm fields
  const fieldGroups: FormFieldGroup<VaiTroFormData>[] = [
    {
      title: 'Thông tin cơ bản',
      fields: [
        {
          key: 'ten_vai_tro',
          label: 'Tên vai trò',
          type: 'text',
          placeholder: 'Nhập tên vai trò',
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
      <GenericFormView<VaiTroFormData>
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

