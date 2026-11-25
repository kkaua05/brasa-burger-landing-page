import { useEffect, useRef, type MouseEvent, type RefObject } from 'react'
import { useDialogBehavior } from '../../hooks/useDialogBehavior.ts'
import { cx } from '../../lib/cx.ts'
import { externalLinkProps, orderLink } from '../../lib/links.ts'
import { scrollToHash } from '../../lib/scroll.ts'
import { ButtonLink } from '../ButtonLink/ButtonLink.tsx'
import { Icon } from '../Icon/Icon.tsx'
import { Logo } from '../Logo/Logo.tsx'
import { Navigation } from '../Navigation/Navigation.tsx'
import styles from './MobileMenu.module.css'

interface MobileMenuProps {
  id: string
  open: boolean
  onClose: () => void
  returnFocusTo: RefObject<HTMLElement | null>
}

const DESKTOP_QUERY = '(min-width: 64em)'

export function MobileMenu({ id, open, onClose, returnFocusTo }: MobileMenuProps) {
  const panel = useRef<HTMLDivElement>(null)
  const order = orderLink()
  useDialogBehavior(panel, open, onClose, returnFocusTo)

  useEffect(() => {
    if (!open) return
    const desktop = window.matchMedia(DESKTOP_QUERY)
    const closeOnDesktop = () => desktop.matches && onClose()
    desktop.addEventListener('change', closeOnDesktop)
    return () => desktop.removeEventListener('change', closeOnDesktop)
  }, [open, onClose])

  const navigate = (href: string) => {
    onClose()
    requestAnimationFrame(() => scrollToHash(href))
  }

  const handleOrderClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (order.external) {
      onClose()
      return
    }
    event.preventDefault()
    navigate(order.href)
  }

  return (
    <div
      ref={panel}
      id={id}
      className={styles.menu}
      data-open={open || undefined}
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
    >
      <div className={cx('container', styles.top)}>
        <Logo />
        <button type="button" className={styles.close} onClick={onClose}>
          <Icon name="close" />
          <span className="visually-hidden">Fechar menu</span>
        </button>
      </div>

      <nav className="container" aria-label="Principal">
        <Navigation className={styles.list} linkClassName={styles.link} onNavigate={navigate} />
      </nav>

      <div className={cx('container', styles.footer)}>
        <ButtonLink
          href={order.href}
          {...externalLinkProps(order)}
          size="lg"
          className={styles.order}
          onClick={handleOrderClick}
        >
          Faça seu pedido
        </ButtonLink>
      </div>
    </div>
  )
}
