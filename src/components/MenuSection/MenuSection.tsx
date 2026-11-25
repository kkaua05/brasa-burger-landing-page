import { menuContent } from '../../config/content.ts'
import { menu } from '../../config/menu.ts'
import { cx } from '../../lib/cx.ts'
import { ProductCard } from '../ProductCard/ProductCard.tsx'
import styles from './MenuSection.module.css'

export function MenuSection() {
  return (
    <section id="cardapio" className={styles.section} aria-labelledby="cardapio-title">
      <div className="container">
        <header className={cx(styles.header, 'reveal')}>
          <h2 id="cardapio-title" className={styles.title}>
            {menuContent.title}
          </h2>
          <div className={styles.intro}>
            <p>{menuContent.intro}</p>
            {menu.isDemo && <p className={styles.notice}>{menuContent.demoNotice}</p>}
          </div>
        </header>

        <ul role="list" className={styles.grid}>
          {menu.items.map((item) => (
            <li key={item.id} className={cx(styles.item, 'reveal')}>
              <ProductCard item={item} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
