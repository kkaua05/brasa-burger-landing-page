import type { CSSProperties } from 'react'

/** Typed escape hatch for CSS custom properties in inline styles. */
export const cssVars = (vars: Record<`--${string}`, string | number>) => vars as CSSProperties
