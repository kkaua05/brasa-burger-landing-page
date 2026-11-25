import { useEffect, useState } from 'react'

/**
 * True while none of the elements matching `selector` intersect the viewport.
 * False until the first observation, so it matches the pre-rendered markup.
 */
export function useNoneInView(selector: string): boolean {
  const [noneInView, setNoneInView] = useState(false)

  useEffect(() => {
    const targets = document.querySelectorAll(selector)
    const visible = new Set<Element>()

    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) visible.add(entry.target)
        else visible.delete(entry.target)
      }
      setNoneInView(visible.size === 0)
    })
    targets.forEach((target) => observer.observe(target))
    return () => observer.disconnect()
  }, [selector])

  return noneInView
}
