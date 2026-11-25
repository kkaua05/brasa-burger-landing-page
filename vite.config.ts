import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'
import { heroImageSizes, heroPhoto, srcSet } from './src/config/images.ts'
import { siteConfig } from './src/config/site.ts'

const escapeHtml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/**
 * Restaurant structured data, emitted only when real business details exist.
 * Nothing is generated from placeholders.
 */
function structuredData(siteUrl: string): string {
  const { brand, seo, contact } = siteConfig
  if (!contact.address && !contact.whatsapp) return ''

  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: brand.name,
    description: seo.description,
    servesCuisine: 'Hambúrguer',
  }
  if (siteUrl) {
    data.url = `${siteUrl}/`
    data.image = `${siteUrl}/og-image.jpg`
  }
  if (contact.address) data.address = contact.address
  if (contact.whatsapp) data.telephone = `+${contact.whatsapp.replace(/\D/g, '')}`
  if (contact.instagram) data.sameAs = [`https://www.instagram.com/${contact.instagram.replace(/^@/, '')}/`]

  const json = JSON.stringify(data).replace(/</g, '\\u003c')
  return `<script type="application/ld+json">${json}</script>`
}

/** Injects brand, SEO and preload values from src/config into index.html. */
function siteMetaPlugin(): Plugin {
  const siteUrl = siteConfig.seo.siteUrl.replace(/\/$/, '')
  const text: Record<string, string> = {
    BRAND_NAME: siteConfig.brand.name,
    SEO_TITLE: siteConfig.seo.title,
    SEO_DESCRIPTION: siteConfig.seo.description,
    SEO_LOCALE: siteConfig.seo.locale,
    OG_IMAGE: `${siteUrl}/og-image.jpg`,
    OG_URL: siteUrl ? `${siteUrl}/` : '/',
    HERO_IMAGE_SRCSET: srcSet(heroPhoto.src, 'avif'),
    HERO_IMAGE_SIZES: heroImageSizes,
  }
  const markup: Record<string, string> = {
    CANONICAL: siteUrl ? `<link rel="canonical" href="${escapeHtml(siteUrl)}/" />` : '',
    STRUCTURED_DATA: structuredData(siteUrl),
  }

  return {
    name: 'site-meta',
    transformIndexHtml: {
      order: 'pre',
      handler: (html) =>
        html.replace(/\{\{(\w+)\}\}/g, (match, key: string) => {
          if (key in markup) return markup[key]
          if (key in text) return escapeHtml(text[key])
          return match
        }),
    },
  }
}

export default defineConfig({
  plugins: [react(), siteMetaPlugin()],
})
