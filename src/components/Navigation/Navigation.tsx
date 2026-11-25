import type { MouseEvent } from 'react'
import { navigation } from '../../config/content.ts'
import { cssVars } from '../../lib/cssVars.ts'

interface NavigationProps {
  className?: string
  linkClassName?: string
  activeId?: string | null
  /** When given, links are handled in JS (used by the mobile menu to close before scrolling). */
  onNavigate?: (href: string) => void
}

export function Navigation({ className, linkClassName, activeId, onNavigate }: NavigationProps) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!onNavigate) return
    event.preventDefault()
    onNavigate(href)
  }

  return (
    <ul role="list" className={className}>
      {navigation.map((item, index) => (
        <li key={item.href} style={cssVars({ '--i': index })}>
          <a
            href={item.href}
            className={linkClassName}
            aria-current={activeId === item.href.slice(1) ? 'location' : undefined}
            onClick={(event) => handleClick(event, item.href)}
          >
            {item.label}
          </a>
        </li>
      ))}
    </ul>
  )
}
