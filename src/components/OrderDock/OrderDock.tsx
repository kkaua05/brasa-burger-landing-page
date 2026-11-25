import { orderDockContent } from '../../config/content.ts'
import { useNoneInView } from '../../hooks/useNoneInView.ts'
import { externalLinkProps, orderLink } from '../../lib/links.ts'
import { ButtonLink } from '../ButtonLink/ButtonLink.tsx'
import { LogoMark } from '../Logo/Logo.tsx'
import styles from './OrderDock.module.css'

/** Elements with this attribute already offer an order action: the dock hides while any is on screen. */
export const HIDES_ORDER_DOCK = '[data-hides-order-dock]'

/**
 * Floating order bar for phones, where the header has no order button.
 * It keeps an order action in reach from the first screen to the end of the
 * page, stepping aside while the Hero buttons, the order section or the
 * footer are visible. Hidden from 40em up via CSS.
 */
export function OrderDock({ suspended = false }: { suspended?: boolean }) {
  const visible = useNoneInView(HIDES_ORDER_DOCK) && !suspended
  const order = orderLink()

  return (
    <div className={styles.dock} data-visible={visible || undefined} inert={!visible}>
      <div className={styles.inner}>
        <p className={styles.prompt}>
          <LogoMark className={styles.mark} />
          {orderDockContent.prompt}
        </p>
        <ButtonLink href={order.href} {...externalLinkProps(order)} className={styles.action}>
          {orderDockContent.actionLabel}
        </ButtonLink>
      </div>
    </div>
  )
}
