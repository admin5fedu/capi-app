import * as React from 'react'
import { cn } from '@/lib/utils'
import { Bold, Italic, Underline, List, ListOrdered, Link, Undo, Redo } from 'lucide-react'
import { Button } from './button'

export interface RichTextEditorProps {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  className?: string
  disabled?: boolean
  minHeight?: string
  maxHeight?: string
}

const RichTextEditor = React.forwardRef<HTMLDivElement, RichTextEditorProps>(
  ({ 
    value = '', 
    onChange, 
    placeholder = 'Nhập nội dung...',
    className,
    disabled = false,
    minHeight = '200px',
    maxHeight = '500px',
    ...props 
  }, ref) => {
    const editorRef = React.useRef<HTMLDivElement>(null)
    const [isFocused, setIsFocused] = React.useState(false)

    // Sync value với contentEditable
    React.useEffect(() => {
      if (editorRef.current && editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value
      }
    }, [value])

    const handleInput = () => {
      if (editorRef.current) {
        onChange?.(editorRef.current.innerHTML)
      }
    }

    const execCommand = (command: string, value?: string) => {
      document.execCommand(command, false, value)
      editorRef.current?.focus()
      handleInput()
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      // Handle Enter key
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        execCommand('insertParagraph')
      }
    }

    const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
      e.preventDefault()
      const text = e.clipboardData.getData('text/plain')
      document.execCommand('insertText', false, text)
      handleInput()
    }

    const isCommandActive = (command: string): boolean => {
      return document.queryCommandState(command)
    }

    return (
      <div 
        ref={ref as any}
        className={cn(
          'border rounded-md overflow-hidden',
          isFocused && 'ring-2 ring-ring ring-offset-2',
          disabled && 'opacity-50 cursor-not-allowed',
          className
        )}
        {...props}
      >
        {/* Toolbar */}
        <div className="border-b bg-muted/50 p-1 flex items-center gap-1 flex-wrap">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => execCommand('bold')}
            className={cn(
              'h-8 w-8 p-0',
              isCommandActive('bold') && 'bg-accent'
            )}
            disabled={disabled}
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => execCommand('italic')}
            className={cn(
              'h-8 w-8 p-0',
              isCommandActive('italic') && 'bg-accent'
            )}
            disabled={disabled}
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => execCommand('underline')}
            className={cn(
              'h-8 w-8 p-0',
              isCommandActive('underline') && 'bg-accent'
            )}
            disabled={disabled}
          >
            <Underline className="h-4 w-4" />
          </Button>
          <div className="w-px h-6 bg-border mx-1" />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => execCommand('insertUnorderedList')}
            className={cn(
              'h-8 w-8 p-0',
              isCommandActive('insertUnorderedList') && 'bg-accent'
            )}
            disabled={disabled}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => execCommand('insertOrderedList')}
            className={cn(
              'h-8 w-8 p-0',
              isCommandActive('insertOrderedList') && 'bg-accent'
            )}
            disabled={disabled}
          >
            <ListOrdered className="h-4 w-4" />
          </Button>
          <div className="w-px h-6 bg-border mx-1" />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              const url = prompt('Nhập URL:')
              if (url) execCommand('createLink', url)
            }}
            className={cn(
              'h-8 w-8 p-0',
              isCommandActive('createLink') && 'bg-accent'
            )}
            disabled={disabled}
          >
            <Link className="h-4 w-4" />
          </Button>
          <div className="w-px h-6 bg-border mx-1" />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => execCommand('undo')}
            disabled={disabled}
          >
            <Undo className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => execCommand('redo')}
            disabled={disabled}
          >
            <Redo className="h-4 w-4" />
          </Button>
        </div>

        {/* Editor */}
        <div
          ref={editorRef}
          contentEditable={!disabled}
          onInput={handleInput}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          className={cn(
            'w-full px-3 py-2 text-sm',
            'focus:outline-none',
            'overflow-y-auto',
            '[&_ul]:list-disc [&_ul]:ml-6 [&_ul]:my-2',
            '[&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:my-2',
            '[&_p]:my-2',
            '[&_strong]:font-bold',
            '[&_em]:italic',
            '[&_u]:underline',
            '[&_a]:text-primary [&_a]:underline',
            'empty:before:content-[attr(data-placeholder)]',
            'empty:before:text-muted-foreground'
          )}
          style={{ minHeight, maxHeight }}
          data-placeholder={placeholder}
          suppressContentEditableWarning
        />
      </div>
    )
  }
)
RichTextEditor.displayName = 'RichTextEditor'

export { RichTextEditor }

