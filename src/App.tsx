import { useState } from 'react'
import { BenefitsSection } from './components/BenefitsSection/BenefitsSection.tsx'
import { BrandSection } from './components/BrandSection/BrandSection.tsx'
import { CTASection } from './components/CTASection/CTASection.tsx'
import { Footer } from './components/Footer/Footer.tsx'
import { Header } from './components/Header/Header.tsx'
import { Hero } from './components/Hero/Hero.tsx'
import { MenuSection } from './components/MenuSection/MenuSection.tsx'

export function App() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <a className="skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>
      <Header menuOpen={menuOpen} onMenuOpenChange={setMenuOpen} />
      <main id="conteudo" tabIndex={-1} inert={menuOpen}>
        <Hero />
        <MenuSection />
        <BrandSection />
        <BenefitsSection />
        <CTASection />
      </main>
      <Footer inert={menuOpen} />
    </>
  )
}
