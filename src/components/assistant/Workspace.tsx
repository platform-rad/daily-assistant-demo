import { useEffect, useRef, useState } from 'react'
import {
  ArrowLeft,
  FileSpreadsheet,
  FileText,
  MousePointerClick,
  RotateCcw,
  Save,
  Users,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useDocSelection } from '@/hooks/useDocSelection'
import { useWorkspaceDoc } from '@/hooks/useWorkspaceDoc'
import { cn } from '@/lib/utils'
import { ChatPanel } from './ChatPanel'
import { DocumentBlock } from './DocumentBlock'
import { editKey } from './Editable'
import { ExportMenu } from './ExportMenu'
import { SelectionPopover } from './SelectionPopover'
import { ConfidenceIndicator } from './TrustBadges'

interface Props {
  docId: 'cbs' | 'memo'
  onSwitchDoc: (id: 'cbs' | 'memo') => void
  onBack: () => void
  compact: boolean
}

export function Workspace({ docId, onSwitchDoc, onBack, compact }: Props) {
  const {
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
  } = useWorkspaceDoc(docId)

  const scrollRef = useRef<HTMLDivElement>(null)
  const asideRef = useRef<HTMLDivElement>(null)
  const [bounds, setBounds] = useState<DOMRect | null>(null)

  /**
   * Un seul bloc est éditable à la fois — celui qui vient d'être cliqué.
   * Les autres restent du texte ordinaire, ce qui permet à la sélection de
   * traverser librement plusieurs blocs.
   */
  const [editingKey, setEditingKey] = useState<string | null>(null)
  const pendingCaret = useRef<Range | null>(null)

  const { selection, clear, lock } = useDocSelection(scrollRef, {
    onClick: (target, x, y) => {
      const host = target.closest?.('[data-block-id]') as HTMLElement | null
      if (!host) {
        setEditingKey(null)
        return
      }
      // Position du curseur capturée avant le passage en contentEditable :
      // le nœud texte est le même après, la plage reste donc valide.
      const caretFrom = (document as Document & {
        caretRangeFromPoint?: (x: number, y: number) => Range | null
      }).caretRangeFromPoint
      pendingCaret.current = caretFrom ? caretFrom.call(document, x, y) : null
      setEditingKey(editKey(host.dataset.blockId!, host.dataset.itemIndex ? Number(host.dataset.itemIndex) : undefined))
    },
  })

  // Donne le focus au bloc passé en édition et y replace le curseur.
  useEffect(() => {
    if (!editingKey) return
    const el = scrollRef.current?.querySelector<HTMLElement>('[data-editing="true"]')
    if (!el) return
    el.focus()
    const caret = pendingCaret.current
    pendingCaret.current = null
    if (caret && el.contains(caret.startContainer)) {
      const sel = window.getSelection()
      sel?.removeAllRanges()
      sel?.addRange(caret)
    }
  }, [editingKey])

  // Le panneau sert de cadre de positionnement à la bulle de retouche.
  useEffect(() => {
    if (selection) setBounds(asideRef.current?.getBoundingClientRect() ?? null)
  }, [selection])

  // Fait défiler jusqu'au bloc fraîchement inséré par l'IA.
  useEffect(() => {
    if (!highlighted.length) return
    const el = document.getElementById(`block-${highlighted[0]}`)
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [highlighted])

  return (
    <div ref={asideRef} className="flex min-h-0 flex-1 flex-col bg-white">
      {/* Barre d'outils du document */}
      <div className="shrink-0 border-b border-slate-200 bg-white">
        <div className="flex flex-wrap items-center gap-1.5 px-3 py-2">
          <Button variant="ghost" size="icon-sm" onClick={onBack} title="Retour au briefing">
            <ArrowLeft className="size-3.5" />
          </Button>
          <div className="flex shrink-0 items-center gap-0.5 rounded-md bg-slate-100 p-0.5">
            {(
              [
                { id: 'cbs', label: 'CBS/CAP', icon: FileSpreadsheet },
                { id: 'memo', label: 'Briefing Memo', icon: FileText },
              ] as const
            ).map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => onSwitchDoc(id)}
                className={cn(
                  'flex items-center gap-1.5 rounded px-2 py-1 text-2xs font-medium transition-colors',
                  docId === id
                    ? 'bg-white text-rad-indigo-700 shadow-rad'
                    : 'text-slate-500 hover:text-slate-800'
                )}
              >
                <Icon className="size-3" />
                {label}
              </button>
            ))}
          </div>

          <div className="ml-auto flex items-center gap-1.5">
            {dirty && (
              <Badge variant="warning" className="hidden sm:inline-flex">
                Modifications non enregistrées
              </Badge>
            )}
            <Button variant="ghost" size="icon-sm" onClick={resetDoc} title="Réinitialiser">
              <RotateCcw className="size-3.5" />
            </Button>
            <Button variant="secondary" size="xs">
              <Save className="size-3" />
              {compact ? '' : 'Enregistrer'}
            </Button>
            <ExportMenu docName={doc.title} compact={compact} />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 px-3 py-1.5">
          <Badge variant="info">{doc.kind}</Badge>
          <span className="font-mono text-2xs text-slate-400">{doc.reference}</span>
          <Separator orientation="vertical" className="h-3" />
          <span className="text-2xs text-slate-500">Mis à jour {doc.updatedAt}</span>
          <span className="ml-auto flex items-center gap-3">
            <span className="hidden items-center gap-1 text-2xs text-slate-400 lg:flex">
              <Users className="size-3" />
              Revue humaine requise
            </span>
            <ConfidenceIndicator value={doc.confidence} variant="bar" />
          </span>
        </div>
      </div>

      {/* Document éditable */}
      <div
        ref={scrollRef}
        onBlur={() => setEditingKey(null)}
        className="rad-scroll min-h-0 flex-1 overflow-y-auto"
      >
        <div className={cn('mx-auto px-5 py-5', compact ? 'max-w-none' : 'max-w-3xl')}>
          <header className="border-b border-slate-200 pb-4">
            <h1 className="text-base font-semibold tracking-tight text-slate-900">{doc.title}</h1>
            <p className="mt-1 text-xs text-slate-500">{doc.subtitle}</p>
            <p className="mt-1 text-2xs text-slate-400">{doc.author}</p>
          </header>

          {doc.blocks.map((block) => (
            <div
              key={block.id}
              id={`block-${block.id}`}
              className={cn(
                'rounded-lg transition-colors duration-700',
                highlighted.includes(block.id) && 'bg-rad-indigo-50/60'
              )}
            >
              <DocumentBlock
                block={block}
                compact={compact}
                editingKey={editingKey}
                onChangeText={(t) => updateBlockText(block.id, t)}
                onChangeItem={(i, t) => updateBlockItem(block.id, i, t)}
                onChangeCell={(i, v) => updateCellValue(block.id, i, v)}
                onDelete={() => deleteBlock(block.id)}
              />
            </div>
          ))}

          <p className="mt-6 flex items-center gap-1.5 rounded-md border border-dashed border-slate-300 bg-slate-50 px-2.5 py-1.5 text-2xs text-slate-500">
            <MousePointerClick className="size-3 shrink-0 text-rad-indigo-500" />
            Cliquez sur un passage pour l’éditer à la main, ou surlignez-le — même sur plusieurs
            blocs — pour demander une retouche à l’assistant.
          </p>

          <p className="mt-4 border-t border-slate-100 pt-3 text-2xs leading-relaxed text-slate-400">
            Document généré par un agent et soumis à revue humaine avant toute diffusion. Les
            badges de source indiquent le système d’origine de chaque donnée ; les mentions
            « Data Gap » signalent une information partielle ou non disponible.
          </p>
        </div>
      </div>

      {/* Bulle de retouche du passage sélectionné */}
      {selection && bounds && (
        <SelectionPopover
          selection={selection}
          bounds={bounds}
          busy={busy}
          onLock={lock}
          onClose={clear}
          onSubmit={async (instruction) => {
            await rewriteSelection({ ...selection, instruction })
            clear()
          }}
        />
      )}

      {/* Chat de co-édition */}
      <ChatPanel
        messages={messages}
        busy={busy}
        onSend={sendPrompt}
        onRevert={revertRewrite}
        compact={compact}
      />
    </div>
  )
}
