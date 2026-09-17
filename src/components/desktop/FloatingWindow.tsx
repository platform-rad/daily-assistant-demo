import { useState, useRef, useEffect } from 'react'
import { Minimize2, Maximize2, X } from 'lucide-react'

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
  defaultWidth = 500,
  defaultHeight = 700,
  defaultX = 100,
  defaultY = 100,
}: FloatingWindowProps) {
  const [isMinimized, setIsMinimized] = useState(false)
  const [isMaximized, setIsMaximized] = useState(false)
  const [position, setPosition] = useState({ x: defaultX, y: defaultY })
  const [size, setSize] = useState({ width: defaultWidth, height: defaultHeight })
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const windowRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button')) return
    setIsDragging(true)
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    })
  }

  useEffect(() => {
    if (!isDragging) return

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y,
      })
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, dragOffset])

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
        width: `${Math.max(300, Math.min(size.width, window.innerWidth - 20))}px`,
        height: `${Math.max(400, Math.min(size.height, window.innerHeight - 60))}px`,
      }}
    >
      {/* Title Bar */}
      <div
        onMouseDown={handleMouseDown}
        className="bg-gradient-to-r from-orange-500/90 to-orange-600/90 text-white px-4 py-3 rounded-t-lg flex items-center justify-between cursor-move hover:from-orange-600/95 hover:to-orange-700/95 select-none transition"
      >
        <div className="flex items-center gap-2 flex-1">
          {icon && <span className="text-lg">{icon}</span>}
          <span className="font-semibold text-sm">{title}</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsMinimized(true)}
            className="p-1 hover:bg-orange-400 rounded text-white transition"
            title="Minimiser"
          >
            <Minimize2 size={16} />
          </button>
          <button
            onClick={toggleMaximize}
            className="p-1 hover:bg-orange-400 rounded text-white transition"
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
    </div>
  )
}
