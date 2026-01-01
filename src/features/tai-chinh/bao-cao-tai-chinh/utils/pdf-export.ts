import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import type { BaoCaoData } from '@/types/bao-cao-tai-chinh'
import dayjs from 'dayjs'

export function exportBaoCaoToPDF(data: BaoCaoData, filters?: Record<string, any>) {
  const doc = new jsPDF('landscape', 'mm', 'a4')
  
  // Helper function to format currency
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  // Helper function to format date
  const formatDate = (date: string | Date): string => {
    return dayjs(date).format('DD/MM/YYYY')
  }

  // Title
  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  doc.text('BÁO CÁO TÀI CHÍNH', 14, 15)

  // Date range
  if (filters?.tuNgay || filters?.denNgay) {
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    const dateRange = `Từ ngày: ${filters.tuNgay ? formatDate(filters.tuNgay) : '...'} - Đến ngày: ${filters.denNgay ? formatDate(filters.denNgay) : '...'}`
    doc.text(dateRange, 14, 22)
  }

  // Export date
  doc.setFontSize(9)
  doc.text(`Ngày xuất: ${dayjs().format('DD/MM/YYYY HH:mm')}`, 14, 27)

  // Summary section
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text('TỔNG HỢP', 14, 35)

  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  const summaryY = 40
  doc.text(`Tổng thu: ${formatCurrency(data.summary.tongThu)}`, 14, summaryY)
  doc.text(`Tổng chi: ${formatCurrency(data.summary.tongChi)}`, 14, summaryY + 5)
  doc.text(`Số dư: ${formatCurrency(data.summary.soDu)}`, 14, summaryY + 10)
  doc.text(`Số lượng giao dịch: ${data.summary.soLuongGiaoDich.toLocaleString('vi-VN')}`, 14, summaryY + 15)

  // Table data
  const tableData = data.giaoDich.map((gd) => [
    gd.ma_phieu || '',
    formatDate(gd.ngay),
    gd.loai === 'thu' ? 'Thu' : gd.loai === 'chi' ? 'Chi' : 'Luân chuyển',
    gd.danh_muc?.ten || '',
    gd.mo_ta || '',
    formatCurrency(gd.so_tien_vnd || gd.so_tien),
    gd.tai_khoan?.ten || '',
    gd.tai_khoan_den?.ten || '',
    gd.doi_tac?.ten || '',
    gd.nguoi_tao?.ho_va_ten || gd.nguoi_tao?.ho_ten || '',
  ])

  // Table headers
  const headers = [
    'Mã phiếu',
    'Ngày',
    'Loại',
    'Danh mục',
    'Mô tả',
    'Số tiền',
    'Tài khoản đi',
    'Tài khoản đến',
    'Đối tác',
    'Người tạo',
  ]

  // Add table
  autoTable(doc, {
    head: [headers],
    body: tableData,
    startY: summaryY + 22,
    styles: {
      fontSize: 8,
      cellPadding: 2,
    },
    headStyles: {
      fillColor: [66, 139, 202],
      textColor: 255,
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
    columnStyles: {
      0: { cellWidth: 25 }, // Mã phiếu
      1: { cellWidth: 20 }, // Ngày
      2: { cellWidth: 20 }, // Loại
      3: { cellWidth: 30 }, // Danh mục
      4: { cellWidth: 40 }, // Mô tả
      5: { cellWidth: 30, halign: 'right' }, // Số tiền
      6: { cellWidth: 30 }, // Tài khoản đi
      7: { cellWidth: 30 }, // Tài khoản đến
      8: { cellWidth: 30 }, // Đối tác
      9: { cellWidth: 25 }, // Người tạo
    },
    margin: { left: 14, right: 14 },
    didDrawPage: (data) => {
      // Add page number
      doc.setFontSize(9)
      doc.text(
        `Trang ${data.pageNumber}`,
        doc.internal.pageSize.getWidth() / 2,
        doc.internal.pageSize.getHeight() - 10,
        { align: 'center' }
      )
    },
  })

  // Generate filename
  const dateStr = dayjs().format('YYYY-MM-DD')
  const filename = `Bao-cao-tai-chinh-${dateStr}.pdf`

  // Save PDF
  doc.save(filename)
}

