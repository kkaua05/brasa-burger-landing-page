import { brandContent } from '../../config/content.ts'
import { photos } from '../../config/images.ts'
import { cx } from '../../lib/cx.ts'
import { ProductImage } from '../ProductImage/ProductImage.tsx'
import styles from './BrandSection.module.css'

export function BrandSection() {
  const { title, paragraphs, quote, imageAlt } = brandContent

  return (
    <section id="sobre" className={styles.section} aria-labelledby="sobre-title">
      <div className={cx('container', styles.layout)}>
        <h2 id="sobre-title" className={cx(styles.title, 'reveal')}>
          {title}
        </h2>

        <figure className={cx(styles.figure, 'reveal')}>
          <div className={styles.frame}>
            <ProductImage
              photo={photos.duplo}
              alt={imageAlt}
              sizes="(min-width: 64em) 70vw, 160vw"
              className={styles.image}
            />
          </div>
        </figure>

        <div className={cx(styles.text, 'reveal')}>
          {paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <p className={styles.statement}>{quote}</p>
        </div>
      </div>
    </section>
  )
}
