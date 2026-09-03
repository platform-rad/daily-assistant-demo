import { useEffect, useRef, useState } from 'react'
import { CornerDownLeft, Loader2, Quote, Sparkles, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { QUICK_REWRITES } from '@/data/rewrites'
import { POPOVER_ATTR, type DocSelection } from '@/hooks/useDocSelection'

const WIDTH = 300
const MARGIN = 8

interface Props {
  selection: DocSelection
  busy: boolean
  /** Limites dans lesquelles la bulle doit rester (le panneau de l'assistant). */
  bounds: DOMRect
  onSubmit: (instruction: string) => void
  onLock: () => void
  onClose: () => void
}

/**
 * Bulle ancrée sous le passage sélectionné : elle rappelle l'extrait, propose
 * quatre retouches courantes et laisse écrire une consigne libre.
 */
export function SelectionPopover({
  selection,
  busy,
  bounds,
  onSubmit,
  onLock,
  onClose,
}: Props) {
  const [draft, setDraft] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  // La consigne repart de zéro dès que l'utilisateur change de passage.
  useEffect(() => {
    setDraft('')
  }, [selection.text])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  const submit = (instruction: string) => {
    if (!instruction.trim() || busy) return
    onSubmit(instruction.trim())
  }

  // Positionnement sous la sélection, borné au panneau de l'assistant.
  const left = Math.min(
    Math.max(selection.rect.left, bounds.left + MARGIN),
    bounds.right - WIDTH - MARGIN
  )
  const spaceBelow = bounds.bottom - selection.rect.bottom
  const placeAbove = spaceBelow < 210
  const top = placeAbove ? undefined : selection.rect.bottom + 6
  const bottom = placeAbove ? window.innerHeight - selection.rect.top + 6 : undefined

  const excerpt =
    selection.text.length > 110 ? `${selection.text.slice(0, 110).trimEnd()}…` : selection.text

  return (
    <div
      // Marqueur lu par useDocSelection pour reconnaître les clics internes,
      // qui gèlent la sélection au lieu de la perdre.
      {...{ [POPOVER_ATTR]: '' }}
      onPointerDown={onLock}
      style={{ position: 'fixed', left, top, bottom, width: WIDTH, zIndex: 60 }}
      className="animate-fade-in-up rounded-lg border border-rad-indigo-200 bg-white p-2.5 shadow-rad-lg"
    >
      <div className="flex items-center gap-1.5">
        <Sparkles className="size-3 shrink-0 text-rad-indigo-600" />
        <span className="text-2xs font-semibold uppercase tracking-wider text-rad-indigo-700">
          Retoucher ce passage
        </span>
        {selection.targets.length > 1 && (
          <Badge variant="info">{selection.targets.length} blocs</Badge>
        )}
        <button
          onClick={onClose}
          className="ml-auto rounded p-0.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
        >
          <X className="size-3" />
        </button>
      </div>

      <div className="mt-1.5 flex gap-1.5 rounded-md border-l-2 border-rad-indigo-300 bg-rad-indigo-50/60 py-1 pl-2 pr-1.5">
        <Quote className="mt-0.5 size-2.5 shrink-0 text-rad-indigo-400" />
        <p className="text-2xs italic leading-relaxed text-slate-600">{excerpt}</p>
      </div>

      <div className="mt-2 flex flex-wrap gap-1">
        {QUICK_REWRITES.map((q) => (
          <button
            key={q.id}
            disabled={busy}
            onClick={() => submit(q.instruction)}
            className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-2xs text-slate-600 transition-colors hover:border-rad-indigo-300 hover:bg-rad-indigo-50 hover:text-rad-indigo-700 disabled:opacity-50"
          >
            {q.label}
          </button>
        ))}
      </div>

      <div className="mt-2 flex gap-1.5">
        <Input
          ref={inputRef}
          value={draft}
          disabled={busy}
          // Surtout pas d'autoFocus : prendre le focus viderait la sélection
          // du document au moment même où l'utilisateur vient de la faire.
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submit(draft)}
          placeholder="Ou décrivez la modification…"
          className="h-8 text-xs"
        />
        <Button size="sm" className="h-8" disabled={busy || !draft.trim()} onClick={() => submit(draft)}>
          {busy ? <Loader2 className="size-3.5 animate-spin" /> : <CornerDownLeft className="size-3.5" />}
        </Button>
      </div>

      {busy && (
        <div className="mt-1.5 flex items-center gap-1.5 text-2xs text-slate-500">
          <Loader2 className="size-3 animate-spin text-rad-indigo-600" />
          Réécriture du passage en cours…
        </div>
      )}
    </div>
  )
}
