import type { AnchorHTMLAttributes } from 'react'
import { cx } from '../../lib/cx.ts'
import styles from './ButtonLink.module.css'

interface ButtonLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: 'primary' | 'secondary' | 'inverse'
  size?: 'md' | 'lg'
  children: string
}

export function ButtonLink({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...anchorProps
}: ButtonLinkProps) {
  return (
    <a className={cx(styles.button, styles[variant], styles[size], className)} {...anchorProps}>
      <span className={styles.window}>
        <span className={styles.label} data-label={children}>
          {children}
        </span>
      </span>
    </a>
  )
}
