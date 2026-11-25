import react from '@vitejs/plugin-react'
import { createHash } from 'node:crypto'
import { basename, relative } from 'node:path'
import { createServer, defineConfig, type Plugin } from 'vite'
import { heroImageSizes, heroPhoto, srcSet } from './src/config/images.ts'
import { siteConfig } from './src/config/site.ts'

const root = import.meta.dirname
const siteUrl = siteConfig.seo.siteUrl.replace(/\/$/, '')
const buildDate = new Date()

const escapeHtml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/**
 * Restaurant structured data, emitted only when real business details exist.
 * Nothing is generated from placeholders.
 */
function structuredData(): string {
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

/**
 * Injects brand, SEO and preload values from src/config into index.html.
 */
function siteMetaPlugin(): Plugin {
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
    STRUCTURED_DATA: structuredData(),
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

/**
 * Static pre-rendering: renders <App /> to HTML at build time and places it
 * in index.html, so content, headings and images arrive with the document
 * instead of after the JavaScript runs. main.tsx then hydrates it.
 */
function prerenderPlugin(): Plugin {
  return {
    name: 'prerender',
    apply: 'build',
    async transformIndexHtml(html, ctx) {
      if (ctx.path !== '/index.html') return html

      const server = await createServer({
        root,
        logLevel: 'error',
        appType: 'custom',
        server: { middlewareMode: true, hmr: false, ws: false },
      })
      try {
        const { render } = (await server.ssrLoadModule('/src/entry-server.tsx')) as { render: () => string }
        const placeholder = '<div id="root"></div>'
        if (!html.includes(placeholder)) throw new Error(`prerender: ${placeholder} not found in index.html`)
        return html.replace(placeholder, `<div id="root">${render()}</div>`)
      } finally {
        await server.close()
      }
    },
  }
}

/**
 * CSS Modules class names derived from the file path and the class name only,
 * so the pre-rendered markup and the client bundle always agree.
 */
function scopedName(local: string, filename: string): string {
  const file = relative(root, filename.split('?')[0]).replaceAll('\\', '/')
  const hash = createHash('sha256').update(`${file}:${local}`).digest('base64url').slice(0, 5)
  return `${basename(file).split('.')[0]}_${local}_${hash}`
}

export default defineConfig({
  plugins: [react(), siteMetaPlugin(), prerenderPlugin()],
  css: {
    modules: { generateScopedName: scopedName },
  },
  define: {
    __BUILD_YEAR__: JSON.stringify(buildDate.getFullYear()),
  },
})
