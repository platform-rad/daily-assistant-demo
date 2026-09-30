import { ArrowRight, AlertTriangle, Clock } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StatStrip } from '../DataTable'
import type { CapCbsDossier, CapCbsStatus } from '@/data/capCbsDossiers'

const STATUS_BADGE: Record<CapCbsStatus, 'warning' | 'info' | 'success'> = {
  Draft: 'warning',
  'Pending Review': 'info',
  Validated: 'success',
}

interface CapCbsDashboardPageProps {
  dossiers: CapCbsDossier[]
  onOpenDetail: (client: string) => void
}

export function CapCbsDashboardPage({ dossiers, onOpenDetail }: CapCbsDashboardPageProps) {
  const draftCount = dossiers.filter((d) => d.status === 'Draft').length
  const pendingCount = dossiers.filter((d) => d.status === 'Pending Review').length
  const validatedCount = dossiers.filter((d) => d.status === 'Validated').length
  // "Ce qui a bougé" — dossiers récemment mis à jour, dérivé de la même source que la table.
  const recentUpdates = dossiers.filter((d) => d.updatedAt.startsWith('il y a'))

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-slate-900">CAP / CBS — Tableau de bord</h1>
        <p className="mt-1 text-xs text-slate-500">
          Tous les cycles Client Business Strategy &amp; Client Action Plan en cours sur le portefeuille.
        </p>
      </div>

      <StatStrip
        stats={[
          { label: 'Dossiers actifs', value: String(dossiers.length) },
          { label: 'Brouillons', value: String(draftCount) },
          { label: 'En attente de revue', value: String(pendingCount), hint: 'Nécessite validation humaine' },
          { label: 'Validés', value: String(validatedCount) },
        ]}
      />

      {/* Ce qui a bougé — flux d'activité, pas juste un point rouge */}
      {recentUpdates.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="size-3.5 text-rad-indigo-600" />
              Ce qui a bougé récemment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {recentUpdates.map((d) => (
              <button
                key={d.id}
                onClick={() => onOpenDetail(d.client)}
                className="w-full flex items-center gap-2.5 rounded-lg border border-slate-200 p-2.5 text-left hover:border-rad-indigo-300 hover:bg-rad-indigo-50/40 transition"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-slate-900">{d.client}</p>
                  <p className="text-2xs text-slate-500">{d.note}</p>
                </div>
                <span className="text-2xs text-slate-400 flex-shrink-0">{d.updatedAt}</span>
              </button>
            ))}
          </CardContent>
        </Card>
      )}

      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
        <table className="w-full min-w-[720px] text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              {['Client', 'Secteur', 'Statut', 'Créé le', 'Mis à jour', 'Pilot Banker', 'Prochaine revue', ''].map((c) => (
                <th key={c} className="whitespace-nowrap px-3 py-2 font-semibold uppercase tracking-wider text-slate-500">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {dossiers.map((d) => (
              <tr key={d.id} className="hover:bg-slate-50 transition-colors">
                <td className="whitespace-nowrap px-3 py-2.5 font-medium text-slate-900">{d.client}</td>
                <td className="whitespace-nowrap px-3 py-2.5 text-slate-600">{d.sector}</td>
                <td className="whitespace-nowrap px-3 py-2.5">
                  <Badge variant={STATUS_BADGE[d.status]}>{d.status}</Badge>
                </td>
                <td className="whitespace-nowrap px-3 py-2.5 text-slate-600">{d.createdAt}</td>
                <td className="whitespace-nowrap px-3 py-2.5 text-slate-600">
                  {d.updatedAt.startsWith('il y a') ? (
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                      {d.updatedAt}
                    </span>
                  ) : (
                    d.updatedAt
                  )}
                </td>
                <td className="whitespace-nowrap px-3 py-2.5 text-slate-600">{d.pilotBanker}</td>
                <td className="whitespace-nowrap px-3 py-2.5 text-slate-600">{d.nextReview}</td>
                <td className="whitespace-nowrap px-3 py-2.5 text-right">
                  <button
                    onClick={() => onOpenDetail(d.client)}
                    title="Voir le détail"
                    className="inline-flex items-center justify-center size-7 rounded-md text-slate-400 hover:bg-rad-indigo-50 hover:text-rad-indigo-600 transition-colors"
                  >
                    <ArrowRight className="size-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="flex items-center gap-1.5 text-2xs text-slate-400">
        <AlertTriangle className="size-3 flex-shrink-0" />
        Statuts et échéances calculés automatiquement — la validation finale reste manuelle (Pilot Banker).
      </p>
    </div>
  )
}
