import { useCallback, useEffect, useRef, useState } from 'react'

/** Portion sélectionnée à l'intérieur d'un bloc (ou d'une puce). */
export interface SelectionTarget {
  blockId: string
  /** Défini si la portion appartient à une puce d'une liste. */
  itemIndex?: number
  /** Défini si la portion est la valeur d'un indicateur chiffré. */
  cellIndex?: number
  /** Bornes dans le texte complet de la cible, pour un remplacement exact. */
  start: number
  end: number
  text: string
}

export interface DocSelection {
  /** Une entrée par bloc ou puce touché — la sélection peut en traverser plusieurs. */
  targets: SelectionTarget[]
  /** Texte complet sélectionné, toutes cibles confondues. */
  text: string
  /** Rectangle de la sélection, en coordonnées viewport. */
  rect: { top: number; bottom: number; left: number; right: number }
}

/** Marqueur porté par la bulle de retouche, pour distinguer les clics internes. */
export const POPOVER_ATTR = 'data-selection-popover'

/**
 * Suit la sélection de texte à l'intérieur du document.
 *
 * La sélection peut couvrir plusieurs phrases, un paragraphe entier, ou
 * s'étendre sur plusieurs blocs — titres, paragraphes, puces. Plutôt que de
 * remonter à l'ancêtre commun (qui n'est plus un bloc dès qu'on en traverse
 * deux), on parcourt les blocs et on retient ceux que la sélection intersecte,
 * en calculant pour chacun la portion exacte concernée.
 *
 * Deux règles gouvernent la publication, et elles comptent :
 *
 * 1. **Rien n'est publié pendant le glissement.** La bulle n'apparaît qu'au
 *    relâché du bouton. Si elle s'ouvrait dès le troisième caractère surligné,
 *    elle interromprait le geste en cours.
 * 2. **Un clic dans la bulle gèle la sélection.** Cliquer dans le champ vide la
 *    sélection du document ; sans ce gel, la bulle se refermerait aussitôt.
 */
interface Options {
  /**
   * Appelé sur un clic net (sans glissement) dans le document. Permet de faire
   * passer le bloc visé en édition, alors qu'un glissement produit une sélection.
   */
  onClick?: (target: HTMLElement, x: number, y: number) => void
}

export function useDocSelection(containerRef: React.RefObject<HTMLElement>, options?: Options) {
  const [selection, setSelection] = useState<DocSelection | null>(null)
  const locked = useRef(false)
  const gesture = useRef(false)
  const origin = useRef({ x: 0, y: 0 })
  const onClickRef = useRef(options?.onClick)
  onClickRef.current = options?.onClick

  const clear = useCallback(() => {
    locked.current = false
    setSelection(null)
    window.getSelection()?.removeAllRanges()
  }, [])

  const lock = useCallback(() => {
    locked.current = true
  }, [])

  useEffect(() => {
    const compute = (): DocSelection | null => {
      const sel = window.getSelection()
      const container = containerRef.current
      if (!sel || !container || sel.isCollapsed || sel.rangeCount === 0) return null

      const range = sel.getRangeAt(0)
      if (!container.contains(range.commonAncestorContainer)) return null

      const text = sel.toString()
      if (text.trim().length < 3) return null

      const targets: SelectionTarget[] = []

      for (const host of container.querySelectorAll<HTMLElement>('[data-block-id]')) {
        if (!range.intersectsNode(host)) continue

        // Portion de la sélection retombant à l'intérieur de ce bloc.
        const sub = document.createRange()
        sub.selectNodeContents(host)
        if (range.compareBoundaryPoints(Range.START_TO_START, sub) > 0) {
          sub.setStart(range.startContainer, range.startOffset)
        }
        if (range.compareBoundaryPoints(Range.END_TO_END, sub) < 0) {
          sub.setEnd(range.endContainer, range.endOffset)
        }

        const part = sub.toString()
        if (!part.trim()) continue

        // Décalage du début de la portion par rapport au contenu du bloc.
        const probe = document.createRange()
        probe.selectNodeContents(host)
        probe.setEnd(sub.startContainer, sub.startOffset)
        const start = probe.toString().length

        const itemAttr = host.getAttribute('data-item-index')
        const cellAttr = host.getAttribute('data-cell-index')
        targets.push({
          blockId: host.getAttribute('data-block-id')!,
          itemIndex: itemAttr === null ? undefined : Number(itemAttr),
          cellIndex: cellAttr === null ? undefined : Number(cellAttr),
          start,
          end: start + part.length,
          text: part,
        })
      }

      if (!targets.length) return null

      const rect = range.getBoundingClientRect()
      return {
        targets,
        // Reconstruit à partir des cibles, et non de `sel.toString()` : la
        // sélection brute embarque le texte des badges de source et des
        // libellés, qui ne seront pas retouchés et brouilleraient la citation.
        text: targets.map((t) => t.text).join(' · '),
        rect: { top: rect.top, bottom: rect.bottom, left: rect.left, right: rect.right },
      }
    }

    const publish = () => {
      if (locked.current) return
      setSelection(compute())
    }

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Element | null
      // Clic à l'intérieur de la bulle : on gèle plutôt que de tout perdre.
      if (target?.closest?.(`[${POPOVER_ATTR}]`)) {
        locked.current = true
        return
      }
      // Nouveau geste ailleurs : on dégèle et on referme la bulle précédente.
      locked.current = false
      gesture.current = true
      origin.current = { x: event.clientX, y: event.clientY }
      setSelection(null)
    }

    const onPointerUp = (event: PointerEvent) => {
      if (!gesture.current) return
      gesture.current = false

      // Clic net (moins de 4 px de déplacement) : on passe en édition plutôt
      // que d'ouvrir la bulle. Au-delà, c'est un geste de sélection.
      const moved =
        Math.abs(event.clientX - origin.current.x) + Math.abs(event.clientY - origin.current.y)
      const inDocument = containerRef.current?.contains(event.target as Node)
      if (moved < 4 && inDocument) {
        onClickRef.current?.(event.target as HTMLElement, event.clientX, event.clientY)
        return
      }

      // Laisse le navigateur finaliser la sélection avant de la lire.
      setTimeout(publish, 0)
    }

    const onSelectionChange = () => {
      // Pendant un glissement, on laisse l'utilisateur terminer son geste.
      if (gesture.current) return
      publish()
    }

    document.addEventListener('pointerdown', onPointerDown, true)
    document.addEventListener('pointerup', onPointerUp, true)
    document.addEventListener('selectionchange', onSelectionChange)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown, true)
      document.removeEventListener('pointerup', onPointerUp, true)
      document.removeEventListener('selectionchange', onSelectionChange)
    }
  }, [containerRef])

  return { selection, clear, lock }
}
