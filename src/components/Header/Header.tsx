import { useCallback, useRef } from 'react'
import { sectionIds } from '../../config/content.ts'
import { siteConfig } from '../../config/site.ts'
import { useActiveSection } from '../../hooks/useActiveSection.ts'
import { useScrolled } from '../../hooks/useScrolled.ts'
import { cx } from '../../lib/cx.ts'
import { externalLinkProps, orderLink } from '../../lib/links.ts'
import { ButtonLink } from '../ButtonLink/ButtonLink.tsx'
import { Icon } from '../Icon/Icon.tsx'
import { Logo } from '../Logo/Logo.tsx'
import { MobileMenu } from '../MobileMenu/MobileMenu.tsx'
import { Navigation } from '../Navigation/Navigation.tsx'
import styles from './Header.module.css'

interface HeaderProps {
  menuOpen: boolean
  onMenuOpenChange: (open: boolean) => void
}

export function Header({ menuOpen, onMenuOpenChange }: HeaderProps) {
  const scrolled = useScrolled()
  const activeId = useActiveSection(sectionIds)
  const menuButton = useRef<HTMLButtonElement>(null)
  const order = orderLink()
  const closeMenu = useCallback(() => onMenuOpenChange(false), [onMenuOpenChange])

  return (
    <>
      <header className={styles.header} data-scrolled={scrolled || undefined} inert={menuOpen}>
        <div className={cx('container', styles.inner)}>
          <a href="#inicio" className={styles.brand} aria-label={`${siteConfig.brand.name}, voltar ao início`}>
            <Logo />
          </a>

          <nav className={styles.nav} aria-label="Principal">
            <Navigation className={styles.navList} linkClassName={styles.navLink} activeId={activeId} />
          </nav>

          <ButtonLink href={order.href} {...externalLinkProps(order)} className={styles.cta}>
            Faça seu pedido
          </ButtonLink>

          <button
            ref={menuButton}
            type="button"
            className={styles.menuButton}
            aria-expanded={menuOpen}
            aria-controls="menu-mobile"
            onClick={() => onMenuOpenChange(true)}
          >
            <Icon name="menu" />
            <span className="visually-hidden">Abrir menu</span>
          </button>
        </div>
      </header>

      <MobileMenu id="menu-mobile" open={menuOpen} onClose={closeMenu} returnFocusTo={menuButton} />
    </>
  )
}
