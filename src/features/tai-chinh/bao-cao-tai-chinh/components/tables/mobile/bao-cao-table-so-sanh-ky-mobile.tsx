import { Card, CardContent } from '@/components/ui/card'
import type { BaoCaoSoSanhKy } from '@/types/bao-cao-tai-chinh'
import { formatCurrency } from '../../bao-cao-table-utils'
import { cn } from '@/lib/utils'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface BaoCaoTableSoSanhKyMobileProps {
  data: BaoCaoSoSanhKy
}

export function BaoCaoTableSoSanhKyMobile({ data }: BaoCaoTableSoSanhKyMobileProps) {
  const rows = [
    {
      label: 'Tổng thu',
      hienTai: data.kyHienTai.tongThu,
      truoc: data.kyTruoc.tongThu,
      thayDoi: data.thayDoi.tongThu,
      color: 'text-green-600 dark:text-green-400',
      isPositive: data.thayDoi.tongThu >= 0,
    },
    {
      label: 'Tổng chi',
      hienTai: data.kyHienTai.tongChi,
      truoc: data.kyTruoc.tongChi,
      thayDoi: data.thayDoi.tongChi,
      color: 'text-red-600 dark:text-red-400',
      isPositive: data.thayDoi.tongChi >= 0,
    },
    {
      label: 'Số dư',
      hienTai: data.kyHienTai.soDu,
      truoc: data.kyTruoc.soDu,
      thayDoi: data.thayDoi.soDu,
      color: data.kyHienTai.soDu >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400',
      isPositive: data.thayDoi.soDu >= 0,
    },
    {
      label: 'Số lượng giao dịch',
      hienTai: data.kyHienTai.soLuongGiaoDich,
      truoc: data.kyTruoc.soLuongGiaoDich,
      thayDoi: data.thayDoi.soLuongGiaoDich,
      color: '',
      isPositive: data.thayDoi.soLuongGiaoDich >= 0,
    },
  ]

  return (
    <div className="space-y-3 p-4">
      {rows.map((row) => (
        <Card key={row.label}>
          <CardContent className="p-4 space-y-3">
            <div className="font-semibold text-base">{row.label}</div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-muted-foreground text-xs">Kỳ hiện tại</div>
                <div className={cn('font-medium', row.color || '')}>
                  {row.label === 'Số lượng giao dịch' 
                    ? row.hienTai.toLocaleString('vi-VN')
                    : formatCurrency(row.hienTai)}
                </div>
              </div>
              <div>
                <div className="text-muted-foreground text-xs">Kỳ trước</div>
                <div className="text-muted-foreground">
                  {row.label === 'Số lượng giao dịch' 
                    ? row.truoc.toLocaleString('vi-VN')
                    : formatCurrency(row.truoc)}
                </div>
              </div>
            </div>
            <div className="pt-2 border-t">
              <div className="flex items-center justify-between">
                <div className="text-muted-foreground text-xs">Thay đổi</div>
                <div className={cn(
                  'flex items-center gap-1 font-medium',
                  row.isPositive 
                    ? (row.label === 'Tổng chi' ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400')
                    : (row.label === 'Tổng chi' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400')
                )}>
                  {row.isPositive ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                  {row.thayDoi >= 0 ? '+' : ''}{row.thayDoi.toFixed(1)}%
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

