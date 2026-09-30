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
import type { CapCbsDossier } from '@/data/capCbsDossiers'
import type { CrmNote } from '@/data/crmNotes'
import { cn } from '@/lib/utils'
import { DataTable } from '../DataTable'

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
  onEdit,
  onOpenCapCbs,
  onOpenMeena,
  capCbsDossier,
  crmNotes,
  onApproveCrmNote,
}: {
  compact: boolean
  onEdit: () => void
  onOpenCapCbs?: () => void
  onOpenMeena?: () => void
  /** Source unique CAP/CBS + CRM+ — la même que le tableau de bord et le panneau assistant. */
  capCbsDossier?: CapCbsDossier
  crmNotes: CrmNote[]
  onApproveCrmNote: (id: string) => void
}) {
  const [tab, setTab] = useState('overview')

  return (
    <div className="space-y-4">
      {/* En-tête client */}
      <div className="flex flex-wrap items-start gap-4">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white shadow-rad">
          <Building2 className="size-6 text-rad-indigo-600" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-semibold tracking-tight text-slate-900">{CLIENT.name}</h1>
            <Badge variant="secondary">{CLIENT.ticker}</Badge>
            <Badge variant="info">{CLIENT.rating}</Badge>
            <Star className="size-4 fill-amber-400 text-amber-400" />
          </div>
          <p className="mt-1 text-xs text-slate-500">
            {CLIENT.sector} · {CLIENT.country} · ID client {CLIENT.clientId}
          </p>
          {!compact && (
            <p className="mt-0.5 text-xs text-slate-500">
              Couverture : {CLIENT.coverage} · Dernier contact : {CLIENT.lastContact}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm">
            <Download className="size-3.5" /> Exporter
          </Button>
          <Button size="sm" onClick={onEdit}>
            <Pencil className="size-3.5" /> Éditer la fiche
          </Button>
        </div>
      </div>

      {/* Métriques financières */}
      <div
        className={cn(
          'grid gap-3',
          compact ? 'grid-cols-2 xl:grid-cols-3' : 'grid-cols-2 md:grid-cols-3 xl:grid-cols-6'
        )}
      >
        {CLIENT_METRICS.map((m) => (
          <MetricCard key={m.label} metric={m} compact={compact} />
        ))}
      </div>

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
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Prochaines échéances</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2.5">
                  {[
                    ['15 sept. 2026', 'Call CFO — refinancement', 'info'],
                    ['30 sept. 2026', 'Comité de crédit annuel', 'warning'],
                    ['22 avr. 2027', 'Maturité Notes €500 M', 'danger'],
                    ['30 juin 2027', 'Maturité RCF €250 M', 'danger'],
                  ].map(([date, label, tone]) => (
                    <div key={label as string} className="flex items-start gap-2.5">
                      <Badge
                        variant={tone as 'info' | 'warning' | 'danger'}
                        className="mt-0.5 shrink-0"
                      >
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
            <DataTable
              columns={['Référence', 'Produit', 'Montant', 'Part BNPP', 'Maturité', 'Rôle', 'Statut']}
              rows={CLIENT_FACILITIES.map((f) => [
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
            <DataTable
              columns={['Opportunité', 'Produit', 'Revenu estimé', 'Étape', 'Probabilité', 'Responsable']}
              rows={CLIENT_PIPELINE.map((p) => [
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
            <DataTable
              columns={['Nom', 'Fonction', 'Entité', 'Dernier échange']}
              rows={[
                ['Marc Ferrand', 'Group CFO', 'AeroDynamics Group SA', '18 août 2026'],
                ['Sonia Kessler', 'Group Treasurer', 'AeroDynamics Group SA', '12 août 2026'],
                ['Ivan Petrescu', 'Head of M&A', 'AeroDynamics Holding NV', '4 juin 2026'],
                ['Claire Nguyen', 'Directrice des achats groupe', 'AeroDynamics Group SA', '—'],
              ]}
            />
          </TabsContent>

          <TabsContent value="documents">
            <DataTable
              columns={['Document', 'Type', 'Dernière mise à jour', 'Auteur']}
              rows={[
                ['CBS-2026-ADYN-004', 'CBS / CAP', '2 septembre 2026', 'É. Mercier'],
                ['MEMO-2026-ADYN-017', 'Briefing Memo', '2 septembre 2026', 'É. Mercier'],
                ['CR-2026-08-18', 'Compte rendu de visite', '18 août 2026', 'É. Mercier'],
                ['CREDIT-2026-041', 'Dossier de crédit', '30 juin 2026', 'Comité de crédit'],
              ]}
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
