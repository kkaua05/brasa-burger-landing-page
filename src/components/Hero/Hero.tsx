import { heroContent } from '../../config/content.ts'
import { heroImageSizes, heroPhoto } from '../../config/images.ts'
import { cssVars } from '../../lib/cssVars.ts'
import { cx } from '../../lib/cx.ts'
import { ButtonLink } from '../ButtonLink/ButtonLink.tsx'
import { Icon } from '../Icon/Icon.tsx'
import { ProductImage } from '../ProductImage/ProductImage.tsx'
import styles from './Hero.module.css'

/** Accented capitals need extra room above, cedillas below. */
const ACCENT_ABOVE = /[ÁÀÂÃÉÊÍÓÔÕÚ]/i
const ACCENT_BELOW = /ç/i

export function Hero() {
  const { identifier, titleLines, description, primaryAction, secondaryAction, burgerAlt, anatomy } =
    heroContent

  return (
    <section id="inicio" className={styles.hero} aria-labelledby="hero-title">
      <div className={cx('container', styles.layout)}>
        <div className={styles.copy}>
          <p className={styles.identifier}>
            <Icon name="dome" size={18} />
            {identifier}
          </p>

          <h1 id="hero-title" className={styles.title}>
            {titleLines.map((line, index) => (
              /* The leading space keeps "Morda sem pressa." readable as text. */
              <span
                key={index}
                className={styles.line}
                data-accent-above={ACCENT_ABOVE.test(line) || undefined}
                data-accent-below={ACCENT_BELOW.test(line) || undefined}
              >
                <span className={styles.lineText} style={cssVars({ '--i': index })}>
                  {index > 0 && ' '}
                  {line}
                </span>
              </span>
            ))}
          </h1>

          <p className={styles.description}>{description}</p>

          <div className={styles.actions} data-hides-order-dock>
            <ButtonLink href={primaryAction.href} size="lg">
              {primaryAction.label}
            </ButtonLink>
            <ButtonLink href={secondaryAction.href} variant="secondary" size="lg">
              {secondaryAction.label}
            </ButtonLink>
          </div>
        </div>

        <div className={styles.stage}>
          <div
            className={styles.visual}
            style={cssVars({ '--ratio': `${heroPhoto.width} / ${heroPhoto.height}` })}
          >
            <div className={styles.glow} aria-hidden="true" />
            <div className={styles.shadow} aria-hidden="true" />
            <div className={styles.drift}>
              <div className={styles.entrance}>
                <div className={styles.float}>
                  <ProductImage
                    photo={heroPhoto}
                    alt={burgerAlt}
                    sizes={heroImageSizes}
                    priority
                    className={styles.burger}
                  />
                </div>
              </div>
            </div>
          </div>

          <ul role="list" className={styles.anatomy} aria-label="Camadas do hambúrguer">
            {anatomy.map((layer, index) => (
              <li
                key={layer.label}
                className={styles.layer}
                style={cssVars({ '--x': `${layer.x}%`, '--y': `${layer.y}%`, '--i': index })}
              >
                <span className={styles.dot} aria-hidden="true" />
                <span className={styles.leader} aria-hidden="true" />
                <span className={styles.layerLabel}>{layer.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
