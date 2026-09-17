import { useState, useRef, useEffect } from 'react'
import { Settings, ChevronRight, Sparkles } from 'lucide-react'
import { HomePage } from './pages/HomePage'
import { HistoryPage } from './pages/HistoryPage'
import { FavoritesPage } from './pages/FavoritesPage'
import { ActiveActionsPage } from './pages/ActiveActionsPage'
import { SidebarNav, type NavView } from './SidebarNav'
import { ContextualActionsPanel } from './ContextualActionsPanel'

interface CopilotSidebarProps {
  isCollapsed: boolean
  onToggleCollapse: () => void
  onSelectPrompt?: (prompt: string) => void
  onCreateCreditMemo?: () => void
  currentRoute?: 'client' | 'client-edit' | 'credit' | 'portfolio' | 'pipeline' | 'dashboard' | 'reporting'
}

export function CopilotSidebar({ isCollapsed, onToggleCollapse, onSelectPrompt, onCreateCreditMemo, currentRoute = 'client' }: CopilotSidebarProps) {
  const [currentView, setCurrentView] = useState<NavView>('home')
  const [width, setWidth] = useState(320) // 320px par défaut
  const [isDragging, setIsDragging] = useState(false)
  const [dragStartX, setDragStartX] = useState(0)
  const [dragStartWidth, setDragStartWidth] = useState(0)
  const sidebarRef = useRef<HTMLDivElement>(null)

  // Get context from route for dynamic suggestions
  const getContextFromRoute = (route: string): string => {
    if (route === 'client' || route === 'client-edit') return 'myClientDev'
    if (route === 'credit') return 'myCreditApp'
    if (route === 'portfolio') return 'portfolio'
    if (route === 'pipeline') return 'pipeline'
    return 'myClientDev'
  }

  const displayContext = getContextFromRoute(currentRoute)

  useEffect(() => {
    if (!isDragging) return

    const handleMouseMove = (e: MouseEvent) => {
      // Calculate delta from drag start
      const delta = e.clientX - dragStartX
      const newWidth = Math.max(240, Math.min(800, dragStartWidth + delta))
      setWidth(newWidth)
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      document.body.style.userSelect = 'auto'
      document.body.style.cursor = 'auto'
    }

    // Prevent text selection while dragging
    document.body.style.userSelect = 'none'
    document.body.style.cursor = 'col-resize'

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    window.addEventListener('mouseup', handleMouseUp)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
      document.body.style.userSelect = 'auto'
      document.body.style.cursor = 'auto'
    }
  }, [isDragging, dragStartX, dragStartWidth])

  // Handle onSelectPrompt to detect Credit Memo
  const handleSelectPrompt = (prompt: string) => {
    if (prompt.includes('Credit Memo') || prompt.includes('credit memo')) {
      onCreateCreditMemo?.()
    } else {
      onSelectPrompt?.(prompt)
    }
  }

  if (isCollapsed) {
    return null
  }

  return (
    <div
      ref={sidebarRef}
      className="border-l border-slate-200 bg-white flex flex-col shadow-2xl overflow-hidden relative"
      style={{ width: `${width}px` }}
    >
      {/* Header */}
      <div className="border-b border-slate-200 bg-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #7D4FFE 0%, #6D3BF0 100%)' }}>
            <Sparkles size={18} className="text-white" />
          </div>
          <span className="font-semibold text-slate-900 text-sm">Copilot</span>
        </div>
        <button
          onClick={onToggleCollapse}
          className="p-1 hover:bg-slate-100 rounded transition"
          title="Réduire sidebar"
        >
          <ChevronRight size={20} className="text-slate-600" />
        </button>
      </div>

      {/* New Navigation Bar with Menu & Tabs */}
      <SidebarNav currentView={currentView} onViewChange={setCurrentView} />

      {/* Contextual Suggestions (Quick Actions based on current context) */}
      {currentView === 'home' && (
        <ContextualActionsPanel
          context={displayContext}
          onActionClick={handleSelectPrompt}
          initialExpanded={true}
        />
      )}

      {/* Pages Content */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {currentView === 'home' && <HomePage onSelectPrompt={handleSelectPrompt} onCreateCreditMemo={onCreateCreditMemo} layout="compact" sidebarWidth={width} />}
        {currentView === 'history' && <HistoryPage />}
        {currentView === 'favorites' && <FavoritesPage onSelectPrompt={handleSelectPrompt} />}
        {currentView === 'active-actions' && <ActiveActionsPage />}
      </div>

      {/* Settings Footer */}
      <div className="border-t border-slate-200 px-3 py-3 bg-white">
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-700 hover:bg-slate-100 transition">
          <Settings size={18} />
          <span className="text-sm font-medium">Paramètres</span>
        </button>
      </div>

      {/* Resize Handle - Enhanced */}
      <div
        ref={sidebarRef}
        onMouseDown={(e) => {
          setIsDragging(true)
          setDragStartX(e.clientX)
          setDragStartWidth(width)
        }}
        className={`absolute left-0 top-0 w-1 h-full cursor-col-resize transition-all ${
          isDragging ? 'bg-purple-500 shadow-lg' : 'hover:bg-purple-400/70 bg-transparent'
        }`}
        style={{
          background: isDragging ? '#7D4FFE' : 'transparent',
          boxShadow: isDragging ? '0 0 12px rgba(125, 79, 254, 0.4)' : 'none',
        }}
        title="Glissez pour redimensionner"
      />
    </div>
  )
}
