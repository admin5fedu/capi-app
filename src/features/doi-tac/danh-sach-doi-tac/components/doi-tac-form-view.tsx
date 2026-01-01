import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useDoiTacById, useCreateDoiTac, useUpdateDoiTac } from '../hooks/use-doi-tac'
import { useAuthStore } from '@/store/auth-store'
import { useNhomDoiTacList } from '@/features/doi-tac/nhom-doi-tac/hooks'
import type { DoiTacInsert, DoiTacUpdate, LoaiDoiTac } from '@/types/doi-tac'
import { GenericFormView } from '@/shared/components/generic/generic-form-view'
import type { FormFieldGroup } from '@/shared/components/generic/generic-form-view'
import { LOAI_DOI_TAC } from '../config'

// Schema validation
const doiTacSchema = z.object({
  ten_doi_tac: z.string().min(1, 'Tên đối tác là bắt buộc').max(255, 'Tên đối tác quá dài'),
  hang_muc: z.enum(['nha_cung_cap', 'khach_hang'], {
    required_error: 'Loại đối tác là bắt buộc',
  }),
  nhom_doi_tac_id: z.preprocess(
    (val) => val === '' ? null : (typeof val === 'string' ? Number(val) : val),
    z.number().nullable().optional()
  ),
  cong_ty: z.preprocess(
    (val) => val === '' ? null : val,
    z.string().max(255, 'Tên công ty quá dài').nullable().optional()
  ),
  email: z.preprocess(
    (val) => val === '' ? null : val,
    z.string().email('Email không hợp lệ').nullable().optional()
  ),
  so_dien_thoai: z.preprocess(
    (val) => val === '' ? null : val,
    z.string().max(20, 'Số điện thoại quá dài').nullable().optional()
  ),
  dia_chi: z.preprocess(
    (val) => val === '' ? null : val,
    z.string().max(500, 'Địa chỉ quá dài').nullable().optional()
  ),
  thong_tin_khac: z.preprocess(
    (val) => val === '' ? null : val,
    z.string().max(1000, 'Thông tin khác quá dài').nullable().optional()
  ),
  nguoi_tao_id: z.preprocess(
    (val) => val === '' ? null : (typeof val === 'string' ? Number(val) : val),
    z.number().nullable().optional()
  ),
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
  // Lấy danh sách nhóm đối tác theo loại (nếu có defaultLoai) hoặc tất cả (nếu không có)
  const { data: danhSachNhomDoiTac } = useNhomDoiTacList(defaultLoai || undefined)

  const form = useForm<DoiTacFormData>({
    resolver: zodResolver(doiTacSchema),
    defaultValues: {
      ten_doi_tac: '',
      hang_muc: defaultLoai || 'nha_cung_cap',
      nhom_doi_tac_id: null,
      cong_ty: null,
      email: null,
      so_dien_thoai: null,
      dia_chi: null,
      thong_tin_khac: null,
      nguoi_tao_id: nguoiDung?.id ? Number(nguoiDung.id) : null,
    },
    mode: 'onChange',
  })

  const {
    formState: { isSubmitting },
    reset,
  } = form

  // Load dữ liệu khi chỉnh sửa
  useEffect(() => {
    if (chiTiet) {
      reset({
        ten_doi_tac: chiTiet.ten_doi_tac || '',
        hang_muc: (chiTiet.hang_muc as LoaiDoiTac) || 'nha_cung_cap',
        nhom_doi_tac_id: chiTiet.nhom_doi_tac_id ? Number(chiTiet.nhom_doi_tac_id) : null,
        cong_ty: chiTiet.cong_ty || null,
        email: chiTiet.email || null,
        so_dien_thoai: chiTiet.so_dien_thoai || null,
        dia_chi: chiTiet.dia_chi || null,
        thong_tin_khac: chiTiet.thong_tin_khac || null,
        nguoi_tao_id: chiTiet.nguoi_tao_id ? Number(chiTiet.nguoi_tao_id) : null,
      }, { keepDefaultValues: false })
    }
  }, [chiTiet, reset])

  // Cập nhật hang_muc và nguoi_tao_id khi defaultLoai hoặc nguoiDung thay đổi (chỉ khi thêm mới)
  useEffect(() => {
    if (!editId && !chiTiet) {
      if (defaultLoai) {
        form.setValue('hang_muc', defaultLoai)
      }
      if (nguoiDung?.id) {
        form.setValue('nguoi_tao_id', Number(nguoiDung.id))
      }
    }
  }, [defaultLoai, nguoiDung, editId, chiTiet, form])


  const onSubmit = async (data: DoiTacFormData) => {
    try {
      const formData: DoiTacInsert | DoiTacUpdate = {
        ten_doi_tac: data.ten_doi_tac,
        hang_muc: data.hang_muc,
        nhom_doi_tac_id: data.nhom_doi_tac_id || null,
        cong_ty: data.cong_ty || null,
        email: data.email || null,
        so_dien_thoai: data.so_dien_thoai || null,
        dia_chi: data.dia_chi || null,
        thong_tin_khac: data.thong_tin_khac || null,
        // Tự động set người tạo từ user hiện tại (chỉ khi thêm mới)
        nguoi_tao_id: editId ? data.nguoi_tao_id : (nguoiDung?.id ? Number(nguoiDung.id) : null),
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
          key: 'ten_doi_tac',
          label: 'Tên đối tác',
          type: 'text',
          placeholder: 'Nhập tên đối tác',
          required: true,
          span: 2,
        },
        {
          key: 'cong_ty',
          label: 'Công ty',
          type: 'text',
          placeholder: 'Nhập tên công ty',
          span: 1,
        },
        // Chỉ hiện field loại khi chỉnh sửa (để có thể đổi loại) hoặc khi không có defaultLoai
        ...(editId || !defaultLoai
          ? [
              {
                key: 'hang_muc' as const,
                label: 'Loại đối tác',
                type: 'select' as const,
                required: true,
                options: LOAI_DOI_TAC.map((loai) => ({ value: loai.value, label: loai.label })),
                span: 1,
              },
            ]
          : []),
        {
          key: 'nhom_doi_tac_id',
          label: 'Nhóm đối tác',
          type: 'select',
          required: false,
          options: danhSachNhomDoiTac?.map((nhom: any) => ({
            value: nhom.id,
            label: nhom.ten_nhom || nhom.ten || String(nhom.id),
          })) || [],
          placeholder: 'Chọn nhóm đối tác (tùy chọn)',
          span: 1,
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
          key: 'so_dien_thoai',
          label: 'Số điện thoại',
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
          key: 'thong_tin_khac',
          label: 'Thông tin khác',
          type: 'textarea',
          placeholder: 'Nhập thông tin khác (tùy chọn)',
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

