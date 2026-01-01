import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTaiKhoanById, useCreateTaiKhoan, useUpdateTaiKhoan } from '../hooks/use-tai-khoan'
import type { TaiKhoanInsert, TaiKhoanUpdate } from '@/types/tai-khoan'
import { GenericFormView } from '@/shared/components/generic/generic-form-view'
import type { FormFieldGroup } from '@/shared/components/generic/generic-form-view'
import { LOAI_TAI_KHOAN, LOAI_TIEN } from '../config'
import { useAuthStore } from '@/store/auth-store'

// Schema validation
const taiKhoanSchema = z.object({
  ten: z.string().min(1, 'Tên tài khoản là bắt buộc').max(255, 'Tên tài khoản quá dài'),
  loai: z.string().min(1, 'Loại tài khoản là bắt buộc'),
  loai_tien: z.string().min(1, 'Loại tiền là bắt buộc'),
  so_du_ban_dau: z.preprocess(
    (val) => val === '' || val === null || val === undefined ? null : Number(val),
    z.number().nullable().optional()
  ),
  mo_ta: z.preprocess(
    (val) => val === '' ? null : val,
    z.string().max(1000, 'Mô tả quá dài').nullable().optional()
  ),
  is_active: z.preprocess(
    (val) => val === '' ? null : val,
    z.string().nullable().optional()
  ),
  so_tai_khoan: z.preprocess(
    (val) => val === '' ? null : val,
    z.string().max(255, 'Số tài khoản quá dài').nullable().optional()
  ),
  ngan_hang: z.preprocess(
    (val) => val === '' ? null : val,
    z.string().max(255, 'Ngân hàng quá dài').nullable().optional()
  ),
  chu_tai_khoan: z.preprocess(
    (val) => val === '' ? null : val,
    z.string().max(255, 'Chủ tài khoản quá dài').nullable().optional()
  ),
  ma_qr: z.preprocess(
    (val) => val === '' ? null : val,
    z.string().nullable().optional()
  ),
})

type TaiKhoanFormData = z.infer<typeof taiKhoanSchema>

interface TaiKhoanFormViewProps {
  editId?: string | null
  onComplete: () => void
  onCancel: () => void
  mode?: 'modal' | 'page'
}

/**
 * TaiKhoanFormView component - Sử dụng GenericFormViewWrapper
 */
export function TaiKhoanFormView({
  editId,
  onComplete,
  onCancel,
}: TaiKhoanFormViewProps) {
  const { data: chiTiet, isLoading: dangTaiChiTiet } = useTaiKhoanById(editId || null)
  const taoMoi = useCreateTaiKhoan()
  const capNhat = useUpdateTaiKhoan()
  const { nguoiDung } = useAuthStore()

  const form = useForm<TaiKhoanFormData>({
    resolver: zodResolver(taiKhoanSchema),
    defaultValues: {
      ten: '',
      loai: '',
      loai_tien: 'VND',
      so_du_ban_dau: 0,
      mo_ta: null,
      is_active: 'true',
      so_tai_khoan: null,
      ngan_hang: null,
      chu_tai_khoan: null,
      ma_qr: null,
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
        ten: chiTiet.ten,
        loai: chiTiet.loai,
        loai_tien: chiTiet.loai_tien,
        so_du_ban_dau: chiTiet.so_du_ban_dau ?? 0,
        mo_ta: chiTiet.mo_ta || null,
        is_active: chiTiet.is_active ? 'true' : 'false',
        so_tai_khoan: chiTiet.so_tai_khoan || null,
        ngan_hang: chiTiet.ngan_hang || null,
        chu_tai_khoan: chiTiet.chu_tai_khoan || null,
        ma_qr: chiTiet.ma_qr || null,
      })
    }
  }, [chiTiet, reset])

  const onSubmit = async (data: TaiKhoanFormData) => {
    try {
      const formData: TaiKhoanInsert | TaiKhoanUpdate = {
        ten: data.ten,
        loai: data.loai,
        loai_tien: data.loai_tien,
        so_du_ban_dau: data.so_du_ban_dau ?? 0,
        mo_ta: data.mo_ta || null,
        is_active: data.is_active === 'true' ? true : data.is_active === 'false' ? false : true,
        so_tai_khoan: data.so_tai_khoan || null,
        ngan_hang: data.ngan_hang || null,
        chu_tai_khoan: data.chu_tai_khoan || null,
        ma_qr: data.ma_qr || null,
      }

      if (editId) {
        await capNhat.mutateAsync({ id: editId, data: formData as TaiKhoanUpdate })
      } else {
        await taoMoi.mutateAsync({
          ...(formData as TaiKhoanInsert),
          created_by: nguoiDung?.id || null,
        })
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

  const title = editId ? 'Chỉnh sửa tài khoản' : 'Thêm tài khoản mới'
  const isLoading = isSubmitting || taoMoi.isPending || capNhat.isPending

  // Định nghĩa các nhóm fields
  const fieldGroups: FormFieldGroup<TaiKhoanFormData>[] = [
    {
      title: 'Thông tin cơ bản',
      fields: [
        {
          key: 'ten',
          label: 'Tên tài khoản',
          type: 'text',
          placeholder: 'Nhập tên tài khoản',
          required: true,
          span: 3,
        },
        {
          key: 'loai',
          label: 'Loại tài khoản',
          type: 'select',
          required: true,
          options: LOAI_TAI_KHOAN.map((loai) => ({ value: loai.value, label: loai.label })),
        },
        {
          key: 'loai_tien',
          label: 'Loại tiền',
          type: 'select',
          required: true,
          options: LOAI_TIEN.map((tien) => ({ value: tien.value, label: tien.label })),
        },
        {
          key: 'so_du_ban_dau',
          label: 'Số dư ban đầu',
          type: 'number',
          placeholder: '0',
        },
        {
          key: 'is_active',
          label: 'Trạng thái',
          type: 'select',
          options: [
            { value: 'true', label: 'Hoạt động' },
            { value: 'false', label: 'Vô hiệu hóa' },
          ],
        },
      ],
    },
    {
      title: 'Thông tin ngân hàng (nếu có)',
      fields: [
        {
          key: 'so_tai_khoan',
          label: 'Số tài khoản',
          type: 'text',
          placeholder: 'Nhập số tài khoản',
        },
        {
          key: 'ngan_hang',
          label: 'Ngân hàng',
          type: 'text',
          placeholder: 'Nhập tên ngân hàng',
        },
        {
          key: 'chu_tai_khoan',
          label: 'Chủ tài khoản',
          type: 'text',
          placeholder: 'Nhập tên chủ tài khoản',
        },
        {
          key: 'ma_qr',
          label: 'Mã QR',
          type: 'text',
          placeholder: 'Nhập mã QR',
        },
      ],
    },
    {
      title: 'Mô tả',
      fields: [
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
      <GenericFormView<TaiKhoanFormData>
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

