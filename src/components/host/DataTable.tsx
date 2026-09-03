import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface Props {
  columns: string[]
  rows: ReactNode[][]
  /** Index de ligne mis en évidence (client courant, dossier critique…). */
  highlightRow?: number
  onRowClick?: (index: number) => void
}

export function DataTable({ columns, rows, highlightRow, onRowClick }: Props) {
  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
      <table className="w-full min-w-[640px] text-left text-xs">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50">
            {columns.map((c) => (
              <th
                key={c}
                className="whitespace-nowrap px-3 py-2 font-semibold uppercase tracking-wider text-slate-500"
              >
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map((row, i) => (
            <tr
              key={i}
              onClick={() => onRowClick?.(i)}
              className={cn(
                'transition-colors',
                onRowClick && 'cursor-pointer',
                highlightRow === i ? 'bg-rad-indigo-50/70' : 'hover:bg-slate-50'
              )}
            >
              {row.map((cell, j) => (
                <td
                  key={j}
                  className={cn(
                    'whitespace-nowrap px-3 py-2.5 text-slate-600',
                    j === 0 && 'font-medium text-slate-900'
                  )}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function StatStrip({
  stats,
  columns = 4,
}: {
  stats: Array<{ label: string; value: string; hint?: string }>
  columns?: number
}) {
  return (
    <div
      className={cn(
        'grid gap-3',
        columns === 4 ? 'grid-cols-2 lg:grid-cols-4' : 'grid-cols-2 lg:grid-cols-3'
      )}
    >
      {stats.map((s) => (
        <div key={s.label} className="rounded-lg border border-slate-200 bg-white p-3.5 shadow-rad">
          <div className="truncate text-2xs font-medium uppercase tracking-wider text-slate-500">
            {s.label}
          </div>
          <div className="mt-1.5 text-lg font-semibold tabular-nums tracking-tight text-slate-900">
            {s.value}
          </div>
          {s.hint && <div className="mt-1 truncate text-2xs text-slate-400">{s.hint}</div>}
        </div>
      ))}
    </div>
  )
}
