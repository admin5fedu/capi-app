import * as React from 'react'
import { Input, InputProps } from './input'
import { cn } from '@/lib/utils'
import { Check, ChevronDown, X } from 'lucide-react'

export interface AutocompleteOption {
  value: string | number
  label: string
  description?: string
}

export interface AutocompleteInputProps extends Omit<InputProps, 'type' | 'onChange'> {
  options: AutocompleteOption[]
  value?: string | number
  onChange?: (value: string | number | null) => void
  onSearch?: (searchTerm: string) => void
  placeholder?: string
  emptyMessage?: string
  maxHeight?: string
  debounceMs?: number
  filterOptions?: (options: AutocompleteOption[], searchTerm: string) => AutocompleteOption[]
}

const AutocompleteInput = React.forwardRef<HTMLInputElement, AutocompleteInputProps>(
  ({ 
    className, 
    options = [], 
    value, 
    onChange, 
    onSearch,
    placeholder = 'Tìm kiếm...',
    emptyMessage = 'Không tìm thấy kết quả',
    maxHeight = '300px',
    debounceMs = 300,
    filterOptions,
    onBlur,
    onFocus,
    ...props 
  }, ref) => {
    const [searchTerm, setSearchTerm] = React.useState<string>('')
    const [isOpen, setIsOpen] = React.useState<boolean>(false)
    const [highlightedIndex, setHighlightedIndex] = React.useState<number>(-1)
    const inputRef = React.useRef<HTMLInputElement>(null)
    const containerRef = React.useRef<HTMLDivElement>(null)
    const listRef = React.useRef<HTMLDivElement>(null)
    const debounceTimerRef = React.useRef<NodeJS.Timeout>()

    // Tìm option hiện tại
    const selectedOption = React.useMemo(() => {
      return options.find(opt => opt.value === value)
    }, [options, value])

    // Filter options
    const filteredOptions = React.useMemo(() => {
      if (!searchTerm) return options
      
      if (filterOptions) {
        return filterOptions(options, searchTerm)
      }
      
      const lowerSearch = searchTerm.toLowerCase()
      return options.filter(opt => 
        opt.label.toLowerCase().includes(lowerSearch) ||
        opt.description?.toLowerCase().includes(lowerSearch)
      )
    }, [options, searchTerm, filterOptions])

    // Debounce search
    React.useEffect(() => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
      
      debounceTimerRef.current = setTimeout(() => {
        onSearch?.(searchTerm)
      }, debounceMs)

      return () => {
        if (debounceTimerRef.current) {
          clearTimeout(debounceTimerRef.current)
        }
      }
    }, [searchTerm, onSearch, debounceMs])

    // Close when clicking outside
    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
          setIsOpen(false)
        }
      }

      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
      }
    }, [isOpen])

    // Keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!isOpen && (e.key === 'ArrowDown' || e.key === 'Enter')) {
        setIsOpen(true)
        return
      }

      if (!isOpen) return

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setHighlightedIndex(prev => 
            prev < filteredOptions.length - 1 ? prev + 1 : prev
          )
          break
        case 'ArrowUp':
          e.preventDefault()
          setHighlightedIndex(prev => prev > 0 ? prev - 1 : -1)
          break
        case 'Enter':
          e.preventDefault()
          if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
            handleSelect(filteredOptions[highlightedIndex])
          }
          break
        case 'Escape':
          setIsOpen(false)
          inputRef.current?.blur()
          break
      }
    }

    // Scroll highlighted item into view
    React.useEffect(() => {
      if (highlightedIndex >= 0 && listRef.current) {
        const item = listRef.current.children[highlightedIndex] as HTMLElement
        if (item) {
          item.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
        }
      }
    }, [highlightedIndex])

    const handleSelect = (option: AutocompleteOption) => {
      onChange?.(option.value)
      setSearchTerm('')
      setIsOpen(false)
      inputRef.current?.blur()
    }

    const handleClear = () => {
      onChange?.(null)
      setSearchTerm('')
      setIsOpen(false)
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value
      setSearchTerm(newValue)
      setIsOpen(true)
      setHighlightedIndex(-1)
    }

    const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsOpen(true)
      onFocus?.(e)
    }

    const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      // Delay để cho phép click vào option
      setTimeout(() => {
        if (!containerRef.current?.contains(document.activeElement)) {
          setIsOpen(false)
          onBlur?.(e)
        }
      }, 200)
    }

    return (
      <div ref={containerRef} className="relative w-full">
        <div className="relative">
          <Input
            {...props}
            ref={ref || inputRef}
            type="text"
            value={isOpen ? searchTerm : (selectedOption?.label || '')}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className={cn(
              className,
              value && 'pr-20'
            )}
          />
          <div className="absolute right-0 top-0 h-full flex items-center gap-1 pr-2">
            {value && (
              <button
                type="button"
                onClick={handleClear}
                className="h-6 w-6 rounded-full hover:bg-accent flex items-center justify-center"
              >
                <X className="h-3 w-3" />
              </button>
            )}
            <ChevronDown className={cn(
              "h-4 w-4 text-muted-foreground transition-transform",
              isOpen && "rotate-180"
            )} />
          </div>
        </div>

        {isOpen && (
          <div 
            ref={listRef}
            className="absolute z-50 w-full mt-1 bg-popover border rounded-md shadow-lg overflow-hidden"
            style={{ maxHeight }}
          >
            {filteredOptions.length > 0 ? (
              <div className="overflow-y-auto" style={{ maxHeight }}>
                {filteredOptions.map((option, index) => {
                  const isSelected = option.value === value
                  const isHighlighted = index === highlightedIndex

                  return (
                    <button
                      key={String(option.value)}
                      type="button"
                      onClick={() => handleSelect(option)}
                      className={cn(
                        'w-full text-left px-3 py-2 text-sm transition-colors',
                        'hover:bg-accent hover:text-accent-foreground',
                        isHighlighted && 'bg-accent text-accent-foreground',
                        isSelected && 'bg-primary/10'
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="font-medium">{option.label}</div>
                          {option.description && (
                            <div className="text-xs text-muted-foreground mt-0.5">
                              {option.description}
                            </div>
                          )}
                        </div>
                        {isSelected && (
                          <Check className="h-4 w-4 text-primary ml-2" />
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
            ) : (
              <div className="px-3 py-6 text-center text-sm text-muted-foreground">
                {emptyMessage}
              </div>
            )}
          </div>
        )}
      </div>
    )
  }
)
AutocompleteInput.displayName = 'AutocompleteInput'

export { AutocompleteInput }

