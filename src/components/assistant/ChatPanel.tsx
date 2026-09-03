import { useEffect, useRef, useState } from 'react'
import { CornerDownLeft, Loader2, Sparkles, Undo2, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CHAT_SUGGESTIONS } from '@/data/aiResponses'
import type { ChatMessage } from '@/data/types'
import { cn } from '@/lib/utils'

interface Props {
  messages: ChatMessage[]
  busy: boolean
  onSend: (text: string) => void
  onRevert?: (revert: NonNullable<ChatMessage['revert']>, messageId: string) => void
  compact?: boolean
}

export function ChatPanel({ messages, busy, onSend, onRevert, compact = false }: Props) {
  const [draft, setDraft] = useState('')
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages])

  const submit = (text: string) => {
    const value = text.trim()
    if (!value || busy) return
    onSend(value)
    setDraft('')
  }

  return (
    <div className="flex min-h-0 flex-col border-t border-slate-200 bg-slate-50">
      <div className="flex items-center gap-1.5 px-3 py-2">
        <Sparkles className="size-3.5 text-rad-indigo-600" />
        <span className="text-2xs font-semibold uppercase tracking-wider text-slate-500">
          Co-édition assistée
        </span>
      </div>

      <div
        className={cn(
          'rad-scroll min-h-0 flex-1 space-y-2 overflow-y-auto px-3 pb-2',
          compact ? 'max-h-40' : 'max-h-64'
        )}
      >
        {messages.map((m) => (
          <div
            key={m.id}
            className={cn('flex gap-2', m.role === 'user' ? 'justify-end' : 'justify-start')}
          >
            {m.role === 'assistant' && (
              <div className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-rad-indigo-600">
                <Sparkles className="size-2.5 text-white" />
              </div>
            )}
            <div
              className={cn(
                'max-w-[85%] rounded-lg px-2.5 py-1.5 text-2xs leading-relaxed',
                m.role === 'user'
                  ? 'bg-rad-indigo-600 text-white'
                  : 'border border-slate-200 bg-white text-slate-700'
              )}
            >
              {m.quote && (
                <div
                  className={cn(
                    'mb-1 border-l-2 pl-1.5 text-2xs italic',
                    m.role === 'user'
                      ? 'border-white/40 text-white/80'
                      : 'border-slate-300 text-slate-500'
                  )}
                >
                  « {m.quote.length > 90 ? `${m.quote.slice(0, 90).trimEnd()}…` : m.quote} »
                </div>
              )}
              {m.pending ? (
                <span className="flex items-center gap-1.5 text-slate-500">
                  <Loader2 className="size-3 animate-spin" />
                  Analyse des sources et rédaction du bloc…
                </span>
              ) : (
                m.text
              )}
              {!!m.insertedBlockIds?.length && (
                <div className="mt-1 border-t border-slate-100 pt-1 text-2xs font-medium text-rad-indigo-600">
                  {m.insertedBlockIds.length} bloc inséré dans le document ↓
                </div>
              )}
              {m.revert && onRevert && (
                <button
                  onClick={() => onRevert(m.revert!, m.id)}
                  className="mt-1.5 flex items-center gap-1 border-t border-slate-100 pt-1.5 text-2xs font-medium text-slate-500 transition-colors hover:text-red-600"
                >
                  <Undo2 className="size-3" />
                  Annuler cette retouche
                </button>
              )}
            </div>
            {m.role === 'user' && (
              <div className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-slate-300">
                <User className="size-2.5 text-slate-600" />
              </div>
            )}
          </div>
        ))}
        <div ref={endRef} />
      </div>

      <div className="border-t border-slate-200 bg-white p-2.5">
        <div className="flex gap-1.5">
          <Input
            value={draft}
            disabled={busy}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submit(draft)}
            placeholder="Ex. : Ajoute une opportunité ESG pour 2026"
            className="h-8 text-xs"
          />
          <Button size="sm" disabled={busy || !draft.trim()} onClick={() => submit(draft)}>
            {busy ? <Loader2 className="size-3.5 animate-spin" /> : <CornerDownLeft className="size-3.5" />}
          </Button>
        </div>
        <div className="mt-1.5 flex flex-wrap gap-1">
          {CHAT_SUGGESTIONS.map((s) => (
            <button
              key={s}
              disabled={busy}
              onClick={() => submit(s)}
              className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-2xs text-slate-600 transition-colors hover:border-rad-indigo-300 hover:bg-rad-indigo-50 hover:text-rad-indigo-700 disabled:opacity-50"
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
