import { useState, useRef, useEffect } from 'react'
import { Settings, ChevronRight, Sparkles, Search } from 'lucide-react'
import { HomePage } from './pages/HomePage'
import { CrmAgentPage } from './pages/CrmAgentPage'
import { CapCbsAgentPage } from './pages/CapCbsAgentPage'
import { HistoryPage } from './pages/HistoryPage'
import { FavoritesPage } from './pages/FavoritesPage'
import { ActiveActionsPage } from './pages/ActiveActionsPage'
import { SidebarNav, type NavView } from './SidebarNav'
import { ContextualActionsPanel } from './ContextualActionsPanel'
import { GlobalSearch } from './GlobalSearch'
import type { HostRoute } from '@/data/types'
import { ROUTES } from '@/data/hostRoutes'
import type { CapCbsDossier, DossierMessage } from '@/data/capCbsDossiers'
import type { CrmNote } from '@/data/crmNotes'

interface CopilotSidebarProps {
  isCollapsed: boolean
  onToggleCollapse: () => void
  onSelectPrompt?: (prompt: string) => void
  onCreateCreditMemo?: () => void
  /** Change de route SANS relancer le mode hôte (on est déjà dans Daily Assistant). */
  onNavigate?: (route: HostRoute) => void
  /** Ouvre Meena (agent CRM+) en fenêtre flottante, quel que soit le mode courant. */
  onOpenMeena?: () => void
  currentRoute?: HostRoute
  /** Source unique CAP/CBS + CRM+ — partagée avec le panneau gauche. */
  capCbsDossiers: CapCbsDossier[]
  onAddCapCbsDossier: (dossier: CapCbsDossier) => void
  onAddCapCbsMessage: (id: string, message: DossierMessage) => void
  crmNotes: CrmNote[]
  onAddCrmNote: (note: CrmNote) => void
  onUpdateCrmNote: (id: string, patch: Partial<CrmNote>) => void
  onAddCrmNoteMessage: (id: string, message: DossierMessage) => void
}

export function CopilotSidebar({
  isCollapsed,
  onToggleCollapse,
  onSelectPrompt,
  onCreateCreditMemo,
  onNavigate,
  onOpenMeena,
  currentRoute = 'client',
  capCbsDossiers,
  onAddCapCbsDossier,
  onAddCapCbsMessage,
  crmNotes,
  onAddCrmNote,
  onUpdateCrmNote,
  onAddCrmNoteMessage,
}: CopilotSidebarProps) {
  const [currentView, setCurrentView] = useState<NavView>('home')
  const [width, setWidth] = useState(590) // 590px par défaut
  const [isDragging, setIsDragging] = useState(false)
  const [dragStartX, setDragStartX] = useState(0)
  const [dragStartWidth, setDragStartWidth] = useState(0)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const sidebarRef = useRef<HTMLDivElement>(null)

  // Prototype : un seul client est réellement modélisé (AeroDynamics Group).
  const currentClientName = currentRoute === 'client' || currentRoute === 'client-edit' ? 'AeroDynamics Group' : undefined

  // Calculé en direct depuis la source partagée — ne peut plus diverger de ce qui est affiché.
  const badgeCounts: Partial<Record<NavView, number>> = {
    'crm-agent': crmNotes.filter((n) => n.status === 'Pending Review').length,
    'cap-cbs': capCbsDossiers.filter((d) => d.status === 'Pending Review').length,
  }

  // Get context from route for dynamic suggestions
  const getContextFromRoute = (route: string): string => {
    if (route === 'client' || route === 'client-edit') return 'myClientDev'
    if (route === 'credit') return 'myCreditApp'
    if (route === 'portfolio') return 'portfolio'
    if (route === 'pipeline') return 'pipeline'
    if (route === 'cap-cbs') return 'cap-cbs'
    if (route === 'cap-cbs-detail') return 'cap-cbs-detail'
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

  // Handle onSelectPrompt to detect Credit Memo / CBS-CAP navigation shortcuts
  const handleSelectPrompt = (prompt: string) => {
    if (prompt.includes('Credit Memo') || prompt.includes('credit memo')) {
      onCreateCreditMemo?.()
    } else if (prompt.toLowerCase().includes('cbs/cap') || prompt.toLowerCase().includes('cbs-cap')) {
      if (onNavigate) onNavigate('cap-cbs')
      setCurrentView('cap-cbs')
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
      {/* Header — même bleu que l'icône "D" de Daily Assistant (rad-indigo-600) */}
      <div className="px-4 py-3 flex items-center justify-between bg-rad-indigo-600">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/15">
            <Sparkles size={18} className="text-white" />
          </div>
          <span className="font-semibold text-white text-sm">Copilot</span>
        </div>
        <div className="flex items-center gap-0.5">
          <button
            onClick={() => setIsSearchOpen(true)}
            className="p-1.5 hover:bg-white/15 rounded transition"
            title="Search clients, dossiers, conversations"
          >
            <Search size={18} className="text-white" />
          </button>
          <button
            onClick={onToggleCollapse}
            className="p-1 hover:bg-white/15 rounded transition"
            title="Collapse sidebar"
          >
            <ChevronRight size={20} className="text-white" />
          </button>
        </div>
      </div>

      {/* New Navigation Bar with Menu & Tabs */}
      <SidebarNav currentView={currentView} onViewChange={setCurrentView} badgeCounts={badgeCounts} />

      {/* Contexte persistant : s'actualise avec l'écran ouvert à gauche, visible sur tous les onglets */}
      <ContextualActionsPanel
        context={displayContext}
        contextLabel={ROUTES[currentRoute]?.contextLabel}
        onActionClick={handleSelectPrompt}
        initialExpanded={currentView === 'home'}
      />

      {/* Pages Content */}
      <div className="flex-1 overflow-hidden flex flex-col relative">
        {currentView === 'home' && (
          <HomePage
            onSelectPrompt={handleSelectPrompt}
            onCreateCreditMemo={onCreateCreditMemo}
            onNavigate={onNavigate}
            layout="compact"
            sidebarWidth={width}
          />
        )}
        {currentView === 'crm-agent' && (
          <CrmAgentPage
            onOpenMeena={onOpenMeena}
            onNavigate={onNavigate}
            currentClientName={currentClientName}
            notes={crmNotes}
            onAddNote={onAddCrmNote}
            onUpdateNote={onUpdateCrmNote}
            onAddMessage={onAddCrmNoteMessage}
            isCompact
          />
        )}
        {currentView === 'cap-cbs' && (
          <CapCbsAgentPage
            onNavigate={onNavigate}
            dossiers={capCbsDossiers}
            onAddDossier={onAddCapCbsDossier}
            onAddMessage={onAddCapCbsMessage}
            isCompact
          />
        )}
        {currentView === 'history' && <HistoryPage />}
        {currentView === 'favorites' && <FavoritesPage onSelectPrompt={handleSelectPrompt} />}
        {currentView === 'active-actions' && <ActiveActionsPage />}

        <GlobalSearch
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          onViewChange={setCurrentView}
          onGoToClient={() => onNavigate?.('client')}
          onGoToCapCbs={() => onNavigate?.('cap-cbs-detail')}
        />
      </div>

      {/* Settings Footer */}
      <div className="border-t border-slate-200 px-3 py-3 bg-white">
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-700 hover:bg-slate-100 transition">
          <Settings size={18} />
          <span className="text-sm font-medium">Settings</span>
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
          isDragging ? 'bg-rad-indigo-500 shadow-lg' : 'hover:bg-rad-indigo-400/70 bg-transparent'
        }`}
        style={{
          background: isDragging ? '#4F46E5' : 'transparent',
          boxShadow: isDragging ? '0 0 12px rgba(79, 70, 229, 0.4)' : 'none',
        }}
        title="Drag to resize"
      />
    </div>
  )
}
