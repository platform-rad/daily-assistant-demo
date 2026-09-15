import { useCallback, useState } from 'react'
import { TooltipProvider } from '@/components/ui/tooltip'
import { MyClientDev } from '@/components/host/MyClientDev'
import { CopilotChat } from '@/components/copilot/CopilotChat'
import { DesktopEnvironment } from '@/components/desktop/DesktopEnvironment'
import type { HostRoute } from '@/data/types'

export type AppMode = 'desktop' | 'legacy'

export default function App() {
  const [appMode, setAppMode] = useState<AppMode>('desktop')
  const [route, setRoute] = useState<HostRoute>('client')

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

  return (
    <TooltipProvider delayDuration={150}>
      {appMode === 'desktop' ? (
        /* Mode Desktop: Simulation d'un environnement Windows */
        <DesktopEnvironment onOpenMyClientDev={() => setAppMode('legacy')} />
      ) : (
        /* Mode Legacy: MyClientDev + CopilotChat */
        <div className="flex h-screen w-screen overflow-hidden bg-slate-200">
          {/* Application hôte */}
          <main className="min-w-0 flex-1 overflow-hidden">
            <MyClientDev route={route} onNavigate={navigate} compact={false} />
          </main>

          {/* Chat Copilot en side panel - Mêmes couleurs partout */}
          <div className="w-96 border-l border-slate-300 bg-white flex flex-col shadow-rad-lg">
            <CopilotChat
              mode="widget"
              currentRoute={route}
              onValidateAndEdit={handleValidateAndEdit}
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
      )}
    </TooltipProvider>
  )
}
