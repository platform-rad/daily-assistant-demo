import { ArrowLeft, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Insight } from '@/data/insights'
import type { BriefingAlert, HostRoute } from '@/data/types'
import { useAssistantChat } from '@/hooks/useAssistantChat'
import { cn } from '@/lib/utils'
import { AssistantHeader } from './AssistantHeader'
import { AssistantHome } from './AssistantHome'
import { Composer } from './Composer'
import { ContextBanner } from './ContextBanner'
import { ConversationView } from './ConversationView'
import { DailyBriefing } from './DailyBriefing'
import { Workspace } from './Workspace'

export type AssistantMode = 'collapsed' | 'widget' | 'split'
export type AssistantView = 'home' | 'briefing' | 'chat' | 'workspace'

const COMPOSER_CHIPS = [
  'Résume les signaux du jour',
  'Quel est le risque de covenant ?',
  'Où concentrer mon effort ?',
]

interface Props {
  mode: Exclude<AssistantMode, 'collapsed'>
  view: AssistantView
  docId: 'cbs' | 'memo'
  activeAgentId: string
  pinned: string[]
  generatingTarget: string | null
  route: HostRoute
  onViewChange: (view: AssistantView) => void
  onContextAction: (target: 'cbs' | 'memo') => void
  onSelectAgent: (id: string) => void
  onTogglePin: (id: string) => void
  onToggleMode: () => void
  onCollapse: () => void
  onOpenDoc: (doc: 'cbs' | 'memo', alert: BriefingAlert) => void
  onSwitchDoc: (id: 'cbs' | 'memo') => void
}

export function DailyAssistant({
  mode,
  view,
  docId,
  activeAgentId,
  pinned,
  generatingTarget,
  route,
  onViewChange,
  onContextAction,
  onSelectAgent,
  onTogglePin,
  onToggleMode,
  onCollapse,
  onOpenDoc,
  onSwitchDoc,
}: Props) {
  const isSplit = mode === 'split'
  // La conversation vit ici : elle survit aux changements d'écran hôte,
  // de mode et d'onglet interne.
  const chat = useAssistantChat()

  /** Point d'entrée unique du deep dive : KPI, actualité, suggestion ou saisie. */
  const deepDive = (question: string) => {
    onViewChange('chat')
    void chat.ask(question)
  }

  const handleFollowUp = (f: Insight['followUps'][number]) => {
    if (f.kind === 'ask') deepDive(f.prompt ?? f.label)
    else onContextAction(f.kind)
  }

  return (
    <aside
      className={cn(
        'flex h-full min-h-0 shrink-0 flex-col border-l border-slate-300 bg-slate-100 shadow-rad-lg',
        'animate-slide-in-right transition-[width] duration-300 ease-out'
      )}
      style={{ width: isSplit ? '50%' : 380 }}
      aria-label="Daily Assistant"
    >
      <AssistantHeader
        activeAgentId={activeAgentId}
        pinned={pinned}
        mode={mode}
        onSelectAgent={onSelectAgent}
        onTogglePin={onTogglePin}
        onToggleMode={onToggleMode}
        onCollapse={onCollapse}
      />

      {view === 'workspace' && (
        <Workspace
          docId={docId}
          onSwitchDoc={onSwitchDoc}
          onBack={() => onViewChange('home')}
          compact={!isSplit}
        />
      )}

      {view === 'home' && (
        <div className={cn('flex min-h-0 flex-1 flex-col', isSplit && 'items-center')}>
          <div className={cn('flex min-h-0 w-full flex-1 flex-col', isSplit && 'max-w-2xl')}>
            <AssistantHome
              route={route}
              pinned={pinned}
              generatingTarget={generatingTarget}
              onDeepDive={deepDive}
              onOpenDoc={onContextAction}
              onOpenBriefing={() => onViewChange('briefing')}
            />
            <Composer busy={chat.busy} onSend={deepDive} chips={COMPOSER_CHIPS} />
          </div>
        </div>
      )}

      {view === 'chat' && (
        <div className={cn('flex min-h-0 flex-1 flex-col', isSplit && 'items-center')}>
          <div className={cn('flex min-h-0 w-full flex-1 flex-col', isSplit && 'max-w-2xl')}>
            <ConversationView
              entries={chat.entries}
              busy={chat.busy}
              onFollowUp={handleFollowUp}
              onBack={() => onViewChange('home')}
            />
            <Composer
              busy={chat.busy}
              onSend={deepDive}
              placeholder="Question de suivi…"
              chips={COMPOSER_CHIPS}
            />
          </div>
        </div>
      )}

      {view === 'briefing' && (
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="flex shrink-0 items-center gap-1.5 border-b border-slate-200 bg-white px-3 py-2">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => onViewChange('home')}
              title="Retour à l’accueil"
            >
              <ArrowLeft className="size-3.5" />
            </Button>
            <span className="text-2xs font-semibold uppercase tracking-wider text-slate-500">
              Tous les signaux
            </span>
          </div>
          <ContextBanner
            route={route}
            onRunContextAction={onContextAction}
            busy={!!generatingTarget}
          />
          <div className="rad-scroll min-h-0 flex-1 overflow-y-auto">
            <div className={cn(isSplit && 'mx-auto max-w-2xl')}>
              <DailyBriefing
                route={route}
                onOpenDoc={onOpenDoc}
                priorityAgentId={activeAgentId}
                generatingTarget={generatingTarget}
              />
            </div>
          </div>
        </div>
      )}

      {generatingTarget && view !== 'workspace' && (
        <div className="flex shrink-0 items-center gap-2 border-t border-slate-200 bg-white px-3 py-2 text-2xs text-slate-500">
          <Loader2 className="size-3.5 animate-spin text-rad-indigo-600" />
          L’agent assemble le document à partir de C3, Dealogic, Atlas et Baccarat…
        </div>
      )}
    </aside>
  )
}
