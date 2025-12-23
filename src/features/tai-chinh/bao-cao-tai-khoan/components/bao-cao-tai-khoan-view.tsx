import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BaoCaoTaiKhoanToolbar } from './bao-cao-tai-khoan-toolbar'
import { BaoCaoTaiKhoanDashboard } from './bao-cao-tai-khoan-dashboard'
import { BaoCaoTaiKhoanChiTietTable } from './bao-cao-tai-khoan-chi-tiet-table'
import { BaoCaoTaiKhoanCharts } from './bao-cao-tai-khoan-charts'
import { BaoCaoTaiKhoanSummaryTables } from './bao-cao-tai-khoan-summary-tables'
import { useBaoCaoTaiKhoan } from '../hooks/use-bao-cao-tai-khoan'
import { useDanhMucList } from '@/features/tai-chinh/danh-muc/hooks/use-danh-muc'
import { getDoiTacList } from '@/api/doi-tac'
import { getNguoiDungList } from '@/api/nguoi-dung'
import { getTaiKhoanList } from '@/api/tai-khoan'
import { useQuery } from '@tanstack/react-query'
import type { BaoCaoTaiKhoanFilters } from '@/types/bao-cao-tai-khoan'
import dayjs from 'dayjs'

export function BaoCaoTaiKhoanView() {
  
  // Initialize filters with default date range (current month)
  const [filters, setFilters] = useState<BaoCaoTaiKhoanFilters>(() => {
    const now = dayjs()
    return {
      tuNgay: now.startOf('month').format('YYYY-MM-DD'),
      denNgay: now.endOf('month').format('YYYY-MM-DD'),
    }
  })

  const [activeTab, setActiveTab] = useState<'dashboard' | 'chi-tiet'>('dashboard')

  // Fetch reference data
  const { data: danhMucList = [] } = useDanhMucList()
  const { data: doiTacList = [] } = useQuery({
    queryKey: ['doi-tac-list'],
    queryFn: () => getDoiTacList(),
  })
  const { data: nguoiDungList = [] } = useQuery({
    queryKey: ['nguoi-dung-list'],
    queryFn: () => getNguoiDungList(),
  })
  const { data: taiKhoanList = [] } = useQuery({
    queryKey: ['tai-khoan-list'],
    queryFn: () => getTaiKhoanList(),
  })

  // Fetch report data
  const { data: baoCaoData, isLoading, error } = useBaoCaoTaiKhoan(filters)

  const handleRowClick = (_giaoDich: any) => {
    // Navigate to giao dich detail if needed
    // navigate(`/tai-chinh/thu-chi/${giaoDich.id}`)
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-destructive">Lỗi tải dữ liệu: {error.message}</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Toolbar - Fixed at top */}
      <div className="flex-shrink-0">
        <BaoCaoTaiKhoanToolbar
          filters={filters}
          onFiltersChange={setFilters}
          danhMucList={danhMucList}
          doiTacList={doiTacList}
          nguoiDungList={nguoiDungList}
          taiKhoanList={taiKhoanList}
          isLoading={isLoading}
          baoCaoData={baoCaoData}
        />
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="p-6 space-y-6">
          {/* Dashboard KPI Cards - Outside tabs, before tabs */}
          {baoCaoData && (
            <BaoCaoTaiKhoanDashboard 
              summary={baoCaoData.summary} 
              isLoading={isLoading} 
            />
          )}

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'dashboard' | 'chi-tiet')}>
            <TabsList>
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="chi-tiet">Chi tiết</TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="space-y-6 mt-6">
              {/* Charts */}
              {baoCaoData && (
                <BaoCaoTaiKhoanCharts
                  groupedByTime={baoCaoData.groupedByTime}
                  groupedByTaiKhoan={baoCaoData.groupedByTaiKhoan}
                  groupedByLoaiTaiKhoan={baoCaoData.groupedByLoaiTaiKhoan}
                  groupedByLoaiTien={baoCaoData.groupedByLoaiTien}
                  giaoDich={baoCaoData.giaoDich}
                  summary={baoCaoData.summary}
                />
              )}

              {/* Summary Tables */}
              {baoCaoData && (
                <BaoCaoTaiKhoanSummaryTables
                  groupedByTaiKhoan={baoCaoData.groupedByTaiKhoan}
                  groupedByTime={baoCaoData.groupedByTime}
                  groupedByLoaiTaiKhoan={baoCaoData.groupedByLoaiTaiKhoan}
                  groupedByLoaiTien={baoCaoData.groupedByLoaiTien}
                />
              )}

              {isLoading && (
                <div className="flex items-center justify-center py-12">
                  <div className="text-muted-foreground">Đang tải dữ liệu...</div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="chi-tiet" className="mt-6">
              {baoCaoData && (
                <BaoCaoTaiKhoanChiTietTable
                  data={baoCaoData.giaoDich}
                  isLoading={isLoading}
                  onRowClick={handleRowClick}
                />
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

