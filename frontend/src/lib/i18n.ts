import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import enCommon from '../locales/en/common.json'
import nlCommon from '../locales/nl/common.json'

type DefaultNamespace = 'common'

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: DefaultNamespace
  }
}

export const defaultNS: DefaultNamespace = 'common'

export const resources = {
  en: {
    [defaultNS]: enCommon,
  },
  nl: {
    [defaultNS]: nlCommon,
  },
} as const

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  fallbackLng: 'en',
  defaultNS,
  interpolation: {
    escapeValue: false,
  },
})

export default i18n
