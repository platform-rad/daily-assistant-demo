import { AlertTriangle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { DataTable, StatStrip } from '../DataTable'
import { CREDIT_FILES, CREDIT_SUMMARY } from '@/data/portfolio'

export function CreditPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-slate-900">Dossiers de crédit</h1>
        <p className="mt-1 text-xs text-slate-500">
          Comité de crédit EMEA — séance du 30 septembre 2026
        </p>
      </div>

      <StatStrip stats={CREDIT_SUMMARY} />

      <div className="flex items-start gap-2.5 rounded-lg border-l-2 border-red-500 bg-red-50 p-3">
        <AlertTriangle className="mt-0.5 size-4 shrink-0 text-red-600" />
        <div>
          <div className="text-xs font-semibold text-red-900">
            1 franchissement de covenant à traiter en séance
          </div>
          <p className="mt-0.5 text-2xs leading-relaxed text-red-800">
            Ferrovia Lombarda — levier à 4,6× pour un maximum contractuel de 4,50×. Waiver en
            négociation, exposition Groupe de €268 M.
          </p>
        </div>
      </div>

      <DataTable
        columns={['Client', 'Nature du dossier', 'Exposition', 'Levier', 'Covenant', 'Statut', 'Instance']}
        highlightRow={0}
        rows={CREDIT_FILES.map((f) => [
          f.client,
          f.type,
          f.exposure,
          f.leverage,
          f.covenant,
          <Badge key={f.client} variant={f.tone}>
            {f.status}
          </Badge>,
          f.reviewer,
        ])}
      />
    </div>
  )
}
