import { useEffect, useState, useMemo, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useGiaoDichById, useCreateGiaoDich, useUpdateGiaoDich } from '../hooks/use-giao-dich'
import { useDanhMucByLoai } from '@/features/tai-chinh/danh-muc'
import { useTaiKhoanList } from '@/features/tai-chinh/tai-khoan'
import { useDoiTacList } from '@/features/doi-tac/danh-sach-doi-tac'
import { useTyGiaList, useCreateTyGia } from '@/features/tai-chinh/ty-gia'
import { getNextMaPhieuService, checkMaPhieuExistsService } from '../services/giao-dich-service'
import { GenericFormView } from '@/shared/components/generic/generic-form-view'
import type { FormFieldGroup } from '@/shared/components/generic/generic-form-view'
import { LOAI_GIAO_DICH } from '../config'
import { useAuthStore } from '@/store/auth-store'
import type { GiaoDichInsert, GiaoDichUpdate, LoaiGiaoDich } from '@/types/giao-dich'
import { getCloudinaryUploadUrl } from '@/lib/cloudinary'
import { Button } from '@/components/ui/button'
import { X, Upload, Camera, Image as ImageIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { NumberInput } from '@/components/ui/number-input'
import { AutocompleteInput, type AutocompleteOption } from '@/components/ui/autocomplete-input'

// Schema validation - sẽ được tạo động với editId để validate mã phiếu
const createGiaoDichSchema = (editId?: number | null) =>
  z
    .object({
      ngay: z.string().min(1, 'Ngày là bắt buộc'),
      loai: z.enum(['thu', 'chi', 'luan_chuyen'], {
        required_error: 'Loại giao dịch là bắt buộc',
      }),
      ma_phieu: z
        .string()
        .min(1, 'Mã phiếu là bắt buộc'),
      danh_muc_id: z.string().optional().nullable(),
      mo_ta: z.string().max(2000, 'Mô tả quá dài').optional().nullable(),
      so_tien: z.number().min(0, 'Số tiền phải lớn hơn hoặc bằng 0'),
      ty_gia_id: z.number().optional().nullable(),
      ty_gia_value: z.number().optional().nullable(), // Giá trị tỷ giá có thể điều chỉnh
      tai_khoan_id: z.string().optional().nullable(),
      tai_khoan_den_id: z.string().optional().nullable(),
      doi_tac_id: z.string().optional().nullable(),
      so_chung_tu: z.string().max(100, 'Số chứng từ quá dài').optional().nullable(),
      hinh_anh: z.array(z.string()).optional().nullable(),
      ghi_chu: z.string().max(2000, 'Ghi chú quá dài').optional().nullable(),
    })
    .refine(
      (data) => {
        // Thu: cần tai_khoan_den_id
        if (data.loai === 'thu' && !data.tai_khoan_den_id) {
          return false
        }
        // Chi: cần tai_khoan_id
        if (data.loai === 'chi' && !data.tai_khoan_id) {
          return false
        }
        // Luân chuyển: cần cả hai
        if (data.loai === 'luan_chuyen' && (!data.tai_khoan_id || !data.tai_khoan_den_id)) {
          return false
        }
        return true
      },
      {
        message: 'Vui lòng chọn đầy đủ tài khoản theo loại giao dịch',
      }
    )
    .refine(
      (data) => {
        // Thu: cần danh_muc_id
        if (data.loai === 'thu' && !data.danh_muc_id) {
          return false
        }
        // Chi: cần danh_muc_id
        if (data.loai === 'chi' && !data.danh_muc_id) {
          return false
        }
        // Luân chuyển: không cần danh_muc_id
        return true
      },
      {
        message: 'Vui lòng chọn danh mục',
        path: ['danh_muc_id'],
      }
    )
    .superRefine(async (data, ctx) => {
      // Validate mã phiếu không trùng (async)
      if (data.ma_phieu) {
        try {
          const exists = await checkMaPhieuExistsService(data.ma_phieu, editId || undefined)
          if (exists) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: 'Mã phiếu đã tồn tại',
              path: ['ma_phieu'],
            })
          }
        } catch (error) {
          // Ignore validation error if service fails
          console.error('Error checking ma_phieu:', error)
        }
      }
    })

type GiaoDichFormData = z.infer<ReturnType<typeof createGiaoDichSchema>>

interface GiaoDichFormViewProps {
  editId?: number | null
  onComplete: () => void
  onCancel: () => void
  mode?: 'modal' | 'page'
}

/**
 * Component upload nhiều hình ảnh với drag-drop, camera, và file upload
 */
function MultipleImageUpload({
  value,
  onChange,
  disabled,
}: {
  value: string[]
  onChange: (urls: string[]) => void
  disabled?: boolean
}) {
  const [uploading, setUploading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return

    setUploading(true)
    try {
      const uploadUrl = getCloudinaryUploadUrl('giao-dich')
      const uploadPromises = Array.from(files).map(async (file) => {
        // Validate file type
        if (!file.type.startsWith('image/')) {
          throw new Error('File phải là hình ảnh')
        }
        const formData = new FormData()
        formData.append('file', file)

        const response = await fetch(uploadUrl, {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) throw new Error('Upload failed')
        const data = await response.json()
        return data.secure_url
      })

      const urls = await Promise.all(uploadPromises)
      onChange([...value, ...urls])
      toast.success(`Upload ${urls.length} hình ảnh thành công`)
    } catch (error: any) {
      toast.error(error.message || 'Lỗi khi upload hình ảnh')
      console.error(error)
    } finally {
      setUploading(false)
    }
  }

  const handleRemove = (index: number) => {
    onChange(value.filter((_, i) => i !== index))
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (disabled || uploading) return
    handleFileSelect(e.dataTransfer.files)
  }

  const handleCameraClick = () => {
    cameraInputRef.current?.click()
  }

  const handleFileClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-3">
      {/* Preview images */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((url, index) => (
            <div key={index} className="relative group">
              <img
                src={url}
                alt={`Hình ${index + 1}`}
                className="w-24 h-24 object-cover rounded border cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => window.open(url, '_blank')}
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleRemove(index)}
                disabled={disabled}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Drop zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          'border-2 border-dashed rounded-lg p-6 text-center transition-colors',
          isDragging
            ? 'border-primary bg-primary/5'
            : 'border-muted-foreground/25 hover:border-muted-foreground/50',
          (disabled || uploading) && 'opacity-50 cursor-not-allowed'
        )}
      >
        <ImageIcon className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
        <p className="text-sm text-muted-foreground mb-4">
          Kéo thả hình ảnh vào đây hoặc
        </p>
        <div className="flex gap-2 justify-center">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleFileClick}
            disabled={disabled || uploading}
          >
            <Upload className="h-4 w-4 mr-2" />
            {uploading ? 'Đang upload...' : 'Tải ảnh lên'}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleCameraClick}
            disabled={disabled || uploading}
          >
            <Camera className="h-4 w-4 mr-2" />
            Chụp ảnh
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Hỗ trợ: JPG, PNG, GIF (tối đa 10MB mỗi ảnh)
        </p>
      </div>

      {/* Hidden inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFileSelect(e.target.files)}
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => handleFileSelect(e.target.files)}
      />
    </div>
  )
}

/**
 * GiaoDichFormView component
 */
export function GiaoDichFormView({
  editId,
  onComplete,
  onCancel,
}: GiaoDichFormViewProps) {
  const { data: chiTiet, isLoading: dangTaiChiTiet } = useGiaoDichById(editId || null)
  const { data: danhSachDanhMucThu } = useDanhMucByLoai('thu')
  const { data: danhSachDanhMucChi } = useDanhMucByLoai('chi')
  const { data: danhSachTaiKhoan } = useTaiKhoanList()
  const { data: danhSachDoiTac } = useDoiTacList()
  const { data: danhSachTyGia } = useTyGiaList()
  const taoMoi = useCreateGiaoDich()
  const capNhat = useUpdateGiaoDich()
  const taoTyGia = useCreateTyGia()
  const { nguoiDung } = useAuthStore()

  const form = useForm<GiaoDichFormData>({
    resolver: zodResolver(createGiaoDichSchema(editId || null)),
    defaultValues: {
      ngay: editId ? '' : new Date().toISOString().split('T')[0], // Tự lấy today khi tạo mới
      loai: 'thu',
      ma_phieu: '',
      danh_muc_id: null,
      mo_ta: null,
      so_tien: 0,
      ty_gia_id: null,
      ty_gia_value: null,
      tai_khoan_id: null,
      tai_khoan_den_id: null,
      doi_tac_id: null,
      so_chung_tu: null,
      hinh_anh: [],
      ghi_chu: null,
    },
  })

  const {
    formState: { isSubmitting },
    reset,
    watch,
    setValue,
  } = form

  const loai = watch('loai')
  const ngay = watch('ngay')
  const taiKhoanId = watch('tai_khoan_id')
  const taiKhoanDenId = watch('tai_khoan_den_id')
  const soTien = watch('so_tien')
  const tyGiaValue = watch('ty_gia_value')

  // Tự động tạo mã phiếu khi thay đổi loại (chỉ khi tạo mới)
  useEffect(() => {
    if (!editId && loai) {
      const maPhieu = getNextMaPhieuService(loai as LoaiGiaoDich)
      setValue('ma_phieu', maPhieu)
    }
  }, [loai, editId, setValue])

  // Kiểm tra và tự động lấy tỷ giá khi có tài khoản USD
  useEffect(() => {
    if (!ngay) return

    const taiKhoan =
      danhSachTaiKhoan?.find((tk) => tk.id === taiKhoanId) ||
      danhSachTaiKhoan?.find((tk) => tk.id === taiKhoanDenId)
    const taiKhoanDen = danhSachTaiKhoan?.find((tk) => tk.id === taiKhoanDenId)

    const canCoTyGia =
      taiKhoan?.loai_tien === 'USD' || taiKhoanDen?.loai_tien === 'USD'

    if (canCoTyGia) {
      // Lấy tỷ giá mới nhất (ngày áp dụng gần nhất với ngày giao dịch hoặc trước đó)
      // Danh sách đã sắp xếp theo ngay_ap_dung giảm dần
      const tyGiaMoiNhat = danhSachTyGia?.find((tg) => {
        const ngayApDung = new Date(tg.ngay_ap_dung)
        const ngayGD = new Date(ngay)
        return ngayApDung <= ngayGD
      }) || danhSachTyGia?.[0] // Nếu không có tỷ giá trước ngày giao dịch, lấy tỷ giá mới nhất

      if (tyGiaMoiNhat && !tyGiaValue) {
        setValue('ty_gia_id', tyGiaMoiNhat.id)
        setValue('ty_gia_value', tyGiaMoiNhat.ty_gia)
      }
    } else {
      setValue('ty_gia_id', null)
      setValue('ty_gia_value', null)
    }
  }, [
    ngay,
    taiKhoanId,
    taiKhoanDenId,
    danhSachTaiKhoan,
    danhSachTyGia,
    tyGiaValue,
    setValue,
  ])

  // Tính so_tien_vnd khi có tỷ giá
  useEffect(() => {
    if (tyGiaValue && soTien) {
      const taiKhoan =
        danhSachTaiKhoan?.find((tk) => tk.id === taiKhoanId) ||
        danhSachTaiKhoan?.find((tk) => tk.id === taiKhoanDenId)
      if (taiKhoan?.loai_tien === 'USD') {
        // Không cần tính vì sẽ tính trong onSubmit
      }
    }
  }, [tyGiaValue, soTien, taiKhoanId, taiKhoanDenId, danhSachTaiKhoan])

  // Load dữ liệu khi chỉnh sửa
  useEffect(() => {
    if (chiTiet) {
      reset({
        ngay: chiTiet.ngay,
        loai: chiTiet.loai,
        ma_phieu: chiTiet.ma_phieu,
        danh_muc_id: chiTiet.danh_muc_id || null,
        mo_ta: chiTiet.mo_ta || null,
        so_tien: chiTiet.so_tien,
        ty_gia_id: chiTiet.ty_gia_id || null,
        ty_gia_value: chiTiet.ty_gia?.ty_gia || null,
        tai_khoan_id: chiTiet.tai_khoan_id || null,
        tai_khoan_den_id: chiTiet.tai_khoan_den_id || null,
        doi_tac_id: chiTiet.doi_tac_id || null,
        so_chung_tu: chiTiet.so_chung_tu || null,
        hinh_anh: chiTiet.hinh_anh || [],
        ghi_chu: chiTiet.ghi_chu || null,
      })
    }
  }, [chiTiet, reset])

  const onSubmit = async (data: GiaoDichFormData) => {
    try {
      // Tính so_tien_vnd nếu có tỷ giá USD
      let soTienVnd: number | null = null
      if (data.ty_gia_value && data.so_tien) {
        const taiKhoan =
          danhSachTaiKhoan?.find((tk) => tk.id === data.tai_khoan_id) ||
          danhSachTaiKhoan?.find((tk) => tk.id === data.tai_khoan_den_id)
        if (taiKhoan?.loai_tien === 'USD') {
          soTienVnd = data.so_tien * data.ty_gia_value
        }
      }

      // Kiểm tra xem có cần tạo tỷ giá mới không (nếu điều chỉnh tỷ giá)
      let finalTyGiaId = data.ty_gia_id
      if (data.ty_gia_value && data.ty_gia_id) {
        const tyGiaHienTai = danhSachTyGia?.find((tg) => tg.id === data.ty_gia_id)
        if (tyGiaHienTai && tyGiaHienTai.ty_gia !== data.ty_gia_value) {
          // Tạo tỷ giá mới
          const newTyGia = await taoTyGia.mutateAsync({
            ty_gia: data.ty_gia_value,
            ngay_ap_dung: data.ngay,
            created_by: nguoiDung?.id || null,
          })
          finalTyGiaId = newTyGia.id
        }
      }

      const formData: GiaoDichInsert | GiaoDichUpdate = {
        ngay: data.ngay,
        loai: data.loai,
        ma_phieu: data.ma_phieu,
        danh_muc_id: data.loai === 'luan_chuyen' ? null : data.danh_muc_id || null,
        mo_ta: data.mo_ta || null,
        so_tien: data.so_tien,
        ty_gia_id: finalTyGiaId || null,
        tai_khoan_id: data.tai_khoan_id || null,
        tai_khoan_den_id: data.tai_khoan_den_id || null,
        doi_tac_id: data.doi_tac_id || null,
        so_chung_tu: data.so_chung_tu || null,
        hinh_anh: data.hinh_anh || null,
        ghi_chu: data.ghi_chu || null,
        so_tien_vnd: soTienVnd,
      }

      if (editId) {
        await capNhat.mutateAsync({ id: editId, data: formData as GiaoDichUpdate })
      } else {
        await taoMoi.mutateAsync({
          ...(formData as GiaoDichInsert),
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

  const title = editId ? 'Chỉnh sửa giao dịch' : 'Thêm giao dịch mới'
  const isLoading = isSubmitting || taoMoi.isPending || capNhat.isPending

  // Lọc danh mục theo loại giao dịch
  const danhMucOptions = useMemo(() => {
    const danhMucList = loai === 'thu' ? danhSachDanhMucThu : danhSachDanhMucChi
    return (
      danhMucList
        ?.filter((dm) => dm.is_active)
        .map((dm) => ({
          value: dm.id,
          label: dm.ten + (dm.parent_ten ? ` (${dm.parent_ten})` : ''),
        })) || []
    )
  }, [loai, danhSachDanhMucThu, danhSachDanhMucChi])

  // Đối tác options với group cho AutocompleteInput
  const doiTacAutocompleteOptions = useMemo(() => {
    if (!danhSachDoiTac) {
      return []
    }
    const options: AutocompleteOption[] = []
    const khachHang = danhSachDoiTac.filter((dt) => dt.loai === 'khach_hang' && dt.trang_thai)
    const nhaCungCap = danhSachDoiTac.filter((dt) => dt.loai === 'nha_cung_cap' && dt.trang_thai)

    if (khachHang.length > 0) {
      khachHang.forEach((dt) => {
        options.push({
          value: dt.id,
          label: dt.ten,
          description: 'Khách hàng',
        })
      })
    }
    if (nhaCungCap.length > 0) {
      nhaCungCap.forEach((dt) => {
        options.push({
          value: dt.id,
          label: dt.ten,
          description: 'Nhà cung cấp',
        })
      })
    }

    return options
  }, [danhSachDoiTac])

  // Kiểm tra có cần tỷ giá không
  const canCoTyGia =
    danhSachTaiKhoan?.find((tk) => tk.id === taiKhoanId)?.loai_tien === 'USD' ||
    danhSachTaiKhoan?.find((tk) => tk.id === taiKhoanDenId)?.loai_tien === 'USD'

  // Định nghĩa các nhóm fields
  const fieldGroups: FormFieldGroup<GiaoDichFormData>[] = [
    {
      title: 'Thông tin cơ bản',
      fields: [
        {
          key: 'ngay',
          label: 'Ngày',
          type: 'date',
          required: true,
        },
        {
          key: 'loai',
          label: 'Loại giao dịch',
          type: 'custom',
          required: true,
          render: (form) => {
            const { watch, setValue } = form
            const currentLoai = watch('loai')

            return (
              <div className="flex gap-2">
                {LOAI_GIAO_DICH.map((loaiOption) => {
                  const isSelected = currentLoai === loaiOption.value
                  return (
                    <Button
                      key={loaiOption.value}
                      type="button"
                      variant={isSelected ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => {
                        setValue('loai', loaiOption.value as LoaiGiaoDich, { shouldValidate: true })
                        // Reset các field liên quan khi đổi loại
                        if (loaiOption.value === 'luan_chuyen') {
                          setValue('danh_muc_id', null)
                        }
                        if (loaiOption.value === 'thu') {
                          setValue('tai_khoan_id', null)
                        }
                        if (loaiOption.value === 'chi') {
                          setValue('tai_khoan_den_id', null)
                        }
                      }}
                      disabled={isLoading}
                      className="flex-1"
                    >
                      {loaiOption.label}
                    </Button>
                  )
                })}
              </div>
            )
          },
        },
        {
          key: 'ma_phieu',
          label: 'Mã phiếu',
          type: 'text',
          required: true,
          helperText: 'Mã phiếu được tự động tạo, có thể chỉnh sửa. Không được trùng.',
        },
        {
          key: 'danh_muc_id',
          label: 'Danh mục',
          type: 'select',
          required: loai !== 'luan_chuyen',
          options: [
            { value: '', label: '-- Chọn danh mục --' },
            ...danhMucOptions,
          ],
          disabled: loai === 'luan_chuyen',
          helperText:
            loai === 'luan_chuyen'
              ? 'Luân chuyển không cần danh mục'
              : loai === 'thu'
                ? 'Chọn danh mục thu'
                : 'Chọn danh mục chi',
        },
        {
          key: 'mo_ta',
          label: 'Mô tả',
          type: 'textarea',
          placeholder: 'Nhập mô tả (nhiều dòng)',
          span: 3,
        },
      ],
    },
    {
      title: 'Thông tin tài chính',
      fields: [
        {
          key: 'so_tien',
          label: 'Số tiền',
          type: 'custom',
          required: true,
          helperText: 'Số tiền phải lớn hơn hoặc bằng 0',
          render: (form) => {
            const { formState, watch, setValue } = form
            const error = formState.errors.so_tien
            const value = watch('so_tien') || 0

            return (
              <div className="space-y-1">
                <NumberInput
                  value={value}
                  onChange={(numValue) => {
                    setValue('so_tien', numValue, { shouldValidate: true })
                  }}
                  onBlur={() => {
                    setValue('so_tien', value, { shouldValidate: true })
                  }}
                  disabled={isLoading}
                  allowDecimals={true}
                  min={0}
                  className={cn(
                    'h-11',
                    error && 'border-destructive focus-visible:ring-destructive'
                  )}
                  placeholder="Nhập số tiền"
                />
                {error && (
                  <p className="text-xs text-destructive">{error.message as string}</p>
                )}
              </div>
            )
          },
        },
        {
          key: 'ty_gia_value',
          label: 'Tỷ giá',
          type: 'number',
          required: canCoTyGia,
          disabled: !canCoTyGia,
          helperText: canCoTyGia
            ? 'Tỷ giá bắt buộc cho tài khoản USD. Có thể điều chỉnh, hệ thống sẽ tự động tạo tỷ giá mới nếu thay đổi.'
            : 'Chỉ hiện khi có tài khoản USD',
          render: (form) => {
            const { register, formState } = form
            const error = formState.errors.ty_gia_value

            return (
              <div className="space-y-1">
                <input
                  {...register('ty_gia_value', {
                    valueAsNumber: true,
                    required: canCoTyGia ? 'Tỷ giá là bắt buộc' : false,
                    min: { value: 0, message: 'Tỷ giá phải lớn hơn 0' },
                  })}
                  type="number"
                  step="0.01"
                  disabled={!canCoTyGia || isLoading}
                  className={cn(
                    'flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm',
                    canCoTyGia ? '' : 'opacity-50 cursor-not-allowed',
                    error && 'border-destructive'
                  )}
                  placeholder="Nhập tỷ giá"
                />
                {error && (
                  <p className="text-xs text-destructive">{error.message as string}</p>
                )}
              </div>
            )
          },
        },
        {
          key: 'tai_khoan_id',
          label: loai === 'thu' ? 'Tài khoản đi (không dùng)' : 'Tài khoản đi',
          type: 'select',
          required: loai !== 'thu',
          disabled: loai === 'thu',
          options: [
            { value: '', label: '-- Chọn tài khoản đi --' },
            ...(danhSachTaiKhoan
              ?.filter((tk) => tk.is_active)
              .map((tk) => ({
                value: tk.id,
                label: `${tk.ten} (${tk.loai_tien})`,
              })) || []),
          ],
          helperText: loai === 'thu' ? 'Thu không cần tài khoản đi' : 'Chọn tài khoản đi',
        },
        {
          key: 'tai_khoan_den_id',
          label: loai === 'chi' ? 'Tài khoản đến (không dùng)' : 'Tài khoản đến',
          type: 'select',
          required: loai !== 'chi',
          disabled: loai === 'chi',
          options: [
            { value: '', label: '-- Chọn tài khoản đến --' },
            ...(danhSachTaiKhoan
              ?.filter((tk) => tk.is_active)
              .map((tk) => ({
                value: tk.id,
                label: `${tk.ten} (${tk.loai_tien})`,
              })) || []),
          ],
          helperText: loai === 'chi' ? 'Chi không cần tài khoản đến' : 'Chọn tài khoản đến',
        },
        {
          key: 'doi_tac_id',
          label: 'Đối tác',
          type: 'custom',
          render: (form) => {
            const { formState, watch, setValue } = form
            const error = formState.errors.doi_tac_id
            const value = watch('doi_tac_id')

            return (
              <div className="space-y-1">
                <AutocompleteInput
                  options={doiTacAutocompleteOptions}
                  value={value || undefined}
                  onChange={(newValue) => setValue('doi_tac_id', newValue as string | null, { shouldValidate: true })}
                  placeholder="Tìm kiếm đối tác (khách hàng hoặc nhà cung cấp)..."
                  emptyMessage="Không tìm thấy đối tác"
                  disabled={isLoading}
                  className={cn(
                    error && 'border-destructive focus-visible:ring-destructive'
                  )}
                />
                {error && (
                  <p className="text-xs text-destructive">{error.message as string}</p>
                )}
              </div>
            )
          },
        },
        {
          key: 'so_chung_tu',
          label: 'Số chứng từ',
          type: 'text',
          placeholder: 'Nhập số chứng từ',
        },
      ],
    },
    {
      title: 'Hình ảnh và ghi chú',
      fields: [
        {
          key: 'hinh_anh',
          label: 'Hình ảnh',
          type: 'custom',
          span: 3,
          render: (form) => {
            const { watch, setValue } = form
            const hinhAnh = watch('hinh_anh') || []
            return (
              <MultipleImageUpload
                value={hinhAnh}
                onChange={(urls) => setValue('hinh_anh', urls)}
                disabled={isLoading}
              />
            )
          },
        },
        {
          key: 'ghi_chu',
          label: 'Ghi chú',
          type: 'textarea',
          placeholder: 'Nhập ghi chú (nhiều dòng)',
          span: 3,
        },
      ],
    },
  ]

  return (
    <div className="bg-card border rounded-lg overflow-hidden flex-1 flex flex-col min-h-0">
      <GenericFormView<GiaoDichFormData>
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

