import { benefitsContent } from '../../config/content.ts'
import { cx } from '../../lib/cx.ts'
import { Icon } from '../Icon/Icon.tsx'
import styles from './BenefitsSection.module.css'

export function BenefitsSection() {
  return (
    <section className={styles.section} aria-labelledby="diferenciais-title">
      <div className="container">
        <h2 id="diferenciais-title" className={cx(styles.title, 'reveal')}>
          {benefitsContent.title}
        </h2>

        <ul role="list" className={styles.list}>
          {benefitsContent.items.map((item) => (
            <li key={item.title} className={cx(styles.item, 'reveal')}>
              <span className={styles.badge}>
                <Icon name={item.icon} size={26} />
              </span>
              <h3 className={styles.itemTitle}>{item.title}</h3>
              <p className={styles.itemText}>{item.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
