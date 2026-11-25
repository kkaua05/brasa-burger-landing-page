/**
 * Configuração da marca: fonte única de verdade.
 *
 * Nome, SEO, canais de contato e destino dos pedidos ficam aqui. A interface
 * e as meta tags do index.html (via vite.config.ts) leem deste arquivo.
 *
 * Campos comerciais vêm vazios de propósito: preencha com dados reais antes
 * de publicar. Campos vazios não aparecem na página e nada é inventado.
 */

const brandName = 'Brasa Burger'

export const siteConfig = {
  brand: {
    /** Nome da marca: troque aqui e ele muda em toda a página e no <head>. */
    name: brandName,
    descriptor: 'Hamburgueria artesanal',
  },

  seo: {
    title: `${brandName} | Hamburgueria artesanal`,
    description:
      'Hambúrguer artesanal com pão de gergelim, carne grelhada, queijo e vegetais frescos. ' +
      `Conheça o cardápio da ${brandName} e faça seu pedido.`,
    /** URL absoluta de produção, ex.: "https://brasaburger.com.br". Usada no Open Graph e no canonical. */
    siteUrl: '',
    locale: 'pt_BR',
  },

  order: {
    /**
     * Link externo de pedidos (iFood, cardápio digital, etc.).
     * Tem prioridade sobre o WhatsApp. Vazio = usa o WhatsApp.
     */
    url: '',
    /** Mensagem inicial dos botões gerais de pedido. */
    defaultMessage: `Olá! Quero fazer um pedido na ${brandName}.`,
    /** Mensagem dos cards. {produto} é substituído pelo nome do item. */
    productMessage: 'Olá! Quero pedir o {produto}.',
  },

  contact: {
    /** Somente números com DDI e DDD, ex.: "5511999999999". */
    whatsapp: '',
    /** Usuário sem @, ex.: "brasaburger". */
    instagram: '',
    /** Endereço completo em uma linha. */
    address: '',
    /** Uma linha por faixa de horário, ex.: "Ter a dom, 18h às 23h". */
    hours: [] as string[],
  },

  /** Estúdio que desenhou e desenvolveu o site: selo no fim do rodapé. */
  credit: {
    name: 'ZYNK',
    descriptor: 'Soluções Digitais',
    handle: '@zynk.solutions',
    url: 'https://www.instagram.com/zynk.solutions/',
    logo: { src: '/images/zynk-logo-96.webp', src2x: '/images/zynk-logo-192.webp' },
  },
}

export type SiteConfig = typeof siteConfig
