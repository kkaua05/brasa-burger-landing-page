/**
 * Textos das seções. Edite aqui sem tocar nos componentes.
 *
 * Os diferenciais são compromissos de marca escritos como exemplo: revise
 * para que reflitam apenas o que a operação realmente pratica.
 */

import { siteConfig } from './site.ts'

const { name } = siteConfig.brand

export const navigation = [
  { label: 'Início', href: '#inicio' },
  { label: 'Cardápio', href: '#cardapio' },
  { label: 'Sobre', href: '#sobre' },
  { label: 'Contato', href: '#contato' },
] as const

export const sectionIds = navigation.map((item) => item.href.slice(1))

export const heroContent = {
  identifier: siteConfig.brand.descriptor,
  titleLines: ['Morda', 'sem', 'pressa.'],
  description:
    'Pão com gergelim, carne grelhada, queijo derretido e vegetais frescos, ' +
    'empilhados camada por camada. Cada mordida merece o seu tempo.',
  primaryAction: { label: 'Ver cardápio', href: '#cardapio' },
  secondaryAction: { label: 'Conhecer a marca', href: '#sobre' },
  burgerAlt:
    'Hambúrguer artesanal com pão de gergelim, duas carnes grelhadas, cheddar derretido, ' +
    'cebola roxa, cebola branca, picles, tomate e alface, com ingredientes suspensos no ar',
  /**
   * Camadas apontadas na foto da Hero (config/images.ts → heroPhoto).
   * `x` e `y` são a posição do ponto sobre a imagem, em % da largura e da altura.
   * Ao trocar a foto, reposicione os pontos.
   */
  anatomy: [
    { label: 'Pão com gergelim', x: 74, y: 15 },
    { label: 'Cheddar derretido', x: 78, y: 33 },
    { label: 'Cebola roxa e picles', x: 70, y: 44 },
    { label: 'Duas carnes grelhadas', x: 78, y: 62 },
    { label: 'Alface e tomate', x: 86, y: 78 },
  ],
}

/** Faixa entre a Hero e o cardápio: desliza com a rolagem da página. */
export const marqueeContent = {
  items: ['Pão com gergelim', 'Carne grelhada', 'Queijo derretido', 'Vegetais frescos', 'Camada por camada'],
}

export const menuContent = {
  title: 'Feito para quem ama hambúrguer.',
  intro: 'Uma seleção curta, pensada para ser bem feita. Escolha o seu e peça em um toque.',
  demoNotice: 'Cardápio demonstrativo: itens, descrições e preços em atualização.',
  priceOnRequest: 'Preço sob consulta',
  orderLabel: 'Pedir',
}

export const brandContent = {
  title: 'O básico, levado a sério.',
  paragraphs: [
    `A ${name} parte de uma ideia simples: hambúrguer bom começa no básico bem feito. ` +
      'Pão macio, carne no ponto, queijo que derrete de verdade e vegetais frescos.',
    'Nada de excesso. Só o que faz diferença na mordida, montado com atenção em cada etapa.',
  ],
  quote: 'Camada por camada, do jeito que tem que ser.',
  imageAlt: 'Close de duas carnes grelhadas com cheddar derretido escorrendo pelo pão',
}

export type BenefitIcon = 'leaf' | 'flame' | 'spatula' | 'bell'

export const benefitsContent = {
  title: 'Do que não abrimos mão.',
  items: [
    {
      icon: 'leaf',
      title: 'Ingredientes selecionados',
      text: 'Cada ingrediente é escolhido pelo sabor e pelo frescor que leva ao hambúrguer.',
    },
    {
      icon: 'flame',
      title: 'Preparo cuidadoso',
      text: 'Carne grelhada no ponto e montagem feita com atenção, pedido por pedido.',
    },
    {
      icon: 'spatula',
      title: 'Hambúrguer artesanal',
      text: 'Feito à mão, do jeito da casa, com o cuidado de quem gosta do que faz.',
    },
    {
      icon: 'bell',
      title: 'Atendimento de qualidade',
      text: 'Atenção do primeiro contato até a última mordida.',
    },
  ] satisfies { icon: BenefitIcon; title: string; text: string }[],
}

export const ctaContent = {
  title: 'Seu próximo hambúrguer favorito está aqui.',
  description: 'Escolha, peça e prepare as mãos. O resto é com a gente.',
  actionLabel: 'Quero pedir agora',
}

export const footerContent = {
  tagline: 'Hambúrguer artesanal, camada por camada.',
  contactFallback: 'Canais de atendimento em breve.',
  imageNotice: 'Imagens meramente ilustrativas.',
}
