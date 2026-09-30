import { useState } from 'react'
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Building2,
  CheckCircle2,
  ClipboardList,
  Download,
  Mic,
  Minus,
  Pencil,
  Star,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CLIENT, CLIENT_FACILITIES, CLIENT_METRICS, CLIENT_PIPELINE } from '@/data/client'
import { PORTFOLIO_CLIENTS } from '@/data/portfolio'
import type { CapCbsDossier } from '@/data/capCbsDossiers'
import type { CrmNote } from '@/data/crmNotes'
import { cn } from '@/lib/utils'
import { DataTable } from '../DataTable'

/* AeroDynamics Group est le seul client entièrement modélisé dans ce prototype (métriques,
   engagements, pipeline, contacts, documents). Pour tout autre client (ouvert depuis le
   portefeuille, un dossier CAP/CBS ou une note CRM+), on affiche honnêtement ce qui est réel —
   son nom, son secteur/sa notation si connus du portefeuille, et ses actions IA (CAP/CBS, CRM+,
   déjà multi-client) — plutôt que de retomber silencieusement sur les données d'AeroDynamics. */
const AERO_CONTACTS = [
  { name: 'Marc Ferrand', role: 'Group CFO', entity: 'AeroDynamics Group SA', lastContact: '18 août 2026' },
  { name: 'Sonia Kessler', role: 'Group Treasurer', entity: 'AeroDynamics Group SA', lastContact: '12 août 2026' },
  { name: 'Ivan Petrescu', role: 'Head of M&A', entity: 'AeroDynamics Holding NV', lastContact: '4 juin 2026' },
  { name: 'Claire Nguyen', role: 'Directrice des achats groupe', entity: 'AeroDynamics Group SA', lastContact: '—' },
]

const AERO_DOCUMENTS = [
  { name: 'CBS-2026-ADYN-004', type: 'CBS / CAP', updatedAt: '2 septembre 2026', author: 'É. Mercier' },
  { name: 'MEMO-2026-ADYN-017', type: 'Briefing Memo', updatedAt: '2 septembre 2026', author: 'É. Mercier' },
  { name: 'CR-2026-08-18', type: 'Compte rendu de visite', updatedAt: '18 août 2026', author: 'É. Mercier' },
  { name: 'CREDIT-2026-041', type: 'Dossier de crédit', updatedAt: '30 juin 2026', author: 'Comité de crédit' },
]

const AERO_EVENTS: Array<[string, string, 'info' | 'warning' | 'danger']> = [
  ['15 sept. 2026', 'Call CFO — refinancement', 'info'],
  ['30 sept. 2026', 'Comité de crédit annuel', 'warning'],
  ['22 avr. 2027', 'Maturité Notes €500 M', 'danger'],
  ['30 juin 2027', 'Maturité RCF €250 M', 'danger'],
]

const TREND_ICON = { up: ArrowUpRight, down: ArrowDownRight, flat: Minus }

function MetricCard({
  metric,
  compact,
}: {
  metric: (typeof CLIENT_METRICS)[number]
  compact: boolean
}) {
  const Icon = TREND_ICON[metric.trend ?? 'flat']
  const tone =
    metric.trend === 'up'
      ? 'text-emerald-600'
      : metric.trend === 'down'
        ? 'text-red-600'
        : 'text-slate-400'
  return (
    <Card className="transition-shadow hover:shadow-rad-md">
      <CardContent className="p-3.5">
        <div className="truncate text-2xs font-medium uppercase tracking-wider text-slate-500">
          {metric.label}
        </div>
        <div className="mt-1.5 flex items-baseline gap-2">
          <span className="text-lg font-semibold tabular-nums tracking-tight text-slate-900">
            {metric.value}
          </span>
          {metric.delta && (
            <span className={cn('flex items-center gap-0.5 text-2xs font-medium', tone)}>
              <Icon className="size-3" />
              {metric.delta}
            </span>
          )}
        </div>
        {!compact && <div className="mt-1 truncate text-2xs text-slate-400">{metric.hint}</div>}
      </CardContent>
    </Card>
  )
}

export function ClientOverviewPage({
  compact,
  clientName,
  onEdit,
  onOpenCapCbs,
  onOpenMeena,
  capCbsDossier,
  crmNotes,
  onApproveCrmNote,
}: {
  compact: boolean
  /** Quel client afficher — seul AeroDynamics Group a une fiche entièrement modélisée. */
  clientName: string
  onEdit: () => void
  onOpenCapCbs?: () => void
  onOpenMeena?: () => void
  /** Source unique CAP/CBS + CRM+ — la même que le tableau de bord et le panneau assistant. */
  capCbsDossier?: CapCbsDossier
  crmNotes: CrmNote[]
  onApproveCrmNote: (id: string) => void
}) {
  const [tab, setTab] = useState('overview')

  const isKnownClient = clientName === CLIENT.name
  const portfolioMatch = PORTFOLIO_CLIENTS.find((c) => c.name === clientName)

  // Données réelles pour AeroDynamics Group ; repli honnête sinon — on ne réutilise jamais les
  // données d'un autre client, on affiche seulement ce qu'on sait vraiment (nom, secteur/notation
  // du portefeuille si disponibles) et on le dit clairement pour le reste.
  const display = isKnownClient
    ? CLIENT
    : {
        name: clientName,
        legalName: clientName,
        ticker: undefined as string | undefined,
        sector: portfolioMatch?.sector ?? '—',
        country: '—',
        clientId: '—',
        segment: 'Corporate Coverage — EMEA',
        rating: portfolioMatch?.rating,
        ratingAgency: '—',
        coverage: 'Non assigné',
        parentGroup: '—',
        employees: '—',
        lastContact: '—',
      }
  const metrics = isKnownClient ? CLIENT_METRICS : []
  const facilities = isKnownClient ? CLIENT_FACILITIES : []
  const pipeline = isKnownClient ? CLIENT_PIPELINE : []
  const contacts = isKnownClient ? AERO_CONTACTS : []
  const documents = isKnownClient ? AERO_DOCUMENTS : []
  const events = isKnownClient ? AERO_EVENTS : []

  return (
    <div className="space-y-4">
      {/* En-tête client */}
      <div className="flex flex-wrap items-start gap-4">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white shadow-rad">
          <Building2 className="size-6 text-rad-indigo-600" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-semibold tracking-tight text-slate-900">{display.name}</h1>
            {display.ticker && <Badge variant="secondary">{display.ticker}</Badge>}
            {display.rating && <Badge variant="info">{display.rating}</Badge>}
            {isKnownClient && <Star className="size-4 fill-amber-400 text-amber-400" />}
          </div>
          {isKnownClient ? (
            <>
              <p className="mt-1 text-xs text-slate-500">
                {display.sector} · {display.country} · ID client {display.clientId}
              </p>
              {!compact && (
                <p className="mt-0.5 text-xs text-slate-500">
                  Couverture : {display.coverage} · Dernier contact : {display.lastContact}
                </p>
              )}
            </>
          ) : (
            <p className="mt-1 text-xs text-slate-500">
              {display.sector !== '—' ? `${display.sector} · ` : ''}Fiche détaillée non modélisée dans ce
              prototype — seules les actions IA ci-dessous (CAP/CBS, CRM+) sont réelles pour ce client.
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm">
            <Download className="size-3.5" /> Exporter
          </Button>
          <Button size="sm" onClick={onEdit} disabled={!isKnownClient} title={isKnownClient ? undefined : 'Édition non disponible — client non modélisé dans ce prototype'}>
            <Pencil className="size-3.5" /> Éditer la fiche
          </Button>
        </div>
      </div>

      {/* Métriques financières */}
      {metrics.length > 0 ? (
        <div
          className={cn(
            'grid gap-3',
            compact ? 'grid-cols-2 xl:grid-cols-3' : 'grid-cols-2 md:grid-cols-3 xl:grid-cols-6'
          )}
        >
          {metrics.map((m) => (
            <MetricCard key={m.label} metric={m} compact={compact} />
          ))}
        </div>
      ) : (
        <p className="text-2xs text-slate-400">Aucune métrique financière modélisée pour ce client dans le prototype.</p>
      )}

      {/* Onglets */}
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="overflow-x-auto">
          <TabsTrigger value="overview">Vue d’ensemble</TabsTrigger>
          <TabsTrigger value="actions-ia">Actions IA</TabsTrigger>
          <TabsTrigger value="facilities">Engagements</TabsTrigger>
          <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
          <TabsTrigger value="contacts">Contacts</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        <div className="py-4">
          <TabsContent value="overview">
            <div className={cn('grid gap-4', compact ? 'grid-cols-1' : 'lg:grid-cols-3')}>
              <Card className={cn(!compact && 'lg:col-span-2')}>
                <CardHeader>
                  <CardTitle>Description de la relation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-xs leading-relaxed text-slate-600">
                  {isKnownClient ? (
                    <>
                      <p>
                        {CLIENT.legalName} est un équipementier aéronautique de rang 1 spécialisé dans
                        les structures composites et les systèmes d’actionnement. Le groupe emploie{' '}
                        {CLIENT.employees} personnes réparties sur 22 sites industriels et réalise 63 %
                        de son chiffre d’affaires dans l’aviation commerciale, 24 % dans la défense et
                        13 % dans les services de maintenance.
                      </p>
                      <p>
                        La relation bancaire est couverte depuis 2011. BNP Paribas intervient
                        principalement en financement (RCF, Term Loan A, DCM) et, plus marginalement,
                        sur les métiers de flux et de marchés.
                      </p>
                      <dl className="grid grid-cols-2 gap-x-4 gap-y-2 border-t border-slate-100 pt-3">
                        {[
                          ['Maison mère', CLIENT.parentGroup],
                          ['Segment', CLIENT.segment],
                          ['Notation', `${CLIENT.rating} — ${CLIENT.ratingAgency}`],
                          ['Effectif', CLIENT.employees],
                        ].map(([k, v]) => (
                          <div key={k}>
                            <dt className="text-2xs uppercase tracking-wider text-slate-400">{k}</dt>
                            <dd className="mt-0.5 text-xs text-slate-700">{v}</dd>
                          </div>
                        ))}
                      </dl>
                    </>
                  ) : (
                    <p className="text-slate-400">
                      Ce client n'a pas encore de fiche détaillée dans ce prototype (chiffres clés,
                      engagements, pipeline, contacts, documents). Seules les actions IA — CAP/CBS et
                      CRM+ — sont réelles et consultables dans l'onglet ci-contre.
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Prochaines échéances</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2.5">
                  {events.length === 0 && (
                    <p className="text-2xs text-slate-400">Aucune échéance modélisée pour ce client.</p>
                  )}
                  {events.map(([date, label, tone]) => (
                    <div key={label} className="flex items-start gap-2.5">
                      <Badge variant={tone} className="mt-0.5 shrink-0">
                        {date}
                      </Badge>
                      <span className="text-xs text-slate-600">{label}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="actions-ia">
            <div className={cn('grid gap-4', compact ? 'grid-cols-1' : 'lg:grid-cols-2')}>
              {/* Historique CBS/CAP */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>CBS / CAP</CardTitle>
                    <Button variant="ghost" size="icon-sm" onClick={onOpenCapCbs} title="Ouvrir le CBS/CAP">
                      <ArrowRight className="size-3.5" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  {capCbsDossier ? (
                    <button
                      onClick={onOpenCapCbs}
                      className="w-full flex items-center gap-2.5 rounded-lg border border-slate-200 p-2.5 text-left hover:border-rad-indigo-300 hover:bg-rad-indigo-50/40 transition"
                    >
                      <div className="flex size-7 items-center justify-center rounded-md bg-rad-indigo-50 text-rad-indigo-600 shrink-0">
                        <ClipboardList className="size-3.5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium text-slate-900">Cycle 2026–2027</p>
                        <p className="text-2xs text-slate-500">
                          Mis à jour {capCbsDossier.updatedAt} · {capCbsDossier.pilotBanker}
                        </p>
                      </div>
                      <Badge variant={capCbsDossier.status === 'Validated' ? 'success' : capCbsDossier.status === 'Pending Review' ? 'info' : 'warning'}>
                        {capCbsDossier.status}
                      </Badge>
                    </button>
                  ) : (
                    <p className="text-2xs text-slate-400">Aucun cycle CBS/CAP en cours.</p>
                  )}
                </CardContent>
              </Card>

              {/* Historique des réunions — CRM+ Agent / Meena */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Réunions &amp; notes — CRM+ Agent</CardTitle>
                    <Button variant="ghost" size="icon-sm" onClick={onOpenMeena} title="Ouvrir Meena">
                      <ArrowRight className="size-3.5" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  {crmNotes.length === 0 && (
                    <p className="text-2xs text-slate-400">Aucune note pour ce client.</p>
                  )}
                  {crmNotes.map((note) => (
                    <div
                      key={note.id}
                      className="w-full flex items-center gap-2.5 rounded-lg border border-slate-200 p-2.5 hover:border-amber-300 hover:bg-amber-50/40 transition"
                    >
                      <button onClick={onOpenMeena} className="flex items-center gap-2.5 min-w-0 flex-1 text-left">
                        <div className="flex size-7 items-center justify-center rounded-md bg-amber-50 text-amber-600 shrink-0">
                          <Mic className="size-3.5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-medium text-slate-900 truncate">{note.subject}</p>
                          <p className="text-2xs text-slate-500">{note.updatedAt}</p>
                        </div>
                      </button>
                      {note.status === 'Synced' && (
                        <Badge variant="success">
                          <CheckCircle2 className="size-3" /> Synced
                        </Badge>
                      )}
                      {note.status === 'Draft' && <Badge variant="secondary">Draft</Badge>}
                      {note.status === 'Pending Review' && (
                        <Button size="xs" onClick={() => onApproveCrmNote(note.id)}>
                          <CheckCircle2 className="size-3" /> Approve &amp; Sync
                        </Button>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="facilities">
            {facilities.length === 0 && (
              <p className="mb-2 text-2xs text-slate-400">Aucun engagement modélisé pour ce client dans le prototype.</p>
            )}
            <DataTable
              columns={['Référence', 'Produit', 'Montant', 'Part BNPP', 'Maturité', 'Rôle', 'Statut']}
              rows={facilities.map((f) => [
                f.id,
                f.product,
                f.amount,
                f.share,
                f.maturity,
                f.role,
                <Badge key={f.id} variant={f.status.includes('non tiré') ? 'secondary' : 'success'}>
                  {f.status}
                </Badge>,
              ])}
            />
          </TabsContent>

          <TabsContent value="pipeline">
            {pipeline.length === 0 && (
              <p className="mb-2 text-2xs text-slate-400">Aucune opportunité modélisée pour ce client dans le prototype.</p>
            )}
            <DataTable
              columns={['Opportunité', 'Produit', 'Revenu estimé', 'Étape', 'Probabilité', 'Responsable']}
              rows={pipeline.map((p) => [
                p.name,
                p.product,
                p.revenue,
                <Badge key={p.name} variant="outline">
                  {p.stage}
                </Badge>,
                p.probability,
                p.owner,
              ])}
            />
          </TabsContent>

          <TabsContent value="contacts">
            {contacts.length === 0 && (
              <p className="mb-2 text-2xs text-slate-400">Aucun contact modélisé pour ce client dans le prototype.</p>
            )}
            <DataTable
              columns={['Nom', 'Fonction', 'Entité', 'Dernier échange']}
              rows={contacts.map((c) => [c.name, c.role, c.entity, c.lastContact])}
            />
          </TabsContent>

          <TabsContent value="documents">
            {documents.length === 0 && (
              <p className="mb-2 text-2xs text-slate-400">Aucun document modélisé pour ce client dans le prototype.</p>
            )}
            <DataTable
              columns={['Document', 'Type', 'Dernière mise à jour', 'Auteur']}
              rows={documents.map((d) => [d.name, d.type, d.updatedAt, d.author])}
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
