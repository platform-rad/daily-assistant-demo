import { useCallback, useEffect, useRef, useState } from 'react'
import { TooltipProvider } from '@/components/ui/tooltip'
import { MyClientDev } from '@/components/host/MyClientDev'
import { CollapsedPill, DEFAULT_PILL_TOP } from '@/components/assistant/CollapsedPill'
import {
  DailyAssistant,
  type AssistantMode,
  type AssistantView,
} from '@/components/assistant/DailyAssistant'
import { DesktopEnvironment } from '@/components/desktop/DesktopEnvironment'
import { AGENTS, DEFAULT_PINNED, MAX_PINNED } from '@/data/agents'
import { BRIEFING_ALERTS } from '@/data/briefing'
import { ROUTES } from '@/data/hostRoutes'
import type { BriefingAlert, HostRoute } from '@/data/types'
import { fakeLatency } from '@/lib/utils'

const PENDING_COUNT = BRIEFING_ALERTS.filter((a) => a.severity !== 'low').length

export type AppMode = 'desktop' | 'legacy' | 'widget'

export default function App() {
  const [appMode, setAppMode] = useState<AppMode>('desktop')
  const [mode, setMode] = useState<AssistantMode>('widget')
  const [view, setView] = useState<AssistantView>('home')
  const [docId, setDocId] = useState<'cbs' | 'memo'>('cbs')
  const [activeAgentId, setActiveAgentId] = useState('client-market-intel')
  const [pinned, setPinned] = useState<string[]>(DEFAULT_PINNED)
  const [generatingTarget, setGeneratingTarget] = useState<string | null>(null)
  // Position verticale de la pilule réduite — conservée entre deux ouvertures.
  const [pillTop, setPillTop] = useState(DEFAULT_PILL_TOP)
  // Écran courant de l'application hôte.
  const [route, setRoute] = useState<HostRoute>('client')

  /**
   * Le changement d'écran hôte réoriente l'agent mis en avant — sauf si
   * l'utilisateur a choisi son agent à la main, auquel cas on ne le contredit pas.
   */
  const agentPickedByUser = useRef(false)
  useEffect(() => {
    if (agentPickedByUser.current) return
    setActiveAgentId(ROUTES[route].suggestedAgentId)
  }, [route])

  /** Épinglage des favoris, plafonné à 3 priorités. */
  const togglePin = useCallback((id: string) => {
    setPinned((current) => {
      if (current.includes(id)) return current.filter((p) => p !== id)
      if (current.length >= MAX_PINNED) return [...current.slice(1), id]
      return [...current, id]
    })
  }, [])

  /** Génération simulée d'1 s, puis bascule en Split View sur le document. */
  const openDocument = useCallback(async (doc: 'cbs' | 'memo', key: string) => {
    setGeneratingTarget(key)
    await fakeLatency(1000)
    setDocId(doc)
    setView('workspace')
    setMode('split')
    setActiveAgentId(doc === 'cbs' ? 'cbs-cap' : 'briefing-memo')
    agentPickedByUser.current = true
    setGeneratingTarget(null)
  }, [])

  const openDocFromAlert = useCallback(
    (doc: 'cbs' | 'memo', alert: BriefingAlert) => openDocument(doc, `${alert.id}:${doc}`),
    [openDocument]
  )

  const openDocFromContext = useCallback(
    (doc: 'cbs' | 'memo') => openDocument(doc, `context:${doc}`),
    [openDocument]
  )

  const selectAgent = useCallback((id: string) => {
    agentPickedByUser.current = true
    setActiveAgentId(id)
    const agent = AGENTS.find((a) => a.id === id)
    if (agent?.producesDocument) {
      setDocId(id === 'briefing-memo' ? 'memo' : 'cbs')
      setView('workspace')
    } else {
      setView('home')
    }
  }, [])

  /**
   * Navigation dans l'hôte : l'assistant n'est ni démonté ni réinitialisé.
   * Si un document est ouvert en co-édition, on le laisse tel quel — changer
   * d'écran ne doit pas faire perdre les modifications en cours.
   */
  const navigate = useCallback(
    (next: HostRoute) => {
      setRoute(next)
      if (view !== 'workspace') agentPickedByUser.current = false
    },
    [view]
  )

  /**
   * Changement d'onglet interne. Revenir à l'accueil recale l'assistant sur
   * le contexte de l'écran hôte ; entrer en conversation ne le fait pas.
   */
  const changeView = useCallback(
    (next: AssistantView) => {
      if (next === 'home') {
        agentPickedByUser.current = false
        setActiveAgentId(ROUTES[route].suggestedAgentId)
      }
      setView(next)
    },
    [route]
  )

  return (
    <TooltipProvider delayDuration={150}>
      {appMode === 'desktop' ? (
        /* Mode Desktop: Simulation d'un environnement Windows */
        <DesktopEnvironment onOpenMyClientDev={() => setAppMode('legacy')} />
      ) : (
        /* Mode Legacy: MyClientDev + DailyAssistant */
        <div className="flex h-screen w-screen overflow-hidden bg-slate-200">
          {/* Application hôte — se resserre à 50 % en Split View */}
          <main className="min-w-0 flex-1 overflow-hidden">
            <MyClientDev route={route} onNavigate={navigate} compact={mode === 'split'} />
          </main>

          {/* Compagnon ancré à droite, persistant d'un écran hôte à l'autre */}
          {mode === 'collapsed' ? (
            <CollapsedPill
              count={PENDING_COUNT}
              onOpen={() => setMode('widget')}
              top={pillTop}
              onTopChange={setPillTop}
            />
          ) : (
            <DailyAssistant
              mode={mode}
              view={view}
              docId={docId}
              activeAgentId={activeAgentId}
              pinned={pinned}
              generatingTarget={generatingTarget}
              route={route}
              onViewChange={changeView}
              onContextAction={openDocFromContext}
              onSelectAgent={selectAgent}
              onTogglePin={togglePin}
              onToggleMode={() => setMode((m) => (m === 'split' ? 'widget' : 'split'))}
              onCollapse={() => setMode('collapsed')}
              onOpenDoc={openDocFromAlert}
              onSwitchDoc={setDocId}
            />
          )}

          <div className="fixed bottom-4 right-4 z-40">
            <button
              onClick={() => setAppMode('desktop')}
              className="px-3 py-1 text-xs rounded bg-gray-600 text-white hover:bg-gray-700 opacity-50 hover:opacity-100"
            >
              Mode Desktop
            </button>
          </div>
        </div>
      )}
    </TooltipProvider>
  )
}
