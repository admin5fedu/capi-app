import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Maximize2, X } from 'lucide-react'

interface BaoCaoTableWrapperProps {
  title: string
  icon: React.ReactNode
  children: React.ReactNode
  mobileView?: React.ReactNode
}

export function BaoCaoTableWrapper({ 
  title, 
  icon, 
  children, 
  mobileView 
}: BaoCaoTableWrapperProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)

  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {icon}
              <CardTitle className="text-base text-primary">{title}</CardTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0"
              onClick={() => setIsFullscreen(true)}
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {/* Desktop: Table view */}
          <div className="hidden md:block">
            {children}
          </div>
          {/* Mobile: Card view */}
          <div className="block md:hidden">
            {mobileView || children}
          </div>
        </CardContent>
      </Card>

      {/* Fullscreen Dialog */}
      <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 flex flex-col">
          <DialogHeader className="px-6 pt-6 pb-4 border-b flex-shrink-0">
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center gap-2 text-primary">
                {icon}
                {title}
              </DialogTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsFullscreen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>
          <div className="px-6 py-4 flex-1 min-h-0 overflow-auto">
            {children}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

