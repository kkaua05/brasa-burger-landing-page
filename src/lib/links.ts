import { siteConfig } from '../config/site.ts'

const { order, contact } = siteConfig

/** Fallback when no order channel is configured: the contact area in the footer. */
const CONTACT_ANCHOR = '#contato'

const digitsOnly = (value: string) => value.replace(/\D/g, '')

export function whatsappUrl(message: string): string | null {
  const number = digitsOnly(contact.whatsapp)
  return number ? `https://wa.me/${number}?text=${encodeURIComponent(message)}` : null
}

export function instagramUrl(): string | null {
  const handle = contact.instagram.replace(/^@/, '').trim()
  return handle ? `https://www.instagram.com/${handle}/` : null
}

export interface ResolvedLink {
  href: string
  external: boolean
}

/** Destination of every order button: custom URL, then WhatsApp, then the contact area. */
export function orderLink(message: string = order.defaultMessage): ResolvedLink {
  const href = order.url || whatsappUrl(message)
  return href ? { href, external: true } : { href: CONTACT_ANCHOR, external: false }
}

export function productOrderLink(productName: string): ResolvedLink {
  return orderLink(order.productMessage.replace('{produto}', productName))
}

export function externalLinkProps(link: ResolvedLink) {
  return link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {}
}
