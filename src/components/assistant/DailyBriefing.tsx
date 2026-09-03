import { Clock, FileSpreadsheet, FileText, Loader2, RefreshCw } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AGENTS } from '@/data/agents'
import { BRIEFING_ALERTS } from '@/data/briefing'
import { ROUTES } from '@/data/hostRoutes'
import type { AlertSeverity, BriefingAlert, HostRoute } from '@/data/types'
import { cn } from '@/lib/utils'
import { AgentIcon } from './AgentIcon'
import { ConfidenceIndicator, SourceList } from './TrustBadges'

const SEVERITY: Record<AlertSeverity, { label: string; dot: string; badge: 'danger' | 'warning' | 'secondary' }> = {
  high: { label: 'Priorité haute', dot: 'bg-red-500', badge: 'danger' },
  medium: { label: 'À surveiller', dot: 'bg-amber-500', badge: 'warning' },
  low: { label: 'Information', dot: 'bg-slate-400', badge: 'secondary' },
}

interface Props {
  onOpenDoc: (doc: 'cbs' | 'memo', fromAlert: BriefingAlert) => void
  /** Agent mis en avant — ses signaux remontent, sans filtrer les autres. */
  priorityAgentId?: string
  generatingTarget: string | null
  /** Écran hôte courant — pilote le classement des signaux. */
  route: HostRoute
}

function AlertCard({
  alert,
  inContext,
  contextLabel,
  onOpenDoc,
  generatingTarget,
}: {
  alert: BriefingAlert
  inContext: boolean
  contextLabel: string
  onOpenDoc: Props['onOpenDoc']
  generatingTarget: string | null
}) {
  const agent = AGENTS.find((a) => a.id === alert.agentId)
  const sev = SEVERITY[alert.severity]

  return (
    <article
      className={cn(
        'group rounded-lg border bg-white p-3 shadow-rad transition-shadow hover:shadow-rad-md',
        inContext ? 'border-rad-indigo-200 ring-1 ring-rad-indigo-100' : 'border-slate-200 opacity-80'
      )}
    >
      {inContext && (
        <div className="mb-1.5 truncate text-2xs font-medium text-rad-indigo-600">
          ▸ {contextLabel}
        </div>
      )}
      <div className="flex items-center gap-2">
        <span className={cn('size-1.5 shrink-0 rounded-full', sev.dot)} />
        <span className="flex min-w-0 items-center gap-1 text-2xs font-medium text-slate-500">
          {agent && <AgentIcon name={agent.icon} className="size-3 shrink-0" />}
          <span className="truncate">{agent?.name}</span>
        </span>
        <span className="ml-auto flex shrink-0 items-center gap-1 text-2xs text-slate-400">
          <Clock className="size-3" />
          {alert.time}
        </span>
      </div>

      <h4 className="mt-2 text-xs font-semibold leading-snug text-slate-900">{alert.title}</h4>
      <p className="mt-1 text-2xs leading-relaxed text-slate-600">{alert.summary}</p>

      <div className="mt-2 flex flex-wrap items-center gap-1">
        {alert.tags.map((t) => (
          <Badge key={t} variant="secondary">
            {t}
          </Badge>
        ))}
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-1 border-t border-slate-100 pt-2">
        <SourceList sources={alert.sources} />
        <span className="ml-auto">
          <ConfidenceIndicator value={alert.confidence} />
        </span>
      </div>

      <div className="mt-2 flex flex-wrap gap-1.5">
        {alert.actions.map((action) => {
          const key = `${alert.id}:${action.target}`
          const busy = generatingTarget === key
          const Icon = action.target === 'cbs' ? FileSpreadsheet : FileText
          return (
            <Button
              key={action.label}
              size="xs"
              variant={action.target === 'cbs' ? 'subtle' : 'secondary'}
              disabled={!!generatingTarget}
              onClick={() => action.target !== 'none' && onOpenDoc(action.target, alert)}
            >
              {busy ? <Loader2 className="size-3 animate-spin" /> : <Icon className="size-3" />}
              {busy ? 'Génération…' : action.label}
            </Button>
          )
        })}
      </div>
    </article>
  )
}

export function DailyBriefing({ onOpenDoc, priorityAgentId, generatingTarget, route }: Props) {
  // Le briefing reste consolidé, mais son ordre suit l'écran consulté :
  // d'abord les signaux pertinents pour le contexte, puis ceux de l'agent
  // sélectionné, puis le reste.
  const score = (a: BriefingAlert) =>
    (a.contexts.includes(route) ? 2 : 0) + (a.agentId === priorityAgentId ? 1 : 0)
  const shown = [...BRIEFING_ALERTS].sort((a, b) => score(b) - score(a))
  const inContext = BRIEFING_ALERTS.filter((a) => a.contexts.includes(route))

  return (
    <div className="space-y-3 p-3">
      <div className="flex items-start gap-2">
        <div className="min-w-0 flex-1">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Daily Briefing
          </h3>
          <p className="mt-0.5 text-2xs text-slate-400">
            2 septembre 2026 · {shown.length} signaux, {inContext.length} liés à cet écran
          </p>
        </div>
        <Button variant="ghost" size="icon-sm" title="Relancer les agents">
          <RefreshCw className="size-3.5" />
        </Button>
      </div>

      {shown.map((alert, i) => (
        <div key={alert.id}>
          {i === inContext.length && (
            <div className="mb-3 flex items-center gap-2">
              <span className="h-px flex-1 bg-slate-200" />
              <span className="text-2xs uppercase tracking-wider text-slate-400">
                Autres signaux du jour
              </span>
              <span className="h-px flex-1 bg-slate-200" />
            </div>
          )}
          <AlertCard
            alert={alert}
            inContext={alert.contexts.includes(route)}
            contextLabel={ROUTES[route].contextLabel}
            onOpenDoc={onOpenDoc}
            generatingTarget={generatingTarget}
          />
        </div>
      ))}

      {/* Les deux raccourcis se rattachent au signal le plus pertinent de la
          liste affichée, plutôt qu'à un index fixe du jeu de données. */}
      <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50/60 p-3">
        <h4 className="text-2xs font-semibold uppercase tracking-wider text-slate-500">
          Documents en cours
        </h4>
        <div className="mt-2 space-y-1.5">
          {(
            [
              { doc: 'cbs', icon: FileSpreadsheet, label: 'Éditer le CBS/CAP 2026–2027' },
              { doc: 'memo', icon: FileText, label: 'Éditer le Briefing Memo du 15 sept.' },
            ] as const
          ).map(({ doc, icon: Icon, label }) => {
            const anchor = shown.find((a) => a.actions.some((x) => x.target === doc)) ?? shown[0]
            if (!anchor) return null
            return (
              <Button
                key={doc}
                variant="secondary"
                size="sm"
                className="w-full justify-start"
                onClick={() => onOpenDoc(doc, anchor)}
              >
                <Icon className="size-3.5 text-rad-indigo-600" />
                <span className="truncate">{label}</span>
              </Button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
