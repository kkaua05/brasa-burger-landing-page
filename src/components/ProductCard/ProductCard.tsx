import { menu, type MenuItem } from '../../config/menu.ts'
import { menuContent } from '../../config/content.ts'
import { cssVars } from '../../lib/cssVars.ts'
import { formatPrice } from '../../lib/format.ts'
import { externalLinkProps, productOrderLink } from '../../lib/links.ts'
import { ButtonLink } from '../ButtonLink/ButtonLink.tsx'
import { ProductImage } from '../ProductImage/ProductImage.tsx'
import styles from './ProductCard.module.css'

const CARD_IMAGE_SIZES = '(min-width: 64em) 27vw, (min-width: 40em) 44vw, 84vw'

export function ProductCard({ item }: { item: MenuItem }) {
  const order = productOrderLink(item.name)
  const titleId = `produto-${item.id}`

  return (
    <article className={styles.card} aria-labelledby={titleId}>
      <div className={styles.media}>
        <div className={styles.dome} aria-hidden="true" />
        <ProductImage
          photo={item.image.photo}
          alt={item.image.alt}
          sizes={CARD_IMAGE_SIZES}
          className={styles.image}
          style={cssVars({ '--rotate': `${item.image.rotate}deg` })}
        />
      </div>

      <div className={styles.body}>
        <h3 id={titleId} className={styles.name}>
          {item.name}
        </h3>
        <p className={styles.description}>{item.description}</p>
      </div>

      <div className={styles.footer}>
        {item.price === null ? (
          <p className={styles.priceNote}>{menuContent.priceOnRequest}</p>
        ) : (
          <p className={styles.price}>{formatPrice(item.price, menu.locale, menu.currency)}</p>
        )}
        <ButtonLink href={order.href} {...externalLinkProps(order)} aria-label={`Pedir ${item.name}`}>
          {menuContent.orderLabel}
        </ButtonLink>
      </div>
    </article>
  )
}
