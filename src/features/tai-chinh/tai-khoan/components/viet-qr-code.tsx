import { useMemo } from 'react'
import { cn } from '@/lib/utils'

interface VietQRCodeProps {
  soTaiKhoan: string | null
  nganHang: string | null
  chuTaiKhoan: string | null
  className?: string
}

/**
 * Component hiển thị QR code theo chuẩn VietQR
 * Sử dụng API VietQR để tạo QR code
 */
export function VietQRCode({ soTaiKhoan, nganHang, chuTaiKhoan, className }: VietQRCodeProps) {
  // Kiểm tra có đủ thông tin để tạo QR code không
  const canGenerateQR = useMemo(() => {
    return !!(soTaiKhoan && nganHang && chuTaiKhoan)
  }, [soTaiKhoan, nganHang, chuTaiKhoan])

  // Tạo URL QR code từ VietQR API
  // Format: https://img.vietqr.io/image/{bankCode}-{accountNumber}-compact2.png?accountName={accountName}
  const qrCodeUrl = useMemo(() => {
    if (!canGenerateQR) return null

    // Tìm mã ngân hàng từ tên ngân hàng
    // Giả sử nganHang có thể là tên đầy đủ hoặc mã ngân hàng
    const bankCode = nganHang?.toUpperCase().slice(0, 3) || 'VCB' // Default Vietcombank
    
    // Encode account name
    const accountName = encodeURIComponent(chuTaiKhoan || '')
    const accountNumber = soTaiKhoan?.replace(/\s/g, '') || ''
    
    // VietQR API format
    return `https://img.vietqr.io/image/${bankCode}-${accountNumber}-compact2.png?accountName=${accountName}`
  }, [soTaiKhoan, nganHang, chuTaiKhoan, canGenerateQR])

  if (!canGenerateQR) {
    return (
      <div className={cn('flex items-center justify-center p-8 border-2 border-dashed rounded-lg', className)}>
        <p className="text-sm text-muted-foreground text-center">
          Vui lòng nhập đầy đủ số tài khoản, ngân hàng và chủ tài khoản để hiển thị QR code
        </p>
      </div>
    )
  }

  return (
    <div className={cn('flex flex-col items-center gap-4 p-4 border rounded-lg bg-muted/50', className)}>
      <div className="text-sm font-medium">Mã QR VietQR</div>
      {qrCodeUrl && (
        <div className="bg-white p-4 rounded-lg">
          <img
            src={qrCodeUrl}
            alt="VietQR Code"
            className="w-48 h-48"
            onError={(e) => {
              // Fallback nếu API không hoạt động
              const target = e.target as HTMLImageElement
              target.style.display = 'none'
            }}
          />
        </div>
      )}
      <div className="text-xs text-muted-foreground text-center max-w-xs">
        Quét mã QR để chuyển khoản nhanh
      </div>
    </div>
  )
}

