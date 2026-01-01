import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTaiKhoanById, useCreateTaiKhoan, useUpdateTaiKhoan } from '../hooks/use-tai-khoan'
import type { TaiKhoanInsert, TaiKhoanUpdate } from '@/types/tai-khoan'
import { GenericFormView } from '@/shared/components/generic/generic-form-view'
import type { FormFieldGroup } from '@/shared/components/generic/generic-form-view'
import { LOAI_TAI_KHOAN, LOAI_TIEN } from '../config'
import { useAuthStore } from '@/store/auth-store'
import { ToggleGroup } from '@/components/ui/toggle-group'
import { AutocompleteInput } from '@/components/ui/autocomplete-input'
import { searchNganHang } from '../utils/ngan-hang-vn'
// import { DANH_SACH_NGAN_HANG_VN } from '../utils/ngan-hang-vn' // Unused
import { VietQRCode } from './viet-qr-code'

// Schema validation
const taiKhoanSchema = z.object({
  ten_tai_khoan: z.string().min(1, 'Tên tài khoản là bắt buộc').max(255, 'Tên tài khoản quá dài'),
  loai_tai_khoan: z.string().min(1, 'Loại tài khoản là bắt buộc'),
  don_vi: z.string().min(1, 'Đơn vị là bắt buộc'),
  so_du_dau: z.preprocess(
    (val) => val === '' || val === null || val === undefined ? null : Number(val),
    z.number().nullable().optional()
  ),
  ghi_chu: z.preprocess(
    (val) => val === '' ? null : val,
    z.string().max(1000, 'Ghi chú quá dài').nullable().optional()
  ),
  trang_thai: z.preprocess(
    (val) => val === '' ? 'hoat_dong' : val,
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
      ten_tai_khoan: '',
      loai_tai_khoan: 'tien_mat', // Default: Tiền mặt
      don_vi: 'VND',
      so_du_dau: 0,
      ghi_chu: null,
      trang_thai: 'hoat_dong',
      so_tai_khoan: null,
      ngan_hang: null,
      chu_tai_khoan: null,
    },
  })

  const {
    formState: { isSubmitting },
    reset,
    watch,
    setValue,
  } = form

  // Watch các giá trị để điều khiển hiển thị
  const loaiTaiKhoan = watch('loai_tai_khoan')
  const soTaiKhoan = watch('so_tai_khoan')
  const nganHang = watch('ngan_hang')
  const chuTaiKhoan = watch('chu_tai_khoan')

  // Chỉ hiển thị thông tin ngân hàng nếu loại tài khoản là "Tài khoản" (không phải Tiền mặt)
  const showNganHangInfo = loaiTaiKhoan === 'tai_khoan'

  // Autocomplete options cho ngân hàng
  const [nganHangSearchTerm, setNganHangSearchTerm] = useState('')
  const nganHangOptions = useMemo(() => {
    const banks = searchNganHang(nganHangSearchTerm)
    return banks.map((bank) => ({
      value: bank.name,
      label: `${bank.shortName} - ${bank.name}`,
      description: bank.code,
    }))
  }, [nganHangSearchTerm])

  // Load dữ liệu khi chỉnh sửa
  useEffect(() => {
    if (chiTiet) {
      reset({
        ten_tai_khoan: chiTiet.ten_tai_khoan || chiTiet.ten || '',
        loai_tai_khoan: chiTiet.loai_tai_khoan || chiTiet.loai || '',
        don_vi: chiTiet.don_vi || chiTiet.loai_tien || 'VND',
        so_du_dau: chiTiet.so_du_dau ?? chiTiet.so_du_ban_dau ?? 0,
        ghi_chu: chiTiet.ghi_chu || chiTiet.mo_ta || null,
        trang_thai: chiTiet.trang_thai || (chiTiet.is_active ? 'hoat_dong' : 'vo_hieu_hoa') || 'hoat_dong',
        so_tai_khoan: chiTiet.so_tai_khoan || null,
        ngan_hang: chiTiet.ngan_hang || null,
        chu_tai_khoan: chiTiet.chu_tai_khoan || null,
      })
    }
  }, [chiTiet, reset])

  const onSubmit = async (data: TaiKhoanFormData) => {
    try {
      const formData: TaiKhoanInsert | TaiKhoanUpdate = {
        ten_tai_khoan: data.ten_tai_khoan,
        loai_tai_khoan: data.loai_tai_khoan,
        don_vi: data.don_vi,
        so_du_dau: data.so_du_dau ?? 0,
        ghi_chu: data.ghi_chu || null,
        trang_thai: data.trang_thai || 'hoat_dong',
        so_tai_khoan: data.so_tai_khoan || null,
        ngan_hang: data.ngan_hang || null,
        chu_tai_khoan: data.chu_tai_khoan || null,
      }

      if (editId) {
        await capNhat.mutateAsync({ id: editId, data: formData as TaiKhoanUpdate })
      } else {
        await taoMoi.mutateAsync({
          ...(formData as TaiKhoanInsert),
          nguoi_tao_id: nguoiDung?.id ? Number(nguoiDung.id) : null,
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
  const fieldGroups = [
    {
      title: 'Thông tin cơ bản',
      fields: [
        {
          key: 'ten_tai_khoan',
          label: 'Tên tài khoản',
          type: 'text',
          placeholder: 'Nhập tên tài khoản',
          required: true,
          span: 3 as const,
        },
        {
          key: 'loai_tai_khoan',
          label: 'Loại tài khoản',
          type: 'custom',
          required: true,
          render: () => (
            <ToggleGroup
              value={watch('loai_tai_khoan') || ''}
              onValueChange={(value) => setValue('loai_tai_khoan', value, { shouldValidate: true })}
              options={LOAI_TAI_KHOAN.map((loai) => ({ value: loai.value, label: loai.label }))}
            />
          ),
        },
        {
          key: 'don_vi',
          label: 'Đơn vị',
          type: 'custom',
          required: true,
          render: () => (
            <ToggleGroup
              value={watch('don_vi') || 'VND'}
              onValueChange={(value) => setValue('don_vi', value, { shouldValidate: true })}
              options={LOAI_TIEN.map((tien) => ({ value: tien.value, label: tien.label }))}
            />
          ),
        },
        {
          key: 'so_du_dau',
          label: 'Số dư đầu',
          type: 'number-formatted',
          placeholder: '0',
          allowDecimals: false,
        },
        {
          key: 'trang_thai',
          label: 'Trạng thái',
          type: 'select',
          options: [
            { value: 'hoat_dong', label: 'Hoạt động' },
            { value: 'vo_hieu_hoa', label: 'Vô hiệu hóa' },
          ],
        },
      ],
    },
    ...(showNganHangInfo
      ? [
          {
            title: 'Thông tin ngân hàng',
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
                type: 'custom',
                render: () => (
                  <AutocompleteInput
                    options={nganHangOptions}
                    value={nganHang || ''}
                    onChange={(value) => setValue('ngan_hang', value as string, { shouldValidate: true })}
                    placeholder="Tìm kiếm ngân hàng..."
                    onSearch={(searchTerm) => {
                      setNganHangSearchTerm(searchTerm)
                    }}
                  />
                ),
              },
              {
                key: 'chu_tai_khoan',
                label: 'Chủ tài khoản',
                type: 'text',
                placeholder: 'Nhập tên chủ tài khoản',
              },
              {
                key: 'qr_code',
                label: 'Mã QR VietQR',
                type: 'custom',
                span: 3 as const,
                render: () => (
                  <VietQRCode
                    soTaiKhoan={soTaiKhoan || null}
                    nganHang={nganHang || null}
                    chuTaiKhoan={chuTaiKhoan || null}
                  />
                ),
              },
            ],
          },
        ]
      : []),
    {
      title: 'Ghi chú',
      fields: [
        {
          key: 'ghi_chu',
          label: 'Ghi chú',
          type: 'textarea',
          placeholder: 'Nhập ghi chú (tùy chọn)',
          span: 3 as const,
        },
      ],
    },
  ] as FormFieldGroup<TaiKhoanFormData>[]

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

