import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useDanhMucById, useCreateDanhMuc, useUpdateDanhMuc, useDanhMucList } from '../hooks/use-danh-muc'
import type { DanhMucInsert, DanhMucUpdate } from '@/types/danh-muc'
import { GenericFormView } from '@/shared/components/generic/generic-form-view'
import type { FormFieldGroup } from '@/shared/components/generic/generic-form-view'
import { LOAI_DANH_MUC } from '../config'
import { useAuthStore } from '@/store/auth-store'

// Schema validation
const danhMucSchema = z.object({
  ten: z.string().min(1, 'Tên danh mục là bắt buộc').max(255, 'Tên danh mục quá dài'),
  loai: z.string().min(1, 'Loại danh mục là bắt buộc'),
  parent_id: z.string().optional().nullable(),
  mo_ta: z.string().max(1000, 'Mô tả quá dài').optional().nullable(),
  thu_tu: z.number().nullable().optional(),
  is_active: z.string().optional().nullable(),
})

type DanhMucFormData = z.infer<typeof danhMucSchema>

interface DanhMucFormViewProps {
  editId?: string | null
  onComplete: () => void
  onCancel: () => void
  mode?: 'modal' | 'page'
}

/**
 * DanhMucFormView component - Sử dụng GenericFormView
 */
export function DanhMucFormView({
  editId,
  onComplete,
  onCancel,
}: DanhMucFormViewProps) {
  const { data: chiTiet, isLoading: dangTaiChiTiet } = useDanhMucById(editId || null)
  const { data: danhSachDanhMuc } = useDanhMucList()
  const taoMoi = useCreateDanhMuc()
  const capNhat = useUpdateDanhMuc()
  const { nguoiDung } = useAuthStore()

  const form = useForm<DanhMucFormData>({
    resolver: zodResolver(danhMucSchema),
    defaultValues: {
      ten: '',
      loai: '',
      parent_id: '',
      mo_ta: null,
      thu_tu: 0,
      is_active: 'true',
    },
  })

  const {
    formState: { isSubmitting },
    reset,
    watch,
  } = form

  const selectedLoai = watch('loai')

  // Load dữ liệu khi chỉnh sửa
  useEffect(() => {
    if (chiTiet) {
      reset({
        ten: chiTiet.ten,
        loai: chiTiet.loai,
        parent_id: chiTiet.parent_id || '',
        mo_ta: chiTiet.mo_ta || null,
        thu_tu: chiTiet.thu_tu ?? 0,
        is_active: chiTiet.is_active ? 'true' : 'false',
      })
    }
  }, [chiTiet, reset])

  const onSubmit = async (data: DanhMucFormData) => {
    try {
      const formData: DanhMucInsert | DanhMucUpdate = {
        ten: data.ten,
        loai: data.loai,
        parent_id: data.parent_id && data.parent_id !== '' ? data.parent_id : null,
        mo_ta: data.mo_ta || null,
        thu_tu: data.thu_tu ?? 0,
        is_active: data.is_active === 'true' ? true : data.is_active === 'false' ? false : true,
      }

      if (editId) {
        await capNhat.mutateAsync({ id: editId, data: formData as DanhMucUpdate })
      } else {
        await taoMoi.mutateAsync({
          ...(formData as DanhMucInsert),
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

  const title = editId ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'
  const isLoading = isSubmitting || taoMoi.isPending || capNhat.isPending

  // Lọc danh mục cha: chỉ hiển thị danh mục cùng loại và không phải chính nó (khi edit)
  const danhMucChaOptions = (danhSachDanhMuc || [])
    .filter((dm) => {
      // Cùng loại
      if (selectedLoai && dm.loai !== selectedLoai) return false
      // Không phải chính nó khi edit
      if (editId && dm.id === editId) return false
      // Không phải danh mục con của chính nó (tránh vòng lặp)
      if (editId) {
        let current = danhSachDanhMuc?.find((d) => d.id === editId)
        while (current?.parent_id) {
          if (current.parent_id === dm.id) return false
          current = danhSachDanhMuc?.find((d) => d.id === current?.parent_id)
        }
      }
      return true
    })
    .map((dm) => ({
      value: dm.id,
      label: dm.ten + (dm.parent_ten ? ` (${dm.parent_ten})` : ''),
    }))

  // Định nghĩa các nhóm fields
  const fieldGroups: FormFieldGroup<DanhMucFormData>[] = [
    {
      title: 'Thông tin cơ bản',
      fields: [
        {
          key: 'ten',
          label: 'Tên danh mục',
          type: 'text',
          placeholder: 'Nhập tên danh mục',
          required: true,
          span: 3,
        },
        {
          key: 'loai',
          label: 'Loại danh mục',
          type: 'select',
          required: true,
          options: LOAI_DANH_MUC.map((loai) => ({ value: loai.value, label: loai.label })),
        },
        {
          key: 'parent_id',
          label: 'Danh mục cha',
          type: 'select',
          options: [
            { value: '', label: '-- Không có --' },
            ...danhMucChaOptions,
          ],
          helperText: 'Chọn danh mục cha (nếu có). Chỉ hiển thị danh mục cùng loại.',
        },
        {
          key: 'thu_tu',
          label: 'Thứ tự',
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
      <GenericFormView<DanhMucFormData>
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

