import { useState } from 'react'
import { useAuthStore } from '@/store/auth-store'
import { toast } from 'sonner'
import { getAuthErrorMessage } from '@/lib/auth-error-handler'

/**
 * Component ví dụ: Form đăng nhập
 */
export function DangNhap() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { dangNhap, isLoading } = useAuthStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await dangNhap(email, password)
      toast.success('Đăng nhập thành công!')
    } catch (error: any) {
      const errorMessage = getAuthErrorMessage(error)
      toast.error(errorMessage)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md p-8 border rounded-lg">
        <h2 className="text-2xl font-bold text-center">Đăng nhập</h2>
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded-md"
            placeholder="email@example.com"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1">
            Mật khẩu
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded-md"
            placeholder="••••••••"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
        >
          {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </button>
      </form>
    </div>
  )
}

