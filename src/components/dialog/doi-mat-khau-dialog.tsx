import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

const doiMatKhauSchema = z.object({
  matKhauCu: z.string().min(1, 'Vui lòng nhập mật khẩu cũ'),
  matKhauMoi: z.string().min(6, 'Mật khẩu mới phải có ít nhất 6 ký tự'),
  xacNhanMatKhau: z.string().min(1, 'Vui lòng xác nhận mật khẩu'),
}).refine((data) => data.matKhauMoi === data.xacNhanMatKhau, {
  message: 'Mật khẩu xác nhận không khớp',
  path: ['xacNhanMatKhau'],
})

type DoiMatKhauFormData = z.infer<typeof doiMatKhauSchema>

interface DoiMatKhauDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DoiMatKhauDialog({ open, onOpenChange }: DoiMatKhauDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [showMatKhauCu, setShowMatKhauCu] = useState(false)
  const [showMatKhauMoi, setShowMatKhauMoi] = useState(false)
  const [showXacNhanMatKhau, setShowXacNhanMatKhau] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<DoiMatKhauFormData>({
    resolver: zodResolver(doiMatKhauSchema),
  })

  const onSubmit = async (data: DoiMatKhauFormData) => {
    try {
      setIsLoading(true)
      
      // Cập nhật mật khẩu
      const { error } = await supabase.auth.updateUser({
        password: data.matKhauMoi,
      })

      if (error) throw error

      toast.success('Đổi mật khẩu thành công')
      reset()
      setShowMatKhauCu(false)
      setShowMatKhauMoi(false)
      setShowXacNhanMatKhau(false)
      onOpenChange(false)
    } catch (error: any) {
      toast.error(error.message || 'Đổi mật khẩu thất bại')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Đổi mật khẩu</DialogTitle>
          <DialogDescription>
            Vui lòng nhập mật khẩu cũ và mật khẩu mới của bạn
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="matKhauCu">Mật khẩu cũ</Label>
            <div className="relative">
              <Input
                id="matKhauCu"
                type={showMatKhauCu ? 'text' : 'password'}
                {...register('matKhauCu')}
                disabled={isLoading}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowMatKhauCu(!showMatKhauCu)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                tabIndex={-1}
              >
                {showMatKhauCu ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.matKhauCu && (
              <p className="text-sm text-destructive">{errors.matKhauCu.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="matKhauMoi">Mật khẩu mới</Label>
            <div className="relative">
              <Input
                id="matKhauMoi"
                type={showMatKhauMoi ? 'text' : 'password'}
                {...register('matKhauMoi')}
                disabled={isLoading}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowMatKhauMoi(!showMatKhauMoi)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                tabIndex={-1}
              >
                {showMatKhauMoi ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.matKhauMoi && (
              <p className="text-sm text-destructive">{errors.matKhauMoi.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="xacNhanMatKhau">Xác nhận mật khẩu</Label>
            <div className="relative">
              <Input
                id="xacNhanMatKhau"
                type={showXacNhanMatKhau ? 'text' : 'password'}
                {...register('xacNhanMatKhau')}
                disabled={isLoading}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowXacNhanMatKhau(!showXacNhanMatKhau)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                tabIndex={-1}
              >
                {showXacNhanMatKhau ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.xacNhanMatKhau && (
              <p className="text-sm text-destructive">{errors.xacNhanMatKhau.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset()
                onOpenChange(false)
              }}
              disabled={isLoading}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Đang xử lý...' : 'Đổi mật khẩu'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

