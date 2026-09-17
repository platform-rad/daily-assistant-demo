import { useState, useRef, useEffect } from 'react'
import { Maximize2, X } from 'lucide-react'

interface FloatingWindowProps {
  title: string
  icon?: string
  children: React.ReactNode
  onClose?: () => void
  defaultWidth?: number
  defaultHeight?: number
  defaultX?: number
  defaultY?: number
}

export function FloatingWindow({
  title,
  icon,
  children,
  onClose,
  defaultWidth = 700,
  defaultHeight = 800,
  defaultX = 100,
  defaultY = 100,
}: FloatingWindowProps) {
  const [isMinimized, setIsMinimized] = useState(false)
  const [isMaximized, setIsMaximized] = useState(false)
  const [position, setPosition] = useState({ x: defaultX, y: defaultY })
  const [size, setSize] = useState({ width: defaultWidth, height: defaultHeight })
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState<'right' | 'bottom' | 'corner' | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 })
  const windowRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button')) return
    setIsDragging(true)
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    })
  }

  const handleResizeStart = (e: React.MouseEvent, type: 'right' | 'bottom' | 'corner') => {
    e.preventDefault()
    setIsResizing(type)
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: size.width,
      height: size.height,
    })
  }

  useEffect(() => {
    if (!isDragging && !isResizing) return

    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y,
        })
      }
      if (isResizing) {
        const deltaX = e.clientX - resizeStart.x
        const deltaY = e.clientY - resizeStart.y

        if (isResizing === 'right' || isResizing === 'corner') {
          const newWidth = Math.max(400, Math.min(resizeStart.width + deltaX, window.innerWidth - position.x - 20))
          setSize((prev) => ({ ...prev, width: newWidth }))
        }
        if (isResizing === 'bottom' || isResizing === 'corner') {
          const newHeight = Math.max(500, Math.min(resizeStart.height + deltaY, window.innerHeight - position.y - 40))
          setSize((prev) => ({ ...prev, height: newHeight }))
        }
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      setIsResizing(null)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, isResizing, dragOffset, resizeStart, position])

  const toggleMaximize = () => {
    if (!isMaximized) {
      setSize({ width: window.innerWidth - 40, height: window.innerHeight - 140 })
      setPosition({ x: 20, y: 60 })
    } else {
      setSize({ width: defaultWidth, height: defaultHeight })
      setPosition({ x: defaultX, y: defaultY })
    }
    setIsMaximized(!isMaximized)
  }

  // Constraint position to screen bounds
  const constrainedPosition = {
    x: Math.max(0, Math.min(position.x, window.innerWidth - size.width)),
    y: Math.max(0, Math.min(position.y, window.innerHeight - size.height - 20)),
  }

  if (isMinimized) return null

  return (
    <div
      ref={windowRef}
      className="fixed bg-white rounded-lg shadow-2xl flex flex-col border border-slate-200 z-40"
      style={{
        left: `${constrainedPosition.x}px`,
        top: `${constrainedPosition.y}px`,
        width: `${Math.max(400, Math.min(size.width, window.innerWidth - 20))}px`,
        height: `${Math.max(500, Math.min(size.height, window.innerHeight - 60))}px`,
      }}
    >
      {/* Title Bar */}
      <div
        onMouseDown={handleMouseDown}
        className="text-white px-4 py-3 rounded-t-lg flex items-center justify-between cursor-move hover:opacity-90 select-none transition"
        style={{ background: 'linear-gradient(135deg, #7D4FFE 0%, #6D3BF0 100%)' }}
      >
        <div className="flex items-center gap-2 flex-1">
          {icon && <span className="text-lg">{icon}</span>}
          <span className="font-semibold text-sm">{title}</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsMinimized(true)}
            className="p-1 hover:bg-white/20 rounded text-white transition font-bold text-lg leading-none"
            title="Minimiser"
          >
            −
          </button>
          <button
            onClick={toggleMaximize}
            className="p-1 hover:bg-white/20 rounded text-white transition"
            title={isMaximized ? 'Restaurer' : 'Maximiser'}
          >
            <Maximize2 size={16} />
          </button>
          <button
            onClick={onClose}
            className="p-1 hover:bg-red-500 rounded text-white transition"
            title="Fermer"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">{children}</div>

      {/* Resize Handles */}
      {/* Right edge */}
      <div
        onMouseDown={(e) => handleResizeStart(e, 'right')}
        className="absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-purple-500/50 transition"
        style={{ background: isResizing === 'right' ? '#7D4FFE' : 'transparent' }}
      />

      {/* Bottom edge */}
      <div
        onMouseDown={(e) => handleResizeStart(e, 'bottom')}
        className="absolute bottom-0 left-0 w-full h-1 cursor-row-resize hover:bg-purple-500/50 transition"
        style={{ background: isResizing === 'bottom' ? '#7D4FFE' : 'transparent' }}
      />

      {/* Corner (bottom-right) */}
      <div
        onMouseDown={(e) => handleResizeStart(e, 'corner')}
        className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
        style={{
          background: 'linear-gradient(135deg, transparent 50%, #7D4FFE 50%)',
          opacity: isResizing === 'corner' ? 1 : 0.3,
          transition: 'opacity 0.2s',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.3')}
      />
    </div>
  )
}
