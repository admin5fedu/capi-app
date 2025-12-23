import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import React, { ReactNode } from 'react'
import { ArrowUpRight, ArrowDownRight } from 'lucide-react'

export interface GenericMetricCardProps {
  label: string
  value: string | number
  icon?: ReactNode
  trend?: {
    value: number
    label?: string
    isPositive?: boolean
  }
  description?: string
  className?: string
  valueClassName?: string
  iconBackground?: 'default' | 'green' | 'red' | 'blue' | 'yellow' | 'purple'
  showIconBackground?: boolean
  size?: 'sm' | 'md' | 'lg'
  layout?: 'horizontal' | 'vertical'
}

const ICON_BACKGROUND_CLASSES = {
  default: 'bg-muted',
  green: 'bg-green-100 dark:bg-green-900/20',
  red: 'bg-red-100 dark:bg-red-900/20',
  blue: 'bg-blue-100 dark:bg-blue-900/20',
  yellow: 'bg-yellow-100 dark:bg-yellow-900/20',
  purple: 'bg-purple-100 dark:bg-purple-900/20',
}

const ICON_COLORS = {
  default: 'text-muted-foreground',
  green: 'text-green-600 dark:text-green-400',
  red: 'text-red-600 dark:text-red-400',
  blue: 'text-blue-600 dark:text-blue-400',
  yellow: 'text-yellow-600 dark:text-yellow-400',
  purple: 'text-purple-600 dark:text-purple-400',
}

/**
 * Generic Metric Card Component
 * Reusable metric card for dashboards
 */
export function GenericMetricCard({
  label,
  value,
  icon,
  trend,
  description,
  className,
  valueClassName,
  iconBackground = 'default',
  showIconBackground = true,
  size = 'md',
  layout = 'horizontal',
}: GenericMetricCardProps) {
  const sizeClasses = {
    sm: {
      padding: 'p-3',
      iconSize: 'h-8 w-8',
      iconInnerSize: 'h-4 w-4',
      valueSize: 'text-lg',
      labelSize: 'text-[10px]',
    },
    md: {
      padding: 'p-4',
      iconSize: 'h-10 w-10',
      iconInnerSize: 'h-5 w-5',
      valueSize: 'text-xl',
      labelSize: 'text-xs',
    },
    lg: {
      padding: 'p-5',
      iconSize: 'h-12 w-12',
      iconInnerSize: 'h-6 w-6',
      valueSize: 'text-2xl',
      labelSize: 'text-sm',
    },
  }

  const currentSize = sizeClasses[size]
  const isPositive = trend?.isPositive ?? (trend?.value !== undefined ? trend.value >= 0 : undefined)
  const TrendIcon = isPositive === true ? ArrowUpRight : isPositive === false ? ArrowDownRight : null
  
  // Helper to render icon with proper size
  const renderIcon = () => {
    if (!icon) return null
    
    if (React.isValidElement(icon)) {
      return React.cloneElement(icon as React.ReactElement, { 
        className: cn(currentSize.iconInnerSize, (icon as React.ReactElement).props?.className) 
      })
    }
    
    return <div className={currentSize.iconInnerSize}>{icon}</div>
  }

  return (
    <Card className={cn('relative overflow-hidden', className)}>
      <CardContent className={cn(currentSize.padding)}>
        {layout === 'horizontal' ? (
          <div className="flex items-center justify-between">
            <div className="space-y-1 flex-1">
              <p className={cn('text-muted-foreground', currentSize.labelSize)}>{label}</p>
              <p className={cn('font-bold', currentSize.valueSize, valueClassName)}>{value}</p>
              {trend && (
                <div
                  className={cn(
                    'flex items-center gap-1',
                    currentSize.labelSize,
                    isPositive === true
                      ? 'text-green-600 dark:text-green-400'
                      : isPositive === false
                      ? 'text-red-600 dark:text-red-400'
                      : 'text-muted-foreground'
                  )}
                >
                  {TrendIcon && <TrendIcon className="h-3 w-3" />}
                  <span>
                    {trend.value > 0 ? '+' : ''}
                    {trend.value}%
                  </span>
                  {trend.label && (
                    <span className="text-muted-foreground ml-1">{trend.label}</span>
                  )}
                </div>
              )}
              {description && (
                <p className={cn('text-muted-foreground', currentSize.labelSize)}>{description}</p>
              )}
            </div>
            {icon && (
              <div
                className={cn(
                  'rounded-full flex items-center justify-center flex-shrink-0',
                  currentSize.iconSize,
                  showIconBackground && ICON_BACKGROUND_CLASSES[iconBackground],
                  !showIconBackground && 'text-muted-foreground'
                )}
              >
                <div className={cn(showIconBackground ? ICON_COLORS[iconBackground] : 'text-muted-foreground')}>
                  {renderIcon()}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className={cn('text-muted-foreground', currentSize.labelSize)}>{label}</p>
              {icon && (
                <div
                  className={cn(
                    'rounded-full flex items-center justify-center',
                    currentSize.iconSize,
                    showIconBackground && ICON_BACKGROUND_CLASSES[iconBackground]
                  )}
                >
                  <div className={cn(showIconBackground ? ICON_COLORS[iconBackground] : 'text-muted-foreground')}>
                    {renderIcon()}
                  </div>
                </div>
              )}
            </div>
            <p className={cn('font-bold', currentSize.valueSize, valueClassName)}>{value}</p>
            {trend && (
              <div
                className={cn(
                  'flex items-center gap-1',
                  currentSize.labelSize,
                  isPositive === true
                    ? 'text-green-600 dark:text-green-400'
                    : isPositive === false
                    ? 'text-red-600 dark:text-red-400'
                    : 'text-muted-foreground'
                )}
              >
                {TrendIcon && <TrendIcon className="h-3 w-3" />}
                <span>
                  {trend.value > 0 ? '+' : ''}
                  {trend.value}%
                </span>
                {trend.label && (
                  <span className="text-muted-foreground ml-1">{trend.label}</span>
                )}
              </div>
            )}
            {description && (
              <p className={cn('text-muted-foreground', currentSize.labelSize)}>{description}</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

