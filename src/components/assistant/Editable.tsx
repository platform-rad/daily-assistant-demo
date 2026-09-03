import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

interface Props {
  value: string
  onChange: (value: string) => void
  className?: string
  placeholder?: string
  as?: 'div' | 'span' | 'h2' | 'h3' | 'li' | 'p'
  /** Identifie le bloc pour la retouche par sélection. */
  blockId?: string
  /** Index de puce si le bloc est une liste. */
  itemIndex?: number
  /** Index de cellule si le bloc est une grille d'indicateurs. */
  cellIndex?: number
  /**
   * Le bloc n'est éditable que lorsqu'il a été cliqué.
   *
   * C'est la condition pour que la sélection puisse traverser plusieurs blocs :
   * le navigateur clampe toute sélection à l'intérieur d'un unique hôte
   * d'édition. Si chaque bloc était éditable en permanence, surligner deux
   * paragraphes serait impossible.
   */
  editable?: boolean
}

/** Clé d'édition d'une cible — un bloc, une puce, ou une cellule d'indicateur. */
export const editKey = (blockId: string, itemIndex?: number, cellIndex?: number) =>
  `${blockId}:${itemIndex ?? ''}:${cellIndex ?? ''}`

/**
 * Zone de texte éditable à la main (contentEditable non contrôlé).
 * React ne possède jamais les enfants du nœud : le texte est injecté via
 * l'effet, uniquement lorsque le bloc n'a pas le focus. La position du
 * curseur n'est donc jamais réinitialisée pendant la frappe.
 */
export function Editable({
  value,
  onChange,
  className,
  placeholder,
  as = 'div',
  blockId,
  itemIndex,
  cellIndex,
  editable = false,
}: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (el && document.activeElement !== el && el.textContent !== value) {
      el.textContent = value
    }
  }, [value])

  const Tag = as as 'div'

  return (
    <Tag
      ref={ref}
      contentEditable={editable || undefined}
      suppressContentEditableWarning
      spellCheck={false}
      data-placeholder={placeholder}
      data-block-id={blockId}
      data-item-index={itemIndex}
      data-cell-index={cellIndex}
      data-editing={editable ? 'true' : undefined}
      onBlur={(e) => onChange(e.currentTarget.textContent ?? '')}
      className={cn(
        'rad-editable cursor-text',
        editable && 'rounded-[3px] ring-1 ring-rad-indigo-200',
        className
      )}
    />
  )
}
