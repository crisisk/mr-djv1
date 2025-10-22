import { GeneratedContentConfigContext } from './GeneratedContentConfigContext'
import type { GeneratedContentProviderProps } from './generatedContentTypes'

export function GeneratedContentConfigProvider({ value, children }: GeneratedContentProviderProps) {
  return <GeneratedContentConfigContext.Provider value={value}>{children}</GeneratedContentConfigContext.Provider>
}
