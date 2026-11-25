import { marqueeContent } from '../../config/content.ts'
import { Icon } from '../Icon/Icon.tsx'
import styles from './Marquee.module.css'

/** Copies of the list in the track; the scroll animation shifts it by one copy. */
const COPIES = 4

/**
 * Tilted band of ingredients between the Hero and the menu. It slides with the
 * page scroll (scroll-driven, no JavaScript), so it never moves on its own.
 * Decorative: the same words are in the Hero description.
 */
export function Marquee() {
  return (
    <div className={styles.marquee} aria-hidden="true">
      <div className={styles.band}>
        <div className={styles.track}>
          {Array.from({ length: COPIES }, (_, copy) => (
            <div key={copy} className={styles.group}>
              {marqueeContent.items.map((item) => (
                <span key={item} className={styles.item}>
                  {item}
                  <Icon name="dome" className={styles.separator} />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
