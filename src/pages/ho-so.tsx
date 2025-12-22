import { useAuthStore } from '@/store/auth-store'
import { GenericDetailView, DetailFieldGroup } from '@/shared/components/generic/generic-detail-view'
import type { NguoiDung } from '@/types'
import dayjs from 'dayjs'
import 'dayjs/locale/vi'

export function HoSoPage() {
  const { nguoiDung, vaiTro } = useAuthStore()

  const fieldGroups: DetailFieldGroup<NguoiDung>[] = [
    {
      title: 'Thông tin cá nhân',
      fields: [
        {
          key: 'ho_ten',
          label: 'Họ tên',
          accessor: 'ho_ten',
        },
        {
          key: 'email',
          label: 'Email',
          accessor: 'email',
        },
        {
          key: 'so_dien_thoai',
          label: 'Số điện thoại',
          accessor: () => null, // Field không tồn tại trong type, hiển thị — 
          render: () => <span className="text-muted-foreground">—</span>,
        },
        {
          key: 'dia_chi',
          label: 'Địa chỉ',
          accessor: () => null, // Field không tồn tại trong type, hiển thị —
          span: 3,
          render: () => <span className="text-muted-foreground">—</span>,
        },
      ],
    },
    {
      title: 'Thông tin hệ thống',
      fields: [
        {
          key: 'vai_tro',
          label: 'Vai trò',
          accessor: () => vaiTro?.ten || '—',
          render: (value) => (
            <span className={value !== '—' ? 'text-primary font-medium' : 'text-muted-foreground'}>
              {value}
            </span>
          ),
        },
        {
          key: 'created_at',
          label: 'Ngày tạo',
          accessor: 'created_at',
          render: (value) => {
            if (!value) return <span className="text-muted-foreground">—</span>
            return dayjs(value).locale('vi').format('DD/MM/YYYY HH:mm')
          },
        },
        {
          key: 'updated_at',
          label: 'Ngày cập nhật',
          accessor: 'updated_at',
          render: (value) => {
            if (!value) return <span className="text-muted-foreground">—</span>
            return dayjs(value).locale('vi').format('DD/MM/YYYY HH:mm')
          },
        },
      ],
    },
  ]

  return (
    <GenericDetailView<NguoiDung>
      data={nguoiDung || null}
      isLoading={false}
      error={null}
      title="Hồ sơ"
      groups={fieldGroups}
      emptyMessage="Không có thông tin hồ sơ"
    />
  )
}

