import { useCallback, useEffect, useRef, useState } from 'react'

interface Options {
  /** Position verticale courante, en pixels depuis le haut du viewport. */
  top: number
  onTopChange: (top: number) => void
  /** Butée haute — typiquement le bas du header de l'application hôte. */
  minTop?: number
  /** Marge conservée en bas du viewport. */
  margin?: number
}

/**
 * Déplacement à la souris sur l'axe vertical uniquement.
 *
 * Pointer Events avec capture : le glissement continue même si le curseur sort
 * de l'élément ou de la fenêtre.
 *
 * Pendant le geste, la position est écrite directement sur le nœud DOM plutôt
 * que poussée dans le state React : aucun rendu n'est déclenché entre le
 * pointerdown et le pointerup, ce qui donne un déplacement parfaitement fluide
 * même sur une souris haute fréquence. Le state n'est synchronisé qu'au relâché.
 */
export function useVerticalDrag<T extends HTMLElement>({
  top,
  onTopChange,
  minTop = 0,
  margin = 8,
}: Options) {
  const ref = useRef<T>(null)
  /** État de glissement en ref : lisible immédiatement, sans attendre un rendu. */
  const active = useRef(false)
  /** Doublon en state, uniquement pour les styles (curseur, anneau de focus). */
  const [dragging, setDragging] = useState(false)
  const origin = useRef({ pointerY: 0, top: 0, moved: false })
  const latest = useRef(top)

  const clamp = useCallback(
    (value: number) => {
      const height = ref.current?.offsetHeight ?? 0
      const max = Math.max(minTop, window.innerHeight - height - margin)
      return Math.min(Math.max(value, minTop), max)
    },
    [minTop, margin]
  )

  // Repositionne la pilule si la fenêtre rétrécit sous sa position courante.
  useEffect(() => {
    const onResize = () => {
      const next = clamp(top)
      if (next !== top) onTopChange(next)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [clamp, top, onTopChange])

  const onPointerDown = (event: React.PointerEvent<T>) => {
    if (event.button !== 0) return
    // La capture peut échouer si le pointeur n'est plus actif : le glissement
    // reste fonctionnel via les événements qui remontent au document.
    try {
      ref.current?.setPointerCapture(event.pointerId)
    } catch {
      /* ignoré */
    }
    origin.current = { pointerY: event.clientY, top, moved: false }
    latest.current = top
    active.current = true
    setDragging(true)
  }

  const onPointerMove = (event: React.PointerEvent<T>) => {
    if (!active.current || !ref.current) return
    const delta = event.clientY - origin.current.pointerY
    if (Math.abs(delta) > 3) origin.current.moved = true
    latest.current = clamp(origin.current.top + delta)
    ref.current.style.top = `${latest.current}px`
  }

  const endDrag = (event: React.PointerEvent<T>) => {
    if (!active.current) return
    active.current = false
    try {
      ref.current?.releasePointerCapture(event.pointerId)
    } catch {
      /* ignoré */
    }
    setDragging(false)
    if (latest.current !== top) onTopChange(latest.current)
  }

  return {
    ref,
    dragging,
    /** Vrai si le dernier geste était un glissement — sert à ne pas déclencher le clic. */
    didDrag: () => origin.current.moved,
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp: endDrag,
      onPointerCancel: endDrag,
    },
  }
}
