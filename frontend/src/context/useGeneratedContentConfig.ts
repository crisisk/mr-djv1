import { useContext } from 'react'

import { GeneratedContentConfigContext } from './GeneratedContentConfigContext'

export function useGeneratedContentConfig() {
  return useContext(GeneratedContentConfigContext)
}
