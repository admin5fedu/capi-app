import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BaoCaoToolbar } from './bao-cao-toolbar'
import { BaoCaoDashboard } from './bao-cao-dashboard'
import { BaoCaoChiTietTable } from './bao-cao-chi-tiet-table'
import { BaoCaoCharts } from './bao-cao-charts'
import { BaoCaoSummaryTables } from './bao-cao-summary-tables'
import { useBaoCao } from '../hooks/use-bao-cao'
import { useDanhMucList } from '@/features/tai-chinh/danh-muc/hooks/use-danh-muc'
import { getDoiTacList } from '@/api/doi-tac'
import { getNguoiDungList } from '@/api/nguoi-dung'
import { getTaiKhoanList } from '@/api/tai-khoan'
import { useQuery } from '@tanstack/react-query'
import type { BaoCaoFilters as BaoCaoFiltersType } from '@/types/bao-cao-tai-chinh'
import dayjs from 'dayjs'
import { useNavigate } from 'react-router-dom'

export function BaoCaoView() {
  const navigate = useNavigate()
  
  // Initialize filters with default date range (current month)
  const [filters, setFilters] = useState<BaoCaoFiltersType>(() => {
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
  const { data: baoCaoData, isLoading, error } = useBaoCao(filters, undefined, undefined)

  const handleRowClick = (giaoDich: any) => {
    navigate(`/tai-chinh/thu-chi/${giaoDich.id}`)
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-destructive">Lỗi: {error instanceof Error ? error.message : 'Không thể tải dữ liệu'}</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Toolbar - Fixed at top */}
      <div className="flex-shrink-0">
        <BaoCaoToolbar
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
          {/* Dashboard */}
          {baoCaoData && (
            <BaoCaoDashboard
              summary={baoCaoData.summary}
              soSanhKy={baoCaoData.soSanhKy}
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
                <BaoCaoCharts
                  groupedByTime={baoCaoData.groupedByTime}
                  groupedByDanhMuc={baoCaoData.groupedByDanhMuc}
                  groupedByDoiTac={baoCaoData.groupedByDoiTac}
                  topDanhMuc={baoCaoData.topDanhMuc}
                  topDoiTac={baoCaoData.topDoiTac}
                  giaoDich={baoCaoData.giaoDich}
                  summary={baoCaoData.summary}
                />
              )}

              {/* Summary Tables */}
              {baoCaoData && (
                <BaoCaoSummaryTables
                  groupedByDanhMuc={baoCaoData.groupedByDanhMuc}
                  groupedByDoiTac={baoCaoData.groupedByDoiTac}
                  groupedByLoai={baoCaoData.groupedByLoai}
                  groupedByNguoiTao={baoCaoData.groupedByNguoiTao}
                  groupedByTime={baoCaoData.groupedByTime}
                  groupedByTaiKhoan={baoCaoData.groupedByTaiKhoan}
                  groupedByLoaiTien={baoCaoData.groupedByLoaiTien}
                  groupedByTuan={baoCaoData.groupedByTuan}
                  topGiaoDich={baoCaoData.topGiaoDich}
                  soSanhKy={baoCaoData.soSanhKy}
                />
              )}
            </TabsContent>

            <TabsContent value="chi-tiet" className="mt-6">
              {baoCaoData && (
                <BaoCaoChiTietTable
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

