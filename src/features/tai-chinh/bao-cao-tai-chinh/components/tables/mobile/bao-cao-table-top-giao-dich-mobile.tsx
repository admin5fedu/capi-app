import { Card, CardContent } from '@/components/ui/card'
import type { GiaoDichWithRelations } from '@/types/giao-dich'
import { formatCurrency } from '../../bao-cao-table-utils'
import { cn } from '@/lib/utils'
import dayjs from 'dayjs'

interface BaoCaoTableTopGiaoDichMobileProps {
  data: GiaoDichWithRelations[]
}

export function BaoCaoTableTopGiaoDichMobile({ data }: BaoCaoTableTopGiaoDichMobileProps) {
  return (
    <div className="space-y-3 p-4">
      {data.map((item, index) => {
        const soTien = item.so_tien_vnd || item.so_tien
        const loaiLabel = item.loai === 'thu' ? 'Thu' : item.loai === 'chi' ? 'Chi' : 'Luân chuyển'
        const loaiColor = item.loai === 'thu' ? 'text-green-600 dark:text-green-400' : 
                         item.loai === 'chi' ? 'text-red-600 dark:text-red-400' : 
                         'text-blue-600 dark:text-blue-400'
        return (
          <Card key={item.id}>
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="font-semibold text-base">#{index + 1}</div>
                <span className={cn('font-medium text-sm', loaiColor)}>{loaiLabel}</span>
              </div>
              <div className="space-y-1 text-sm">
                <div>
                  <div className="text-muted-foreground text-xs">Mã phiếu</div>
                  <div className="font-medium">{item.ma_phieu}</div>
                </div>
                <div>
                  <div className="text-muted-foreground text-xs">Ngày</div>
                  <div>{dayjs(item.ngay).format('DD/MM/YYYY')}</div>
                </div>
                {item.mo_ta && (
                  <div>
                    <div className="text-muted-foreground text-xs">Mô tả</div>
                    <div className="line-clamp-2">{item.mo_ta}</div>
                  </div>
                )}
                {item.danh_muc?.ten && (
                  <div>
                    <div className="text-muted-foreground text-xs">Danh mục</div>
                    <div>{item.danh_muc.ten}</div>
                  </div>
                )}
                {item.doi_tac?.ten && (
                  <div>
                    <div className="text-muted-foreground text-xs">Đối tác</div>
                    <div>{item.doi_tac.ten}</div>
                  </div>
                )}
              </div>
              <div className="pt-2 border-t">
                <div className="text-muted-foreground text-xs">Số tiền</div>
                <div className={cn('font-semibold text-lg', loaiColor)}>
                  {formatCurrency(soTien)}
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

