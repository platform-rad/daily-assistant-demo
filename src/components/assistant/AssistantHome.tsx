import {
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
  Crosshair,
  Loader2,
  Minus,
  Search,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { AGENTS } from '@/data/agents'
import { BRIEFING_ALERTS } from '@/data/briefing'
import { ROUTES } from '@/data/hostRoutes'
import { HOME_SUGGESTIONS, PULSE_KPIS, type PulseKpi } from '@/data/pulse'
import type { HostRoute } from '@/data/types'
import { cn } from '@/lib/utils'
import { AgentIcon } from './AgentIcon'
import { SourceList } from './TrustBadges'

const TREND_ICON = { up: ArrowUpRight, down: ArrowDownRight, flat: Minus }
const TONE = {
  good: 'text-emerald-600',
  bad: 'text-red-600',
  neutral: 'text-slate-400',
}

/** Carte de KPI — cliquable pour lancer un deep dive conversationnel. */
function PulseCard({ kpi, onDeepDive }: { kpi: PulseKpi; onDeepDive: (q: string) => void }) {
  const Icon = TREND_ICON[kpi.trend ?? 'flat']
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={() => onDeepDive(kpi.deepDive)}
          className="group/kpi relative rounded-lg border border-slate-200 bg-white p-2.5 text-left shadow-rad transition-all hover:border-rad-indigo-300 hover:shadow-rad-md"
        >
          <div className="truncate text-2xs font-medium uppercase tracking-wider text-slate-500">
            {kpi.label}
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-base font-semibold tabular-nums tracking-tight text-slate-900">
              {kpi.value}
            </span>
            {kpi.delta && (
              <span
                className={cn('flex items-center gap-0.5 text-2xs font-medium', TONE[kpi.tone])}
              >
                <Icon className="size-3" />
                {kpi.delta}
              </span>
            )}
          </div>
          <div className="mt-0.5 truncate text-2xs text-slate-400">{kpi.caption}</div>
          <span className="absolute right-2 top-2 flex items-center gap-0.5 text-2xs font-medium text-rad-indigo-600 opacity-0 transition-opacity group-hover/kpi:opacity-100">
            <Search className="size-2.5" />
            Creuser
          </span>
        </button>
      </TooltipTrigger>
      <TooltipContent side="left">
        <div className="font-semibold text-white">Cliquer pour creuser</div>
        <div className="mt-1 text-slate-300">« {kpi.deepDive} »</div>
      </TooltipContent>
    </Tooltip>
  )
}

interface Props {
  route: HostRoute
  pinned: string[]
  generatingTarget: string | null
  onDeepDive: (question: string) => void
  onOpenDoc: (doc: 'cbs' | 'memo') => void
  onOpenBriefing: () => void
}

/**
 * Page d'accueil du widget : pouls chiffré piloté par les agents épinglés,
 * fil du jour condensé et suggestions d'action. Tout point d'entrée mène
 * à la même conversation.
 */
export function AssistantHome({
  route,
  pinned,
  generatingTarget,
  onDeepDive,
  onOpenDoc,
  onOpenBriefing,
}: Props) {
  const meta = ROUTES[route]
  const suggestedAgent = AGENTS.find((a) => a.id === meta.suggestedAgentId)

  // Le pouls suit les agents épinglés ; à contexte égal, les KPI pertinents
  // pour l'écran courant remontent en premier.
  const kpis = PULSE_KPIS.filter((k) => pinned.includes(k.agentId)).sort(
    (a, b) => Number(b.contexts.includes(route)) - Number(a.contexts.includes(route))
  )

  const headlines = [...BRIEFING_ALERTS]
    .sort((a, b) => Number(b.contexts.includes(route)) - Number(a.contexts.includes(route)))
    .slice(0, 3)

  const suggestions = HOME_SUGGESTIONS.filter((s) => s.contexts.includes(route)).slice(0, 3)

  return (
    <div className="rad-scroll min-h-0 flex-1 space-y-4 overflow-y-auto p-3">
      {/* Accroche + contexte détecté */}
      <div>
        <h2 className="text-sm font-semibold tracking-tight text-slate-900">
          Bonjour Élodie
        </h2>
        <p className="mt-0.5 text-2xs text-slate-500">
          Mercredi 2 septembre 2026 · {BRIEFING_ALERTS.length} signaux traités cette nuit
        </p>
        <div className="mt-2 flex items-start gap-1.5 rounded-md border border-rad-indigo-200 bg-rad-indigo-50/70 px-2.5 py-1.5">
          <Crosshair className="mt-0.5 size-3 shrink-0 text-rad-indigo-600" />
          <div className="min-w-0">
            <div className="text-2xs font-medium text-rad-indigo-800">{meta.contextLabel}</div>
            <div className="mt-0.5 flex items-center gap-1 text-2xs text-slate-500">
              {suggestedAgent && <AgentIcon name={suggestedAgent.icon} className="size-2.5" />}
              <span className="truncate">{suggestedAgent?.name}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Pouls — piloté par les agents épinglés */}
      <section>
        <div className="mb-2 flex items-center gap-1.5">
          <h3 className="text-2xs font-semibold uppercase tracking-wider text-slate-500">
            Votre pouls
          </h3>
          <Badge variant="secondary">{pinned.length} agents épinglés</Badge>
        </div>

        {kpis.length ? (
          <div className="grid grid-cols-2 gap-2">
            {kpis.map((k) => (
              <PulseCard key={k.id} kpi={k} onDeepDive={onDeepDive} />
            ))}
          </div>
        ) : (
          <div className="rounded-md border border-dashed border-slate-300 bg-slate-50 p-3 text-2xs text-slate-500">
            Aucun agent épinglé — utilisez l’icône d’épingle dans le sélecteur d’agents pour
            composer votre pouls.
          </div>
        )}
      </section>

      {/* Fil du jour */}
      <section>
        <div className="mb-2 flex items-center gap-1.5">
          <h3 className="text-2xs font-semibold uppercase tracking-wider text-slate-500">
            À la une
          </h3>
          <button
            onClick={onOpenBriefing}
            className="ml-auto flex items-center gap-0.5 text-2xs font-medium text-rad-indigo-600 hover:underline"
          >
            Les {BRIEFING_ALERTS.length} signaux
            <ChevronRight className="size-3" />
          </button>
        </div>

        <div className="space-y-1.5">
          {headlines.map((alert) => {
            const agent = AGENTS.find((a) => a.id === alert.agentId)
            return (
              <button
                key={alert.id}
                onClick={() => onDeepDive(`Creuse ce signal : ${alert.title}`)}
                className="group/news w-full rounded-lg border border-slate-200 bg-white p-2.5 text-left shadow-rad transition-all hover:border-rad-indigo-300 hover:shadow-rad-md"
              >
                <div className="flex items-center gap-1.5">
                  <span
                    className={cn(
                      'size-1.5 shrink-0 rounded-full',
                      alert.severity === 'high'
                        ? 'bg-red-500'
                        : alert.severity === 'medium'
                          ? 'bg-amber-500'
                          : 'bg-slate-400'
                    )}
                  />
                  <span className="flex min-w-0 items-center gap-1 text-2xs text-slate-500">
                    {agent && <AgentIcon name={agent.icon} className="size-2.5 shrink-0" />}
                    <span className="truncate">{agent?.name}</span>
                  </span>
                  <span className="ml-auto shrink-0 text-2xs text-slate-400">{alert.time}</span>
                </div>
                <div className="mt-1 text-2xs font-semibold leading-snug text-slate-900">
                  {alert.title}
                </div>
                <div className="mt-1.5 flex items-center gap-1">
                  <SourceList sources={alert.sources.slice(0, 2)} />
                  <span className="ml-auto flex shrink-0 items-center gap-0.5 text-2xs font-medium text-rad-indigo-600 opacity-0 transition-opacity group-hover/news:opacity-100">
                    Creuser <ArrowRight className="size-2.5" />
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      </section>

      {/* Actions suggérées */}
      <section>
        <h3 className="mb-2 text-2xs font-semibold uppercase tracking-wider text-slate-500">
          Actions suggérées
        </h3>
        <div className="space-y-1.5">
          {suggestions.map((s) => (
            <Button
              key={s.id}
              variant="secondary"
              size="sm"
              disabled={!!generatingTarget}
              className="w-full justify-start"
              onClick={() =>
                s.kind === 'ask' ? onDeepDive(s.prompt ?? s.label) : onOpenDoc(s.kind)
              }
            >
              {generatingTarget === `context:${s.kind}` ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <ArrowRight className="size-3.5 text-rad-indigo-600" />
              )}
              <span className="truncate">{s.label}</span>
            </Button>
          ))}
        </div>
      </section>
    </div>
  )
}
