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
  Flag,
  Lightbulb,
  EyeOff,
  Trash2,
  ChevronRight,
  ExternalLink,
  Sparkles,
  type LucideIcon,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
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
interface DigestItemData {
  text: string
  tag: string
  date?: string
  /** Corps détaillé optionnel — affiché directement sous les infos les plus denses, et repris
   *  comme contenu d'article quand on clique dessus depuis "Aller plus loin" d'un autre signal. */
  detail?: string
}

interface DigestSection {
  id: string
  title: string
  icon: React.ReactNode
  items: DigestItemData[]
}

const DIGEST_CLIENTS = ['AeroDynamics Group', 'Nordwind Turbines', 'Ferrovia Lombarda', 'Iberia Chemicals', 'Helvetia Precision']

const DIGEST_SECTIONS: DigestSection[] = [
  {
    id: 'must-read',
    title: 'Articles à lire',
    icon: <Newspaper className="size-3.5" />,
    items: [
      {
        text: 'AeroDynamics Group : la revue stratégique de la division Défense s’accélère, ouverture d’un mandat M&A probable au T4.',
        tag: 'Presse',
        date: 'ce matin',
        detail:
          'Le conseil d’administration a validé une étude de marché sur un carve-out partiel de la division Défense (CA ≈ €1,2 Md, 24 % du groupe). Deux options évoquées : cession minoritaire à un fonds infra, ou adossement industriel à un pure-player défense européen. Un mandat M&A pourrait être lancé dès le T4 2026. Impact potentiel pour BNPP : opportunité de mandat sell-side (déjà identifiée en Pipeline) et nécessité de revoir l’allocation RWA si le périmètre du groupe évolue.',
      },
      {
        text: 'Nordwind Turbines annonce un carnet de commandes offshore en hausse de 18 % sur le semestre.',
        tag: 'Reuters',
        date: 'ce matin',
        detail:
          'La croissance est tirée par deux parcs éoliens offshore en Mer du Nord (appels d’offres remportés en Allemagne et au Danemark). Le management évoque un besoin de financement additionnel de l’ordre de €300-400 M sur 18 mois pour sécuriser la supply chain — cohérent avec la structuration du green bond inaugural déjà en cours avec DCM EMEA (voir Client 360).',
      },
      {
        text: 'Ferrovia Lombarda : dégradation de perspective évoquée par un analyste crédit indépendant.',
        tag: 'Bloomberg',
        date: 'hier',
        detail:
          'L’analyste pointe la hausse des coûts matières (acier, composants signalétiques) qui pèse sur les marges et rapproche le groupe de son covenant de levier (3,75× actuel vs 4,50× max). Ce commentaire de marché confirme en externe ce que le comité de crédit a déjà identifié en interne : le covenant est en breach (4,6×) et une revue est requise avant le prochain tirage.',
      },
      {
        text: 'Iberia Chemicals annonce un plan d’investissement de €120 M dans la chimie verte sur 3 ans.',
        tag: 'Financial Times',
        date: 'hier',
        detail:
          'L’investissement cible la décarbonation de deux sites de production en Espagne (substitution de vapeur fossile, captage CO2 partiel). Le plan sera en partie financé par le Term Loan A dont le mandat de refinancement vient d’être obtenu (closing prévu en novembre) — une structuration en tranche sustainability-linked est à l’étude côté DCM.',
      },
      {
        text: 'Helvetia Precision : rumeur de rapprochement avec un concurrent allemand, non confirmée.',
        tag: 'Presse',
        date: 'il y a 2j',
        detail:
          'La rumeur, non confirmée par les deux parties, évoque un rapprochement avec un équipementier de précision basé en Bavière, de taille comparable. Aucun mandat n’a été identifié à ce stade côté BNPP. À surveiller : un éventuel impact sur la notation (actuellement A− / stable) si l’opération se matérialisait avec un effet de levier dilutif.',
      },
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
      {
        text: 'AeroDynamics Group : call CFO programmé le 15 sept. — cadrage du refinancement 2027.',
        tag: 'C3',
        detail:
          'Ordre du jour proposé par le CFO : (1) calendrier du refinancement RCF €250 M à horizon 2027, (2) sensibilité du groupe à une hausse de 50 bps des taux, (3) point sur l’étude de carve-out de la division Défense. Préparer une note de cadrage covenant avant l’appel — le dernier comité de crédit a classé le dossier "sous surveillance" (levier 3,2× vs max 3,75×).',
      },
      { text: 'Nordwind Turbines : structuration du green bond inaugural en cours avec DCM EMEA.', tag: 'Dealogic' },
      {
        text: 'Ferrovia Lombarda : revue de covenant à préparer avant le comité du 8 oct.',
        tag: 'Atlas',
        detail:
          'Le covenant de levier est en breach (4,6× vs 4,50× max) — cf. alerte "À traiter en priorité" sur la vue Portefeuille. Le comité du 8 octobre devra statuer sur un waiver ou un amendement. Documents à rassembler : derniers covenant compliance certificates, plan d’action remise en conformité transmis par le management, et commentaire de l’analyste crédit Bloomberg paru hier (cf. Articles à lire).',
      },
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

/* ───────────────────────── Aller plus loin ───────────────────────── */
/* "Aller plus loin" propose plusieurs articles EXTERNES suggérés par l'IA sur le même sujet
   (nom, source, explication brève, lien cliquable qui ouvre un nouvel onglet) — rien d'interne
   au digest, uniquement du contexte marché public et vérifiable. */

/* Les items "Secteur 360" ne nomment pas toujours le client directement — on retombe sur un
   mot-clé sectoriel pour quand même proposer une suggestion IA pertinente. */
const SECTOR_KEYWORD_CLIENT: Array<{ keyword: string; client: string }> = [
  { keyword: 'éolien', client: 'Nordwind Turbines' },
  { keyword: 'ferroviaire', client: 'Ferrovia Lombarda' },
  { keyword: 'chimie', client: 'Iberia Chemicals' },
]

function extractMentionedClient(text: string): string | undefined {
  const direct = PORTFOLIO_CLIENTS.find((c) => text.includes(c.name))?.name
  if (direct) return direct
  const lower = text.toLowerCase()
  return SECTOR_KEYWORD_CLIENT.find((k) => lower.includes(k.keyword))?.client
}

interface AiArticleSuggestion {
  title: string
  source: string
  url: string
  blurb: string
}

/** Plusieurs suggestions d'articles externes par client — l'IA propose un éventail de sources
 *  (agences, presse spécialisée, presse locale) plutôt qu'une seule, pour aller plus loin que
 *  les données internes (CRM, dossiers CAP/CBS) avec du contexte marché public et vérifiable. */
const CLIENT_AI_SUGGESTIONS: Record<string, AiArticleSuggestion[]> = {
  'AeroDynamics Group': [
    {
      title: 'European aerospace primes accelerate defence-unit carve-outs amid M&A wave',
      source: 'Reuters',
      url: 'https://www.reuters.com/',
      blurb:
        "L'IA propose cet article car il éclaire la tendance sectorielle derrière la revue stratégique de la division Défense d'AeroDynamics Group — utile pour évaluer la probabilité et la valorisation d'un carve-out.",
    },
    {
      title: 'Aerospace composites suppliers see order backlogs stretch into 2028',
      source: 'Financial Times',
      url: 'https://www.ft.com/',
      blurb:
        "Deuxième angle suggéré par l'IA : la demande structurelle sur les structures composites, cœur de métier d'AeroDynamics Group, reste tendue — pertinent pour la valorisation d'un éventuel carve-out.",
    },
  ],
  'Nordwind Turbines': [
    {
      title: 'Offshore wind developers rush to lock in green financing as rates stabilise',
      source: 'Bloomberg',
      url: 'https://www.bloomberg.com/',
      blurb:
        "Suggéré par l'IA pour le contexte marché du green bond inaugural en cours de structuration avec DCM EMEA — la fenêtre de financement verte reste jugée favorable par les investisseurs institutionnels.",
    },
    {
      title: 'Germany and Denmark fast-track offshore wind permitting to meet 2030 targets',
      source: 'Reuters',
      url: 'https://www.reuters.com/',
      blurb:
        "L'IA relie cet article aux deux appels d'offres remportés en Allemagne et au Danemark — l'accélération réglementaire soutient directement le carnet de commandes annoncé en hausse de 18 %.",
    },
  ],
  'Ferrovia Lombarda': [
    {
      title: 'European rail operators squeezed by rising steel and input costs',
      source: 'Financial Times',
      url: 'https://www.ft.com/',
      blurb:
        "L'IA relie cet article à la dégradation de perspective évoquée par un analyste crédit indépendant — la pression sur les coûts matières est un facteur sectoriel, pas isolé à Ferrovia Lombarda.",
    },
    {
      title: 'Credit rating agencies turn cautious on European rail operators',
      source: 'Bloomberg',
      url: 'https://www.bloomberg.com/',
      blurb:
        "Deuxième suggestion de l'IA, en écho direct au covenant de levier en breach (4,6× vs 4,50×) — la prudence des agences de notation sur le secteur confirme le signal interne.",
    },
  ],
  'Iberia Chemicals': [
    {
      title: 'Specialty chemicals groups ramp up green capex to defend margins',
      source: 'Financial Times',
      url: 'https://www.ft.com/',
      blurb:
        "Contexte sectoriel suggéré par l'IA pour le plan d'investissement de €120 M dans la chimie verte — la décarbonation devient un argument de différenciation face à la pression sur les marges.",
    },
    {
      title: 'EU carbon border tax reshapes investment plans for chemicals makers',
      source: 'Reuters',
      url: 'https://www.reuters.com/',
      blurb:
        "L'IA ajoute cet angle réglementaire : le mécanisme carbone aux frontières de l'UE est un facteur direct derrière l'accélération des investissements verts du secteur.",
    },
  ],
  'Helvetia Precision': [
    {
      title: 'Precision engineering consolidation gathers pace in the DACH region',
      source: 'Handelsblatt',
      url: 'https://www.handelsblatt.com/',
      blurb:
        "L'IA propose cet article en lien avec la rumeur de rapprochement avec un concurrent allemand — la consolidation du secteur en zone DACH est documentée depuis plusieurs mois.",
    },
    {
      title: 'Swiss precision manufacturers brace for currency headwinds',
      source: 'NZZ',
      url: 'https://www.nzz.ch/',
      blurb:
        "Deuxième suggestion de l'IA, orientée risque de change — un facteur pertinent à surveiller si un rapprochement transfrontalier venait à se confirmer.",
    },
  ],
  'Baltic Shipyards': [
    {
      title: 'Marine and defence shipbuilders see order books swell on naval spending',
      source: 'Reuters',
      url: 'https://www.reuters.com/',
      blurb:
        "Suggéré par l'IA pour contextualiser la visite de site prévue — la hausse des budgets de défense navale en Europe soutient le carnet de commandes du secteur.",
    },
    {
      title: 'Baltic Sea nations ramp up maritime security investment',
      source: 'Financial Times',
      url: 'https://www.ft.com/',
      blurb:
        "L'IA ajoute cet angle régional : l'investissement croissant en sécurité maritime en mer Baltique est directement pertinent pour le point sécurité/ESG prévu lors de la visite.",
    },
  ],
}

/* ───────────────────────── Évaluation ligne par ligne ───────────────────────── */
/* Chaque info du digest peut être triée par le lecteur : à traiter, pour info, pas pertinent ici,
   ou carrément à sortir du flux. L'affordance vient de 4 icônes distinctes (jamais de texte seul
   à deviner), toujours visibles (pas cachées au survol) avec tooltip, et d'un retour visuel
   immédiat (couleur de la ligne + étiquette) qui confirme que le clic a bien été pris en compte. */
type ItemRating = 'must-read' | 'good-to-know' | 'not-relevant' | 'deleted'

const RATING_ACTIONS: Array<{
  key: ItemRating
  label: string
  confirmLabel: string
  icon: LucideIcon
  activeClass: string
}> = [
  {
    key: 'must-read',
    label: 'Must read — à traiter en priorité',
    confirmLabel: 'Must read',
    icon: Flag,
    activeClass: 'border-red-200 bg-red-100 text-red-600',
  },
  {
    key: 'good-to-know',
    label: 'Good to know — pour information',
    confirmLabel: 'Good to know',
    icon: Lightbulb,
    activeClass: 'border-sky-200 bg-sky-100 text-sky-600',
  },
  {
    key: 'not-relevant',
    label: "Pas intéressant dans cette section",
    confirmLabel: 'Masqué de cette section',
    icon: EyeOff,
    activeClass: 'border-slate-300 bg-slate-200 text-slate-600',
  },
  {
    key: 'deleted',
    label: "Supprimer — n'a rien à faire là",
    confirmLabel: 'Supprimé',
    icon: Trash2,
    activeClass: 'border-red-200 bg-red-100 text-red-600',
  },
]

/** Carte de suggestion IA — nom de l'article, source, explication brève, lien externe qui
 *  ouvre l'article dans un nouvel onglet (jamais dans l'app, pour ne pas perdre le digest). */
function AiSuggestionCard({ suggestion }: { suggestion: AiArticleSuggestion }) {
  return (
    <div className="rounded-md border border-rad-indigo-200 bg-rad-indigo-50/50 p-2.5">
      <div className="flex items-center gap-1.5 mb-1">
        <Sparkles className="size-3 text-rad-indigo-600 flex-shrink-0" />
        <span className="text-2xs font-semibold text-rad-indigo-700 uppercase tracking-wide">Suggéré par l'IA</span>
      </div>
      <a
        href={suggestion.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-start gap-1.5 text-xs font-medium text-slate-900 hover:text-rad-indigo-700 transition"
      >
        <span className="flex-1 leading-snug underline decoration-slate-300 decoration-1 underline-offset-2 group-hover:decoration-rad-indigo-400">
          {suggestion.title}
        </span>
        <ExternalLink className="size-3 mt-0.5 flex-shrink-0 text-slate-400 group-hover:text-rad-indigo-600" />
      </a>
      <p className="mt-1 text-2xs text-slate-500">
        Source : <span className="font-medium text-slate-600">{suggestion.source}</span>
      </p>
      <p className="mt-1 text-2xs text-slate-600 leading-relaxed">{suggestion.blurb}</p>
    </div>
  )
}

function DigestItemRow({
  item,
  rating,
  onRate,
  expanded,
  onToggleExpand,
}: {
  item: DigestItemData
  rating?: ItemRating
  onRate: (action: ItemRating) => void
  expanded: boolean
  onToggleExpand: () => void
}) {
  const active = RATING_ACTIONS.find((a) => a.key === rating)
  const client = extractMentionedClient(item.text)
  const suggestions = client ? CLIENT_AI_SUGGESTIONS[client] : undefined
  return (
    <div
      className={cn(
        'rounded-lg border p-2.5 transition',
        rating === 'must-read' && 'border-red-200 bg-red-50/60',
        rating === 'good-to-know' && 'border-sky-200 bg-sky-50/50',
        rating === 'not-relevant' && 'border-slate-200 bg-slate-50 opacity-60',
        !rating && 'border-transparent hover:border-slate-100 hover:bg-slate-50/70'
      )}
    >
      <div className="flex items-start gap-2 pl-5">
        <div className="flex-1 min-w-0">
          <span className="text-xs text-slate-600 leading-snug">{item.text}</span>
          {item.detail && <p className="mt-1 text-2xs text-slate-500 leading-relaxed">{item.detail}</p>}
        </div>
        <span className="flex flex-col items-end gap-0.5 flex-shrink-0">
          <span className="text-2xs px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded whitespace-nowrap">
            {item.tag}
          </span>
          {item.date && <span className="text-2xs text-slate-400">{item.date}</span>}
        </span>
      </div>
      <div className="mt-1.5 flex items-center gap-1.5 pl-5">
        {active && (
          <span className={cn('flex items-center gap-1 rounded px-1.5 py-0.5 text-2xs font-medium border', active.activeClass)}>
            <active.icon className="size-3" />
            {active.confirmLabel}
          </span>
        )}
        <button
          onClick={onToggleExpand}
          aria-expanded={expanded}
          className="flex items-center gap-0.5 text-2xs font-medium text-rad-indigo-600 hover:text-rad-indigo-700 transition"
        >
          Aller plus loin
          {expanded ? <ChevronDown className="size-3" /> : <ChevronRight className="size-3" />}
        </button>
        <div className="ml-auto flex items-center gap-0.5">
          {RATING_ACTIONS.map((action) => (
            <Tooltip key={action.key}>
              <TooltipTrigger asChild>
                <button
                  onClick={() => onRate(action.key)}
                  aria-label={action.label}
                  aria-pressed={rating === action.key}
                  className={cn(
                    'flex size-6 items-center justify-center rounded-md border transition',
                    rating === action.key
                      ? action.activeClass
                      : 'border-transparent text-slate-400 hover:border-slate-200 hover:bg-slate-100 hover:text-slate-600'
                  )}
                >
                  <action.icon className="size-3.5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top">{action.label}</TooltipContent>
            </Tooltip>
          ))}
        </div>
      </div>
      {expanded && (
        <div className="mt-2 ml-5 space-y-2">
          <p className="text-2xs font-semibold text-slate-500 uppercase tracking-wide">Suggestions de l'IA</p>
          {suggestions && suggestions.length > 0 ? (
            suggestions.map((s) => <AiSuggestionCard key={s.url + s.title} suggestion={s} />)
          ) : (
            <p className="text-2xs text-slate-400">Pas de suggestion IA disponible pour cet évènement pour l'instant.</p>
          )}
        </div>
      )}
    </div>
  )
}

function DigestView() {
  const [openSection, setOpenSection] = useState<string | null>('must-read')
  const [ratings, setRatings] = useState<Record<string, ItemRating | undefined>>({})
  const [showHidden, setShowHidden] = useState<Record<string, boolean>>({})
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({})
  const today = new Date().toISOString().slice(0, 10)
  const totalItems = DIGEST_SECTIONS.reduce((sum, s) => sum + s.items.length, 0)

  const rate = (id: string, action: ItemRating) => {
    setRatings((prev) => ({ ...prev, [id]: prev[id] === action ? undefined : action }))
  }

  const toggleExpand = (id: string) => {
    setExpandedItems((prev) => ({ ...prev, [id]: !prev[id] }))
  }

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
            const itemsWithIds = section.items.map((item, idx) => ({ item, id: `${section.id}-${idx}` }))
            const hiddenCount = itemsWithIds.filter(({ id }) => ratings[id] === 'deleted').length
            const visibleItems = showHidden[section.id]
              ? itemsWithIds
              : itemsWithIds.filter(({ id }) => ratings[id] !== 'deleted')
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
                    {hiddenCount > 0 && (
                      <button
                        onClick={() => setShowHidden((prev) => ({ ...prev, [section.id]: !prev[section.id] }))}
                        className="pl-5 text-2xs text-slate-400 hover:text-slate-600 underline underline-offset-2"
                      >
                        {showHidden[section.id]
                          ? 'Masquer les éléments supprimés'
                          : `${hiddenCount} élément${hiddenCount > 1 ? 's' : ''} supprimé${hiddenCount > 1 ? 's' : ''} · Afficher`}
                      </button>
                    )}
                    {visibleItems.map(({ item, id }) => (
                      <DigestItemRow
                        key={id}
                        item={item}
                        rating={ratings[id]}
                        onRate={(action) => rate(id, action)}
                        expanded={!!expandedItems[id]}
                        onToggleExpand={() => toggleExpand(id)}
                      />
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
        <TabsList className="w-full gap-1 rounded-lg border-0 bg-slate-100 p-1">
          <TabsTrigger
            value="portfolio"
            className="mb-0 flex flex-1 items-center justify-center rounded-md border-0 px-3 py-2 text-slate-600 data-[state=active]:border-0 data-[state=active]:bg-white data-[state=active]:text-rad-indigo-700 data-[state=active]:shadow-sm"
          >
            Vue portefeuille
          </TabsTrigger>
          <TabsTrigger
            value="digest"
            className="mb-0 flex flex-1 items-center justify-center rounded-md border-0 px-3 py-2 text-slate-600 data-[state=active]:border-0 data-[state=active]:bg-white data-[state=active]:text-rad-indigo-700 data-[state=active]:shadow-sm"
          >
            Vue Digest
          </TabsTrigger>
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
