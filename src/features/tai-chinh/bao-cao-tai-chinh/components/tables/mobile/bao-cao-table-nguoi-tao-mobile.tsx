import { Card, CardContent } from '@/components/ui/card'
import type { BaoCaoGroupedByNguoiTao } from '@/types/bao-cao-tai-chinh'
import { formatCurrency, formatPercent } from '../../bao-cao-table-utils'
import { cn } from '@/lib/utils'

interface BaoCaoTableNguoiTaoMobileProps {
  data: BaoCaoGroupedByNguoiTao[]
}

export function BaoCaoTableNguoiTaoMobile({ data }: BaoCaoTableNguoiTaoMobileProps) {
  const total = data.reduce((sum, item) => sum + item.tongThu + item.tongChi, 0)

  return (
    <div className="space-y-3 p-4">
      {data
        .sort((a, b) => (b.tongThu + b.tongChi) - (a.tongThu + a.tongChi))
        .map((item) => {
          const itemTotal = item.tongThu + item.tongChi
          return (
            <Card key={item.nguoiTaoId}>
              <CardContent className="p-4 space-y-2">
                <div className="font-semibold text-base">{item.nguoiTaoTen}</div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <div className="text-muted-foreground text-xs">Tổng thu</div>
                    <div className="text-green-600 dark:text-green-400 font-medium">
                      {formatCurrency(item.tongThu)}
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground text-xs">Tổng chi</div>
                    <div className="text-red-600 dark:text-red-400 font-medium">
                      {formatCurrency(item.tongChi)}
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground text-xs">Số dư</div>
                    <div className={cn(
                      'font-medium',
                      item.soDu >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                    )}>
                      {formatCurrency(item.soDu)}
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground text-xs">SL GD</div>
                    <div className="font-medium">
                      {item.soLuongGiaoDich.toLocaleString('vi-VN')}
                    </div>
                  </div>
                </div>
                <div className="pt-2 border-t">
                  <div className="text-xs text-muted-foreground">
                    Tỷ lệ: {formatPercent(itemTotal, total)}
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
              <div className="text-muted-foreground text-xs">Tổng thu</div>
              <div className="text-green-600 dark:text-green-400 font-medium">
                {formatCurrency(data.reduce((sum, item) => sum + item.tongThu, 0))}
              </div>
            </div>
            <div>
              <div className="text-muted-foreground text-xs">Tổng chi</div>
              <div className="text-red-600 dark:text-red-400 font-medium">
                {formatCurrency(data.reduce((sum, item) => sum + item.tongChi, 0))}
              </div>
            </div>
            <div>
              <div className="text-muted-foreground text-xs">Số dư</div>
              <div className="font-medium">
                {formatCurrency(data.reduce((sum, item) => sum + item.soDu, 0))}
              </div>
            </div>
            <div>
              <div className="text-muted-foreground text-xs">SL GD</div>
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

