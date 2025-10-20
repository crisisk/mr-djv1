import type { ChangeEvent } from 'react'
import { useTranslation } from 'react-i18next'

const LANGUAGES: Array<{ code: string; labelKey: string }> = [
  { code: 'en', labelKey: 'language.options.en' },
  { code: 'nl', labelKey: 'language.options.nl' },
]

const LanguageSwitcher = () => {
  const { t, i18n } = useTranslation()

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const language = event.target.value
    void i18n.changeLanguage(language)
  }

  return (
    <div className="language-switcher" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
      <label htmlFor="language-select" className="language-switcher__label">
        {t('language.label')}
      </label>
      <select
        id="language-select"
        className="language-switcher__select"
        value={i18n.resolvedLanguage}
        onChange={handleChange}
      >
        {LANGUAGES.map(({ code, labelKey }) => (
          <option key={code} value={code}>
            {t(labelKey)}
          </option>
        ))}
      </select>
    </div>
  )
}

export default LanguageSwitcher
