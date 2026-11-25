const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Scrolls to an in-page anchor and moves keyboard focus to it, so screen
 * reader and keyboard users land where sighted users do.
 */
export function scrollToHash(hash: string) {
  const target = document.getElementById(hash.replace('#', ''))
  if (!target) return
  target.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' })
  if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1')
  target.focus({ preventScroll: true })
  history.pushState(null, '', hash)
}
