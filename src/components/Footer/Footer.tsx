import { useSyncExternalStore } from 'react'
import { footerContent } from '../../config/content.ts'
import { siteConfig } from '../../config/site.ts'
import { useFitText } from '../../hooks/useFitText.ts'
import { cx } from '../../lib/cx.ts'
import { instagramUrl, whatsappUrl } from '../../lib/links.ts'
import { Icon, type IconName } from '../Icon/Icon.tsx'
import { Logo } from '../Logo/Logo.tsx'
import { Navigation } from '../Navigation/Navigation.tsx'
import styles from './Footer.module.css'

const noSubscription = () => () => {}

/**
 * Hydrates with the build year (identical in the pre-rendered HTML and on the
 * client), then switches to the visitor's current year if it differs.
 */
const useCurrentYear = () =>
  useSyncExternalStore(
    noSubscription,
    () => new Date().getFullYear(),
    () => __BUILD_YEAR__,
  )

interface ContactItem {
  icon: IconName
  label: string
  href?: string
}

function contactItems(): ContactItem[] {
  const { contact, order } = siteConfig
  const items: ContactItem[] = []
  const whatsapp = whatsappUrl(order.defaultMessage)
  const instagram = instagramUrl()

  if (whatsapp) items.push({ icon: 'whatsapp', label: 'WhatsApp', href: whatsapp })
  if (instagram) items.push({ icon: 'instagram', label: `@${contact.instagram.replace(/^@/, '')}`, href: instagram })
  if (contact.address) {
    items.push({
      icon: 'pin',
      label: contact.address,
      href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contact.address)}`,
    })
  }
  return items
}

export function Footer({ inert }: { inert?: boolean }) {
  const { brand, contact, credit } = siteConfig
  const contacts = contactItems()
  const wordmark = useFitText<HTMLSpanElement>()
  const year = useCurrentYear()

  return (
    <footer id="contato" className={styles.footer} inert={inert}>
      <div className={cx('container', styles.top)}>
        <div className={styles.brand}>
          <a href="#inicio" className={styles.logoLink} aria-label={`${brand.name}, voltar ao início`}>
            <Logo />
          </a>
          <p className={styles.tagline}>{footerContent.tagline}</p>
        </div>

        <nav className={styles.column} aria-labelledby="rodape-navegacao">
          <h2 id="rodape-navegacao" className={styles.columnTitle}>
            Navegação
          </h2>
          <Navigation className={styles.list} linkClassName={styles.link} />
        </nav>

        <div className={styles.column}>
          <h2 className={styles.columnTitle}>Contato</h2>
          {contacts.length > 0 ? (
            <ul role="list" className={styles.list}>
              {contacts.map((item) => (
                <li key={item.icon}>
                  <a className={styles.contact} href={item.href} target="_blank" rel="noopener noreferrer">
                    <Icon name={item.icon} size={20} />
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.muted}>{footerContent.contactFallback}</p>
          )}
        </div>

        {contact.hours.length > 0 && (
          <div className={styles.column}>
            <h2 className={styles.columnTitle}>Horários</h2>
            <ul role="list" className={styles.list}>
              {contact.hours.map((line) => (
                <li key={line} className={styles.contact}>
                  <Icon name="clock" size={20} />
                  {line}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Brand signature: the full name, fitted edge to edge of the content. */}
      <div className={cx('container', styles.signature)} aria-hidden="true">
        <span ref={wordmark} className={styles.wordmark}>
          {brand.name}
        </span>
      </div>

      <div className={cx('container', styles.bottom)}>
        <div className={styles.legal}>
          <p>
            © {year} {brand.name}. Todos os direitos reservados.
          </p>
          <p>{footerContent.imageNotice}</p>
        </div>

        <div className={styles.credit}>
          <span className={styles.creditLabel}>Design e desenvolvimento</span>
          <a
            className={styles.studio}
            href={credit.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Design e desenvolvimento por ${credit.name} ${credit.descriptor}, ${credit.handle} no Instagram (abre em nova aba)`}
          >
            <img
              className={styles.studioLogo}
              src={credit.logo.src}
              srcSet={`${credit.logo.src} 1x, ${credit.logo.src2x} 2x`}
              alt=""
              width={36}
              height={36}
              loading="lazy"
              decoding="async"
            />
            <span className={styles.studioText}>
              <span className={styles.studioName}>{credit.name}</span>
              <span className={styles.studioDescriptor}>{credit.descriptor}</span>
            </span>
            <span className={styles.studioHandle}>{credit.handle}</span>
            <Icon name="arrowUpRight" size={18} className={styles.studioArrow} />
          </a>
        </div>
      </div>
    </footer>
  )
}
