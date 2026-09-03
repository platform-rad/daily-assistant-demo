import { useState } from 'react'
import { Check, Download, FileDown, Loader2, Presentation } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { fakeLatency } from '@/lib/utils'

type State = 'idle' | 'busy' | 'done'

/** Export simulé — aucun fichier n'est réellement produit dans ce prototype. */
export function ExportMenu({ docName, compact = false }: { docName: string; compact?: boolean }) {
  const [state, setState] = useState<State>('idle')
  const [format, setFormat] = useState<string>('')

  const run = async (fmt: string) => {
    setFormat(fmt)
    setState('busy')
    await fakeLatency(1000)
    setState('done')
    setTimeout(() => setState('idle'), 2200)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="xs" variant="default" disabled={state === 'busy'}>
          {state === 'busy' ? (
            <Loader2 className="size-3 animate-spin" />
          ) : state === 'done' ? (
            <Check className="size-3" />
          ) : (
            <Download className="size-3" />
          )}
          {state === 'busy'
            ? `Export ${format}…`
            : state === 'done'
              ? `${format} prêt`
              : compact
                ? 'Exporter'
                : 'Exporter en PDF / PPTX'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Exporter « {docName} »</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => run('PDF')}>
          <FileDown className="size-3.5 text-rad-indigo-600" />
          Document PDF (avec sources)
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => run('PPTX')}>
          <Presentation className="size-3.5 text-rad-indigo-600" />
          Présentation PPTX (trame comité)
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <div className="px-2 py-1.5 text-2xs leading-relaxed text-slate-400">
          Prototype — l’export est simulé, aucun fichier n’est généré.
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
