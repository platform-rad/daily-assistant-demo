import { useState } from 'react'
import { CornerDownLeft, Loader2, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface Props {
  busy: boolean
  onSend: (text: string) => void
  placeholder?: string
  /** Raccourcis affichés sous le champ. */
  chips?: string[]
}

/** Champ de saisie partagé par la page d'accueil et la conversation. */
export function Composer({ busy, onSend, placeholder, chips }: Props) {
  const [draft, setDraft] = useState('')

  const submit = (text: string) => {
    const value = text.trim()
    if (!value || busy) return
    onSend(value)
    setDraft('')
  }

  return (
    <div className="shrink-0 border-t border-slate-200 bg-white p-2.5">
      <div className="flex gap-1.5">
        <div className="relative flex-1">
          <Sparkles className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-rad-indigo-500" />
          <Input
            value={draft}
            disabled={busy}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submit(draft)}
            placeholder={placeholder ?? 'Posez une question sur ce client…'}
            className="h-9 pl-8 text-xs"
          />
        </div>
        <Button size="sm" className="h-9" disabled={busy || !draft.trim()} onClick={() => submit(draft)}>
          {busy ? <Loader2 className="size-3.5 animate-spin" /> : <CornerDownLeft className="size-3.5" />}
        </Button>
      </div>

      {!!chips?.length && (
        <div className="mt-1.5 flex flex-wrap gap-1">
          {chips.map((c) => (
            <button
              key={c}
              disabled={busy}
              onClick={() => submit(c)}
              className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-2xs text-slate-600 transition-colors hover:border-rad-indigo-300 hover:bg-rad-indigo-50 hover:text-rad-indigo-700 disabled:opacity-50"
            >
              {c}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
