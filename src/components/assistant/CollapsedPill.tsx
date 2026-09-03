import { GripVertical, Sparkles } from 'lucide-react'
import { useVerticalDrag } from '@/hooks/useVerticalDrag'
import { cn } from '@/lib/utils'

/** Hauteur du header MyClientDev (h-14 + bordure) — butée haute du glissement. */
export const HEADER_HEIGHT = 57

/** Position par défaut : juste sous le header de l'application hôte. */
export const DEFAULT_PILL_TOP = HEADER_HEIGHT + 12

interface Props {
  count: number
  onOpen: () => void
  top: number
  onTopChange: (top: number) => void
}

/**
 * État Collapsed — pilule ancrée à droite, sous le header, avec pastille de
 * notification. Déplaçable à la souris sur l'axe vertical uniquement.
 */
export function CollapsedPill({ count, onOpen, top, onTopChange }: Props) {
  const { ref, dragging, didDrag, handlers } = useVerticalDrag<HTMLDivElement>({
    top,
    onTopChange,
    minTop: HEADER_HEIGHT + 8,
  })

  return (
    <div
      ref={ref}
      role="button"
      tabIndex={0}
      aria-label="Ouvrir le Daily Assistant"
      style={{ top }}
      onClick={() => {
        // Un glissement ne doit pas ouvrir le panneau.
        if (!didDrag()) onOpen()
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onOpen()
        }
        // Ajustement fin au clavier.
        if (e.key === 'ArrowUp') onTopChange(Math.max(HEADER_HEIGHT + 8, top - 16))
        if (e.key === 'ArrowDown') onTopChange(top + 16)
      }}
      {...handlers}
      className={cn(
        'group fixed right-0 z-40 flex touch-none select-none items-center gap-2 rounded-l-full border border-r-0 border-slate-700 bg-rad-navy py-3 pl-3 pr-3 shadow-rad-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rad-indigo-400',
        dragging
          ? 'cursor-grabbing ring-2 ring-rad-indigo-400'
          : 'cursor-grab transition-[padding,box-shadow] hover:pl-4'
      )}
    >
      <GripVertical
        className={cn(
          'size-3.5 shrink-0 text-slate-600 transition-colors',
          dragging ? 'text-rad-indigo-300' : 'group-hover:text-slate-400'
        )}
      />
      <span className="relative flex size-6 items-center justify-center rounded-full bg-rad-indigo-600">
        <Sparkles className="size-3.5 text-white" />
        {count > 0 && (
          <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white ring-2 ring-rad-navy">
            {count}
          </span>
        )}
      </span>
      <span className="text-xs font-medium text-white">Daily Assistant</span>
    </div>
  )
}
