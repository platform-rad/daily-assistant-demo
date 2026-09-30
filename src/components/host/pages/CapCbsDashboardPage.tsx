import { ArrowRight, AlertTriangle, Clock } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StatStrip } from '../DataTable'

type CapCbsStatus = 'Draft' | 'Pending Review' | 'Validated'

interface CapCbsDossier {
  client: string
  sector: string
  status: CapCbsStatus
  createdAt: string
  updatedAt: string
  pilotBanker: string
  nextReview: string
}

const STATUS_BADGE: Record<CapCbsStatus, 'warning' | 'info' | 'success'> = {
  Draft: 'warning',
  'Pending Review': 'info',
  Validated: 'success',
}

const DOSSIERS: CapCbsDossier[] = [
  {
    client: 'AeroDynamics Group',
    sector: 'Aerospace & Defence',
    status: 'Pending Review',
    createdAt: '12 janv. 2026',
    updatedAt: 'il y a 2h',
    pilotBanker: 'É. Mercier',
    nextReview: 'mars 2027',
  },
  {
    client: 'TechCorp France',
    sector: 'Technology',
    status: 'Validated',
    createdAt: '3 mars 2026',
    updatedAt: '2 sept. 2026',
    pilotBanker: 'É. Mercier',
    nextReview: 'sept. 2027',
  },
  {
    client: 'Manufacturing Ltd',
    sector: 'Manufacturing',
    status: 'Pending Review',
    createdAt: '20 juin 2026',
    updatedAt: 'il y a 6h',
    pilotBanker: 'A. Beaulieu',
    nextReview: 'juin 2027',
  },
  {
    client: 'Financial Services Inc',
    sector: 'Finance',
    status: 'Validated',
    createdAt: '8 févr. 2026',
    updatedAt: '18 août 2026',
    pilotBanker: 'T. Nakamura',
    nextReview: 'févr. 2027',
  },
  {
    client: 'Helvetia Ports SA',
    sector: 'Infrastructure',
    status: 'Draft',
    createdAt: '2 sept. 2026',
    updatedAt: 'il y a 1j',
    pilotBanker: 'É. Mercier',
    nextReview: 'sept. 2027',
  },
]

/** Flux "ce qui a bougé" — dérivé des dossiers récemment mis à jour, plus détaillé qu'un simple point rouge. */
const RECENT_UPDATES = [
  { client: 'AeroDynamics Group', note: "Axe ESG modifié par É. Mercier", time: 'il y a 2h' },
  { client: 'Manufacturing Ltd', note: 'Nouvelle contribution région EMEA — soumis pour revue', time: 'il y a 6h' },
  { client: 'Helvetia Ports SA', note: 'Axe Contexte mis à jour', time: 'il y a 1j' },
]

export function CapCbsDashboardPage({ onOpenDetail }: { onOpenDetail: (client: string) => void }) {
  const draftCount = DOSSIERS.filter((d) => d.status === 'Draft').length
  const pendingCount = DOSSIERS.filter((d) => d.status === 'Pending Review').length
  const validatedCount = DOSSIERS.filter((d) => d.status === 'Validated').length

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
          { label: 'Dossiers actifs', value: String(DOSSIERS.length) },
          { label: 'Brouillons', value: String(draftCount) },
          { label: 'En attente de revue', value: String(pendingCount), hint: 'Nécessite validation humaine' },
          { label: 'Validés', value: String(validatedCount) },
        ]}
      />

      {/* Ce qui a bougé — flux d'activité, pas juste un point rouge */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="size-3.5 text-rad-indigo-600" />
            Ce qui a bougé récemment
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {RECENT_UPDATES.map((u, i) => (
            <button
              key={i}
              onClick={() => onOpenDetail(u.client)}
              className="w-full flex items-center gap-2.5 rounded-lg border border-slate-200 p-2.5 text-left hover:border-rad-indigo-300 hover:bg-rad-indigo-50/40 transition"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-slate-900">{u.client}</p>
                <p className="text-2xs text-slate-500">{u.note}</p>
              </div>
              <span className="text-2xs text-slate-400 flex-shrink-0">{u.time}</span>
            </button>
          ))}
        </CardContent>
      </Card>

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
            {DOSSIERS.map((d) => (
              <tr key={d.client} className="hover:bg-slate-50 transition-colors">
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
