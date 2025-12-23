import { useEffect, useMemo, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useDanhMucById, useCreateDanhMuc, useUpdateDanhMuc, useDanhMucList } from '../hooks/use-danh-muc'
import type { DanhMucInsert, DanhMucUpdate } from '@/types/danh-muc'
import { GenericFormView } from '@/shared/components/generic/generic-form-view'
import type { FormFieldGroup } from '@/shared/components/generic/generic-form-view'
import { LOAI_DANH_MUC } from '../config'
import { useAuthStore } from '@/store/auth-store'
import { isLevel1, isLevel2, getLevel1Items } from '../utils/danh-muc-helpers'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

// Schema validation
const danhMucSchema = z.object({
  ten: z.string().min(1, 'Tên danh mục là bắt buộc').max(255, 'Tên danh mục quá dài'),
  loai: z.string().min(1, 'Loại danh mục là bắt buộc'),
  parent_id: z.string().optional().nullable(),
  mo_ta: z.string().max(1000, 'Mô tả quá dài').optional().nullable(),
  thu_tu: z.number().int().min(0, 'Thứ tự phải >= 0'),
  is_active: z.string().min(1, 'Trạng thái là bắt buộc'),
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
  const location = useLocation()
  const { data: chiTiet, isLoading: dangTaiChiTiet } = useDanhMucById(editId || null)
  const { data: danhSachDanhMuc } = useDanhMucList()
  const taoMoi = useCreateDanhMuc()
  const capNhat = useUpdateDanhMuc()
  const { nguoiDung } = useAuthStore()

  // Lấy initialData từ location.state (khi thêm danh mục con)
  const initialData = (location.state as any)?.initialData

  const form = useForm<DanhMucFormData>({
    resolver: zodResolver(danhMucSchema),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
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
  
  // Tính toán thứ tự tự động dựa trên loại đã chọn
  const autoThuTu = useMemo(() => {
    if (!selectedLoai || !danhSachDanhMuc) return 0
    
    // Lấy tất cả danh mục cùng loại
    const sameLoaiItems = danhSachDanhMuc.filter((dm) => dm.loai === selectedLoai)
    
    // Tìm max thu_tu
    const maxThuTu = sameLoaiItems.reduce((max, dm) => {
      return Math.max(max, dm.thu_tu ?? 0)
    }, 0)
    
    return maxThuTu + 1
  }, [selectedLoai, danhSachDanhMuc])

  // Kiểm tra danh mục hiện tại là cấp mấy
  const currentLevel = useMemo(() => {
    if (!chiTiet) return null
    return isLevel1(chiTiet) ? 1 : isLevel2(chiTiet) ? 2 : null
  }, [chiTiet])

  // Khi edit cấp 2, không cho phép đổi parent
  const isEditLevel2 = currentLevel === 2
  
  // Khi thêm danh mục con (có initialData), không cho phép đổi parent
  const isAddingChild = !editId && !!initialData?.parent_id

  // Flag để đảm bảo reset initialData chỉ chạy một lần
  const hasInitializedFromInitialData = useRef(false)

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

  // Load dữ liệu khi có initialData (thêm danh mục con) - chỉ chạy một lần
  useEffect(() => {
    if (initialData && !editId && !chiTiet && !hasInitializedFromInitialData.current) {
      // Đợi danhSachDanhMuc load xong để đảm bảo parent_id có trong options
      if (danhSachDanhMuc && initialData.loai) {
        // Tính lại autoThuTu cho loại này
        const sameLoaiItems = danhSachDanhMuc.filter((dm) => dm.loai === initialData.loai)
        const maxThuTu = sameLoaiItems.reduce((max, dm) => Math.max(max, dm.thu_tu ?? 0), 0)
        const calculatedThuTu = maxThuTu + 1
        
        reset({
          ten: '',
          loai: initialData.loai || '',
          parent_id: initialData.parent_id || '',
          mo_ta: null,
          thu_tu: calculatedThuTu,
          is_active: 'true',
        })
        
        hasInitializedFromInitialData.current = true
      }
    }
  }, [initialData, editId, chiTiet, reset, danhSachDanhMuc])

  // Reset flag khi editId hoặc chiTiet thay đổi
  useEffect(() => {
    if (editId || chiTiet) {
      hasInitializedFromInitialData.current = false
    }
  }, [editId, chiTiet])
  
  // Tự động cập nhật thứ tự khi loại thay đổi (chỉ khi thêm mới, không phải edit)
  useEffect(() => {
    if (!editId && !chiTiet && selectedLoai && danhSachDanhMuc && autoThuTu > 0) {
      // Luôn tự động điền thứ tự khi chọn loại (vẫn cho phép sửa sau)
      form.setValue('thu_tu', autoThuTu, { shouldValidate: true })
    }
  }, [selectedLoai, autoThuTu, editId, chiTiet, danhSachDanhMuc, form])

  const onSubmit = async (data: DanhMucFormData) => {
    try {
      // Validation: Kiểm tra parent được chọn có phải cấp 1 không
      if (data.parent_id && data.parent_id !== '') {
        const selectedParent = danhSachDanhMuc?.find((dm) => dm.id === data.parent_id)
        if (selectedParent && !isLevel1(selectedParent)) {
          toast.error('Chỉ có thể chọn danh mục cấp 1 làm danh mục cha')
          return
        }
      }

      const formData: DanhMucInsert | DanhMucUpdate = {
        ten: data.ten.trim(), // Trim khi submit để loại bỏ khoảng trắng đầu/cuối
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


  // Lấy tên danh mục cha nếu đang thêm danh mục con
  const parentName = useMemo(() => {
    if (initialData?.parent_id && danhSachDanhMuc) {
      const parent = danhSachDanhMuc.find((dm) => dm.id === initialData.parent_id)
      return parent?.ten
    }
    return null
  }, [initialData, danhSachDanhMuc])

  const title = editId
    ? 'Chỉnh sửa danh mục'
    : isAddingChild && parentName
      ? `Thêm danh mục con cho "${parentName}"`
      : 'Thêm danh mục mới'
  const isLoading = isSubmitting || taoMoi.isPending || capNhat.isPending

  // Lọc danh mục cha: chỉ hiển thị danh mục cấp 1, cùng loại (nếu đã chọn loại)
  const danhMucChaOptions = useMemo(() => {
    if (!danhSachDanhMuc) return []
    
    // Lấy tất cả danh mục cấp 1
    const level1Items = getLevel1Items(danhSachDanhMuc)
    
    // Nếu đã chọn loại, filter theo loại
    const filtered = selectedLoai
      ? level1Items.filter((dm) => dm.loai === selectedLoai)
      : level1Items
    
    // Loại bỏ chính nó nếu đang edit
    const available = chiTiet
      ? filtered.filter((dm) => dm.id !== chiTiet.id)
      : filtered
    
    const options = available.map((dm) => ({
      value: dm.id,
      label: dm.ten,
    }))
    
    // Nếu đang thêm danh mục con và parent_id từ initialData chưa có trong options,
    // thêm nó vào để đảm bảo hiển thị đúng
    if (initialData?.parent_id && !options.find((opt) => opt.value === initialData.parent_id)) {
      const parent = danhSachDanhMuc.find((dm) => dm.id === initialData.parent_id)
      if (parent) {
        options.unshift({
          value: parent.id,
          label: parent.ten,
        })
      }
    }
    
    return options
  }, [selectedLoai, danhSachDanhMuc, chiTiet, initialData])

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
          type: 'custom',
          required: true,
          disabled: isAddingChild, // Disable khi thêm danh mục con
          render: (form) => {
            const { watch, setValue } = form
            const currentLoai = watch('loai')
            
            return (
              <div className="flex gap-2" id="loai" role="group" aria-labelledby="loai-label">
                {LOAI_DANH_MUC.map((loai) => (
                  <Button
                    key={loai.value}
                    type="button"
                    variant={currentLoai === loai.value ? 'default' : 'outline'}
                    onClick={() => setValue('loai', loai.value, { shouldValidate: true })}
                    disabled={isAddingChild || isLoading}
                    className={cn(
                      'flex-1',
                      currentLoai === loai.value && 'bg-primary text-primary-foreground'
                    )}
                  >
                    {loai.label}
                  </Button>
                ))}
              </div>
            )
          },
        },
        {
          key: 'parent_id',
          label: 'Danh mục cha',
          type: 'select',
          options: [
            { value: '', label: '-- Không có (Cấp 1) --' },
            ...danhMucChaOptions,
          ],
          disabled: isEditLevel2 || isAddingChild || !selectedLoai, // Không cho đổi parent khi edit cấp 2, thêm danh mục con, hoặc chưa chọn loại
          helperText: isEditLevel2
            ? 'Không thể thay đổi danh mục cha khi đang chỉnh sửa danh mục cấp 2'
            : isAddingChild
              ? 'Đang thêm danh mục con cho danh mục cha đã chọn'
              : !selectedLoai
                ? 'Vui lòng chọn loại danh mục trước để hiển thị danh mục cha.'
                : undefined,
        },
        {
          key: 'thu_tu',
          label: 'Thứ tự',
          type: 'number',
          placeholder: '0',
          required: true,
        },
        {
          key: 'is_active',
          label: 'Trạng thái',
          type: 'custom',
          required: true,
          render: (form) => {
            const { watch, setValue } = form
            const currentStatus = watch('is_active')
            const isActive = currentStatus === 'true'
            
            return (
              <div className="flex gap-2" id="is_active" role="group" aria-labelledby="is_active-label">
                <Button
                  type="button"
                  variant={isActive ? 'default' : 'outline'}
                  onClick={() => setValue('is_active', 'true', { shouldValidate: true })}
                  disabled={isLoading}
                  className={cn(
                    'flex-1',
                    isActive && 'bg-primary text-primary-foreground'
                  )}
                >
                  Hoạt động
                </Button>
                <Button
                  type="button"
                  variant={!isActive ? 'default' : 'outline'}
                  onClick={() => setValue('is_active', 'false', { shouldValidate: true })}
                  disabled={isLoading}
                  className={cn(
                    'flex-1',
                    !isActive && 'bg-destructive text-destructive-foreground'
                  )}
                >
                  Vô hiệu hóa
                </Button>
              </div>
            )
          },
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


