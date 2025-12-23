import { Card, CardContent } from '@/components/ui/card'
import type { BaoCaoGroupedByLoai } from '@/types/bao-cao-tai-chinh'
import { formatCurrency, formatPercent } from '../../bao-cao-table-utils'
import { cn } from '@/lib/utils'

interface BaoCaoTableLoaiMobileProps {
  data: BaoCaoGroupedByLoai[]
}

export function BaoCaoTableLoaiMobile({ data }: BaoCaoTableLoaiMobileProps) {
  const total = data.reduce((sum, item) => sum + item.tongTien, 0)

  return (
    <div className="space-y-3 p-4">
      {data
        .sort((a, b) => b.tongTien - a.tongTien)
        .map((item) => {
          const label = item.loai === 'thu' ? 'Thu' : item.loai === 'chi' ? 'Chi' : 'Luân chuyển'
          const color = item.loai === 'thu' ? 'text-green-600 dark:text-green-400' : 
                       item.loai === 'chi' ? 'text-red-600 dark:text-red-400' : 
                       'text-blue-600 dark:text-blue-400'
          return (
            <Card key={item.loai}>
              <CardContent className="p-4 space-y-2">
                <div className={cn('font-semibold text-base', color)}>{label}</div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <div className="text-muted-foreground text-xs">Tổng tiền</div>
                    <div className={cn('font-medium', color)}>
                      {formatCurrency(item.tongTien)}
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground text-xs">Số lượng GD</div>
                    <div className="font-medium">
                      {item.soLuongGiaoDich.toLocaleString('vi-VN')}
                    </div>
                  </div>
                </div>
                <div className="pt-2 border-t">
                  <div className="text-xs text-muted-foreground">
                    Tỷ lệ: {formatPercent(item.tongTien, total)}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      
      <Card className="bg-muted/50">
        <CardContent className="p-4 space-y-2">
          <div className="font-semibold">Tổng cộng</div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <div className="text-muted-foreground text-xs">Tổng tiền</div>
              <div className="font-medium">
                {formatCurrency(data.reduce((sum, item) => sum + item.tongTien, 0))}
              </div>
            </div>
            <div>
              <div className="text-muted-foreground text-xs">Số lượng GD</div>
              <div className="font-medium">
                {data.reduce((sum, item) => sum + item.soLuongGiaoDich, 0).toLocaleString('vi-VN')}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

