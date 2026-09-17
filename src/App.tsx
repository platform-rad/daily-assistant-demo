import { useCallback, useState } from 'react'
import { TooltipProvider } from '@/components/ui/tooltip'
import { MyClientDev } from '@/components/host/MyClientDev'
import { CopilotChat } from '@/components/copilot/CopilotChat'
import { CreditMemoViewer } from '@/components/credit-memo/CreditMemoViewer'
import { DesktopEnvironment } from '@/components/desktop/DesktopEnvironment'
import type { HostRoute } from '@/data/types'

export type AppMode = 'desktop' | 'legacy' | 'credit-memo'

export default function App() {
  const [appMode, setAppMode] = useState<AppMode>('desktop')
  const [route, setRoute] = useState<HostRoute>('client')
  const [isChatOpen, setIsChatOpen] = useState(false)

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
        /* Mode Legacy: MyClientDev with optional CopilotChat */
        <div className="flex h-screen w-screen overflow-hidden bg-slate-200 relative">
          {/* Application hôte */}
          <main className="min-w-0 flex-1 overflow-hidden">
            <MyClientDev route={route} onNavigate={navigate} compact={false} />
          </main>

          {/* Chat Copilot en side panel - Slide in from right */}
          <div
            className={`w-96 border-l border-slate-300 bg-white flex flex-col shadow-2xl transition-all duration-300 ${
              isChatOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0 pointer-events-none'
            }`}
            style={{ width: isChatOpen ? '384px' : '0px' }}
          >
            {isChatOpen && (
              <>
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
              </>
            )}
          </div>

          {/* Floating button to toggle chat */}
          <button
            onClick={() => setIsChatOpen(!isChatOpen)}
            className="fixed bottom-6 right-6 w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-2xl hover:shadow-xl transition z-50"
            style={{
              background: 'linear-gradient(135deg, #7D4FFE 0%, #6D3BF0 100%)',
              right: isChatOpen ? 'calc(384px + 24px)' : '24px',
              transition: 'all 0.3s ease',
            }}
            title={isChatOpen ? 'Fermer le chat' : 'Ouvrir le chat'}
          >
            🤖
          </button>
        </div>
      )}
    </TooltipProvider>
  )
}
