import { useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import LanguageSwitcher from './components/LanguageSwitcher'
import BookingSummary from './components/BookingSummary'
import HeroSection from '../../HeroSection.jsx'
import Testimonials from '../../Testimonials.jsx'

type HeroContent = {
  title: string
  subtitle: string
  ctaPrimaryText: string
  ctaSecondaryText?: string
}

function App() {
  const { t } = useTranslation()
  const [count, setCount] = useState(0)

  const heroContent = t('hero', { returnObjects: true }) as HeroContent

  return (
    <div className="App">
      <header className="app-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <a href="https://vite.dev" target="_blank" rel="noreferrer">
            <img src={viteLogo} className="logo" alt={t('app.viteLogoAlt')} />
          </a>
          <a href="https://react.dev" target="_blank" rel="noreferrer">
            <img src={reactLogo} className="logo react" alt={t('app.reactLogoAlt')} />
          </a>
        </div>
        <LanguageSwitcher />
      </header>

      <main>
        <h1>{t('app.title')}</h1>
        <div className="card">
          <button onClick={() => setCount((currentCount) => currentCount + 1)}>
            {t('app.counterLabel', { count })}
          </button>
          <p>
            <Trans i18nKey="app.editPrompt" components={{ code: <code /> }} />
          </p>
        </div>
        <p className="read-the-docs">{t('app.docsPrompt')}</p>

        <HeroSection
          title={heroContent.title}
          subtitle={heroContent.subtitle}
          ctaPrimaryText={heroContent.ctaPrimaryText}
          ctaSecondaryText={heroContent.ctaSecondaryText}
        />

        <Testimonials />

        <BookingSummary />
      </main>
    </div>
  )
}

export default App
