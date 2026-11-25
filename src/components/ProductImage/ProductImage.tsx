import type { CSSProperties } from 'react'
import { fallbackWidth, srcSet, type ProductPhoto } from '../../config/images.ts'

interface ProductImageProps {
  photo: ProductPhoto
  alt: string
  /** Matches the `sizes` attribute: how wide the image renders at each breakpoint. */
  sizes: string
  /** Above-the-fold image: loads eagerly with high priority. */
  priority?: boolean
  className?: string
  style?: CSSProperties
}

export function ProductImage({ photo, alt, sizes, priority = false, className, style }: ProductImageProps) {
  return (
    <picture>
      <source type="image/avif" srcSet={srcSet(photo.src, 'avif')} sizes={sizes} />
      <source type="image/webp" srcSet={srcSet(photo.src, 'webp')} sizes={sizes} />
      <img
        src={`${photo.src}-${fallbackWidth}.png`}
        alt={alt}
        width={photo.width}
        height={photo.height}
        className={className}
        style={style}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        decoding={priority ? 'sync' : 'async'}
        draggable={false}
      />
    </picture>
  )
}
