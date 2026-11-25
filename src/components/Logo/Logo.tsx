import { siteConfig } from '../../config/site.ts'
import { cx } from '../../lib/cx.ts'
import styles from './Logo.module.css'

/** Brand mark: a sesame top bun over the patty and the heel. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 40 40" aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M5.5 21C5.5 12.4 12 5.5 20 5.5S34.5 12.4 34.5 21Z
           M14.2 14.6a1.7 1 -25 1 0 3.1-1.5a1.7 1 -25 1 0-3.1 1.5Z
           M19.6 11.9a1.7 1 0 1 0 3.4 0a1.7 1 0 1 0-3.4 0Z
           M24.6 15.6a1.7 1 25 1 0 3.1 1.5a1.7 1 25 1 0-3.1-1.5Z"
      />
      <rect x="4.5" y="23.5" width="31" height="4.5" rx="2.25" fill="currentColor" />
      <path fill="currentColor" d="M7 30.5h26v.6c0 2.4-2 3.9-4.4 3.9H11.4C9 35 7 33.5 7 31.1Z" />
    </svg>
  )
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cx(styles.logo, className)}>
      <LogoMark className={styles.mark} />
      <span className={styles.wordmark}>{siteConfig.brand.name}</span>
    </span>
  )
}
