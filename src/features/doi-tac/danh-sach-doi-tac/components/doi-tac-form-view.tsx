import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useDoiTacById, useCreateDoiTac, useUpdateDoiTac } from '../hooks/use-doi-tac'
import { useAuthStore } from '@/store/auth-store'
import { useNhomDoiTacList } from '@/features/doi-tac/nhom-doi-tac'
import type { DoiTacInsert, DoiTacUpdate, LoaiDoiTac } from '@/types/doi-tac'
import { GenericFormView } from '@/shared/components/generic/generic-form-view'
import type { FormFieldGroup } from '@/shared/components/generic/generic-form-view'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { LOAI_DOI_TAC } from '../config'

// Schema validation
const doiTacSchema = z.object({
  ma: z.string().min(1, 'Mã đối tác là bắt buộc').max(50, 'Mã đối tác quá dài'),
  ten: z.string().min(1, 'Tên đối tác là bắt buộc').max(255, 'Tên đối tác quá dài'),
  loai: z.enum(['nha_cung_cap', 'khach_hang'], {
    required_error: 'Loại đối tác là bắt buộc',
  }),
  nhom_doi_tac_id: z.string().optional().nullable(),
  email: z.string().email('Email không hợp lệ').optional().nullable().or(z.literal('')),
  dien_thoai: z.string().max(20, 'Số điện thoại quá dài').optional().nullable().or(z.literal('')),
  dia_chi: z.string().max(500, 'Địa chỉ quá dài').optional().nullable().or(z.literal('')),
  ma_so_thue: z.string().max(20, 'Mã số thuế quá dài').optional().nullable().or(z.literal('')),
  nguoi_lien_he: z.string().max(255, 'Tên người liên hệ quá dài').optional().nullable().or(z.literal('')),
  ghi_chu: z.string().max(1000, 'Ghi chú quá dài').optional().nullable().or(z.literal('')),
  trang_thai: z.boolean({
    required_error: 'Trạng thái là bắt buộc',
  }),
  nguoi_tao_id: z.string().optional().nullable(),
})

type DoiTacFormData = z.infer<typeof doiTacSchema>

interface DoiTacFormViewProps {
  editId?: string | null
  onComplete: () => void
  onCancel: () => void
  mode?: 'modal' | 'page'
  defaultLoai?: LoaiDoiTac // Loại mặc định khi thêm mới (từ tab hiện tại)
}

/**
 * DoiTacFormView component - Sử dụng GenericFormView
 */
export function DoiTacFormView({
  editId,
  onComplete,
  onCancel,
  defaultLoai,
}: DoiTacFormViewProps) {
  const { data: chiTiet, isLoading: dangTaiChiTiet } = useDoiTacById(editId || null)
  const { nguoiDung } = useAuthStore()
  const taoMoi = useCreateDoiTac()
  const capNhat = useUpdateDoiTac()
  const { data: danhSachNhomDoiTac } = useNhomDoiTacList(defaultLoai || chiTiet?.loai)

  const form = useForm<DoiTacFormData>({
    resolver: zodResolver(doiTacSchema),
    defaultValues: {
      ma: '',
      ten: '',
      loai: defaultLoai || 'nha_cung_cap',
      nhom_doi_tac_id: null,
      email: null,
      dien_thoai: null,
      dia_chi: null,
      ma_so_thue: null,
      nguoi_lien_he: null,
      ghi_chu: null,
      trang_thai: true,
      nguoi_tao_id: nguoiDung?.id || null,
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
        ma: chiTiet.ma,
        ten: chiTiet.ten,
        loai: chiTiet.loai,
        nhom_doi_tac_id: chiTiet.nhom_doi_tac_id || null,
        email: chiTiet.email || null,
        dien_thoai: chiTiet.dien_thoai || null,
        dia_chi: chiTiet.dia_chi || null,
        ma_so_thue: chiTiet.ma_so_thue || null,
        nguoi_lien_he: chiTiet.nguoi_lien_he || null,
        ghi_chu: chiTiet.ghi_chu || null,
        trang_thai: chiTiet.trang_thai,
        nguoi_tao_id: chiTiet.nguoi_tao_id || null,
      })
    } else if (defaultLoai && !editId) {
      // Khi thêm mới, set loại từ defaultLoai và người tạo từ user hiện tại
      reset({
        ma: '',
        ten: '',
        loai: defaultLoai,
        nhom_doi_tac_id: null,
        email: null,
        dien_thoai: null,
        dia_chi: null,
        ma_so_thue: null,
        nguoi_lien_he: null,
        ghi_chu: null,
        trang_thai: true,
        nguoi_tao_id: nguoiDung?.id || null,
      })
    }
  }, [chiTiet, defaultLoai, editId, reset, nguoiDung])

  // Đồng bộ nguoi_tao_id khi user thay đổi (chỉ khi thêm mới)
  useEffect(() => {
    if (!editId && nguoiDung?.id) {
      form.setValue('nguoi_tao_id', nguoiDung.id)
    }
  }, [nguoiDung, editId, form])

  const onSubmit = async (data: DoiTacFormData) => {
    try {
      const formData: DoiTacInsert | DoiTacUpdate = {
        ma: data.ma,
        ten: data.ten,
        loai: data.loai,
        nhom_doi_tac_id: data.nhom_doi_tac_id || null,
        email: data.email || null,
        dien_thoai: data.dien_thoai || null,
        dia_chi: data.dia_chi || null,
        ma_so_thue: data.ma_so_thue || null,
        nguoi_lien_he: data.nguoi_lien_he || null,
        ghi_chu: data.ghi_chu || null,
        trang_thai: data.trang_thai,
        // Tự động set người tạo từ user hiện tại (chỉ khi thêm mới)
        nguoi_tao_id: editId ? data.nguoi_tao_id : (nguoiDung?.id || null),
      }

      if (editId) {
        await capNhat.mutateAsync({ id: editId, data: formData as DoiTacUpdate })
      } else {
        await taoMoi.mutateAsync(formData as DoiTacInsert)
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

  const title = editId ? 'Chỉnh sửa đối tác' : 'Thêm đối tác mới'
  const isLoading = isSubmitting || taoMoi.isPending || capNhat.isPending

  // Định nghĩa các nhóm fields
  const fieldGroups: FormFieldGroup<DoiTacFormData>[] = [
    {
      title: 'Thông tin cơ bản',
      fields: [
        {
          key: 'ma',
          label: 'Mã đối tác',
          type: 'text',
          placeholder: 'Nhập mã đối tác',
          required: true,
          span: 1,
        },
        {
          key: 'ten',
          label: 'Tên đối tác',
          type: 'text',
          placeholder: 'Nhập tên đối tác',
          required: true,
          span: 2,
        },
        // Chỉ hiện field loại khi chỉnh sửa (để có thể đổi loại) hoặc khi không có defaultLoai
        ...(editId || !defaultLoai
          ? [
              {
                key: 'loai' as const,
                label: 'Loại đối tác',
                type: 'select' as const,
                required: true,
                options: LOAI_DOI_TAC.map((loai) => ({ value: loai.value, label: loai.label })),
              },
            ]
          : []),
        {
          key: 'nhom_doi_tac_id',
          label: 'Nhóm đối tác',
          type: 'select',
          required: false,
          options: danhSachNhomDoiTac?.map((nhom) => ({
            value: nhom.id,
            label: nhom.ten,
          })) || [],
          placeholder: 'Chọn nhóm đối tác (tùy chọn)',
        },
        {
          key: 'trang_thai',
          label: 'Trạng thái',
          type: 'custom',
          required: true,
          render: (form) => {
            const { watch, setValue } = form
            const checked = watch('trang_thai')
            return (
              <div className="flex items-center space-x-2">
                <Switch
                  checked={checked}
                  onCheckedChange={(value) => setValue('trang_thai', value)}
                />
                <Label htmlFor="trang_thai" className="font-normal cursor-pointer">
                  {checked ? 'Hoạt động' : 'Vô hiệu hóa'}
                </Label>
              </div>
            )
          },
        },
      ],
    },
    {
      title: 'Thông tin liên hệ',
      fields: [
        {
          key: 'email',
          label: 'Email',
          type: 'email',
          placeholder: 'email@example.com',
          span: 2,
        },
        {
          key: 'dien_thoai',
          label: 'Điện thoại',
          type: 'text',
          placeholder: '0912345678',
          span: 1,
        },
        {
          key: 'dia_chi',
          label: 'Địa chỉ',
          type: 'textarea',
          placeholder: 'Nhập địa chỉ',
          span: 3,
        },
      ],
    },
    {
      title: 'Thông tin khác',
      fields: [
        {
          key: 'ma_so_thue',
          label: 'Mã số thuế',
          type: 'text',
          placeholder: 'Nhập mã số thuế',
          span: 1,
        },
        {
          key: 'nguoi_lien_he',
          label: 'Người liên hệ',
          type: 'text',
          placeholder: 'Nhập tên người liên hệ',
          span: 2,
        },
        {
          key: 'ghi_chu',
          label: 'Ghi chú',
          type: 'textarea',
          placeholder: 'Nhập ghi chú (tùy chọn)',
          span: 3,
        },
      ],
    },
  ]

  return (
    <div className="bg-card border rounded-lg overflow-hidden flex-1 flex flex-col min-h-0">
      <GenericFormView<DoiTacFormData>
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

