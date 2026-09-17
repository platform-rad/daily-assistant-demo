import { useCallback, useState, useRef, useEffect } from 'react'
import { TooltipProvider } from '@/components/ui/tooltip'
import { MyClientDev } from '@/components/host/MyClientDev'
import { CopilotChat } from '@/components/copilot/CopilotChat'
import { CopilotSidebar } from '@/components/copilot/CopilotSidebar'
import { CreditMemoViewer } from '@/components/credit-memo/CreditMemoViewer'
import { DesktopEnvironment } from '@/components/desktop/DesktopEnvironment'
import { Sparkles } from 'lucide-react'
import type { HostRoute } from '@/data/types'

export type AppMode = 'desktop' | 'legacy' | 'credit-memo'

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
      // Basculer vers le mode Credit-Memo
      setAppMode('credit-memo')
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
        <div className="flex h-screen w-screen overflow-hidden bg-slate-200 relative">
          {/* Application hôte */}
          <main className="min-w-0 flex-1 overflow-hidden">
            <MyClientDev route={route} onNavigate={navigate} compact={false} />
          </main>

          {/* Copilot Sidebar */}
          <CopilotSidebar
            isCollapsed={!isChatOpen}
            onToggleCollapse={() => setIsChatOpen(!isChatOpen)}
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
      )}
    </TooltipProvider>
  )
}
