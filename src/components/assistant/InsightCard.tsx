import { ArrowRight, FileSpreadsheet, FileText, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Insight } from '@/data/insights'
import { cn } from '@/lib/utils'
import { ConfidenceIndicator, DataGapBadge, SourceList } from './TrustBadges'

const TONE = {
  good: 'text-emerald-600',
  bad: 'text-red-600',
  neutral: 'text-slate-500',
}

interface Props {
  insight: Insight
  onFollowUp: (f: Insight['followUps'][number]) => void
  busy: boolean
}

/** Réponse structurée de l'IA : synthèse, chiffres, sources, rebonds. */
export function InsightCard({ insight, onFollowUp, busy }: Props) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-rad">
      <div className="flex items-start gap-2">
        <div className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-rad-indigo-600">
          <Sparkles className="size-2.5 text-white" />
        </div>
        <h4 className="text-xs font-semibold leading-snug text-slate-900">{insight.headline}</h4>
      </div>

      <p className="mt-2 text-2xs leading-relaxed text-slate-600">{insight.body}</p>

      {!!insight.kpis?.length && (
        <div className="mt-2.5 grid grid-cols-2 gap-1.5">
          {insight.kpis.map((k) => (
            <div key={k.label} className="rounded-md border border-slate-200 bg-slate-50/70 p-2">
              <div className="truncate text-2xs uppercase tracking-wider text-slate-500">
                {k.label}
              </div>
              <div className="mt-0.5 flex items-baseline gap-1.5">
                <span className="text-sm font-semibold tabular-nums text-slate-900">{k.value}</span>
                {k.delta && (
                  <span className={cn('text-2xs font-medium', TONE[k.tone ?? 'neutral'])}>
                    {k.delta}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {!!insight.bullets?.length && (
        <ul className="mt-2.5 space-y-1.5">
          {insight.bullets.map((b) => (
            <li key={b} className="flex gap-2 text-2xs leading-relaxed text-slate-700">
              <span className="mt-1.5 size-1 shrink-0 rounded-full bg-rad-indigo-500" />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-2.5 flex flex-wrap items-center gap-1 border-t border-slate-100 pt-2">
        <SourceList sources={insight.sources} />
        {insight.dataGap && <DataGapBadge message={insight.dataGap} />}
        <span className="ml-auto">
          <ConfidenceIndicator value={insight.confidence} />
        </span>
      </div>

      {!!insight.followUps.length && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {insight.followUps.map((f) => {
            const Icon =
              f.kind === 'cbs' ? FileSpreadsheet : f.kind === 'memo' ? FileText : ArrowRight
            return (
              <Button
                key={f.label}
                size="xs"
                variant={f.kind === 'ask' ? 'secondary' : 'subtle'}
                disabled={busy}
                onClick={() => onFollowUp(f)}
              >
                <Icon className="size-3" />
                {f.label}
              </Button>
            )
          })}
        </div>
      )}
    </div>
  )
}
