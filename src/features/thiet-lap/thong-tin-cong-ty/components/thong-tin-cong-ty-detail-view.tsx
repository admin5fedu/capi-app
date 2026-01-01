import { GenericDetailView, DetailFieldGroup } from '@/shared/components/generic/generic-detail-view'
import type { ThongTinCongTy } from '@/types/thong-tin-cong-ty'

interface ThongTinCongTyDetailViewProps {
  data: ThongTinCongTy | null
  isLoading: boolean
  error: Error | null
  onEdit: () => void
}

/**
 * ThongTinCongTyDetailView component - Hiển thị chi tiết thông tin công ty
 */
export function ThongTinCongTyDetailView({
  data,
  isLoading,
  error,
  onEdit,
}: ThongTinCongTyDetailViewProps) {
  // Định nghĩa các nhóm fields cho detail view
  const fieldGroups: DetailFieldGroup<ThongTinCongTy>[] = [
    {
      title: 'Thông tin cơ bản',
      fields: [
        {
          key: 'ten_app',
          label: 'Tên ứng dụng',
          accessor: 'ten_app',
          render: (value) => value || <span className="text-muted-foreground">—</span>,
        },
        {
          key: 'ten_cong_ty',
          label: 'Tên công ty',
          accessor: 'ten_cong_ty',
          render: (value) => value || <span className="text-muted-foreground">—</span>,
        },
        {
          key: 'logo',
          label: 'Logo',
          accessor: 'logo',
          span: 3,
          render: (value) => {
            if (!value) {
              return <span className="text-muted-foreground">—</span>
            }
            return (
              <div className="flex items-center gap-4">
                <img
                  src={value}
                  alt="Logo công ty"
                  className="w-32 h-32 object-contain rounded-md border bg-muted"
                  onError={(e) => {
                    // Nếu ảnh lỗi, ẩn đi
                    e.currentTarget.style.display = 'none'
                  }}
                />
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
          key: 'dia_chi',
          label: 'Địa chỉ',
          accessor: 'dia_chi',
          span: 3,
          render: (value) => value || <span className="text-muted-foreground">—</span>,
        },
        {
          key: 'so_dien_thoai',
          label: 'Số điện thoại',
          accessor: 'so_dien_thoai',
          render: (value) => value || <span className="text-muted-foreground">—</span>,
        },
        {
          key: 'email',
          label: 'Email',
          accessor: 'email',
          render: (value) => value || <span className="text-muted-foreground">—</span>,
        },
        {
          key: 'ma_so_thue',
          label: 'Mã số thuế',
          accessor: 'ma_so_thue',
          render: (value) => value || <span className="text-muted-foreground">—</span>,
        },
      ],
    },
    {
      title: 'Thông tin khác',
      fields: [
        {
          key: 'thong_tin_khac',
          label: 'Thông tin khác',
          accessor: 'thong_tin_khac',
          span: 3,
          render: (value) => value || <span className="text-muted-foreground">—</span>,
        },
      ],
    },
  ]

  return (
    <GenericDetailView<ThongTinCongTy>
      data={data}
      isLoading={isLoading}
      error={error}
      title="Thông tin công ty"
      onEdit={onEdit}
      groups={fieldGroups}
      emptyMessage="Chưa có thông tin công ty. Vui lòng nhấn 'Sửa' để thêm thông tin."
    />
  )
}

