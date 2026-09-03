import { useEffect, useRef } from 'react'
import { ArrowLeft, Loader2, Sparkles, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Insight } from '@/data/insights'
import type { ChatEntry } from '@/hooks/useAssistantChat'
import { InsightCard } from './InsightCard'

interface Props {
  entries: ChatEntry[]
  busy: boolean
  onFollowUp: (f: Insight['followUps'][number]) => void
  onBack: () => void
}

export function ConversationView({ entries, busy, onFollowUp, onBack }: Props) {
  const endRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'end' })
  }, [entries])

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex shrink-0 items-center gap-1.5 border-b border-slate-200 bg-white px-3 py-2">
        <Button variant="ghost" size="icon-sm" onClick={onBack} title="Retour à l’accueil">
          <ArrowLeft className="size-3.5" />
        </Button>
        <span className="text-2xs font-semibold uppercase tracking-wider text-slate-500">
          Conversation
        </span>
        <span className="ml-auto text-2xs text-slate-400">
          {entries.filter((e) => e.role === 'user').length} question
          {entries.filter((e) => e.role === 'user').length > 1 ? 's' : ''}
        </span>
      </div>

      <div className="rad-scroll min-h-0 flex-1 space-y-2.5 overflow-y-auto bg-slate-50 p-3">
        {entries.map((entry) =>
          entry.role === 'user' ? (
            <div key={entry.id} className="flex justify-end gap-2">
              <div className="max-w-[85%] rounded-lg bg-rad-indigo-600 px-2.5 py-1.5 text-2xs leading-relaxed text-white">
                {entry.text}
              </div>
              <div className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-slate-300">
                <User className="size-2.5 text-slate-600" />
              </div>
            </div>
          ) : entry.pending ? (
            <div key={entry.id} className="flex items-center gap-2 px-1">
              <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-rad-indigo-600">
                <Sparkles className="size-2.5 text-white" />
              </div>
              <span className="flex items-center gap-1.5 text-2xs text-slate-500">
                <Loader2 className="size-3 animate-spin" />
                Consultation de C3, Atlas, Baccarat et Dealogic…
              </span>
            </div>
          ) : (
            entry.insight && (
              <InsightCard
                key={entry.id}
                insight={entry.insight}
                onFollowUp={onFollowUp}
                busy={busy}
              />
            )
          )
        )}
        <div ref={endRef} />
      </div>
    </div>
  )
}
