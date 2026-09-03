import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { DataTable, StatStrip } from '../DataTable'
import { PORTFOLIO_CLIENTS, PORTFOLIO_SUMMARY } from '@/data/portfolio'
import { cn } from '@/lib/utils'

const TREND = { up: ArrowUpRight, down: ArrowDownRight, flat: Minus }

export function PortfolioPage({ onOpenClient }: { onOpenClient: () => void }) {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-slate-900">Mon portefeuille</h1>
        <p className="mt-1 text-xs text-slate-500">
          Industrials EMEA — 24 groupes couverts · Élodie Mercier, Senior Banker
        </p>
      </div>

      <StatStrip stats={PORTFOLIO_SUMMARY} />

      <DataTable
        columns={['Groupe', 'Secteur', 'Notation', 'Exposition', 'PNB YTD', 'Signaux', 'Prochaine échéance']}
        highlightRow={0}
        onRowClick={(i) => i === 0 && onOpenClient()}
        rows={PORTFOLIO_CLIENTS.map((c) => {
          const Icon = TREND[c.trend]
          const tone =
            c.trend === 'up'
              ? 'text-emerald-600'
              : c.trend === 'down'
                ? 'text-red-600'
                : 'text-slate-400'
          return [
            c.name,
            c.sector,
            <Badge key={c.name} variant={c.rating.includes('negative') ? 'warning' : 'secondary'}>
              {c.rating}
            </Badge>,
            c.exposure,
            <span key={c.name} className={cn('inline-flex items-center gap-1', tone)}>
              <Icon className="size-3" />
              {c.nbi}
            </span>,
            <Badge key={c.name} variant={c.signals >= 4 ? 'danger' : 'outline'}>
              {c.signals}
            </Badge>,
            c.next,
          ]
        })}
      />

      <p className="text-2xs text-slate-400">
        Cliquez sur AeroDynamics Group pour ouvrir la fiche client.
      </p>
    </div>
  )
}
