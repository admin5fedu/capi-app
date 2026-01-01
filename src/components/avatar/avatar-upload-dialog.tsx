import { useState, useRef, useCallback } from 'react'
import { Camera, Upload, X, Loader2, Image as ImageIcon } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { uploadImageToCloudinary } from '@/lib/cloudinary-upload'
import { toast } from 'sonner'

interface AvatarUploadDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentAvatarUrl?: string | null
  userName?: string
  onUploadComplete: (avatarUrl: string) => void
}

export function AvatarUploadDialog({
  open,
  onOpenChange,
  currentAvatarUrl,
  userName = 'Người dùng',
  onUploadComplete,
}: AvatarUploadDialogProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null)
  const [showCamera, setShowCamera] = useState(false)
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraVideoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Reset state when dialog opens/closes
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      // Cleanup
      if (previewUrl && selectedFile) {
        URL.revokeObjectURL(previewUrl)
      }
      stopCamera()
      setSelectedFile(null)
      setPreviewUrl(null)
      setIsDragging(false)
      setShowCamera(false)
    }
    onOpenChange(newOpen)
  }

  // Handle file selection
  const handleFileSelect = useCallback((file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Vui lòng chọn file ảnh')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Kích thước ảnh tối đa là 5MB')
      return
    }

    setSelectedFile(file)
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
    setShowCamera(false)
    stopCamera()
  }, [])

  // Handle file input change
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  // Handle drag and drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  // Camera functions
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
      })
      setCameraStream(stream)
      setShowCamera(true)
      setSelectedFile(null)
      setPreviewUrl(null)
      
      if (cameraVideoRef.current) {
        cameraVideoRef.current.srcObject = stream
      }
    } catch (error: any) {
      toast.error('Không thể truy cập camera: ' + (error.message || 'Unknown error'))
    }
  }

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop())
      setCameraStream(null)
    }
    if (cameraVideoRef.current) {
      cameraVideoRef.current.srcObject = null
    }
    setShowCamera(false)
  }

  const capturePhoto = () => {
    if (!cameraVideoRef.current || !canvasRef.current) return

    const video = cameraVideoRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    if (!ctx) return

    // Set canvas size to video size
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    // Draw video frame to canvas
    ctx.drawImage(video, 0, 0)

    // Convert canvas to blob
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], 'camera-photo.jpg', { type: 'image/jpeg' })
        handleFileSelect(file)
      }
    }, 'image/jpeg', 0.9)

    stopCamera()
  }

  // Upload image
  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Vui lòng chọn ảnh')
      return
    }

    setIsUploading(true)
    try {
      const result = await uploadImageToCloudinary(selectedFile, 'avatars')
      
      // Cleanup preview URL
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }

      onUploadComplete(result.secure_url)
      toast.success('Cập nhật avatar thành công')
      handleOpenChange(false)
    } catch (error: any) {
      toast.error(error.message || 'Lỗi khi upload ảnh')
    } finally {
      setIsUploading(false)
    }
  }

  // Get display image
  const displayImage = previewUrl || currentAvatarUrl

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Sửa hình ảnh đại diện</DialogTitle>
          <DialogDescription>
            Tải ảnh từ thiết bị, chụp ảnh từ camera hoặc kéo thả ảnh vào đây
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Preview Area */}
          <div className="flex justify-center">
            <div className="relative">
              <Avatar className="h-32 w-32">
                {displayImage ? (
                  <AvatarImage src={displayImage} alt={userName} />
                ) : null}
                <AvatarFallback className="text-2xl">
                  {userName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {previewUrl && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                  <span className="text-white text-xs font-medium">Xem trước</span>
                </div>
              )}
            </div>
          </div>

          {/* Camera View */}
          {showCamera && (
            <div className="space-y-2">
              <div className="relative aspect-square bg-black rounded-lg overflow-hidden">
                <video
                  ref={cameraVideoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={capturePhoto}
                  className="flex-1"
                >
                  <Camera className="h-4 w-4 mr-2" />
                  Chụp ảnh
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={stopCamera}
                  className="flex-1"
                >
                  Hủy
                </Button>
              </div>
            </div>
          )}

          {/* Upload Area */}
          {!showCamera && (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={cn(
                'border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer',
                isDragging && 'border-primary bg-primary/5',
                !isDragging && 'border-muted-foreground/25 hover:border-primary/50',
                selectedFile && 'border-primary bg-primary/5'
              )}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileInputChange}
                className="hidden"
              />
              
              {selectedFile ? (
                <div className="space-y-2">
                  <ImageIcon className="h-8 w-8 mx-auto text-primary" />
                  <p className="text-sm font-medium">{selectedFile.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(selectedFile.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                  <p className="text-sm font-medium">
                    Kéo thả ảnh vào đây hoặc click để chọn
                  </p>
                  <p className="text-xs text-muted-foreground">
                    JPG, PNG, GIF tối đa 5MB
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          {!showCamera && (
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={startCamera}
                className="flex-1"
                disabled={isUploading}
              >
                <Camera className="h-4 w-4 mr-2" />
                Chụp ảnh
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="flex-1"
                disabled={isUploading}
              >
                <Upload className="h-4 w-4 mr-2" />
                Chọn ảnh
              </Button>
            </div>
          )}

          {/* Remove current avatar */}
          {currentAvatarUrl && !selectedFile && (
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                onUploadComplete('')
                toast.success('Đã xóa avatar')
                handleOpenChange(false)
              }}
              className="w-full text-destructive hover:text-destructive"
              disabled={isUploading}
            >
              <X className="h-4 w-4 mr-2" />
              Xóa avatar hiện tại
            </Button>
          )}
        </div>

        {/* Hidden canvas for camera capture */}
        <canvas ref={canvasRef} className="hidden" />

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isUploading}
          >
            Hủy
          </Button>
          <Button
            type="button"
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Đang tải lên...
              </>
            ) : (
              'Lưu'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

