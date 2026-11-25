import { menu, type MenuItem } from '../../config/menu.ts'
import { menuContent } from '../../config/content.ts'
import { cssVars } from '../../lib/cssVars.ts'
import { formatPrice } from '../../lib/format.ts'
import { externalLinkProps, productOrderLink } from '../../lib/links.ts'
import { ButtonLink } from '../ButtonLink/ButtonLink.tsx'
import { ProductImage } from '../ProductImage/ProductImage.tsx'
import styles from './ProductCard.module.css'

/** Covers the vertical card (grid cell) and the wide one (full row on tablets). */
const CARD_IMAGE_SIZES = '(min-width: 64em) 27vw, (min-width: 40em) 44vw, 84vw'

interface ProductCardProps {
  item: MenuItem
  /** Position in the menu, shown as an editorial index ("01"). */
  index: number
}

export function ProductCard({ item, index }: ProductCardProps) {
  const order = productOrderLink(item.name)
  const titleId = `produto-${item.id}`

  return (
    <article className={styles.card} aria-labelledby={titleId}>
      <div className={styles.layout}>
        <div className={styles.media}>
          <div className={styles.dome} aria-hidden="true" />
          <span className={styles.index} aria-hidden="true">
            {String(index + 1).padStart(2, '0')}
          </span>
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
      </div>
    </article>
  )
}
