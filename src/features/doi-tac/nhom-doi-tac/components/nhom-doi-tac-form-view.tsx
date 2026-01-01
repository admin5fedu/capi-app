import { useEffect } from 'react'
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

  const form = useForm<NhomDoiTacFormData>({
    resolver: zodResolver(nhomDoiTacSchema),
    defaultValues: {
      ten_nhom: '',
      hang_muc: defaultLoai || 'nha_cung_cap',
      mo_ta: null,
      nguoi_tao_id: nguoiDung?.id ? Number(nguoiDung.id) : null,
    },
    mode: 'onChange', // Validate khi thay đổi để hiển thị lỗi sớm
  })

  const {
    formState: { isSubmitting },
    reset,
  } = form

  // Load dữ liệu khi chỉnh sửa
  useEffect(() => {
    if (chiTiet) {
      reset({
        ten_nhom: chiTiet.ten_nhom || '',
        hang_muc: (chiTiet.hang_muc as LoaiDoiTac) || 'nha_cung_cap',
        mo_ta: chiTiet.mo_ta || null,
        nguoi_tao_id: chiTiet.nguoi_tao_id ? Number(chiTiet.nguoi_tao_id) : null,
      }, { keepDefaultValues: false })
    }
  }, [chiTiet, reset])

  // Cập nhật hang_muc và nguoi_tao_id khi defaultLoai hoặc nguoiDung thay đổi (chỉ khi thêm mới)
  useEffect(() => {
    if (!editId && !chiTiet) {
      form.setValue('hang_muc', defaultLoai || 'nha_cung_cap')
      if (nguoiDung?.id) {
        form.setValue('nguoi_tao_id', Number(nguoiDung.id))
      }
    }
  }, [defaultLoai, nguoiDung, editId, chiTiet, form])

  // Đồng bộ nguoi_tao_id khi user thay đổi (chỉ khi thêm mới)
  useEffect(() => {
    if (!editId && nguoiDung?.id) {
      form.setValue('nguoi_tao_id', Number(nguoiDung.id))
    }
  }, [nguoiDung, editId, form])

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

  if (editId && dangTaiChiTiet) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">Đang tải dữ liệu...</div>
      </div>
    )
  }

  const title = editId ? 'Chỉnh sửa nhóm đối tác' : 'Thêm nhóm đối tác mới'
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

