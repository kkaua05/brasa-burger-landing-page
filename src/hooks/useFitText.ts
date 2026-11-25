import { useLayoutEffect, useRef } from 'react'

/**
 * Scales a single line of text so it spans exactly the width of its parent,
 * whatever the brand name. Sets `--fit-size` on the element; the CSS should
 * use it as font-size with a sensible fallback for the first paint.
 */
export function useFitText<T extends HTMLElement>() {
  const ref = useRef<T>(null)

  useLayoutEffect(() => {
    const element = ref.current
    const parent = element?.parentElement
    if (!element || !parent) return

    const fit = () => {
      const available = parent.clientWidth
      const current = parseFloat(getComputedStyle(element).fontSize)
      const width = element.getBoundingClientRect().width
      if (!available || !width) return
      element.style.setProperty('--fit-size', `${(current * available) / width}px`)
    }

    fit()
    const observer = new ResizeObserver(fit)
    observer.observe(parent)
    document.fonts?.ready.then(fit)
    return () => observer.disconnect()
  }, [])

  return ref
}
