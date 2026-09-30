import { useState } from 'react'
import {
  ArrowDownRight,
  ArrowUpRight,
  Minus,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Newspaper,
  Building2,
  Users,
  Swords,
  ShieldAlert,
  ClipboardList,
  CalendarClock,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DataTable, StatStrip } from '../DataTable'
import { PORTFOLIO_CLIENTS, PORTFOLIO_SUMMARY } from '@/data/portfolio'
import { cn } from '@/lib/utils'

const TREND = { up: ArrowUpRight, down: ArrowDownRight, flat: Minus }

/* ───────────────────────── À traiter en priorité ───────────────────────── */
const NEEDS_ATTENTION = [
  {
    icon: <ShieldAlert className="size-3.5" />,
    tone: 'danger' as const,
    text: 'Ferrovia Lombarda — covenant de levier en breach (4,6× vs 4,50×). Revue de comité requise.',
  },
  {
    icon: <ClipboardList className="size-3.5" />,
    tone: 'warning' as const,
    text: '2 dossiers CAP/CBS en attente de validation depuis plus de 48h (AeroDynamics Group, Manufacturing Ltd).',
  },
  {
    icon: <AlertTriangle className="size-3.5" />,
    tone: 'warning' as const,
    text: 'Baltic Shipyards — exposition en baisse mais 2 signaux faibles détectés cette semaine.',
  },
]

function NeedsAttentionBanner() {
  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50/60 p-3.5">
      <div className="flex items-center gap-2 mb-2">
        <AlertTriangle className="size-4 text-amber-600" />
        <h2 className="text-sm font-semibold text-amber-900">À traiter en priorité</h2>
      </div>
      <div className="space-y-1.5">
        {NEEDS_ATTENTION.map((item, i) => (
          <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
            <span className={cn('mt-0.5 shrink-0', item.tone === 'danger' ? 'text-red-600' : 'text-amber-600')}>
              {item.icon}
            </span>
            <span>{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function PortfolioView({ onOpenClient }: { onOpenClient: (clientName: string) => void }) {
  return (
    <div className="space-y-4">
      <NeedsAttentionBanner />

      <DataTable
        columns={['Groupe', 'Secteur', 'Notation', 'Exposition', 'PNB YTD', 'Signaux', 'Prochaine échéance']}
        highlightRow={0}
        onRowClick={(i) => onOpenClient(PORTFOLIO_CLIENTS[i].name)}
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
        Cliquez sur un groupe pour ouvrir sa fiche client.
      </p>
    </div>
  )
}

/* ───────────────────────── Digest quotidien (étoffé) ───────────────────────── */
interface DigestSection {
  id: string
  title: string
  icon: React.ReactNode
  items: { text: string; tag: string; date?: string }[]
}

const DIGEST_CLIENTS = ['AeroDynamics Group', 'Nordwind Turbines', 'Ferrovia Lombarda', 'Iberia Chemicals', 'Helvetia Precision']

const DIGEST_SECTIONS: DigestSection[] = [
  {
    id: 'must-read',
    title: 'Articles à lire',
    icon: <Newspaper className="size-3.5" />,
    items: [
      { text: 'AeroDynamics Group : la revue stratégique de la division Défense s’accélère, ouverture d’un mandat M&A probable au T4.', tag: 'Presse', date: 'ce matin' },
      { text: 'Nordwind Turbines annonce un carnet de commandes offshore en hausse de 18 % sur le semestre.', tag: 'Reuters', date: 'ce matin' },
      { text: 'Ferrovia Lombarda : dégradation de perspective évoquée par un analyste crédit indépendant.', tag: 'Bloomberg', date: 'hier' },
      { text: 'Iberia Chemicals annonce un plan d’investissement de €120 M dans la chimie verte sur 3 ans.', tag: 'Financial Times', date: 'hier' },
      { text: 'Helvetia Precision : rumeur de rapprochement avec un concurrent allemand, non confirmée.', tag: 'Presse', date: 'il y a 2j' },
    ],
  },
  {
    id: 'sector-360',
    title: 'Secteur 360 — Industrials & Infrastructure EMEA',
    icon: <Building2 className="size-3.5" />,
    items: [
      { text: 'Consolidation continue dans l’éolien offshore : plusieurs acteurs cherchent du financement de croissance.', tag: 'Sector Watch' },
      { text: 'Le secteur ferroviaire européen fait face à une pression accrue sur les covenants suite à la hausse des coûts matières.', tag: 'Sector Watch' },
      { text: 'La chimie de spécialité bénéficie d’un regain d’intérêt investisseur sur les segments décarbonation.', tag: 'Sector Watch' },
    ],
  },
  {
    id: 'client-360',
    title: 'Client 360',
    icon: <Users className="size-3.5" />,
    items: [
      { text: 'AeroDynamics Group : call CFO programmé le 15 sept. — cadrage du refinancement 2027.', tag: 'C3' },
      { text: 'Nordwind Turbines : structuration du green bond inaugural en cours avec DCM EMEA.', tag: 'Dealogic' },
      { text: 'Ferrovia Lombarda : revue de covenant à préparer avant le comité du 8 oct.', tag: 'Atlas' },
      { text: 'Iberia Chemicals : mandat de refinancement Term Loan A obtenu, closing prévu en nov.', tag: 'C3' },
      { text: 'Baltic Shipyards : visite de site prévue le 12 oct., préparer le point sécurité/ESG.', tag: 'Orbit' },
    ],
  },
  {
    id: 'deadlines',
    title: 'Prochaines échéances',
    icon: <CalendarClock className="size-3.5" />,
    items: PORTFOLIO_CLIENTS.map((c) => ({ text: `${c.name} — ${c.next}`, tag: c.sector })),
  },
  {
    id: 'competitive-intel',
    title: 'Veille concurrentielle',
    icon: <Swords className="size-3.5" />,
    items: [
      { text: 'Un concurrent direct a remporté le mandat green bond sur un émetteur comparable à Nordwind Turbines.', tag: 'Presse' },
      { text: 'Repositionnement tarifaire observé chez deux banques concurrentes sur le Transaction Banking Industrials.', tag: 'Presse' },
      { text: 'Une banque concurrente renforce son équipe M&A Industrials en France — 3 recrutements seniors.', tag: 'Presse' },
    ],
  },
]

function DigestView() {
  const [openSection, setOpenSection] = useState<string | null>('must-read')
  const today = new Date().toISOString().slice(0, 10)
  const totalItems = DIGEST_SECTIONS.reduce((sum, s) => sum + s.items.length, 0)

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-slate-200 bg-white overflow-hidden">
        <div className="px-4 py-3.5 border-b border-slate-100 bg-gradient-to-r from-rad-indigo-50/60 to-transparent">
          <p className="text-sm font-semibold text-slate-900">📬 Good morning Élodie — voici votre digest du {today}</p>
          <p className="text-xs text-slate-600 mt-1">
            {totalItems} signaux cette semaine pour {DIGEST_CLIENTS.join(', ')} et le reste du portefeuille Industrials EMEA.
            Environ 3 min de lecture.
          </p>
        </div>
        <div>
          {DIGEST_SECTIONS.map((section) => {
            const isOpen = openSection === section.id
            return (
              <div key={section.id} className="border-b border-slate-100 last:border-b-0">
                <button
                  onClick={() => setOpenSection(isOpen ? null : section.id)}
                  className="w-full px-4 py-2.5 flex items-center gap-2 hover:bg-slate-50 transition text-left"
                >
                  <span className="text-rad-indigo-600 flex-shrink-0">{section.icon}</span>
                  <span className="text-xs font-semibold text-slate-800 flex-1 truncate">{section.title}</span>
                  <span className="text-2xs text-slate-400 flex-shrink-0">{section.items.length}</span>
                  {isOpen ? (
                    <ChevronUp className="size-3.5 text-slate-400 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="size-3.5 text-slate-400 flex-shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-4 pb-3 space-y-2">
                    {section.items.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2 pl-5">
                        <span className="text-xs text-slate-600 leading-snug flex-1">{item.text}</span>
                        <span className="flex flex-col items-end gap-0.5 flex-shrink-0">
                          <span className="text-2xs px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded whitespace-nowrap">
                            {item.tag}
                          </span>
                          {item.date && <span className="text-2xs text-slate-400">{item.date}</span>}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
        <p className="flex items-center gap-1.5 px-4 py-2 border-t border-slate-100 text-2xs text-slate-400">
          <AlertTriangle className="size-3 flex-shrink-0" />
          Synthèse générée par l'IA à partir de C3, Dealogic, Atlas et la presse — à vérifier avant diffusion.
        </p>
      </div>
    </div>
  )
}

export function PortfolioPage({ onOpenClient }: { onOpenClient: (clientName: string) => void }) {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-slate-900">Mon portefeuille</h1>
        <p className="mt-1 text-xs text-slate-500">
          Industrials EMEA — 24 groupes couverts · Élodie Mercier, Senior Banker
        </p>
      </div>

      <StatStrip stats={PORTFOLIO_SUMMARY} />

      <Tabs defaultValue="portfolio">
        <TabsList>
          <TabsTrigger value="portfolio">Vue portefeuille</TabsTrigger>
          <TabsTrigger value="digest">Vue Digest</TabsTrigger>
        </TabsList>
        <div className="pt-4">
          <TabsContent value="portfolio">
            <PortfolioView onOpenClient={onOpenClient} />
          </TabsContent>
          <TabsContent value="digest">
            <DigestView />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
