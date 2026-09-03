import { useState } from 'react'
import { Check, Info, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { CLIENT } from '@/data/client'
import { cn } from '@/lib/utils'

function Field({
  label,
  value,
  hint,
  stale,
  onChange,
}: {
  label: string
  value: string
  hint?: string
  stale?: boolean
  onChange: (v: string) => void
}) {
  return (
    <div>
      <div className="flex items-center gap-1.5">
        <label className="text-2xs font-medium uppercase tracking-wider text-slate-500">
          {label}
        </label>
        {stale && <Badge variant="warning">Obsolète</Badge>}
      </div>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn('mt-1', stale && 'border-amber-300 bg-amber-50/40')}
      />
      {hint && <p className="mt-1 text-2xs text-slate-400">{hint}</p>}
    </div>
  )
}

function TextArea({
  label,
  value,
  stale,
  onChange,
}: {
  label: string
  value: string
  stale?: boolean
  onChange: (v: string) => void
}) {
  return (
    <div>
      <div className="flex items-center gap-1.5">
        <label className="text-2xs font-medium uppercase tracking-wider text-slate-500">
          {label}
        </label>
        {stale && <Badge variant="warning">Obsolète</Badge>}
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        className={cn(
          'mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-xs leading-relaxed text-slate-700 shadow-sm transition-colors focus-visible:border-rad-indigo-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rad-indigo-100',
          stale && 'border-amber-300 bg-amber-50/40'
        )}
      />
    </div>
  )
}

/** Écran atteint depuis le bouton « Éditer la fiche » de la fiche client. */
export function ClientEditPage({ onCancel }: { onCancel: () => void }) {
  const [form, setForm] = useState({
    legalName: CLIENT.legalName,
    sector: CLIENT.sector,
    coverage: CLIENT.coverage,
    rating: CLIENT.rating,
    strategy:
      'Relation centrée sur le financement. Objectif 2026 : maintenir la part de wallet en financement et amorcer une diversification vers les métiers de flux.',
    actionPlan:
      'Visite semestrielle du CFO. Suivi du refinancement obligataire 2027. Qualification d’une opportunité de cash management.',
  })
  const set = (k: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [k]: v }))

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start gap-3">
        <div className="min-w-0 flex-1">
          <h1 className="text-xl font-semibold tracking-tight text-slate-900">
            Éditer la fiche client
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            {CLIENT.name} · ID {CLIENT.clientId} — dernière modification le 26 février 2026
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={onCancel}>
            <X className="size-3.5" /> Annuler
          </Button>
          <Button size="sm" onClick={onCancel}>
            <Check className="size-3.5" /> Enregistrer
          </Button>
        </div>
      </div>

      <div className="flex items-start gap-2.5 rounded-lg border-l-2 border-amber-400 bg-amber-50 p-3">
        <Info className="mt-0.5 size-4 shrink-0 text-amber-600" />
        <div>
          <div className="text-xs font-semibold text-amber-900">
            3 champs désynchronisés du CBS/CAP en cours
          </div>
          <p className="mt-0.5 text-2xs leading-relaxed text-amber-800">
            La stratégie et le plan d’action datent de février 2026. Le Daily Assistant peut les
            pré-remplir depuis le CBS-2026-ADYN-004, révisé le 2 septembre.
          </p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Identification</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Field label="Raison sociale" value={form.legalName} onChange={set('legalName')} />
            <Field label="Secteur" value={form.sector} onChange={set('sector')} />
            <Field
              label="Notation"
              value={form.rating}
              hint="Source : S&P, dernière revue le 12 mai 2026"
              onChange={set('rating')}
            />
            <Field label="Couverture" value={form.coverage} onChange={set('coverage')} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Stratégie et plan d’action</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <TextArea label="Stratégie" value={form.strategy} stale onChange={set('strategy')} />
            <TextArea
              label="Plan d’action"
              value={form.actionPlan}
              stale
              onChange={set('actionPlan')}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
