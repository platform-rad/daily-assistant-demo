import { ArrowDownRight, ArrowUpRight, Info, Minus, Sparkles, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { DocBlock } from '@/data/types'
import { cn } from '@/lib/utils'
import { Editable, editKey } from './Editable'
import { ConfidenceIndicator, DataGapBadge, SourceList } from './TrustBadges'

const TREND_ICON = { up: ArrowUpRight, down: ArrowDownRight, flat: Minus }

interface Props {
  block: DocBlock
  /** Vrai en mode Widget (380 px) : les grilles passent sur une colonne. */
  compact?: boolean
  /** Cible actuellement en édition — les autres restent du texte sélectionnable. */
  editingKey: string | null
  onChangeText: (text: string) => void
  onChangeItem: (index: number, text: string) => void
  onChangeCell: (index: number, value: string) => void
  onDelete: () => void
}

/** Bandeau de traçabilité affiché sous chaque bloc généré. */
function TrustFooter({ block }: { block: DocBlock }) {
  if (!block.sources?.length && !block.dataGap && !block.confidence) return null
  return (
    <div className="mt-1.5 flex flex-wrap items-center gap-1 opacity-0 transition-opacity duration-150 group-hover/block:opacity-100 focus-within:opacity-100">
      <SourceList sources={block.sources} />
      {block.dataGap && <DataGapBadge message={block.dataGap} />}
      {block.confidence != null && <ConfidenceIndicator value={block.confidence} />}
    </div>
  )
}

export function DocumentBlock({
  block,
  compact = false,
  editingKey,
  onChangeText,
  onChangeItem,
  onChangeCell,
  onDelete,
}: Props) {
  const body = (() => {
    switch (block.kind) {
      case 'h1':
        return (
          <Editable
            as="h2"
            value={block.text ?? ''}
            onChange={onChangeText}
            blockId={block.id}
            editable={editingKey === editKey(block.id)}
            className="mt-5 border-b border-slate-200 pb-1 text-sm font-semibold tracking-tight text-slate-900"
          />
        )

      case 'h2':
        return (
          <Editable
            as="h3"
            value={block.text ?? ''}
            onChange={onChangeText}
            blockId={block.id}
            editable={editingKey === editKey(block.id)}
            className="mt-4 text-xs font-semibold uppercase tracking-wider text-slate-500"
          />
        )

      case 'paragraph':
        return (
          <Editable
            value={block.text ?? ''}
            onChange={onChangeText}
            blockId={block.id}
            editable={editingKey === editKey(block.id)}
            className="mt-2 text-xs leading-relaxed text-slate-700"
            placeholder="Saisissez un paragraphe…"
          />
        )

      case 'bullets':
        return (
          <ul className="mt-2 space-y-1.5">
            {block.items?.map((item, i) => (
              <li key={i} className="flex gap-2 text-xs leading-relaxed text-slate-700">
                <span className="mt-1.5 size-1 shrink-0 rounded-full bg-rad-indigo-500" />
                <Editable
                  value={item}
                  onChange={(t) => onChangeItem(i, t)}
                  blockId={block.id}
                  itemIndex={i}
                  editable={editingKey === editKey(block.id, i)}
                  className="min-w-0 flex-1"
                />
              </li>
            ))}
          </ul>
        )

      case 'kpi':
        return (
          <div className={cn('mt-3 grid gap-2', compact ? 'grid-cols-1' : 'grid-cols-2')}>
            {block.cells?.map((cell, ci) => {
              const Icon = TREND_ICON[cell.trend ?? 'flat']
              const tone =
                cell.trend === 'up'
                  ? 'text-emerald-600'
                  : cell.trend === 'down'
                    ? 'text-red-600'
                    : 'text-slate-400'
              return (
                <div
                  key={cell.label}
                  className="group/cell rounded-md border border-slate-200 bg-slate-50/70 p-2.5"
                >
                  <div className="text-2xs font-medium uppercase tracking-wider text-slate-500">
                    {cell.label}
                  </div>
                  <div className="mt-1 flex items-baseline gap-1.5">
                    <Editable
                      as="span"
                      value={cell.value}
                      onChange={(v) => onChangeCell(ci, v)}
                      blockId={block.id}
                      cellIndex={ci}
                      editable={editingKey === editKey(block.id, undefined, ci)}
                      className="text-base font-semibold tabular-nums text-slate-900"
                    />
                    {cell.delta && (
                      <span className={cn('flex items-center gap-0.5 text-2xs font-medium', tone)}>
                        <Icon className="size-3" />
                        {cell.delta}
                      </span>
                    )}
                  </div>
                  <div className="mt-1.5 flex flex-wrap items-center gap-1">
                    <SourceList sources={cell.sources} />
                    {cell.dataGap && <DataGapBadge message={cell.dataGap} />}
                  </div>
                </div>
              )
            })}
          </div>
        )

      case 'callout':
        return (
          <div className="mt-3 rounded-md border-l-2 border-amber-400 bg-amber-50/70 p-3">
            <div className="flex items-center gap-1.5 text-2xs font-semibold uppercase tracking-wider text-amber-800">
              <Info className="size-3" />
              Point d’attention
            </div>
            <Editable
              value={block.text ?? ''}
              onChange={onChangeText}
              blockId={block.id}
              editable={editingKey === editKey(block.id)}
              className="mt-1.5 text-xs leading-relaxed text-amber-950"
            />
          </div>
        )

      case 'opportunity':
        return (
          <div
            className={cn(
              'mt-3 rounded-lg border bg-white p-3 shadow-rad transition-colors',
              block.aiGenerated
                ? 'border-rad-indigo-300 ring-1 ring-rad-indigo-100'
                : 'border-slate-200'
            )}
          >
            <div className="flex flex-wrap items-center gap-1.5">
              {block.meta?.product && <Badge variant="info">{block.meta.product}</Badge>}
              {block.meta?.revenue && (
                <Badge variant="success">Revenu estimé {block.meta.revenue}</Badge>
              )}
              {block.meta?.probability && (
                <Badge variant="outline">Proba. {block.meta.probability}</Badge>
              )}
              {block.aiGenerated && (
                <Badge className="gap-1">
                  <Sparkles className="size-2.5" />
                  Ajouté par l’IA
                </Badge>
              )}
            </div>
            <Editable
              value={block.text ?? ''}
              onChange={onChangeText}
              blockId={block.id}
              editable={editingKey === editKey(block.id)}
              className="mt-2 text-xs leading-relaxed text-slate-700"
            />
            {(block.meta?.horizon || block.meta?.owner) && (
              <dl
                className={cn(
                  'mt-2 grid gap-2 border-t border-slate-100 pt-2',
                  compact ? 'grid-cols-1' : 'grid-cols-2'
                )}
              >
                {block.meta.horizon && (
                  <div>
                    <dt className="text-2xs uppercase tracking-wider text-slate-400">Horizon</dt>
                    <dd className="text-2xs text-slate-700">{block.meta.horizon}</dd>
                  </div>
                )}
                {block.meta.owner && (
                  <div>
                    <dt className="text-2xs uppercase tracking-wider text-slate-400">
                      Responsable
                    </dt>
                    <dd className="text-2xs text-slate-700">{block.meta.owner}</dd>
                  </div>
                )}
              </dl>
            )}
          </div>
        )

      default:
        return null
    }
  })()

  return (
    <div className="group/block relative -mx-2 rounded-md px-2 py-0.5 transition-colors hover:bg-slate-50/70">
      {body}
      <TrustFooter block={block} />
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={onDelete}
        title="Supprimer le bloc"
        className="absolute -right-1 top-1 opacity-0 transition-opacity group-hover/block:opacity-100 hover:text-red-600"
      >
        <Trash2 className="size-3.5" />
      </Button>
    </div>
  )
}
