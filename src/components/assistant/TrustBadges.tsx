import { AlertTriangle, Database, ShieldCheck } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { SOURCE_LABELS } from '@/data/client'
import type { SourceRef } from '@/data/types'
import { cn } from '@/lib/utils'

/** Badge de traçabilité : [Source: C3], [Source: Dealogic]… */
export function SourceBadge({ source }: { source: SourceRef }) {
  const meta = SOURCE_LABELS[source.system]
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="inline-flex cursor-help items-center gap-1 rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 font-mono text-2xs font-medium text-slate-600 transition-colors hover:border-rad-indigo-300 hover:bg-rad-indigo-50 hover:text-rad-indigo-700">
          <Database className="size-2.5" />
          Source: {source.system}
        </span>
      </TooltipTrigger>
      <TooltipContent>
        <div className="font-semibold text-white">{meta?.name ?? source.system}</div>
        {meta && <div className="text-slate-400">{meta.blurb}</div>}
        <div className="mt-1 text-slate-200">{source.detail}</div>
        <div className="mt-1 text-slate-400">Fraîcheur : {source.asOf}</div>
      </TooltipContent>
    </Tooltip>
  )
}

export function SourceList({ sources, className }: { sources?: SourceRef[]; className?: string }) {
  if (!sources?.length) return null
  return (
    <div className={cn('flex flex-wrap items-center gap-1', className)}>
      {sources.map((s, i) => (
        <SourceBadge key={`${s.system}-${i}`} source={s} />
      ))}
    </div>
  )
}

/** Avertissement de donnée partielle ou indisponible. */
export function DataGapBadge({ message }: { message: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="inline-flex cursor-help items-center gap-1 rounded border border-amber-300 bg-amber-50 px-1.5 py-0.5 text-2xs font-semibold text-amber-800">
          <AlertTriangle className="size-2.5" />
          Data Gap
        </span>
      </TooltipTrigger>
      <TooltipContent className="border-amber-700 bg-amber-950">
        <div className="font-semibold text-amber-200">Donnée partielle</div>
        <div className="mt-1 text-amber-50">{message}</div>
      </TooltipContent>
    </Tooltip>
  )
}

/** Indicateur de confiance de la génération IA. */
export function ConfidenceIndicator({
  value,
  variant = 'inline',
}: {
  value: number
  variant?: 'inline' | 'bar'
}) {
  const tone =
    value >= 85
      ? { text: 'text-emerald-700', bg: 'bg-emerald-500', chip: 'border-emerald-200 bg-emerald-50' }
      : value >= 70
        ? { text: 'text-amber-800', bg: 'bg-amber-500', chip: 'border-amber-200 bg-amber-50' }
        : { text: 'text-red-700', bg: 'bg-red-500', chip: 'border-red-200 bg-red-50' }

  if (variant === 'bar') {
    return (
      <div className="flex items-center gap-2">
        <ShieldCheck className={cn('size-3.5', tone.text)} />
        <span className="text-2xs font-medium text-slate-500">Confidence</span>
        <div className="h-1.5 w-20 overflow-hidden rounded-full bg-slate-200">
          <div className={cn('h-full rounded-full', tone.bg)} style={{ width: `${value}%` }} />
        </div>
        <span className={cn('text-2xs font-semibold tabular-nums', tone.text)}>{value}%</span>
      </div>
    )
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          className={cn(
            'inline-flex cursor-help items-center gap-1 rounded border px-1.5 py-0.5 text-2xs font-semibold',
            tone.chip,
            tone.text
          )}
        >
          <ShieldCheck className="size-2.5" />
          Confidence: {value}%
        </span>
      </TooltipTrigger>
      <TooltipContent>
        Niveau de confiance de la génération sur ce bloc. En dessous de 80 %, une relecture
        humaine est requise avant diffusion externe.
      </TooltipContent>
    </Tooltip>
  )
}
