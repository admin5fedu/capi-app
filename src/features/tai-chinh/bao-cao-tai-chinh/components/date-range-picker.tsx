import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { DatePicker } from '@/components/ui/date-picker'
import { Calendar, ChevronDown } from 'lucide-react'
import dayjs from 'dayjs'

interface DateRangePickerProps {
  tuNgay?: string | null
  denNgay?: string | null
  onChange: (tuNgay: string | null, denNgay: string | null) => void
  disabled?: boolean
}

const QUICK_SELECT_OPTIONS = [
  {
    label: 'Hôm nay',
    getRange: () => {
      const today = dayjs()
      return {
        tuNgay: today.format('YYYY-MM-DD'),
        denNgay: today.format('YYYY-MM-DD'),
      }
    },
  },
  {
    label: 'Tuần này',
    getRange: () => {
      const today = dayjs()
      const startOfWeek = today.startOf('week').add(1, 'day') // Monday
      const endOfWeek = today.endOf('week').add(1, 'day') // Sunday
      return {
        tuNgay: startOfWeek.format('YYYY-MM-DD'),
        denNgay: endOfWeek.format('YYYY-MM-DD'),
      }
    },
  },
  {
    label: 'Tháng này',
    getRange: () => {
      const today = dayjs()
      return {
        tuNgay: today.startOf('month').format('YYYY-MM-DD'),
        denNgay: today.endOf('month').format('YYYY-MM-DD'),
      }
    },
  },
  {
    label: 'Quý này',
    getRange: () => {
      const today = dayjs()
      const quarter = Math.floor(today.month() / 3)
      return {
        tuNgay: today.month(quarter * 3).startOf('month').format('YYYY-MM-DD'),
        denNgay: today.month(quarter * 3 + 2).endOf('month').format('YYYY-MM-DD'),
      }
    },
  },
  {
    label: 'Năm này',
    getRange: () => {
      const today = dayjs()
      return {
        tuNgay: today.startOf('year').format('YYYY-MM-DD'),
        denNgay: today.endOf('year').format('YYYY-MM-DD'),
      }
    },
  },
  {
    label: 'Tháng trước',
    getRange: () => {
      const lastMonth = dayjs().subtract(1, 'month')
      return {
        tuNgay: lastMonth.startOf('month').format('YYYY-MM-DD'),
        denNgay: lastMonth.endOf('month').format('YYYY-MM-DD'),
      }
    },
  },
  {
    label: 'Quý trước',
    getRange: () => {
      const today = dayjs()
      const currentQuarter = Math.floor(today.month() / 3)
      const lastQuarter = currentQuarter === 0 ? 3 : currentQuarter - 1
      const lastQuarterYear = currentQuarter === 0 ? today.year() - 1 : today.year()
      return {
        tuNgay: dayjs().year(lastQuarterYear).month(lastQuarter * 3).startOf('month').format('YYYY-MM-DD'),
        denNgay: dayjs().year(lastQuarterYear).month(lastQuarter * 3 + 2).endOf('month').format('YYYY-MM-DD'),
      }
    },
  },
  {
    label: 'Năm trước',
    getRange: () => {
      const lastYear = dayjs().subtract(1, 'year')
      return {
        tuNgay: lastYear.startOf('year').format('YYYY-MM-DD'),
        denNgay: lastYear.endOf('year').format('YYYY-MM-DD'),
      }
    },
  },
]

export function DateRangePicker({ tuNgay, denNgay, onChange, disabled }: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleQuickSelect = (option: typeof QUICK_SELECT_OPTIONS[0]) => {
    const range = option.getRange()
    onChange(range.tuNgay, range.denNgay)
    setIsOpen(false)
  }

  const formatDisplayDate = (dateStr: string | null | undefined) => {
    if (!dateStr) return ''
    return dayjs(dateStr).format('DD/MM/YYYY')
  }

  const getDisplayLabel = () => {
    if (!tuNgay || !denNgay) return 'Chọn kỳ'
    
    // Check if matches any quick select
    for (const option of QUICK_SELECT_OPTIONS) {
      const range = option.getRange()
      if (range.tuNgay === tuNgay && range.denNgay === denNgay) {
        return option.label
      }
    }
    
    // Custom range
    return `${formatDisplayDate(tuNgay)} - ${formatDisplayDate(denNgay)}`
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-9 justify-between min-w-[200px] shrink-0"
          disabled={disabled}
        >
          <Calendar className="h-4 w-4 mr-2 shrink-0" />
          <span className="truncate text-left flex-1">{getDisplayLabel()}</span>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4" align="start">
        <div className="space-y-4">
          {/* Quick select options */}
          <div>
            <div className="text-sm font-medium mb-2">Chọn nhanh</div>
            <div className="grid grid-cols-2 gap-2">
              {QUICK_SELECT_OPTIONS.map((option) => (
                <Button
                  key={option.label}
                  variant="outline"
                  size="sm"
                  className="h-9 justify-start"
                  onClick={() => handleQuickSelect(option)}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Custom range */}
          <div className="border-t pt-4">
            <div className="text-sm font-medium mb-2">Tùy chỉnh</div>
            <div className="flex items-center gap-2">
              <div className="w-[140px]">
                <DatePicker
                  value={tuNgay || undefined}
                  onChange={(date) => {
                    const dateStr = date ? dayjs(date).format('YYYY-MM-DD') : null
                    onChange(dateStr, denNgay || null)
                  }}
                  disabled={disabled}
                />
              </div>
              <span className="text-sm text-muted-foreground">-</span>
              <div className="w-[140px]">
                <DatePicker
                  value={denNgay || undefined}
                  onChange={(date) => {
                    const dateStr = date ? dayjs(date).format('YYYY-MM-DD') : null
                    onChange(tuNgay || null, dateStr)
                  }}
                  disabled={disabled}
                />
              </div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

