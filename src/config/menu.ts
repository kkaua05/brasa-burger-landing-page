/**
 * Cardápio em destaque — DADOS DEMONSTRATIVOS.
 *
 * Nomes e descrições são exemplos para visualizar o layout, escritos a partir
 * do que cada foto mostra. Substitua pelos itens reais e depois mude `isDemo`
 * para false (isso remove o aviso de cardápio demonstrativo da seção).
 *
 * `price: null` exibe "Preço sob consulta". Para mostrar um valor, informe o
 * número em reais, ex.: 34.9.
 *
 * Fotos: config/images.ts. Para uma foto nova, gere o recorte e as variantes
 * com os scripts descritos no README e registre-a em `photos`.
 */

import { photos, type ProductPhoto } from './images.ts'

export interface MenuItem {
  id: string
  name: string
  description: string
  price: number | null
  image: {
    photo: ProductPhoto
    alt: string
    /** Inclinação em graus, para dar movimento ao conjunto de cards. */
    rotate: number
  }
}

export const menu = {
  isDemo: true,
  currency: 'BRL',
  locale: 'pt-BR',
  items: [
    {
      id: 'classico',
      name: 'Clássico da Casa',
      description: 'Pão com gergelim, carne grelhada, cheddar, alface, tomate, picles e maionese.',
      price: null,
      image: {
        photo: photos.classico,
        alt: 'Hambúrguer clássico com pão de gergelim, carne grelhada, cheddar, alface, tomate e picles',
        rotate: -4,
      },
    },
    {
      id: 'duplo',
      name: 'Duplo na Brasa',
      description: 'Duas carnes grelhadas e cheddar em dobro, derretendo no pão com gergelim.',
      price: null,
      image: {
        photo: photos.duplo,
        alt: 'Hambúrguer duplo com cheddar derretido escorrendo pelas duas carnes',
        rotate: 3,
      },
    },
    {
      id: 'torre',
      name: 'Torre Brasa',
      description: 'Duas carnes, cheddar, cebola roxa e branca, picles, tomate e alface.',
      price: null,
      image: {
        photo: photos.torre,
        alt: 'Hambúrguer alto com duas carnes, cheddar, cebolas, picles, tomate e alface',
        rotate: -2,
      },
    },
  ] satisfies MenuItem[],
}
