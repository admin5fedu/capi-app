import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTaoMoiNguoiDung, useCapNhatNguoiDung, useChiTietNguoiDung } from '../hooks/use-nguoi-dung'
import { useVaiTroList } from '@/features/thiet-lap/vai-tro'
import type { NguoiDungInsert, NguoiDungUpdate } from '@/types/nguoi-dung'
import { GenericFormView, FormFieldGroup } from '@/shared/components/generic/generic-form-view'
import { cn } from '@/lib/utils'

// Schema validation
const nguoiDungSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  ho_ten: z.string().min(1, 'Họ tên là bắt buộc'),
  vai_tro_id: z.string().min(1, 'Vai trò là bắt buộc'),
  avatar_url: z.string().url('URL không hợp lệ').optional().or(z.literal('')),
  is_active: z.boolean().default(true),
})

type NguoiDungFormData = z.infer<typeof nguoiDungSchema>

interface NguoiDungFormViewProps {
  editId?: string | null
  onComplete: () => void
  onCancel: () => void
  mode?: 'modal' | 'page'
  initialData?: Partial<NguoiDungFormData> // Dữ liệu khởi tạo (ví dụ: vai_tro_id từ parent)
}

/**
 * NguoiDungFormView component - Sử dụng GenericFormView
 */
export function NguoiDungFormView({
  editId,
  onComplete,
  onCancel,
  mode = 'page',
  initialData,
}: NguoiDungFormViewProps) {
  const { data: chiTiet, isLoading: dangTaiChiTiet } = useChiTietNguoiDung(editId || null)
  const { data: danhSachVaiTro } = useVaiTroList()
  const taoMoi = useTaoMoiNguoiDung()
  const capNhat = useCapNhatNguoiDung()

  const form = useForm<NguoiDungFormData>({
    resolver: zodResolver(nguoiDungSchema),
    defaultValues: {
      email: initialData?.email || '',
      ho_ten: initialData?.ho_ten || '',
      vai_tro_id: initialData?.vai_tro_id || '',
      avatar_url: initialData?.avatar_url || '',
      is_active: initialData?.is_active ?? true,
    },
  })

  const {
    formState: { isSubmitting },
    reset,
  } = form

  // Load dữ liệu khi chỉnh sửa hoặc khi có initialData
  useEffect(() => {
    if (chiTiet) {
      reset({
        email: chiTiet.email,
        ho_ten: chiTiet.ho_ten,
        vai_tro_id: chiTiet.vai_tro_id,
        avatar_url: chiTiet.avatar_url || '',
        is_active: chiTiet.is_active,
      })
    } else if (initialData && !editId) {
      // Nếu có initialData và không phải edit mode, reset form với initialData
      reset({
        email: initialData.email || '',
        ho_ten: initialData.ho_ten || '',
        vai_tro_id: initialData.vai_tro_id || '',
        avatar_url: initialData.avatar_url || '',
        is_active: initialData.is_active ?? true,
      })
    }
  }, [chiTiet, initialData, editId, reset])

  const onSubmit = async (data: NguoiDungFormData) => {
    try {
      const formData: NguoiDungInsert | NguoiDungUpdate = {
        email: data.email,
        ho_ten: data.ho_ten,
        vai_tro_id: data.vai_tro_id,
        avatar_url: data.avatar_url || null,
        is_active: data.is_active,
      }

      if (editId) {
        await capNhat.mutateAsync({ id: editId, data: formData })
      } else {
        await taoMoi.mutateAsync(formData as NguoiDungInsert)
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

  const title = editId ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới'
  const isLoading = isSubmitting || taoMoi.isPending || capNhat.isPending

  // Định nghĩa các nhóm fields
  const fieldGroups: FormFieldGroup<NguoiDungFormData>[] = [
    {
      title: 'Thông tin cơ bản',
      fields: [
        {
          key: 'ho_ten',
          label: 'Họ tên',
          type: 'text',
          placeholder: 'Nhập họ tên',
          required: true,
        },
        {
          key: 'email',
          label: 'Email',
          type: 'email',
          placeholder: 'email@example.com',
          required: true,
          disabled: !!editId, // Không cho sửa email khi chỉnh sửa
        },
        {
          key: 'vai_tro_id',
          label: 'Vai trò',
          type: 'select',
          required: true,
          options: danhSachVaiTro?.map((vaiTro) => ({
            value: vaiTro.id,
            label: vaiTro.ten,
          })) || [],
          placeholder: 'Chọn vai trò',
        },
        {
          key: 'avatar_url',
          label: 'URL Avatar',
          type: 'url',
          placeholder: 'https://example.com/avatar.jpg',
        },
        {
          key: 'is_active',
          label: 'Hoạt động',
          type: 'checkbox',
        },
      ],
    },
  ]

  return (
    <div className={cn(
      'bg-card border rounded-lg overflow-hidden flex-1 flex flex-col min-h-0',
      mode === 'modal' && 'h-auto'
    )}>
      <GenericFormView<NguoiDungFormData>
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

