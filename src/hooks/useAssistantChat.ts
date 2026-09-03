import { useCallback, useState } from 'react'
import { resolveInsight, type Insight } from '@/data/insights'
import { fakeLatency, uid } from '@/lib/utils'

export interface ChatEntry {
  id: string
  role: 'user' | 'assistant'
  text?: string
  insight?: Insight
  pending?: boolean
}

/**
 * Conversation de la page d'accueil de l'assistant.
 * Aucun appel réseau : la réponse est choisie localement par mots-clés,
 * après 1 s de latence simulée.
 */
export function useAssistantChat() {
  const [entries, setEntries] = useState<ChatEntry[]>([])
  const [busy, setBusy] = useState(false)

  const ask = useCallback(async (prompt: string) => {
    const pendingId = uid('entry')
    setEntries((e) => [
      ...e,
      { id: uid('entry'), role: 'user', text: prompt },
      { id: pendingId, role: 'assistant', pending: true },
    ])
    setBusy(true)

    await fakeLatency(1000)

    const insight = resolveInsight(prompt)
    setEntries((e) =>
      e.map((entry) => (entry.id === pendingId ? { ...entry, pending: false, insight } : entry))
    )
    setBusy(false)
  }, [])

  const reset = useCallback(() => setEntries([]), [])

  return { entries, busy, ask, reset }
}
