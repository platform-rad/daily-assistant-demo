import { Badge } from '@/components/ui/badge'
import { DataTable, StatStrip } from '../DataTable'
import { PIPELINE_DEALS, PIPELINE_SUMMARY } from '@/data/portfolio'

const STAGE_TONE: Record<string, 'success' | 'info' | 'warning' | 'outline'> = {
  'Mandat obtenu': 'success',
  'Pitch envoyé': 'info',
  Négociation: 'warning',
  'Mandat en discussion': 'warning',
  'RFP à venir': 'outline',
}

export function PipelinePage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-slate-900">Pipeline commercial</h1>
        <p className="mt-1 text-xs text-slate-500">
          Industrials EMEA — T3–T4 2026 · 11 opportunités actives
        </p>
      </div>

      <StatStrip stats={PIPELINE_SUMMARY} />

      <DataTable
        columns={['Opportunité', 'Client', 'Produit', 'Revenu', 'Étape', 'Proba.', 'Closing', 'Responsable']}
        rows={PIPELINE_DEALS.map((d) => [
          d.name,
          d.client,
          d.product,
          d.revenue,
          <Badge key={d.name} variant={STAGE_TONE[d.stage] ?? 'outline'}>
            {d.stage}
          </Badge>,
          d.probability,
          d.close,
          d.owner,
        ])}
      />
    </div>
  )
}
