/**
 * File ví dụ sử dụng Generic Components
 * File này chỉ để tham khảo, không được import vào production code
 */

import { GenericListView } from './generic-list-view'
import { GenericFormViewWrapper } from './generic-form-view-wrapper'
import type { CotHienThi, HanhDongItem } from './types'
import { Edit, Trash2, Eye } from 'lucide-react'

// Ví dụ: Sử dụng GenericListView
interface NguoiDungExample {
  id: string
  ho_ten: string
  email: string
  vai_tro: string
  is_active: boolean
}

export function ExampleGenericListView() {
  const data: NguoiDungExample[] = [
    { id: '1', ho_ten: 'Nguyễn Văn A', email: 'a@example.com', vai_tro: 'Admin', is_active: true },
    { id: '2', ho_ten: 'Trần Thị B', email: 'b@example.com', vai_tro: 'User', is_active: false },
  ]

  const cotHienThi: CotHienThi<NguoiDungExample>[] = [
    {
      key: 'ho_ten',
      label: 'Họ tên',
      accessorKey: 'ho_ten',
      sortable: true,
      defaultVisible: true,
    },
    {
      key: 'email',
      label: 'Email',
      accessorKey: 'email',
      sortable: true,
      defaultVisible: true,
    },
    {
      key: 'vai_tro',
      label: 'Vai trò',
      accessorKey: 'vai_tro',
      sortable: true,
      defaultVisible: true,
    },
    {
      key: 'is_active',
      label: 'Trạng thái',
      accessorKey: 'is_active',
      cell: (value) => (
        <span className={value ? 'text-green-600' : 'text-red-600'}>
          {value ? 'Hoạt động' : 'Vô hiệu hóa'}
        </span>
      ),
      defaultVisible: true,
    },
  ]

  const hanhDongItems: HanhDongItem<NguoiDungExample>[] = [
    {
      label: 'Xem',
      icon: Eye,
      onClick: (row) => console.log('Xem:', row),
    },
    {
      label: 'Sửa',
      icon: Edit,
      onClick: (row) => console.log('Sửa:', row),
    },
    {
      label: 'Xóa',
      icon: Trash2,
      variant: 'destructive',
      onClick: (row) => console.log('Xóa:', row),
    },
  ]

  return (
    <GenericListView
      data={data}
      cotHienThi={cotHienThi}
      hanhDongItems={hanhDongItems}
      tenLuuTru="nguoi-dung-columns"
      onTimKiem={(keyword) => console.log('Tìm kiếm:', keyword)}
      onXuatExcel={(data) => console.log('Xuất Excel:', data)}
      onNhapExcel={(file) => console.log('Nhập Excel:', file)}
    />
  )
}

// Ví dụ: Sử dụng GenericFormViewWrapper
export function ExampleGenericFormView() {
  return (
    <>
      {/* Modal Mode */}
      <GenericFormViewWrapper
        mode="modal"
        title="Thêm mới người dùng"
        isOpen={true}
        onClose={() => console.log('Close')}
        onSubmit={() => console.log('Submit')}
        onCancel={() => console.log('Cancel')}
        size="lg"
      >
        <form>
          {/* Form fields here */}
          <input type="text" placeholder="Họ tên" />
        </form>
      </GenericFormViewWrapper>

      {/* Page Mode */}
      <GenericFormViewWrapper
        mode="page"
        title="Chỉnh sửa người dùng"
        onSubmit={() => console.log('Submit')}
        onCancel={() => console.log('Cancel')}
      >
        <form>
          {/* Form fields here */}
          <input type="text" placeholder="Email" />
        </form>
      </GenericFormViewWrapper>
    </>
  )
}

