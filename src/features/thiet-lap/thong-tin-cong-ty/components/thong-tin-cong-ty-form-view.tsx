import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useUpdateThongTinCongTy } from '../hooks'
// import { useThongTinCongTy } from '../hooks' // Unused
import { GenericFormView, FormFieldGroup } from '@/shared/components/generic/generic-form-view'
import { toast } from 'sonner'
import type { ThongTinCongTy } from '@/types/thong-tin-cong-ty'

// Schema validation
const thongTinCongTySchema = z.object({
  ten_app: z.preprocess(
    (val) => val === '' ? null : val,
    z.string().max(255, 'Tên app quá dài').nullable().optional()
  ),
  ten_cong_ty: z.preprocess(
    (val) => val === '' ? null : val,
    z.string().max(255, 'Tên công ty quá dài').nullable().optional()
  ),
  logo: z.preprocess(
    (val) => val === '' ? null : val,
    z.union([
      z.string().nullable().optional(),
      z.instanceof(File).nullable().optional(),
    ])
  ),
  dia_chi: z.preprocess(
    (val) => val === '' ? null : val,
    z.string().max(500, 'Địa chỉ quá dài').nullable().optional()
  ),
  so_dien_thoai: z.preprocess(
    (val) => val === '' ? null : val,
    z.string().max(50, 'Số điện thoại quá dài').nullable().optional()
  ),
  email: z.preprocess(
    (val) => val === '' ? null : val,
    z.union([
      z.string().email('Email không hợp lệ').max(255, 'Email quá dài'),
      z.null(),
    ]).optional()
  ),
  ma_so_thue: z.preprocess(
    (val) => val === '' ? null : val,
    z.string().max(50, 'Mã số thuế quá dài').nullable().optional()
  ),
  thong_tin_khac: z.preprocess(
    (val) => val === '' ? null : val,
    z.string().max(1000, 'Thông tin khác quá dài').nullable().optional()
  ),
})

type ThongTinCongTyFormData = z.infer<typeof thongTinCongTySchema>

interface ThongTinCongTyFormViewProps {
  data: ThongTinCongTy | null
  onComplete: () => void
  onCancel: () => void
}

/**
 * ThongTinCongTyFormView component - Form chỉnh sửa thông tin công ty
 */
export function ThongTinCongTyFormView({
  data,
  onComplete,
  onCancel,
}: ThongTinCongTyFormViewProps) {
  const capNhat = useUpdateThongTinCongTy()

  const form = useForm<ThongTinCongTyFormData>({
    resolver: zodResolver(thongTinCongTySchema),
    defaultValues: {
      ten_app: null,
      ten_cong_ty: null,
      logo: null,
      dia_chi: null,
      so_dien_thoai: null,
      email: null,
      ma_so_thue: null,
      thong_tin_khac: null,
    },
  })

  const {
    formState: { isSubmitting },
    reset,
  } = form

  // Load dữ liệu khi có data
  useEffect(() => {
    if (data) {
      reset({
        ten_app: data.ten_app || null,
        ten_cong_ty: data.ten_cong_ty || null,
        logo: data.logo || null,
        dia_chi: data.dia_chi || null,
        so_dien_thoai: data.so_dien_thoai || null,
        email: data.email || null,
        ma_so_thue: data.ma_so_thue || null,
        thong_tin_khac: data.thong_tin_khac || null,
      }, { keepDefaultValues: false })
    }
  }, [data, reset])

  const [isUploadingLogo, setIsUploadingLogo] = useState(false)

  const onSubmit = async (formData: ThongTinCongTyFormData) => {
    try {
      // Xử lý logo: nếu là File thì convert sang base64, nếu là string thì giữ nguyên, nếu null thì giữ null
      let logoUrl: string | null = null
      if (formData.logo instanceof File) {
        setIsUploadingLogo(true)
        try {
          // Convert File sang base64
          logoUrl = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = () => {
              const result = reader.result as string
              resolve(result)
            }
            reader.onerror = () => {
              reject(new Error('Không thể đọc file logo'))
            }
            reader.readAsDataURL(formData.logo as File)
          })
        } catch (error: any) {
          toast.error(`Lỗi khi xử lý logo: ${error.message || 'Không thể đọc file'}`)
          setIsUploadingLogo(false)
          return
        } finally {
          setIsUploadingLogo(false)
        }
      } else if (typeof formData.logo === 'string' && formData.logo.trim() !== '') {
        logoUrl = formData.logo
      } else {
        // null hoặc empty string
        logoUrl = null
      }

      const updateData = {
        ten_app: formData.ten_app || null,
        ten_cong_ty: formData.ten_cong_ty || null,
        logo: logoUrl,
        dia_chi: formData.dia_chi || null,
        so_dien_thoai: formData.so_dien_thoai || null,
        email: formData.email || null,
        ma_so_thue: formData.ma_so_thue || null,
        thong_tin_khac: formData.thong_tin_khac || null,
      }

      await capNhat.mutateAsync(updateData)
      onComplete()
    } catch (error: any) {
      // Error đã được xử lý trong hook, nhưng log để debug
      console.error('Error submitting form:', error)
    }
  }

  const isLoading = isSubmitting || capNhat.isPending || isUploadingLogo

  // Định nghĩa các nhóm fields
  const fieldGroups: FormFieldGroup<ThongTinCongTyFormData>[] = [
    {
      title: 'Thông tin cơ bản',
      fields: [
        {
          key: 'ten_app',
          label: 'Tên ứng dụng',
          type: 'text',
          placeholder: 'Nhập tên ứng dụng',
        },
        {
          key: 'ten_cong_ty',
          label: 'Tên công ty',
          type: 'text',
          placeholder: 'Nhập tên công ty',
        },
        {
          key: 'logo',
          label: 'Logo',
          type: 'file-upload',
          accept: 'image/*',
          maxSize: 5,
          span: 3,
          helperText: 'Chọn file ảnh logo (JPG, PNG, GIF)',
        },
      ],
    },
    {
      title: 'Thông tin liên hệ',
      fields: [
        {
          key: 'dia_chi',
          label: 'Địa chỉ',
          type: 'textarea',
          placeholder: 'Nhập địa chỉ',
          span: 3,
        },
        {
          key: 'so_dien_thoai',
          label: 'Số điện thoại',
          type: 'text',
          placeholder: 'Nhập số điện thoại',
        },
        {
          key: 'email',
          label: 'Email',
          type: 'email',
          placeholder: 'Nhập email',
        },
        {
          key: 'ma_so_thue',
          label: 'Mã số thuế',
          type: 'text',
          placeholder: 'Nhập mã số thuế',
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
          placeholder: 'Nhập thông tin khác',
          span: 3,
        },
      ],
    },
  ]

  return (
    <div className="bg-card border rounded-lg overflow-hidden flex-1 flex flex-col min-h-0">
      <GenericFormView<ThongTinCongTyFormData>
        form={form}
        title="Chỉnh sửa thông tin công ty"
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

