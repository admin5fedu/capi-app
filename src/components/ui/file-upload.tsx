import * as React from 'react'
import { cn } from '@/lib/utils'
import { Upload, X, File, Image as ImageIcon } from 'lucide-react'
import { Button } from './button'

export interface FileUploadProps {
  value?: File | string | null
  onChange?: (file: File | null) => void
  accept?: string
  maxSize?: number // in MB
  className?: string
  disabled?: boolean
  preview?: boolean
  label?: string
  helperText?: string
}

const FileUpload = React.forwardRef<HTMLInputElement, FileUploadProps>(
  ({ 
    value, 
    onChange, 
    accept,
    maxSize = 10,
    className,
    disabled = false,
    preview = true,
    label = 'Tải lên file',
    helperText,
    ...props 
  }, ref) => {
    const inputRef = React.useRef<HTMLInputElement>(null)
    const [previewUrl, setPreviewUrl] = React.useState<string | null>(null)
    const [error, setError] = React.useState<string | null>(null)
    const [isDragging, setIsDragging] = React.useState(false)

    // Helper function to check if value is a File object
    const isFile = (val: any): val is File => {
      if (val == null || typeof val !== 'object') return false
      // Check if it has File-like properties
      return (
        typeof val.name === 'string' &&
        typeof val.size === 'number' &&
        typeof val.type === 'string' &&
        val instanceof Blob
      )
    }

    // Generate preview URL
    React.useEffect(() => {
      if (isFile(value)) {
        const url = URL.createObjectURL(value)
        setPreviewUrl(url)
        return () => URL.revokeObjectURL(url)
      } else if (typeof value === 'string' && value) {
        setPreviewUrl(value)
      } else {
        setPreviewUrl(null)
      }
    }, [value])

    const handleFileSelect = (file: File) => {
      setError(null)

      // Check file size
      if (file.size > maxSize * 1024 * 1024) {
        setError(`File quá lớn. Kích thước tối đa: ${maxSize}MB`)
        return
      }

      onChange?.(file)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) {
        handleFileSelect(file)
      }
    }

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      setIsDragging(false)

      const file = e.dataTransfer.files?.[0]
      if (file) {
        handleFileSelect(file)
      }
    }

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      setIsDragging(true)
    }

    const handleDragLeave = () => {
      setIsDragging(false)
    }

    const handleRemove = () => {
      onChange?.(null)
      if (inputRef.current) {
        inputRef.current.value = ''
      }
      setError(null)
    }

    const isImage = previewUrl && /\.(jpg|jpeg|png|gif|webp)$/i.test(
      isFile(value) ? value.name : previewUrl
    )

    return (
      <div className={cn('w-full', className)}>
        {!previewUrl ? (
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={cn(
              'border-2 border-dashed rounded-lg p-6 text-center transition-colors',
              isDragging && 'border-primary bg-primary/5',
              !isDragging && 'border-muted-foreground/25',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
          >
            <input
              {...props}
              ref={ref || inputRef}
              type="file"
              accept={accept}
              onChange={handleChange}
              disabled={disabled}
              className="hidden"
            />
            <Upload className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
            <p className="text-sm font-medium mb-1">{label}</p>
            <p className="text-xs text-muted-foreground mb-4">
              Kéo thả file vào đây hoặc click để chọn
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => inputRef.current?.click()}
              disabled={disabled}
            >
              Chọn file
            </Button>
            {helperText && (
              <p className="text-xs text-muted-foreground mt-2">{helperText}</p>
            )}
            {accept && (
              <p className="text-xs text-muted-foreground mt-1">
                Định dạng: {accept}
              </p>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              Tối đa: {maxSize}MB
            </p>
          </div>
        ) : (
          <div className="border rounded-lg p-4">
            <div className="flex items-start gap-4">
              {isImage ? (
                <div className="flex-shrink-0">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-20 h-20 object-cover rounded-md"
                  />
                </div>
              ) : (
                <div className="flex-shrink-0 w-20 h-20 bg-muted rounded-md flex items-center justify-center">
                  <File className="h-8 w-8 text-muted-foreground" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {isImage ? (
                    <ImageIcon className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <File className="h-4 w-4 text-muted-foreground" />
                  )}
                  <p className="text-sm font-medium truncate">
                    {isFile(value) ? value.name : 'File đã tải lên'}
                  </p>
                </div>
                {isFile(value) && (
                  <p className="text-xs text-muted-foreground">
                    {(value.size / 1024).toFixed(2)} KB
                  </p>
                )}
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={handleRemove}
                disabled={disabled}
                className="flex-shrink-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            {preview && isImage && (
              <div className="mt-4">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full max-h-64 object-contain rounded-md border"
                />
              </div>
            )}
          </div>
        )}
        {error && (
          <p className="text-xs text-destructive mt-2">{error}</p>
        )}
      </div>
    )
  }
)
FileUpload.displayName = 'FileUpload'

export { FileUpload }

