import { useCallback, useState, useRef, useEffect } from 'react'
import { TooltipProvider } from '@/components/ui/tooltip'
import { MyClientDev } from '@/components/host/MyClientDev'
import { CopilotChat } from '@/components/copilot/CopilotChat'
import { CopilotSidebar } from '@/components/copilot/CopilotSidebar'
import { CreditMemoViewer } from '@/components/credit-memo/CreditMemoViewer'
import { CreditMemoCreator } from '@/components/copilot/CreditMemoCreator'
import { DesktopEnvironment } from '@/components/desktop/DesktopEnvironment'
import { Sparkles, X } from 'lucide-react'
import type { HostRoute } from '@/data/types'

export type AppMode = 'desktop' | 'legacy' | 'credit-memo-creation' | 'credit-memo'

export default function App() {
  const [appMode, setAppMode] = useState<AppMode>('desktop')
  const [route, setRoute] = useState<HostRoute>('client')
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [buttonY, setButtonY] = useState(50)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState(0)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const navigate = useCallback(
    (next: HostRoute) => {
      setRoute(next)
    },
    []
  )

  const handleValidateAndEdit = useCallback(
    (route: HostRoute) => {
      // Basculer vers MyClientDev et ouvrir la page d'édition
      setAppMode('legacy')
      setRoute(route)
    },
    []
  )

  const handleCreateCreditMemo = useCallback(
    () => {
      // Basculer vers le mode Credit-Memo-Creation (wizard)
      setAppMode('credit-memo-creation')
    },
    []
  )

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setDragStart(e.clientY - buttonY)
  }

  useEffect(() => {
    if (!isDragging) return

    const handleMouseMove = (e: MouseEvent) => {
      const newY = e.clientY - dragStart
      // Limiter entre 50px du haut et 50px du bas
      const constrainedY = Math.max(0, Math.min(newY, window.innerHeight - 60))
      setButtonY(constrainedY)
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
  }, [isDragging, dragStart])

  return (
    <TooltipProvider delayDuration={150}>
      {appMode === 'desktop' ? (
        /* Mode Desktop: Simulation d'un environnement Windows */
        <DesktopEnvironment
          onOpenMyClientDev={() => setAppMode('legacy')}
          onCreateCreditMemo={handleCreateCreditMemo}
        />
      ) : appMode === 'credit-memo-creation' ? (
        /* Mode Credit-Memo-Creation: Creator + CopilotChat Sidebar */
        <div className="flex h-screen w-screen overflow-hidden bg-slate-200">
          {/* Credit Memo Creator à gauche */}
          <main className="min-w-0 flex-1 overflow-hidden border-r border-slate-300 bg-white">
            <CreditMemoCreator
              onComplete={() => setAppMode('credit-memo')}
              onCancel={() => setAppMode('desktop')}
            />
          </main>

          {/* Chat Copilot Sidebar à droite */}
          <div className="w-96 border-l border-slate-300 bg-white flex flex-col shadow-rad-lg overflow-hidden">
            <CopilotChat
              mode="widget"
              currentRoute={route}
              onValidateAndEdit={handleValidateAndEdit}
              onCreateCreditMemo={handleCreateCreditMemo}
            />
          </div>
        </div>
      ) : appMode === 'credit-memo' ? (
        /* Mode Credit-Memo: CreditMemoViewer + CopilotChat */
        <div className="flex h-screen w-screen overflow-hidden bg-slate-200">
          {/* Credit Memo Editor à gauche */}
          <main className="min-w-0 flex-1 overflow-hidden">
            <CreditMemoViewer
              clientName="TechCorp France"
              onClose={() => setAppMode('desktop')}
            />
          </main>

          {/* Chat Copilot en side panel */}
          <div className="w-96 border-l border-slate-300 bg-white flex flex-col shadow-rad-lg">
            <CopilotChat
              mode="widget"
              currentRoute={route}
              onValidateAndEdit={handleValidateAndEdit}
              onCreateCreditMemo={handleCreateCreditMemo}
            />

            <div className="border-t border-slate-200 px-4 py-3 bg-slate-50">
              <button
                onClick={() => setAppMode('desktop')}
                className="w-full px-3 py-2 text-2xs rounded bg-slate-200 text-slate-700 hover:bg-slate-300 transition font-medium"
              >
                ← Retour Desktop
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Mode Legacy: MyClientDev with optional Copilot Sidebar */
        <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-200 relative">
          {/* Top Bar with Close Button */}
          <div className="flex-shrink-0 bg-white border-b border-slate-200 px-3 py-2 flex items-center gap-3">
            <button
              onClick={() => setAppMode('desktop')}
              className="p-1.5 hover:bg-red-100 rounded-lg transition flex-shrink-0"
              title="Retour au desktop"
            >
              <X size={20} className="text-red-500" />
            </button>
            <div className="flex-1" />
          </div>

          {/* Main Content Area */}
          <div className="flex flex-1 min-w-0 overflow-hidden">
            {/* Application hôte */}
            <main className="min-w-0 flex-1 overflow-hidden">
              <MyClientDev route={route} onNavigate={navigate} compact={false} />
            </main>

            {/* Copilot Sidebar */}
            <CopilotSidebar
              isCollapsed={!isChatOpen}
              onToggleCollapse={() => setIsChatOpen(!isChatOpen)}
              onSelectPrompt={() => {
                // Prompts from sidebar suggestions are handled internally
              }}
              onCreateCreditMemo={handleCreateCreditMemo}
              currentRoute={route}
            />

            {/* Sticky button - collé à droite, draggable sur axe Y */}
            {!isChatOpen && (
              <button
                ref={buttonRef}
                onMouseDown={handleMouseDown}
                onClick={() => setIsChatOpen(true)}
                className="fixed w-14 h-14 flex items-center justify-center shadow-2xl hover:shadow-xl transition z-50 cursor-move group"
                style={{
                  background: 'linear-gradient(135deg, #7D4FFE 0%, #6D3BF0 100%)',
                  right: '0px',
                  top: `${buttonY}px`,
                  borderRadius: '12px 0 0 12px',
                  border: 'none',
                }}
                title="Ouvrir le chat (draggable)"
              >
                <Sparkles size={24} className="text-white" />
              </button>
            )}
          </div>
        </div>
      )}
    </TooltipProvider>
  )
}
