import { useCallback, useEffect, useRef, useState } from 'react'
import { resolveAiResponse } from '@/data/aiResponses'
import { DOCS } from '@/data/documents'
import { cellActionOf, pickSource, refreshFigures, resolveRewrite, scopeOf } from '@/data/rewrites'
import type { ChatMessage, DocBlock, WorkspaceDoc } from '@/data/types'
import type { SelectionTarget } from '@/hooks/useDocSelection'
import { fakeLatency, uid } from '@/lib/utils'

const clone = <T,>(v: T): T => JSON.parse(JSON.stringify(v))

const INTRO: Record<'cbs' | 'memo', string> = {
  cbs: 'CBS/CAP généré à partir de 6 sources internes. Les blocs sont éditables à la main — dites-moi ce que vous souhaitez ajouter ou reformuler.',
  memo: 'Briefing Memo généré pour le call CFO du 15 septembre. Vous pouvez éditer chaque bloc directement ou me demander un ajout.',
}

/** État du document co-édité + moteur de chat simulé (aucun appel réseau). */
export function useWorkspaceDoc(docId: 'cbs' | 'memo') {
  const [doc, setDoc] = useState<WorkspaceDoc>(() => clone(DOCS[docId]))
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: uid('msg'), role: 'assistant', text: INTRO[docId] },
  ])
  const [busy, setBusy] = useState(false)
  const [dirty, setDirty] = useState(false)
  const [highlighted, setHighlighted] = useState<string[]>([])

  // Changement de document : on repart du mock d'origine.
  useEffect(() => {
    setDoc(clone(DOCS[docId]))
    setMessages([{ id: uid('msg'), role: 'assistant', text: INTRO[docId] }])
    setDirty(false)
    setHighlighted([])
  }, [docId])

  const updateBlockText = useCallback((blockId: string, text: string) => {
    setDoc((d) => ({
      ...d,
      blocks: d.blocks.map((b) => (b.id === blockId ? { ...b, text } : b)),
    }))
    setDirty(true)
  }, [])

  const updateBlockItem = useCallback((blockId: string, index: number, text: string) => {
    setDoc((d) => ({
      ...d,
      blocks: d.blocks.map((b) =>
        b.id === blockId
          ? { ...b, items: b.items?.map((it, i) => (i === index ? text : it)) }
          : b
      ),
    }))
    setDirty(true)
  }, [])

  const updateCellValue = useCallback((blockId: string, cellIndex: number, value: string) => {
    setDoc((d) => ({
      ...d,
      blocks: d.blocks.map((b) =>
        b.id === blockId
          ? { ...b, cells: b.cells?.map((c, i) => (i === cellIndex ? { ...c, value } : c)) }
          : b
      ),
    }))
    setDirty(true)
  }, [])

  const deleteBlock = useCallback((blockId: string) => {
    setDoc((d) => ({ ...d, blocks: d.blocks.filter((b) => b.id !== blockId) }))
    setDirty(true)
  }, [])

  const resetDoc = useCallback(() => {
    setDoc(clone(DOCS[docId]))
    setDirty(false)
    setHighlighted([])
  }, [docId])

  /**
   * Simule un aller-retour avec l'agent : 1 s de latence, puis insertion
   * du bloc généré à la fin de la dernière section d'opportunités.
   */
  const sendPrompt = useCallback(async (prompt: string) => {
    const userMsg: ChatMessage = { id: uid('msg'), role: 'user', text: prompt }
    const pendingId = uid('msg')
    setMessages((m) => [
      ...m,
      userMsg,
      { id: pendingId, role: 'assistant', text: '', pending: true },
    ])
    setBusy(true)

    await fakeLatency(1000)

    const { reply, blocks } = resolveAiResponse(prompt)

    setDoc((d) => {
      const lastOppIndex = d.blocks.map((b) => b.kind).lastIndexOf('opportunity')
      const insertAt = lastOppIndex >= 0 ? lastOppIndex + 1 : d.blocks.length
      const next = [...d.blocks]
      next.splice(insertAt, 0, ...blocks)
      return { ...d, blocks: next, updatedAt: 'à l’instant' }
    })

    setHighlighted(blocks.map((b) => b.id))
    setMessages((m) =>
      m.map((msg) =>
        msg.id === pendingId
          ? { ...msg, pending: false, text: reply, insertedBlockIds: blocks.map((b) => b.id) }
          : msg
      )
    )
    setBusy(false)
    setDirty(true)
  }, [])

  /** Miroir du document, pour lire l'état courant sans dépendance de closure. */
  const docRef = useRef(doc)
  useEffect(() => {
    docRef.current = doc
  }, [doc])

  /** Remplace la portion [start, end[ d'une cible par `replacement`. */
  const spliceTarget = (blocks: DocBlock[], t: SelectionTarget, replacement: string) =>
    blocks.map((b) => {
      if (b.id !== t.blockId) return b
      if (t.itemIndex === undefined) {
        const cur = b.text ?? ''
        return { ...b, text: cur.slice(0, t.start) + replacement + cur.slice(t.end) }
      }
      return {
        ...b,
        items: b.items?.map((it, i) =>
          i === t.itemIndex ? it.slice(0, t.start) + replacement + it.slice(t.end) : it
        ),
      }
    })

  /** Retire les puces devenues vides, puis les blocs devenus vides. */
  const prune = (blocks: DocBlock[]) =>
    blocks
      .map((b) => (b.items ? { ...b, items: b.items.filter((it) => it.trim()) } : b))
      .filter((b) => {
        if (b.kind === 'kpi') return true
        if (b.kind === 'bullets') return (b.items?.length ?? 0) > 0
        return (b.text ?? '').trim().length > 0
      })

  /**
   * Retouche du passage sélectionné. La sélection peut couvrir plusieurs
   * phrases, un paragraphe entier ou plusieurs blocs.
   *
   * - Consigne `local` (actualiser, sourcer) : appliquée bloc par bloc, la
   *   structure du document est conservée.
   * - Consigne `global` (raccourcir, développer, reformuler) : appliquée au
   *   passage entier, le résultat atterrit dans le premier bloc et la portion
   *   sélectionnée des suivants est retirée.
   *
   * Dans tous les cas, le texte hors sélection est préservé au caractère près.
   */
  const rewriteSelection = useCallback(
    async (req: { targets: SelectionTarget[]; text: string; instruction: string }) => {
      const snapshot = docRef.current.blocks
      const pendingId = uid('msg')

      setMessages((m) => [
        ...m,
        { id: uid('msg'), role: 'user', text: req.instruction, quote: req.text },
        { id: pendingId, role: 'assistant', text: '', pending: true },
      ])
      setBusy(true)

      await fakeLatency(1000)

      let blocks = snapshot
      const parts: string[] = []

      // Les indicateurs chiffrés et le texte rédigé ne se retouchent pas de
      // la même façon : on les traite séparément.
      const cells = req.targets.filter((t) => t.cellIndex !== undefined)
      const texts = req.targets.filter((t) => t.cellIndex === undefined)

      /* ── Texte rédigé ── */
      if (texts.length) {
        const scope = scopeOf(req.instruction)
        if (scope === 'local' || texts.length === 1) {
          const results = texts.map((t) => resolveRewrite(t.text, req.instruction))
          texts.forEach((t, i) => {
            blocks = spliceTarget(blocks, t, results[i].text)
          })
          // On rapporte ce qui a changé dans chaque bloc, pas seulement le premier.
          const touched = results.filter((r, i) => r.text !== texts[i].text)
          if (texts.length === 1) parts.push(results[0].note)
          else if (!touched.length)
            parts.push(`${texts.length} blocs analysés, aucun n’a nécessité de modification.`)
          else
            parts.push(
              `${texts.length} blocs analysés, ${touched.length} modifié${
                touched.length > 1 ? 's' : ''
              }. ${touched.map((r) => r.note).join(' ')}`
            )
        } else {
          const result = resolveRewrite(texts.map((t) => t.text).join(' '), req.instruction)
          const [first, ...rest] = texts
          blocks = spliceTarget(blocks, first, result.text)
          for (const t of rest) blocks = spliceTarget(blocks, t, '')
          blocks = prune(blocks)
          parts.push(`${texts.length} blocs fusionnés en un passage. ${result.note}`)
        }
      }

      /* ── Indicateurs chiffrés ── */
      if (cells.length) {
        const action = cellActionOf(req.instruction)
        const changes: string[] = []

        if (action !== 'none') {
          for (const t of cells) {
            blocks = blocks.map((b) => {
              if (b.id !== t.blockId || !b.cells) return b
              return {
                ...b,
                cells: b.cells.map((c, i) => {
                  if (i !== t.cellIndex) return c
                  if (action === 'refresh') {
                    const v = refreshFigures(c.value)
                    const d = c.delta ? refreshFigures(c.delta) : null
                    const all = [...v.changes, ...(d?.changes ?? [])]
                    if (!all.length) return c
                    changes.push(`${c.label} — ${all.join(' ; ')}`)
                    return { ...c, value: v.text, delta: d ? d.text : c.delta }
                  }
                  const source = pickSource(`${c.label} ${c.value}`)
                  if (c.sources?.some((s) => s.system === source.system)) return c
                  changes.push(`${c.label} — source ${source.system} ajoutée`)
                  return { ...c, sources: [...(c.sources ?? []), source] }
                }),
              }
            })
          }
        }

        if (action === 'none') {
          parts.push(
            `${cells.length} indicateur${cells.length > 1 ? 's' : ''} laissé${
              cells.length > 1 ? 's' : ''
            } tel quel : cette consigne ne s’applique pas à une valeur chiffrée. Essayez « Actualiser les chiffres » ou « Sourcer ».`
          )
        } else if (!changes.length) {
          parts.push(
            `${cells.length} indicateur${cells.length > 1 ? 's' : ''} analysé${
              cells.length > 1 ? 's' : ''
            }, aucun n’a nécessité de modification.`
          )
        } else {
          parts.push(`${changes.length} indicateur(s) mis à jour. ${changes.join(' · ')}.`)
        }
      }

      const note = parts.join(' ')

      // Le nœud est encore focalisé par la sélection : on le relâche pour que
      // le contenteditable accepte la resynchronisation depuis le state.
      ;(document.activeElement as HTMLElement | null)?.blur?.()
      window.getSelection()?.removeAllRanges()

      const unchanged = JSON.stringify(blocks) === JSON.stringify(snapshot)
      setDoc((d) => ({ ...d, blocks }))
      setDirty(true)
      setHighlighted(req.targets.map((t) => t.blockId))

      setMessages((m) =>
        m.map((msg) =>
          msg.id === pendingId
            ? {
                ...msg,
                pending: false,
                text: note,
                revert: unchanged ? undefined : { blocks: snapshot },
              }
            : msg
        )
      )
      setBusy(false)
    },
    []
  )

  /** Annulation d'une retouche : on restaure l'instantané des blocs. */
  const revertRewrite = useCallback(
    (revert: NonNullable<ChatMessage['revert']>, messageId: string) => {
      setDoc((d) => ({ ...d, blocks: revert.blocks }))
      setHighlighted(revert.blocks.map((b) => b.id))
      setMessages((m) =>
        m.map((msg) =>
          msg.id === messageId
            ? { ...msg, revert: undefined, text: `${msg.text} — retouche annulée.` }
            : msg
        )
      )
    },
    []
  )

  return {
    doc,
    messages,
    busy,
    dirty,
    highlighted,
    updateBlockText,
    updateBlockItem,
    updateCellValue,
    deleteBlock,
    resetDoc,
    sendPrompt,
    rewriteSelection,
    revertRewrite,
  }
}
