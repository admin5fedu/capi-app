import { useState, useRef, useCallback } from 'react'
import { Camera, Upload, X, Loader2, Image as ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { uploadImageToCloudinary } from '@/lib/cloudinary-upload'
import { toast } from 'sonner'
import { UseFormReturn } from 'react-hook-form'

interface AvatarUploadFieldProps {
  form: UseFormReturn<any>
  fieldName: string
  currentAvatarUrl?: string | null
  userName?: string
  disabled?: boolean
}

export function AvatarUploadField({
  form,
  fieldName,
  currentAvatarUrl,
  userName = 'Người dùng',
  disabled = false,
}: AvatarUploadFieldProps) {
  const { watch, setValue } = form
  const avatarUrl = watch(fieldName) || currentAvatarUrl

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null)
  const [showCamera, setShowCamera] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraVideoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

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

      // Set form value
      setValue(fieldName, result.secure_url, { shouldValidate: true })
      setSelectedFile(null)
      setPreviewUrl(null)
      toast.success('Tải ảnh lên thành công')
    } catch (error: any) {
      toast.error(error.message || 'Lỗi khi upload ảnh')
    } finally {
      setIsUploading(false)
    }
  }

  // Remove avatar
  const handleRemove = () => {
    setValue(fieldName, '', { shouldValidate: true })
    setSelectedFile(null)
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
      setPreviewUrl(null)
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // Get display image
  const displayImage = previewUrl || avatarUrl

  // Get user initial
  const getUserInitial = (name?: string | null) => {
    if (!name) return null
    const parts = name.trim().split(' ')
    if (parts.length > 0) {
      return parts[parts.length - 1].charAt(0).toUpperCase()
    }
    return name.charAt(0).toUpperCase()
  }

  return (
    <div className="space-y-4">
      {/* Preview Avatar */}
      <div className="flex justify-center">
        <div className="relative">
          <Avatar className="h-24 w-24 border-2 border-border">
            {displayImage ? <AvatarImage src={displayImage} alt={userName} /> : null}
            <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-semibold">
              {getUserInitial(userName) || <ImageIcon className="h-8 w-8" />}
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
          <div className="relative aspect-square bg-black rounded-lg overflow-hidden max-w-xs mx-auto">
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
              disabled={isUploading || disabled}
            >
              <Camera className="h-4 w-4 mr-2" />
              Chụp ảnh
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={stopCamera}
              className="flex-1"
              disabled={isUploading || disabled}
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
            'border-2 border-dashed rounded-lg p-4 text-center transition-colors cursor-pointer',
            isDragging && 'border-primary bg-primary/5',
            !isDragging && 'border-muted-foreground/25 hover:border-primary/50',
            selectedFile && 'border-primary bg-primary/5',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
          onClick={() => !disabled && fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInputChange}
            className="hidden"
            disabled={disabled}
          />

          {selectedFile ? (
            <div className="space-y-2">
              <ImageIcon className="h-6 w-6 mx-auto text-primary" />
              <p className="text-sm font-medium">{selectedFile.name}</p>
              <p className="text-xs text-muted-foreground">
                {(selectedFile.size / 1024).toFixed(2)} KB
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <Upload className="h-6 w-6 mx-auto text-muted-foreground" />
              <p className="text-sm font-medium">
                Kéo thả ảnh vào đây hoặc click để chọn
              </p>
              <p className="text-xs text-muted-foreground">JPG, PNG, GIF tối đa 5MB</p>
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
            disabled={isUploading || disabled}
            size="sm"
          >
            <Camera className="h-4 w-4 mr-2" />
            Chụp ảnh
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="flex-1"
            disabled={isUploading || disabled}
            size="sm"
          >
            <Upload className="h-4 w-4 mr-2" />
            Chọn ảnh
          </Button>
        </div>
      )}

      {/* Upload/Remove Buttons */}
      {selectedFile && !showCamera && (
        <div className="flex gap-2">
          <Button
            type="button"
            onClick={handleUpload}
            disabled={isUploading || disabled}
            className="flex-1"
            size="sm"
          >
            {isUploading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Đang tải lên...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Tải lên
              </>
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleRemove}
            disabled={isUploading || disabled}
            size="sm"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Remove current avatar */}
      {avatarUrl && !selectedFile && !showCamera && (
        <Button
          type="button"
          variant="ghost"
          onClick={handleRemove}
          className="w-full text-destructive hover:text-destructive"
          disabled={isUploading || disabled}
          size="sm"
        >
          <X className="h-4 w-4 mr-2" />
          Xóa avatar hiện tại
        </Button>
      )}

      {/* Hidden canvas for camera capture */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}

