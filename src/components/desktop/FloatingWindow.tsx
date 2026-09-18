import { useState, useRef, useEffect } from 'react'
import { Maximize2, PanelRightClose, X } from 'lucide-react'

interface DockState {
  isDocked: boolean
  width: number
}

interface FloatingWindowProps {
  title: string
  icon?: string
  children: React.ReactNode | ((dock: DockState) => React.ReactNode)
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
  const [isDocked, setIsDocked] = useState(false)
  const [dockWidth, setDockWidth] = useState(420)
  const [position, setPosition] = useState({ x: defaultX, y: defaultY })
  const [size, setSize] = useState({ width: defaultWidth, height: defaultHeight })
  const [preDockState, setPreDockState] = useState<{ position: typeof position; size: typeof size } | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState<'right' | 'bottom' | 'corner' | 'left' | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 })
  const windowRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isDocked) return
    if ((e.target as HTMLElement).closest('button')) return
    setIsDragging(true)
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    })
  }

  const handleResizeStart = (e: React.MouseEvent, type: 'right' | 'bottom' | 'corner' | 'left') => {
    e.preventDefault()
    setIsResizing(type)
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: type === 'left' ? dockWidth : size.width,
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
        if (isResizing === 'left') {
          // Ancré à droite : tirer le bord gauche vers la gauche agrandit le panneau
          const newWidth = Math.max(320, Math.min(resizeStart.width - deltaX, 900))
          setDockWidth(newWidth)
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
    if (isDocked) return
    if (!isMaximized) {
      setSize({ width: window.innerWidth - 40, height: window.innerHeight - 140 })
      setPosition({ x: 20, y: 60 })
    } else {
      setSize({ width: defaultWidth, height: defaultHeight })
      setPosition({ x: defaultX, y: defaultY })
    }
    setIsMaximized(!isMaximized)
  }

  const toggleDock = () => {
    if (!isDocked) {
      setPreDockState({ position, size })
      setIsMaximized(false)
      setIsDocked(true)
    } else {
      setIsDocked(false)
      if (preDockState) {
        setPosition(preDockState.position)
        setSize(preDockState.size)
      }
    }
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
      className={`fixed bg-white shadow-2xl flex flex-col border border-slate-200 z-40 ${
        isDocked ? 'rounded-none' : 'rounded-lg'
      }`}
      style={
        isDocked
          ? {
              top: 0,
              right: 0,
              bottom: '48px', // au-dessus de la taskbar
              width: `${dockWidth}px`,
              height: 'auto',
            }
          : {
              left: `${constrainedPosition.x}px`,
              top: `${constrainedPosition.y}px`,
              width: `${Math.max(400, Math.min(size.width, window.innerWidth - 20))}px`,
              height: `${Math.max(500, Math.min(size.height, window.innerHeight - 60))}px`,
            }
      }
    >
      {/* Title Bar */}
      <div
        onMouseDown={handleMouseDown}
        className={`text-white px-4 py-3 flex items-center justify-between select-none transition hover:opacity-90 ${
          isDocked ? 'cursor-default' : 'cursor-move rounded-t-lg'
        }`}
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
          {!isDocked && (
            <button
              onClick={toggleMaximize}
              className="p-1 hover:bg-white/20 rounded text-white transition"
              title={isMaximized ? 'Restaurer' : 'Maximiser'}
            >
              <Maximize2 size={16} />
            </button>
          )}
          <button
            onClick={toggleDock}
            className={`p-1 rounded text-white transition ${isDocked ? 'bg-white/25' : 'hover:bg-white/20'}`}
            title={isDocked ? 'Détacher la fenêtre' : "Coller à droite de l'écran"}
          >
            <PanelRightClose size={16} />
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
      <div className="flex-1 overflow-auto">
        {typeof children === 'function'
          ? children({ isDocked, width: isDocked ? dockWidth : size.width })
          : children}
      </div>

      {/* Resize Handles */}
      {!isDocked && (
        <>
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
        </>
      )}

      {/* Left edge (docked mode: resize the sidebar width) */}
      {isDocked && (
        <div
          onMouseDown={(e) => handleResizeStart(e, 'left')}
          className="absolute top-0 left-0 w-1 h-full cursor-col-resize hover:bg-purple-500/50 transition"
          style={{ background: isResizing === 'left' ? '#7D4FFE' : 'transparent' }}
        />
      )}
    </div>
  )
}
