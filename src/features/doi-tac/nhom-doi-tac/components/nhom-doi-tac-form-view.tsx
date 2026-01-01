import { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNhomDoiTacById, useCreateNhomDoiTac, useUpdateNhomDoiTac } from '../hooks/use-nhom-doi-tac'
import { useAuthStore } from '@/store/auth-store'
import type { NhomDoiTacInsert, NhomDoiTacUpdate, LoaiDoiTac } from '@/types/nhom-doi-tac'
import { GenericFormView } from '@/shared/components/generic/generic-form-view'
import type { FormFieldGroup } from '@/shared/components/generic/generic-form-view'
import { LOAI_DOI_TAC } from '../config'

// Schema validation
const nhomDoiTacSchema = z.object({
  ten_nhom: z.string().min(1, 'Tên nhóm là bắt buộc').max(255, 'Tên nhóm quá dài'),
  hang_muc: z.enum(['nha_cung_cap', 'khach_hang'], {
    required_error: 'Loại đối tác là bắt buộc',
  }),
  mo_ta: z.preprocess(
    (val) => val === '' ? null : val,
    z.string().max(1000, 'Mô tả quá dài').nullable().optional()
  ),
  nguoi_tao_id: z.preprocess(
    (val) => val === '' ? null : val,
    z.number().nullable().optional()
  ),
})

type NhomDoiTacFormData = z.infer<typeof nhomDoiTacSchema>

interface NhomDoiTacFormViewProps {
  editId?: string | null
  onComplete: () => void
  onCancel: () => void
  mode?: 'modal' | 'page'
  defaultLoai?: LoaiDoiTac // Loại mặc định khi thêm mới (từ tab hiện tại)
}

/**
 * NhomDoiTacFormView component - Sử dụng GenericFormView
 */
export function NhomDoiTacFormView({
  editId,
  onComplete,
  onCancel,
  defaultLoai,
}: NhomDoiTacFormViewProps) {
  const { data: chiTiet, isLoading: dangTaiChiTiet } = useNhomDoiTacById(editId || null)
  const { nguoiDung } = useAuthStore()
  const taoMoi = useCreateNhomDoiTac()
  const capNhat = useUpdateNhomDoiTac()

  // Use chiTiet data as defaultValues if available (for edit mode)
  // Memoize to prevent unnecessary recalculations
  // IMPORTANT: All hooks must be called before any early returns
  const defaultValues = useMemo(() => {
    // If editing and chiTiet is available, use it
    if (editId && chiTiet && chiTiet.id?.toString() === editId.toString()) {
      return {
        ten_nhom: String(chiTiet.ten_nhom || ''),
        hang_muc: (chiTiet.hang_muc as LoaiDoiTac) || 'nha_cung_cap',
        mo_ta: chiTiet.mo_ta || null,
        nguoi_tao_id: chiTiet.nguoi_tao_id ? Number(chiTiet.nguoi_tao_id) : null,
      }
    }
    // For new mode or when chiTiet is not yet loaded
    return {
      ten_nhom: '',
      hang_muc: (defaultLoai as LoaiDoiTac) || 'nha_cung_cap',
      mo_ta: null,
      nguoi_tao_id: nguoiDung?.id ? Number(nguoiDung.id) : null,
    }
  }, [chiTiet, editId, defaultLoai, nguoiDung])

  const form = useForm<NhomDoiTacFormData>({
    resolver: zodResolver(nhomDoiTacSchema),
    defaultValues,
  })

  const {
    formState: { isSubmitting },
    reset,
  } = form

  // Load dữ liệu khi chỉnh sửa - CHỈ chạy khi có chiTiet và editId
  useEffect(() => {
    if (editId && chiTiet && chiTiet.id?.toString() === editId.toString()) {
      reset({
        ten_nhom: String(chiTiet.ten_nhom || ''),
        hang_muc: (chiTiet.hang_muc as LoaiDoiTac) || 'nha_cung_cap',
        mo_ta: chiTiet.mo_ta || null,
        nguoi_tao_id: chiTiet.nguoi_tao_id ? Number(chiTiet.nguoi_tao_id) : null,
      }, { keepDefaultValues: false })
    }
  }, [chiTiet, editId, reset])

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
        <div className="text-destructive">Không tìm thấy dữ liệu nhóm đối tác</div>
      </div>
    )
  }

  const onSubmit = async (data: NhomDoiTacFormData) => {
    try {
      const formData: NhomDoiTacInsert | NhomDoiTacUpdate = {
        ten_nhom: data.ten_nhom,
        hang_muc: data.hang_muc,
        mo_ta: data.mo_ta || null,
        // Tự động set người tạo từ user hiện tại (chỉ khi thêm mới)
        nguoi_tao_id: editId ? data.nguoi_tao_id : (nguoiDung?.id ? Number(nguoiDung.id) : null),
      }

      if (editId) {
        await capNhat.mutateAsync({ id: editId, data: formData as NhomDoiTacUpdate })
      } else {
        await taoMoi.mutateAsync(formData as NhomDoiTacInsert)
      }

      onComplete()
    } catch (error) {
      console.error('Error:', error)
    }
  }

  // Xác định loại đối tác từ defaultLoai, form data, hoặc chiTiet
  const formHangMuc = form.watch('hang_muc') as LoaiDoiTac | undefined
  const loaiDoiTac = defaultLoai || formHangMuc || (chiTiet?.hang_muc as LoaiDoiTac) || 'nha_cung_cap'
  const loaiLabel = LOAI_DOI_TAC.find(l => l.value === loaiDoiTac)?.label || 'Đối tác'
  
  const title = editId 
    ? `Chỉnh sửa nhóm ${loaiLabel.toLowerCase()}` 
    : `Thêm nhóm ${loaiLabel.toLowerCase()} mới`
  const isLoading = isSubmitting || taoMoi.isPending || capNhat.isPending

  // Định nghĩa các nhóm fields
  const fieldGroups: FormFieldGroup<NhomDoiTacFormData>[] = [
    {
      title: 'Thông tin cơ bản',
      fields: [
        {
          key: 'ten_nhom',
          label: 'Tên nhóm',
          type: 'text',
          placeholder: 'Nhập tên nhóm đối tác',
          required: true,
          span: 3,
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
              },
            ]
          : []),
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
      <GenericFormView<NhomDoiTacFormData>
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

