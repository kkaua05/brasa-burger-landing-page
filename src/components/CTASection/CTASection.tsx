import { ctaContent } from '../../config/content.ts'
import { photos } from '../../config/images.ts'
import { cx } from '../../lib/cx.ts'
import { externalLinkProps, orderLink } from '../../lib/links.ts'
import { ButtonLink } from '../ButtonLink/ButtonLink.tsx'
import { ProductImage } from '../ProductImage/ProductImage.tsx'
import styles from './CTASection.module.css'

export function CTASection() {
  const order = orderLink()

  return (
    <section id="pedido" className={styles.section} aria-labelledby="pedido-title" data-hides-order-dock>
      <div className="container">
        <div className={cx(styles.panel, 'reveal')}>
          <div className={styles.visual}>
            {/* The classic from the menu, used here as decoration. */}
            <ProductImage photo={photos.classico} alt="" sizes="(min-width: 64em) 40vw, 90vw" className={styles.burger} />
          </div>

          <div className={styles.copy}>
            <h2 id="pedido-title" className={styles.title}>
              {ctaContent.title}
            </h2>
            <p className={styles.description}>{ctaContent.description}</p>
            <ButtonLink href={order.href} {...externalLinkProps(order)} size="lg" className={styles.action}>
              {ctaContent.actionLabel}
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  )
}
