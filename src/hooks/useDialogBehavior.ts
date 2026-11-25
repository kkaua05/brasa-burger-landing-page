import { useEffect, type RefObject } from 'react'

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'

/**
 * Modal behaviour for an overlay that is always mounted: locks page scroll,
 * moves focus inside, keeps Tab within it, closes on Escape and gives focus
 * back to the element that opened it.
 */
export function useDialogBehavior(
  container: RefObject<HTMLElement | null>,
  open: boolean,
  onClose: () => void,
  returnFocusTo: RefObject<HTMLElement | null>,
) {
  useEffect(() => {
    const element = container.current
    if (!open || !element) return

    const root = document.documentElement
    const previousOverflow = root.style.overflow
    root.style.overflow = 'hidden'

    const focusables = () => Array.from(element.querySelectorAll<HTMLElement>(FOCUSABLE))
    focusables()[0]?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }
      if (event.key !== 'Tab') return
      const items = focusables()
      const first = items[0]
      const last = items[items.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last?.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first?.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    const returnTarget = returnFocusTo.current
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      root.style.overflow = previousOverflow
      returnTarget?.focus({ preventScroll: true })
    }
  }, [container, open, onClose, returnFocusTo])
}
