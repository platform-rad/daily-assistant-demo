import { ArrowRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { StatStrip } from '../DataTable'

interface CapCbsDossier {
  client: string
  sector: string
  status: 'Draft' | 'Validated'
  createdAt: string
  updatedAt: string
  pilotBanker: string
  nextReview: string
}

const DOSSIERS: CapCbsDossier[] = [
  {
    client: 'AeroDynamics Group',
    sector: 'Aerospace & Defence',
    status: 'Draft',
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
    status: 'Draft',
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

export function CapCbsDashboardPage({ onOpenDetail }: { onOpenDetail: (client: string) => void }) {
  const draftCount = DOSSIERS.filter((d) => d.status === 'Draft').length
  const validatedCount = DOSSIERS.filter((d) => d.status === 'Validated').length
  const recentlyUpdated = DOSSIERS.filter((d) => d.updatedAt.startsWith('il y a')).length

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
          { label: 'À valider', value: String(draftCount), hint: 'Statut Draft' },
          { label: 'Validés', value: String(validatedCount) },
          { label: 'Mis à jour récemment', value: String(recentlyUpdated), hint: 'Dernières 24h' },
        ]}
      />

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
                  <Badge variant={d.status === 'Validated' ? 'success' : 'warning'}>{d.status}</Badge>
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
    </div>
  )
}
