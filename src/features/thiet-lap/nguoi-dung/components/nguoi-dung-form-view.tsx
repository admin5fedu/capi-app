import { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTaoMoiNguoiDung, useCapNhatNguoiDung, useChiTietNguoiDung } from '../hooks/use-nguoi-dung'
import { useVaiTroList } from '@/features/thiet-lap/vai-tro'
import type { NguoiDungInsert, NguoiDungUpdate } from '@/types/nguoi-dung'
import { GenericFormView, FormFieldGroup } from '@/shared/components/generic/generic-form-view'
import { AvatarUploadField } from '@/components/avatar/avatar-upload-field'
import { cn } from '@/lib/utils'

// Schema validation
const nguoiDungSchema = z.object({
  email: z.string().min(1, 'Email là bắt buộc').email('Email không hợp lệ'),
  ho_va_ten: z.string().min(1, 'Họ tên là bắt buộc'),
  vai_tro_id: z.preprocess(
    (val) => {
      // Convert empty string, null, undefined to empty string for validation
      if (val === null || val === undefined) return ''
      return val
    },
    z.union([
      z.string().refine((val) => val.trim().length > 0, { message: 'Vai trò là bắt buộc' }),
      z.number().refine((val) => val > 0, { message: 'Vai trò là bắt buộc' }),
    ])
  ),
  avatar_url: z.preprocess(
    (val) => val === '' ? null : val,
    z.string().nullable().optional()
  ),
  trang_thai: z.string().min(1, 'Trạng thái là bắt buộc'),
  phong_ban_id: z.preprocess(
    (val) => val === '' || val === null || val === undefined ? null : Number(val),
    z.number().nullable().optional()
  ),
  ten_phong_ban: z.preprocess(
    (val) => val === '' ? null : val,
    z.string().nullable().optional()
  ),
  ten_vai_tro: z.preprocess(
    (val) => val === '' ? null : val,
    z.string().nullable().optional()
  ),
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

  // Use chiTiet data as defaultValues if available (for edit mode)
  // Memoize to prevent unnecessary recalculations
  // IMPORTANT: All hooks must be called before any early returns
  const defaultValues = useMemo(() => {
    // If editing and chiTiet is available, use it
    if (editId && chiTiet && chiTiet.id?.toString() === editId.toString()) {
      return {
        email: String(chiTiet.email || ''),
        ho_va_ten: String(chiTiet.ho_va_ten || chiTiet.ho_ten || ''),
        vai_tro_id: chiTiet.vai_tro_id ? String(chiTiet.vai_tro_id) : '',
        avatar_url: chiTiet.avatar_url ? String(chiTiet.avatar_url) : '',
        trang_thai: String(chiTiet.trang_thai || 'Hoạt động'),
        phong_ban_id: chiTiet.phong_ban_id || null,
        ten_phong_ban: chiTiet.ten_phong_ban ? String(chiTiet.ten_phong_ban) : '',
        ten_vai_tro: chiTiet.ten_vai_tro ? String(chiTiet.ten_vai_tro) : '',
      }
    }
    // For new mode or when chiTiet is not yet loaded, use initialData or empty
    return {
      email: String(initialData?.email || ''),
      ho_va_ten: String(initialData?.ho_va_ten || ''),
      vai_tro_id: initialData?.vai_tro_id ? String(initialData.vai_tro_id) : '',
      avatar_url: initialData?.avatar_url ? String(initialData.avatar_url) : '',
      trang_thai: String(initialData?.trang_thai || 'Hoạt động'),
      phong_ban_id: initialData?.phong_ban_id || null,
      ten_phong_ban: initialData?.ten_phong_ban ? String(initialData.ten_phong_ban) : '',
      ten_vai_tro: initialData?.ten_vai_tro ? String(initialData.ten_vai_tro) : '',
    }
  }, [chiTiet, editId, initialData])

  const form = useForm<NguoiDungFormData>({
    resolver: zodResolver(nguoiDungSchema),
    defaultValues,
  })

  const {
    formState: { isSubmitting },
    reset,
  } = form

  // Early return for loading state - AFTER all hooks are called
  if (editId && (dangTaiChiTiet || !chiTiet)) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">Đang tải dữ liệu...</div>
      </div>
    )
  }

  // If editing but no data after loading completes
  if (editId && !chiTiet && !dangTaiChiTiet) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-destructive">Không tìm thấy dữ liệu người dùng</div>
      </div>
    )
  }

  // Load dữ liệu khi chỉnh sửa - CHỈ chạy khi có chiTiet
  useEffect(() => {
    if (chiTiet && editId && chiTiet.id?.toString() === editId.toString()) {
      const formData = {
        email: String(chiTiet.email || ''),
        ho_va_ten: String(chiTiet.ho_va_ten || chiTiet.ho_ten || ''),
        vai_tro_id: chiTiet.vai_tro_id ? String(chiTiet.vai_tro_id) : '',
        avatar_url: chiTiet.avatar_url ? String(chiTiet.avatar_url) : '',
        trang_thai: String(chiTiet.trang_thai || 'Hoạt động'),
        phong_ban_id: chiTiet.phong_ban_id || null,
        ten_phong_ban: chiTiet.ten_phong_ban ? String(chiTiet.ten_phong_ban) : '',
        ten_vai_tro: chiTiet.ten_vai_tro ? String(chiTiet.ten_vai_tro) : '',
      }

      reset(formData, { keepDefaultValues: false })
    } else if (!editId && initialData) {
      // Nếu không có editId (chế độ tạo mới) và có initialData, reset form với initialData
      reset({
        email: String(initialData.email || ''),
        ho_va_ten: String(initialData.ho_va_ten || ''),
        vai_tro_id: initialData.vai_tro_id ? String(initialData.vai_tro_id) : '',
        avatar_url: initialData.avatar_url ? String(initialData.avatar_url) : '',
        trang_thai: String(initialData.trang_thai || 'Hoạt động'),
        phong_ban_id: initialData.phong_ban_id || null,
        ten_phong_ban: initialData.ten_phong_ban ? String(initialData.ten_phong_ban) : '',
        ten_vai_tro: initialData.ten_vai_tro ? String(initialData.ten_vai_tro) : '',
      }, { keepDefaultValues: false })
    }
  }, [chiTiet, initialData, editId, reset])

  const onSubmit = async (data: NguoiDungFormData) => {
    try {
      // Validate vai_tro_id
      let vaiTroId: number | null = null
      if (typeof data.vai_tro_id === 'string' && data.vai_tro_id.trim() !== '') {
        vaiTroId = parseInt(data.vai_tro_id)
      } else if (typeof data.vai_tro_id === 'number') {
        vaiTroId = data.vai_tro_id
      }

      if (!vaiTroId || vaiTroId <= 0) {
        form.setError('vai_tro_id', { type: 'manual', message: 'Vai trò là bắt buộc' })
        return
      }

      const formData: NguoiDungInsert | NguoiDungUpdate = {
        email: data.email.trim(),
        ho_va_ten: data.ho_va_ten.trim(),
        vai_tro_id: vaiTroId,
        avatar_url: data.avatar_url?.trim() || null,
        trang_thai: data.trang_thai || 'Hoạt động',
        phong_ban_id: data.phong_ban_id || null,
        ten_phong_ban: data.ten_phong_ban?.trim() || null,
        ten_vai_tro: data.ten_vai_tro?.trim() || null,
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

  // Loading state check is now moved BEFORE useForm initialization (see lines 75-88)
  // This ensures form is only created when chiTiet is available (for edit mode)

  const title = editId ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới'
  const isLoading = isSubmitting || taoMoi.isPending || capNhat.isPending

  // Định nghĩa các nhóm fields
  const fieldGroups: FormFieldGroup<NguoiDungFormData>[] = [
    {
      title: 'Thông tin cơ bản',
      fields: [
        {
          key: 'ho_va_ten',
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
            value: String(vaiTro.id), // Convert to string để match với form value
            label: vaiTro.ten_vai_tro || vaiTro.ten || '',
          })) || [],
          placeholder: 'Chọn vai trò',
        },
        {
          key: 'avatar_url',
          label: 'Hình ảnh đại diện',
          type: 'custom',
          span: 3,
          render: (form) => (
            <AvatarUploadField
              form={form}
              fieldName="avatar_url"
              currentAvatarUrl={form.watch('avatar_url')}
              userName={form.watch('ho_va_ten') || 'Người dùng'}
              disabled={isLoading}
            />
          ),
        },
        {
          key: 'trang_thai',
          label: 'Trạng thái',
          type: 'select',
          options: [
            { value: 'Hoạt động', label: 'Hoạt động' },
            { value: 'Vô hiệu hóa', label: 'Vô hiệu hóa' },
          ],
          placeholder: 'Chọn trạng thái',
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
        key={editId && chiTiet ? `edit-${chiTiet.id}` : 'new'}
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

