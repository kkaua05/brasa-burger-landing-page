import { useEffect, useState } from 'react'

/** Fraction of the viewport height a section's top must pass to become active. */
const ACTIVATION_LINE = 0.45

/**
 * Id of the last section whose top has crossed the activation line, or the
 * last id once the page is scrolled to the end (a short final section may
 * never reach the line on tall screens).
 *
 * Derived from positions on every frame that scrolls, so it is always
 * correct after jumps, resizes and on any viewport height. Sections between
 * tracked ids keep the previous one active.
 */
export function useActiveSection(ids: readonly string[]): string | null {
  const [active, setActive] = useState<string | null>(null)
  const key = ids.join('|')

  useEffect(() => {
    const tracked = key.split('|')
    let frame = 0

    const update = () => {
      frame = 0
      const root = document.documentElement
      const atEnd = window.scrollY + window.innerHeight >= root.scrollHeight - 2
      const line = window.innerHeight * ACTIVATION_LINE
      let current: string | null = null

      for (const id of tracked) {
        const section = document.getElementById(id)
        if (!section) continue
        if (atEnd || section.getBoundingClientRect().top <= line) current = id
      }
      setActive(current)
    }

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      cancelAnimationFrame(frame)
    }
  }, [key])

  return active
}
