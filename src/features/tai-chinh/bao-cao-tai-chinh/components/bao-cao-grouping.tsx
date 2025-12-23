import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Button } from '@/components/ui/button'
import { ChevronDown } from 'lucide-react'
import type {
  GroupByOption,
  ComparePeriodOption,
  BaoCaoGroupedByTime,
  BaoCaoGroupedByDanhMuc,
  BaoCaoGroupedByDoiTac,
  BaoCaoGroupedByLoai,
  BaoCaoGroupedByNguoiTao,
} from '@/types/bao-cao-tai-chinh'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { cn } from '@/lib/utils'

interface BaoCaoGroupingProps {
  groupBy?: GroupByOption
  onGroupByChange: (groupBy: GroupByOption | undefined) => void
  comparePeriod?: ComparePeriodOption
  onComparePeriodChange: (period: ComparePeriodOption) => void
  groupedByTime?: BaoCaoGroupedByTime[]
  groupedByDanhMuc?: BaoCaoGroupedByDanhMuc[]
  groupedByDoiTac?: BaoCaoGroupedByDoiTac[]
  groupedByLoai?: BaoCaoGroupedByLoai[]
  groupedByNguoiTao?: BaoCaoGroupedByNguoiTao[]
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(value)
}

export function BaoCaoGrouping({
  groupBy,
  onGroupByChange,
  comparePeriod,
  onComparePeriodChange,
  groupedByTime,
  groupedByDanhMuc,
  groupedByDoiTac,
  groupedByLoai,
  groupedByNguoiTao,
}: BaoCaoGroupingProps) {
  const renderGroupedTable = () => {
    if (groupBy === 'ngay' || groupBy === 'tuan' || groupBy === 'thang' || groupBy === 'quy' || groupBy === 'nam') {
      if (!groupedByTime || groupedByTime.length === 0) {
        return <div className="text-sm text-muted-foreground text-center py-8">Không có dữ liệu</div>
      }

      return (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Kỳ</TableHead>
              <TableHead className="text-right">Tổng thu</TableHead>
              <TableHead className="text-right">Tổng chi</TableHead>
              <TableHead className="text-right">Số dư</TableHead>
              <TableHead className="text-right">Số lượng GD</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {groupedByTime.map((item, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{item.period}</TableCell>
                <TableCell className="text-right text-green-600">{formatCurrency(item.tongThu)}</TableCell>
                <TableCell className="text-right text-red-600">{formatCurrency(item.tongChi)}</TableCell>
                <TableCell className={cn('text-right font-medium', item.soDu >= 0 ? 'text-green-600' : 'text-red-600')}>
                  {formatCurrency(item.soDu)}
                </TableCell>
                <TableCell className="text-right">{item.soLuongGiaoDich}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )
    }

    if (groupBy === 'danh_muc') {
      if (!groupedByDanhMuc || groupedByDanhMuc.length === 0) {
        return <div className="text-sm text-muted-foreground text-center py-8">Không có dữ liệu</div>
      }

      return (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Danh mục</TableHead>
              <TableHead className="text-right">Tổng thu</TableHead>
              <TableHead className="text-right">Tổng chi</TableHead>
              <TableHead className="text-right">Số dư</TableHead>
              <TableHead className="text-right">Số lượng GD</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {groupedByDanhMuc.map((item) => (
              <TableRow key={item.danhMucId}>
                <TableCell className="font-medium">{item.danhMucTen}</TableCell>
                <TableCell className="text-right text-green-600">{formatCurrency(item.tongThu)}</TableCell>
                <TableCell className="text-right text-red-600">{formatCurrency(item.tongChi)}</TableCell>
                <TableCell className={cn('text-right font-medium', item.soDu >= 0 ? 'text-green-600' : 'text-red-600')}>
                  {formatCurrency(item.soDu)}
                </TableCell>
                <TableCell className="text-right">{item.soLuongGiaoDich}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )
    }

    if (groupBy === 'doi_tac') {
      if (!groupedByDoiTac || groupedByDoiTac.length === 0) {
        return <div className="text-sm text-muted-foreground text-center py-8">Không có dữ liệu</div>
      }

      return (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Đối tác</TableHead>
              <TableHead className="text-right">Tổng thu</TableHead>
              <TableHead className="text-right">Tổng chi</TableHead>
              <TableHead className="text-right">Số dư</TableHead>
              <TableHead className="text-right">Số lượng GD</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {groupedByDoiTac.map((item) => (
              <TableRow key={item.doiTacId}>
                <TableCell className="font-medium">{item.doiTacTen}</TableCell>
                <TableCell className="text-right text-green-600">{formatCurrency(item.tongThu)}</TableCell>
                <TableCell className="text-right text-red-600">{formatCurrency(item.tongChi)}</TableCell>
                <TableCell className={cn('text-right font-medium', item.soDu >= 0 ? 'text-green-600' : 'text-red-600')}>
                  {formatCurrency(item.soDu)}
                </TableCell>
                <TableCell className="text-right">{item.soLuongGiaoDich}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )
    }

    if (groupBy === 'loai') {
      if (!groupedByLoai || groupedByLoai.length === 0) {
        return <div className="text-sm text-muted-foreground text-center py-8">Không có dữ liệu</div>
      }

      return (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Loại</TableHead>
              <TableHead className="text-right">Tổng tiền</TableHead>
              <TableHead className="text-right">Số lượng GD</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {groupedByLoai.map((item) => (
              <TableRow key={item.loai}>
                <TableCell className="font-medium">
                  {item.loai === 'thu' ? 'Thu' : item.loai === 'chi' ? 'Chi' : 'Luân chuyển'}
                </TableCell>
                <TableCell className="text-right font-medium">{formatCurrency(item.tongTien)}</TableCell>
                <TableCell className="text-right">{item.soLuongGiaoDich}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )
    }

    if (groupBy === 'nguoi_tao') {
      if (!groupedByNguoiTao || groupedByNguoiTao.length === 0) {
        return <div className="text-sm text-muted-foreground text-center py-8">Không có dữ liệu</div>
      }

      return (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Người tạo</TableHead>
              <TableHead className="text-right">Tổng thu</TableHead>
              <TableHead className="text-right">Tổng chi</TableHead>
              <TableHead className="text-right">Số dư</TableHead>
              <TableHead className="text-right">Số lượng GD</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {groupedByNguoiTao.map((item) => (
              <TableRow key={item.nguoiTaoId}>
                <TableCell className="font-medium">{item.nguoiTaoTen}</TableCell>
                <TableCell className="text-right text-green-600">{formatCurrency(item.tongThu)}</TableCell>
                <TableCell className="text-right text-red-600">{formatCurrency(item.tongChi)}</TableCell>
                <TableCell className={cn('text-right font-medium', item.soDu >= 0 ? 'text-green-600' : 'text-red-600')}>
                  {formatCurrency(item.soDu)}
                </TableCell>
                <TableCell className="text-right">{item.soLuongGiaoDich}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )
    }

    return null
  }

  const groupByOptions = [
    { value: '', label: 'Không nhóm' },
    { value: 'ngay', label: 'Theo ngày' },
    { value: 'tuan', label: 'Theo tuần' },
    { value: 'thang', label: 'Theo tháng' },
    { value: 'quy', label: 'Theo quý' },
    { value: 'nam', label: 'Theo năm' },
    { value: 'danh_muc', label: 'Theo danh mục' },
    { value: 'doi_tac', label: 'Theo đối tác' },
    { value: 'loai', label: 'Theo loại' },
    { value: 'nguoi_tao', label: 'Theo người tạo' },
  ]

  const comparePeriodOptions = [
    { value: '', label: 'Không so sánh' },
    { value: 'thang_truoc', label: 'Tháng trước' },
    { value: 'nam_truoc', label: 'Năm trước' },
    { value: 'ky_truoc', label: 'Kỳ trước' },
  ]

  const [groupByOpen, setGroupByOpen] = React.useState(false)
  const [comparePeriodOpen, setComparePeriodOpen] = React.useState(false)

  const selectedGroupByLabel = groupByOptions.find((opt) => opt.value === (groupBy || ''))?.label || 'Chọn nhóm'
  const selectedComparePeriodLabel = comparePeriodOptions.find((opt) => opt.value === (comparePeriod || ''))?.label || 'So sánh kỳ'

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Phân nhóm dữ liệu</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Chọn cách nhóm dữ liệu để xem báo cáo chi tiết theo từng tiêu chí. 
              Có thể so sánh với kỳ trước để đánh giá xu hướng.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Popover open={groupByOpen} onOpenChange={setGroupByOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[180px] justify-between">
                  {selectedGroupByLabel}
                  <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[180px] p-0" align="start">
                <Command>
                  <CommandInput placeholder="Tìm kiếm..." />
                  <CommandList>
                    <CommandEmpty>Không tìm thấy.</CommandEmpty>
                    <CommandGroup>
                      {groupByOptions.map((option) => (
                        <CommandItem
                          key={option.value}
                          value={option.value || ''}
                          onSelect={() => {
                            onGroupByChange((option.value || undefined) as GroupByOption | undefined)
                            setGroupByOpen(false)
                          }}
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            onGroupByChange((option.value || undefined) as GroupByOption | undefined)
                            setGroupByOpen(false)
                          }}
                          className="cursor-pointer"
                        >
                          {option.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            <Popover open={comparePeriodOpen} onOpenChange={setComparePeriodOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[180px] justify-between">
                  {selectedComparePeriodLabel}
                  <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[180px] p-0" align="start">
                <Command>
                  <CommandInput placeholder="Tìm kiếm..." />
                  <CommandList>
                    <CommandEmpty>Không tìm thấy.</CommandEmpty>
                    <CommandGroup>
                      {comparePeriodOptions.map((option) => (
                        <CommandItem
                          key={option.value}
                          value={option.value || ''}
                          onSelect={() => {
                            onComparePeriodChange((option.value || null) as ComparePeriodOption)
                            setComparePeriodOpen(false)
                          }}
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            onComparePeriodChange((option.value || null) as ComparePeriodOption)
                            setComparePeriodOpen(false)
                          }}
                          className="cursor-pointer"
                        >
                          {option.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </CardHeader>
      <CardContent>{renderGroupedTable()}</CardContent>
    </Card>
  )
}

