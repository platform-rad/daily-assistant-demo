import {
  AlertTriangle,
  CalendarClock,
  CheckCircle2,
  Download,
  Lock,
  MapPin,
  ShieldCheck,
  Sparkles,
  User,
} from 'lucide-react'
import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CLIENT } from '@/data/client'
import type { CapCbsDossier, CapCbsStatus } from '@/data/capCbsDossiers'
import { cn } from '@/lib/utils'

const STATUS_BADGE: Record<CapCbsStatus, 'warning' | 'info' | 'success'> = {
  Draft: 'warning',
  'Pending Review': 'info',
  Validated: 'success',
}

const STEPS = [
  'Initialisation',
  'Pré-alimentation',
  'Complétion CBS',
  'Contribution',
  'Revue',
  'Validation',
] as const

/** Les 5 axes du CBS — Client Business Strategy. */
const CBS_AXES = [
  {
    id: 'context',
    label: 'Contexte',
    contributor: 'É. Mercier — Pilot Banker',
    source: 'C3 · Orbit',
    content:
      'AeroDynamics Group est un équipementier aéronautique de rang 1, couvert par BNP Paribas depuis 2011. La montée en cadence des programmes civils et la revue stratégique en cours de la division Défense (~€780 M de CA) redessinent les priorités du groupe sur 2026–2027. Le CBS vise à consolider une vision unique de la relation avant l’ouverture de la fenêtre de conseil M&A.',
  },
  {
    id: 'revenue',
    label: 'Revenus historiques & prévisions',
    contributor: 'Équipe Finance Coverage EMEA',
    source: 'Baccarat',
    content:
      'PNB YTD 2026 à €14,2 M (+11 % vs 2025), tiré par le Financement (RCF, Term Loan A) et le DCM. Trajectoire prévisionnelle 2027 : +8 % porté par le refinancement anticipé de la RCF et un mandat potentiel de conseil M&A sur la cession de la division Défense (jusqu’à €5,1 M de revenu additionnel).',
  },
  {
    id: 'rwa',
    label: 'RWA / Profitabilité',
    contributor: 'Risk & Capital Management',
    source: 'Baccarat · Atlas',
    content:
      'RoRWA en repli à 1,84 % (−12 bps YoY), sous l’effet de la hausse du levier (3,2× au H1 2026). Priorité : optimiser la structure de la RCF refinancée (marge indexée ESG) pour restaurer la rentabilité ajustée du risque sans dégrader le rôle de Coordinateur.',
  },
  {
    id: 'esg',
    label: 'ESG',
    contributor: 'Sustainable Finance Advisory',
    source: 'ESG Hub',
    content:
      'Le client a exprimé des réserves sur la charge de reporting ESG. Proposition : structure Sustainability-Linked avec deux KPI de décarbonation simples, adossés au rapport de durabilité existant du groupe plutôt qu’à un reporting dédié — argument clé pour lever l’objection.',
  },
  {
    id: 'ib-tb-gm',
    label: 'Angle IB/TB/GM — opportunités & connectivité',
    contributor: 'Coverage & Global Markets Corporate Solutions',
    source: 'Dealogic · C3',
    content:
      'Connectivité actuelle concentrée sur le Financement (RCF, TLA, DCM), faible pénétration Transaction Banking et Global Markets. White spot confirmé sur la couverture matières premières (titane, aluminium) — 5 des 6 peers du secteur en sont équipés. Angle IB : mandat sell-side potentiel sur la division Défense.',
  },
] as const

/** Le CAP — Client Action Plan : traduit la stratégie en actions suivies. */
const CAP_ACTIONS = [
  {
    action: 'Refinancement anticipé RCF €250 M (marge indexée ESG)',
    region: 'France — HQ',
    contributor: 'É. Mercier / Loan Syndication EMEA',
    status: 'En cours' as const,
  },
  {
    action: 'Pitch de valorisation — cession division Défense',
    region: 'EMEA — M&A Industrials',
    contributor: 'A. Beaulieu',
    status: 'À faire' as const,
  },
  {
    action: 'Programme de couverture commodities (titane, aluminium)',
    region: 'Global Markets',
    contributor: 'Corporate Solutions',
    status: 'À faire' as const,
  },
  {
    action: 'Structuration Sustainability-Linked (RCF)',
    region: 'France — HQ',
    contributor: 'Sustainable Finance Advisory',
    status: 'Fait' as const,
  },
  {
    action: 'Cadrage calendrier refinancement (call CFO)',
    region: 'France — HQ',
    contributor: 'É. Mercier',
    status: 'Fait' as const,
  },
]

const ACTION_STATUS_BADGE: Record<(typeof CAP_ACTIONS)[number]['status'], 'secondary' | 'warning' | 'success'> = {
  'À faire': 'secondary',
  'En cours': 'warning',
  Fait: 'success',
}

interface CapCbsPageProps {
  dossier: CapCbsDossier
  onSubmitForReview: () => void
  onValidate: () => void
}

export function CapCbsPage({ dossier, onSubmitForReview, onValidate }: CapCbsPageProps) {
  const status = dossier.status
  const [activeStep] = useState(2) // "Complétion CBS" — étape courante mockée
  const [activeAxis, setActiveAxis] = useState<string>(CBS_AXES[0].id)
  const [savedAxis, setSavedAxis] = useState<string | null>(null)

  const isValidated = status === 'Validated'
  const isPending = status === 'Pending Review'

  const handleSaveAxis = (axisId: string) => {
    setSavedAxis(axisId)
    setTimeout(() => setSavedAxis((current) => (current === axisId ? null : current)), 2000)
  }

  const handleExport = () => {
    alert('Export CBS/CAP (PDF) — mock, pas de génération réelle dans ce prototype.')
  }

  return (
    <div className="space-y-4">
      {/* En-tête CBS/CAP */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-semibold tracking-tight text-slate-900">
              CAP / CBS — {CLIENT.name}
            </h1>
            <Badge variant={STATUS_BADGE[status]}>
              {isValidated && <ShieldCheck className="size-3" />}
              {status}
            </Badge>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Cycle 2026–2027 · Client Business Strategy &amp; Client Action Plan
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <User className="size-3.5 text-rad-indigo-600" />
              Pilot Banker : <span className="font-medium text-slate-700">{dossier.pilotBanker}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <CalendarClock className="size-3.5 text-rad-indigo-600" />
              Réunion : <span className="font-medium text-slate-700">30 sept. 2026</span>
            </span>
            <span className="flex items-center gap-1.5">
              <CalendarClock className="size-3.5 text-slate-400" />
              Prochaine revue : <span className="font-medium text-slate-700">{dossier.nextReview}</span>
            </span>
          </div>
          <Button variant="secondary" size="sm" onClick={handleExport}>
            <Download className="size-3.5" /> Exporter
          </Button>
        </div>
      </div>

      {/* Déroulé opérationnel — stepper */}
      <Card>
        <CardContent className="p-3.5">
          <div className="flex flex-wrap items-center gap-1.5">
            {STEPS.map((step, i) => {
              const isDone = i < activeStep
              const isCurrent = i === activeStep
              return (
                <div key={step} className="flex items-center gap-1.5">
                  <div
                    className={cn(
                      'flex items-center gap-1.5 rounded-full px-2.5 py-1 text-2xs font-medium transition-colors',
                      isCurrent
                        ? 'bg-rad-indigo-600 text-white'
                        : isDone
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-slate-100 text-slate-500'
                    )}
                  >
                    {isDone ? <CheckCircle2 className="size-3" /> : <span>{i + 1}</span>}
                    {step}
                  </div>
                  {i < STEPS.length - 1 && <span className="h-px w-3 bg-slate-200" />}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {isPending && (
        <div className="flex items-start gap-2 rounded-lg border border-rad-indigo-200 bg-rad-indigo-50 px-3 py-2.5 text-xs text-rad-indigo-800">
          <ShieldCheck className="mt-0.5 size-3.5 shrink-0" />
          <span>
            Soumis pour validation — en attente de revue par le Pilot Banker avant que le statut ne passe à « Validated ».
          </span>
        </div>
      )}

      {isValidated && (
        <div className="flex items-start gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-xs text-emerald-800">
          <Lock className="mt-0.5 size-3.5 shrink-0" />
          <span>
            Le CBS/CAP est validé : les données auto-alimentées sont figées. Seules les minutes CAP
            restent modifiables jusqu’à la prochaine revue.
          </span>
        </div>
      )}

      {/* CBS — Client Business Strategy */}
      <Card>
        <CardHeader>
          <CardTitle>Client Business Strategy (CBS)</CardTitle>
          <p className="text-2xs text-slate-500">
            Finalité : définir la stratégie commerciale globale du client — vision, ambition,
            trajectoires de revenus et de rentabilité, opportunités prioritaires et intensité
            relationnelle.
          </p>
        </CardHeader>
        <CardContent>
          <Tabs value={activeAxis} onValueChange={setActiveAxis}>
            <TabsList className="flex-wrap gap-4">
              {CBS_AXES.map((axis) => (
                <TabsTrigger key={axis.id} value={axis.id}>
                  {axis.label}
                </TabsTrigger>
              ))}
            </TabsList>

            <div className="pt-4">
              {CBS_AXES.map((axis) => (
                <TabsContent key={axis.id} value={axis.id} className="space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="info">
                        <User className="size-3" />
                        {axis.contributor}
                      </Badge>
                      <span className="text-2xs text-slate-400">Source : {axis.source}</span>
                    </div>
                    {savedAxis === axis.id && (
                      <span className="flex items-center gap-1 text-2xs font-medium text-emerald-600">
                        <CheckCircle2 className="size-3.5" /> Enregistré
                      </span>
                    )}
                  </div>
                  <textarea
                    defaultValue={axis.content}
                    disabled={isValidated}
                    rows={5}
                    className="w-full resize-none rounded-md border border-slate-200 bg-white p-3 text-xs leading-relaxed text-slate-700 focus:border-rad-indigo-300 focus:outline-none focus:ring-1 focus:ring-rad-indigo-500 disabled:bg-slate-50 disabled:text-slate-500"
                  />
                  <div className="flex justify-end">
                    <Button
                      size="sm"
                      variant="secondary"
                      disabled={isValidated}
                      onClick={() => handleSaveAxis(axis.id)}
                    >
                      Sauvegarder l’axe avant de changer de section
                    </Button>
                  </div>
                </TabsContent>
              ))}
            </div>
          </Tabs>
        </CardContent>
      </Card>

      {/* CAP — Client Action Plan */}
      <Card>
        <CardHeader>
          <CardTitle>Client Action Plan (CAP)</CardTitle>
          <p className="text-2xs text-slate-500">
            Finalité : traduire la stratégie en actions, contributions et suivis — sections
            détaillées du plan d’action, contributions pays/région et revue.
          </p>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-2xs uppercase tracking-wider text-slate-400">
                  <th className="px-4 py-2 font-medium">Action</th>
                  <th className="px-4 py-2 font-medium">Pays / Région</th>
                  <th className="px-4 py-2 font-medium">Contributeur</th>
                  <th className="px-4 py-2 font-medium">Statut</th>
                </tr>
              </thead>
              <tbody>
                {CAP_ACTIONS.map((item) => (
                  <tr key={item.action} className="border-b border-slate-100 last:border-0">
                    <td className="px-4 py-2.5 text-slate-800">{item.action}</td>
                    <td className="px-4 py-2.5 text-slate-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="size-3 text-slate-400" />
                        {item.region}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-slate-500">{item.contributor}</td>
                    <td className="px-4 py-2.5">
                      <Badge variant={ACTION_STATUS_BADGE[item.status]}>{item.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Validation */}
      <Card>
        <CardHeader>
          <CardTitle>Revue &amp; Validation</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center justify-between gap-3">
          <p className="max-w-xl text-2xs text-slate-500">
            {status === 'Draft' &&
              'Une fois les 5 axes complétés, soumettez le CBS/CAP pour revue. Le Pilot Banker devra ensuite valider avant que le statut ne passe à « Validated ».'}
            {status === 'Pending Review' &&
              'Le Pilot Banker revoit la cohérence de la stratégie, des hypothèses et des priorités, vérifie la date de réunion et la prochaine date de revue, puis valide le CBS/CAP.'}
            {status === 'Validated' && (
              <>Le CBS/CAP est validé depuis le <span className="font-medium text-slate-700">30 sept. 2026</span>.</>
            )}
          </p>
          {status === 'Draft' && (
            <Button onClick={onSubmitForReview}>
              <ShieldCheck className="size-4" />
              Soumettre pour validation
            </Button>
          )}
          {status === 'Pending Review' && (
            <Button onClick={onValidate}>
              <Sparkles className="size-4" />
              Valider le CBS/CAP
            </Button>
          )}
          {status === 'Validated' && (
            <Button variant="secondary" disabled>
              <ShieldCheck className="size-4 text-emerald-600" />
              CBS/CAP validé
            </Button>
          )}
        </CardContent>
      </Card>

      <p className="flex items-center gap-1.5 text-2xs text-slate-400">
        <AlertTriangle className="size-3 flex-shrink-0" />
        Contenu rédigé avec l'aide de l'IA à partir des sources indiquées par axe — revue humaine requise avant validation.
      </p>
    </div>
  )
}
